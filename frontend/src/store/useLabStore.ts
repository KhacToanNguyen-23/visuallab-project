import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ToolID = string;

export interface LabEntity {
  id: string;
  type: ToolID;
  toolId?: string;
  config: Record<string, any>;
  initialTransform: {
    x: number;
    y: number;
    z?: number;
    rotation?: number;
  };
  isSimulating?: boolean; // Controls if the object is subject to dynamic physics
  anchors?: { id: string; localPosition: [number, number, number]; type: string }[];
}

export interface LabEvent {
  id: string;
  type: string;
  payload: Record<string, any>;
  timestamp: number;
}

export interface LabConnection {
  id: string;
  fromEntityId: string;
  fromPort: string;
  toEntityId: string;
  toPort: string;
}

export interface LabState {
  mode: 'sandbox' | 'guided';
  entities: Record<string, LabEntity>;
  events: LabEvent[];
  selectedEntityId: string | null;
  connections: LabConnection[];
  wiringState: { activeFromId: string | null; activeFromPort: string | null };
  
  // Actions
  setMode: (mode: 'sandbox' | 'guided') => void;
  setSelectedEntity: (id: string | null) => void;
  setWiringState: (fromId: string | null, fromPort: string | null) => void;
  addConnection: (connection: LabConnection) => void;
  removeConnection: (id: string) => void;
  addEntity: (entity: LabEntity) => void;
  removeEntity: (id: string) => void;
  updateEntityConfig: (id: string, configUpdates: Record<string, any>) => void;
  updateEntityState: (id: string, updates: Partial<LabEntity>) => void;
  emitEvent: (type: string, payload?: Record<string, any>) => void;
  resetSimulation: () => void;
  loadState: (entities: Record<string, LabEntity>, mode?: 'sandbox' | 'guided') => void;
  clearState: () => void;
}

export const useLabStore = create<LabState>()(
  devtools(
    (set) => ({
      mode: 'sandbox',
      entities: {},
      events: [],
      selectedEntityId: null,
      connections: [],
      wiringState: { activeFromId: null, activeFromPort: null },

      setMode: (mode) => set({ mode }, false, 'setMode'),
      setSelectedEntity: (id) => set({ selectedEntityId: id }, false, 'setSelectedEntity'),
      setWiringState: (fromId, fromPort) => set({ wiringState: { activeFromId: fromId, activeFromPort: fromPort } }, false, 'setWiringState'),
      
      addConnection: (connection) =>
        set((state) => ({ connections: [...state.connections, connection] }), false, 'addConnection'),
      
      removeConnection: (id) =>
        set((state) => ({ connections: state.connections.filter(c => c.id !== id) }), false, 'removeConnection'),

      addEntity: (entity) =>
        set(
          (state) => ({
            entities: {
              ...state.entities,
              [entity.id]: entity,
            },
          }),
          false,
          'addEntity'
        ),

      removeEntity: (id) =>
        set(
          (state) => {
            const newEntities = { ...state.entities };
            delete newEntities[id];
            return { entities: newEntities };
          },
          false,
          'removeEntity'
        ),

      updateEntityConfig: (id, configUpdates) =>
        set(
          (state) => {
            const entity = state.entities[id];
            if (!entity) return state;

            return {
              entities: {
                ...state.entities,
                [id]: {
                  ...entity,
                  config: {
                    ...entity.config,
                    ...configUpdates,
                  },
                },
              },
            };
          },
          false,
          'updateEntityConfig'
        ),

      updateEntityState: (id, updates) =>
        set(
          (state) => {
            const entity = state.entities[id];
            if (!entity) return state;

            return {
              entities: {
                ...state.entities,
                [id]: {
                  ...entity,
                  ...updates,
                },
              },
            };
          },
          false,
          'updateEntityState'
        ),

      emitEvent: (type, payload = {}) =>
        set(
          (state) => ({
            events: [
              ...state.events,
              {
                id: `${type}-${Date.now()}-${Math.random()}`,
                type,
                payload,
                timestamp: performance.now(),
              },
            ],
          }),
          false,
          'emitEvent'
        ),

      resetSimulation: () =>
        set(
          (state) => {
            const newEntities = { ...state.entities };
            // Reset all entities to their initial transform and turn off simulation
            Object.keys(newEntities).forEach(id => {
              newEntities[id] = {
                ...newEntities[id],
                isSimulating: false,
              };
            });
            // Clear events history
            return { entities: newEntities, events: [] };
          },
          false,
          'resetSimulation'
        ),

      loadState: (entities, mode = 'sandbox') =>
        set({ entities, mode, selectedEntityId: null, events: [], connections: [], wiringState: { activeFromId: null, activeFromPort: null } }, false, 'loadState'),

      clearState: () => set({ entities: {}, mode: 'sandbox', events: [], selectedEntityId: null, connections: [], wiringState: { activeFromId: null, activeFromPort: null } }, false, 'clearState'),
    }),
    { name: 'VisualLabStore' }
  )
);
