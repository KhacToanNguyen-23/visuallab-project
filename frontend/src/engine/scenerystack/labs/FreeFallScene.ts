import { Node, DragListener } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';
import { KinematicComponent } from '../core/models/components/KinematicComponent.ts';
import { SensorComponent } from '../core/models/components/SensorComponent.ts';
import { StandApparatus } from '../apparatus/concrete/StandApparatus.ts';
import { ElectromagnetApparatus } from '../apparatus/concrete/ElectromagnetApparatus.ts';
import { BallApparatus } from '../apparatus/concrete/BallApparatus.ts';
import { PhotogateApparatus } from '../apparatus/concrete/PhotogateApparatus.ts';
import { DigitalTimerApparatus } from '../apparatus/concrete/DigitalTimerApparatus.ts';
import { WireCurveView } from '../apparatus/circuits/WireCurveView.ts';
import { KinematicSolver } from '../core/physics/KinematicSolver.ts';
import { useFreeFallStore } from '../../../store/useFreeFallStore.ts';

export class FreeFallScene {
  public rootNode = new Node();

  public stand: StandApparatus;
  public electromagnet: ElectromagnetApparatus;
  public ball: BallApparatus;
  public gate1: PhotogateApparatus;
  public gate2: PhotogateApparatus;
  public timer: DigitalTimerApparatus;

  // Dây cáp kết nối vật lý
  private wireMagnet: WireCurveView;
  private wireGateA: WireCurveView;
  private wireGateB: WireCurveView;

  private standAssemblyNode = new Node();

  private time = 0;
  private isDropping = false;
  private t1Mark: number | null = null;
  private isBallAttached = true;
  private readonly originX = 420;
  private readonly originY = 50;
  private readonly scalePxPerMeter = 360; // 1m = 360px
  private readonly dropOriginY: number; // Tọa độ cực nam châm tại vạch 0.0m

  constructor() {
    // 1. Khởi tạo các apparatus OOP độc lập
    this.stand = new StandApparatus('stand-1');
    this.electromagnet = new ElectromagnetApparatus('emag-1');
    this.ball = new BallApparatus('ball-1', 12, 0.05);
    this.gate1 = new PhotogateApparatus('gate-1', 'Cổng quang 1');
    this.gate2 = new PhotogateApparatus('gate-2', 'Cổng quang 2');
    this.timer = new DigitalTimerApparatus('timer-1');

    // Lấy tọa độ gá đỉnh của nam châm từ SnapPort của Giá đỡ (Zero-Hardcode)
    const mountPort = this.stand.snapPorts.find((p) => p.type === 'MAGNET_MOUNT');
    this.dropOriginY = mountPort?.offsetY ?? 10;

    // 2. Dây cáp điện Bezier
    this.wireMagnet = new WireCurveView({ stroke: '#EF4444', lineWidth: 2, sagFactor: 40 });
    this.wireGateA = new WireCurveView({ stroke: '#3B82F6', lineWidth: 2, sagFactor: 50 });
    this.wireGateB = new WireCurveView({ stroke: '#F59E0B', lineWidth: 2, sagFactor: 60 });

    // 3. Định vị trí ban đầu
    this.stand.setPosition(0, 0);
    this.electromagnet.setPosition(0, this.dropOriginY);
    this.ball.setPosition(0, this.dropOriginY);

    this.gate1.setPosition(0, this.dropOriginY + 0.2 * this.scalePxPerMeter);
    this.gate2.setPosition(0, this.dropOriginY + 0.8 * this.scalePxPerMeter);

    this.standAssemblyNode.x = this.originX;
    this.standAssemblyNode.y = this.originY;

    this.timer.setPosition(150, 360);
    this.timer.viewNode.cursor = 'grab';

    // 4. Kéo di chuyển Đồng Hồ Hiện Số
    this.timer.viewNode.addInputListener(
      new DragListener({
        targetNode: this.timer.viewNode,
        drag: (_event, listener) => {
          this.timer.viewNode.translation = this.timer.viewNode.translation.plus(listener.modelDelta);
          this.updateWireCurves();
        },
      })
    );

    // 5. Kết nối sự kiện nhả bi từ công tắc nam châm điện
    this.electromagnet.onBallRelease = () => {
      if (!this.isDropping) {
        this.drop();
      }
    };

    // 6. Cho phép kéo di chuyển cả cụm giá đỡ
    this.stand.viewNode.cursor = 'grab';
    this.stand.viewNode.addInputListener(
      new DragListener({
        targetNode: this.standAssemblyNode,
        drag: (_event, listener) => {
          this.standAssemblyNode.translation = this.standAssemblyNode.translation.plus(listener.modelDelta);
          this.updateWireCurves();
        },
      })
    );

    // 7. Cho phép tháo rời và kéo trượt Cổng quang 1 và 2
    this.setupDetachablePhotogate(this.gate1, 0.05, 0.45);
    this.setupDetachablePhotogate(this.gate2, 0.50, 1.05);

    // 8. Cho phép nhặt bi kéo thả tự do / hút vào nam châm
    this.setupBallDragging();

    // 9. Gắn vào Assembly Graph
    this.standAssemblyNode.addChild(this.stand.viewNode);
    this.standAssemblyNode.addChild(this.gate1.viewNode);
    this.standAssemblyNode.addChild(this.gate2.viewNode);
    this.standAssemblyNode.addChild(this.electromagnet.viewNode);
    this.standAssemblyNode.addChild(this.ball.viewNode);

    this.rootNode.addChild(this.wireMagnet);
    this.rootNode.addChild(this.wireGateA);
    this.rootNode.addChild(this.wireGateB);
    this.rootNode.addChild(this.standAssemblyNode);
    this.rootNode.addChild(this.timer.viewNode);

    this.updateWireCurves();
  }

  private updateWireCurves(): void {
    const timerPos = this.timer.viewNode.translation;
    const magGlobal = this.electromagnet.viewNode.localToGlobalPoint(new Vector2(0, 0));
    const gate1Global = this.gate1.viewNode.localToGlobalPoint(new Vector2(-20, 0));
    const gate2Global = this.gate2.viewNode.localToGlobalPoint(new Vector2(-20, 0));

    this.wireMagnet.updateCurve(magGlobal, { x: timerPos.x - 50, y: timerPos.y + 35 });
    this.wireGateA.updateCurve(gate1Global, { x: timerPos.x, y: timerPos.y + 35 });
    this.wireGateB.updateCurve(gate2Global, { x: timerPos.x + 50, y: timerPos.y + 35 });
  }

  public timeScale = 1.0; // 1.0x (thực tế) hoặc 0.5x (slow-mo)

  private setupDetachablePhotogate(gate: PhotogateApparatus, minM: number, maxM: number): void {
    gate.viewNode.cursor = 'grab';
    let isClamped = true;

    gate.viewNode.addInputListener(
      new DragListener({
        drag: (event) => {
          const ptInAssembly = this.standAssemblyNode.globalToLocalPoint(event.pointer.point);
          
          if (Math.abs(ptInAssembly.x) < 45) {
            // Đang ở gần cột -> Khóa vào rãnh trượt đứng
            isClamped = true;
            const minY = this.dropOriginY + minM * this.scalePxPerMeter;
            const maxY = this.dropOriginY + maxM * this.scalePxPerMeter;
            gate.viewNode.y = Math.max(minY, Math.min(maxY, ptInAssembly.y));
            gate.viewNode.x = 0;
          } else {
            // Tháo rời ra ngoài giá đỡ
            isClamped = false;
            gate.viewNode.x = ptInAssembly.x;
            gate.viewNode.y = ptInAssembly.y;
          }
          this.updateWireCurves();
        },
        end: () => {
          if (isClamped) {
            gate.viewNode.x = 0;
          }
          this.updateWireCurves();
        },
      })
    );
  }

  private setupBallDragging(): void {
    this.ball.viewNode.cursor = 'grab';
    this.ball.viewNode.addInputListener(
      new DragListener({
        start: () => {
          this.isDropping = false;
        },
        drag: (event) => {
          const ptInAssembly = this.standAssemblyNode.globalToLocalPoint(event.pointer.point);
          this.ball.viewNode.x = ptInAssembly.x;
          this.ball.viewNode.y = ptInAssembly.y;

          const dist = Math.hypot(ptInAssembly.x, ptInAssembly.y - this.dropOriginY);
          if (dist < 35) {
            this.isBallAttached = true;
            this.ball.viewNode.x = 0;
            this.ball.viewNode.y = this.dropOriginY;
            this.electromagnet.holdBall(this.ball);
            this.resetPhysicsState();
          } else {
            this.isBallAttached = false;
          }
        },
        end: () => {
          if (this.isBallAttached) {
            this.ball.viewNode.x = 0;
            this.ball.viewNode.y = this.dropOriginY;
            this.resetPhysicsState();
          }
        },
      })
    );
  }

  private resetPhysicsState(): void {
    this.isDropping = false;
    this.time = 0;
    this.t1Mark = null;

    const ballKinematic = this.ball.model.getComponent<KinematicComponent>('kinematic')!;
    ballKinematic.yProperty.value = 0.0;
    ballKinematic.vProperty.value = 0.0;
    ballKinematic.aProperty.value = 0.0;

    this.gate1.isTriggered = false;
    this.gate2.isTriggered = false;
    const gate1Sensor = this.gate1.model.getComponent<SensorComponent>('sensor')!;
    const gate2Sensor = this.gate2.model.getComponent<SensorComponent>('sensor')!;
    gate1Sensor.isTriggeredProperty.value = false;
    gate2Sensor.isTriggeredProperty.value = false;

    this.timer.setRecordedTime(0);
  }

  public step(dt: number): void {
    if (!this.isDropping) return;

    const scaledDt = dt * this.timeScale;
    this.time += scaledDt;

    const ballKinematic = this.ball.model.getComponent<KinematicComponent>('kinematic')!;
    const gate1Sensor = this.gate1.model.getComponent<SensorComponent>('sensor')!;
    const gate2Sensor = this.gate2.model.getComponent<SensorComponent>('sensor')!;

    // 1. Giải phương trình vi phân rơi tự do
    KinematicSolver.applyFreeFallStep(ballKinematic, scaledDt);

    const currentY_M = ballKinematic.yProperty.value;
    const currentY_Px = this.dropOriginY + currentY_M * this.scalePxPerMeter;
    this.ball.viewNode.y = currentY_Px;

    // 2. Cập nhật thời gian trên đồng hồ
    this.timer.setRecordedTime(this.time);

    // 3. Kiểm tra cảm biến cổng quang
    const gate1Y_M = (this.gate1.viewNode.y - this.dropOriginY) / this.scalePxPerMeter;
    const gate2Y_M = (this.gate2.viewNode.y - this.dropOriginY) / this.scalePxPerMeter;

    const t1 = gate1Sensor.checkTrigger(currentY_M, gate1Y_M, this.time);
    const t2 = gate2Sensor.checkTrigger(currentY_M, gate2Y_M, this.time);

    if (t1 !== null) {
      this.t1Mark = t1;
      this.gate1.onTrigger(this.time, t1);
    }

    if (t2 !== null) {
      this.gate2.onTrigger(this.time, t2);
      useFreeFallStore.getState().addMeasurement(
        gate1Y_M,
        gate2Y_M,
        this.t1Mark || 0,
        t2
      );
    }

    // Dừng khi chạm đáy giá đỡ
    if (currentY_M > 1.15) {
      this.isDropping = false;
    }
  }

  public drop(): void {
    this.resetPhysicsState();
    this.isDropping = true;
    this.isBallAttached = false;
    this.electromagnet.releaseBall();
  }

  public reset(): void {
    this.resetPhysicsState();
    this.isBallAttached = true;
    this.ball.setPosition(0, this.dropOriginY);
    this.electromagnet.holdBall(this.ball);
  }
}
