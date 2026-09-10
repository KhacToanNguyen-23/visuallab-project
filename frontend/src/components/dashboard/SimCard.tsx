import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface SimItem {
  id: string;
  title: string;
  gradeLevel: string;
  subjectArea: string;
  description: string;
  icon?: string;
  route: string;
  isPopular?: boolean;
}

interface SimCardProps {
  sim: SimItem;
}

export const SimCard: React.FC<SimCardProps> = ({ sim }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="border rounded-lg p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md h-full"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      <div>
        {/* Eyebrow Micro Badges */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
              {sim.subjectArea}
            </span>
            <span className="text-[10px] font-medium opacity-75 px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              {sim.gradeLevel}
            </span>
          </div>

          {sim.isPopular && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              [Nổi bật]
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold leading-snug tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
          {sim.title}
        </h4>

        {/* Description */}
        <p className="text-xs opacity-75 leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
          {sim.description}
        </p>
      </div>

      {/* CTA Footer */}
      <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
          Mô phỏng 2D
        </span>

        <button
          onClick={() => navigate(sim.route)}
          className="px-3.5 py-1.5 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 flex items-center gap-1 cursor-pointer"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>Khởi Chạy</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
