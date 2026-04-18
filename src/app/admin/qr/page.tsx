'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Printer, Download, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdminQRPage() {
  // 拠点チェックイン用の識別子
  const qrValue = 'GUILD_BASE_CHECKIN';

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#0f0a05] text-[#dfd8c8] p-4 sm:p-8 font-rpg">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8 no-print">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>ギルド本部に戻る</span>
          </Link>
          <div className="flex gap-4">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-[var(--gold)] text-[#0f0a05] rounded-sm font-bold flex items-center gap-2 hover:bg-[var(--gold-light)] transition-colors"
            >
              <Printer size={18} />
              印刷する
            </button>
          </div>
        </div>

        {/* メインコンテンツ（印刷対象） */}
        <div className="bg-[url('/images/parchment-bg.jpg')] bg-[#2a1f14] parchment-border p-8 sm:p-16 relative overflow-hidden text-center shadow-2xl">
          {/* 装飾 */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[var(--gold)] opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-[var(--gold)] opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-[var(--gold)] opacity-50" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[var(--gold)] opacity-50" />

          {/* 内容 */}
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[var(--gold)]/10 border-2 border-[var(--gold)] flex items-center justify-center">
                <ShieldCheck size={40} className="text-[var(--gold)]" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gold-gradient tracking-widest">
              九大ギルド 拠点
            </h1>
            <p className="text-xl sm:text-2xl text-[var(--gold)] mb-12 opacity-80 uppercase tracking-widest">
              - Base Check-in Portal -
            </p>

            {/* QRコード表示エリア */}
            <div className="inline-block p-8 bg-white rounded-lg shadow-[0_0_50px_rgba(212,175,55,0.3)] mb-12">
              <QRCodeCanvas 
                value={qrValue} 
                size={256}
                level="H"
                includeMargin={true}
                imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    excavate: true,
                }}
              />
            </div>

            <div className="max-w-lg mx-auto space-y-6 text-lg">
              <div className="flex items-center justify-center gap-3 text-[var(--gold-light)] font-bold border-y-2 border-[var(--gold)]/30 py-4">
                <MapPin className="animate-pulse" />
                <span>拠点を訪れし冒険者に「経験値」と「報酬」を授けん</span>
              </div>

              <div className="text-[#cfbeaf] space-y-2 italic">
                <p>1. ギルドアプリの「QRログイン」を起動せよ</p>
                <p>2. この紋章（QRコード）を読み取れ</p>
                <p>3. 拠点ボーナスが汝の記録に刻まれるであろう</p>
              </div>

              <div className="pt-8">
                <p className="text-sm text-[var(--gold)] opacity-60">
                  ※本ボーナスは1日1回のみ有効である
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 補足（印刷しない） */}
        <div className="mt-8 p-6 bg-black/40 border border-[var(--gold)]/20 rounded-sm no-print">
          <h2 className="text-lg font-bold text-[var(--gold)] mb-2 flex items-center gap-2">
            <ShieldCheck size={18} />
            管理者用メモ
          </h2>
          <ul className="text-sm text-[#cfbeaf] list-disc list-inside space-y-1">
            <li>このページをA4サイズで印刷し、拠点の目立つ場所に掲示してください。</li>
            <li>QRコードには `${qrValue}` という文字列が含まれており、アプリがこれを検知するとボーナスが付与されます。</li>
            <li>印刷時は背景色や画像が含まれるように設定してください。</li>
          </ul>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .parchment-border {
            border: 10px solid #8b5a2b !important;
            box-shadow: none !important;
          }
        }
        .text-gold-gradient {
          background: linear-gradient(to bottom, #fde68a, #d4af37, #b45309);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  );
}
