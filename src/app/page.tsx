"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HomeView } from "../components/HomeView";
import { CheckerView, ResultView } from "../components/ModuleFlow";
import { trackEvent } from "../lib/analytics";
import { completedCount, loadProgress, markModuleComplete, type ProgressStore } from "../lib/progress";
import { isComplete } from "../lib/result-engine";
import type { Answers, FeedbackAnswer, ReadinessAnswer, ViewState } from "../lib/types";
import { getModuleById, modules } from "../modules";

export default function Home() {
  const [view, setView] = useState<ViewState>("home");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<FeedbackAnswer | null>(null);
  const [progress, setProgress] = useState<ProgressStore>(() => loadProgress());
  const homeAnalyticsFired = useRef(false);
  const resultAnalyticsKey = useRef<string | null>(null);

  const activeModule = activeModuleId ? getModuleById(activeModuleId) : undefined;
  const complete = activeModule ? isComplete(answers, activeModule.questions) : false;
  const result = useMemo(() => {
    if (!activeModule || !complete) {
      return null;
    }
    return activeModule.getResult(answers);
  }, [activeModule, answers, complete]);

  const nextModule = activeModule
    ? modules.find((m) => m.number === activeModule.number + 1)
    : undefined;

  useEffect(() => {
    if (homeAnalyticsFired.current) {
      return;
    }

    homeAnalyticsFired.current = true;
    trackEvent("homepage_viewed", { product: "Investing 101" });
    modules.forEach((mod) => {
      trackEvent("module_card_viewed", { module: mod.title, available: true });
    });
  }, []);

  useEffect(() => {
    if (view !== "result" || !result || !activeModule) {
      resultAnalyticsKey.current = null;
      return;
    }

    const key = `${activeModule.id}-${result.key}-${Object.values(answers).join("|")}`;
    if (resultAnalyticsKey.current === key) {
      return;
    }

    resultAnalyticsKey.current = key;
    trackEvent("result_viewed", {
      module: activeModule.title,
      result: result.key,
      issue_count: result.issues.length,
    });
  }, [activeModule, answers, result, view]);

  function startModule(moduleId: string): void {
    const selected = getModuleById(moduleId);
    if (!selected) {
      return;
    }

    setActiveModuleId(moduleId);
    setAnswers({});
    setFeedback(null);
    setCurrentQuestionIndex(0);
    setView("checker");
    trackEvent("module_started", { module: selected.title });
  }

  function selectAnswer(value: ReadinessAnswer): void {
    if (!activeModule) {
      return;
    }

    const question = activeModule.questions[currentQuestionIndex];
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));
    trackEvent("question_answered", {
      module: activeModule.title,
      question: question.id,
      answer: value,
      question_number: currentQuestionIndex + 1,
    });
  }

  function goBack(): void {
    if (!activeModule) {
      return;
    }

    trackEvent("question_back_clicked", {
      module: activeModule.title,
      from: view,
      question_number: currentQuestionIndex + 1,
    });

    if (view === "result") {
      setCurrentQuestionIndex(activeModule.questions.length - 1);
      setView("checker");
      return;
    }

    if (currentQuestionIndex === 0) {
      setActiveModuleId(null);
      setView("home");
      return;
    }

    setCurrentQuestionIndex((previous) => previous - 1);
  }

  function continueFlow(): void {
    if (!activeModule) {
      return;
    }

    const question = activeModule.questions[currentQuestionIndex];
    if (!answers[question.id]) {
      return;
    }

    if (currentQuestionIndex < activeModule.questions.length - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
      return;
    }

    const nextResult = activeModule.getResult(answers);
    trackEvent("module_completed", {
      module: activeModule.title,
      result: nextResult.key,
      issue_count: nextResult.issues.length,
    });
    setProgress((prev) => markModuleComplete(prev, activeModule.id, nextResult.key));
    setView("result");
  }

  function editAnswer(index: number): void {
    if (!activeModule) {
      return;
    }

    setCurrentQuestionIndex(index);
    setView("checker");
    trackEvent("answer_edit_clicked", {
      module: activeModule.title,
      question: activeModule.questions[index].id,
      question_number: index + 1,
    });
  }

  function answerFeedback(value: FeedbackAnswer): void {
    if (!activeModule) {
      return;
    }

    setFeedback(value);
    setProgress((prev) => markModuleComplete(prev, activeModule.id, activeModule.getResult(answers).key, value));
    trackEvent("feedback_answered", {
      module: activeModule.title,
      question: activeModule.feedbackPrompt,
      answer: value,
      success_metric: value === "yes",
    });
  }

  function restartModule(): void {
    if (!activeModule) {
      return;
    }

    setAnswers({});
    setFeedback(null);
    setCurrentQuestionIndex(0);
    setView("checker");
    trackEvent("restart_clicked", { module: activeModule.title });
  }

  function goHome(): void {
    setActiveModuleId(null);
    setView("home");
  }

  function goToNextModule(): void {
    if (!nextModule) {
      goHome();
      return;
    }
    startModule(nextModule.id);
  }

  if (view === "checker" && activeModule) {
    return (
      <CheckerView
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        module={activeModule}
        onBack={goBack}
        onContinue={continueFlow}
        onSelectAnswer={selectAnswer}
      />
    );
  }

  if (view === "result" && activeModule && result) {
    return (
      <ResultView
        answers={answers}
        feedback={feedback}
        module={activeModule}
        nextModuleTitle={nextModule?.title}
        onBack={goBack}
        onEditAnswer={editAnswer}
        onFeedback={answerFeedback}
        onHome={goHome}
        onNextModule={nextModule ? goToNextModule : undefined}
        onRestart={restartModule}
        result={result}
      />
    );
  }

  return (
    <HomeView
      completedCount={completedCount(progress)}
      modules={modules}
      onStartModule={startModule}
      progress={progress}
    />
  );
}
