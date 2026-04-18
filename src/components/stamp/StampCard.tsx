'use client';

import { useGuild } from '@/contexts/GuildContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, CheckCheck } from 'lucide-react';

/* ============================================================
   マップの座標定義 (0〜100のパーセンテージ)
   ============================================================ */
const MAP_POINTS = [
  { id: 1, x: 10, y: 15 },
  { id: 2, x: 28, y: 35 },
  { id: 3, x: 50, y: 18 },
  { id: 4, x: 75, y: 25 },
  { id: 5, x: 88, y: 50 },
  { id: 6, x: 65, y: 70 },
  { id: 7, x: 40, y: 55 },
  { id: 8, x: 15, y: 75 },
  { id: 9, x: 35, y: 90 },
  { id: 10, x: 80, y: 85 },
];

export default function StampCard() {
  const { stamps, isLoggedIn } = useGuild();
  const stampCount = stamps.filter(Boolean).length;

  // 達成済みのパスを描画するための座標群
  const completedPointsStr = MAP_POINTS.slice(0, Math.max(1, stampCount))
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
    
  // 全体のパス
  const allPointsStr = MAP_POINTS.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <section id="stamp-card" className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* タイトル */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-sm border-2 bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center">
          <Map size={16} className="text-[var(--gold)]" />
        </div>
        <div>
          <h2 className="font-rpg font-bold text-xl text-gold-gradient">Adventure Map</h2>
          <p className="text-xs text-[var(--gold)]">旅の軌跡（スタンプカード）</p>
        </div>
      </div>

      <div className="rpg-card p-6 parchment-border relative overflow-hidden" style={{ minHeight: '400px' }}>
        
        {/* レトロな地図の背景テクスチャ */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, #000 120%)' }} />

        {/* 進捗テキスト */}
        <div className="relative z-10 flex items-center justify-between mb-8 bg-black/40 backdrop-blur-md p-3 rounded-sm border-2 border border-[var(--gold)]/20 inline-block w-full">
          <span className="text-sm text-[#dfd8c8]">
            {stampCount === 10 ? (
              <span className="flex items-center gap-1 text-[var(--gold)] font-bold">
                <CheckCheck size={16} />
                旅の目的地に到達！
              </span>
            ) : (
              <>
                次の拠点まで あと <span className="font-bold text-[var(--gold)]">1</span> 歩
              </>
            )}
          </span>
          <span className="font-rpg text-xs text-[var(--gold)]">
            {stampCount} / 10
          </span>
        </div>

        {/* =========================================
            マップエリア (SVGパス + HTMLポイント)
            ========================================= */}
        <div className="relative w-full h-[320px] sm:h-[400px] mt-4">
          
          {/* 背景パス (SVG) */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* 未踏の道 (破線) */}
            <polyline
              points={allPointsStr}
              fill="none"
              stroke="rgba(212, 175, 55, 0.2)"
              strokeWidth="1.5"
              strokeDasharray="2, 2"
              vectorEffect="non-scaling-stroke"
            />
            {/* 踏破した道 (光る実線) */}
            {stampCount > 1 && (
              <polyline
                points={completedPointsStr}
                fill="none"
                stroke="var(--gold)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                style={{ filter: 'drop-shadow(0 0 4px var(--gold))' }}
              />
            )}
          </svg>

          {/* 各チェックポイント (絶対配置) */}
          {MAP_POINTS.map((point, i) => {
            const isStamped = stamps[i];
            const isCurrent = i === stampCount; // 次に押す場所
            const isLast = i === MAP_POINTS.length - 1;

            return (
              <motion.div
                key={point.id}
                className="absolute"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={false}
              >
                {/* 拠点アイコン */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-500
                    ${isLast ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-8 h-8 sm:w-10 sm:h-10'}
                  `}
                >
                  <div
                    className={`absolute inset-0 rounded-full border-2 
                      ${isStamped ? 'bg-[#1a140d] border-[var(--gold)]' : 'bg-[#0f0a05] border-[var(--border-outer)]'}
                      ${isCurrent ? 'pulse-gold border-[var(--gold-light)]' : ''}
                    `}
                    style={{
                      boxShadow: isStamped ? '0 0 10px var(--gold-glow)' : 'none',
                    }}
                  />
                  
                  {/* 中身 */}
                  <AnimatePresence mode="popLayout">
                    {isStamped ? (
                      <motion.div
                        key="stamped"
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        className={`font-rpg text-[var(--gold)] font-bold text-shadow-glow ${isLast ? 'text-2xl' : 'text-lg'}`}
                      >
                        {isLast ? '👑' : '⭐'}
                      </motion.div>
                    ) : (
                      <motion.span
                        key="empty"
                        className={`font-rpg text-[#cfbeaf] font-bold ${isLast ? 'text-lg' : 'text-xs'}`}
                      >
                        {isLast ? 'GOAL' : point.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* コンプリートメッセージ */}
        <AnimatePresence>
          {stampCount === 10 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-sm border-2 text-center bg-[var(--gold)]/10 border border-[var(--gold)]/30 backdrop-blur-sm"
            >
              <p className="text-base font-bold text-[var(--gold)]">🎉 全ての踏破を達成！「開拓者」の証を授かる…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ログイン促進 */}
        {!isLoggedIn && (
          <p className="text-center text-xs text-[var(--gold)] mt-8 relative z-10">
            冒険の記録を残すには、ヘッダーからログインせよ
          </p>
        )}
      </div>
    </section>
  );
}

