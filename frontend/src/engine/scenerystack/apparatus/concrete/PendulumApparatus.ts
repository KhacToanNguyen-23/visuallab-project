/**
 * CON LẮC ĐƠN (SIMPLE PENDULUM VIEW & APPARATUS)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 7: Khảo sát dao động con lắc đơn)
 * - Chiều dài dây treo l (0.2m - 1.0m), quả cầu kim loại m = 50g.
 * - Góc lệch ban đầu alpha_0, dao động điều hòa T = 2*pi*sqrt(l/g).
 */

import { Node, Circle, Line, Text } from 'scenerystack/scenery';
import { Font } from 'scenerystack/scenery';
import { BaseApparatus } from '../base/BaseApparatus.ts';
import type { LabDeviceModel } from '../../core/models/LabDeviceModel.ts';
import type { StandardToolId, IPhysicsRigidBody } from '../../core/contracts/IApparatus.ts';

export class PendulumView extends Node {
  public readonly pivotNode: Circle;
  public readonly stringLine: Line;
  public readonly bobNode: Circle;
  public readonly angleLabel: Text;

  constructor(_model?: LabDeviceModel) {
    super();

    // Điểm treo cố định (Pivot)
    this.pivotNode = new Circle(4, { fill: '#1E293B' });

    // Dây treo con lắc
    this.stringLine = new Line(0, 0, 0, 180, {
      stroke: '#475569',
      lineWidth: 1.5,
    });

    // Quả cầu kim loại (R=12px)
    this.bobNode = new Circle(12, {
      fill: 'radial-gradient(circle at 35% 35%, #94A3B8 0%, #475569 70%, #1E293B 100%)',
      stroke: '#0F172A',
      lineWidth: 1.5,
      x: 0,
      y: 180,
    });

    // Nhãn góc lệch alpha
    this.angleLabel = new Text('α = 0°', {
      font: new Font({ size: 10, weight: 'bold' }),
      fill: '#2563EB',
      x: 18,
      y: 20,
    });

    this.addChild(this.stringLine);
    this.addChild(this.pivotNode);
    this.addChild(this.bobNode);
    this.addChild(this.angleLabel);
  }

  public setAngle(angleRad: number, lengthPx = 180): void {
    const bobX = lengthPx * Math.sin(angleRad);
    const bobY = lengthPx * Math.cos(angleRad);
    this.stringLine.setLine(0, 0, bobX, bobY);
    this.bobNode.x = bobX;
    this.bobNode.y = bobY;
    this.angleLabel.string = `α = ${((angleRad * 180) / Math.PI).toFixed(1)}°`;
  }
}

export class PendulumApparatus extends BaseApparatus implements IPhysicsRigidBody {
  public readonly toolId: StandardToolId = 'STEEL_BALL';
  public readonly name = 'Con Lắc Đơn Thí Nghiệm';
  public readonly viewNode: PendulumView;

  public mass = 0.05; // 50g
  public length = 0.5; // 0.5m
  public angleRad = 0;
  public angularVelocity = 0;
  public positionX = 0;
  public positionY = 0;
  public velocityX = 0;
  public velocityY = 0;
  public frictionCoeff = 0.01;

  constructor(id?: string, length = 0.5) {
    super(id);
    this.length = length;
    this.viewNode = new PendulumView(this.model);

    // Cổng treo lên giá đỡ
    this.snapPorts.push({
      id: `${this.id}_pivot_top`,
      entityId: this.id,
      hostNode: this.viewNode.pivotNode,
      offsetX: 0,
      offsetY: 0,
      type: 'ARM_HANG',
    });
  }

  public override updatePhysics(dt: number): void {
    if (dt <= 0) return;
    const g = 9.807;
    // Phương trình vi phân con lắc đơn
    const alphaAccel = -(g / this.length) * Math.sin(this.angleRad) - 0.05 * this.angularVelocity;
    this.angularVelocity += alphaAccel * dt;
    this.angleRad += this.angularVelocity * dt;

    const lengthPx = this.length * 300;
    this.viewNode.setAngle(this.angleRad, lengthPx);
  }
}
