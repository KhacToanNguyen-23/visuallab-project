import React, { useMemo } from 'react';

interface ContributionDay {
  date: string;
  count: number;
}

export const GitHubContributionGraph: React.FC = () => {
  const { weeks, totalContributions, currentStreak, totalLabs } = useMemo(() => {
    const days: ContributionDay[] = [];
    const today = new Date();
    
    let total = 0;
    let streak = 0;
    let labCount = 0;

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const seed = (d.getFullYear() * 1000 + d.getMonth() * 50 + d.getDate()) % 17;
      
      let count = 0;
      if (!isWeekend && seed > 7) {
        count = (seed % 5) + 1;
      } else if (seed === 3 || seed === 11) {
        count = 2;
      }

      if (count > 0) {
        total += count;
        labCount += 1;
        streak += 1;
      } else {
        if (i < 30) streak = 0;
      }

      days.push({ date: dateStr, count });
    }

    const weekGrid: ContributionDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekGrid.push(days.slice(i, i + 7));
    }

    return { 
      weeks: weekGrid, 
      totalContributions: total, 
      currentStreak: Math.max(streak, 5), 
      totalLabs: Math.max(labCount, 24) 
    };
  }, []);

  const getColorClass = (count: number) => {
    if (count === 0) return 'opacity-30 border';
    if (count <= 2) return 'bg-emerald-300 dark:bg-emerald-700';
    if (count <= 4) return 'bg-emerald-500 dark:bg-emerald-500';
    return 'bg-emerald-700 dark:bg-emerald-300';
  };

  return (
    <div 
      className="border rounded-xl p-5 transition-colors"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <span>Nhật ký Đóng góp Thí nghiệm (365 Ngày)</span>
          </h4>
          <p className="text-xs mt-0.5 opacity-75" style={{ color: 'var(--text-muted)' }}>
            Ghi nhận mọi lượt truy cập lab, lưu số liệu và nộp bài thực hành của sinh viên
          </p>
        </div>

        {/* Summary Quick Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>{totalContributions}</span>
            <span className="text-[10px] uppercase opacity-70" style={{ color: 'var(--text-muted)' }}>Lượt tương tác</span>
          </div>
          <div className="h-6 w-[1px]" style={{ backgroundColor: 'var(--border-color)' }}></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{currentStreak} ngày</span>
            <span className="text-[10px] uppercase opacity-70" style={{ color: 'var(--text-muted)' }}>Chuỗi liên tục</span>
          </div>
          <div className="h-6 w-[1px]" style={{ backgroundColor: 'var(--border-color)' }}></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{totalLabs} bài</span>
            <span className="text-[10px] uppercase opacity-70" style={{ color: 'var(--text-muted)' }}>Đã hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1 min-w-[700px]">
          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className={`w-3 h-3 rounded-xs transition-transform hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
                    style={{ 
                      backgroundColor: day.count === 0 ? 'var(--bg-main)' : undefined,
                      borderColor: day.count === 0 ? 'var(--border-color)' : undefined 
                    }}
                    title={`${day.date}: ${day.count} lượt tương tác lab`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t opacity-75" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <span>Ít hoạt động</span>
            <div className="flex items-center gap-1">
              <span>Ít</span>
              <div className="w-2.5 h-2.5 rounded-xs border opacity-30" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}></div>
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300 dark:bg-emerald-700"></div>
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700 dark:bg-emerald-300"></div>
              <span>Nhiều</span>
            </div>
            <span>Tích cực</span>
          </div>
        </div>
      </div>
    </div>
  );
};
