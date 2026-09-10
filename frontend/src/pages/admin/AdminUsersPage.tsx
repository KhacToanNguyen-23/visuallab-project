import React, { useState } from 'react';
import { UserSlideOverDrawer, type UserFormData } from '../../components/admin/UserSlideOverDrawer';
import { UserActionDropdown } from '../../components/admin/UserActionDropdown';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  school: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

const INITIAL_USERS: UserItem[] = [];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered list
  const filteredUsers = users.filter(user => {
    const matchesQuery =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.school.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || user.status === selectedStatus;

    return matchesQuery && matchesRole && matchesStatus;
  });

  const handleCreateUser = (formData: UserFormData) => {
    const newUser: UserItem = {
      id: 'u-' + Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      school: formData.school,
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`Đã cấp tài khoản thành công cho ${formData.name} (${formData.role})`);
  };

  const handleToggleRole = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        const nextRole: 'TEACHER' | 'STUDENT' | 'ADMIN' =
          u.role === 'STUDENT' ? 'TEACHER' : u.role === 'TEACHER' ? 'ADMIN' : 'STUDENT';
        showToast(`Đã đổi vai trò của ${u.name} thành [${nextRole}]`);
        return { ...u, role: nextRole };
      })
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        const nextStatus: 'ACTIVE' | 'SUSPENDED' = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        showToast(
          nextStatus === 'ACTIVE'
            ? `Đã kích hoạt lại tài khoản ${u.name}`
            : `Đã khóa tài khoản ${u.name}`
        );
        return { ...u, status: nextStatus };
      })
    );
  };

  const handleResetPassword = (userName: string) => {
    showToast(`Đã gửi link reset mật khẩu đến email của ${userName}`);
  };

  // Stats calculation
  const totalCount = users.length;
  const teacherCount = users.filter(u => u.role === 'TEACHER').length;
  const studentCount = users.filter(u => u.role === 'STUDENT').length;
  const suspendedCount = users.filter(u => u.status === 'SUSPENDED').length;

  return (
    <div className="space-y-6 max-w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Quản Lý Người Dùng & Phân Quyền
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Danh sách tài khoản toàn hệ thống VisualLab (Giáo viên, Học sinh, Admin)
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsDrawerOpen(true);
          }}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>+ Cấp Tài Khoản Mới</span>
        </button>
      </div>

      {/* KPI Stat Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl border transition-all"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Tổng Người Dùng
          </span>
          <div className="text-2xl font-black mt-1" style={{ color: 'var(--text-main)' }}>
            {totalCount}
          </div>
          <span className="text-[10px] opacity-60">Tài khoản trên hệ thống</span>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Giáo Viên
          </span>
          <div className="text-2xl font-black mt-1 text-blue-600">{teacherCount}</div>
          <span className="text-[10px] opacity-60">Quyền tạo lớp & giao lab</span>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Học Sinh
          </span>
          <div className="text-2xl font-black mt-1 text-emerald-600">{studentCount}</div>
          <span className="text-[10px] opacity-60">Tài khoản làm thí nghiệm</span>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
            Tài Khoản Đã Khóa
          </span>
          <div className="text-2xl font-black mt-1 text-rose-600">{suspendedCount}</div>
          <span className="text-[10px] opacity-60">Cần admin kiểm tra</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Tên người dùng, Email hoặc Trường học..."
            className="w-full bg-transparent text-xs font-medium focus:outline-none"
            style={{ color: 'var(--text-main)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="opacity-60 font-semibold text-[11px]">Vai trò:</span>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="p-1.5 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="TEACHER">Giáo Viên</option>
              <option value="STUDENT">Học Sinh</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="opacity-60 font-semibold text-[11px]">Trạng thái:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="p-1.5 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="SUSPENDED">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Full-Width High-Density User Data Table */}
      <div
        className="border rounded-xl overflow-hidden shadow-xs"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="border-b uppercase font-semibold text-[10px] tracking-wider"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              <tr>
                <th className="p-3.5 pl-4">Họ và Tên</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Vai Trò Hệ Thống</th>
                <th className="p-3.5">Đơn Vị / Trường Học</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Ngày Tạo</th>
                <th className="p-3.5 text-right pr-4">Thao Tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => {
                  const initialChar = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-500/5 transition-colors"
                      style={{ backgroundColor: 'var(--bg-main)' }}
                    >
                      <td className="p-3.5 pl-4 font-bold text-xs">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full font-extrabold text-white text-xs flex items-center justify-center shrink-0 shadow-xs"
                            style={{
                              backgroundColor:
                                user.role === 'ADMIN'
                                  ? '#8B5CF6'
                                  : user.role === 'TEACHER'
                                  ? 'var(--accent-primary)'
                                  : '#10B981',
                            }}
                          >
                            {initialChar}
                          </div>
                          <div>
                            <div className="font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                              {user.name}
                            </div>
                            <div className="text-[10px] opacity-60 sm:hidden">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-xs opacity-90">{user.email}</td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                              : user.role === 'TEACHER'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          }`}
                        >
                          <span>{user.role}</span>
                        </span>
                      </td>

                      <td className="p-3.5 opacity-80 max-w-xs truncate">{user.school}</td>

                      <td className="p-3.5">
                        {user.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Hoạt Động</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Đã Khóa</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-[11px] opacity-60">{user.createdAt}</td>

                      <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                        <UserActionDropdown
                          userId={user.id}
                          role={user.role}
                          status={user.status}
                          onToggleRole={() => handleToggleRole(user.id)}
                          onToggleStatus={() => handleToggleStatus(user.id)}
                          onResetPassword={() => handleResetPassword(user.name)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center opacity-60">
                    Không tìm thấy tài khoản người dùng phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div
          className="px-4 py-3 border-t flex items-center justify-between text-xs"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Hiển thị {filteredUsers.length} / {users.length} tài khoản</span>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-2.5 py-1 rounded border opacity-40 cursor-not-allowed"
              style={{ borderColor: 'var(--border-color)' }}
            >
              ← Trước
            </button>
            <span className="font-bold text-xs" style={{ color: 'var(--text-main)' }}>
              Trang 1 / 1
            </span>
            <button
              disabled
              className="px-2.5 py-1 rounded border opacity-40 cursor-not-allowed"
              style={{ borderColor: 'var(--border-color)' }}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer for User Creation */}
      <UserSlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateUser}
        initialData={editingUser}
      />
    </div>
  );
};
