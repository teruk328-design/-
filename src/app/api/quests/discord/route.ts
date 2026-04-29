import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const CHANNEL_ID = process.env.DISCORD_FORUM_CHANNEL_ID;
  const GUILD_ID = process.env.DISCORD_GUILD_ID;

  if (!BOT_TOKEN || !CHANNEL_ID || !GUILD_ID) {
    return NextResponse.json({ error: 'Discord configuration missing' }, { status: 500 });
  }

  try {
    // 1. フォーラムチャンネルの情報を取得（タグ名を取得するため）
    const channelRes = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const channelData = await channelRes.json();
    const tagMap: Record<string, string> = {};
    if (channelData.available_tags) {
      channelData.available_tags.forEach((tag: any) => {
        tagMap[tag.id] = tag.name;
      });
    }

    // 2. アクティブなスレッド（クエスト）を取得 (guilds/:id/threads/active を使用)
    const threadsRes = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/threads/active`,
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 60 }, // 1分間キャッシュ
      }
    );

    if (!threadsRes.ok) {
      throw new Error(`Discord API error: ${threadsRes.status}`);
    }

    const threadsData = await threadsRes.json();
    const forumThreads = (threadsData.threads || []).filter((t: any) => t.parent_id === CHANNEL_ID);

    // 3. 各スレッドの最初のメッセージを取得し、ギルドのクエスト形式に変換
    const quests = await Promise.all(forumThreads.map(async (thread: any) => {
      // 最初のタグをカテゴリーとして使用
      const categoryTagId = thread.applied_tags?.[0];
      const categoryName = categoryTagId && tagMap[categoryTagId] ? tagMap[categoryTagId] : 'その他';

      // メッセージを取得して詳細(description)と報酬(reward)にする
      let description = `Discordフォーラムで詳細を確認してください。`;
      let reward = '報酬あり';
      try {
        // 最近のメッセージをいくつか取得して報酬を探す
        const msgsRes = await fetch(`https://discord.com/api/v10/channels/${thread.id}/messages?limit=5`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });
        if (msgsRes.ok) {
          const msgs = await msgsRes.json();
          if (Array.isArray(msgs) && msgs.length > 0) {
            // スターターポスト（スレッドIDと同じIDのメッセージ）を探す
            const starter = msgs.find((m: any) => m.id === thread.id) || msgs[msgs.length - 1];
            if (starter && starter.content) {
              description = starter.content.length > 100 ? starter.content.substring(0, 100) + '...' : starter.content;
            }

            // 全メッセージから「報酬:」というパターンを探す（新しいもの優先）
            for (const m of msgs) {
              const match = m.content.match(/報酬[:：]\s*([^\n]+)/i) || m.content.match(/Reward[:：]\s*([^\n]+)/i);
              if (match) {
                reward = match[1].trim();
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch thread messages:', err);
      }

      return {
        id: thread.id,
        title: thread.name,
        description: description,
        category: categoryName,
        difficulty: 'C', // デフォルト
        reward: reward,
        completed: false,
        link: `https://discord.com/channels/${GUILD_ID}/${thread.id}`,
      };
    }));

    return NextResponse.json(quests);
  } catch (error: any) {
    console.error('Discord fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
