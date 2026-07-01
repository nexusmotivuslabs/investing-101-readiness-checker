export type ReadinessAnswer = "yes" | "no" | "unsure";
export type FeedbackAnswer = "yes" | "no";
export type ResultKey = "ready" | "pause" | "clarify";

export type Question = {
  id: string;
  prompt: string;
  detail: string;
  options: Array<{
    value: ReadinessAnswer;
    label: string;
    detail: string;
  }>;
};

export type Answers = Partial<Record<string, ReadinessAnswer>>;

export type ModuleResult = {
  key: ResultKey;
  label: string;
  title: string;
  explanation: string;
  nextAction: string;
  warning: string;
  issues: string[];
};

export type ModuleDefinition = {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  contextLabel: string;
  feedbackPrompt: string;
  feedbackMetricLabel?: string;
  questions: Question[];
  getResult: (answers: Answers) => ModuleResult;
};

export type ViewState = "home" | "checker" | "result";

export type ModuleProgress = {
  completed: boolean;
  resultKey?: ResultKey;
  feedback?: FeedbackAnswer;
};

export type AnalyticsEvent =
  | "homepage_viewed"
  | "module_card_viewed"
  | "module_started"
  | "question_answered"
  | "question_back_clicked"
  | "answer_edit_clicked"
  | "module_completed"
  | "result_viewed"
  | "feedback_answered"
  | "restart_clicked";

export type AnalyticsPayload = {
  event: AnalyticsEvent;
  timestamp: string;
  properties: Record<string, string | number | boolean>;
};
