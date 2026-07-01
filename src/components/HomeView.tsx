import type { ModuleDefinition, ModuleProgress } from "../lib/types";
import { resultKeyLabel } from "../lib/result-engine";

type HomeViewProps = {
  modules: ModuleDefinition[];
  progress: Record<string, ModuleProgress>;
  completedCount: number;
  onStartModule: (moduleId: string) => void;
};

export function HomeView({ modules, progress, completedCount, onStartModule }: HomeViewProps) {
  const allComplete = completedCount === modules.length;

  return (
    <main className="app-shell home-view">
      <header className="topbar">
        <div>
          <p className="brand-mark">Investing 101</p>
          <p className="module-context">UK beginner investor education</p>
        </div>
        <span className="status-pill">{allComplete ? "Course complete" : `${completedCount}/${modules.length} modules`}</span>
      </header>

      <section className="intro-section" aria-labelledby="home-title">
        <p className="section-kicker">Before choosing investments</p>
        <h1 id="home-title">Learn the basics before you invest.</h1>
        <p>
          Work through four educational modules covering readiness, accounts and tax, fees, and risk. This is not an
          investment recommendation or financial advice.
        </p>
      </section>

      {completedCount > 0 ? (
        <section className="progress-banner" aria-label="Course progress">
          <div className="progress-banner-track" aria-hidden="true">
            <div
              className="progress-banner-fill"
              style={{ width: `${Math.round((completedCount / modules.length) * 100)}%` }}
            />
          </div>
          <p>
            {allComplete
              ? "You have completed all modules. Review any module to refresh your knowledge."
              : `${completedCount} of ${modules.length} modules completed.`}
          </p>
        </section>
      ) : null}

      <section className="modules-section" aria-labelledby="modules-title">
        <div className="section-heading">
          <p className="section-kicker">Learning path</p>
          <h2 id="modules-title">Modules</h2>
        </div>

        <div className="module-grid">
          {modules.map((module) => {
            const moduleProgress = progress[module.id];
            const completed = moduleProgress?.completed ?? false;

            return (
              <article
                className={`module-card ${completed ? "module-card-complete" : "module-card-active"}`}
                key={module.id}
              >
                <div className="module-card-top">
                  <span>Module {module.number}</span>
                  <span>
                    {completed
                      ? `Completed · ${resultKeyLabel(moduleProgress?.resultKey ?? "ready")}`
                      : "Available"}
                  </span>
                </div>
                <h3>{module.title}</h3>
                <p>{module.shortDescription}</p>
                <button className="primary-action" onClick={() => onStartModule(module.id)} type="button">
                  {completed ? "Review module" : "Start module"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
