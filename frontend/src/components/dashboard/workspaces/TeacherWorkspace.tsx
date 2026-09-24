import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../../context/AuthContext';
import { PHYSICS_DOMAINS } from '../../../config/domainsConfig';
import { classService } from '../../../services/classService';
import { assignmentService } from '../../../services/assignmentService';

interface TeacherWorkspaceProps {
  user: User | null;
}

export const TeacherWorkspace: React.FC<TeacherWorkspaceProps> = ({ user }) => {
  const navigate = useNavigate();

  const [teacherTab, setTeacherTab] = useState<'classes' | 'catalog' | 'assign' | 'grading'>('classes');
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState('');

  const [selectedCatalogDomain, setSelectedCatalogDomain] = useState('ALL');
  const [selectedLabForAssign, setSelectedLabForAssign] = useState<string>('sim-dc-circuit');
  const [assignTargetClass, setAssignTargetClass] = useState<string>('tc1');
  const [assignDueDate, setAssignDueDate] = useState<string>('');
  const [assignInstructions, setAssignInstructions] = useState<string>('');

  const [submissions] = useState<any[]>([]);

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
      id: 'sim-sound-resonance',
      title: 'Đo Tốc Độ Truyền Âm (Cộng Hưởng Âm Thanh)',
      domain: 'Sóng & Nhiệt Học',
      description: 'Mô phỏng 3D ống cộng hưởng âm thanh, điều chỉnh cột nước và loa phát tần số.',
      route: '/lab/sound-resonance',
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

  useEffect(() => {
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
  }, [user?.id]);

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
      alert(`Đã tạo lớp "${created.name}" thành công! Class Code: ${created.code}`);
    } catch (err: any) {
      alert(`Lỗi tạo lớp: ${err.message || 'Không thể kết nối đến máy chủ backend!'}`);
    }
  };

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
          Mở Dashboard Quản Lý Lớp & Groq AI Full Screen
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
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(cls.code);
                              alert(`Đã sao chép mã tham gia: ${cls.code}`);
                            }}
                            title="Nhấp để sao chép mã tham gia"
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border cursor-pointer hover:opacity-80 active:scale-95 transition-all"
                            style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}
                          >
                            [MÃ: {cls.code}]
                          </button>
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
};
