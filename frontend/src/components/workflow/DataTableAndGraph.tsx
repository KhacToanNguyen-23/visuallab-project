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

  return (
    <div className="h-full w-full p-8 bg-slate-950 text-slate-100 flex flex-col gap-6 overflow-y-auto">
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
          <h4 className="font-bold text-sm text-slate-200">Bảng Số Liệu Đo SGK</h4>
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
            <span className="text-slate-400">Giá trị trung bình:</span>
            <span className="text-amber-400 font-bold">{avgY.toFixed(4)}</span>
          </div>
        </div>

        {/* Graph Preview & Final Result */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-slate-200">Đồ Thị Biểu Diễn Xu Hướng</h4>
            <div className="h-48 bg-slate-950 rounded-xl border border-slate-800 mt-3 flex items-center justify-center p-4">
              <span className="text-xs text-slate-500 font-mono">
                📈 Đồ thị trực quan hoá {xLabel} - {yLabel} (Linear Trendline)
              </span>
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
