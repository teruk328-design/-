import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: '未ログインです' }, { status: 401 });
  }

  const body = await req.json();
  const { quest_title, quest_description, skill_name } = body;

  if (!quest_title || !skill_name) {
    return NextResponse.json({ error: 'クエスト名とスキルは必須です' }, { status: 400 });
  }

  const discordId = (session.user as any).id || session.user.email || '';
  const memberName = session.user.name || '冒険者';
  const token = randomBytes(24).toString('hex');

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('quest_completions')
    .insert({
      member_discord_id: discordId,
      member_name: memberName,
      quest_title,
      quest_description: quest_description || null,
      skill_name,
      evaluation_token: token,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'DBエラーが発生しました' }, { status: 500 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return NextResponse.json({
    success: true,
    evaluation_url: `${baseUrl}/evaluate/${token}`,
    completion: data,
  });
}
