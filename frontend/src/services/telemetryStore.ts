export interface TelemetryTrial {
  labId: string;
  timestamp: number;
  data: Record<string, number | string>;
}

class TelemetryStore {
  private trials: Map<string, TelemetryTrial[]> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Log a new trial measurement from a simulation workbench
   */
  public logTrial(labId: string, data: Record<string, number | string>): void {
    const existing = this.trials.get(labId) || [];
    const newTrial: TelemetryTrial = {
      labId,
      timestamp: Date.now(),
      data,
    };
    this.trials.set(labId, [...existing.slice(-9), newTrial]); // Keep up to 10 recent trials
    this.notifyListeners();
  }

  /**
   * Get recorded trials for a specific lab
   */
  public getTrials(labId: string): TelemetryTrial[] {
    return this.trials.get(labId) || [];
  }

  /**
   * Clear recorded trials for a lab
   */
  public clearTrials(labId: string): void {
    this.trials.delete(labId);
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l());
  }
}

export const telemetryStore = new TelemetryStore();
