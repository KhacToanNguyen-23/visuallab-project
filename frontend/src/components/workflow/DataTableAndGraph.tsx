import React from 'react';

export interface MeasurementRecord {
  index: number;
  paramX: number; // e.g. distance s or resistance R
  paramY: number; // e.g. measured time t or voltage U
}

interface Props {
  records: MeasurementRecord[];
  xLabel: string;
  yLabel: string;
  calculatedResult: string;
}

export const DataTableAndGraph: React.FC<Props> = ({
  records,
  xLabel,
  yLabel,
  calculatedResult,
}) => {
  const avgY =
    records.length > 0
      ? records.reduce((acc, r) => acc + r.paramY, 0) / records.length
      : 0;

  // Calculate SVG Graph Coordinates
  const svgWidth = 400;
  const svgHeight = 180;
  const margin = 30;
  const plotWidth = svgWidth - margin * 2;
  const plotHeight = svgHeight - margin * 2;

  const maxX = Math.max(...records.map(r => r.paramX), 10);
  const minX = Math.min(...records.map(r => r.paramX), 0);
  const maxY = Math.max(...records.map(r => r.paramY), 10);
  const minY = Math.min(...records.map(r => r.paramY), 0);

  const getSvgX = (val: number) => {
    const range = maxX - minX || 1;
    return margin + ((val - minX) / range) * plotWidth;
  };

  const getSvgY = (val: number) => {
    const range = maxY - minY || 1;
    return svgHeight - margin - ((val - minY) / range) * plotHeight;
  };

  const sortedPoints = [...records].sort((a, b) => a.paramX - b.paramX);
  const pathD = sortedPoints.reduce((acc, pt, idx) => {
    const x = getSvgX(pt.paramX);
    const y = getSvgY(pt.paramY);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="h-full w-full p-8 bg-slate-950 text-slate-100 flex flex-col gap-6 overflow-y-auto font-sans">
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Bước 4: Bảng Số Liệu & Xử Lý Kết Quả Thực Hành
        </span>
        <h3 className="text-2xl font-bold text-white mt-1">
          Bảng Kết Quả Đo & Đồ Thị Xu Hướng
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <h4 className="font-bold text-sm text-slate-200">Bảng Số Liệu Đo SGK GDPT 2018</h4>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="p-2">Lần đo</th>
                <th className="p-2">{xLabel}</th>
                <th className="p-2">{yLabel}</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-500">
                    Chưa có số liệu. Hãy chuyển về Bước 3 để tiến hành đo!
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800/60 font-mono">
                    <td className="p-2 font-bold text-slate-300">#{i + 1}</td>
                    <td className="p-2 text-cyan-400">{r.paramX}</td>
                    <td className="p-2 text-emerald-400">{r.paramY}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between text-xs font-mono">
            <span className="text-slate-400">Giá trị trung bình Y:</span>
            <span className="text-amber-400 font-bold">{avgY.toFixed(4)}</span>
          </div>
        </div>

        {/* Dynamic Realtime Live SVG Graph */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-200">Đồ Thị Động Thời Gian Thực</h4>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full font-mono">
                Live Data Plot
              </span>
            </div>

            <div className="h-52 bg-slate-950 rounded-xl border border-slate-800 mt-3 flex items-center justify-center p-3 relative">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                {/* Axes */}
                <line x1={margin} y1={svgHeight - margin} x2={svgWidth - margin} y2={svgHeight - margin} stroke="#475569" strokeWidth="1.5" />
                <line x1={margin} y1={margin} x2={margin} y2={svgHeight - margin} stroke="#475569" strokeWidth="1.5" />
                <text x={svgWidth - margin + 4} y={svgHeight - margin + 4} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">{xLabel}</text>
                <text x={margin - 10} y={margin - 6} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">{yLabel}</text>

                {/* Gridlines */}
                <line x1={margin} y1={(svgHeight) / 2} x2={svgWidth - margin} y2={(svgHeight) / 2} stroke="#334155" strokeDasharray="3 3" />
                <line x1={(svgWidth) / 2} y1={margin} x2={(svgWidth) / 2} y2={svgHeight - margin} stroke="#334155" strokeDasharray="3 3" />

                {/* Curve Line */}
                {records.length > 1 && (
                  <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Plot Data Points */}
                {records.map((pt, idx) => {
                  const cx = getSvgX(pt.paramX);
                  const cy = getSvgY(pt.paramY);
                  return (
                    <g key={idx}>
                      <circle cx={cx} cy={cy} r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                      <text x={cx + 6} y={cy - 6} fill="#38bdf8" fontSize="9" className="font-mono">{`(${pt.paramX}, ${pt.paramY})`}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-950/60 to-cyan-950/60 rounded-xl border border-blue-800/40 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">
              Kết Quả Đo Cuối Cùng (Kèm Sai Số)
            </span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {calculatedResult}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
