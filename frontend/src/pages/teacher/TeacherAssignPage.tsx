import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { useAuth } from '../../context/AuthContext';
import type { Assignment } from '../../types/assignment';

const LAB_OPTIONS = [
  // LỚP 10
  {
    id: 'sim-speed-measurement',
    title: '[LỚP 10] Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng',
    type: 'MECHANICS_SPEED',
    targetFormula: 'v = s / t',
    paramBounds: { sMin: 0.2, sMax: 1.0, inclineMin: 5, inclineMax: 20 },
    tolerance: 2.0,
    defaultInstructions: 'Đo thời gian bi thép lăn qua 2 cổng quang điện trên máng nghiêng để tính tốc độ v theo SGK GDPT 2018.',
  },
  {
    id: 'sim-free-fall',
    title: '[LỚP 10] Bài 14: Đo Gia Tốc Rơi Tự Do g',
    type: 'MECHANICS_FREE_FALL',
    targetFormula: 'g = 2 * s / (t * t)',
    paramBounds: { heightMin: 0.2, heightMax: 1.0 },
    tolerance: 2.0,
    defaultInstructions: 'Đo quãng đường rơi s và thời gian t khi bi thép rơi qua cổng quang điện để tính gia tốc rơi tự do g.',
  },
  {
    id: 'sim-friction-coefficient',
    title: '[LỚP 10] Bài 21: Đo Hệ Số Ma Sát Trượt',
    type: 'MECHANICS_FRICTION',
    targetFormula: 'mu = F / (m * g)',
    paramBounds: { massMin: 0.1, massMax: 0.5, muMin: 0.1, muMax: 0.6 },
    tolerance: 3.0,
    defaultInstructions: 'Dùng lực kế kéo khối gỗ gắn quả cân trượt đều trên mặt bàn để đo hệ số ma sát trượt mu.',
  },
  {
    id: 'sim-momentum-collision',
    title: '[LỚP 10] Bài 30: Khảo Sát Động Lượng & Va Chạm',
    type: 'MECHANICS_MOMENTUM',
    targetFormula: 'p = m1 * v1 + m2 * v2',
    paramBounds: { m1Min: 0.1, m1Max: 0.5, m2Min: 0.1, m2Max: 0.5 },
    tolerance: 3.0,
    defaultInstructions: 'Mô phỏng va chạm 2 xe trượt trên đệm không khí, kiểm chứng định luật bảo toàn động lượng.',
  },
  {
    id: 'sim-hooke-law',
    title: '[LỚP 10] Bài 38: Độ Giãn Lò Xo (Định Luật Hooke)',
    type: 'SPRING',
    targetFormula: 'F = k * delta_l',
    paramBounds: { massMin: 0.05, massMax: 0.5, kMin: 20, kMax: 100 },
    tolerance: 3.0,
    defaultInstructions: 'Treo quả cân lên lò xo xoắn, đo độ giãn delta L và tính độ cứng k của lò xo.',
  },

  // LỚP 11
  {
    id: 'sim-sound-resonance',
    title: '[LỚP 11] Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)',
    type: 'WAVE_SOUND_RESONANCE',
    targetFormula: 'v = 4 * (L2 - L1) * f',
    paramBounds: { freqMin: 250, freqMax: 1000, tempMin: 15, tempMax: 35 },
    tolerance: 3.0,
    defaultInstructions: 'Mô phỏng 3D ống thủy tinh cộng hưởng âm thanh, nâng hạ cột nước & loa Tone.js để đo tốc độ truyền âm v.',
  },
  {
    id: 'sim-simple-pendulum',
    title: '[LỚP 11] Bài 7: Khảo Sát Dao Động Con Lắc Đơn',
    type: 'PENDULUM',
    targetFormula: 'T = 2 * PI * sqrt(l / g)',
    paramBounds: { lengthMin: 0.5, lengthMax: 2.0, angleMin: 5, angleMax: 30 },
    tolerance: 3.0,
    defaultInstructions: 'Khảo sát sự phụ thuộc của chu kỳ T vào chiều dài l của con lắc đơn.',
  },
  {
    id: 'sim-young-interference',
    title: '[LỚP 11] Bài 12: Đo Bước Sóng Ánh Sáng (Khe Y-âng)',
    type: 'OPTICS_INTERFERENCE',
    targetFormula: 'lambda = (a * i) / D',
    paramBounds: { aMin: 0.1, aMax: 0.5, DMin: 1.0, DMax: 2.5 },
    tolerance: 3.0,
    defaultInstructions: 'Chiếu laser qua khe kép Y-âng, dùng thước kẹp đo khoảng vân i để tính bước sóng ánh sáng lambda.',
  },
  {
    id: 'sim-emf-internal-r',
    title: '[LỚP 11] Bài 19: Đo Suất Điện Động E & Điện Trở Trong r',
    type: 'ELECTRICITY_EMF',
    targetFormula: 'U = E - I * r',
    paramBounds: { emfMin: 1.2, emfMax: 9.0, rMin: 0.5, rMax: 5.0 },
    tolerance: 3.0,
    defaultInstructions: 'Thay đổi giá trị biến trở con chạy, ghi nhận bảng giá trị U và I để suy ra E và r.',
  },
  {
    id: 'sim-refraction',
    title: '[LỚP 11] Bài 21: Đo Chiết Suất Của Nước & Khúc Xạ',
    type: 'OPTICS_REFRACTION',
    targetFormula: 'n = sin(i) / sin(r)',
    paramBounds: { angleMin: 10, angleMax: 70 },
    tolerance: 2.0,
    defaultInstructions: 'Chiếu tia laser qua bán trụ thủy tinh / nước để xác định góc khúc xạ r và chiết suất n.',
  },
  {
    id: 'sim-dc-circuit',
    title: '[LỚP 11] Mạch Điện Đơn Giản & Định Luật Ohm',
    type: 'ELECTRICITY_OHM',
    targetFormula: 'I = U / R',
    paramBounds: { voltageMin: 1.5, voltageMax: 12.0, resistanceMin: 10, resistanceMax: 100 },
    tolerance: 2.5,
    defaultInstructions: 'Mắc vôn kế và ampe kế vào mạch điện, đo hiệu điện thế và cường độ dòng điện để kiểm chứng định luật Ohm.',
  },

  // LỚP 12
  {
    id: 'sim-specific-heat',
    title: '[LỚP 12] Bài 3: Đo Nhiệt Dung Riêng Của Nước',
    type: 'HEAT_SPECIFIC_HEAT',
    targetFormula: 'c = (P * t) / (m * delta_T)',
    paramBounds: { massMin: 0.1, massMax: 0.5, powerMin: 50, powerMax: 300 },
    tolerance: 3.5,
    defaultInstructions: 'Đun lượng nước m với công suất nhiệt P trong thời gian t, đo độ tăng nhiệt độ delta T và tính c.',
  },
  {
    id: 'sim-latent-heat',
    title: '[LỚP 12] Bài 4: Đo Nhiệt Nóng Chảy Nước Đá',
    type: 'HEAT_LATENT_HEAT',
    targetFormula: 'lambda = (P * t) / m',
    paramBounds: { massMin: 0.05, massMax: 0.3, powerMin: 50, powerMax: 200 },
    tolerance: 3.5,
    defaultInstructions: 'Khảo sát quá trình nóng chảy của nước đá bằng bình nhiệt lượng kế và nhiệt kế điện tử để tính nhiệt nóng chảy riêng.',
  },
  {
    id: 'sim-boyle-mariotte',
    title: '[LỚP 12] Bài 7: Quá Trình Đẳng Nhiệt (Boyle - Mariotte)',
    type: 'HEAT_BOYLE_MARIOTTE',
    targetFormula: 'p * V = const',
    paramBounds: { volumeMin: 10, volumeMax: 50, tempK: 300 },
    tolerance: 3.0,
    defaultInstructions: 'Nén piston trong xy-lanh nén khí và đọc áp kế để kiểm chứng định luật Boyle - Mariotte p*V = const.',
  },
  {
    id: 'sim-electromagnetic-induction',
    title: '[LỚP 12] Bài 12: Khảo Sát Cảm Ứng Điện Từ',
    type: 'ELECTRICITY_INDUCTION',
    targetFormula: 'e_c = - delta_Phi / delta_t',
    paramBounds: { turnsMin: 100, turnsMax: 1000, speedMin: 0.1, speedMax: 2.0 },
    tolerance: 3.0,
    defaultInstructions: 'Di chuyển nam châm vĩnh cửu qua cuộn dây cảm ứng để quan sát suất điện động cảm ứng và chiều dòng điện.',
  },
];

export const TeacherAssignPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [classes, setClasses] = useState<Array<{ id: string; name: string; code: string; studentCount: number }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [selectedClass, setSelectedClass] = useState('');
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([]);
  const [selectedLab, setSelectedLab] = useState(LAB_OPTIONS[0].id);
  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const labDropdownRef = useRef<HTMLDivElement>(null);
  const [dueDate, setDueDate] = useState('2026-09-20');
  const [instructions, setInstructions] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (labDropdownRef.current && !labDropdownRef.current.contains(event.target as Node)) {
        setIsLabDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.id) {
      setLoadingClasses(true);
      classService
        .getTeacherClasses(user.id)
        .then(async data => {
          const formatted = await Promise.all(
            data.map(async c => {
              const roster = await classService.getClassRoster(c.id);
              return {
                id: c.id,
                name: c.name,
                code: c.code,
                studentCount: roster ? roster.length : 0,
              };
            })
          );
          setClasses(formatted);
          const preferredClassId = location.state?.selectedClassId || new URLSearchParams(location.search).get('classId');
          if (preferredClassId && formatted.some(c => c.id === preferredClassId)) {
            setSelectedClass(preferredClassId);
          } else if (formatted.length > 0) {
            setSelectedClass(formatted[0].id);
          }

          const preferredLabId = location.state?.selectedLabId || new URLSearchParams(location.search).get('labId');
          if (preferredLabId && LAB_OPTIONS.some(l => l.id === preferredLabId)) {
            setSelectedLab(preferredLabId);
          }
        })
        .catch(err => console.error('Lỗi khi tải danh sách lớp học:', err))
        .finally(() => setLoadingClasses(false));
    }
  }, [user, location.state, location.search]);

  useEffect(() => {
    if (selectedClass) {
      assignmentService
        .getAssignmentsByClass(selectedClass)
        .then(asgs => {
          const currentAsgs = asgs || [];
          setExistingAssignments(currentAsgs);
          // If current selectedLab is already assigned, auto pick first available unassigned lab
          const isCurrentAssigned = currentAsgs.some(a => {
            const labItem = LAB_OPTIONS.find(l => l.id === selectedLab);
            return labItem && (a.labType === labItem.type || a.title === labItem.title);
          });
          if (isCurrentAssigned) {
            const availableLab = LAB_OPTIONS.find(l => !currentAsgs.some(a => a.labType === l.type || a.title === l.title));
            if (availableLab) {
              setSelectedLab(availableLab.id);
            }
          }
        })
        .catch(err => {
          console.error('Lỗi khi tải bài tập của lớp:', err);
          setExistingAssignments([]);
        });
    } else {
      setExistingAssignments([]);
    }
  }, [selectedClass]);

  const isLabAlreadyAssigned = (labId: string) => {
    const labItem = LAB_OPTIONS.find(l => l.id === labId);
    if (!labItem) return false;
    return existingAssignments.some(
      a => a.labType === labItem.type || a.title === labItem.title
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      setToastMessage('Vui lòng chọn lớp học để giao bài!');
      return;
    }

    const selectedLabItem = LAB_OPTIONS.find(l => l.id === selectedLab) || LAB_OPTIONS[0];
    if (isLabAlreadyAssigned(selectedLabItem.id)) {
      setToastMessage('Lớp học này đã được giao bài thực hành này rồi! Không được giao trùng bài.');
      return;
    }

    setSubmitting(true);
    try {
      await assignmentService.createAssignment({
        classId: selectedClass,
        title: selectedLabItem.title,
        description: instructions || selectedLabItem.defaultInstructions,
        labType: selectedLabItem.type,
        paramBoundsJson: JSON.stringify(selectedLabItem.paramBounds),
        targetFormula: selectedLabItem.targetFormula,
        tolerancePercent: selectedLabItem.tolerance,
        teacherId: user?.id || 't1',
        dueDate: dueDate,
      });

      setToastMessage('Đã giao bài thực hành thành công cho lớp học!');
      setTimeout(() => {
        setToastMessage(null);
        navigate('/teacher/classes', {
          state: { openClassId: selectedClass, tab: 'assignments' },
        });
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setToastMessage(err.message || 'Lỗi khi giao bài thực hành');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
          Giao Bài Tập Thực Hành Mô Phỏng
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Chọn lớp học, bài lab mẫu và cài đặt thời hạn nộp bài cho học sinh
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border space-y-5 shadow-xs"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Chọn Lớp Học Mở (*)</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            disabled={loadingClasses || classes.length === 0}
            className="w-full p-2.5 rounded-lg border font-semibold focus:outline-none cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            {loadingClasses ? (
              <option value="">Đang tải danh sách lớp học...</option>
            ) : classes.length > 0 ? (
              classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - [{c.code}] ({c.studentCount} học sinh)
                </option>
              ))
            ) : (
              <option value="">Chưa có lớp học nào (Hãy tạo lớp học mới trước)</option>
            )}
          </select>
        </div>

        <div className="space-y-1.5 text-xs relative" ref={labDropdownRef}>
          <label className="font-bold opacity-80 block">Chọn Bài Thí Nghiệm Mô Phỏng (*)</label>
          
          {/* Custom Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsLabDropdownOpen(prev => !prev)}
            className="w-full p-2.5 rounded-lg border font-semibold flex items-center justify-between transition-all cursor-pointer text-left"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: isLabDropdownOpen ? 'var(--accent-primary)' : 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <span className="truncate">
              {LAB_OPTIONS.find(l => l.id === selectedLab)?.title || 'Chọn bài thí nghiệm'}
            </span>
            <svg
              className={`w-4 h-4 opacity-70 shrink-0 transition-transform duration-200 ${
                isLabDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Floating Dropdown List - ALWAYS OPENS DOWNWARDS */}
          {isLabDropdownOpen && (
            <div
              className="absolute left-0 right-0 top-full mt-1.5 max-h-72 overflow-y-auto rounded-xl border shadow-2xl z-50 p-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              {[
                { title: 'KHỐI LỚP 10 (Cơ học & Động lực học)', filter: 'LỚP 10' },
                { title: 'KHỐI LỚP 11 (Dao động, Sóng, Điện & Quang)', filter: 'LỚP 11' },
                { title: 'KHỐI LỚP 12 (Vật lý Nhiệt & Cảm ứng từ)', filter: 'LỚP 12' },
              ].map(group => (
                <div key={group.filter} className="space-y-1">
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded opacity-75 font-mono"
                    style={{ backgroundColor: 'var(--bg-main)' }}
                  >
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {LAB_OPTIONS.filter(l => l.title.includes(group.filter)).map(lab => {
                      const alreadyAssigned = isLabAlreadyAssigned(lab.id);
                      const isSelected = selectedLab === lab.id;
                      return (
                        <button
                          key={lab.id}
                          type="button"
                          disabled={alreadyAssigned}
                          onClick={() => {
                            setSelectedLab(lab.id);
                            setIsLabDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                            alreadyAssigned
                              ? 'opacity-40 cursor-not-allowed bg-slate-500/5'
                              : isSelected
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30'
                              : 'hover:bg-slate-500/10 cursor-pointer'
                          }`}
                        >
                          <span className="truncate">{lab.title}</span>
                          {alreadyAssigned ? (
                            <span className="text-[10px] text-amber-500 font-bold shrink-0 ml-2 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                              ĐÃ GIAO
                            </span>
                          ) : isSelected ? (
                            <span className="text-blue-500 shrink-0 ml-2">✓</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLabAlreadyAssigned(selectedLab) && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2 mt-2">
              <span>Bài thực hành này đã được giao cho lớp học này rồi. Vui lòng chọn bài khác!</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Hạn Nộp Bài (Deadline)</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full p-2.5 rounded-lg border font-mono font-medium focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Hướng Dẫn Làm Bài Yêu Cầu Học Sinh</label>
          <textarea
            rows={4}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="VD: Tiến hành thay đổi điện trở R từ 10 Ohm đến 50 Ohm, ghi nhận bảng số liệu U-I và tính giá trị R trung bình..."
            className="w-full p-2.5 rounded-lg border font-medium focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        <div className="pt-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => navigate('/teacher')}
            className="px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-main)',
            }}
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            disabled={submitting || !selectedClass || isLabAlreadyAssigned(selectedLab)}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm disabled:opacity-50"
            style={{
              backgroundColor: isLabAlreadyAssigned(selectedLab) ? '#64748b' : 'var(--accent-primary)',
            }}
          >
            {submitting
              ? 'Đang Giao Bài...'
              : isLabAlreadyAssigned(selectedLab)
              ? 'Bài Này Đã Giao Cho Lớp'
              : 'Giao Bài Tập Cho Lớp'}
          </button>
        </div>
      </form>
    </div>
  );
};

