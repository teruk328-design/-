'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuild } from '@/contexts/GuildContext';
import {
  Shield,
  Sword,
  Wrench,
  Compass,
  Crown,
  Star,
  Zap,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import type { Rank } from '@/contexts/GuildContext';

/* ============================================================
   役職設定
   ============================================================ */
const RANK_CONFIG: Record<
  Rank,
  { color: string; borderColor: string; glowColor: string; icon: React.ReactNode; bg: string }
> = {
  '旅人': {
    color: '#94a3b8',
    borderColor: 'rgba(148, 163, 184, 0.5)',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    bg: 'from-slate-900 to-slate-800',
    icon: <Compass size={40} strokeWidth={1.5} />,
  },
  '職人': {
    color: '#3b82f6',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    bg: 'from-blue-950 to-slate-900',
    icon: <Wrench size={40} strokeWidth={1.5} />,
  },
  '冒険者': {
    color: '#8b5cf6',
    borderColor: 'rgba(139, 92, 246, 0.5)',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    bg: 'from-purple-950 to-slate-900',
    icon: <Sword size={40} strokeWidth={1.5} />,
  },
  '開拓者': {
    color: '#d4af37',
    borderColor: 'rgba(212, 175, 55, 0.5)',
    glowColor: 'rgba(212, 175, 55, 0.3)',
    bg: 'from-yellow-950 to-slate-900',
    icon: <Crown size={40} strokeWidth={1.5} />,
  },
};

/* ============================================================
   カードの表（Front）
   ============================================================ */
function CardFront() {
  const { member } = useGuild();
  const config = RANK_CONFIG[member.rank];
  const xpPercent = Math.round((member.xp / member.maxXp) * 100);

  return (
    <div
      className="absolute inset-0 rounded-md border-4 overflow-hidden"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        background: `linear-gradient(135deg, var(--bg-card), #0a1020)`,
        border: `1px solid ${config.borderColor}`,
        boxShadow: `0 0 30px ${config.glowColor}, inset 0 0 30px rgba(0,0,0,0.3)`,
      }}
    >
      {/* 上部グラデーションバー */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${config.bg}`}
        style={{ background: `linear-gradient(90deg, ${config.color}, transparent)` }}
      />

      {/* ドットグリッド背景 */}
      <div className="absolute inset-0 bg-dot-grid opacity-40" />

      {/* コンテンツ */}
      <div className="relative h-full p-6 flex flex-col">
        {/* ヘッダ部 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-rpg text-[10px] tracking-[0.3em] uppercase opacity-60 mb-0.5">
              Guild Member Card
            </p>
            <p className="font-rpg text-xs tracking-widest" style={{ color: config.color }}>
              九大ギルド
            </p>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              color: config.color,
              border: `1px solid ${config.borderColor}`,
              background: `${config.glowColor}`,
            }}
          >
            <Shield size={10} />
            {member.rank}
          </div>
        </div>

        {/* キャラクターアイコン + 名前 */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-sm border-2 flex items-center justify-center flex-shrink-0 relative"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${config.glowColor}, rgba(0,0,0,0.5))`,
              border: `1px solid ${config.borderColor}`,
            }}
          >
            <div style={{ color: config.color }}>{config.icon}</div>
            {/* レベルバッジ */}
            <div
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: config.color,
                color: '#050a14',
              }}
            >
              {member.level}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black truncate text-[var(--gold-light)]">{member.name}</h2>
            <p className="text-xs text-[#cfbeaf] mt-0.5">
              ID: {member.id} ﾂｷ {member.joinDate}
            </p>
          </div>
        </div>

        {/* XPバー */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1 text-[11px] text-[#cfbeaf]">
              <Zap size={11} className="text-[var(--xp-green)]" />
              <span>経験値</span>
            </div>
            <span className="text-[11px] font-bold" style={{ color: config.color }}>
              {member.xp} / {member.maxXp} XP
            </span>
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <p className="text-[10px] text-[var(--gold)] mt-1 text-right">
            次のレベルまで {member.maxXp - member.xp} XP
          </p>
        </div>

        {/* スキルプレビュー（上位3件） */}
        <div className="mt-auto">
          <div className="flex items-center gap-1 text-[10px] text-[var(--gold)] mb-2">
            <TrendingUp size={10} />
            <span>TOP SKILLS</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {member.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.name}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  color: skill.color,
                  background: `${skill.color}20`,
                  border: `1px solid ${skill.color}40`,
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* フリップヒント */}
        <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-[#cfbeaf]">
          <ChevronRight size={10} />
          <span>クリックでスキル詳細</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   カードの裏（Back）
   ============================================================ */
function CardBack() {
  const { member } = useGuild();
  const config = RANK_CONFIG[member.rank];

  return (
    <div
      className="absolute inset-0 rounded-md border-4 overflow-hidden"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        background: `linear-gradient(135deg, #0a1020, var(--bg-card))`,
        border: `1px solid ${config.borderColor}`,
        boxShadow: `0 0 30px ${config.glowColor}`,
      }}
    >
      {/* ドットグリッド背景 */}
      <div className="absolute inset-0 bg-dot-grid opacity-30" />

      <div className="relative h-full p-6 flex flex-col">
        {/* タイトル */}
        <div className="flex items-center gap-2 mb-4">
          <Star size={14} style={{ color: config.color }} />
          <h3 className="font-rpg text-xs tracking-widest uppercase" style={{ color: config.color }}>
            Skill Profile
          </h3>
        </div>

        <p className="text-[11px] text-[var(--gold)] mb-4">{member.name} の習得スキル一覧</p>

        {/* スキル一覧 (グリッド表示) */}
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
          {member.skills.map((skill, i) => (
            <div key={skill.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-medium text-[var(--gold-light)]">{skill.name}</span>
                <span className="text-[10px] font-bold" style={{ color: skill.color }}>
                  Lv.{skill.level}
                </span>
              </div>
              <div className="xp-bar h-1.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${skill.color}, ${skill.color}aa)`,
                    boxShadow: `0 0 6px ${skill.color}60`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ギルドID */}
        <div
          className="mt-4 p-3 rounded-sm border-2 text-center"
          style={{ background: `${config.glowColor}`, border: `1px solid ${config.borderColor}` }}
        >
          <p className="font-rpg text-[10px] tracking-widest opacity-60 mb-0.5">GUILD ID</p>
          <p className="text-sm font-black font-mono tracking-wider" style={{ color: config.color }}>
            {member.id.toUpperCase()}
          </p>
        </div>

        {/* フリップヒント */}
        <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-[#cfbeaf]">
          <ChevronRight size={10} />
          <span>クリックで戻る</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   3Dフリップ会員証（メインコンポーネント）
   ============================================================ */
export default function MemberCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { member } = useGuild();
  const config = RANK_CONFIG[member.rank];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* カード本体 */}
      <div
        className="w-full max-w-sm cursor-pointer select-none"
        onClick={() => setIsFlipped((f) => !f)}
        style={{ height: '380px', perspective: '1000px' }}
        id="member-card"
        role="button"
        aria-label="会員証をフリップ"
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <CardFront />
          <CardBack />
        </motion.div>
      </div>

      {/* フリップインジケーター */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsFlipped(false)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            !isFlipped ? 'w-6' : 'opacity-40'
          }`}
          style={{ background: config.color }}
          aria-label="表面へ"
        />
        <button
          onClick={() => setIsFlipped(true)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isFlipped ? 'w-6' : 'opacity-40'
          }`}
          style={{ background: config.color }}
          aria-label="裏面へ"
        />
      </div>
    </div>
  );
}

