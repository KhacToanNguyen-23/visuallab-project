import React, { useState } from 'react';

interface MeasurementRow {
  step: number;
  u: string; // Vôn
  i: string; // Ampe
}

interface VietnameseLabWorksheetProps {
  onComplete: (score: number, avgR: number, deltaR: number) => void;
}

export const VietnameseLabWorksheet: React.FC<VietnameseLabWorksheetProps> = ({ onComplete }) => {
  const [rows, setRows] = useState<MeasurementRow[]>([
    { step: 1, u: '', i: '' },
    { step: 2, u: '', i: '' },
    { step: 3, u: '', i: '' },
  ]);

  const [userAvgR, setUserAvgR] = useState<string>('');
  const [userDeltaR, setUserDeltaR] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{ pass: boolean; score: number; exactAvgR: number } | null>(null);

  const handleRowChange = (index: number, field: 'u' | 'i', val: string) => {
    const updated = [...rows];
    updated[index][field] = val;
    setRows(updated);
  };

  const handleSubmitWorksheet = () => {
    // Calculate R for each valid row R = U / I
    const rValues: number[] = [];
    rows.forEach(r => {
      const uVal = parseFloat(r.u);
      const iVal = parseFloat(r.i);
      if (!isNaN(uVal) && !isNaN(iVal) && iVal > 0) {
        rValues.push(uVal / iVal);
      }
    });

    if (rValues.length === 0) return;

    // Calculate exact average R
    const exactAvgR = rValues.reduce((a, b) => a + b, 0) / rValues.length;
    const parsedUserR = parseFloat(userAvgR);

    let score = 10;
    const errorMargin = Math.abs(parsedUserR - exactAvgR) / exactAvgR;

    if (errorMargin > 0.15) score = 5;
    else if (errorMargin > 0.05) score = 8;

    const isPass = score >= 7;

    setEvaluation({
      pass: isPass,
      score,
      exactAvgR: parseFloat(exactAvgR.toFixed(2)),
    });
    setSubmitted(true);

    onComplete(score, parseFloat(exactAvgR.toFixed(2)), 0.1);
  };

  return (
    <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <span>📋 Bảng Ghi Chép & Báo Cáo Số Liệu</span>
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
          Chương Trình GDPT 2018
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Đọc chỉ số Vôn kế (U) và Ampe kế (I) trên công cụ PhET trong 3 lần đo khác nhau và điền vào bảng:
      </p>

      {/* Measurement Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
              <th className="p-2 font-bold">Lần đo</th>
              <th className="p-2 font-bold">Hiệu điện thế U (V)</th>
              <th className="p-2 font-bold">Cường độ I (A)</th>
              <th className="p-2 font-bold">Điện trở R = U/I (\u03A9)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const uVal = parseFloat(row.u);
              const iVal = parseFloat(row.i);
              const rCalc = !isNaN(uVal) && !isNaN(iVal) && iVal > 0 ? (uVal / iVal).toFixed(2) : '-';

              return (
                <tr key={row.step} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                  <td className="p-2 font-semibold text-cyan-400">Lần {row.step}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="U (V)"
                      value={row.u}
                      onChange={e => handleRowChange(idx, 'u', e.target.value)}
                      className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="I (A)"
                      value={row.i}
                      onChange={e => handleRowChange(idx, 'i', e.target.value)}
                      className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </td>
                  <td className="p-2 font-bold text-emerald-400">{rCalc} \u03A9</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Calculations section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-semibold">
            Giá trị trung bình \u03A2 (\u03A9):
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="Tính \u03A2 trung bình"
            value={userAvgR}
            onChange={e => setUserAvgR(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-semibold">
            Sai số tuyệt đối \u0394R (\u03A9):
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Tính sai số \u0394R"
            value={userDeltaR}
            onChange={e => setUserDeltaR(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <button
        onClick={handleSubmitWorksheet}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer mt-1"
      >
        Nộp Phiếu Báo Cáo Thực Hành
      </button>

      {submitted && evaluation && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-1.5 ${
            evaluation.pass
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span>{evaluation.pass ? '🎉 ĐẠT KẾT QUẢ THỰC HÀNH' : '❌ CẦN TÍNH TOÁN LẠI SAI SỐ'}</span>
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-black/40 border border-current">
              {evaluation.score} / 10 ĐIỂM
            </span>
          </div>
          <p>Giá trị \u03A2 tính toán chuẩn: <strong>{evaluation.exactAvgR} \u03A9</strong></p>
        </div>
      )}
    </div>
  );
};
