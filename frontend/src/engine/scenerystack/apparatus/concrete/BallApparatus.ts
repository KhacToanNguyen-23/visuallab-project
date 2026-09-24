/**
 * VIÊN BI THÉP (STEEL_BALL)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 6: Đo tốc độ, Bài 14: Rơi tự do)
 * - Đường kính 2cm, khối lượng m = 0.05kg.
 * - Vật rắn chịu tác dụng của trọng lực rơi tự do g và ma sát.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { MassObjectView } from '../mechanics/MassObjectView.ts';
import { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import type { StandardToolId, IPhysicsRigidBody } from '../../core/contracts/IApparatus.ts';

export class BallApparatus extends BaseApparatus implements IPhysicsRigidBody {
  public readonly toolId: StandardToolId = 'STEEL_BALL';
  public readonly name = 'Viên Bi Thép';
  public readonly viewNode: MassObjectView;

  public mass = 0.05;
  public positionX = 0;
  public positionY = 0;
  public velocityX = 0;
  public velocityY = 0;
  public frictionCoeff = 0.0;

  constructor(id?: string, radius = 14, mass = 0.05) {
    super(id);
    this.mass = mass;
    const kinematic = new KinematicComponent(mass);
    this.model.addComponent(kinematic);

    this.viewNode = new MassObjectView(this.model, radius);

    this.snapPorts.push({
      id: `${this.id}_top_mag`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: -radius,
      type: 'HOOK_TOP',
    });
  }
}
