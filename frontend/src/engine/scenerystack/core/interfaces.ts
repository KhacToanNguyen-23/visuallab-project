import { Property } from 'scenerystack/axon';

export interface ILabComponent {
  xProperty: Property<number>;
  yProperty: Property<number>;
  rotationProperty: Property<number>;
  serialize(): any;
  deserialize(data: any): void;
}

export interface IConnectable {
  terminals: Array<{ id: string; localX: number; localY: number }>;
  snapRadius: number;
}
