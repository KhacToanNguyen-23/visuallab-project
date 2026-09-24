import React from 'react';
import { useFreeFallStore } from '../../store/useFreeFallStore.ts';

export const DataTablePanel: React.FC = () => {
  const measurements = useFreeFallStore((state) => state.measurements);
  const clearMeasurements = useFreeFallStore((state) => state.clearMeasurements);

  const averageG =
    measurements.length > 0
      ? (measurements.reduce((sum, r) => sum + r.gCalculated, 0) / measurements.length).toFixed(3)
      : '0.000';

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-slate-200/80 p-4 flex flex-col gap-4 select-none h-full overflow-y-auto">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>📊</span> Bảng Số Liệu Thực Hành
        </h3>
        <p className="text-xs text-slate-500">Khảo sát rơi tự do - Đo gia tốc trọng trường g</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={clearMeasurements}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors flex-1"
        >
          Xoá Bảng Số Liệu
        </button>
      </div>

      {/* Measurements Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2 px-2 text-center">Lần</th>
              <th className="py-2 px-2 text-right">s (m)</th>
              <th className="py-2 px-2 text-right">t (s)</th>
              <th className="py-2 px-2 text-right">g (m/s²)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {measurements.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400">
                  Chưa có số liệu. Bấm "Thả Bi" để ghi nhận.
                </td>
              </tr>
            ) : (
              measurements.map((row, index) => (
                <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2 px-2 text-center font-bold text-slate-900">{index + 1}</td>
                  <td className="py-2 px-2 text-right">{row.distance.toFixed(3)}</td>
                  <td className="py-2 px-2 text-right text-sky-600 font-medium">{row.deltaTime.toFixed(3)}</td>
                  <td className="py-2 px-2 text-right font-bold text-emerald-600">
                    {row.gCalculated.toFixed(3)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stat */}
      {measurements.length > 0 && (
        <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-xs mt-auto">
          <span className="font-semibold text-slate-600">Gia tốc trung bình $\bar{'{g}'}$:</span>
          <span className="text-sm font-bold text-emerald-600">{averageG} m/s²</span>
        </div>
      )}
    </div>
  );
};
