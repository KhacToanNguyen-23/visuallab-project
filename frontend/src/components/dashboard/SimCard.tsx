import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface SimItem {
  id: string;
  title: string;
  gradeLevel: string;
  subjectArea: string;
  description: string;
  icon: string;
  route: string;
  isPopular?: boolean;
}

interface SimCardProps {
  sim: SimItem;
}

export const SimCard: React.FC<SimCardProps> = ({ sim }) => {
  const navigate = useNavigate();

  return (
    <div className="p-1 rounded-[2rem] bg-white/[0.03] border border-white/10 ring-1 ring-black/40 shadow-2xl transition-all duration-500 hover:border-cyan-500/40 hover:scale-[1.02] group relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition duration-700" />

      <div className="bg-[#0A0E17]/90 p-6 rounded-[calc(2rem-0.25rem)] flex flex-col justify-between gap-5 h-full relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
        <div>
          {/* Eyebrow Micro Badges */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full shadow-sm">
                {sim.subjectArea}
              </span>
              <span className="text-[9px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                {sim.gradeLevel}
              </span>
            </div>

            {sim.isPopular && (
              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🔥 Phổ Biến
              </span>
            )}
          </div>

          {/* Title & Icon Header */}
          <div className="flex justify-between items-start gap-3">
            <h4 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors duration-300 leading-snug tracking-tight">
              {sim.title}
            </h4>
            <div className="w-12 h-12 rounded-[1.25rem] bg-[#05070C] border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-110 group-hover:border-cyan-500/40 transition duration-500">
              {sim.icon}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3 font-normal">
            {sim.description}
          </p>
        </div>

        {/* Nested CTA & Button-in-Button Architecture */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-3">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Canvas 2D Engine
          </span>

          <button
            onClick={() => navigate(sim.route)}
            className="group/btn relative inline-flex items-center justify-center pl-5 pr-2 py-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span className="mr-2">Khởi Chạy</span>
            <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-xs shadow-inner group-hover/btn:translate-x-0.5 transition duration-300">
              ▶
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
