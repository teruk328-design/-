import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  console.log('Webhook URL exists:', !!webhookUrl);
  
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not defined in environment variables');
    return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
  }

  try {
    const { message, userName, avatarUrl } = await req.json();

    const payload = {
      username: '拠点受付 (Guild Master)',
      avatar_url: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/map-pin.svg', // 適当なアイコン
      embeds: [
        {
          title: '🔔 拠点チェックイン通知',
          description: message || `**${userName}** が拠点に到着しました！`,
          color: 0xf59e0b, // ゴールド色
          timestamp: new Date().toISOString(),
          footer: {
            text: '九大ギルド 拠点管理システム',
          },
          thumbnail: {
            url: avatarUrl || '',
          },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notification error:', err);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
