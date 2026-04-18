'use client';

import { motion } from 'framer-motion';
import { Sword, Users, Star, Zap } from 'lucide-react';
import MemberCard from '@/components/member/MemberCard';
import QuestBoard from '@/components/quest/QuestBoard';
import StampCard from '@/components/stamp/StampCard';
import Gacha from '@/components/gacha/Gacha';
import QRScanner from '@/components/qr/QRScanner';

/* ============================================================
   ヒーローセクション
   ============================================================ */
function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* 背景エフェクト (ソリッドなレトロ背景に合わせてシンプルに) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* レトロなドット柄や罫線風の装飾をCSSのみで表現 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 20 0 L 0 20\' fill=\'none\' stroke=\'%23593c22\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-30 mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* レトロな看板風バッジ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-6 py-2 mb-8 text-xs font-bold tracking-widest bg-[var(--bg-card)] border-4 border-[var(--border-outer)] shadow-[inset_0_0_0_2px_var(--border-inner),4px_4px_0_rgba(0,0,0,0.2)]"
          style={{ color: 'var(--gold-dark)' }}
        >
          <Star size={12} fill="currentColor" />
          九州大学 冒険者ギルド
          <Star size={12} fill="currentColor" />
        </motion.div>

        {/* タイトル */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-rpg font-black text-5xl sm:text-6xl md:text-7xl leading-tight mb-6 tracking-wider"
        >
          {/* 画像風の「白テキスト＋太いこげ茶フチ」 */}
          <span className="text-rpg-title">
            九大ギルド
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#cfbeaf] text-base sm:text-lg mb-10 leading-relaxed font-bold"
          style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}
        >
          みつける・たかめる・つながる・つむぐ・ひらく<br />
          <span className="text-[var(--gold-light)] bg-[var(--border-outer)] inline-block px-3 py-1 mt-3 border-2 border-[var(--border-shade)] shadow-[2px_2px_0_rgba(0,0,0,0.5)] rounded-sm text-sm font-normal">
            汝、大志を抱く者よ。この扉は常に開かれている。
          </span>
        </motion.p>

        {/* ステータスバー (厚い枠のパネル) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          {[
            { icon: <Users size={14} />, label: '集いし勇者', value: '42' },
            { icon: <Sword size={14} />, label: '踏破クエスト', value: '128' },
            { icon: <Zap size={14} />, label: 'ギルド貢献度', value: '48,200' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-2.5 rpg-card bg-[var(--bg-card)]"
            >
              <div className="w-8 h-8 flex items-center justify-center relative bg-[var(--bg-base)] border-2 border-[var(--border-shade)] shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)]">
                <div className="relative text-[var(--gold-dark)]" style={{ zIndex: 1 }}>{stat.icon}</div>
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[var(--gold-dark)] font-bold">{stat.label}</span>
                <span className="font-bold text-[var(--gold-light)] font-rpg tracking-wider text-base" style={{ textShadow: '1px 1px 0 #000' }}>{stat.value}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   会員証セクション
   ============================================================ */
function MemberSection() {
  return (
    <section className="relative px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* 会員証 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-auto lg:flex-shrink-0"
          >
            <MemberCard />
          </motion.div>

          {/* サイドテキスト */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 text-center lg:text-left rpg-card p-6 border-4"
          >
            <p className="font-rpg text-xs tracking-widest text-[var(--gold-dark)] mb-2 uppercase font-bold">
              Member Card
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--gold-light)] mb-4 leading-tight" style={{ textShadow: '2px 2px 0 var(--border-outer)' }}>
              あなたの<br className="hidden sm:block" />
              ギルド会員証
            </h2>
            <p className="text-[#ebdacf] font-bold text-sm leading-relaxed mb-6">
              カードをタップすると裏面に習得スキルが表示されます。
              経験値を積んでレベルアップし、上位の役職を目指しましょう！
            </p>

            {/* 役職説明 (ドット絵風ソリッドカラー) */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { rank: '旅人', color: '#8b9bb4', desc: '入会したての仲間' },
                { rank: '職人', color: '#4285f4', desc: 'スキルを磨く者' },
                { rank: '冒険者', color: '#ea4335', desc: '果敢に挑む挑戦者' },
                { rank: '開拓者', color: '#dfa837', desc: '道を切り拓く者' },
              ].map((r) => (
                <div
                  key={r.rank}
                  className="flex items-start gap-2 p-3 bg-[var(--bg-base)] border-2 border-[var(--border-shade)] shadow-[inset_2px_2px_0_rgba(0,0,0,0.1),2px_2px_0_rgba(0,0,0,0.1)]"
                >
                  <span className="font-bold text-xs mt-0.5 px-2 py-0.5 text-[#fff] border-[1px] border-[#000]" style={{ backgroundColor: r.color, textShadow: '1px 1px 0 #000' }}>
                    {r.rank}
                  </span>
                  <span className="text-[11px] text-[#ebdacf] font-bold mt-0.5">{r.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   メインページ
   ============================================================ */
export default function Home() {
  return (
    <>
      {/* QRスキャナーモーダル */}
      <QRScanner />

      {/* ヒーロー */}
      <HeroSection />

      {/* 会員証 */}
      <MemberSection />

      {/* クエストボード */}
      <QuestBoard />

      {/* スタンプカード + ガチャ (横並び on desktop) */}
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-6 pb-20">
        <StampCard />
        <Gacha />
      </div>

      {/* フッター */}
      <footer className="mt-8 py-8 border-t-4 border-[var(--border-outer)] text-center bg-[var(--bg-card)]">
        <p className="font-rpg text-xs tracking-widest text-[#cfbeaf] font-bold" style={{ textShadow: '1px 1px 0 #000' }}>
          九大ギルド © 2024 — All Adventurers Welcome
        </p>
      </footer>
    </>
  );
}
