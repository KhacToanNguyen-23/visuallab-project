/**
 * ĐỒNG HỒ ĐO THỜI GIAN HIỆN SỐ (DIGITAL_TIMER VIEW)
 * 
 * Chuẩn hóa thiết bị phòng thí nghiệm GDPT 2018:
 * - Màn hình LCD 7 đoạn hiển thị t_A, t_B, Δt chính xác tới 0.001s.
 * - 3 ổ cắm tín hiệu: Ổ Nam Châm Điện, Ổ Cổng A, Ổ Cổng B.
 * - Phím bấm chức năng: RESET, CHỌN CHẾ ĐỘ MODE (A↔B, A+B).
 */

import { Node, Rectangle, Text, Circle } from 'scenerystack/scenery';

export interface DigitalTimerViewOptions {
  onReset?: () => void;
  onModeToggle?: () => void;
}

export class DigitalTimerView extends Node {
  private bodyRect: Rectangle;
  private lcdScreen: Rectangle;
  private timeDisplay: Text;
  private modeLabel: Text;
  
  public magnetJack: Node;
  public gateAJack: Node;
  public gateBJack: Node;

  public currentMode: 'A_TO_B' | 'A' | 'B' = 'A_TO_B';
  public displayedTime = 0.000;

  constructor(options: DigitalTimerViewOptions = {}) {
    super();

    // 1. Vỏ máy kim loại/nhựa công nghiệp (W=180, H=120)
    this.bodyRect = new Rectangle(-90, -60, 180, 120, 8, 8, {
      fill: '#1E293B',
      stroke: '#334155',
      lineWidth: 2,
    });

    // 2. Màn hình LCD nền xanh đen hiển thị số dạ quang
    this.lcdScreen = new Rectangle(-75, -45, 150, 45, 4, 4, {
      fill: '#022C22',
      stroke: '#065F46',
      lineWidth: 1.5,
    });

    this.timeDisplay = new Text('0.000 s', {
      font: 'bold 22px monospace',
      fill: '#34D399',
      centerX: 0,
      centerY: -22,
    });

    this.modeLabel = new Text('MODE: A ➔ B (Δt)', {
      font: 'bold 9px sans-serif',
      fill: '#6EE7B7',
      centerX: 0,
      centerY: -4,
    });

    // 3. 3 Giắc cắm kết nối dây tín hiệu
    // Cổng Nam châm
    this.magnetJack = new Node({ x: -50, y: 35 });
    const magHole = new Circle(6, { fill: '#DC2626', stroke: '#991B1B', lineWidth: 1.5 });
    const magText = new Text('NAM CHÂM', { font: 'bold 7px sans-serif', fill: '#94A3B8', centerX: 0, top: 8 });
    this.magnetJack.addChild(magHole);
    this.magnetJack.addChild(magText);

    // Cổng A
    this.gateAJack = new Node({ x: 0, y: 35 });
    const gateAHole = new Circle(6, { fill: '#3B82F6', stroke: '#1D4ED8', lineWidth: 1.5 });
    const gateAText = new Text('CỔNG A', { font: 'bold 7px sans-serif', fill: '#94A3B8', centerX: 0, top: 8 });
    this.gateAJack.addChild(gateAHole);
    this.gateAJack.addChild(gateAText);

    // Cổng B
    this.gateBJack = new Node({ x: 50, y: 35 });
    const gateBHole = new Circle(6, { fill: '#F59E0B', stroke: '#B45309', lineWidth: 1.5 });
    const gateBText = new Text('CỔNG B', { font: 'bold 7px sans-serif', fill: '#94A3B8', centerX: 0, top: 8 });
    this.gateBJack.addChild(gateBHole);
    this.gateBJack.addChild(gateBText);

    // 4. Phím RESET
    const resetBtn = new Node({ x: 60, y: 12, cursor: 'pointer' });
    const rBg = new Rectangle(-18, -7, 36, 14, 2, 2, { fill: '#E2E8F0', stroke: '#94A3B8', lineWidth: 1 });
    const rText = new Text('RESET', { font: 'bold 7px sans-serif', fill: '#0F172A', centerX: 0, centerY: 0 });
    resetBtn.addChild(rBg);
    resetBtn.addChild(rText);
    resetBtn.addInputListener({
      down: () => {
        this.setTime(0);
        options.onReset?.();
      },
    });

    this.addChild(this.bodyRect);
    this.addChild(this.lcdScreen);
    this.addChild(this.timeDisplay);
    this.addChild(this.modeLabel);
    this.addChild(this.magnetJack);
    this.addChild(this.gateAJack);
    this.addChild(this.gateBJack);
    this.addChild(resetBtn);
  }

  public setTime(seconds: number): void {
    this.displayedTime = seconds;
    this.timeDisplay.string = `${seconds.toFixed(3)} s`;
  }

  public getTime(): number {
    return this.displayedTime;
  }
}
