import React from 'react';

interface PhetModalViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  simUrl: string;
}

export const PhetModalViewer: React.FC<PhetModalViewerProps> = ({
  isOpen,
  onClose,
  title,
  simUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl ring-1 ring-cyan-500/20">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#07090E] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-extrabold text-white tracking-wide">
              {title}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              Offline Self-Hosted PhET
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={simUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center gap-1 font-semibold"
            >
              <span>Mở Cửa Sổ Mới</span>
              <span className="text-sm">↗</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className="flex-1 bg-black relative">
          <iframe
            src={simUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
