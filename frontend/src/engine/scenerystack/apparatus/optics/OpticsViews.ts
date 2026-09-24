/**
 * QUANG HỌC & ÂM HỌC (OPTICS & ACOUSTICS VIEWS)
 * 
 * Chuẩn hóa theo SGK GDPT 2018:
 * - Nguồn Laser RGB, Khe kép Y-âng, Màn hứng vân giao thoa, Khối bán trụ thủy tinh, Ống cộng hưởng âm
 */

import { Node, Rectangle, Circle, Text, Line } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';

/**
 * 1. NGUỒN PHÁT LASER (LASER_SOURCE_RGB)
 */
export class LaserView extends Node {
  public readonly casing: Rectangle;
  public readonly aperture: Circle;
  public readonly beamLine: Line;
  public readonly wavelengthText: Text;

  constructor(wavelengthNm = 650) {
    super();

    // Thân máy phát laser nhôm đen (W=80, H=32)
    this.casing = new Rectangle(-40, -16, 80, 32, {
      fill: '#1E293B',
      stroke: '#0F172A',
      lineWidth: 2,
      cornerRadius: 4,
    });

    // Đầu phát laser (Aperture) bên phải
    this.aperture = new Circle(4, { fill: '#EF4444', x: 40, y: 0 });

    // Tia laser phát ra
    this.beamLine = new Line(40, 0, 160, 0, {
      stroke: '#EF4444',
      lineWidth: 2.5,
    });

    this.wavelengthText = new Text(`λ = ${wavelengthNm}nm`, {
      font: new Font({ size: 9, weight: 'bold', family: 'monospace' }),
      fill: '#F87171',
      center: this.casing.center,
    });

    this.addChild(this.beamLine);
    this.addChild(this.casing);
    this.addChild(this.aperture);
    this.addChild(this.wavelengthText);
  }

  public setWavelength(lambda: number): void {
    const color = lambda >= 620 ? '#EF4444' : lambda >= 500 ? '#10B981' : '#3B82F6';
    this.aperture.fill = color;
    this.beamLine.stroke = color;
    this.wavelengthText.string = `λ = ${lambda}nm`;
    this.wavelengthText.fill = color;
  }
}

/**
 * 2. KHE KÉP Y-ÂNG (YOUNG_DOUBLE_SLIT)
 */
export class YoungSlitView extends Node {
  public readonly plate: Rectangle;
  public readonly label: Text;

  constructor(slitDistMm = 0.5) {
    super();

    // Bản chắn khe kép kim loại đen (W=16, H=70)
    this.plate = new Rectangle(-8, -35, 16, 70, {
      fill: '#334155',
      stroke: '#0F172A',
      lineWidth: 1.5,
    });

    // 2 vạch khe sáng song song
    const slit1 = new Line(0, -6, 0, -2, { stroke: '#FFFFFF', lineWidth: 1 });
    const slit2 = new Line(0, 2, 0, 6, { stroke: '#FFFFFF', lineWidth: 1 });

    this.label = new Text(`a = ${slitDistMm}mm`, {
      font: new Font({ size: 9, weight: 'bold' }),
      fill: '#1E293B',
      centerX: 0,
      y: 44,
    });

    this.addChild(this.plate);
    this.addChild(slit1);
    this.addChild(slit2);
    this.addChild(this.label);
  }

  public setSlitDistance(a: number): void {
    this.label.string = `a = ${a}mm`;
  }
}

/**
 * 3. MÀN HỨNG VÂN & THƯỚC KẸP VI SAI (FRINGE_SCREEN & CALIPER)
 */
export class FringeScreenView extends Node {
  public readonly screenBg: Rectangle;
  public readonly fringesGroup: Node;
  public readonly caliperLine: Line;
  public readonly caliperText: Text;

  constructor() {
    super();

    // Màn chắn màu trắng xám (W=240, H=120)
    this.screenBg = new Rectangle(-120, -60, 240, 120, {
      fill: '#0F172A',
      stroke: '#475569',
      lineWidth: 2,
      cornerRadius: 6,
    });

    this.fringesGroup = new Node();

    // Con trỏ thước kẹp di động màu vàng
    this.caliperLine = new Line(0, -55, 0, 55, {
      stroke: '#FACC15',
      lineWidth: 2,
    });

    this.caliperText = new Text('x = 0.00 mm', {
      font: new Font({ size: 9, weight: 'bold', family: 'monospace' }),
      fill: '#FACC15',
      centerX: 0,
      y: 68,
    });

    this.addChild(this.screenBg);
    this.addChild(this.fringesGroup);
    this.addChild(this.caliperLine);
    this.addChild(this.caliperText);
  }

  public renderFringes(lambdaNm: number, aMm: number, dM: number): void {
    this.fringesGroup.removeAllChildren();
    // Khoảng vân i = lambda * D / a (mm)
    const iMm = (lambdaNm * 1e-6 * dM * 1000) / (aMm); // mm
    const pxPerMm = 12; // 1mm = 12px

    const color = lambdaNm >= 620 ? '#EF4444' : lambdaNm >= 500 ? '#10B981' : '#3B82F6';

    // Vẽ 11 vân sáng lân cận vân trung tâm
    for (let k = -5; k <= 5; k++) {
      const x = k * iMm * pxPerMm;
      if (Math.abs(x) < 110) {
        const fringe = new Rectangle(x - 3, -50, 6, 100, {
          fill: color,
          opacity: k === 0 ? 0.95 : Math.max(0.3, 0.9 - Math.abs(k) * 0.12),
        });
        this.fringesGroup.addChild(fringe);
      }
    }
  }

  public setCaliperX(xMm: number): void {
    const pxPerMm = 12;
    this.caliperLine.x = xMm * pxPerMm;
    this.caliperText.x = xMm * pxPerMm;
    this.caliperText.string = `x = ${xMm.toFixed(2)} mm`;
  }
}

/**
 * 4. BÁN TRỤ THỦY TINH & ĐĨA CHIA ĐỘ (GLASS_REFRACTOR)
 */
export class GlassRefractorView extends Node {
  public readonly discCircle: Circle;
  public readonly incidentRay: Line;
  public readonly refractedRay: Line;
  public readonly normalLine: Line;

  constructor() {
    super();

    // Đĩa chia độ tròn 360 độ màu trắng ngà
    this.discCircle = new Circle(80, {
      fill: '#F8FAFC',
      stroke: '#94A3B8',
      lineWidth: 2,
    });

    // Vạch pháp tuyến N-N'
    this.normalLine = new Line(0, -75, 0, 75, {
      stroke: '#64748B',
      lineWidth: 1.5,
    });

    // Bán trụ thủy tinh (n = 1.5)
    const semiCylinder = new Circle(60, {
      fill: 'rgba(186, 230, 253, 0.65)',
      stroke: '#0284C7',
      lineWidth: 2,
    });

    this.incidentRay = new Line(-70, -70, 0, 0, { stroke: '#EF4444', lineWidth: 2.5 });
    this.refractedRay = new Line(0, 0, 40, 60, { stroke: '#EF4444', lineWidth: 2.5 });

    this.addChild(this.discCircle);
    this.addChild(this.normalLine);
    this.addChild(semiCylinder);
    this.addChild(this.incidentRay);
    this.addChild(this.refractedRay);
  }

  public setRays(angleInDeg: number, nMedium = 1.5): void {
    const angleInRad = (angleInDeg * Math.PI) / 180;
    const sinR = Math.sin(angleInRad) / nMedium;
    const angleRefrRad = Math.asin(sinR);

    const len = 70;
    const inX = -len * Math.sin(angleInRad);
    const inY = -len * Math.cos(angleInRad);

    const refrX = len * Math.sin(angleRefrRad);
    const refrY = len * Math.cos(angleRefrRad);

    this.incidentRay.setLine(inX, inY, 0, 0);
    this.refractedRay.setLine(0, 0, refrX, refrY);
  }
}

/**
 * 5. ỐNG CỘNG HƯỞNG ÂM (RESONANCE_TUBE)
 */
export class ResonanceTubeView extends Node {
  public readonly tubeOuter: Rectangle;
  public readonly waterColumn: Rectangle;
  public readonly wavePattern: Node;
  public readonly levelText: Text;

  constructor() {
    super();

    // Ống thủy tinh dài trong suốt (W=30, H=220)
    this.tubeOuter = new Rectangle(-15, -110, 30, 220, {
      fill: 'rgba(241, 245, 249, 0.4)',
      stroke: '#475569',
      lineWidth: 2,
      cornerRadius: 4,
    });

    // Cột nước màu xanh ngọc dâng hạ
    this.waterColumn = new Rectangle(-13, 0, 26, 108, {
      fill: '#38BDF8',
      opacity: 0.7,
    });

    this.wavePattern = new Node();

    this.levelText = new Text('L = 34.0 cm', {
      font: new Font({ size: 9, weight: 'bold', family: 'monospace' }),
      fill: '#0369A1',
      centerX: 0,
      y: 122,
    });

    this.addChild(this.tubeOuter);
    this.addChild(this.waterColumn);
    this.addChild(this.wavePattern);
    this.addChild(this.levelText);
  }

  public setWaterLevel(airLengthCm: number): void {
    const totalH = 220;
    const airH = (airLengthCm / 100) * totalH;
    const waterH = totalH - airH;

    this.waterColumn.setRect(-13, -110 + airH, 26, waterH);
    this.levelText.string = `L = ${airLengthCm.toFixed(1)} cm`;
  }
}
