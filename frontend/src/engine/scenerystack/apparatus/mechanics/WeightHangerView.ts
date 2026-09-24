import { Node, Rectangle, Line, Path, Text, Circle } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

export class WeightHangerView extends Node {
  private weightsContainer: Node;
  public needleNode: Node;

  constructor() {
    super();

    // 1. Cọc móc treo (Hanger Shaft & Tray)
    const shaft = new Line(0, 0, 0, 60, { stroke: '#64748b', lineWidth: 2 });
    const hookLoop = new Circle(4, { stroke: '#475569', lineWidth: 2, y: 4 });
    const baseTray = new Rectangle(-18, 55, 36, 6, 2, 2, { fill: '#334155', stroke: '#1e293b', lineWidth: 1 });
    this.addChild(shaft);
    this.addChild(hookLoop);
    this.addChild(baseTray);

    // 2. Kim chỉ thị vạch thước (Pointer Needle)
    this.needleNode = new Node({ y: 58 });
    const pointerShape = new Shape()
      .moveTo(0, 0)
      .lineTo(35, -3)
      .lineTo(35, 3)
      .close();
    const needle = new Path(pointerShape, { fill: '#ef4444', stroke: '#991b1b', lineWidth: 1 });
    const needleText = new Text('◄ Vạch chỉ', { font: 'bold 9px Arial', fill: '#ef4444', left: 38, centerY: 0 });
    this.needleNode.addChild(needle);
    this.needleNode.addChild(needleText);
    this.addChild(this.needleNode);

    // 3. Khay chứa các quả cân (Weights Stack)
    this.weightsContainer = new Node();
    this.addChild(this.weightsContainer);
  }

  public updateWeights(weightCount: number, customMassG = 50): void {
    this.weightsContainer.removeAllChildren();
    
    // Mỗi quả cân dày 8px, rộng 32px
    for (let i = 0; i < weightCount; i++) {
      const y = 55 - (i + 1) * 9;
      const disc = new Rectangle(-16, y, 32, 8, 2, 2, {
        fill: '#94a3b8',
        stroke: '#475569',
        lineWidth: 1.5,
      });
      const label = new Text(`${customMassG.toFixed(0)}g`, {
        font: 'bold 8px Arial',
        fill: '#1e293b',
        centerX: 0,
        centerY: y + 4,
      });
      this.weightsContainer.addChild(disc);
      this.weightsContainer.addChild(label);
    }
  }
}
