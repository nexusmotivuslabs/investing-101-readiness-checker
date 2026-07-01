import type { Answers, ModuleResult, Question, ReadinessAnswer, ResultKey } from "./types";

type BlockerRule = {
  questionId: string;
  blockingValues: ReadinessAnswer[];
  issue: string;
  nextAction: string;
  warning: string;
};

type ResultConfig = {
  blockers: BlockerRule[];
  ready: {
    title: string;
    explanation: string;
    nextAction: string;
    warning: string;
  };
  clarify: {
    title: string;
    explanationPrefix: string;
    explanationSuffix?: string;
    nextAction: string;
    warning: string;
  };
  pause: {
    title: string;
    explanationPrefix: string;
  };
};

export function buildModuleResult(
  answers: Answers,
  questions: Question[],
  config: ResultConfig
): ModuleResult {
  const blockers = config.blockers.filter((rule) => {
    const answer = answers[rule.questionId];
    return answer !== undefined && rule.blockingValues.includes(answer);
  });

  if (blockers.length > 0) {
    const first = blockers[0];
    return {
      key: "pause",
      label: "Not ready yet",
      title: config.pause.title,
      explanation: `${config.pause.explanationPrefix} ${blockers.map((b) => b.issue).join(", ")}.`,
      nextAction: first.nextAction,
      warning: first.warning,
      issues: blockers.map((b) => b.issue),
    };
  }

  const unclear = questions.filter((q) => answers[q.id] === "unsure");

  if (unclear.length > 0) {
    return {
      key: "clarify",
      label: "Clarify first",
      title: config.clarify.title,
      explanation: `${config.clarify.explanationPrefix} ${unclear.length} ${
        unclear.length === 1 ? "area" : "areas"
      }.${config.clarify.explanationSuffix ? ` ${config.clarify.explanationSuffix}` : ""}`,
      nextAction: config.clarify.nextAction,
      warning: config.clarify.warning,
      issues: unclear.map((q) => q.prompt),
    };
  }

  return {
    key: "ready",
    label: "Ready to keep learning",
    title: config.ready.title,
    explanation: config.ready.explanation,
    nextAction: config.ready.nextAction,
    warning: config.ready.warning,
    issues: [],
  };
}

export function isComplete(answers: Answers, questions: Question[]): boolean {
  return questions.every((q) => answers[q.id] !== undefined);
}

export function answerLabel(question: Question, value: ReadinessAnswer | undefined): string {
  return question.options.find((o) => o.value === value)?.label ?? "Unanswered";
}

export function resultKeyLabel(key: ResultKey): string {
  switch (key) {
    case "ready":
      return "Ready";
    case "pause":
      return "Pause";
    case "clarify":
      return "Clarify";
  }
}
