/**
 * BỘ QUẢ CÂN GIA TẢI (MASS_WEIGHT_SET)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 21: Ma sát, Bài 38: Lò xo)
 * Quản lý khối lượng tải mass (kg), có móc HOOK_TOP để treo vào lò xo hoặc chồng lên nhau.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { WeightHangerView } from '../mechanics/WeightHangerView.ts';
import { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import type { StandardToolId, IPhysicsRigidBody, IApparatus } from '../../core/contracts/IApparatus.ts';
import type { SnapPort } from '../../interaction/SnapEngine.ts';
import type { SpringApparatus } from './SpringApparatus.ts';

export class WeightApparatus extends BaseApparatus implements IPhysicsRigidBody {
  public readonly toolId: StandardToolId = 'MASS_WEIGHT_SET';
  public readonly name = 'Bộ Quả Cân 50g';
  public readonly viewNode: WeightHangerView;

  public mass = 0.05;
  public positionX = 0;
  public positionY = 0;
  public velocityX = 0;
  public velocityY = 0;
  public frictionCoeff = 0;

  public parentSpring?: SpringApparatus;

  constructor(id?: string, weightCount = 1) {
    super(id);
    this.mass = weightCount * 0.05;

    const kinematic = new KinematicComponent(this.mass);
    this.model.addComponent(kinematic);

    this.viewNode = new WeightHangerView();
    this.viewNode.updateWeights(weightCount);

    this.snapPorts.push({
      id: `${this.id}_hook_top`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'HOOK_TOP',
    });
  }

  public override onSnapped(target: IApparatus, _myPort: SnapPort, _targetPort: SnapPort): void {
    if (target.toolId === 'HELICAL_SPRING') {
      const spring = target as SpringApparatus;
      this.parentSpring = spring;
      spring.attachWeight(this);
    }
  }
}
