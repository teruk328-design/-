import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const supabase = createAdminClient();

  // 直近の実績（クエスト完了＋評価）を取得
  const { data, error } = await supabase
    .from('quest_completions')
    .select(`
      *,
      evaluations (*)
    `)
    .ilike('member_name', name)
    .order('completed_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Fetch achievements error:', error);
    return NextResponse.json({ error: '実績の取得に失敗しました' }, { status: 500 });
  }

  return NextResponse.json(data);
}
