import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../../context/AuthContext';

interface AdminWorkspaceProps {
  user: User | null;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({ user }) => {
  const navigate = useNavigate();

  const [adminTab, setAdminTab] = useState<'users' | 'catalog' | 'overview'>('users');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherSchool, setNewTeacherSchool] = useState('');

  const [adminLabCatalog, setAdminLabCatalog] = useState([
    { id: 'lab-1', title: 'Mạch Điện Đơn Giản & Định Luật Ohm', domain: '[ĐIỆN HỌC]', route: '/lab/dc-circuit', isVisible: true },
    { id: 'lab-2', title: 'Đo Gia Tốc Rơi Tự Do g', domain: '[CƠ HỌC]', route: '/lab/free-fall', isVisible: true },
    { id: 'lab-3', title: 'Đo Suất Điện Động E & Điện Trở Trong r', domain: '[ĐIỆN HỌC]', route: '/lab/emf-internal-r', isVisible: true },
    { id: 'lab-4', title: 'Đo Nhiệt Dung Riêng c Của Nước', domain: '[SÓNG - NHIỆT]', route: '/lab/wave-interference', isVisible: true },
    { id: 'lab-5', title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ', domain: '[QUANG HỌC]', route: '/lab/refraction', isVisible: true },
    { id: 'lab-6', title: 'Con Lắc Đơn & Dao Động Điều Hòa', domain: '[CƠ HỌC]', route: '/lab/simple-pendulum', isVisible: false },
  ]);

  const [auditLogs] = useState<any[]>([]);

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;
    setUsersList(prev => [
      ...prev,
      {
        id: 'u-' + Date.now(),
        name: newTeacherName.trim(),
        email: newTeacherEmail.trim(),
        role: 'TEACHER',
        school: newTeacherSchool.trim() || 'THPT Chuyên Hà Nội - Amsterdam',
        status: 'ACTIVE'
      }
    ]);
    alert(`Đã cấp tài khoản Giáo viên thành công cho ${newTeacherName}!`);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherSchool('');
  };

  const handleToggleUserRole = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const nextRole = u.role === 'STUDENT' ? 'TEACHER' : u.role === 'TEACHER' ? 'ADMIN' : 'STUDENT';
      return { ...u, role: nextRole };
    }));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
    }));
  };

  const handleToggleLabVisibility = (labId: string) => {
    setAdminLabCatalog(prev => prev.map(l => l.id === labId ? { ...l, isVisible: !l.isVisible } : l));
  };

  const filteredUsers = usersList.filter(u =>
    !userSearchQuery ||
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.school.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div 
      className="border rounded-xl p-6 shadow-xs flex flex-col gap-6 transition-colors"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      {/* Admin Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border flex items-center justify-center font-bold text-[10px] shrink-0" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            [ADMIN]
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                QUẢN TRỊ VIÊN HỆ THỐNG
              </span>
              <span className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>{user?.email}</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight mt-0.5">Trung Tâm Cấp Quyền & Quản Lý VisualLab</h3>
          </div>
        </div>
      </div>

      {/* Admin Flex Container with Left Vertical Sidebar */}
      <div className="flex flex-col md:flex-row gap-6 pt-2">
        {/* Left Vertical Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1.5 p-3 border rounded-xl h-fit shadow-xs" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
            DANH MỤC QUẢN TRỊ
          </div>
          
          <button
            onClick={() => setAdminTab('users')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${adminTab === 'users' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
            style={{
              borderColor: adminTab === 'users' ? 'var(--accent-primary)' : 'var(--border-color)',
              backgroundColor: adminTab === 'users' ? 'var(--accent-primary)' : 'transparent',
              color: adminTab === 'users' ? '#FFFFFF' : 'var(--text-main)'
            }}
          >
            <span>[1] Quản Lý Người Dùng</span>
            <span className="text-[11px] font-mono opacity-80 px-1.5 py-0.5 rounded border" style={{ borderColor: 'currentColor' }}>
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('catalog')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${adminTab === 'catalog' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
            style={{
              borderColor: adminTab === 'catalog' ? 'var(--accent-primary)' : 'var(--border-color)',
              backgroundColor: adminTab === 'catalog' ? 'var(--accent-primary)' : 'transparent',
              color: adminTab === 'catalog' ? '#FFFFFF' : 'var(--text-main)'
            }}
          >
            <span>[2] Kho Lab Hệ Thống</span>
            <span className="text-[11px] font-mono opacity-80 px-1.5 py-0.5 rounded border" style={{ borderColor: 'currentColor' }}>
              {adminLabCatalog.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('overview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${adminTab === 'overview' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
            style={{
              borderColor: adminTab === 'overview' ? 'var(--accent-primary)' : 'var(--border-color)',
              backgroundColor: adminTab === 'overview' ? 'var(--accent-primary)' : 'transparent',
              color: adminTab === 'overview' ? '#FFFFFF' : 'var(--text-main)'
            }}
          >
            <span>[3] Thống Kê & Audit Log</span>
          </button>
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Tab 1: User & Role Provisioning Table */}
          {adminTab === 'users' && (
            <div className="space-y-4">
              {/* Create Teacher Account Form */}
              <form onSubmit={handleCreateTeacher} className="p-4 border rounded-lg space-y-3" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                <h4 className="font-bold text-xs">Tạo & Cấp Tài Khoản Giáo Viên Mới</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <input 
                    type="text"
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    placeholder="Họ và tên Giáo viên..."
                    className="p-2 border rounded-md font-medium"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  />
                  <input 
                    type="email"
                    value={newTeacherEmail}
                    onChange={e => setNewTeacherEmail(e.target.value)}
                    placeholder="Email giáo viên (@edulab.vn)..."
                    className="p-2 border rounded-md font-medium"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  />
                  <input 
                    type="text"
                    value={newTeacherSchool}
                    onChange={e => setNewTeacherSchool(e.target.value)}
                    placeholder="Đơn vị / Trường (VD: THPT Amsterdam)..."
                    className="p-2 border rounded-md font-medium"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    + Cấp Tài Khoản Giáo Viên
                  </button>
                </div>
              </form>

              {/* User Search & Filter */}
              <div className="flex items-center justify-between gap-3 p-3 border rounded-lg" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                <input 
                  type="text"
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo Tên, Email hoặc Trường học..."
                  className="flex-1 p-2 border rounded-md text-xs font-medium"
                  style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
                <span className="text-xs font-semibold opacity-75 shrink-0">
                  Tìm thấy: {filteredUsers.length} tài khoản
                </span>
              </div>

              {/* High-Density User Management Table */}
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-left text-xs">
                  <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <tr>
                      <th className="p-3">Họ và Tên</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Vai Trò Hệ Thống</th>
                      <th className="p-3">Đơn Vị / Trường Học</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3 text-right">Thao Tác Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3 font-mono opacity-80">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                            u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                            u.role === 'TEACHER' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          }`}>
                            [{u.role}]
                          </span>
                        </td>
                        <td className="p-3 opacity-75">{u.school}</td>
                        <td className="p-3">
                          {u.status === 'ACTIVE' ? (
                            <span className="px-2 py-0.5 rounded border text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              [HOẠT ĐỘNG]
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded border text-[10px] font-bold bg-rose-500/10 text-rose-600 border-rose-500/20">
                              [ĐÃ KHÓA]
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-2">
                          <button 
                            onClick={() => handleToggleUserRole(u.id)}
                            className="px-2.5 py-1 text-xs font-semibold hover:underline cursor-pointer"
                            style={{ color: 'var(--accent-primary)' }}
                          >
                            [Đổi Vai Trò]
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded border cursor-pointer ${
                              u.status === 'ACTIVE' ? 'text-rose-600 border-rose-500/20' : 'text-emerald-600 border-emerald-500/20'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? '[Khóa Tài Khoản]' : '[Kích Hoạt]'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Simple Virtual Lab Catalog Table */}
          {adminTab === 'catalog' && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-left text-xs">
                  <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <tr>
                      <th className="p-3">Mạch Kiến Thức</th>
                      <th className="p-3">Tên Bài Thí Nghiệm Mô Phỏng</th>
                      <th className="p-3">Đường Dẫn Mô Phỏng (Route)</th>
                      <th className="p-3">Trạng Thái Hiển Thị</th>
                      <th className="p-3 text-right">Thao Tác Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {adminLabCatalog.map(lab => (
                      <tr key={lab.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                            {lab.domain}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-xs" style={{ color: 'var(--text-main)' }}>{lab.title}</td>
                        <td className="p-3 font-mono opacity-75">{lab.route}</td>
                        <td className="p-3">
                          {lab.isVisible ? (
                            <span className="px-2 py-0.5 rounded border text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              [HIỂN THỊ]
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded border text-[10px] font-bold bg-amber-500/10 text-amber-600 border-amber-500/20">
                              [BẢN NHÁP / ẨN]
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-2">
                          <button 
                            onClick={() => handleToggleLabVisibility(lab.id)}
                            className="px-2.5 py-1 text-xs font-semibold hover:underline cursor-pointer"
                            style={{ color: 'var(--accent-primary)' }}
                          >
                            {lab.isVisible ? '[Tắt Hiển Thị]' : '[Bật Hiển Thị]'}
                          </button>
                          <button 
                            onClick={() => navigate(lab.route)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded border cursor-pointer"
                            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)' }}
                          >
                            [Xem Thử]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: System Analytics & Real-time Audit Log */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              {/* Flat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xs opacity-70" style={{ color: 'var(--text-muted)' }}>Tổng Lượt Chạy Lab</span>
                  <div className="text-2xl font-bold mt-1" style={{ color: 'var(--accent-primary)' }}>12,840</div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">+14% tuần này</span>
                </div>

                <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xs opacity-70" style={{ color: 'var(--text-muted)' }}>Tài Khoản Học Sinh</span>
                  <div className="text-2xl font-bold mt-1">1,420</div>
                  <span className="text-[10px] opacity-60 mt-1 inline-block">Đã xác minh</span>
                </div>

                <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xs opacity-70" style={{ color: 'var(--text-muted)' }}>Giáo Viên Kích Hoạt</span>
                  <div className="text-2xl font-bold mt-1">86</div>
                  <span className="text-[10px] opacity-60 mt-1 inline-block">Từ 45 trường THPT</span>
                </div>

                <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xs opacity-70" style={{ color: 'var(--text-muted)' }}>Lớp Học Đang Mở</span>
                  <div className="text-2xl font-bold mt-1">112</div>
                  <span className="text-[10px] opacity-60 mt-1 inline-block">Đang hoạt động</span>
                </div>
              </div>

              {/* Audit Log Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider opacity-75">Nhật Ký Hoạt Động Hệ Thống (Audit Log)</h4>
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      <tr>
                        <th className="p-3">Thời Gian</th>
                        <th className="p-3">Người Dùng</th>
                        <th className="p-3">Vai Trò</th>
                        <th className="p-3">Hành Động / Sự Kiện</th>
                        <th className="p-3 text-right">Mô-đun</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-main)' }}>
                          <td className="p-3 font-mono opacity-75 text-[11px]">{log.timestamp}</td>
                          <td className="p-3 font-bold">{log.user}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                              [{log.role}]
                            </span>
                          </td>
                          <td className="p-3 font-medium">{log.action}</td>
                          <td className="p-3 text-right font-mono text-[10px] opacity-60">{log.module}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
