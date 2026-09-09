import type { ComponentData } from '../engine/physics/CircuitSolver';

export function encodeStateToURL(components: ComponentData[]): string {
  try {
    const compactData = components.map(c => ({
      id: c.id,
      t: c.type,
      l: c.label,
      nA: c.nodeA,
      nB: c.nodeB,
      pA: c.posA,
      pB: c.posB,
      v: c.value,
      o: c.isOpen
    }));

    const jsonString = JSON.stringify(compactData);
    const base64 = btoa(encodeURIComponent(jsonString));
    const url = new URL(window.location.href);
    url.searchParams.set('simState', base64);
    return url.toString();
  } catch (err) {
    console.error('Failed to encode simulation state:', err);
    return window.location.href;
  }
}

export function decodeStateFromURL(): ComponentData[] | null {
  try {
    const url = new URL(window.location.href);
    const base64 = url.searchParams.get('simState');
    if (!base64) return null;

    const jsonString = decodeURIComponent(atob(base64));
    const compactData = JSON.parse(jsonString);

    return compactData.map((item: any) => ({
      id: item.id,
      type: item.t,
      label: item.l,
      nodeA: item.nA,
      nodeB: item.nB,
      posA: item.pA,
      posB: item.pB,
      value: item.v,
      isOpen: item.o
    }));
  } catch (err) {
    console.error('Failed to decode simulation state from URL:', err);
    return null;
  }
}
