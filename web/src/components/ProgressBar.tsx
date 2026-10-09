import { STEP_TITLES } from '../config/content';

export function ProgressBar({ step }: { step: number }) {
  const percent = Math.round((step / STEP_TITLES.length) * 100);
  return (
    <nav className="progress" aria-label="Progreso / Progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_TITLES.length}
        aria-valuenow={step}
        aria-valuetext={`Paso ${step} de ${STEP_TITLES.length}`}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <ol className="progress-steps">
        {STEP_TITLES.map((title, index) => {
          const n = index + 1;
          const state = n < step ? 'done' : n === step ? 'current' : 'todo';
          return (
            <li key={title} className={`progress-step ${state}`} aria-current={n === step ? 'step' : undefined}>
              <span className="progress-dot">{n < step ? '✓' : n}</span>
              <span className="progress-label">{title}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
