import { Vector2 } from 'scenerystack/dot';
import { Node } from 'scenerystack/scenery';
import type { ILabInstrument } from '../ILabInstrument';
import type { IInstrumentConfig, InstrumentCategory } from '../types';

/**
 * Lớp trừu tượng cơ sở triển khai ILabInstrument.
 * Đóng gói logic quản lý tham số động, serialization, kéo thả và lifecycle.
 */
export abstract class BaseInstrument implements ILabInstrument {
  public readonly id: string;
  public readonly toolId: string;
  public readonly name: string;
  public readonly category: InstrumentCategory;
  public readonly config: IInstrumentConfig;

  public position: Vector2;
  public rotation: number = 0;
  public isInteractive: boolean = true;
  public isSelected: boolean = false;

  protected rootNode: Node | null = null;

  constructor(
    id: string,
    toolId: string,
    name: string,
    category: InstrumentCategory,
    initialConfig: IInstrumentConfig,
    initialPosition: Vector2 = new Vector2(0, 0)
  ) {
    this.id = id;
    this.toolId = toolId;
    this.name = name;
    this.category = category;
    // Clone config để tránh đột biến ngoài ý muốn
    this.config = JSON.parse(JSON.stringify(initialConfig));
    this.position = initialPosition.copy();
  }

  public getParam<T = number>(paramId: string): T {
    const param = this.config.params[paramId];
    if (!param) {
      throw new Error(`[BaseInstrument] Tham số '${paramId}' không tồn tại trên dụng cụ ${this.toolId}`);
    }
    return param.value as T;
  }

  public setParam<T = number>(paramId: string, value: T): void {
    const param = this.config.params[paramId];
    if (!param) {
      throw new Error(`[BaseInstrument] Tham số '${paramId}' không tồn tại trên dụng cụ ${this.toolId}`);
    }
    param.value = value;
    this.onParamChanged(paramId, value);
  }

  public getAllParams(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, descriptor] of Object.entries(this.config.params)) {
      result[key] = descriptor.value;
    }
    return result;
  }

  /** Hook để lớp con phản ứng khi tham số vật lý thay đổi */
  protected onParamChanged(_paramId: string, _value: any): void {}

  public abstract render(): Node;
  public abstract update(dt: number): void;

  public onDragStart(_pos: Vector2): void {
    this.isSelected = true;
  }

  public onDrag(pos: Vector2): void {
    this.position.set(pos);
    if (this.rootNode) {
      this.rootNode.setTranslation(pos);
    }
  }

  public onDragEnd(): void {
    this.isSelected = false;
  }

  public serialize(): Record<string, any> {
    return {
      id: this.id,
      toolId: this.toolId,
      name: this.name,
      category: this.category,
      position: { x: this.position.x, y: this.position.y },
      rotation: this.rotation,
      params: this.getAllParams(),
    };
  }

  public deserialize(data: Record<string, any>): void {
    if (data.position) {
      this.position.setXY(data.position.x, data.position.y);
      if (this.rootNode) {
        this.rootNode.setTranslation(this.position);
      }
    }
    if (data.rotation !== undefined) {
      this.rotation = data.rotation;
    }
    if (data.params) {
      for (const [key, val] of Object.entries(data.params)) {
        if (this.config.params[key]) {
          this.setParam(key, val);
        }
      }
    }
  }

  public dispose(): void {
    if (this.rootNode) {
      this.rootNode.dispose();
      this.rootNode = null;
    }
  }
}
