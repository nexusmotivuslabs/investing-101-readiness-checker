import type { FeedbackAnswer, ModuleProgress, ResultKey } from "./types";

const STORAGE_KEY = "investing101-progress";

export type ProgressStore = Record<string, ModuleProgress>;

export function loadProgress(): ProgressStore {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

export function saveProgress(store: ProgressStore): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function markModuleComplete(
  store: ProgressStore,
  moduleId: string,
  resultKey: ResultKey,
  feedback?: FeedbackAnswer
): ProgressStore {
  const next = {
    ...store,
    [moduleId]: {
      completed: true,
      resultKey,
      feedback,
    },
  };
  saveProgress(next);
  return next;
}

export function completedCount(store: ProgressStore): number {
  return Object.values(store).filter((p) => p.completed).length;
}
