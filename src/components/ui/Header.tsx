'use client';

import { useGuild } from '@/contexts/GuildContext';
import { QrCode, Sword, Bell, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { setQrScannerOpen, stamps, isLoggedIn } = useGuild();
  const { data: session } = useSession();
  const stampCount = stamps.filter(Boolean).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-[var(--bg-card)] border-b-4 border-[var(--border-outer)] shadow-[0_4px_0_rgba(0,0,0,0.15)]" />

      <div className="relative h-full max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-base)] border-2 border-[var(--border-outer)] shadow-[inset_2px_2px_0_rgba(0,0,0,0.15)]">
            <Sword size={16} className="text-[var(--gold-light)]" />
          </div>
          <span className="font-rpg font-black text-sm tracking-widest text-[var(--gold-light)] hidden sm:block" style={{ textShadow: '2px 2px 0 var(--border-inner)' }}>
            九大ギルド
          </span>
        </div>

        {/* 右側コントロール */}
        <div className="flex items-center gap-3">
          {/* Discordログインボタン */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">退出</span>
            </button>
          ) : (
            <button
              onClick={() => signIn('discord')}
              className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors border-2 border-[#4752C4] shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Discordで入室</span>
            </button>
          )}

          {/* スタンプ数バッジ */}
          {stampCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-base)] border-2 border-[var(--border-outer)] text-xs font-bold text-[var(--gold-light)] shadow-[inset_2px_2px_0_rgba(0,0,0,0.15)]"
            >
              <span>🎫</span>
              <span>{stampCount} / 10</span>
            </motion.div>
          )}

          {/* 通知ベル */}
          <button
            id="header-notification-btn"
            className="relative w-9 h-9 bg-[var(--bg-base)] border-2 border-[var(--border-outer)] flex items-center justify-center text-[var(--gold-light)] hover:bg-[var(--border-inner)] transition-colors shadow-[inset_2px_2px_0_rgba(0,0,0,0.15)]"
            aria-label="通知"
          >
            <Bell size={17} />
          </button>

          {/* QRスキャナーボタン */}
          <motion.button
            id="header-qr-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQrScannerOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-colors border-2 shadow-[2px_2px_0_rgba(0,0,0,0.2)] ${
              isLoggedIn
                ? 'bg-[var(--bg-base)] border-[var(--border-outer)] text-[var(--gold-light)] hover:bg-[var(--border-inner)]'
                : 'bg-[var(--rank-adventurer)] border-[#000] text-white'
            }`}
            style={!isLoggedIn ? { textShadow: '1px 1px 0 #000' } : {}}
            aria-label="QRスキャン"
          >
            <QrCode size={16} />
            <span className="hidden sm:inline">
              {isLoggedIn ? 'スキャン済' : '読込・登録'}
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

