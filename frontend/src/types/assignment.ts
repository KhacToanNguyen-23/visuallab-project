export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  labType: string;
  paramBoundsJson: string;
  targetFormula: string;
  tolerancePercent: number;
  teacherId: string;
  createdAt: string;
}

export interface StudentAssignmentInstance {
  id: string;
  assignmentId: string;
  studentId: string;
  generatedParamsJson: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  instanceId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAnswersJson: string;
  explanation: string;
  mathScore: number;
  aiReasoningScore: number;
  totalScore: number;
  aiFeedbackJson: string;
  submittedAt: string;
}

export interface AiFeedback {
  aiReasoningScore: number;
  misconceptions: string[];
  pedagogicalFeedback: string;
  suggestions: string;
}
