'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface QuestCompletion {
  id: string;
  member_name: string;
  quest_title: string;
  quest_description: string | null;
  skill_name: string;
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="mb-5">
      <p className="text-sm font-bold text-[#cfbeaf] mb-2">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
            aria-label={`${n}点`}
          >
            <Star
              size={32}
              fill={(hovered || value) >= n ? '#f59e0b' : 'none'}
              stroke={(hovered || value) >= n ? '#f59e0b' : '#8b7355'}
              strokeWidth={1.5}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-[#f59e0b] font-bold self-center">
            {value}/5
          </span>
        )}
      </div>
    </div>
  );
}

export default function EvaluatePage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState('');
  const [quest, setQuest] = useState<QuestCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [ratingSpeed, setRatingSpeed] = useState(0);
  const [ratingQuality, setRatingQuality] = useState(0);
  const [ratingComm, setRatingComm] = useState(0);
  const [wouldRequest, setWouldRequest] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    params.then(({ token: t }) => {
      setToken(t);
      fetch(`/api/quests/evaluate/${t}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setQuest(data);
        })
        .catch(() => setError('読み込みに失敗しました'))
        .finally(() => setLoading(false));
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingSpeed || !ratingQuality || !ratingComm || wouldRequest === null) {
      alert('すべての必須項目を入力してください');
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/quests/evaluate/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating_speed: ratingSpeed,
        rating_quality: ratingQuality,
        rating_communication: ratingComm,
        would_request_again: wouldRequest,
        comment,
      }),
    });
    const data = await res.json();
    if (data.success) setSubmitted(true);
    else setError(data.error || '送信に失敗しました');
    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-base, #1a0f00)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <p className="font-rpg text-[10px] tracking-[0.4em] text-[#8b7355] mb-2 uppercase">
            Quest Evaluation
          </p>
          <h1 className="text-2xl font-black text-[#cfbeaf]">クエスト評価フォーム</h1>
        </div>

        {/* カード */}
        <div
          className="rounded-sm p-6 md:p-8"
          style={{
            background: 'rgba(30,15,0,0.95)',
            border: '1px solid rgba(139,115,85,0.4)',
            boxShadow: '0 0 40px rgba(139,115,85,0.1)',
          }}
        >
          {loading && (
            <p className="text-center text-[#8b7355] animate-pulse py-8">読み込み中...</p>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-4 py-8">
              <AlertCircle size={48} className="text-red-400" />
              <p className="text-red-400 font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && submitted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <CheckCircle size={56} className="text-emerald-400" />
              <h2 className="text-xl font-black text-[#cfbeaf]">評価を送信しました！</h2>
              <p className="text-sm text-[#8b7355]">
                フィードバックありがとうございます。
                <br />
                冒険者の成長に貢献しました。
              </p>
            </motion.div>
          )}

          {!loading && !error && !submitted && quest && (
            <form onSubmit={handleSubmit}>
              {/* クエスト情報 */}
              <div
                className="rounded-sm p-4 mb-6"
                style={{ background: 'rgba(139,115,85,0.1)', border: '1px solid rgba(139,115,85,0.3)' }}
              >
                <p className="text-[10px] text-[#8b7355] font-bold tracking-widest mb-1 uppercase">
                  完了クエスト
                </p>
                <h2 className="text-lg font-black text-[#cfbeaf] mb-1">{quest.quest_title}</h2>
                {quest.quest_description && (
                  <p className="text-xs text-[#8b7355] mb-2">{quest.quest_description}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                  >
                    🛡 {quest.member_name}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
                  >
                    ⚡ {quest.skill_name}
                  </span>
                </div>
              </div>

              {/* Q1〜Q3: ★評価 */}
              <StarRating label="Q1. 対応の速さ" value={ratingSpeed} onChange={setRatingSpeed} />
              <StarRating label="Q2. 作業のクオリティ" value={ratingQuality} onChange={setRatingQuality} />
              <StarRating label="Q3. コミュニケーション" value={ratingComm} onChange={setRatingComm} />

              {/* Q4: また頼みたい */}
              <div className="mb-5">
                <p className="text-sm font-bold text-[#cfbeaf] mb-2">Q4. また依頼したいですか？</p>
                <div className="flex gap-3">
                  {[
                    { label: '✓ はい', value: true },
                    { label: '✗ いいえ', value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => setWouldRequest(value)}
                      className="flex-1 py-2 rounded-sm font-bold text-sm transition-all"
                      style={{
                        background: wouldRequest === value ? 'rgba(245,158,11,0.3)' : 'rgba(139,115,85,0.1)',
                        border: `1px solid ${wouldRequest === value ? '#f59e0b' : 'rgba(139,115,85,0.3)'}`,
                        color: wouldRequest === value ? '#f59e0b' : '#8b7355',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: コメント */}
              <div className="mb-6">
                <p className="text-sm font-bold text-[#cfbeaf] mb-2">Q5. コメント（任意）</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="ひとこと感想を書いてください..."
                  rows={3}
                  className="w-full rounded-sm px-3 py-2 text-sm resize-none outline-none"
                  style={{
                    background: 'rgba(139,115,85,0.1)',
                    border: '1px solid rgba(139,115,85,0.3)',
                    color: '#cfbeaf',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: submitting ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.8)',
                  color: '#1a0f00',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                <Send size={16} />
                {submitting ? '送信中...' : '評価を送信する'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-[#4a3520] mt-6">九大ギルド 評価システム</p>
      </motion.div>
    </div>
  );
}
