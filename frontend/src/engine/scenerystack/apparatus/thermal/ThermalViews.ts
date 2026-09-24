/**
 * NHIỆT HỌC & KHÍ LÝ TƯỞNG (THERMAL & GAS VIEWS)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 3: Nhiệt dung riêng, Bài 4: Nóng chảy, Bài 7: Boyle - Mariotte)
 */

import { Node, Rectangle, Circle, Text, Line } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';

/**
 * 1. BÌNH NHIỆT LƯỢNG KẾ & DÂY NUNG (CALORIMETER)
 */
export class CalorimeterView extends Node {
  public readonly outerVessel: Rectangle;
  public readonly innerCup: Rectangle;
  public readonly waterNode: Rectangle;
  public readonly heatingCoil: Node;
  public readonly tempDisplay: Text;

  constructor() {
    super();

    // Vỏ ngoài cách nhiệt bằng xốp trắng (W=120, H=140)
    this.outerVessel = new Rectangle(-60, -70, 120, 140, {
      fill: '#F1F5F9',
      stroke: '#94A3B8',
      lineWidth: 2,
      cornerRadius: 6,
    });

    // Cốc nhôm bên trong (W=90, H=110)
    this.innerCup = new Rectangle(-45, -55, 90, 110, {
      fill: '#E2E8F0',
      stroke: '#64748B',
      lineWidth: 1.5,
      cornerRadius: 4,
    });

    // Lớp nước bên trong (W=84, H=75)
    this.waterNode = new Rectangle(-42, -20, 84, 70, {
      fill: '#38BDF8',
      opacity: 0.7,
      cornerRadius: 3,
    });

    // Dây may-so gia nhiệt
    this.heatingCoil = new Node();
    for (let y = -10; y <= 35; y += 8) {
      this.heatingCoil.addChild(new Line(-25, y, 25, y + 4, { stroke: '#DC2626', lineWidth: 2 }));
    }

    this.tempDisplay = new Text('T = 25.0 °C', {
      font: new Font({ size: 10, weight: 'bold', family: 'monospace' }),
      fill: '#0F172A',
      centerX: 0,
      y: 84,
    });

    this.addChild(this.outerVessel);
    this.addChild(this.innerCup);
    this.addChild(this.waterNode);
    this.addChild(this.heatingCoil);
    this.addChild(this.tempDisplay);
  }

  public setTemperature(tempC: number): void {
    this.tempDisplay.string = `T = ${tempC.toFixed(1)} °C`;
  }
}

/**
 * 2. XY-LANH KHÍ NÉN PÍT-TÔNG (GAS_CYLINDER_PISTON)
 */
export class GasPistonView extends Node {
  public readonly cylinderBody: Rectangle;
  public readonly pistonHead: Rectangle;
  public readonly pistonRod: Rectangle;
  public readonly gasVolume: Rectangle;
  public readonly volumeText: Text;

  constructor(maxV = 100) {
    super();

    // Thân xy-lanh trong suốt có vạch chia (W=80, H=160)
    this.cylinderBody = new Rectangle(-40, -80, 80, 160, {
      fill: 'rgba(248, 250, 252, 0.4)',
      stroke: '#334155',
      lineWidth: 2.5,
      cornerRadius: 4,
    });

    // Khí bên trong xy-lanh
    this.gasVolume = new Rectangle(-37, -20, 74, 98, {
      fill: '#FDE047',
      opacity: 0.4,
    });

    // Piston chặn khí
    this.pistonHead = new Rectangle(-37, -25, 74, 10, {
      fill: '#1E293B',
      stroke: '#0F172A',
      lineWidth: 1.5,
      cornerRadius: 2,
    });

    // Cần đẩy piston
    this.pistonRod = new Rectangle(-4, -80, 8, 60, {
      fill: '#64748B',
      stroke: '#475569',
      lineWidth: 1,
    });

    this.volumeText = new Text(`V = 60.0 cm³ / ${maxV}`, {
      font: new Font({ size: 9, weight: 'bold', family: 'monospace' }),
      fill: '#1E293B',
      centerX: 0,
      y: 95,
    });

    this.addChild(this.cylinderBody);
    this.addChild(this.gasVolume);
    this.addChild(this.pistonHead);
    this.addChild(this.pistonRod);
    this.addChild(this.volumeText);
  }

  public setVolume(vCm3: number, maxV = 100): void {
    const ratio = Math.max(0.2, Math.min(1.0, vCm3 / maxV));
    const gasH = ratio * 140;
    const topY = 78 - gasH;

    this.gasVolume.setRect(-37, topY, 74, gasH);
    this.pistonHead.y = topY - 10 - (-25);
    this.pistonRod.y = topY - 60 - (-80);
    this.volumeText.string = `V = ${vCm3.toFixed(1)} cm³`;
  }
}

/**
 * 3. ÁP KẾ CƠ ĐO ÁP SUẤT (PRESSURE_GAUGE)
 */
export class PressureGaugeView extends Node {
  public readonly dialCircle: Circle;
  public readonly needleLine: Line;
  public readonly readingText: Text;

  constructor() {
    super();

    // Mặt đồng hồ tròn (R=35)
    this.dialCircle = new Circle(35, {
      fill: '#FFFFFF',
      stroke: '#1E293B',
      lineWidth: 2,
    });

    // Kim chỉ áp kế màu đỏ
    this.needleLine = new Line(0, 0, 0, -25, {
      stroke: '#DC2626',
      lineWidth: 2,
    });

    this.readingText = new Text('P = 1.00 bar', {
      font: new Font({ size: 9, weight: 'bold', family: 'monospace' }),
      fill: '#0F172A',
      centerX: 0,
      y: 45,
    });

    this.addChild(this.dialCircle);
    this.addChild(this.needleLine);
    this.addChild(this.readingText);
  }

  public setPressure(pBar: number): void {
    const maxP = 3.0; // bar
    const angleRad = ((pBar / maxP) * 240 - 120) * (Math.PI / 180);
    const needleLen = 25;
    this.needleLine.setLine(0, 0, needleLen * Math.sin(angleRad), -needleLen * Math.cos(angleRad));
    this.readingText.string = `P = ${pBar.toFixed(2)} bar`;
  }
}
