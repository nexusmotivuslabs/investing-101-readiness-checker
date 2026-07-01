import type { Answers, FeedbackAnswer, ModuleDefinition, ModuleResult } from "../lib/types";
import { answerLabel } from "../lib/result-engine";

type CheckerViewProps = {
  module: ModuleDefinition;
  currentQuestionIndex: number;
  answers: Answers;
  onBack: () => void;
  onSelectAnswer: (value: "yes" | "no" | "unsure") => void;
  onContinue: () => void;
};

export function CheckerView({
  module,
  currentQuestionIndex,
  answers,
  onBack,
  onSelectAnswer,
  onContinue,
}: CheckerViewProps) {
  const currentQuestion = module.questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const progress = Math.round(((currentQuestionIndex + 1) / module.questions.length) * 100);
  const isLast = currentQuestionIndex === module.questions.length - 1;

  return (
    <main className="app-shell checker-view">
      <header className="topbar">
        <div>
          <p className="brand-mark">Investing 101</p>
          <p className="module-context">{module.contextLabel}</p>
        </div>
        <span className="status-pill">Module {module.number}</span>
      </header>

      <section className="checker-panel" aria-labelledby="checker-title">
        <div
          className="progress-row"
          aria-label={`Question ${currentQuestionIndex + 1} of ${module.questions.length}`}
        >
          <span>
            Question {currentQuestionIndex + 1} of {module.questions.length}
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
                    onChange={() => onSelectAnswer(option.value)}
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
          <button className="secondary-action" onClick={onBack} type="button">
            Back
          </button>
          <button className="primary-action" disabled={!selectedAnswer} onClick={onContinue} type="button">
            {isLast ? "See result" : "Continue"}
          </button>
        </div>

        <p className="privacy-note">
          This app does not ask for salary, bank balances, account providers, creditor names, or personal
          identifiers. It is educational only and not financial advice.
        </p>
      </section>
    </main>
  );
}

type ResultViewProps = {
  module: ModuleDefinition;
  result: ModuleResult;
  answers: Answers;
  feedback: FeedbackAnswer | null;
  onBack: () => void;
  onEditAnswer: (index: number) => void;
  onFeedback: (value: FeedbackAnswer) => void;
  onRestart: () => void;
  onHome: () => void;
  nextModuleTitle?: string;
  onNextModule?: () => void;
};

export function ResultView({
  module,
  result,
  answers,
  feedback,
  onBack,
  onEditAnswer,
  onFeedback,
  onRestart,
  onHome,
  nextModuleTitle,
  onNextModule,
}: ResultViewProps) {
  return (
    <main className="app-shell result-view">
      <header className="topbar">
        <div>
          <p className="brand-mark">Investing 101</p>
          <p className="module-context">Module {module.number} complete</p>
        </div>
        <span className={`status-pill status-${result.key}`}>{result.label}</span>
      </header>

      <section className="result-panel" aria-labelledby="result-title">
        <div className="result-heading">
          <p className="section-kicker">Your result</p>
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
            {module.questions.map((question, index) => (
              <div className="summary-row" key={question.id}>
                <div>
                  <span>{question.prompt}</span>
                  <strong>{answerLabel(question, answers[question.id])}</strong>
                </div>
                <button className="text-action" onClick={() => onEditAnswer(index)} type="button">
                  Change
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="feedback-panel" aria-labelledby="feedback-title">
          <div>
            <h2 id="feedback-title">{module.feedbackPrompt}</h2>
            {module.feedbackMetricLabel ? <p>{module.feedbackMetricLabel}</p> : null}
          </div>
          <div className="feedback-actions">
            <button
              className={`feedback-button ${feedback === "yes" ? "feedback-button-active" : ""}`}
              onClick={() => onFeedback("yes")}
              type="button"
            >
              Yes
            </button>
            <button
              className={`feedback-button ${feedback === "no" ? "feedback-button-active" : ""}`}
              onClick={() => onFeedback("no")}
              type="button"
            >
              No
            </button>
          </div>
        </section>

        <div className="flow-actions">
          <button className="secondary-action" onClick={onBack} type="button">
            Back to questions
          </button>
          <div className="flow-actions-group">
            <button className="secondary-action" onClick={onRestart} type="button">
              Restart module
            </button>
            {nextModuleTitle && onNextModule ? (
              <button className="primary-action" onClick={onNextModule} type="button">
                Next: {nextModuleTitle}
              </button>
            ) : (
              <button className="primary-action" onClick={onHome} type="button">
                Back to modules
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
