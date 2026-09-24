import { Property } from 'scenerystack/axon';
import type { IPhysicsComponent } from '../IPhysicsComponent.ts';

export class SensorComponent implements IPhysicsComponent {
  public readonly type = 'sensor';
  public isTriggeredProperty = new Property(false);

  // yThreshold is the trigger threshold
  public checkTrigger(y: number, thresholdY: number, time: number): number | null {
    if (this.isTriggeredProperty.value) return null;
    
    if (y >= thresholdY) {
      this.isTriggeredProperty.value = true;
      return time;
    }
    return null;
  }
}
