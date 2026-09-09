export type ComponentType = 'battery' | 'resistor' | 'bulb' | 'switch' | 'wire' | 'ammeter' | 'voltmeter';

export interface ComponentData {
  id: string;
  type: ComponentType;
  label: string;
  nodeA: string; // ID of terminal A
  nodeB: string; // ID of terminal B
  posA: { x: number; y: number };
  posB: { x: number; y: number };
  value: number; // Voltage for battery (V), Resistance for resistor/bulb (ohm)
  isOpen?: boolean; // For switch
  // Calculated state:
  current?: number; // Current in Amperes
  voltageDrop?: number; // Voltage drop V_A - V_B
  power?: number; // Power in Watts (P = I^2 * R)
  brightness?: number; // Normalized 0 to 1 for bulb
}

export interface CircuitState {
  components: ComponentData[];
  nodes: { [nodeId: string]: number }; // Node ID -> Voltage V
}

/**
 * Solves the DC circuit state using Modified Nodal Analysis (MNA).
 */
export function solveDCCircuit(components: ComponentData[]): CircuitState {
  // Deep clone components to store results
  const updatedComponents: ComponentData[] = JSON.parse(JSON.stringify(components));

  // 1. Identify unique node IDs
  const nodeSet = new Set<string>();
  updatedComponents.forEach(c => {
    nodeSet.add(c.nodeA);
    nodeSet.add(c.nodeB);
  });

  const nodeList = Array.from(nodeSet);
  if (nodeList.length < 2) {
    return { components: updatedComponents, nodes: {} };
  }

  // Assign node 0 as Ground (0V)
  const groundNode = nodeList[0];
  const nonGroundNodes = nodeList.filter(n => n !== groundNode);
  const N = nonGroundNodes.length;

  const nodeIndexMap = new Map<string, number>();
  nonGroundNodes.forEach((id, idx) => nodeIndexMap.set(id, idx));

  // Identify independent voltage sources (Batteries)
  const voltageSources = updatedComponents.filter(c => c.type === 'battery');
  const M = voltageSources.length;

  const Size = N + M;
  if (Size === 0) {
    return { components: updatedComponents, nodes: {} };
  }

  // Create Matrix A (Size x Size) and Vector Z (Size)
  const A: number[][] = Array.from({ length: Size }, () => Array(Size).fill(0));
  const Z: number[] = Array(Size).fill(0);

  // Helper to add conductance G to node pair
  const addConductance = (node1: string, node2: string, G: number) => {
    const i = nodeIndexMap.get(node1);
    const j = nodeIndexMap.get(node2);

    if (i !== undefined) A[i][i] += G;
    if (j !== undefined) A[j][j] += G;
    if (i !== undefined && j !== undefined) {
      A[i][j] -= G;
      A[j][i] -= G;
    }
  };

  // Populate Conductance (G) matrix
  const R_SMALL = 1e-4; // Small resistance for wires, switches, ammeters
  const R_HIGH = 1e8;  // High resistance for open switches & voltmeters

  updatedComponents.forEach(c => {
    let R = c.value;
    if (c.type === 'wire') R = R_SMALL;
    else if (c.type === 'ammeter') R = R_SMALL;
    else if (c.type === 'voltmeter') R = R_HIGH;
    else if (c.type === 'switch') R = c.isOpen ? R_HIGH : R_SMALL;
    else if (c.type === 'battery') R = R_SMALL; // Internal resistance

    const G = 1 / Math.max(R, 1e-6);
    addConductance(c.nodeA, c.nodeB, G);
  });

  // Populate Voltage Source constraints
  voltageSources.forEach((vSource, k) => {
    const row = N + k;
    const i = nodeIndexMap.get(vSource.nodeA);
    const j = nodeIndexMap.get(vSource.nodeB);

    if (i !== undefined) {
      A[row][i] = 1;
      A[i][row] = 1;
    }
    if (j !== undefined) {
      A[row][j] = -1;
      A[j][row] = -1;
    }

    Z[row] = vSource.value; // V_A - V_B = V_source
  });

  // Solve A * X = Z using Gaussian Elimination
  const X = gaussianSolve(A, Z);

  // Map solution back to node voltages
  const nodeVoltages: { [nodeId: string]: number } = {};
  nodeVoltages[groundNode] = 0;

  nonGroundNodes.forEach((nodeId, idx) => {
    nodeVoltages[nodeId] = X ? X[idx] : 0;
  });

  // Calculate component currents, voltage drops, and powers
  updatedComponents.forEach(c => {
    const vA = nodeVoltages[c.nodeA] ?? 0;
    const vB = nodeVoltages[c.nodeB] ?? 0;
    const vDrop = vA - vB;
    c.voltageDrop = vDrop;

    let R = c.value;
    if (c.type === 'wire' || c.type === 'ammeter' || c.type === 'battery') R = R_SMALL;
    else if (c.type === 'voltmeter') R = R_HIGH;
    else if (c.type === 'switch') R = c.isOpen ? R_HIGH : R_SMALL;

    c.current = vDrop / Math.max(R, 1e-6);
    c.power = Math.pow(c.current, 2) * R;

    if (c.type === 'bulb') {
      const nominalPower = Math.pow(9, 2) / Math.max(c.value, 1);
      c.brightness = Math.min(1.0, c.power / nominalPower);
    }
  });

  return {
    components: updatedComponents,
    nodes: nodeVoltages
  };
}

/**
 * Standard Gaussian Elimination solver for A * X = Z
 */
function gaussianSolve(A_in: number[][], Z_in: number[]): number[] | null {
  const n = Z_in.length;
  const A = A_in.map(row => [...row]);
  const Z = [...Z_in];

  for (let p = 0; p < n; p++) {
    // Find pivot
    let maxRow = p;
    for (let i = p + 1; i < n; i++) {
      if (Math.abs(A[i][p]) > Math.abs(A[maxRow][p])) {
        maxRow = i;
      }
    }

    // Swap max row with current row
    [A[p], A[maxRow]] = [A[maxRow], A[p]];
    [Z[p], Z[maxRow]] = [Z[maxRow], Z[p]];

    if (Math.abs(A[p][p]) < 1e-12) {
      continue; // Singular or near-singular
    }

    // Pivotize
    for (let i = p + 1; i < n; i++) {
      const alpha = A[i][p] / A[p][p];
      Z[i] -= alpha * Z[p];
      for (let j = p; j < n; j++) {
        A[i][j] -= alpha * A[p][j];
      }
    }
  }

  // Back substitution
  const X = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * X[j];
    }
    if (Math.abs(A[i][i]) < 1e-12) {
      X[i] = 0;
    } else {
      X[i] = (Z[i] - sum) / A[i][i];
    }
  }

  return X;
}
