import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [school, setSchool] = useState(user?.school || '');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      await updateProfile(fullName.trim(), school.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại kết nối!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border rounded-2xl shadow-xl p-6 flex flex-col gap-5 relative transition-all duration-150 transform scale-100"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h3 className="font-bold text-base tracking-tight" style={{ color: 'var(--text-main)' }}>
              Cập Nhật Thông Tin Cá Nhân
            </h3>
            <p className="text-xs opacity-70 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Thiết lập tên hiển thị & trường học của bạn
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded-md opacity-60 hover:opacity-100 transition cursor-pointer"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl text-center font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Success Feedback */}
        {isSaved ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs p-4 rounded-xl text-center font-semibold">
            Đã lưu thông tin hồ sơ thành công!
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold opacity-90">Tên hiển thị mong muốn</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold opacity-90">Tên Trường Học / Lớp</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Ví dụ: THPT Chuyên Hà Nội - Amsterdam"
                className="w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer hover:opacity-80"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                }}
              >
                Bỏ qua
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl text-white shadow-xs transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;
