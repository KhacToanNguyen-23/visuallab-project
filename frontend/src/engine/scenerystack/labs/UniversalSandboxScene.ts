/**
 * BÀN THÍ NGHIỆM ĐA NĂNG ĐA THỰC THỂ (UNIVERSAL SANDBOX SCENE)
 * 
 * - Quản lý động danh sách thiết bị trên Canvas thông qua Factory chuẩn OOP.
 * - Tự động quét và liên kết các cổng SnapPort giữa các thiết bị khi kéo thả.
 * - Cập nhật vật lý đa hình (Polymorphic updatePhysics) không dùng switch-case.
 */

import { Node, Circle } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';
import { ApparatusFactory } from '../apparatus/base/ApparatusFactory.ts';
import type { BaseApparatus } from '../apparatus/base/BaseApparatus.ts';
import { SnapEngine, type SnapPort } from '../interaction/SnapEngine.ts';
import type { DeviceType } from '../../../components/workbench/WorkbenchPalette.tsx';
import { ElectromagnetApparatus } from '../apparatus/concrete/ElectromagnetApparatus.ts';
import { BallApparatus } from '../apparatus/concrete/BallApparatus.ts';
import { PhotogateApparatus } from '../apparatus/concrete/PhotogateApparatus.ts';
import { DigitalTimerApparatus } from '../apparatus/concrete/DigitalTimerApparatus.ts';
import { WireCurveView } from '../apparatus/circuits/WireCurveView.ts';
import { KinematicComponent } from '../core/models/components/KinematicComponent.ts';
import { SensorComponent } from '../core/models/components/SensorComponent.ts';
import { KinematicSolver } from '../core/physics/KinematicSolver.ts';

export class UniversalSandboxScene {
  public rootNode = new Node();
  public wiresLayer = new Node();
  public apparatusLayer = new Node();
  public snapGlowNode = new Circle(16, {
    stroke: '#22c55e',
    lineWidth: 3,
    fill: 'rgba(34, 197, 94, 0.35)',
    visible: false,
  });

  private apparatusList: Map<string, BaseApparatus> = new Map();
  private isSimulating = false;
  private simTime = 0;
  private t1Mark: number | null = null;

  // Dây điện mềm động nối Timer tới các thiết bị
  private wireMagnet = new WireCurveView({ stroke: '#EF4444', lineWidth: 2, sagFactor: 40 });
  private wireGateA = new WireCurveView({ stroke: '#3B82F6', lineWidth: 2, sagFactor: 50 });
  private wireGateB = new WireCurveView({ stroke: '#F59E0B', lineWidth: 2, sagFactor: 60 });

  constructor() {
    this.wiresLayer.addChild(this.wireMagnet);
    this.wiresLayer.addChild(this.wireGateA);
    this.wiresLayer.addChild(this.wireGateB);

    this.rootNode.addChild(this.wiresLayer);
    this.rootNode.addChild(this.apparatusLayer);
    this.rootNode.addChild(this.snapGlowNode);
  }

  public updateWiring(): void {
    const timer = Array.from(this.apparatusList.values()).find(
      (a): a is DigitalTimerApparatus => a instanceof DigitalTimerApparatus
    );
    const emag = Array.from(this.apparatusList.values()).find(
      (a): a is ElectromagnetApparatus => a instanceof ElectromagnetApparatus
    );
    const gates = Array.from(this.apparatusList.values()).filter(
      (a): a is PhotogateApparatus => a instanceof PhotogateApparatus
    );

    if (timer) {
      const timerPos = timer.viewNode.translation;

      // Nối dây nam châm điện
      if (emag) {
        this.wireMagnet.visible = true;
        const magPos = emag.viewNode.localToGlobalPoint(new Vector2(0, 0));
        const magLocal = this.wiresLayer.globalToLocalPoint(magPos);
        this.wireMagnet.updateCurve(magLocal, { x: timerPos.x - 50, y: timerPos.y + 35 });
      } else {
        this.wireMagnet.visible = false;
      }

      // Nối dây Cổng quang A
      if (gates.length > 0) {
        this.wireGateA.visible = true;
        const gateAPos = gates[0].viewNode.localToGlobalPoint(new Vector2(-20, 0));
        const gateALocal = this.wiresLayer.globalToLocalPoint(gateAPos);
        this.wireGateA.updateCurve(gateALocal, { x: timerPos.x, y: timerPos.y + 35 });
      } else {
        this.wireGateA.visible = false;
      }

      // Nối dây Cổng quang B
      if (gates.length > 1) {
        this.wireGateB.visible = true;
        const gateBPos = gates[1].viewNode.localToGlobalPoint(new Vector2(-20, 0));
        const gateBLocal = this.wiresLayer.globalToLocalPoint(gateBPos);
        this.wireGateB.updateCurve(gateBLocal, { x: timerPos.x + 50, y: timerPos.y + 35 });
      } else {
        this.wireGateB.visible = false;
      }
    } else {
      this.wireMagnet.visible = false;
      this.wireGateA.visible = false;
      this.wireGateB.visible = false;
    }
  }

  /**
   * Khởi tạo và đưa một linh kiện mới ra bàn làm việc
   */
  public spawnDevice(type: DeviceType): void {
    const apparatus = ApparatusFactory.create(type);

    const spawnX = 300 + Math.random() * 80;
    const spawnY = 150 + Math.random() * 80;
    apparatus.setPosition(spawnX, spawnY);

    // Bắt sự kiện thả bi từ nam châm điện
    if (apparatus instanceof ElectromagnetApparatus) {
      apparatus.onBallRelease = () => {
        this.startFreeFallSimulation();
      };
    }

    // Bật kéo thả vi phân và cơ chế hút nam châm
    let activeSnap: { targetPort: SnapPort; globalTarget: { x: number; y: number }; targetAngleRad?: number } | null = null;

    apparatus.enableDragging(
      this.rootNode,
      // onDragMove: Quét tìm điểm hút gần nhất
      () => {
        this.updateWiring();
        if (apparatus.snapPorts.length > 0) {
          const allOtherPorts = Array.from(this.apparatusList.values())
            .filter((a) => a.id !== apparatus.id)
            .flatMap((a) => a.snapPorts);

          const snap = SnapEngine.findNearestSnap(apparatus.snapPorts[0], allOtherPorts, 50);
          if (snap) {
            activeSnap = snap;
            const glowPos = this.rootNode.globalToParentPoint(new Vector2(snap.globalTarget.x, snap.globalTarget.y));
            this.snapGlowNode.x = glowPos.x;
            this.snapGlowNode.y = glowPos.y;
            this.snapGlowNode.visible = true;

            // Lực hút mềm (Magnetic Lerp)
            apparatus.viewNode.x = SnapEngine.lerp(apparatus.viewNode.x, glowPos.x, 0.4);
            apparatus.viewNode.y = SnapEngine.lerp(apparatus.viewNode.y, glowPos.y, 0.4);

            if (snap.targetAngleRad !== undefined) {
              apparatus.viewNode.rotation = SnapEngine.lerp(apparatus.viewNode.rotation, snap.targetAngleRad, 0.3);
            }
          } else {
            activeSnap = null;
            this.snapGlowNode.visible = false;
          }
        }
      },
      // onDragEnd: Khóa dính và gọi hook onSnapped
      () => {
        this.snapGlowNode.visible = false;
        if (activeSnap) {
          const glowPos = this.rootNode.globalToParentPoint(new Vector2(activeSnap.globalTarget.x, activeSnap.globalTarget.y));
          apparatus.viewNode.x = glowPos.x;
          apparatus.viewNode.y = glowPos.y;
          if (activeSnap.targetAngleRad !== undefined) {
            apparatus.viewNode.rotation = activeSnap.targetAngleRad;
          }

          const host = this.apparatusList.get(activeSnap.targetPort.entityId);
          if (host && apparatus.onSnapped) {
            apparatus.onSnapped(host, apparatus.snapPorts[0], activeSnap.targetPort);
          }
          activeSnap = null;
        }
        this.updateWiring();
      }
    );

    this.apparatusList.set(apparatus.id, apparatus);
    this.apparatusLayer.addChild(apparatus.viewNode);
    this.updateWiring();
  }

  private startFreeFallSimulation(): void {
    this.isSimulating = true;
    this.simTime = 0;
    this.t1Mark = null;

    const ball = Array.from(this.apparatusList.values()).find(
      (a): a is BallApparatus => a instanceof BallApparatus
    );
    if (ball) {
      const kinematic = ball.model.getComponent<KinematicComponent>('kinematic');
      if (kinematic) {
        kinematic.yProperty.value = 0;
        kinematic.vProperty.value = 0;
      }
    }
  }

  /**
   * Vòng lặp cập nhật vật lý đa hình cho tất cả linh kiện đang có
   */
  public step(dt: number): void {
    if (!this.isSimulating) return;

    this.simTime += dt;

    // Cập nhật đa hình cho từng apparatus
    for (const apparatus of this.apparatusList.values()) {
      apparatus.updatePhysics(dt);
    }

    // Tương tác rơi tự do giữa Ball, Photogates và DigitalTimer nếu có
    const ball = Array.from(this.apparatusList.values()).find(
      (a): a is BallApparatus => a instanceof BallApparatus
    );
    const timer = Array.from(this.apparatusList.values()).find(
      (a): a is DigitalTimerApparatus => a instanceof DigitalTimerApparatus
    );
    const gates = Array.from(this.apparatusList.values()).filter(
      (a): a is PhotogateApparatus => a instanceof PhotogateApparatus
    );

    if (ball) {
      const kinematic = ball.model.getComponent<KinematicComponent>('kinematic');
      if (kinematic) {
        KinematicSolver.applyFreeFallStep(kinematic, dt);
        ball.viewNode.y += kinematic.vProperty.value * dt * 360;

        if (timer) {
          timer.setRecordedTime(this.simTime);
        }

        for (let i = 0; i < gates.length; i++) {
          const gate = gates[i];
          const gateSensor = gate.model.getComponent<SensorComponent>('sensor');
          if (gateSensor) {
            // Kiểm tra va chạm tia sáng quang học
            const gateY_Px = gate.viewNode.y;
            const ballY_Px = ball.viewNode.y;
            if (Math.abs(ballY_Px - gateY_Px) < 15 && !gate.isTriggered) {
              gate.onTrigger(this.simTime, this.simTime);
              if (i === 0) {
                this.t1Mark = this.simTime;
              } else if (i === 1 && this.t1Mark !== null && timer) {
                const deltaT = this.simTime - this.t1Mark;
                timer.setRecordedTime(deltaT);
              }
            }
          }
        }

        // Chạm đất
        if (ball.viewNode.y > 600) {
          this.isSimulating = false;
        }
      }
    }
  }

  public play(): void {
    this.isSimulating = true;
  }

  public pause(): void {
    this.isSimulating = false;
  }

  public reset(): void {
    this.isSimulating = false;
    this.simTime = 0;
    this.t1Mark = null;

    const timer = Array.from(this.apparatusList.values()).find(
      (a): a is DigitalTimerApparatus => a instanceof DigitalTimerApparatus
    );
    if (timer) {
      timer.setRecordedTime(0);
    }

    const gates = Array.from(this.apparatusList.values()).filter(
      (a): a is PhotogateApparatus => a instanceof PhotogateApparatus
    );
    for (const gate of gates) {
      gate.isTriggered = false;
      const sensor = gate.model.getComponent<SensorComponent>('sensor');
      if (sensor) {
        sensor.isTriggeredProperty.value = false;
      }
    }
  }

  public clearAll(): void {
    this.reset();
    for (const apparatus of this.apparatusList.values()) {
      this.apparatusLayer.removeChild(apparatus.viewNode);
      apparatus.dispose();
    }
    this.apparatusList.clear();
    this.updateWiring();
  }
}
