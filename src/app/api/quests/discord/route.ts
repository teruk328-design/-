import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const CHANNEL_ID = process.env.DISCORD_FORUM_CHANNEL_ID;

  if (!BOT_TOKEN || !CHANNEL_ID) {
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

    // 2. アクティブなスレッド（クエスト）を取得
    const threadsRes = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/threads/active`,
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 60 }, // 1分間キャッシュ
      }
    );

    if (!threadsRes.ok) {
      throw new Error(`Discord API error: ${threadsRes.status}`);
    }

    const threadsData = await threadsRes.json();

    // 3. ギルドのクエスト形式に変換
    const quests = (threadsData.threads || []).map((thread: any) => {
      // 最初のタグをカテゴリーとして使用
      const categoryTagId = thread.applied_tags?.[0];
      const categoryName = categoryTagId ? tagMap[categoryTagId] : 'その他';

      // 難易度や報酬などはスレッドの情報からは取れないため、
      // 今回は固定値、またはタイトルから推測する形にします
      return {
        id: thread.id,
        title: thread.name,
        description: `Discordフォーラムで詳細を確認してください。依頼者: ${thread.owner_id}`,
        category: categoryName,
        difficulty: 'C', // デフォルト
        reward: '報酬あり',
        xp: 100,
        completed: false,
      };
    });

    return NextResponse.json(quests);
  } catch (error: any) {
    console.error('Discord fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
