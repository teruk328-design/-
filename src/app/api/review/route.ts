import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { randomBytes } from 'crypto';

// 依頼者が直接評価を送信する（ワンステップ）
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    member_name,
    quest_title,
    quest_description,
    skill_name,
    rating_speed,
    rating_quality,
    rating_communication,
    would_request_again,
    comment,
  } = body;

  if (!member_name || !quest_title || !skill_name || !rating_speed || !rating_quality || !rating_communication) {
    return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const token = randomBytes(24).toString('hex');

  // クエスト完了記録を作成
  const { data: completion, error: completionError } = await supabase
    .from('quest_completions')
    .insert({
      member_discord_id: 'unknown', // 依頼者フォームからは Discord ID 不明
      member_name,
      quest_title,
      quest_description: quest_description || null,
      skill_name,
      evaluation_token: token,
      evaluated: true, // 即評価済み
    })
    .select()
    .single();

  if (completionError) {
    console.error('Completion insert error:', completionError);
    return NextResponse.json({ error: 'DBエラーが発生しました' }, { status: 500 });
  }

  // 評価を保存
  const { error: evalError } = await supabase.from('evaluations').insert({
    quest_completion_id: completion.id,
    rating_speed,
    rating_quality,
    rating_communication,
    would_request_again,
    comment: comment || null,
  });

  if (evalError) {
    console.error('Evaluation insert error:', evalError);
    return NextResponse.json({ error: '評価の保存に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
