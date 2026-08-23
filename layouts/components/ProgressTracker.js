import { useProgress } from "@components/ProgressContext";

const ProgressTracker = () => {
  const { completed, total } = useProgress();
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="progress-bar w-24" role="progressbar" aria-valuenow={completed} aria-valuemin="0" aria-valuemax={total} aria-label="Course progress">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-text-secondary">{pct}%</span>
    </div>
  );
};

export default ProgressTracker;
