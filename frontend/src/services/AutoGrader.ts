import type { LabEntity } from '../store/useLabStore';

export interface LabStep {
  id: string;
  instruction: string;
  requiredEntities: string[]; // List of Tool IDs required to be present
}

export interface LabConfig {
  id: string;
  title: string;
  allowedTools: string[];
  steps: LabStep[];
}

export class AutoGrader {
  private config: LabConfig;

  constructor(config: LabConfig) {
    this.config = config;
  }

  /**
   * Tính điểm thao tác (max 30 điểm).
   * Kiểm tra xem học sinh đã kéo đủ các công cụ yêu cầu của bài chưa.
   */
  public gradeManipulation(entities: Record<string, LabEntity>): number {
    const presentToolTypes = new Set(Object.values(entities).map(e => e.type));
    let requiredToolsCount = 0;
    let presentRequiredCount = 0;

    const allRequiredTools = new Set<string>();
    this.config.steps.forEach(step => {
      step.requiredEntities.forEach(tool => allRequiredTools.add(tool));
    });

    allRequiredTools.forEach(tool => {
      requiredToolsCount++;
      if (presentToolTypes.has(tool)) {
        presentRequiredCount++;
      }
    });

    if (requiredToolsCount === 0) return 30; // Trọn điểm nếu không yêu cầu
    return Math.round((presentRequiredCount / requiredToolsCount) * 30);
  }

  /**
   * Tính điểm sai số (max 40 điểm).
   * So sánh data của HS với lý thuyết. (Mock implementation for MVP).
   */
  public gradeDataError(studentData: number[], expectedData: number[]): number {
    if (!studentData.length || !expectedData.length) return 0;
    
    let totalError = 0;
    for (let i = 0; i < studentData.length; i++) {
      const expected = expectedData[i] || 1;
      const error = Math.abs(studentData[i] - expected) / expected;
      totalError += error;
    }
    const avgError = totalError / studentData.length;
    
    // Nếu sai số < 5%, 40đ. Sai số > 20%, 0đ.
    if (avgError <= 0.05) return 40;
    if (avgError >= 0.20) return 0;
    return Math.round((0.20 - avgError) / 0.15 * 40);
  }
}
