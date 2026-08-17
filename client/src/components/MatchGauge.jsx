export default function MatchGauge({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 75 ? "#3D7A5E" : clamped >= 50 ? "#C9A227" : "#B4543A";

  return (
    <div className="relative w-44 h-44 shrink-0">
      <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke="#D8D3C4"
          strokeWidth="12"
        />
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold text-ink">{clamped}</span>
        <span className="font-mono text-xs tracking-wide text-ink-soft uppercase mt-1">
          match score
        </span>
      </div>
    </div>
  );
}
