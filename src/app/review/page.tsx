'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';

const SKILL_OPTIONS = [
  '勉強', 'デザイン', 'コーディング', '添削',
  'イベントスタッフ', '運搬', '翻訳',
  'エンジニア・デバイス', '生活', 'その他',
];

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="mb-5">
      <p className="text-sm font-bold text-[#cfbeaf] mb-2">{label} <span className="text-red-400">*</span></p>
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
        {value > 0 && <span className="ml-2 text-sm text-[#f59e0b] font-bold self-center">{value}/5</span>}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [memberName, setMemberName] = useState('');
  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  const [skill, setSkill] = useState('');
  const [ratingSpeed, setRatingSpeed] = useState(0);
  const [ratingQuality, setRatingQuality] = useState(0);
  const [ratingComm, setRatingComm] = useState(0);
  const [wouldRequest, setWouldRequest] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !questTitle || !skill || !ratingSpeed || !ratingQuality || !ratingComm || wouldRequest === null) {
      alert('すべての必須項目を入力してください');
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_name: memberName,
        quest_title: questTitle,
        quest_description: questDesc,
        skill_name: skill,
        rating_speed: ratingSpeed,
        rating_quality: ratingQuality,
        rating_communication: ratingComm,
        would_request_again: wouldRequest,
        comment,
      }),
    });
    const data = await res.json();
    if (data.success) setSubmitted(true);
    else alert(data.error || '送信に失敗しました');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base, #1a0f00)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <p className="font-rpg text-[10px] tracking-[0.4em] text-[#8b7355] mb-2 uppercase">Quest Review</p>
          <h1 className="text-2xl font-black text-[#cfbeaf]">冒険者を評価する</h1>
          <p className="text-xs text-[#8b7355] mt-2">クエストを依頼した方はこちらから評価を送ってください</p>
        </div>

        <div
          className="rounded-sm p-6 md:p-8"
          style={{
            background: 'rgba(30,15,0,0.95)',
            border: '1px solid rgba(139,115,85,0.4)',
            boxShadow: '0 0 40px rgba(139,115,85,0.1)',
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <CheckCircle size={56} className="text-emerald-400" />
                <h2 className="text-xl font-black text-[#cfbeaf]">評価を送信しました！</h2>
                <p className="text-sm text-[#8b7355]">
                  フィードバックありがとうございます。<br />
                  冒険者の成長に貢献しました。
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
                {/* 冒険者名 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfbeaf] block mb-1">
                    依頼した冒険者の名前 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="例: KAWANO_TERUYUKI"
                    required
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{ background: 'rgba(139,115,85,0.1)', border: '1px solid rgba(139,115,85,0.3)', color: '#cfbeaf' }}
                  />
                </div>

                {/* クエスト名 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfbeaf] block mb-1">
                    クエスト名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
                    placeholder="例: レポート添削をお願いします"
                    required
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{ background: 'rgba(139,115,85,0.1)', border: '1px solid rgba(139,115,85,0.3)', color: '#cfbeaf' }}
                  />
                </div>

                {/* 内容（任意） */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfbeaf] block mb-1">クエスト内容（任意）</label>
                  <textarea
                    value={questDesc}
                    onChange={(e) => setQuestDesc(e.target.value)}
                    placeholder="どんな依頼だったか..."
                    rows={2}
                    className="w-full rounded-sm px-3 py-2 text-sm resize-none outline-none"
                    style={{ background: 'rgba(139,115,85,0.1)', border: '1px solid rgba(139,115,85,0.3)', color: '#cfbeaf' }}
                  />
                </div>

                {/* スキル */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-[#cfbeaf] block mb-1">
                    使ったスキル <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    required
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{
                      background: 'rgba(139,115,85,0.1)',
                      border: '1px solid rgba(139,115,85,0.3)',
                      color: skill ? '#cfbeaf' : '#8b7355',
                    }}
                  >
                    <option value="" disabled>スキルを選択...</option>
                    {SKILL_OPTIONS.map((s) => (
                      <option key={s} value={s} style={{ background: '#1a0f00' }}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-[rgba(139,115,85,0.2)] pt-5 mb-1">
                  <p className="text-[10px] text-[#8b7355] tracking-widest uppercase mb-4">評価アンケート</p>
                </div>

                <StarRating label="Q1. 対応の速さ" value={ratingSpeed} onChange={setRatingSpeed} />
                <StarRating label="Q2. 作業のクオリティ" value={ratingQuality} onChange={setRatingQuality} />
                <StarRating label="Q3. コミュニケーション" value={ratingComm} onChange={setRatingComm} />

                {/* また依頼したい？ */}
                <div className="mb-5">
                  <p className="text-sm font-bold text-[#cfbeaf] mb-2">Q4. また依頼したいですか？ <span className="text-red-400">*</span></p>
                  <div className="flex gap-3">
                    {[{ label: '✓ はい', value: true }, { label: '✗ いいえ', value: false }].map(({ label, value }) => (
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

                {/* コメント */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-[#cfbeaf] mb-2">Q5. コメント（任意）</p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="ひとこと感想を..."
                    rows={3}
                    className="w-full rounded-sm px-3 py-2 text-sm resize-none outline-none"
                    style={{ background: 'rgba(139,115,85,0.1)', border: '1px solid rgba(139,115,85,0.3)', color: '#cfbeaf' }}
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
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        <p className="text-center text-[10px] text-[#4a3520] mt-6">九大ギルド 評価システム</p>
      </motion.div>
    </div>
  );
}
