import { Node, Rectangle, Path, Text, DragListener, Circle } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';
import { LabDeviceModel } from '../core/models/LabDeviceModel.ts';
import { KinematicComponent } from '../core/models/components/KinematicComponent.ts';
import { SpringComponent } from '../core/models/components/SpringComponent.ts';
import { SpringView } from '../apparatus/mechanics/SpringView.ts';
import { WeightHangerView } from '../apparatus/mechanics/WeightHangerView.ts';
import { HarmonicOscillatorSolver } from '../core/physics/HarmonicOscillatorSolver.ts';
import { useSpringMassStore } from '../../../store/useSpringMassStore.ts';

export class SpringMassScene {
  public rootNode = new Node();

  public springModel = new LabDeviceModel();
  public massModel = new LabDeviceModel();

  public springView: SpringView;
  public hangerView: WeightHangerView;

  private standAssemblyNode = new Node();
  private weightTrayNode = new Node();
  private snapHaloNode: Circle;

  private readonly originX = 100; // Tương đối trong standAssemblyNode
  private readonly originY = 50;
  private readonly scalePxPerMeter = 600; // 1m = 600px => 0.1m = 60px
  private isDraggingMass = false;
  private unsubscribeStore: () => void;

  constructor() {
    // 1. Components
    const initialK = useSpringMassStore.getState().stiffnessK;
    const initialL0 = useSpringMassStore.getState().naturalLengthL0;

    const springComp = new SpringComponent(initialK, initialL0, 0.8);
    this.springModel.addComponent(springComp);

    const kinematicComp = new KinematicComponent(0.02); // Móc treo rỗng nặng 20g
    kinematicComp.yProperty.value = initialL0;
    this.massModel.addComponent(kinematicComp);

    // 2. Cột giá đỡ & Thước đo mm chia độ (Tạo thành cụm StandAssembly có thể kéo di chuyển tự do)
    this.standAssemblyNode.x = 260;
    this.standAssemblyNode.y = 40;
    this.standAssemblyNode.cursor = 'grab';

    const standBody = new Node();
    const pole = new Rectangle(30, 30, 20, 460, { fill: '#cbd5e1', stroke: '#94a3b8', lineWidth: 2 });
    const arm = new Rectangle(30, 40, 80, 14, 2, 2, { fill: '#475569', stroke: '#1e293b', lineWidth: 1.5 });
    const base = new Rectangle(0, 480, 140, 20, 4, 4, { fill: '#334155' });
    const dragHint = new Text('✥ Kéo di chuyển giá đỡ', { font: 'bold 10px sans-serif', fill: '#64748b', centerX: 70, bottom: 475 });
    
    standBody.addChild(pole);
    standBody.addChild(arm);
    standBody.addChild(base);
    standBody.addChild(dragHint);

    // Thước đo milimet dán cạnh lò xo
    const rulerShape = new Shape();
    for (let i = 0; i <= 60; i++) {
      const y = this.originY + i * 6; // 1cm = 6px
      if (i % 5 === 0) {
        rulerShape.moveTo(170, y);
        rulerShape.lineTo(185, y);
        const label = new Text(`${i}cm`, { font: 'bold 9px Arial', fill: '#0f172a', left: 190, centerY: y });
        standBody.addChild(label);
      } else {
        rulerShape.moveTo(175, y);
        rulerShape.lineTo(185, y);
      }
    }
    const rulerMarks = new Path(rulerShape, { stroke: '#334155', lineWidth: 1 });
    standBody.addChild(rulerMarks);
    this.standAssemblyNode.addChild(standBody);

    // Thêm DragListener cho toàn bộ Cột Giá Đỡ
    standBody.addInputListener(
      new DragListener({
        targetNode: this.standAssemblyNode,
        drag: (_event, listener) => {
          this.standAssemblyNode.translation = this.standAssemblyNode.translation.plus(listener.modelDelta);
        },
      })
    );

    // 3. Lò xo & Móc treo quả cân (Đặt trong standAssemblyNode)
    this.springView = new SpringView({ scalePxPerMeter: this.scalePxPerMeter });
    this.springView.x = this.originX;
    this.springView.y = this.originY;
    this.standAssemblyNode.addChild(this.springView);

    this.hangerView = new WeightHangerView();
    this.hangerView.x = this.originX;
    this.hangerView.cursor = 'ns-resize';
    this.standAssemblyNode.addChild(this.hangerView);

    // Vòng tròn halo báo hiệu điểm hút quả cân
    this.snapHaloNode = new Circle(25, {
      stroke: '#3b82f6',
      lineWidth: 3,
      lineDash: [4, 4],
      fill: 'rgba(59, 130, 246, 0.15)',
      visible: false,
    });
    this.standAssemblyNode.addChild(this.snapHaloNode);

    // 4. Kéo trực tiếp quả cân/móc treo để KÍCH DAO ĐỘNG TỰ NHIÊN
    this.hangerView.addInputListener(
      new DragListener({
        start: () => {
          this.isDraggingMass = true;
          kinematicComp.vProperty.value = 0;
        },
        drag: (event) => {
          const pointInAssembly = this.standAssemblyNode.globalToLocalPoint(event.pointer.point);
          const dyPx = pointInAssembly.y - this.originY;
          const targetLengthM = Math.max(0.08, Math.min(0.65, dyPx / this.scalePxPerMeter));
          kinematicComp.yProperty.value = targetLengthM;
          springComp.currentLength.value = targetLengthM;
          kinematicComp.vProperty.value = 0;
        },
        end: () => {
          this.isDraggingMass = false;
        },
      })
    );

    // Double click hoặc click phải vào móc treo để tháo bớt 1 quả cân
    this.hangerView.addInputListener({
      down: (event) => {
        const domEvent = event.domEvent as MouseEvent | undefined;
        if (domEvent?.button === 2 || domEvent?.detail === 2) {
          const count = useSpringMassStore.getState().weightsCount;
          if (count > 0) {
            useSpringMassStore.getState().setWeightsCount(count - 1);
          }
        }
      },
    });

    this.rootNode.addChild(this.standAssemblyNode);

    // 5. Khay Quả Cân Gia Tải Kéo Thả (Draggable Weight Tray)
    this.buildInteractiveWeightTray();
    this.rootNode.addChild(this.weightTrayNode);

    // 6. Lắng nghe Zustand Store
    this.unsubscribeStore = useSpringMassStore.subscribe((state) => {
      springComp.kProperty.value = state.stiffnessK;
      const totalMassKg = 0.02 + state.weightsCount * state.customWeightMassKg;
      kinematicComp.mass.value = totalMassKg;
      this.hangerView.updateWeights(state.weightsCount, state.customWeightMassKg * 1000);
    });
  }

  /**
   * Tạo khay quả cân hỗ trợ KÉO THẢ TRỰC TIẾP LÊN MÓC TREO
   */
  private buildInteractiveWeightTray(): void {
    this.weightTrayNode.x = 40;
    this.weightTrayNode.y = 360;

    const trayBg = new Rectangle(0, 0, 170, 130, 8, 8, {
      fill: '#f8fafc',
      stroke: '#94a3b8',
      lineWidth: 2,
    });
    const trayTitle = new Text('Khay Quả Cân Gia Tải', {
      font: 'bold 11px sans-serif',
      fill: '#1e293b',
      centerX: 85,
      top: 8,
    });
    const traySub = new Text('Kéo quả cân thả vào móc', {
      font: 'bold 9px sans-serif',
      fill: '#2563eb',
      centerX: 85,
      top: 24,
    });

    this.weightTrayNode.addChild(trayBg);
    this.weightTrayNode.addChild(trayTitle);
    this.weightTrayNode.addChild(traySub);

    // 6 Quả cân kéo thả
    for (let i = 0; i < 6; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const homeX = 32 + col * 52;
      const homeY = 60 + row * 34;

      const weightNode = new Node({ x: homeX, y: homeY, cursor: 'grab' });
      const disc = new Rectangle(-18, -10, 36, 20, 3, 3, {
        fill: '#475569',
        stroke: '#0f172a',
        lineWidth: 1.5,
      });
      const ring = new Circle(3, { fill: '#cbd5e1', y: -2 });
      const label = new Text('m', { font: 'bold 10px sans-serif', fill: '#ffffff', centerX: 0, centerY: 0 });

      weightNode.addChild(disc);
      weightNode.addChild(ring);
      weightNode.addChild(label);

      // Thêm DragListener kéo thả quả cân từ khay lên móc
      weightNode.addInputListener(
        new DragListener({
          start: () => {
            weightNode.opacity = 0.85;
          },
          drag: (event) => {
            // Cập nhật vị trí quả cân theo chuột
            const posInTray = this.weightTrayNode.globalToLocalPoint(event.pointer.point);
            weightNode.x = posInTray.x;
            weightNode.y = posInTray.y;

            // Kiểm tra khoảng cách tới móc treo
            const hookGlobal = this.hangerView.localToGlobalPoint(new Vector2(0, 55));
            const dragGlobal = event.pointer.point;
            const distToHook = dragGlobal.distance(hookGlobal);

            if (distToHook < 90) {
              const hookInStand = this.standAssemblyNode.globalToLocalPoint(hookGlobal);
              this.snapHaloNode.x = hookInStand.x;
              this.snapHaloNode.y = hookInStand.y;
              this.snapHaloNode.visible = true;
            } else {
              this.snapHaloNode.visible = false;
            }
          },
          end: (event) => {
            weightNode.opacity = 1.0;
            this.snapHaloNode.visible = false;

            if (event?.pointer?.point) {
              const hookGlobal = this.hangerView.localToGlobalPoint(new Vector2(0, 55));
              const dragGlobal = event.pointer.point;
              const distToHook = dragGlobal.distance(hookGlobal);

              if (distToHook < 90) {
                // Snap thành công vào móc treo -> Tăng số quả cân
                const count = useSpringMassStore.getState().weightsCount;
                if (count < 6) {
                  useSpringMassStore.getState().setWeightsCount(count + 1);
                }
              }
            }

            // Trả quả cân trong khay về vị trí ban đầu
            weightNode.x = homeX;
            weightNode.y = homeY;
          },
        })
      );

      this.weightTrayNode.addChild(weightNode);
    }
  }

  public step(dt: number): void {
    const kinematic = this.massModel.getComponent<KinematicComponent>('kinematic')!;
    const spring = this.springModel.getComponent<SpringComponent>('spring')!;

    if (!this.isDraggingMass) {
      // 1. Tính toán vi phân dao động tự nhiên điều hòa & lực cản
      HarmonicOscillatorSolver.step(kinematic, spring, dt);
    }

    // 2. Cập nhật vị trí render
    const currentLengthM = spring.currentLength.value;
    this.springView.updateLength(currentLengthM);

    const lengthPx = currentLengthM * this.scalePxPerMeter;
    this.hangerView.y = this.originY + lengthPx;
  }

  public getCurrentLength(): number {
    const spring = this.springModel.getComponent<SpringComponent>('spring')!;
    return spring.currentLength.value;
  }

  public perturb(): void {
    const kinematic = this.massModel.getComponent<KinematicComponent>('kinematic')!;
    kinematic.yProperty.value += 0.04; // Kéo dãn thêm 4cm
    kinematic.vProperty.value = 0;
  }

  public dispose(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }
}
