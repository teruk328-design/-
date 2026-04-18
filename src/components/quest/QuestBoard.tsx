'use client';

import { useState } from 'react';
import { useGuild } from '@/contexts/GuildContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  ChevronDown,
  Trophy,
  Medal,
} from 'lucide-react';



interface AchievementDetail {
  id: string;
  label: string;
  date?: string;
  type: '依頼' | '授業' | '大会' | 'その他';
}

interface AchievementCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  count: number;
  total: number;
  details: AchievementDetail[];
}
/* ============================================================ */
const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  { id: 'study', label: '勉強', emoji: '🎓', color: '#6366f1', count: 3, total: 5, details: [
      { id: 's1', label: '後輩への数学個別指導依頼を達成', date: '2024-10', type: '依頼' },
      { id: 's2', label: '微分積分学を履修・優', date: '2024-03', type: '授業' },
      { id: 's3', label: '線形代数学を履修・優', date: '2024-09', type: '授業' },
      { id: 's4', label: '統計学入門の家庭教師依頼（未達成）', type: '依頼' },
      { id: 's5', label: '数学オリンピック地方予選参加（未達成）', type: '大会' }]},
  { id: 'design', label: 'デザイン', emoji: '🎨', color: '#f97316', count: 2, total: 4, details: [
      { id: 'd1', label: 'ギルドロゴ制作依頼を達成', date: '2024-05', type: '依頼' },
      { id: 'd2', label: 'UIデザインコンテスト入賞', date: '2024-11', type: '大会' },
      { id: 'd3', label: 'サークルポスターデザイン依頼（未達成）', type: '依頼' },
      { id: 'd4', label: 'Figmaハンズオン参加（未達成）', type: 'その他' }]},
  { id: 'coding', label: 'コーディング', emoji: '💻', color: '#3b82f6', count: 3, total: 5, details: [
      { id: 'c1', label: 'Webサイトリニューアル依頼を達成', date: '2024-11', type: '依頼' },
      { id: 'c2', label: 'ハッカソン2024に参加・チーム賞獲得', date: '2024-09', type: '大会' },
      { id: 'c3', label: 'Webプログラミング基礎を履修', date: '2024-04', type: '授業' },
      { id: 'c4', label: 'モバイルアプリ開発依頼（未達成）', type: '依頼' },
      { id: 'c5', label: 'OSS貢献チャレンジ（未達成）', type: 'その他' }]},
  { id: 'proofreading', label: '添削', emoji: '📝', color: '#10b981', count: 2, total: 4, details: [
      { id: 'pr1', label: 'ES添削依頼を達成', date: '2024-10', type: '依頼' },
      { id: 'pr2', label: '英語レポートの添削依頼を達成', date: '2024-07', type: '依頼' },
      { id: 'pr3', label: '研究論文の文章校正依頼（未達成）', type: '依頼' },
      { id: 'pr4', label: '面接練習のフィードバック依頼（未達成）', type: '依頼' }]},
  { id: 'camera', label: 'カメラマン', emoji: '📷', color: '#ec4899', count: 2, total: 3, details: [
      { id: 'ca1', label: '集合写真撮影依頼を達成', date: '2024-09', type: '依頼' },
      { id: 'ca2', label: '新歓イベントの写真撮影依頼を達成', date: '2024-04', type: '依頼' },
      { id: 'ca3', label: '卒業式の個人撮影依頼（未達成）', type: '依頼' }]},
  { id: 'shopping', label: '買い物代行', emoji: '🛍️', color: '#f59e0b', count: 1, total: 2, details: [
      { id: 'sh1', label: '研究室備品の購入代行依頼を達成', date: '2024-06', type: '依頼' },
      { id: 'sh2', label: 'イベント用消耗品の調達依頼（未達成）', type: '依頼' }]},
  { id: 'transport', label: '運搬', emoji: '🚗', color: '#64748b', count: 1, total: 3, details: [
      { id: 'tr1', label: '荷物の運搬補助依頼を達成', date: '2024-03', type: '依頼' },
      { id: 'tr2', label: 'ゼミ合宿の荷物輸送依頼（未達成）', type: '依頼' },
      { id: 'tr3', label: 'イベント機材の搬入依頼（未達成）', type: '依頼' }]},
  { id: 'translation', label: '翻訳', emoji: '🌐', color: '#06b6d4', count: 1, total: 3, details: [
      { id: 'tl1', label: '案内文書の日英翻訳依頼を達成', date: '2024-08', type: '依頼' },
      { id: 'tl2', label: '研究論文の英訳依頼（未達成）', type: '依頼' },
      { id: 'tl3', label: '海外イベント向けチラシの翻訳（未達成）', type: '依頼' }]},
  { id: 'engineer', label: 'エンジニア', emoji: '⚙️', color: '#8b5cf6', count: 2, total: 4, details: [
      { id: 'en1', label: 'システム構築依頼を達成', date: '2024-07', type: '依頼' },
      { id: 'en2', label: 'ロボコン2024で準優勝', date: '2024-11', type: '大会' },
      { id: 'en3', label: '電子工作ワークショップ講師依頼（未達成）', type: '依頼' },
      { id: 'en4', label: '自動化スクリプト開発（未達成）', type: '依頼' }]},
  { id: 'device', label: 'デバイス', emoji: '🖥️', color: '#94a3b8', count: 2, total: 4, details: [
      { id: 'dv1', label: 'PCセットアップ依頼を達成', date: '2024-05', type: '依頼' },
      { id: 'dv2', label: 'プリンター修理依頼を達成', date: '2024-09', type: '依頼' },
      { id: 'dv3', label: 'スマホ移行依頼（未達成）', type: '依頼' },
      { id: 'dv4', label: 'ソフトウェアインストール支援（未達成）', type: 'その他' }]}
];

/* ============================================================
   実績タイプのスタイル
   ============================================================ */
const TYPE_STYLE: Record<AchievementDetail['type'], { color: string; label: string }> = {
  '依頼': { color: '#3b82f6', label: '📋 依頼' },
  '授業': { color: '#8b5cf6', label: '🎓 授業' },
  '大会': { color: '#f97316', label: '🏆 大会' },
  'その他': { color: '#10b981', label: '🔖 その他' },
};

/* ============================================================
   実績カテゴリカード（アコーディオン）
   ============================================================ */
function AchievementCard({ cat }: { cat: AchievementCategory }) {
  const [open, setOpen] = useState(false);
  const progress = Math.round((cat.count / cat.total) * 100);
  const earnedDetails = cat.details.filter((d) => d.date); // dateがあれば達成済みとみなす
  return (
    <motion.div
      layout
      className="rpg-card overflow-hidden"
      style={open ? { borderColor: `${cat.color}50` } : {}}
    >
      {/* カテゴリヘッダー（クリックで開閉） */}
      <button
        id={`achievement-cat-${cat.id}`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-black/[0.02] transition-colors duration-150"
      >
        {/* アイコン */}
        <div
          className="w-10 h-10 rounded-sm border-2 flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
        >
          {cat.emoji}
        </div>

        {/* ラベル + プログレス */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-sm text-[var(--gold-light)]">{cat.label}</span>
            <span className="text-[11px] font-bold" style={{ color: cat.color }}>
              {cat.count} / {cat.total}
            </span>
          </div>
          {/* 進捗バー */}
          <div className="h-1.5 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${cat.color}, ${cat.color}aa)`,
                boxShadow: `0 0 6px ${cat.color}60`,
              }}
            />
          </div>
        </div>

        {/* 開閉アイコン */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-[var(--gold)]" />
        </motion.div>
      </button>

      {/* 詳細リスト（アコーディオン展開） */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mb-4 rounded-sm border-2 overflow-hidden"
              style={{ border: `1px solid ${cat.color}20`, background: `${cat.color}06` }}
            >
              {cat.details.map((detail, i) => {
                const earned = !!detail.date;
                const typeStyle = TYPE_STYLE[detail.type];

                return (
                  <div
                    key={detail.id}
                    className={`flex items-start gap-3 px-3 py-2.5 ${
                      i < cat.details.length - 1 ? 'border-b border-[var(--border-shade)]' : ''
                    } ${earned ? '' : 'opacity-40'}`}
                  >
                    {/* 達成アイコン */}
                    <div className="flex-shrink-0 mt-0.5">
                      {earned ? (
                        <CheckCircle2 size={14} style={{ color: cat.color }} />
                      ) : (
                        <div
                          className="w-3.5 h-3.5 rounded-full border-2 mt-0.5"
                          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                      )}
                    </div>

                    {/* テキスト */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-snug ${earned ? 'text-[#3e2815]' : 'text-[var(--gold)]'}`}
                      >
                        {detail.label}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px]"
                          style={{ color: typeStyle.color }}
                        >
                          {typeStyle.label}
                        </span>
                        {detail.date && (
                          <span className="text-[10px] text-[#cfbeaf]">{detail.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================================
   クエストボード（メイン）
   ============================================================ */
const CATEGORY_COLORS: Record<string, string> = {
  'みつける': '#3b82f6',
  'たかめる': '#8b5cf6',
  'つながる': '#ef4444',
  'つむぐ': '#10b981',
  'ひらく': '#f97316',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  E: '#94a3b8',
  D: '#10b981',
  C: '#3b82f6',
  B: '#8b5cf6',
  A: '#ef4444',
  S: '#d4af37',
};

export default function QuestBoard() {
  const { quests, completeQuest } = useGuild();

  const totalEarned = ACHIEVEMENT_CATEGORIES.reduce((sum, c) => sum + c.count, 0);
  const totalAll = ACHIEVEMENT_CATEGORIES.reduce((sum, c) => sum + c.total, 0);

  return (
    <section id="quest-board" className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* セクションタイトル */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-sm border-2 bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center">
          <Trophy size={16} className="text-[var(--gold)]" />
        </div>
        <div>
          <h2 className="font-rpg font-bold text-xl text-gold-gradient">Quest Board</h2>
          <p className="text-xs text-[var(--gold)]">実績・クエスト一覧</p>
        </div>
      </div>

      {/* ===== 実績セクション ===== */}
      <div className="mb-10">
        {/* 実績ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Medal size={14} className="text-[var(--gold)]" />
            <h3 className="text-sm font-bold text-[var(--gold-light)]">実績</h3>
          </div>
          <span className="text-xs text-[var(--gold)]">
            <span className="font-bold text-[var(--gold-light)]">{totalEarned}</span> / {totalAll} 達成
          </span>
        </div>

        {/* カテゴリカード一覧（アコーディオン） */}
        <div className="space-y-2">
          {ACHIEVEMENT_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <AchievementCard cat={cat} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== クエスト一覧 ===== */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={14} className="text-[var(--gold)]" />
        <h3 className="text-sm font-bold text-[var(--gold-light)]">受注可能クエスト</h3>
      </div>

      <div className="space-y-3">
        {quests.map((quest, i) => {
          const catColor = CATEGORY_COLORS[quest.category];
          const diffColor = DIFFICULTY_COLORS[quest.difficulty];

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rpg-card p-4 ${quest.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-sm border-2 flex items-center justify-center text-xs font-black mt-0.5"
                  style={{ color: diffColor, background: `${diffColor}20`, border: `1px solid ${diffColor}40` }}
                >
                  {quest.difficulty}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${quest.completed ? 'line-through text-[var(--gold)]' : 'text-[var(--gold-light)]'}`}>
                      {quest.title}
                    </h4>
                    {quest.completed && (
                      <CheckCircle2 size={16} className="text-[var(--xp-green)] flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-xs text-[#cfbeaf] mb-2">{quest.description}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30` }}
                    >
                      {quest.category}
                    </span>
                    <span className="text-[10px] text-[#cfbeaf] flex items-center gap-1">
                      <Star size={9} className="text-[var(--gold)]" />
                      {quest.reward}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--xp-green)] ml-auto">
                      +{quest.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              {!quest.completed && (
                <motion.button
                  id={`quest-accept-${quest.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => completeQuest(quest.id)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-sm border-2 text-xs font-bold transition-all duration-200"
                  style={{
                    background: `${catColor}15`,
                    border: `1px solid ${catColor}30`,
                    color: catColor,
                  }}
                >
                  <Clock size={12} />
                  クエスト達成
                  <ChevronRight size={12} />
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

