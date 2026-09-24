import { create } from 'zustand';
import { Vector2 } from 'scenerystack/dot';
import type { ILabInstrument } from '../physics/ILabInstrument';

export interface WireConnection {
  id: string;
  fromInstrumentId: string;
  fromTerminalId: string;
  toInstrumentId: string;
  toTerminalId: string;
  color: string;
}

interface WorkbenchState {
  instruments: ILabInstrument[];
  connections: WireConnection[];
  selectedInstrumentId: string | null;
  isGridSnapEnabled: boolean;
  gridSize: number;

  // Actions
  addInstrument: (instrument: ILabInstrument) => void;
  removeInstrument: (id: string) => void;
  updateInstrumentPosition: (id: string, pos: Vector2) => void;
  updateInstrumentParam: (id: string, paramId: string, value: any) => void;
  selectInstrument: (id: string | null) => void;
  
  addConnection: (connection: Omit<WireConnection, 'id'>) => void;
  removeConnection: (id: string) => void;
  
  setGridSnap: (enabled: boolean) => void;
  clearWorkbench: () => void;
  
  // JSONB Persistence
  serializeWorkbenchState: () => Record<string, any>;
  deserializeWorkbenchState: (state: Record<string, any>) => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set, get) => ({
  instruments: [],
  connections: [],
  selectedInstrumentId: null,
  isGridSnapEnabled: true,
  gridSize: 20,

  addInstrument: (instrument) => {
    set((state) => ({
      instruments: [...state.instruments, instrument],
      selectedInstrumentId: instrument.id,
    }));
  },

  removeInstrument: (id) => {
    const inst = get().instruments.find((i) => i.id === id);
    if (inst) {
      inst.dispose();
    }
    set((state) => ({
      instruments: state.instruments.filter((i) => i.id !== id),
      connections: state.connections.filter(
        (c) => c.fromInstrumentId !== id && c.toInstrumentId !== id
      ),
      selectedInstrumentId:
        state.selectedInstrumentId === id ? null : state.selectedInstrumentId,
    }));
  },

  updateInstrumentPosition: (id, pos) => {
    const { isGridSnapEnabled, gridSize } = get();
    let targetPos = pos.copy();
    if (isGridSnapEnabled) {
      targetPos.setXY(
        Math.round(pos.x / gridSize) * gridSize,
        Math.round(pos.y / gridSize) * gridSize
      );
    }

    set((state) => ({
      instruments: state.instruments.map((inst) => {
        if (inst.id === id) {
          inst.onDrag(targetPos);
        }
        return inst;
      }),
    }));
  },

  updateInstrumentParam: (id, paramId, value) => {
    set((state) => ({
      instruments: state.instruments.map((inst) => {
        if (inst.id === id) {
          inst.setParam(paramId, value);
        }
        return inst;
      }),
    }));
  },

  selectInstrument: (id) => {
    set({ selectedInstrumentId: id });
  },

  addConnection: (conn) => {
    const newId = `wire_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    set((state) => ({
      connections: [...state.connections, { ...conn, id: newId }],
    }));
  },

  removeConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    }));
  },

  setGridSnap: (enabled) => {
    set({ isGridSnapEnabled: enabled });
  },

  clearWorkbench: () => {
    const { instruments } = get();
    for (const inst of instruments) {
      inst.dispose();
    }
    set({
      instruments: [],
      connections: [],
      selectedInstrumentId: null,
    });
  },

  serializeWorkbenchState: () => {
    const { instruments, connections } = get();
    return {
      schemaVersion: '1.0',
      instruments: instruments.map((i) => i.serialize()),
      connections,
    };
  },

  deserializeWorkbenchState: (state) => {
    if (!state) return;
    get().clearWorkbench();
    // Khôi phục dụng cụ
    if (state.connections) {
      set({ connections: state.connections });
    }
  },
}));
