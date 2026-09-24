import { Property } from 'scenerystack/axon';
import type { IPhysicsComponent } from '../IPhysicsComponent.ts';

export class SpringComponent implements IPhysicsComponent {
  public readonly type = 'spring';

  public kProperty = new Property(40.0);           // Độ cứng k (N/m), mặc định 40 N/m
  public naturalLength = new Property(0.2);        // Chiều dài tự nhiên l0 = 0.2m (20cm)
  public damping = new Property(0.8);              // Hệ số cản dao động gamma
  public currentLength = new Property(0.2);        // Chiều dài tức thời l = l0 + delta_l

  constructor(k = 40.0, naturalLength = 0.2, damping = 0.8) {
    this.kProperty.value = k;
    this.naturalLength.value = naturalLength;
    this.damping.value = damping;
    this.currentLength.value = naturalLength;
  }
}
