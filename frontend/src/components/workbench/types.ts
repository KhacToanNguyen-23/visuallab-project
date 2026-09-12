export type ComponentCategory = 'mechanics' | 'circuits' | 'optics' | 'tools';

export interface PaletteItemDef {
  type: string;
  category: ComponentCategory;
  name: string;
  description: string;
  icon: string;
  badge: string;
  color: string;
  defaultConfig?: Record<string, any>;
}

export interface PlacedItem {
  id: string;
  type: string;
  name: string;
  icon: string;
  category: string;
  x: number;
  y: number;
  config: Record<string, any>;
}
