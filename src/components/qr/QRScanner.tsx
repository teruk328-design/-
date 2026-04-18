import { useEffect, useRef } from 'react';
import { useGuild } from '@/contexts/GuildContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Camera, CheckCircle2 } from 'lucide-react';

export default function QRScanner() {
  const { qrScannerOpen, setQrScannerOpen, addStamp, isLoggedIn } = useGuild();
  const scannerRef = useRef<HTMLDivElement>(null);

  // モーダル外クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setQrScannerOpen(false);
  };

  // モックスキャン（デモ用）
  const handleMockScan = () => {
    addStamp();
    setTimeout(() => setQrScannerOpen(false), 600);
  };

  return (
    <AnimatePresence>
      {qrScannerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm bg-[var(--bg-card)] rounded-md border-4 border-[var(--border-gold)] overflow-hidden"
            style={{ boxShadow: '0 0 40px var(--gold-glow)' }}
          >
            {/* ヘッダ */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-outer)]">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-[var(--gold)]" />
                <h3 className="font-rpg font-bold text-sm text-[var(--gold)]">QR ログイン</h3>
              </div>
              <button
                id="qr-scanner-close"
                onClick={() => setQrScannerOpen(false)}
                className="w-7 h-7 rounded-sm border-2 bg-slate-800 flex items-center justify-center text-[#cfbeaf] hover:text-[var(--gold)] transition-colors"
                aria-label="閉じる"
              >
                <X size={14} />
              </button>
            </div>

            {/* スキャナーエリア */}
            <div className="p-6">
              <div
                ref={scannerRef}
                className="relative w-full aspect-square rounded-sm border-2 overflow-hidden bg-black border-[var(--border-outer)] mb-4"
              >
                {/* スキャンライン演出 */}
                <motion.div
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-[var(--gold)] shadow-[0_0_8px_var(--gold)] z-10"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--gold-light)]/40">
                  <Camera size={48} className="mb-2 opacity-50" />
                  <p className="font-bold text-sm">カメラを起動中...</p>
                </div>
              </div>

              <p className="text-xs text-[#cfbeaf] text-center mb-4">
                ギルドのQRコードを枠内に収めてください
              </p>

              {/* モックボタン（デモ用：実際はQR読み取り後に自動発火） */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMockScan}
                className="w-full py-3 rounded-sm border-2 font-bold text-sm bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] text-[var(--bg-base)] flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                {isLoggedIn ? 'スタンプを追加（デモ）' : 'ログイン（デモ）'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
