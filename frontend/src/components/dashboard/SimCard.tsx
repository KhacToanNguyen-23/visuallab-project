import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface SimItem {
  id: string;
  title: string;
  gradeLevel: string;
  subjectArea: string;
  description: string;
  icon?: string;
  thumbnail?: string;
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
      className="border rounded-xl flex flex-col justify-between transition-all duration-200 hover:shadow-lg overflow-hidden group h-full"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      <div>
        {/* Visual Lab Thumbnail Banner */}
        <div className="relative w-full h-36 bg-slate-900 overflow-hidden shrink-0">
          {sim.thumbnail ? (
            <img 
              src={sim.thumbnail} 
              alt={sim.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950">
              <span className="text-4xl opacity-50">🔬</span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Badges Over Image */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/90 text-white backdrop-blur-sm shadow-sm">
                {sim.subjectArea}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/80 text-slate-200 border border-slate-700/60 backdrop-blur-sm">
                {sim.gradeLevel}
              </span>
            </div>

            {sim.isPopular && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 backdrop-blur-sm shadow-sm">
                ★ Nổi bật
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <h4 className="text-base font-bold leading-snug tracking-tight mb-2 group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-main)' }}>
            {sim.title}
          </h4>

          <p className="text-xs opacity-75 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {sim.description}
          </p>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Mô phỏng PhET 2D
          </span>

          <button
            onClick={() => navigate(sim.route)}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer group-hover:translate-x-0.5"
          >
            <span>Vào Thí Nghiệm</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
