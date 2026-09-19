import { useState, useEffect, useCallback, useRef } from 'react';

export interface LabDraftState<TData = any, TQuiz = any> {
  assignmentId: string;
  labSlug: string;
  rows?: TData[];
  quizAnswers?: TQuiz;
  studentObservation?: string;
  gradeResult?: any;
  updatedAt: string;
}

export interface UseLabPersistenceOptions<TData, TQuiz> {
  labSlug: string;
  assignmentId?: string;
  initialRows?: TData[];
  initialQuiz?: TQuiz;
}

export function useLabPersistence<TData = any, TQuiz = any>({
  labSlug,
  assignmentId,
  initialRows,
  initialQuiz,
}: UseLabPersistenceOptions<TData, TQuiz>) {
  const isAssignmentMode = Boolean(assignmentId && assignmentId.trim().length > 0);
  const storageKey = isAssignmentMode ? `edulab_draft_${assignmentId}_${labSlug}` : null;

  // Load initial draft from localStorage if in assignment mode
  const [draft, setDraft] = useState<LabDraftState<TData, TQuiz> | null>(() => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.assignmentId === assignmentId) {
          return parsed;
        }
      }
    } catch (_) {
      // Ignore parse error
    }
    return null;
  });

  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Save or update draft
  const saveDraft = useCallback(
    (updates: Partial<Omit<LabDraftState<TData, TQuiz>, 'assignmentId' | 'labSlug' | 'updatedAt'>>) => {
      if (!isAssignmentMode || !storageKey || !assignmentId) return;

      const newDraft: LabDraftState<TData, TQuiz> = {
        ...(draftRef.current || {
          rows: initialRows,
          quizAnswers: initialQuiz,
        }),
        ...updates,
        assignmentId,
        labSlug,
        updatedAt: new Date().toISOString(),
      };

      setDraft(newDraft);

      try {
        localStorage.setItem(storageKey, JSON.stringify(newDraft));
        // Emit custom event for FloatingAssignmentDrawer to update in real time
        window.dispatchEvent(
          new CustomEvent('edulab_draft_updated', {
            detail: newDraft,
          })
        );
      } catch (err) {
        console.warn('Failed to save lab draft to localStorage:', err);
      }
    },
    [isAssignmentMode, storageKey, assignmentId, labSlug, initialRows, initialQuiz]
  );

  // Clear draft upon submission or manual reset
  const clearDraft = useCallback(() => {
    setDraft(null);
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
        window.dispatchEvent(
          new CustomEvent('edulab_draft_cleared', {
            detail: { assignmentId, labSlug },
          })
        );
      } catch (_) {}
    }
  }, [storageKey, assignmentId, labSlug]);

  // Sync when assignmentId changes
  useEffect(() => {
    if (!storageKey) {
      setDraft(null);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.assignmentId === assignmentId) {
          setDraft(parsed);
          return;
        }
      }
    } catch (_) {}
    setDraft(null);
  }, [storageKey, assignmentId]);

  return {
    isAssignmentMode,
    draft,
    hasDraft: Boolean(draft),
    saveDraft,
    clearDraft,
    savedRows: draft?.rows ?? initialRows,
    savedQuiz: draft?.quizAnswers ?? initialQuiz,
    savedObservation: draft?.studentObservation ?? '',
    savedGradeResult: draft?.gradeResult ?? null,
  };
}
