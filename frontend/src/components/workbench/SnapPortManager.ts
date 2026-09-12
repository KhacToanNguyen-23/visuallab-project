export type SnapPortType = 'SPRING_HOOK' | 'MASS_LOOP' | 'CIRCUIT_TERMINAL' | 'OPTIC_SURFACE';

export interface SnapPort {
  id: string;
  itemId: string;
  type: SnapPortType;
  x: number;
  y: number;
  isConnected: boolean;
  connectedToId?: string;
}

export class SnapPortManager {
  private static SNAP_RADIUS = 15; // 15px magnetic snap distance

  /**
   * Find nearest compatible snap port for a given dragging item
   */
  public static findSnapTarget(
    currentPort: SnapPort,
    allPorts: SnapPort[]
  ): { targetPort: SnapPort; distance: number } | null {
    let nearestTarget: SnapPort | null = null;
    let minDistance = Infinity;

    for (const port of allPorts) {
      if (port.itemId === currentPort.itemId) continue; // Don't snap to self

      const dx = port.x - currentPort.x;
      const dy = port.y - currentPort.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.SNAP_RADIUS && dist < minDistance) {
        minDistance = dist;
        nearestTarget = port;
      }
    }

    return nearestTarget ? { targetPort: nearestTarget, distance: minDistance } : null;
  }
}
