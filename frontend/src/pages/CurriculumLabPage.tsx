import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getCurriculumScenario } from '../data/curriculumScenarios.ts';
import { FreeFallLab } from './labs/FreeFallLab.tsx';
import { SpeedMeasurementLab } from './labs/SpeedMeasurementLab.tsx';
import { SpringMassLab } from './labs/SpringMassLab.tsx';
import { SlidingFrictionLab } from './labs/SlidingFrictionLab.tsx';
import { MomentumCollisionLab } from './labs/MomentumCollisionLab.tsx';
import { SimplePendulumLab } from './labs/SimplePendulumLab.tsx';
import { EmfInternalRLab } from './labs/EmfInternalRLab.tsx';
import { DcCircuitLab } from './labs/DcCircuitLab.tsx';
import { ElectromagneticInductionLab } from './labs/ElectromagneticInductionLab.tsx';
import { YoungInterferenceLab } from './labs/YoungInterferenceLab.tsx';
import { RefractionLab } from './labs/RefractionLab.tsx';
import { SoundResonanceLab } from './labs/SoundResonanceLab.tsx';
import { SpecificHeatLab } from './labs/SpecificHeatLab.tsx';
import { LatentHeatLab } from './labs/LatentHeatLab.tsx';
import { BoyleMariotteLab } from './labs/BoyleMariotteLab.tsx';

export const CurriculumLabPage: React.FC = () => {
  const { labId: paramLabId } = useParams<{ labId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  let resolvedLabId = paramLabId;
  if (!resolvedLabId) {
    const segment = location.pathname.replace('/lab/', '').trim();
    if (segment === 'speed-measurement') resolvedLabId = 'sim-speed-measurement';
    else if (segment === 'free-fall') resolvedLabId = 'sim-free-fall';
    else if (segment === 'sliding-friction' || segment === 'friction-coefficient') resolvedLabId = 'sim-friction-coefficient';
    else if (segment === 'momentum-collision') resolvedLabId = 'sim-momentum-collision';
    else if (segment === 'simple-pendulum') resolvedLabId = 'sim-simple-pendulum';
    else if (segment === 'spring-mass' || segment === 'hooke-law') resolvedLabId = 'sim-spring-mass';
    else if (segment === 'emf-internal-r') resolvedLabId = 'sim-emf-internal-r';
    else if (segment === 'dc-circuit') resolvedLabId = 'sim-dc-circuit';
    else if (segment === 'induction' || segment === 'electromagnetic-induction') resolvedLabId = 'sim-electromagnetic-induction';
    else if (segment === 'wave-interference' || segment === 'young-interference') resolvedLabId = 'sim-young-interference';
    else if (segment === 'refraction') resolvedLabId = 'sim-refraction';
    else if (segment === 'sound-resonance') resolvedLabId = 'sim-sound-resonance';
    else if (segment === 'specific-heat') resolvedLabId = 'sim-specific-heat';
    else if (segment === 'latent-heat') resolvedLabId = 'sim-latent-heat';
    else if (segment === 'boyle-mariotte') resolvedLabId = 'sim-boyle-mariotte';
    else resolvedLabId = `sim-${segment}`;
  }

  const scenario = getCurriculumScenario(resolvedLabId);

  if (!scenario) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700 p-6">
        <span className="text-5xl mb-3">⚠️</span>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy kịch bản bài thực hành: {resolvedLabId}</h2>
        <button
          type="button"
          onClick={() => navigate('/thu-vien')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          ← Quay Lại Thư Viện Bài Thí Nghiệm
        </button>
      </div>
    );
  }

  const renderLabContent = () => {
    switch (resolvedLabId) {
      case 'sim-free-fall':
        return <FreeFallLab />;
      case 'sim-speed-measurement':
        return <SpeedMeasurementLab />;
      case 'sim-spring-mass':
        return <SpringMassLab />;
      case 'sim-friction-coefficient':
        return <SlidingFrictionLab />;
      case 'sim-momentum-collision':
        return <MomentumCollisionLab />;
      case 'sim-simple-pendulum':
        return <SimplePendulumLab />;
      case 'sim-emf-internal-r':
        return <EmfInternalRLab />;
      case 'sim-dc-circuit':
        return <DcCircuitLab />;
      case 'sim-electromagnetic-induction':
        return <ElectromagneticInductionLab />;
      case 'sim-young-interference':
        return <YoungInterferenceLab />;
      case 'sim-refraction':
        return <RefractionLab />;
      case 'sim-sound-resonance':
        return <SoundResonanceLab />;
      case 'sim-specific-heat':
        return <SpecificHeatLab />;
      case 'sim-latent-heat':
        return <LatentHeatLab />;
      case 'sim-boyle-mariotte':
        return <BoyleMariotteLab />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl">
            <span className="text-5xl mb-4">🛠️</span>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Đang nâng cấp kiến trúc SceneryStack</h2>
            <p className="text-slate-500 max-w-md text-center text-sm">
              Bài thực hành {scenario.title} đang được triển khai. Vui lòng quay lại sau!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/thu-vien')}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Về Thư Viện"
          >
            ←
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>{scenario.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                Lớp {scenario.grade} • {scenario.chapter}
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 line-clamp-1">{scenario.objective}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/workbench/universal')}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200"
          >
            🧰 Mở Sandbox 2.0
          </button>
          <button
            type="button"
            onClick={() => alert('Đã nộp bài thành công! Điểm số và telemetry đã được gửi lên hệ thống.')}
            className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
          >
            📤 Nộp Bài
          </button>
        </div>
      </header>

      {/* Main Lab Canvas & Panels */}
      <main className="flex-1 p-4 flex gap-4 overflow-hidden min-h-0">
        {renderLabContent()}
      </main>
    </div>
  );
};
