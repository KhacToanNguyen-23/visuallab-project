import type { IPhysicsComponent } from './IPhysicsComponent.ts';

export class LabDeviceModel {
  public components = new Map<string, IPhysicsComponent>();

  public addComponent(comp: IPhysicsComponent) {
    this.components.set(comp.type, comp);
  }

  public getComponent<T extends IPhysicsComponent>(type: string): T | undefined {
    return this.components.get(type) as T | undefined;
  }
}
