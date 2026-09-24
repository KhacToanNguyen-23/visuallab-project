/**
 * LÒ XO XOẮN ĐÀN HỒI (HELICAL_SPRING)
 * 
 * Chuẩn hóa theo DacTa.md (Bài 38: Khảo sát định luật Hooke)
 * - Tự động tính dao động điều hòa và độ giãn delta_l qua HarmonicOscillatorSolver.
 * - Nhận diện khối lượng quả cân khi được móc vào HOOK_BOTTOM.
 */

import { BaseApparatus } from '../base/BaseApparatus.ts';
import { SpringView } from '../mechanics/SpringView.ts';
import { SpringComponent } from '../../core/models/components/SpringComponent.ts';
import { KinematicComponent } from '../../core/models/components/KinematicComponent.ts';
import { HarmonicOscillatorSolver } from '../../core/physics/HarmonicOscillatorSolver.ts';
import type { StandardToolId, IElasticBody, IApparatus } from '../../core/contracts/IApparatus.ts';
import type { SnapPort } from '../../interaction/SnapEngine.ts';
import type { WeightApparatus } from './WeightApparatus.ts';

export class SpringApparatus extends BaseApparatus implements IElasticBody {
  public readonly toolId: StandardToolId = 'HELICAL_SPRING';
  public readonly name = 'Lò Xo Xoắn Đàn Hồi';
  public readonly viewNode: SpringView;

  public stiffnessK = 40.0;
  public naturalLengthL0 = 0.2;
  public currentLength = 0.2;

  public springComp: SpringComponent;
  public kinematicComp: KinematicComponent;
  public attachedWeights: WeightApparatus[] = [];

  constructor(id?: string, k = 40.0, l0 = 0.2) {
    super(id);
    this.stiffnessK = k;
    this.naturalLengthL0 = l0;
    this.currentLength = l0;

    this.springComp = new SpringComponent(k, l0, 1.2);
    this.kinematicComp = new KinematicComponent(0.02); // Móc treo rỗng 20g
    this.kinematicComp.yProperty.value = l0;

    this.model.addComponent(this.springComp);
    this.model.addComponent(this.kinematicComp);

    this.viewNode = new SpringView({ scalePxPerMeter: 400 });

    this.snapPorts.push({
      id: `${this.id}_top`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 0,
      type: 'HOOK_TOP',
    });

    this.snapPorts.push({
      id: `${this.id}_bottom`,
      entityId: this.id,
      hostNode: this.viewNode,
      constraintType: 'POINT_ANCHOR',
      offsetX: 0,
      offsetY: 80,
      type: 'HOOK_BOTTOM',
    });
  }

  public override updatePhysics(dt: number): void {
    HarmonicOscillatorSolver.step(this.kinematicComp, this.springComp, dt);
    this.currentLength = this.springComp.currentLength.value;
    this.viewNode.updateLength(this.currentLength);

    // Đồng bộ vị trí các quả cân đang treo theo đáy lò xo
    const bottomY = this.viewNode.y + this.currentLength * 400;
    for (const weight of this.attachedWeights) {
      weight.viewNode.x = this.viewNode.x;
      weight.viewNode.y = bottomY;
    }
  }

  public override onSnapped(target: IApparatus, myPort: SnapPort, _targetPort: SnapPort): void {
    // Nếu đỉnh lò xo móc vào tay đòn giá đỡ
    if (myPort.type === 'HOOK_TOP' && target.toolId === 'VERTICAL_STAND') {
      this.viewNode.x = target.viewNode.x + 60;
      this.viewNode.y = target.viewNode.y + 50;
    }
  }

  public attachWeight(weight: WeightApparatus): void {
    if (!this.attachedWeights.includes(weight)) {
      this.attachedWeights.push(weight);
      this.kinematicComp.mass.value += weight.mass;
      // Kích thích dao động nhẹ khi vừa móc quả cân
      this.kinematicComp.yProperty.value += 0.02;
    }
  }
}
