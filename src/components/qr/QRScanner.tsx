import { useEffect, useRef, useState } from 'react';
import { useGuild } from '@/contexts/GuildContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Camera, CheckCircle2, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export default function QRScanner() {
  const { qrScannerOpen, setQrScannerOpen, processBaseCheckIn, isLoggedIn } = useGuild();
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const scannerRef = useRef<HTMLDivElement>(null);

  // モーダル外クリックで閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    setQrScannerOpen(false);
    setTimeout(() => setStatus({ type: 'idle', message: '' }), 300);
  };

  // 拠点チェックインのスキャン処理（デモ用）
  const handleBaseCheckInScan = () => {
    const result = processBaseCheckIn();
    if (result.success) {
      setStatus({ type: 'success', message: result.message });
      // 成功時は少し余韻を残して閉じる
      setTimeout(() => handleClose(), 2000);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
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
                onClick={handleClose}
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
                {status.type === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/20 z-20"
                  >
                    <Sparkles className="text-[var(--gold)] mb-2 animate-bounce" size={48} />
                    <CheckCircle2 className="text-[var(--gold)]" size={64} />
                  </motion.div>
                ) : null}

                {/* スキャンライン演出 */}
                {status.type === 'idle' && (
                  <motion.div
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-[var(--gold)] shadow-[0_0_8px_var(--gold)] z-10"
                  />
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--gold-light)]/40">
                  <Camera size={48} className="mb-2 opacity-50" />
                  <p className="font-bold text-sm">カメラを起動中...</p>
                </div>
              </div>

              {/* メッセージ表示 */}
              <AnimatePresence mode="wait">
                {status.message ? (
                  <motion.div
                    key={status.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-2 p-3 rounded-sm border mb-4 text-xs font-bold ${
                      status.type === 'success' 
                        ? 'bg-green-900/30 border-green-500/50 text-green-400' 
                        : 'bg-red-900/30 border-red-500/50 text-red-400'
                    }`}
                  >
                    {status.type === 'success' ? <MapPin size={16} /> : <AlertCircle size={16} />}
                    {status.message}
                  </motion.div>
                ) : (
                  <p className="text-xs text-[#cfbeaf] text-center mb-4">
                    ギルドのQRコードを枠内に収めてください
                  </p>
                )}
              </AnimatePresence>

              {/* ボタンエリア */}
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBaseCheckInScan}
                  disabled={status.type === 'success'}
                  className={`w-full py-3 rounded-sm border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${status.type === 'success' 
                      ? 'bg-green-700 border-green-500 text-white opacity-50' 
                      : 'bg-gradient-to-r from-blue-900 to-indigo-800 border-indigo-500 text-indigo-100'}
                  `}
                >
                  <MapPin size={16} />
                  拠点にチェックイン（デモ）
                </motion.button>

                <p className="text-[10px] text-[#cfbeaf]/50 text-center">
                  ※実際の実装では、特定のQRコードを読み取ると自動で発火します
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
