import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface ScreenshotCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageBase64: string;
  labId: string;
  labTitle: string;
  difficulty?: string;
  onSuccess?: () => void;
}

export const ScreenshotCaptureModal: React.FC<ScreenshotCaptureModalProps> = ({
  isOpen,
  onClose,
  imageBase64,
  labId,
  labTitle,
  difficulty = 'MEDIUM',
  onSuccess,
}) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsUploading(true);
    setError(null);
    try {
      await storageService.uploadSnapshot({
        studentId: user?.id || 'u-student',
        labId,
        labTitle,
        imageBase64,
        caption: caption.trim() || undefined,
        difficulty,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu kho thí nghiệm');
    } finally {
      setIsUploading(false);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toUpperCase()) {
      case 'EASY':
      case 'DỄ':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-700/50">Độ Khó: Dễ</span>;
      case 'HARD':
      case 'NÂNG CAO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-950 text-rose-400 border border-rose-700/50">Độ Khó: Nâng Cao</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-400 border border-amber-700/50">Độ Khó: Trung Bình</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl text-slate-100 flex flex-col gap-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <div>
              <h3 className="font-extrabold text-base text-white">Lưu Kết Quả Thí Nghiệm Vào Kho</h3>
              <p className="text-xs text-slate-400">{labTitle}</p>
            </div>
          </div>
          {getDifficultyBadge(difficulty)}
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-2xl animate-bounce">
              ✓
            </div>
            <span className="font-extrabold text-emerald-400 text-sm">Đã lưu thành công vào Kho Lưu Trữ (My Storage)!</span>
          </div>
        ) : (
          <>
            {/* Image Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black max-h-[300px] flex items-center justify-center">
              <img
                src={imageBase64}
                alt="Lab Screenshot Preview"
                className="max-h-[300px] w-auto object-contain"
              />
            </div>

            {/* Optional Caption Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Ghi chú / Nhận xét của bạn (Không bắt buộc):
              </label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Nhập ghi chú số liệu, hiện tượng quan sát được hoặc thắc mắc..."
                rows={2}
                className="w-full bg-[#05070C] border border-slate-700/70 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500 transition"
              />
            </div>

            {error && (
              <div className="text-xs font-semibold text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
                ⚠️ {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Hủy Vỏ
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải lên Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <span>☁️ Lưu Vào Kho Cá Nhân</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
