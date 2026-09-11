import React, { useEffect, useState } from 'react';
import { storageService, type StudentLabSnapshotItem } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const StudentStoragePage: React.FC = () => {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<StudentLabSnapshotItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSnapshot, setSelectedSnapshot] = useState<StudentLabSnapshotItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchSnapshots = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getMySnapshots(user?.id || 'u-student');
      setSnapshots(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách snapshot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này khỏi Kho Lưu Trữ?')) return;

    setDeletingId(id);
    try {
      const success = await storageService.deleteSnapshot(id);
      if (success) {
        setSnapshots(prev => prev.filter(s => s.id !== id));
        showToast('Đã xóa thành công khỏi Kho Lưu Trữ!');
        if (selectedSnapshot?.id === id) {
          setSelectedSnapshot(null);
        }
      }
    } catch (err) {
      alert('Không thể xóa snapshot. Vui lòng thử lại!');
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyBadge = (diff?: string) => {
    switch ((diff || '').toUpperCase()) {
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

  const formatDateGroup = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return 'Hôm nay';
      }
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Gần đây';
    }
  };

  // Group snapshots by date
  const groupedSnapshots = snapshots.reduce((acc, snap) => {
    const groupKey = formatDateGroup(snap.createdAt);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(snap);
    return acc;
  }, {} as Record<string, StudentLabSnapshotItem[]>);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <span>📸 Kho Lưu Trữ Thí Nghiệm (My Storage)</span>
          </h1>
          <p className="text-xs opacity-70 mt-1">
            Nhật ký hình ảnh mô phỏng và báo cáo thí nghiệm cá nhân theo mốc thời gian
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Tổng số ảnh: {snapshots.length}
          </span>
        </div>
      </div>

      {/* Main Timeline View */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center opacity-70 gap-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold">Đang tải Kho Lưu Trữ...</span>
        </div>
      ) : snapshots.length === 0 ? (
        <div className="py-20 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center opacity-70 p-6 space-y-3" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-3xl">📷</span>
          <h3 className="text-sm font-bold">Kho Lưu Trữ Đang Trống</h3>
          <p className="text-xs max-w-md">
            Bạn chưa lưu hình ảnh thí nghiệm nào. Hãy vào một bài thực hành bất kỳ và nhấn nút <strong>"📸 Chụp Ảnh & Lưu Kho"</strong> để lưu lại kết quả!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSnapshots).map(([dateGroup, items]) => (
            <div key={dateGroup} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-cyan-400">
                  {dateGroup}
                </h3>
                <div className="flex-1 h-[1px] bg-slate-800" />
              </div>

              {/* Snapshot Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(snap => (
                  <div
                    key={snap.id}
                    className="group rounded-2xl border transition-all duration-200 hover:scale-[1.02] flex flex-col overflow-hidden shadow-lg"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                  >
                    {/* Image Thumbnail */}
                    <div
                      className="relative h-44 bg-black overflow-hidden cursor-pointer"
                      onClick={() => setSelectedSnapshot(snap)}
                    >
                      <img
                        src={snap.screenshotUrl}
                        alt={snap.labTitle}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <span>🔍 Xem Ảnh Full-size</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        {getDifficultyBadge(snap.difficulty)}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-white line-clamp-1">
                          {snap.labTitle}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          🕒 {new Date(snap.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {snap.caption && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 italic line-clamp-2">
                            "{snap.caption}"
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                        <button
                          onClick={() => setSelectedSnapshot(snap)}
                          className="font-bold text-cyan-400 hover:underline cursor-pointer"
                        >
                          Xem Chi Tiết →
                        </button>

                        <button
                          onClick={() => handleDelete(snap.id)}
                          disabled={deletingId === snap.id}
                          className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer px-2 py-1 rounded hover:bg-rose-950/40 transition"
                        >
                          {deletingId === snap.id ? 'Đang xóa...' : '🗑️ Xóa'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0E17] border border-cyan-500/40 rounded-3xl p-6 max-w-4xl w-full shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">{selectedSnapshot.labTitle}</h3>
                <span className="text-xs text-slate-400">
                  Lưu lúc {new Date(selectedSnapshot.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {getDifficultyBadge(selectedSnapshot.difficulty)}
                <button
                  onClick={() => setSelectedSnapshot(null)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Full Resolution Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <img
                src={selectedSnapshot.screenshotUrl}
                alt={selectedSnapshot.labTitle}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            {selectedSnapshot.caption && (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                <span className="font-bold block mb-1">📝 Ghi chú của sinh viên:</span>
                <p className="leading-relaxed">{selectedSnapshot.caption}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={selectedSnapshot.screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition"
              >
                Mở Ảnh Gốc ↗
              </a>

              <button
                onClick={() => setSelectedSnapshot(null)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition cursor-pointer"
              >
                Đóng Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
