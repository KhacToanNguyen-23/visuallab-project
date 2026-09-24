import { Vector2 } from 'scenerystack/dot';
import { Node, Circle, Rectangle, Text } from 'scenerystack/scenery';
import type { ILabInstrument } from './ILabInstrument';
import { CircuitInstrument } from './instruments/CircuitInstrument';
import { MechanicalInstrument } from './instruments/MechanicalInstrument';
import { OpticalInstrument } from './instruments/OpticalInstrument';
import { ThermalInstrument } from './instruments/ThermalInstrument';
import { AcousticInstrument } from './instruments/AcousticInstrument';
import { INSTRUMENT_REGISTRY } from './InstrumentRegistry';
import type { IInstrumentConfig } from './types';

/**
 * Lớp khởi tạo mẫu cho Dụng cụ Điện Học
 */
class ConcreteCircuitInstrument extends CircuitInstrument {
  public render(): Node {
    if (!this.rootNode) {
      this.rootNode = new Node();
      const body = new Rectangle(-40, -25, 80, 50, 6, 6, {
        fill: '#ffffff',
        stroke: '#2563eb',
        lineWidth: 2,
      });
      const label = new Text(this.name, {
        font: '12px sans-serif',
        fill: '#0f172a',
        centerX: 0,
        centerY: 0,
      });
      this.rootNode.addChild(body);
      this.rootNode.addChild(label);
      this.rootNode.setTranslation(this.position);
    }
    return this.rootNode;
  }

  public update(_dt: number): void {}

  public calculateCircuitState(sourceVoltage: number, totalResistance: number): void {
    if (totalResistance > 0) {
      this.current = sourceVoltage / totalResistance;
      this.voltageDrop = this.current * this.resistance;
    } else {
      this.current = 0;
      this.voltageDrop = 0;
    }
  }
}

/**
 * Lớp khởi tạo mẫu cho Dụng cụ Cơ Học
 */
class ConcreteMechanicalInstrument extends MechanicalInstrument {
  public render(): Node {
    if (!this.rootNode) {
      this.rootNode = new Node();
      const body = new Circle(15, {
        fill: '#f59e0b',
        stroke: '#b45309',
        lineWidth: 2,
      });
      const label = new Text(this.name, {
        font: '11px sans-serif',
        fill: '#0f172a',
        centerX: 0,
        centerY: 22,
      });
      this.rootNode.addChild(body);
      this.rootNode.addChild(label);
      this.rootNode.setTranslation(this.position);
    }
    return this.rootNode;
  }

  public update(dt: number): void {
    this.stepKinematics(dt);
  }
}

/**
 * Lớp khởi tạo mẫu cho Dụng cụ Quang Học
 */
class ConcreteOpticalInstrument extends OpticalInstrument {
  public render(): Node {
    if (!this.rootNode) {
      this.rootNode = new Node();
      const body = new Rectangle(-30, -15, 60, 30, {
        fill: '#ef4444',
        stroke: '#991b1b',
        lineWidth: 1.5,
      });
      this.rootNode.addChild(body);
      this.rootNode.setTranslation(this.position);
    }
    return this.rootNode;
  }

  public update(_dt: number): void {}

  public traceRay(incomingRay: any): any[] {
    return [incomingRay];
  }
}

/**
 * Lớp khởi tạo mẫu cho Dụng cụ Nhiệt Học
 */
class ConcreteThermalInstrument extends ThermalInstrument {
  public render(): Node {
    if (!this.rootNode) {
      this.rootNode = new Node();
      const body = new Rectangle(-35, -35, 70, 70, 8, 8, {
        fill: '#e0f2fe',
        stroke: '#0284c7',
        lineWidth: 2,
      });
      this.rootNode.addChild(body);
      this.rootNode.setTranslation(this.position);
    }
    return this.rootNode;
  }

  public update(_dt: number): void {}

  public transferHeat(deltaJoules: number): void {
    const mass = 0.2; // 200g
    const deltaT = deltaJoules / (mass * this.specificHeat);
    this.temperature += deltaT;
  }
}

/**
 * Lớp khởi tạo mẫu cho Dụng cụ Âm Học
 */
class ConcreteAcousticInstrument extends AcousticInstrument {
  public render(): Node {
    if (!this.rootNode) {
      this.rootNode = new Node();
      const body = new Rectangle(-40, -20, 80, 40, {
        fill: '#f1f5f9',
        stroke: '#64748b',
        lineWidth: 1.5,
      });
      this.rootNode.addChild(body);
      this.rootNode.setTranslation(this.position);
    }
    return this.rootNode;
  }

  public update(_dt: number): void {}
  public playSound(): void {}
  public stopSound(): void {}
}

/**
 * Factory Khởi Tạo Dụng Cụ Động Không Hardcode
 */
export class InstrumentFactory {
  /**
   * Tạo một instance dụng cụ dựa theo toolId và cấu hình tùy biến
   */
  public static create(
    toolId: string,
    customConfig?: Partial<IInstrumentConfig>,
    initialPosition: Vector2 = new Vector2(0, 0),
    instanceId?: string
  ): ILabInstrument {
    const baseConfig = INSTRUMENT_REGISTRY[toolId];
    if (!baseConfig) {
      throw new Error(`[InstrumentFactory] Không tìm thấy mã dụng cụ '${toolId}' trong Registry`);
    }

    const mergedConfig: IInstrumentConfig = {
      ...baseConfig,
      ...customConfig,
      params: {
        ...baseConfig.params,
        ...(customConfig?.params || {}),
      },
    };

    const id = instanceId || `inst_${toolId.toLowerCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    switch (mergedConfig.category) {
      case 'ELECTRICITY':
        return new ConcreteCircuitInstrument(id, toolId, mergedConfig.name, mergedConfig, initialPosition);
      case 'KINEMATICS':
      case 'DYNAMICS':
        return new ConcreteMechanicalInstrument(id, toolId, mergedConfig.name, mergedConfig.category, mergedConfig, initialPosition);
      case 'OPTICS':
        return new ConcreteOpticalInstrument(id, toolId, mergedConfig.name, mergedConfig, initialPosition);
      case 'THERMODYNAMICS':
        return new ConcreteThermalInstrument(id, toolId, mergedConfig.name, mergedConfig, initialPosition);
      case 'ACOUSTICS':
        return new ConcreteAcousticInstrument(id, toolId, mergedConfig.name, mergedConfig, initialPosition);
      default:
        throw new Error(`[InstrumentFactory] Phân loại bộ môn '${mergedConfig.category}' chưa được hỗ trợ`);
    }
  }
}
