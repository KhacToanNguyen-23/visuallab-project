import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../context/AuthContext';
import { GitHubContributionGraph } from './GitHubContributionGraph';
import { ClassJoinModal } from './ClassJoinModal';
import { PHYSICS_DOMAINS } from '../../config/domainsConfig';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';

interface RoleWorkspacePanelProps {
  user: User | null;
  onEditProfile: () => void;
}

export const RoleWorkspacePanel: React.FC<RoleWorkspacePanelProps> = ({ user, onEditProfile }) => {
  const navigate = useNavigate();
  const role = user?.role || 'STUDENT';

  // Student State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState<any[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teacher State
  const [teacherTab, setTeacherTab] = useState<'classes' | 'catalog' | 'assign' | 'grading'>('classes');
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    if (role === 'TEACHER') {
      const teacherId = user?.id || 'u-1';
      classService.getTeacherClasses(teacherId).then(async data => {
        if (data && data.length > 0) {
          const classesWithCounts = await Promise.all(
            data.map(async c => {
              const asgs = await assignmentService.getAssignmentsByClass(c.id);
              const roster = await classService.getClassRoster(c.id);
              return {
                id: c.id,
                name: c.name,
                code: c.code,
                students: roster ? roster.length : 0,
                assignments: asgs ? asgs.length : 0
              };
            })
          );
          setTeacherClasses(classesWithCounts);
        } else {
          setTeacherClasses([]);
        }
      });
    } else if (role === 'STUDENT') {
      const studentId = user?.id || 'u-2';
      classService.getStudentEnrollments(studentId).then(async data => {
        if (data && data.length > 0) {
          const joinedWithCounts: any[] = [];
          const allAsgs: any[] = [];
          for (const e of data) {
            const asgs = await assignmentService.getAssignmentsByClass(e.classId);
            joinedWithCounts.push({
              id: e.id,
              classId: e.classId,
              name: e.className || `Lớp ${e.classId}`,
              code: e.classCode || 'ENROLLED',
              teacher: e.teacherName || 'Giáo viên',
              count: asgs ? asgs.length : 0
            });
            if (asgs) {
              asgs.forEach(a => {
                allAsgs.push({
                  id: a.id,
                  title: a.title,
                  className: e.className || `Lớp ${e.classId}`,
                  route: getLabRoute(a.labType || a.id, a.title)
                });
              });
            }
          }
          setJoinedClasses(joinedWithCounts);
          setStudentAssignments(allAsgs);
        } else {
          setJoinedClasses([]);
          setStudentAssignments([]);
        }
      });
    }
  }, [role, user?.id]);

  const [selectedCatalogDomain, setSelectedCatalogDomain] = useState('ALL');
  const [selectedLabForAssign, setSelectedLabForAssign] = useState<string>('sim-dc-circuit');
  const [assignTargetClass, setAssignTargetClass] = useState<string>('tc1');
  const [assignDueDate, setAssignDueDate] = useState<string>('');
  const [assignInstructions, setAssignInstructions] = useState<string>('');

  // Preset Lab Catalog Items (Mapped to Physics Domains)
  const presetLabs = [
    {
      id: 'sim-dc-circuit',
      title: 'Mạch Điện Đơn Giản & Định Luật Ohm',
      domain: 'Điện & Từ Học',
      description: 'Mô phỏng lắp mạch Pin, Điện trở, Ampe kế, Vôn kế. Ghi nhận dòng điện & hiệu điện thế.',
      route: '/lab/dc-circuit',
      badge: '[ĐIỆN HỌC]'
    },
    {
      id: 'sim-emf-internal-r',
      title: 'Đo Suất Điện Động E & Điện Trở Trong r',
      domain: 'Điện & Từ Học',
      description: 'Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy.',
      route: '/lab/emf-internal-r',
      badge: '[ĐIỆN HỌC]'
    },
    {
      id: 'sim-free-fall',
      title: 'Đo Gia Tốc Rơi Tự Do g',
      domain: 'Cơ Học & Năng Lượng',
      description: 'Bi sắt rơi qua cổng quang điện, đo thời gian t và tự động tính gia tốc g.',
      route: '/lab/free-fall',
      badge: '[CƠ HỌC]'
    },
    {
      id: 'sim-simple-pendulum',
      title: 'Con Lắc Đơn & Dao Động Điều Hòa',
      domain: 'Cơ Học & Năng Lượng',
      description: 'Khảo sát chu kỳ dao động T = 2pi*sqrt(l/g) của con lắc đơn.',
      route: '/lab/simple-pendulum',
      badge: '[CƠ HỌC]'
    },
    {
      id: 'sim-specific-heat',
      title: 'Đo Nhiệt Dung Riêng c Của Nước',
      domain: 'Sóng & Nhiệt Học',
      description: 'Đo công suất Q = P*t và độ tăng nhiệt độ delta T để xác định c.',
      route: '/lab/wave-interference',
      badge: '[SÓNG - NHIỆT]'
    },
    {
      id: 'sim-refraction',
      title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ',
      domain: 'Quang Học & Hiện Đại',
      description: 'Chiếu laser qua môi trường chiết suất n1, n2 và xác định góc khúc xạ.',
      route: '/lab/refraction',
      badge: '[QUANG HỌC]'
    }
  ];

  // Grading Matrix State
  const [submissions] = useState<any[]>([]);

  // Admin State
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

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const created = await classService.createClass(
        newClassName.trim(),
        'Lớp học thí nghiệm Vật lý EduLab',
        user?.id || 'u-1',
        user?.fullName || 'Giáo viên EduLab'
      );

      setTeacherClasses(prev => [
        {
          id: created.id,
          name: created.name,
          code: created.code,
          students: 0,
          assignments: 0
        },
        ...prev
      ]);
      setNewClassName('');
      alert(`🎉 Đã tạo lớp "${created.name}" thành công! Class Code: ${created.code}`);
    } catch (err: any) {
      alert(`Lỗi tạo lớp: ${err.message || 'Không thể kết nối đến máy chủ backend!'}`);
    }
  };

  const handleJoinSuccess = async (className?: string, _teacherName?: string) => {
    const studentId = user?.id || 'u-2';
    const data = await classService.getStudentEnrollments(studentId);
    if (data && data.length > 0) {
      const joinedWithCounts = await Promise.all(
        data.map(async e => {
          const asgs = await assignmentService.getAssignmentsByClass(e.classId);
          return {
            id: e.id,
            classId: e.classId,
            name: e.className || `Lớp ${e.classId}`,
            code: e.classCode || 'ENROLLED',
            teacher: e.teacherName || 'Giáo viên',
            count: asgs ? asgs.length : 0
          };
        })
      );
      setJoinedClasses(joinedWithCounts);
    }
    setToastMessage(`🎉 Gia nhập lớp ${className || 'học mới'} thành công!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. ADMIN WORKSPACE PANEL
  if (role === 'ADMIN') {
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
  }

  // 2. TEACHER WORKSPACE PANEL
  if (role === 'TEACHER') {
    const filteredPresetLabs = presetLabs.filter(lab => {
      if (selectedCatalogDomain === 'ALL') return true;
      return lab.domain === selectedCatalogDomain;
    });

    const handleAssignSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const targetCls = teacherClasses.find(c => c.id === assignTargetClass);
      const targetLab = presetLabs.find(l => l.id === selectedLabForAssign);

      if (targetCls) {
        setTeacherClasses(prev => prev.map(c => c.id === assignTargetClass ? { ...c, assignments: c.assignments + 1 } : c));
      }

      alert(`Đã giao bài "${targetLab?.title || 'Lab ảo'}" thành công cho ${targetCls?.name || 'Lớp học'}!`);
      setTeacherTab('grading');
    };

    return (
      <div 
        className="border rounded-xl p-6 shadow-xs flex flex-col gap-6 transition-colors"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        {/* Teacher Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border flex items-center justify-center font-bold text-[10px] shrink-0" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
              [GIÁO VIÊN]
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                  KHÔNG GIAN GIÁO VIÊN
                </span>
                <span className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>{user?.school || 'THPT Chuyên Hà Nội - Amsterdam'}</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight mt-0.5">Bảng Điều Khiển & Quản Lý Lớp Học</h3>
            </div>
          </div>

          <button
            onClick={() => navigate('/teacher-classes')}
            className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-md transition-all hover:opacity-90 flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <span>🚀</span> Mở Dashboard Quản Lý Lớp & Groq AI Full Screen
          </button>
        </div>

        {/* Teacher Flex Container with Left Vertical Sidebar */}
        <div className="flex flex-col md:flex-row gap-6 pt-2">
          {/* Left Vertical Navigation Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1.5 p-3 border rounded-xl h-fit shadow-xs" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
              DANH MỤC QUẢN LÝ
            </div>
            
            <button
              onClick={() => setTeacherTab('classes')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${teacherTab === 'classes' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
              style={{
                borderColor: teacherTab === 'classes' ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: teacherTab === 'classes' ? 'var(--accent-primary)' : 'transparent',
                color: teacherTab === 'classes' ? '#FFFFFF' : 'var(--text-main)'
              }}
            >
              <span>[1] Bảng Lớp Học</span>
              <span className="text-[11px] font-mono opacity-80 px-1.5 py-0.5 rounded border" style={{ borderColor: 'currentColor' }}>
                {teacherClasses.length}
              </span>
            </button>

            <button
              onClick={() => setTeacherTab('catalog')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${teacherTab === 'catalog' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
              style={{
                borderColor: teacherTab === 'catalog' ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: teacherTab === 'catalog' ? 'var(--accent-primary)' : 'transparent',
                color: teacherTab === 'catalog' ? '#FFFFFF' : 'var(--text-main)'
              }}
            >
              <span>[2] Kho Lab Mẫu</span>
              <span className="text-[11px] font-mono opacity-80 px-1.5 py-0.5 rounded border" style={{ borderColor: 'currentColor' }}>
                {presetLabs.length}
              </span>
            </button>

            <button
              onClick={() => setTeacherTab('assign')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${teacherTab === 'assign' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
              style={{
                borderColor: teacherTab === 'assign' ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: teacherTab === 'assign' ? 'var(--accent-primary)' : 'transparent',
                color: teacherTab === 'assign' ? '#FFFFFF' : 'var(--text-main)'
              }}
            >
              <span>[3] Giao Bài Tập</span>
            </button>

            <button
              onClick={() => setTeacherTab('grading')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors cursor-pointer flex justify-between items-center ${teacherTab === 'grading' ? 'font-bold shadow-xs' : 'opacity-75 hover:opacity-100'}`}
              style={{
                borderColor: teacherTab === 'grading' ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: teacherTab === 'grading' ? 'var(--accent-primary)' : 'transparent',
                color: teacherTab === 'grading' ? '#FFFFFF' : 'var(--text-main)'
              }}
            >
              <span>[4] Sổ Điểm Tiến Độ</span>
            </button>
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Tab 1: High-Density Class Table */}
            {teacherTab === 'classes' && (
              <div className="space-y-4">
                {/* Create Class Form */}
                <form onSubmit={handleCreateClass} className="flex gap-3 items-center p-3 border rounded-lg" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <input 
                    type="text"
                    value={newClassName}
                    onChange={e => setNewClassName(e.target.value)}
                    placeholder="Tên lớp học mới (vd: Vật lý 12A1)..."
                    className="flex-1 border rounded-md p-2 text-xs focus:outline-none transition-colors"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    + Tạo Lớp Mới
                  </button>
                </form>

                {/* High-Density Class Data Table */}
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      <tr>
                        <th className="p-3">Tên Lớp Học</th>
                        <th className="p-3">Mã Tham Gia</th>
                        <th className="p-3">Sĩ Số Học Sinh</th>
                        <th className="p-3">Bài Thực Hành Đã Giao</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {teacherClasses.map(cls => (
                        <tr key={cls.id}>
                          <td className="p-3 font-bold text-sm" style={{ color: 'var(--text-main)' }}>{cls.name}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                              [MÃ: {cls.code}]
                            </span>
                          </td>
                          <td className="p-3 opacity-80">{cls.students} học sinh</td>
                          <td className="p-3 opacity-80">{cls.assignments} bài</td>
                          <td className="p-3 text-right space-x-2">
                            <button 
                              onClick={() => {
                                navigator.clipboard?.writeText(`https://visuallab.edu.vn/join?code=${cls.code}`);
                                alert(`Đã sao chép link mời: https://visuallab.edu.vn/join?code=${cls.code}`);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold hover:underline cursor-pointer"
                              style={{ color: 'var(--accent-primary)' }}
                            >
                              [Sao Chép Link Mời]
                            </button>
                            <button 
                              onClick={() => setTeacherTab('grading')}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded border cursor-pointer"
                              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
                            >
                              [Xem Bài Nộp]
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: High-Density Physics Domain Catalog Table */}
            {teacherTab === 'catalog' && (
              <div className="space-y-4">
                {/* Domain Filter Chips */}
                <div className="flex flex-wrap gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={() => setSelectedCatalogDomain('ALL')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border cursor-pointer ${selectedCatalogDomain === 'ALL' ? 'font-bold text-white' : 'opacity-70'}`}
                    style={{ 
                      borderColor: 'var(--border-color)', 
                      backgroundColor: selectedCatalogDomain === 'ALL' ? 'var(--accent-primary)' : 'var(--bg-main)',
                      color: selectedCatalogDomain === 'ALL' ? '#FFFFFF' : 'var(--text-main)'
                    }}
                  >
                    Tất Cả Mạch Kiến Thức
                  </button>
                  {PHYSICS_DOMAINS.map(domain => (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedCatalogDomain(domain.name)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border cursor-pointer ${selectedCatalogDomain === domain.name ? 'font-bold text-white' : 'opacity-70'}`}
                      style={{ 
                        borderColor: 'var(--border-color)', 
                        backgroundColor: selectedCatalogDomain === domain.name ? 'var(--accent-primary)' : 'var(--bg-main)',
                        color: selectedCatalogDomain === domain.name ? '#FFFFFF' : 'var(--text-main)'
                      }}
                    >
                      <span>{domain.code} {domain.name}</span>
                    </button>
                  ))}
                </div>

                {/* High-Density Catalog Data Table */}
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      <tr>
                        <th className="p-3">Mạch Kiến Thức</th>
                        <th className="p-3">Tên Bài Thí Nghiệm Mô Phỏng</th>
                        <th className="p-3">Mô Tả & Chuẩn Kiến Thức GDPT</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {filteredPresetLabs.map(lab => (
                        <tr key={lab.id}>
                          <td className="p-3 shrink-0 whitespace-nowrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                              {lab.badge}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-xs" style={{ color: 'var(--text-main)' }}>{lab.title}</td>
                          <td className="p-3 opacity-75">{lab.description}</td>
                          <td className="p-3 text-right whitespace-nowrap space-x-2">
                            <button 
                              onClick={() => navigate(lab.route)}
                              className="px-2 py-1 text-xs font-semibold hover:underline opacity-80 cursor-pointer"
                            >
                              [Xem Thử]
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedLabForAssign(lab.id);
                                setTeacherTab('assign');
                              }}
                              className="px-3 py-1 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
                              style={{ backgroundColor: 'var(--accent-primary)' }}
                            >
                              + Giao Cho Lớp
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Assign Homework */}
            {teacherTab === 'assign' && (
              <form onSubmit={handleAssignSubmit} className="p-5 border rounded-lg space-y-4" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                <h4 className="font-bold text-sm">Tạo & Giao Bài Tập Thí Nghiệm Mới</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">1. Chọn Lớp Học</label>
                    <select 
                      value={assignTargetClass}
                      onChange={e => setAssignTargetClass(e.target.value)}
                      className="w-full p-2 border rounded-md font-medium" 
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      {teacherClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (Sĩ số: {c.students})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">2. Chọn Bài Lab Áo Mẫu</label>
                    <select 
                      value={selectedLabForAssign}
                      onChange={e => setSelectedLabForAssign(e.target.value)}
                      className="w-full p-2 border rounded-md font-medium" 
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    >
                      {presetLabs.map(lab => (
                        <option key={lab.id} value={lab.id}>{lab.badge} {lab.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold mb-1">3. Hạn Nộp (Deadline)</label>
                  <input 
                    type="datetime-local" 
                    value={assignDueDate}
                    onChange={e => setAssignDueDate(e.target.value)}
                    className="w-full md:w-1/2 p-2 border rounded-md font-medium" 
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} 
                  />
                </div>

                <div className="text-xs">
                  <label className="block font-semibold mb-1">4. Ghi Chú & Yêu Cầu Cho Học Sinh</label>
                  <textarea 
                    value={assignInstructions}
                    onChange={e => setAssignInstructions(e.target.value)}
                    className="w-full p-2.5 border rounded-md font-medium"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                    rows={3}
                    placeholder="VD: Hãy khảo sát lực kéo về cực đại với m = 800g và nộp lại số liệu đo đạc..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    Xuất Bản & Giao Cho Lớp
                  </button>
                </div>
              </form>
            )}

            {/* Tab 4: Matrix Grading Grid */}
            {teacherTab === 'grading' && (
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-left text-xs">
                  <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <tr>
                      <th className="p-3">Học Sinh</th>
                      <th className="p-3">Lớp Học</th>
                      <th className="p-3">Bài Thực Hành</th>
                      <th className="p-3">Thời Gian Nộp</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3">Điểm Số</th>
                      <th className="p-3">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {submissions.map(sub => (
                      <tr key={sub.id}>
                        <td className="p-3 font-bold">{sub.studentName}</td>
                        <td className="p-3 opacity-80">{sub.className}</td>
                        <td className="p-3 font-medium">{sub.labTitle}</td>
                        <td className="p-3 text-xs opacity-75">{sub.time}</td>
                        <td className="p-3">
                          {sub.status === 'COMPLETED' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Đã nộp
                            </span>
                          )}
                          {sub.status === 'IN_PROGRESS' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Đang làm
                            </span>
                          )}
                          {sub.status === 'NOT_STARTED' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20">
                              Chưa nộp
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-emerald-600">{sub.score}</td>
                        <td className="p-3">
                          {sub.status === 'COMPLETED' ? (
                            <button onClick={() => alert(`Báo cáo chi tiết của ${sub.studentName}: Đã thực hiện 5 lần thử nghiệm, giá trị trung bình đạt chuẩn.`)} className="text-xs font-semibold underline cursor-pointer" style={{ color: 'var(--accent-primary)' }}>
                              Xem chi tiết
                            </button>
                          ) : (
                            <span className="text-xs opacity-50 cursor-pointer hover:underline" onClick={() => alert(`Đã gửi thông báo nhắc nhở tới ${sub.studentName}`)}>
                              Nhắc nhở
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. STUDENT WORKSPACE PANEL (DEFAULT)
  return (
    <div className="flex flex-col gap-6">
      {/* Student Profile & Quick Stats Card */}
      <div 
        className="border rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded border flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            [HS]
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                GÓC HỌC SINH
              </span>
              <span className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>{user?.school || 'THPT Chuyên Hà Nội - Amsterdam'}</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight mt-0.5">
              Xin chào, {user?.fullName || 'Học sinh'}!
            </h3>
            <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Theo dõi lịch sử thực hành lab và nộp bài tập theo yêu cầu của Giáo viên.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 shadow-xs flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <span>+ Tham gia Lớp học</span>
          </button>
          <button 
            onClick={onEditProfile}
            className="px-3 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            Hồ sơ
          </button>
        </div>
      </div>

      {/* Success Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs font-bold flex justify-between items-center animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="opacity-60 hover:opacity-100 text-sm font-bold">✕</button>
        </div>
      )}

      {/* GitHub 365-Day Contribution Graph Component */}
      <GitHubContributionGraph />

      {/* Class List & Assigned Homework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Joined Classes */}
        <div className="border rounded-xl p-5" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-bold text-sm mb-3 flex items-center justify-between" style={{ color: 'var(--text-main)' }}>
            <span>Lớp Học Của Tôi ({joinedClasses.length})</span>
            <button onClick={() => setIsJoinModalOpen(true)} className="text-xs font-semibold underline" style={{ color: 'var(--accent-primary)' }}>
              + Nhập mã lớp
            </button>
          </h4>

          <div className="space-y-3">
            {joinedClasses.map(c => (
              <div 
                key={c.id} 
                onClick={() => navigate(`/student-assignments?classId=${c.classId}`)}
                className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all group" 
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <h5 className="font-bold text-xs group-hover:text-blue-400 transition-colors">{c.name}</h5>
                  <span className="text-[10px] opacity-75" style={{ color: 'var(--text-muted)' }}>GV: {c.teacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                    {c.count} bài tập
                  </span>
                  <span className="text-xs text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Lab Homework */}
        <div className="border rounded-xl p-5" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-bold text-sm mb-3 flex items-center justify-between" style={{ color: 'var(--text-main)' }}>
            <span>Bài Tập Thí Nghiệm</span>
            <span className="text-xs opacity-60">Hạn nộp sắp tới</span>
          </h4>

          <div className="space-y-3">
            {studentAssignments.length > 0 ? (
              studentAssignments.map(asg => (
                <div key={asg.id} className="p-3 border rounded-lg flex justify-between items-center" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <div>
                    <h5 className="font-bold text-xs">{asg.title}</h5>
                    <span className="text-[10px] opacity-75 font-semibold" style={{ color: 'var(--text-muted)' }}>{asg.className}</span>
                  </div>
                  <button 
                    onClick={() => navigate(asg.route)}
                    className="px-3 py-1.5 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    Làm Bài
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs opacity-60 p-2 text-center">Chưa có bài tập nào được giao.</p>
            )}
          </div>
        </div>
      </div>

      {/* Class Join Modal */}
      <ClassJoinModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onJoinSuccess={handleJoinSuccess} 
      />
    </div>
  );
};
