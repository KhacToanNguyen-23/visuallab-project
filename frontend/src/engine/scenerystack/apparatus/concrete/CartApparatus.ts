/**
 * XE TRƯỢT CÓ CỜ CHẮN SÁNG (CART_FLAG)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 6: Đo tốc độ, Bài 30: Va chạm)
 * - Khối lượng m = 0.5kg, cờ chắn 10mm.
 * - Cổng WHEEL_TRACK: Bắt dính vào ray máng nghiêng và tự động trượt gia tốc a = g(sinα - μcosα).
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { CartView } from '../mechanics/CartView.ts';
import { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import { InclinedPlaneSolver } from '../../core/physics/InclinedPlaneSolver.ts';
import type { StandardToolId, IPhysicsRigidBody, IApparatus } from '../../core/contracts/IApparatus.ts';
import type { SnapPort } from '../../interaction/SnapEngine.ts';
import type { InclinedPlaneApparatus } from './InclinedPlaneApparatus.ts';

export class CartApparatus extends BaseApparatus implements IPhysicsRigidBody {
  public readonly toolId: StandardToolId = 'CART_FLAG';
  public readonly name = 'Xe Trượt Có Cờ Chắn';
  public readonly viewNode: CartView;

  public mass = 0.5;
  public positionX = 0;
  public positionY = 0;
  public velocityX = 0;
  public velocityY = 0;
  public frictionCoeff = 0.02;

  public parentPlane?: InclinedPlaneApparatus;
  private kinematicComp: KinematicComponent;
  private currentS = 0.0; // mét dọc ray

  constructor(id?: string, mass = 0.5) {
    super(id);
    this.mass = mass;
    this.kinematicComp = new KinematicComponent(mass);
    this.model.addComponent(this.kinematicComp);

    this.viewNode = new CartView(this.model);

    this.snapPorts.push({
      id: `${this.id}_wheel`,
      entityId: this.id,
      hostNode: this.viewNode,
      offsetX: 0,
      offsetY: 0,
      type: 'WHEEL_TRACK',
    });
  }

  public override onSnapped(target: IApparatus, _myPort: SnapPort, _targetPort: SnapPort): void {
    if (target.toolId === 'INCLINED_TRACK') {
      this.parentPlane = target as InclinedPlaneApparatus;
      this.currentS = 0.05; // Đặt ở đầu dốc
      this.kinematicComp.yProperty.value = this.currentS;
      this.kinematicComp.vProperty.value = 0;
      this.updatePhysics(0);
    }
  }

  public override updatePhysics(dt: number): void {
    if (!this.parentPlane) return;

    const angleDeg = this.parentPlane.inclinationAngleDeg;
    const angleRad = (angleDeg * Math.PI) / 180;

    if (dt > 0) {
      InclinedPlaneSolver.step(
        this.kinematicComp,
        {
          angleRad,
          frictionCoeff: this.frictionCoeff,
          gravity: 9.807,
          trackLength: this.parentPlane.trackLength,
        },
        dt
      );
    }

    this.currentS = this.kinematicComp.yProperty.value;
    const trackPx = this.currentS * 500;

    // Tọa độ gốc xoay của máng nghiêng
    const originX = this.parentPlane.viewNode.x + 60;
    const originY = this.parentPlane.viewNode.y + this.parentPlane.viewNode.trackNode.y;

    this.viewNode.x = originX + trackPx * Math.cos(angleRad);
    this.viewNode.y = originY + trackPx * Math.sin(angleRad) - 12;
    this.viewNode.rotation = angleRad;
  }
}
