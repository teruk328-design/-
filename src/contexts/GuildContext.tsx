'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

/* ============================================================
   型定義
   ============================================================ */
export type Rank = '旅人' | '職人' | '冒険者' | '開拓者';

export interface Skill {
  name: string;
  level: number; // 0–100
  color: string;
}

export interface Member {
  name: string;
  rank: Rank;
  level: number;
  xp: number;
  maxXp: number;
  skills: Skill[];
  joinDate: string;
  id: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  xp: number;
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  category: 'みつける' | 'たかめる' | 'つながる' | 'つむぐ' | 'ひらく';
  completed: boolean;
}

export interface GuildState {
  member: Member;
  stamps: boolean[]; // 10スタンプ分
  isLoggedIn: boolean;
  gachaAvailable: boolean;
  quests: Quest[];
  qrScannerOpen: boolean;
  setQrScannerOpen: (open: boolean) => void;
  addStamp: () => void;
  addXp: (amount: number) => void;
  processBaseCheckIn: () => { success: boolean; message: string };
  completeQuest: (id: string) => void;
  spinGacha: () => GachaResult | null;
}

export interface GachaResult {
  type: 'drink' | 'points' | 'title' | 'rare';
  label: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
}

/* ============================================================
   初期データ
   ============================================================ */
const INITIAL_MEMBER: Member = {
  id: 'guild-001',
  name: '冒険者 テスト',
  rank: '冒険者',
  level: 12,
  xp: 680,
  maxXp: 1000,
  joinDate: '2024-04-01',
  skills: [
    { name: '勉強', level: 60, color: '#6366f1' },
    { name: 'デザイン', level: 50, color: '#f97316' },
    { name: 'コーディング', level: 60, color: '#3b82f6' },
    { name: '添削', level: 50, color: '#10b981' },
    { name: 'カメラマン', level: 66, color: '#ec4899' },
    { name: '買い物代行', level: 50, color: '#f59e0b' },
    { name: '運搬', level: 33, color: '#64748b' },
    { name: '翻訳', level: 33, color: '#06b6d4' },
    { name: 'エンジニア', level: 50, color: '#8b5cf6' },
    { name: 'デバイス', level: 50, color: '#94a3b8' },
  ],
};

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q-001',
    title: 'ギルドの掲示板を確認せよ',
    description: '毎週の告知やイベント情報をチェックしよう',
    reward: 'ギルドポイント×50',
    xp: 50,
    difficulty: 'E',
    category: 'みつける',
    completed: false,
  },
  {
    id: 'q-002',
    title: '新しい仲間に話しかけよ',
    description: '今月入会したメンバーと交流しよう',
    reward: '「交友家」称号',
    xp: 120,
    difficulty: 'D',
    category: 'つながる',
    completed: false,
  },
  {
    id: 'q-003',
    title: 'スキル講習会に参加せよ',
    description: '動画編集 or コーディングのワークショップに参加',
    reward: 'スキルポイント×100',
    xp: 200,
    difficulty: 'C',
    category: 'たかめる',
    completed: true,
  },
  {
    id: 'q-004',
    title: '外部コンテストに挑戦せよ',
    description: 'ハッカソンやデザインコンテストに参加する',
    reward: '「挑戦者」称号 + ギルドポイント×300',
    xp: 500,
    difficulty: 'B',
    category: 'ひらく',
    completed: false,
  },
  {
    id: 'q-005',
    title: 'ナレッジを共有せよ',
    description: '勉強したことをLT（ライトニングトーク）で発表',
    reward: '「語り部」称号',
    xp: 350,
    difficulty: 'C',
    category: 'つむぐ',
    completed: false,
  },
];

const GACHA_TABLE: GachaResult[] = [
  { type: 'drink', label: 'ドリンク割引券', description: '学内カフェで使える10%割引券', rarity: 'common' },
  { type: 'points', label: 'ギルドポイント×100', description: '経験値ボーナス！', rarity: 'common' },
  { type: 'points', label: 'ギルドポイント×200', description: '大きな経験値ボーナス！', rarity: 'rare' },
  { type: 'title', label: '「幸運児」称号', description: 'まさかの大当たり！', rarity: 'epic' },
  { type: 'drink', label: 'ドリンク無料券', description: '学内カフェで使える1杯無料券！', rarity: 'rare' },
  { type: 'rare', label: '伝説のスクロール', description: 'ギルドの謎が書かれた巻物...', rarity: 'epic' },
];

/* ============================================================
   Context
   ============================================================ */
const GuildContext = createContext<GuildState | null>(null);

export function GuildProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member>(INITIAL_MEMBER);
  const [stamps, setStamps] = useState<boolean[]>(Array(10).fill(false));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gachaAvailable, setGachaAvailable] = useState(false);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [lastBaseCheckIn, setLastBaseCheckIn] = useState<string | null>(null);

  const addXp = useCallback((amount: number) => {
    setMember((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;

      // レベルアップロジック
      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        // 次のレベルへの必要経験値を少し増やす (例: 10%増)
        newMaxXp = Math.floor((newMaxXp * 1.1) / 10) * 10;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
      };
    });
  }, []);

  const addStamp = useCallback(() => {
    setStamps((prev) => {
      const nextEmpty = prev.findIndex((s) => !s);
      if (nextEmpty === -1) return prev;
      const next = [...prev];
      next[nextEmpty] = true;
      return next;
    });
    setIsLoggedIn(true);
    setGachaAvailable(true);
  }, []);

  const processBaseCheckIn = useCallback(() => {
    const today = new Date().toLocaleDateString();
    if (lastBaseCheckIn === today) {
      return { success: false, message: '本日の拠点ボーナスは既に獲得済みです！' };
    }

    addXp(2); // 経験値+2
    addStamp(); // ログインボーナスも兼ねる
    setLastBaseCheckIn(today);
    
    return { success: true, message: '拠点到着！経験値+2 ボーナス獲得！' };
  }, [addXp, addStamp, lastBaseCheckIn]);

  const completeQuest = useCallback((id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
    );
  }, []);

  const spinGacha = useCallback((): GachaResult | null => {
    if (!gachaAvailable) return null;
    setGachaAvailable(false);
    const roll = Math.random();
    // 重み付き抽選
    if (roll < 0.5) return GACHA_TABLE[0];
    if (roll < 0.75) return GACHA_TABLE[1];
    if (roll < 0.88) return GACHA_TABLE[4];
    if (roll < 0.95) return GACHA_TABLE[2];
    if (roll < 0.99) return GACHA_TABLE[3];
    return GACHA_TABLE[5];
  }, [gachaAvailable]);

  return (
    <GuildContext.Provider
      value={{
        member,
        stamps,
        isLoggedIn,
        gachaAvailable,
        quests,
        qrScannerOpen,
        setQrScannerOpen,
        addStamp,
        addXp,
        processBaseCheckIn,
        completeQuest,
        spinGacha,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild(): GuildState {
  const ctx = useContext(GuildContext);
  if (!ctx) throw new Error('useGuild must be used within GuildProvider');
  return ctx;
}
