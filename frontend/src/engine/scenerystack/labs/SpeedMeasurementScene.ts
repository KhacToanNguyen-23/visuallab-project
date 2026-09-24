import { LabDeviceModel } from '../core/models/LabDeviceModel.ts';
import { KinematicComponent } from '../core/models/components/KinematicComponent.ts';
import { SensorComponent } from '../core/models/components/SensorComponent.ts';
import { CartView } from '../apparatus/mechanics/CartView.ts';
import { InclinedPlaneView } from '../apparatus/mechanics/InclinedPlaneView.ts';
import { RampPhotogateView } from '../apparatus/sensors/RampPhotogateView.ts';
import { InclinedPlaneSolver } from '../core/physics/InclinedPlaneSolver.ts';
import { useSpeedMeasurementStore } from '../../../store/useSpeedMeasurementStore.ts';

export class SpeedMeasurementScene {
  public cartModel = new LabDeviceModel();
  public gate1Model = new LabDeviceModel();
  public gate2Model = new LabDeviceModel();

  public planeView: InclinedPlaneView;
  public cartView: CartView;
  public gate1View: RampPhotogateView;
  public gate2View: RampPhotogateView;

  private time = 0;
  private isRunning = false;
  private t1Mark: number | null = null;
  private readonly trackLength = 1.0; // 1.0 mét
  private unsubscribeStore: () => void;

  constructor() {
    // 1. Components
    const cartKinematic = new KinematicComponent(0.5); // Xe nặng 0.5kg
    this.cartModel.addComponent(cartKinematic);

    const gate1Kinematic = new KinematicComponent();
    const gate1Sensor = new SensorComponent();
    this.gate1Model.addComponent(gate1Kinematic);
    this.gate1Model.addComponent(gate1Sensor);

    const gate2Kinematic = new KinematicComponent();
    const gate2Sensor = new SensorComponent();
    this.gate2Model.addComponent(gate2Kinematic);
    this.gate2Model.addComponent(gate2Sensor);

    // 2. Views
    this.planeView = new InclinedPlaneView({
      trackLengthPx: 700,
      onAngleChange: (angleDeg) => {
        useSpeedMeasurementStore.getState().setAngleDeg(Math.round(angleDeg));
      },
    });
    this.cartView = new CartView(this.cartModel);

    this.gate1View = new RampPhotogateView(this.gate1Model, {
      label: 'Cổng E',
      getMinS: () => 0.05,
      getMaxS: () => this.gate2Model.getComponent<KinematicComponent>('kinematic')!.yProperty.value - 0.05,
    });

    this.gate2View = new RampPhotogateView(this.gate2Model, {
      label: 'Cổng F',
      getMinS: () => 0.1,
      getMaxS: () => 0.95,
    });

    // Gắn Cart và Photogates vào bên trong trackNode của Máng nghiêng (để tự xoay theo góc dốc)
    this.planeView.trackNode.addChild(this.gate1View);
    this.planeView.trackNode.addChild(this.gate2View);
    this.planeView.trackNode.addChild(this.cartView);

    // 3. Tọa độ mặc định (m)
    cartKinematic.yProperty.value = 0.0;
    this.cartView.x = 0;
    this.cartView.y = -12;

    gate1Kinematic.yProperty.value = 0.3; // 30cm
    gate2Kinematic.yProperty.value = 0.8; // 80cm

    this.updateAngle(useSpeedMeasurementStore.getState().angleDeg);

    // Lắng nghe store Zustand trực tiếp để xoay máng ngay lập tức khi kéo slider
    this.unsubscribeStore = useSpeedMeasurementStore.subscribe((state) => {
      this.updateAngle(state.angleDeg);
    });
  }

  public updateAngle(angleDeg: number): void {
    this.planeView.setAngle(angleDeg);
  }

  public step(dt: number): void {
    if (!this.isRunning) return;

    this.time += dt;

    const cartKinematic = this.cartModel.getComponent<KinematicComponent>('kinematic')!;
    const gate1Sensor = this.gate1Model.getComponent<SensorComponent>('sensor')!;
    const gate2Sensor = this.gate2Model.getComponent<SensorComponent>('sensor')!;
    const gate1Kinematic = this.gate1Model.getComponent<KinematicComponent>('kinematic')!;
    const gate2Kinematic = this.gate2Model.getComponent<KinematicComponent>('kinematic')!;

    const { angleDeg, frictionCoeff } = useSpeedMeasurementStore.getState();

    // 1. Tính toán vật lý
    InclinedPlaneSolver.step(
      cartKinematic,
      {
        angleRad: (angleDeg * Math.PI) / 180,
        frictionCoeff,
        gravity: 9.807,
        trackLength: this.trackLength,
      },
      dt
    );

    // 2. Cập nhật vị trí render của xe
    const s = cartKinematic.yProperty.value;
    this.cartView.x = s * 700;
    this.cartView.y = -12; // Đặt bánh xe tiếp xúc mặt trên ray

    // 3. Kiểm tra cảm biến quang
    const t1 = gate1Sensor.checkTrigger(s, gate1Kinematic.yProperty.value, this.time);
    const t2 = gate2Sensor.checkTrigger(s, gate2Kinematic.yProperty.value, this.time);

    if (t1 !== null) {
      this.t1Mark = t1;
    }

    if (t2 !== null) {
      useSpeedMeasurementStore.getState().addMeasurement(
        gate1Kinematic.yProperty.value,
        gate2Kinematic.yProperty.value,
        this.t1Mark || 0,
        t2
      );
    }

    if (s >= this.trackLength) {
      this.isRunning = false;
    }
  }

  public release(): void {
    this.reset();
    this.isRunning = true;
  }

  public reset(): void {
    this.isRunning = false;
    this.time = 0;
    this.t1Mark = null;

    const cartKinematic = this.cartModel.getComponent<KinematicComponent>('kinematic')!;
    cartKinematic.yProperty.value = 0.0;
    cartKinematic.vProperty.value = 0.0;
    this.cartView.x = 0;
    this.cartView.y = -12;

    const gate1Sensor = this.gate1Model.getComponent<SensorComponent>('sensor')!;
    const gate2Sensor = this.gate2Model.getComponent<SensorComponent>('sensor')!;
    gate1Sensor.isTriggeredProperty.value = false;
    gate2Sensor.isTriggeredProperty.value = false;
  }

  public dispose(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }
}
