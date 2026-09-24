/**
 * KHỐI GỖ THÍ NGHIỆM MA SÁT (WOODEN_BLOCK APPARATUS)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 21: Đo hệ số ma sát trượt)
 * - Khối lượng cơ sở 200g, có thể đặt thêm quả cân 50g-200g.
 * - Hệ số ma sát tĩnh μ_s, động μ_k trên mặt phẳng thí nghiệm.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { FrictionBlockView } from '../mechanics/FrictionBlockView.ts';
import type { WeightApparatus } from './WeightApparatus.ts';
import type { StandardToolId, IPhysicsRigidBody } from '../../core/contracts/IApparatus.ts';

export class FrictionBlockApparatus extends BaseApparatus implements IPhysicsRigidBody {
  public readonly toolId: StandardToolId = 'WOODEN_BLOCK';
  public readonly name = 'Khối Gỗ Thí Nghiệm';
  public readonly viewNode: FrictionBlockView;

  public mass = 0.2; // 200g
  public positionX = 0;
  public positionY = 0;
  public velocityX = 0;
  public velocityY = 0;
  public frictionCoeff = 0.25; // μ_k
  public staticFrictionCoeff = 0.35; // μ_s

  public attachedWeights: WeightApparatus[] = [];

  constructor(id?: string, mass = 0.2) {
    super(id);
    this.mass = mass;
    this.viewNode = new FrictionBlockView(this.model);

    // Cổng móc kéo lực kế bên phải
    this.snapPorts.push({
      id: `${this.id}_hook_right`,
      entityId: this.id,
      hostNode: this.viewNode.hookNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'HOOK_BOTTOM',
    });

    // Cổng đặt quả cân lên trên lưng khối gỗ
    this.snapPorts.push({
      id: `${this.id}_top_slot`,
      entityId: this.id,
      hostNode: this.viewNode.blockBody,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: -20,
      type: 'ARM_HANG',
    });
  }

  public attachWeight(weight: WeightApparatus): void {
    if (this.attachedWeights.length < 6) {
      this.attachedWeights.push(weight);
      this.recalculateMass();
    }
  }

  public removeWeight(): void {
    if (this.attachedWeights.length > 0) {
      this.attachedWeights.pop();
      this.recalculateMass();
    }
  }

  public recalculateMass(): void {
    const extraMassKg = this.attachedWeights.reduce((sum, w) => sum + w.mass, 0);
    const totalMass = 0.2 + extraMassKg;
    this.mass = totalMass;
    this.viewNode.massLabel.string = `m = ${(totalMass * 1000).toFixed(0)}g`;
    this.viewNode.updateWeightsStack(this.attachedWeights.length, this.attachedWeights[0]?.mass ? this.attachedWeights[0].mass * 1000 : 50);
  }

  public setMass(m: number): void {
    this.mass = m;
    this.viewNode.massLabel.string = `m = ${(m * 1000).toFixed(0)}g`;
  }
}
