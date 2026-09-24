import { Property } from 'scenerystack/axon';
import type { IPhysicsComponent } from '../IPhysicsComponent.ts';

export class KinematicComponent implements IPhysicsComponent {
  public readonly type = 'kinematic';
  
  public mass = new Property(1.0);
  public dragCoefficient = new Property(0.0); // Hệ số cản không khí k (F_cản = -k * v)
  public xProperty = new Property(0);
  public yProperty = new Property(0);
  public vProperty = new Property(0);
  public aProperty = new Property(0);

  constructor(mass = 1.0, dragCoefficient = 0.0) {
    this.mass.value = mass;
    this.dragCoefficient.value = dragCoefficient;
  }
}
