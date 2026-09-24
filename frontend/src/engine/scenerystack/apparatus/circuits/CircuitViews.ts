/**
 * THIẾT BỊ MẠCH ĐIỆN & TỪ TRƯỜNG (DC CIRCUITS & MAGNETISM VIEWS)
 * 
 * Chuẩn hóa UI: Nguồn Pin DC, Biến trở con chạy, Khóa K, Đồng hồ đo V/A/G, Cuộn dây & Nam châm
 */

import { Node, Rectangle, Circle, Text, Line } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';

/**
 * 1. NGUỒN PIN DC (DC_POWER_SUPPLY)
 */
export class PowerSupplyView extends Node {
  public readonly casing: Rectangle;
  public readonly posTerminal: Circle;
  public readonly negTerminal: Circle;
  public readonly voltageText: Text;

  constructor(voltage = 1.5) {
    super();

    // Thân pin trụ chữ nhật (W=70, H=36)
    this.casing = new Rectangle(-35, -18, 70, 36, {
      fill: '#1E293B',
      stroke: '#0F172A',
      lineWidth: 2,
      cornerRadius: 4,
    });

    // Cực dương (+) bên phải màu đỏ
    this.posTerminal = new Circle(5, { fill: '#EF4444', stroke: '#991B1B', lineWidth: 1.5, x: 35, y: 0 });
    const posPlus = new Text('+', { font: new Font({ size: 10, weight: 'bold' }), fill: '#FFFFFF', centerX: 35, centerY: 0 });

    // Cực âm (-) bên trái màu đen
    this.negTerminal = new Circle(5, { fill: '#334155', stroke: '#0F172A', lineWidth: 1.5, x: -35, y: 0 });
    const negMinus = new Text('-', { font: new Font({ size: 12, weight: 'bold' }), fill: '#FFFFFF', centerX: -35, centerY: 0 });

    // Nhãn điện áp
    this.voltageText = new Text(`${voltage.toFixed(1)}V DC`, {
      font: new Font({ size: 10, weight: 'bold', family: 'sans-serif' }),
      fill: '#F59E0B',
      center: this.casing.center,
    });

    this.addChild(this.casing);
    this.addChild(this.posTerminal);
    this.addChild(this.negTerminal);
    this.addChild(posPlus);
    this.addChild(negMinus);
    this.addChild(this.voltageText);
  }
}

/**
 * 2. ĐỒNG HỒ ĐO ĐA NĂNG / VÔN KẾ / AMPE KẾ / ĐIỆN KẾ G
 */
export class MeterView extends Node {
  public readonly casing: Rectangle;
  public readonly displayScreen: Rectangle;
  public readonly valueText: Text;
  public readonly titleText: Text;
  public readonly posJack: Circle;
  public readonly negJack: Circle;

  constructor(type: 'VOLTMETER' | 'AMMETER' | 'GALVANOMETER' = 'VOLTMETER') {
    super();

    const colors = {
      VOLTMETER: { bg: '#EFF6FF', border: '#3B82F6', title: 'VÔN KẾ (V)', unit: 'V' },
      AMMETER: { bg: '#FEF2F2', border: '#EF4444', title: 'AMPE KẾ (mA)', unit: 'mA' },
      GALVANOMETER: { bg: '#F0FDF4', border: '#10B981', title: 'ĐIỆN KẾ G (μA)', unit: 'μA' },
    }[type];

    // Thân đồng hồ (W=90, H=55)
    this.casing = new Rectangle(-45, -27.5, 90, 55, {
      fill: colors.bg,
      stroke: colors.border,
      lineWidth: 2,
      cornerRadius: 6,
    });

    // Tiêu đề
    this.titleText = new Text(colors.title, {
      font: new Font({ size: 9, weight: 'bold' }),
      fill: '#1E293B',
      centerX: 0,
      y: -18,
    });

    // Màn hình LCD
    this.displayScreen = new Rectangle(-35, -7, 70, 20, {
      fill: '#0F172A',
      stroke: '#334155',
      lineWidth: 1.5,
      cornerRadius: 3,
    });

    this.valueText = new Text(`0.00 ${colors.unit}`, {
      font: new Font({ size: 10, weight: 'bold', family: 'monospace' }),
      fill: '#38BDF8',
      center: this.displayScreen.center,
    });

    // Giắc cắm đỏ (+) và đen (-)
    this.posJack = new Circle(4, { fill: '#EF4444', x: 22, y: 20 });
    this.negJack = new Circle(4, { fill: '#1E293B', x: -22, y: 20 });

    this.addChild(this.casing);
    this.addChild(this.titleText);
    this.addChild(this.displayScreen);
    this.addChild(this.valueText);
    this.addChild(this.posJack);
    this.addChild(this.negJack);
  }

  public setValue(val: number, unit = ''): void {
    this.valueText.string = `${val.toFixed(2)} ${unit}`;
  }
}

/**
 * 3. BIẾN TRỞ CON CHẠY (RHEOSTAT)
 */
export class RheostatView extends Node {
  public readonly casing: Rectangle;
  public readonly sliderHandle: Rectangle;
  public readonly coilLines: Node;
  public readonly valueText: Text;

  constructor(maxR = 100) {
    super();

    // Thân sứ cách điện (W=120, H=30)
    this.casing = new Rectangle(-60, -15, 120, 30, {
      fill: '#F1F5F9',
      stroke: '#64748B',
      lineWidth: 2,
      cornerRadius: 4,
    });

    // Cuộn dây kim loại quấn vòng
    this.coilLines = new Node();
    for (let x = -50; x <= 50; x += 6) {
      this.coilLines.addChild(new Line(x, -10, x, 10, { stroke: '#B45309', lineWidth: 1.5 }));
    }

    // Cần gạt con chạy (Slider handle)
    this.sliderHandle = new Rectangle(-6, -18, 12, 36, {
      fill: '#3B82F6',
      stroke: '#1D4ED8',
      lineWidth: 1.5,
      cornerRadius: 2,
    });

    this.valueText = new Text(`R = 50.0 Ω / ${maxR}Ω`, {
      font: new Font({ size: 9, weight: 'bold', family: 'monospace' }),
      fill: '#1E293B',
      centerX: 0,
      y: 24,
    });

    this.addChild(this.casing);
    this.addChild(this.coilLines);
    this.addChild(this.sliderHandle);
    this.addChild(this.valueText);
  }

  public setSliderRatio(ratio: number, rValue: number): void {
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    this.sliderHandle.x = -50 + clampedRatio * 100;
    this.valueText.string = `R = ${rValue.toFixed(1)} Ω`;
  }
}

/**
 * 4. KHÓA K (CIRCUIT_SWITCH)
 */
export class SwitchView extends Node {
  public readonly baseRect: Rectangle;
  public readonly leverLine: Line;
  public readonly statusText: Text;

  constructor() {
    super();

    this.baseRect = new Rectangle(-30, -10, 60, 20, {
      fill: '#E2E8F0',
      stroke: '#475569',
      lineWidth: 1.5,
      cornerRadius: 3,
    });

    const contact1 = new Circle(3, { fill: '#EF4444', x: -18, y: 0 });
    const contact2 = new Circle(3, { fill: '#EF4444', x: 18, y: 0 });

    this.leverLine = new Line(-18, 0, 15, -12, {
      stroke: '#1E293B',
      lineWidth: 2.5,
    });

    this.statusText = new Text('MỞ [OFF]', {
      font: new Font({ size: 8, weight: 'bold' }),
      fill: '#EF4444',
      centerX: 0,
      y: 16,
    });

    this.addChild(this.baseRect);
    this.addChild(contact1);
    this.addChild(contact2);
    this.addChild(this.leverLine);
    this.addChild(this.statusText);
  }

  public setClosed(closed: boolean): void {
    if (closed) {
      this.leverLine.setLine(-18, 0, 18, 0);
      this.statusText.string = 'ĐÓNG [ON]';
      this.statusText.fill = '#10B981';
    } else {
      this.leverLine.setLine(-18, 0, 15, -12);
      this.statusText.string = 'MỞ [OFF]';
      this.statusText.fill = '#EF4444';
    }
  }
}

/**
 * 5. NAM CHÂM VĨNH CỬU & CUỘN DÂY CẢM ỨNG (BAR_MAGNET & INDUCTION_COIL)
 */
export class BarMagnetView extends Node {
  constructor() {
    super();

    // Cực Bắc (N - Đỏ)
    const northPole = new Rectangle(-40, -12, 40, 24, { fill: '#EF4444', stroke: '#991B1B', lineWidth: 1.5 });
    const northLabel = new Text('N', { font: new Font({ size: 12, weight: 'bold' }), fill: '#FFFFFF', centerX: -20, centerY: 0 });

    // Cực Nam (S - Xanh)
    const southPole = new Rectangle(0, -12, 40, 24, { fill: '#3B82F6', stroke: '#1D4ED8', lineWidth: 1.5 });
    const southLabel = new Text('S', { font: new Font({ size: 12, weight: 'bold' }), fill: '#FFFFFF', centerX: 20, centerY: 0 });

    this.addChild(northPole);
    this.addChild(southPole);
    this.addChild(northLabel);
    this.addChild(southLabel);
  }
}

export class InductionCoilView extends Node {
  constructor() {
    super();

    // Ống cuộn dây quấn đồng (W=80, H=50)
    const core = new Rectangle(-40, -25, 80, 50, {
      fill: 'rgba(254, 243, 199, 0.4)',
      stroke: '#CA8A04',
      lineWidth: 2,
      cornerRadius: 4,
    });

    const coilTurns = new Node();
    for (let x = -30; x <= 30; x += 10) {
      coilTurns.addChild(new Line(x, -22, x, 22, { stroke: '#B45309', lineWidth: 3 }));
    }

    const label = new Text('N = 500 vòng', {
      font: new Font({ size: 9, weight: 'bold' }),
      fill: '#78350F',
      centerX: 0,
      y: 34,
    });

    this.addChild(core);
    this.addChild(coilTurns);
    this.addChild(label);
  }
}
