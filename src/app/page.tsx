"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type QuestionId =
  | "emergencyFund"
  | "essentialBills"
  | "highInterestDebt"
  | "nearTermCash"
  | "riskComfort";

type ReadinessAnswer = "yes" | "no" | "unsure";
type FeedbackAnswer = "yes" | "no";
type ViewState = "home" | "checker" | "result";
type ResultKey = "ready" | "pause" | "clarify";

type Question = {
  id: QuestionId;
  prompt: string;
  detail: string;
  options: Array<{
    value: ReadinessAnswer;
    label: string;
    detail: string;
  }>;
};

type Answers = Partial<Record<QuestionId, ReadinessAnswer>>;

type AnalyticsEvent =
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

type AnalyticsPayload = {
  event: AnalyticsEvent;
  timestamp: string;
  properties: Record<string, string | number | boolean>;
};

declare global {
  interface Window {
    investing101Analytics?: AnalyticsPayload[];
    dataLayer?: Array<Record<string, string | number | boolean>>;
  }
}

const questions: Question[] = [
  {
    id: "emergencyFund",
    prompt: "Do you have money set aside for unexpected costs?",
    detail: "Think about rent, bills, repairs, travel, or income gaps.",
    options: [
      {
        value: "yes",
        label: "Yes",
        detail: "I have a cash buffer I can access.",
      },
      {
        value: "no",
        label: "No",
        detail: "I would struggle with an unexpected cost.",
      },
      {
        value: "unsure",
        label: "Not sure",
        detail: "I need to check what is available.",
      },
    ],
  },
  {
    id: "essentialBills",
    prompt: "Are your essential bills and debt payments up to date?",
    detail: "Include rent or mortgage, utilities, minimum debt payments, council tax, and insurance.",
    options: [
      {
        value: "yes",
        label: "Yes",
        detail: "My regular commitments are covered.",
      },
      {
        value: "no",
        label: "No",
        detail: "Some commitments need attention first.",
      },
      {
        value: "unsure",
        label: "Not sure",
        detail: "I need to review my monthly commitments.",
      },
    ],
  },
  {
    id: "highInterestDebt",
    prompt: "Do you have high-interest debt that you are not already clearing?",
    detail: "This can include expensive credit cards, overdrafts, payday loans, or buy-now-pay-later debt.",
    options: [
      {
        value: "no",
        label: "No",
        detail: "I do not have this, or I have a clear repayment plan.",
      },
      {
        value: "yes",
        label: "Yes",
        detail: "This is still unresolved.",
      },
      {
        value: "unsure",
        label: "Not sure",
        detail: "I need to check rates and repayment costs.",
      },
    ],
  },
  {
    id: "nearTermCash",
    prompt: "Could you leave the money untouched for at least five years?",
    detail: "Investing is usually a longer-term decision, not a place for short-term bills or planned spending.",
    options: [
      {
        value: "yes",
        label: "Yes",
        detail: "This money is not needed for near-term plans.",
      },
      {
        value: "no",
        label: "No",
        detail: "I may need it sooner.",
      },
      {
        value: "unsure",
        label: "Not sure",
        detail: "I have not separated short-term and long-term money yet.",
      },
    ],
  },
  {
    id: "riskComfort",
    prompt: "Are you comfortable that investments can fall in value?",
    detail: "The value can move sharply and you could get back less than you put in.",
    options: [
      {
        value: "yes",
        label: "Yes",
        detail: "I understand losses are possible.",
      },
      {
        value: "no",
        label: "No",
        detail: "I would not be comfortable with that risk yet.",
      },
      {
        value: "unsure",
        label: "Not sure",
        detail: "I need to learn more before deciding.",
      },
    ],
  },
];

const futureModules = [
  {
    title: "Accounts and Tax Basics",
    status: "Coming soon",
  },
  {
    title: "Fees and Platform Questions",
    status: "Locked",
  },
  {
    title: "Risk, Diversification, and Scams",
    status: "Locked",
  },
];

const blockerCopy: Record<
  QuestionId,
  {
    issue: string;
    nextAction: string;
    warning: string;
  }
> = {
  emergencyFund: {
    issue: "an emergency cash buffer is not in place",
    nextAction: "Build or confirm an accessible cash buffer before putting money at investment risk.",
    warning: "Investing money needed for emergencies can force you to sell at a bad time.",
  },
  essentialBills: {
    issue: "essential bills or debt payments need attention",
    nextAction: "Stabilise regular commitments before thinking about investment accounts or products.",
    warning: "Investing should not compete with rent, bills, minimum debt payments, or insurance.",
  },
  highInterestDebt: {
    issue: "high-interest debt may need to be dealt with first",
    nextAction: "Review the cost of that debt and make a clear repayment plan before investing.",
    warning: "High-interest debt can grow faster than uncertain investment outcomes.",
  },
  nearTermCash: {
    issue: "the money may be needed within five years",
    nextAction: "Separate short-term cash needs from any money you may later consider for long-term investing.",
    warning: "Investments can be down when you need the money back.",
  },
  riskComfort: {
    issue: "investment risk is not yet clear or comfortable",
    nextAction: "Learn how market falls, time horizon, and loss risk work before choosing any product.",
    warning: "You should not invest until you understand that losses are possible.",
  },
};

function trackEvent(
  event: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: AnalyticsPayload = {
    event,
    timestamp: new Date().toISOString(),
    properties,
  };

  window.investing101Analytics = window.investing101Analytics ?? [];
  window.investing101Analytics.push(payload);
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...properties });
  console.info("[analytics placeholder]", payload);
}

function isComplete(answers: Answers): boolean {
  return questions.every((question) => answers[question.id] !== undefined);
}

function answerLabel(question: Question, value: ReadinessAnswer | undefined): string {
  return question.options.find((option) => option.value === value)?.label ?? "Unanswered";
}

function getReadinessResult(answers: Answers): {
  key: ResultKey;
  label: string;
  title: string;
  explanation: string;
  nextAction: string;
  warning: string;
  issues: string[];
} {
  const blockers: QuestionId[] = [];

  if (answers.emergencyFund === "no") {
    blockers.push("emergencyFund");
  }
  if (answers.essentialBills === "no") {
    blockers.push("essentialBills");
  }
  if (answers.highInterestDebt === "yes") {
    blockers.push("highInterestDebt");
  }
  if (answers.nearTermCash === "no") {
    blockers.push("nearTermCash");
  }
  if (answers.riskComfort === "no") {
    blockers.push("riskComfort");
  }

  if (blockers.length > 0) {
    const firstBlocker = blockerCopy[blockers[0]];
    return {
      key: "pause",
      label: "Not ready yet",
      title: "Pause before investing",
      explanation: `Your answers show ${blockers
        .map((blocker) => blockerCopy[blocker].issue)
        .join(", ")}.`,
      nextAction: firstBlocker.nextAction,
      warning: firstBlocker.warning,
      issues: blockers.map((blocker) => blockerCopy[blocker].issue),
    };
  }

  const unclear = questions.filter((question) => answers[question.id] === "unsure");

  if (unclear.length > 0) {
    return {
      key: "clarify",
      label: "Clarify first",
      title: "Check a few basics before continuing",
      explanation: `You selected "Not sure" for ${unclear.length} readiness ${
        unclear.length === 1 ? "area" : "areas"
      }. That is a sign to slow down before comparing accounts, funds, stocks, or crypto.`,
      nextAction: "Write down what is unclear, check your budget and commitments, then retake this module.",
      warning: "Do not invest money until you understand your cash needs, debt position, and risk tolerance.",
      issues: unclear.map((question) => question.prompt),
    };
  }

  return {
    key: "ready",
    label: "Ready to keep learning",
    title: "You can move to the next education step",
    explanation:
      "Your answers suggest the core readiness checks are in place. This does not mean any investment is suitable for you.",
    nextAction:
      "Learn the basics of account types, tax rules, fees, diversification, risk, and scams before considering any product.",
    warning:
      "This checker is education only and is not financial advice. Investments can fall in value and you could get back less than you put in.",
    issues: [],
  };
}

export default function Home() {
  const [view, setView] = useState<ViewState>("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<FeedbackAnswer | null>(null);
  const homeAnalyticsFired = useRef(false);
  const resultAnalyticsKey = useRef<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const complete = isComplete(answers);
  const result = useMemo(() => {
    return complete ? getReadinessResult(answers) : null;
  }, [answers, complete]);

  useEffect(() => {
    if (homeAnalyticsFired.current) {
      return;
    }

    homeAnalyticsFired.current = true;
    trackEvent("homepage_viewed", { product: "Investing 101" });
    trackEvent("module_card_viewed", { module: "Before You Invest", available: true });
    futureModules.forEach((module) => {
      trackEvent("module_card_viewed", { module: module.title, available: false });
    });
  }, []);

  useEffect(() => {
    if (view !== "result" || !result) {
      resultAnalyticsKey.current = null;
      return;
    }

    const key = `${result.key}-${Object.values(answers).join("|")}`;
    if (resultAnalyticsKey.current === key) {
      return;
    }

    resultAnalyticsKey.current = key;
    trackEvent("result_viewed", {
      result: result.key,
      issue_count: result.issues.length,
    });
  }, [answers, result, view]);

  function startChecker(): void {
    setAnswers({});
    setFeedback(null);
    setCurrentQuestionIndex(0);
    setView("checker");
    trackEvent("module_started", { module: "Before You Invest" });
  }

  function selectAnswer(value: ReadinessAnswer): void {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
    trackEvent("question_answered", {
      question: currentQuestion.id,
      answer: value,
      question_number: currentQuestionIndex + 1,
    });
  }

  function goBack(): void {
    trackEvent("question_back_clicked", {
      from: view,
      question_number: currentQuestionIndex + 1,
    });

    if (view === "result") {
      setCurrentQuestionIndex(questions.length - 1);
      setView("checker");
      return;
    }

    if (currentQuestionIndex === 0) {
      setView("home");
      return;
    }

    setCurrentQuestionIndex((previous) => previous - 1);
  }

  function continueFlow(): void {
    if (!selectedAnswer) {
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
      return;
    }

    const nextResult = getReadinessResult(answers);
    trackEvent("module_completed", {
      module: "Before You Invest",
      result: nextResult.key,
      issue_count: nextResult.issues.length,
    });
    setView("result");
  }

  function editAnswer(index: number): void {
    setCurrentQuestionIndex(index);
    setView("checker");
    trackEvent("answer_edit_clicked", {
      question: questions[index].id,
      question_number: index + 1,
    });
  }

  function answerFeedback(value: FeedbackAnswer): void {
    setFeedback(value);
    trackEvent("feedback_answered", {
      question: "Do you know your next financial step?",
      answer: value,
      success_metric: value === "yes",
    });
  }

  function restartChecker(): void {
    setAnswers({});
    setFeedback(null);
    setCurrentQuestionIndex(0);
    setView("checker");
    trackEvent("restart_clicked", { module: "Before You Invest" });
  }

  if (view === "checker") {
    return (
      <main className="app-shell checker-view">
        <header className="topbar">
          <div>
            <p className="brand-mark">Investing 101</p>
            <p className="module-context">Module 1: Before You Invest</p>
          </div>
          <span className="status-pill">Readiness checker</span>
        </header>

        <section className="checker-panel" aria-labelledby="checker-title">
          <div className="progress-row" aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}>
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <fieldset className="question-fieldset">
            <legend id="checker-title">{currentQuestion.prompt}</legend>
            <p>{currentQuestion.detail}</p>

            <div className="answer-stack">
              {currentQuestion.options.map((option) => {
                const active = selectedAnswer === option.value;

                return (
                  <label className={`answer-option ${active ? "answer-option-active" : ""}`} key={option.value}>
                    <input
                      checked={active}
                      name={currentQuestion.id}
                      onChange={() => selectAnswer(option.value)}
                      type="radio"
                      value={option.value}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flow-actions">
            <button className="secondary-action" onClick={goBack} type="button">
              Back
            </button>
            <button className="primary-action" disabled={!selectedAnswer} onClick={continueFlow} type="button">
              {currentQuestionIndex === questions.length - 1 ? "See result" : "Continue"}
            </button>
          </div>

          <p className="privacy-note">
            This module does not ask for salary, bank balances, account providers, creditor names, or personal
            identifiers.
          </p>
        </section>
      </main>
    );
  }

  if (view === "result" && result) {
    return (
      <main className="app-shell result-view">
        <header className="topbar">
          <div>
            <p className="brand-mark">Investing 101</p>
            <p className="module-context">Module 1 complete</p>
          </div>
          <span className={`status-pill status-${result.key}`}>{result.label}</span>
        </header>

        <section className="result-panel" aria-labelledby="result-title">
          <div className="result-heading">
            <p className="section-kicker">Your readiness result</p>
            <h1 id="result-title">{result.title}</h1>
          </div>

          <div className="result-sections">
            <section aria-labelledby="explanation-title">
              <h2 id="explanation-title">Explanation</h2>
              <p>{result.explanation}</p>
              {result.issues.length > 0 ? (
                <ul className="issue-list">
                  {result.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section aria-labelledby="action-title">
              <h2 id="action-title">Next Action</h2>
              <p>{result.nextAction}</p>
            </section>

            <section aria-labelledby="warning-title">
              <h2 id="warning-title">Warning</h2>
              <p>{result.warning}</p>
              <p>
                Cryptoassets are high risk and are generally not protected by the Financial Services Compensation
                Scheme.
              </p>
            </section>
          </div>

          <section className="answer-summary" aria-labelledby="answers-title">
            <h2 id="answers-title">Your Answers</h2>
            <div className="summary-list">
              {questions.map((question, index) => (
                <div className="summary-row" key={question.id}>
                  <div>
                    <span>{question.prompt}</span>
                    <strong>{answerLabel(question, answers[question.id])}</strong>
                  </div>
                  <button className="text-action" onClick={() => editAnswer(index)} type="button">
                    Change
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="feedback-panel" aria-labelledby="feedback-title">
            <div>
              <h2 id="feedback-title">Do you know your next financial step?</h2>
              <p>This answer is the Phase 1 success metric.</p>
            </div>
            <div className="feedback-actions">
              <button
                className={`feedback-button ${feedback === "yes" ? "feedback-button-active" : ""}`}
                onClick={() => answerFeedback("yes")}
                type="button"
              >
                Yes
              </button>
              <button
                className={`feedback-button ${feedback === "no" ? "feedback-button-active" : ""}`}
                onClick={() => answerFeedback("no")}
                type="button"
              >
                No
              </button>
            </div>
          </section>

          <div className="flow-actions">
            <button className="secondary-action" onClick={goBack} type="button">
              Back to questions
            </button>
            <button className="primary-action" onClick={restartChecker} type="button">
              Restart checker
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell home-view">
      <header className="topbar">
        <div>
          <p className="brand-mark">Investing 101</p>
          <p className="module-context">UK beginner investor education</p>
        </div>
        <span className="status-pill">Phase 1 MVP</span>
      </header>

      <section className="intro-section" aria-labelledby="home-title">
        <p className="section-kicker">Before choosing investments</p>
        <h1 id="home-title">Check whether you are financially ready to invest.</h1>
        <p>
          Start with the basics that should come before platforms, accounts, ETFs, stocks, or crypto. This is not an
          investment recommendation or financial advice.
        </p>
      </section>

      <section className="modules-section" aria-labelledby="modules-title">
        <div className="section-heading">
          <p className="section-kicker">Learning path</p>
          <h2 id="modules-title">Modules</h2>
        </div>

        <div className="module-grid">
          <article className="module-card module-card-active">
            <div className="module-card-top">
              <span>Module 1</span>
              <span>Available</span>
            </div>
            <h3>Before You Invest</h3>
            <p>Five readiness questions, a rule-based result, and one feedback check.</p>
            <button className="primary-action" onClick={startChecker} type="button">
              Start checker
            </button>
          </article>

          {futureModules.map((module, index) => (
            <article className="module-card module-card-locked" key={module.title}>
              <div className="module-card-top">
                <span>Module {index + 2}</span>
                <span>{module.status}</span>
              </div>
              <h3>{module.title}</h3>
              <p>Unavailable in Phase 1.</p>
              <button className="locked-action" disabled type="button">
                Coming soon
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
