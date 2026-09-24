import { Node, Rectangle, Path, Text } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

export class StandView extends Node {
  constructor() {
    super();

    // Giá đỡ thẳng đứng (cột) căn giữa quanh gốc tọa độ (x=0, y=0)
    const pole = new Rectangle(-10, 0, 20, 430, { fill: '#cbd5e1', stroke: '#94a3b8', lineWidth: 2 });
    this.addChild(pole);

    // Chân đế
    const base = new Rectangle(-50, 430, 100, 20, 4, 4, { fill: '#475569', stroke: '#1e293b', lineWidth: 2 });
    this.addChild(base);

    // Thước đo dán trên cột (0.0m đến 1.0m, mỗi 10cm = 40px)
    const shape = new Shape();
    for (let i = 0; i <= 10; i++) {
      const y = 10 + i * 40;
      shape.moveTo(0, y);
      shape.lineTo(10, y);
      
      const label = new Text(`${(i * 0.1).toFixed(1)}m`, { font: 'bold 9px Arial', fill: '#0f172a', left: 12, centerY: y });
      this.addChild(label);
    }
    
    // Các vạch milimet nhỏ
    for (let i = 0; i <= 100; i++) {
      if (i % 10 !== 0) {
        const y = 10 + i * 4;
        shape.moveTo(5, y);
        shape.lineTo(10, y);
      }
    }

    const marks = new Path(shape, { stroke: '#334155', lineWidth: 1 });
    this.addChild(marks);
  }
}
