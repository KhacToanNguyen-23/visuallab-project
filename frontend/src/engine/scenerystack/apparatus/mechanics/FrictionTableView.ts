/**
 * MẶT BÀN THÍ NGHIỆM MA SÁT (FRICTION_TABLE VIEW)
 * 
 * Hiển thị mặt bàn thí nghiệm với 3 loại vật liệu tiếp xúc:
 * - Gỗ mộc (Wood)
 * - Tấm Mica nhẵn (Smooth Mica)
 * - Tấm Cao su nhám (Rough Rubber)
 */

import { Node, Rectangle, Text, Line } from 'scenerystack/scenery';

export type SurfaceMaterialType = 'WOOD' | 'SMOOTH_MICA' | 'ROUGH_RUBBER';

export interface SurfaceMaterialConfig {
  name: string;
  mu: number;
  bgColor: string;
  borderColor: string;
  texturePattern: 'wood_grain' | 'glossy_reflect' | 'rubber_dots';
}

export const SURFACE_CONFIGS: Record<SurfaceMaterialType, SurfaceMaterialConfig> = {
  WOOD: {
    name: 'Mặt Gỗ Tự Nhiên',
    mu: 0.25,
    bgColor: '#DEB887',
    borderColor: '#8B5A2B',
    texturePattern: 'wood_grain',
  },
  SMOOTH_MICA: {
    name: 'Tấm Mica Nhẵn',
    mu: 0.15,
    bgColor: '#E2E8F0',
    borderColor: '#94A3B8',
    texturePattern: 'glossy_reflect',
  },
  ROUGH_RUBBER: {
    name: 'Tấm Cao Su Nhám',
    mu: 0.45,
    bgColor: '#334155',
    borderColor: '#0F172A',
    texturePattern: 'rubber_dots',
  },
};

export class FrictionTableView extends Node {
  private baseRect: Rectangle;
  private surfaceRect: Rectangle;
  private textureNode: Node;
  private labelText: Text;
  private muLabel: Text;

  private currentMaterial: SurfaceMaterialType = 'WOOD';

  constructor(tableWidth = 600, tableHeight = 40) {
    super();

    // Chân bàn & mặt đế
    this.baseRect = new Rectangle(-tableWidth / 2, 0, tableWidth, tableHeight + 10, 4, 4, {
      fill: '#1E293B',
      stroke: '#0F172A',
      lineWidth: 2,
    });

    // Lớp phủ bề mặt tiếp xúc
    this.surfaceRect = new Rectangle(-tableWidth / 2 + 5, 0, tableWidth - 10, tableHeight, 2, 2, {
      fill: SURFACE_CONFIGS.WOOD.bgColor,
      stroke: SURFACE_CONFIGS.WOOD.borderColor,
      lineWidth: 1.5,
    });

    this.textureNode = new Node();

    // Nhãn vật liệu & hệ số ma sát
    this.labelText = new Text('Mặt Gỗ (μ = 0.25)', {
      font: 'bold 11px sans-serif',
      fill: '#4A2810',
      centerX: 0,
      centerY: tableHeight / 2,
    });

    this.muLabel = new Text('Bề mặt thí nghiệm GDPT 2018', {
      font: '9px sans-serif',
      fill: '#94A3B8',
      left: -tableWidth / 2 + 10,
      bottom: tableHeight + 8,
    });

    this.addChild(this.baseRect);
    this.addChild(this.surfaceRect);
    this.addChild(this.textureNode);
    this.addChild(this.labelText);
    this.addChild(this.muLabel);

    this.setMaterial('WOOD');
  }

  public setMaterial(material: SurfaceMaterialType): void {
    this.currentMaterial = material;
    const cfg = SURFACE_CONFIGS[material];

    this.surfaceRect.fill = cfg.bgColor;
    this.surfaceRect.stroke = cfg.borderColor;

    this.labelText.string = `${cfg.name} (μ = ${cfg.mu.toFixed(2)})`;
    this.labelText.fill = material === 'ROUGH_RUBBER' ? '#F8FAFC' : '#1E293B';

    this.updateTexture(cfg.texturePattern);
  }

  private updateTexture(pattern: 'wood_grain' | 'glossy_reflect' | 'rubber_dots'): void {
    this.textureNode.removeAllChildren();
    const w = 580;

    if (pattern === 'wood_grain') {
      for (let x = -w / 2 + 20; x < w / 2 - 20; x += 40) {
        const line = new Line(x, 8, x + 25, 8, { stroke: '#C49767', lineWidth: 1.5 });
        this.textureNode.addChild(line);
      }
    } else if (pattern === 'glossy_reflect') {
      const shine = new Line(-w / 2 + 20, 6, w / 2 - 20, 6, { stroke: '#FFFFFF', lineWidth: 2, opacity: 0.6 });
      this.textureNode.addChild(shine);
    } else {
      for (let x = -w / 2 + 20; x < w / 2 - 20; x += 25) {
        const dot = new Rectangle(x, 14, 4, 4, { fill: '#64748B' });
        this.textureNode.addChild(dot);
      }
    }
  }

  public getMaterial(): SurfaceMaterialType {
    return this.currentMaterial;
  }
}
