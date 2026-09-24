import { Node, Rectangle, Path, Text, Line, DragListener, Circle } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

export interface InclinedPlaneViewOptions {
  trackLengthPx?: number; // Độ dài hiển thị máng (px), mặc định 700px = 1.0m
  onAngleChange?: (angleDeg: number) => void;
}

export class InclinedPlaneView extends Node {
  public trackNode: Node;
  public baseNode: Node;
  public clampNode: Node;
  public angleTextNode: Text;

  private trackLengthPx: number;
  private onAngleChange?: (angleDeg: number) => void;

  constructor(options?: InclinedPlaneViewOptions) {
    super();

    this.trackLengthPx = options?.trackLengthPx || 700;
    this.onAngleChange = options?.onAngleChange;

    // 1. Chân đế cố định (Base Support)
    this.baseNode = new Node();
    const groundLine = new Line(-50, 480, 850, 480, { stroke: '#64748b', lineWidth: 4 });
    const pivotStand = new Rectangle(50, 100, 20, 380, 2, 2, { fill: '#475569', stroke: '#1e293b', lineWidth: 2 });
    const pivotBase = new Rectangle(20, 470, 80, 16, 4, 4, { fill: '#334155' });
    this.baseNode.addChild(groundLine);
    this.baseNode.addChild(pivotStand);
    this.baseNode.addChild(pivotBase);
    this.addChild(this.baseNode);

    // 2. Khớp kẹp nâng hạ độ cao (Draggable Clamp Handle)
    this.clampNode = new Node({ x: 60, y: 210 });
    const clampBody = new Rectangle(-18, -12, 36, 24, 4, 4, {
      fill: '#f59e0b',
      stroke: '#b45309',
      lineWidth: 2,
    });
    const clampKnob = new Circle(5, { fill: '#78350f', x: 0, y: 0 });
    const clampLabel = new Text('Kéo nâng/hạ', { font: 'bold 9px Arial', fill: '#78350f', left: 22, centerY: 0 });
    this.clampNode.addChild(clampBody);
    this.clampNode.addChild(clampKnob);
    this.clampNode.addChild(clampLabel);

    // Thêm DragListener cho khớp kẹp trên cột
    const clampDrag = new DragListener({
      drag: (event: any) => {
        const parentPoint = this.globalToParentPoint(event.pointer.point);
        // Giới hạn độ cao khớp kẹp y từ 130 đến 420
        const clampedY = Math.max(130, Math.min(420, parentPoint.y));
        this.clampNode.y = clampedY;
        this.trackNode.y = clampedY;

        // Tính góc nghiêng: đầu dưới máng chạm đất ở y = 480, x = 60 + 700*cos(a)
        // deltaY = 480 - clampedY
        // sin(a) = (480 - clampedY) / 700
        const deltaY = 480 - clampedY;
        const sinA = Math.max(0.08, Math.min(0.7, deltaY / this.trackLengthPx));
        const angleRad = Math.asin(sinA);
        const angleDeg = (angleRad * 180) / Math.PI;

        this.setAngle(angleDeg);
        if (this.onAngleChange) {
          this.onAngleChange(angleDeg);
        }
      },
    });
    this.clampNode.addInputListener(clampDrag);
    this.clampNode.cursor = 'ns-resize';

    // 3. Máng trượt (Track) xoay quanh điểm khớp kẹp
    this.trackNode = new Node({ x: 60, y: 210 });

    // Ray nhôm hợp kim
    const rail = new Rectangle(0, -6, this.trackLengthPx, 12, 2, 2, {
      fill: '#cbd5e1',
      stroke: '#64748b',
      lineWidth: 2,
    });
    this.trackNode.addChild(rail);

    // Chốt chặn cuối máng (Bumper)
    const endStop = new Rectangle(this.trackLengthPx - 10, -20, 10, 30, 2, 2, {
      fill: '#ef4444',
      stroke: '#991b1b',
      lineWidth: 1.5,
    });
    this.trackNode.addChild(endStop);

    // Thước đo vạch mm / cm khắc dọc máng
    const markShape = new Shape();
    for (let i = 0; i <= 10; i++) {
      const x = i * (this.trackLengthPx / 10);
      markShape.moveTo(x, 6);
      markShape.lineTo(x, 18);

      const label = new Text(`${(i * 0.1).toFixed(1)}m`, {
        font: 'bold 10px Arial',
        fill: '#1e293b',
        centerX: x,
        top: 20,
      });
      this.trackNode.addChild(label);
    }

    for (let i = 0; i <= 100; i++) {
      if (i % 10 !== 0) {
        const x = i * (this.trackLengthPx / 100);
        markShape.moveTo(x, 6);
        markShape.lineTo(x, 12);
      }
    }

    const marks = new Path(markShape, { stroke: '#334155', lineWidth: 1 });
    this.trackNode.addChild(marks);

    this.addChild(this.trackNode);
    this.addChild(this.clampNode);

    // 4. Hiển thị góc nghiêng
    this.angleTextNode = new Text('Góc dốc α: 15.0°', {
      font: 'bold 14px Arial',
      fill: '#0284c7',
      left: 110,
      top: 100,
    });
    this.addChild(this.angleTextNode);
  }

  public setAngle(angleDeg: number): void {
    const angleRad = (angleDeg * Math.PI) / 180;
    this.trackNode.rotation = angleRad;
    
    // Đồng bộ vị trí khớp kẹp y theo góc: clampedY = 480 - 700 * sin(a)
    const clampedY = 480 - this.trackLengthPx * Math.sin(angleRad);
    this.clampNode.y = clampedY;
    this.trackNode.y = clampedY;

    this.angleTextNode.string = `Góc dốc α: ${angleDeg.toFixed(1)}° (h = ${(this.trackLengthPx * Math.sin(angleRad) * 0.1).toFixed(1)} cm)`;
  }
}
