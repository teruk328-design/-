'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Copy, CheckCircle, Scroll } from 'lucide-react';
import { useGuild } from '@/contexts/GuildContext';

const SKILL_OPTIONS = [
  '勉強・添削', 'デザイン', 'コーディング', 'カメラマン',
  '動画編集', '翻訳', '買い物代行', '運搬',
  'エンジニアリング', 'その他',
];

export default function QuestCompleteModal({ onClose }: { onClose: () => void }) {
  const { member } = useGuild();
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [evalUrl, setEvalUrl] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !skill) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quest_title: title,
          quest_description: description,
          skill_name: skill,
        }),
      });
      const data = await res.json();
      if (data.evaluation_url) {
        setEvalUrl(data.evaluation_url);
        setStep('result');
      } else {
        alert(data.error || 'エラーが発生しました');
      }
    } catch {
      alert('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(evalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景オーバーレイ */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <motion.div
        className="relative w-full max-w-md rounded-sm z-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: 'rgba(20,10,0,0.98)',
          border: '1px solid rgba(139,115,85,0.5)',
          boxShadow: '0 0 60px rgba(139,115,85,0.2)',
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(139,115,85,0.3)]">
          <div className="flex items-center gap-2">
            <Scroll size={16} className="text-[#f59e0b]" />
            <h2 className="font-rpg text-sm tracking-widest text-[#cfbeaf]">クエスト完了を報告</h2>
          </div>
          <button onClick={onClose} className="text-[#8b7355] hover:text-[#cfbeaf] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
              >
                <p className="text-xs text-[#8b7355] mb-4">
                  Discordで受けたクエストの完了を報告します。
                  完了後、依頼者に評価URLを送ってください。
                </p>

                {/* クエスト名 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfbeaf] block mb-1">
                    クエスト名 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: レポート添削をお願いします"
                    required
                    className="w-full rounded-sm px-3 py-2 text-sm outline-none"
                    style={{
                      background: 'rgba(139,115,85,0.1)',
                      border: '1px solid rgba(139,115,85,0.3)',
                      color: '#cfbeaf',
                    }}
                  />
                </div>

                {/* 説明 */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfbeaf] block mb-1">
                    クエスト内容（任意）
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="どんな依頼だったか簡単に..."
                    rows={2}
                    className="w-full rounded-sm px-3 py-2 text-sm resize-none outline-none"
                    style={{
                      background: 'rgba(139,115,85,0.1)',
                      border: '1px solid rgba(139,115,85,0.3)',
                      color: '#cfbeaf',
                    }}
                  />
                </div>

                {/* 関連スキル */}
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

                <button
                  type="submit"
                  disabled={loading || !title || !skill}
                  className="w-full py-2.5 rounded-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'rgba(245,158,11,0.8)',
                    color: '#1a0f00',
                    opacity: loading || !title || !skill ? 0.5 : 1,
                  }}
                >
                  <Send size={14} />
                  {loading ? '処理中...' : '報告して評価URLを発行'}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-black text-[#cfbeaf] mb-1">完了報告しました！</h3>
                <p className="text-xs text-[#8b7355] mb-5">
                  以下のURLを依頼者に送ってください。
                  URLを開くと評価フォームが表示されます。
                </p>

                <div
                  className="rounded-sm p-3 mb-4 text-left"
                  style={{ background: 'rgba(139,115,85,0.1)', border: '1px solid rgba(139,115,85,0.3)' }}
                >
                  <p className="text-[10px] text-[#8b7355] mb-1">評価URL</p>
                  <p className="text-xs text-[#cfbeaf] break-all font-mono">{evalUrl}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full py-2.5 rounded-sm font-bold flex items-center justify-center gap-2 mb-3 transition-all"
                  style={{
                    background: copied ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.8)',
                    color: copied ? '#10b981' : '#1a0f00',
                    border: copied ? '1px solid #10b981' : 'none',
                  }}
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'コピーしました！' : 'URLをコピー'}
                </button>

                <button
                  onClick={onClose}
                  className="text-xs text-[#8b7355] hover:text-[#cfbeaf] transition-colors"
                >
                  閉じる
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
