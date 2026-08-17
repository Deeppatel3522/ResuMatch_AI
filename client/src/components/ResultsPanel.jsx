import MatchGauge from "./MatchGauge.jsx";

export default function ResultsPanel({ result }) {
  const { jobTitle, matchScore, summary, matchedKeywords, missingKeywords, suggestions } = result;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-line pb-8">
        <MatchGauge score={matchScore} />
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">
            Analysis for
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink mb-2">{jobTitle}</h2>
          <p className="text-ink-soft leading-relaxed max-w-xl">{summary}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-good mb-3">
            Matched keywords ({matchedKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.length === 0 && (
              <span className="text-sm text-ink-soft">None found.</span>
            )}
            {matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-highlight-soft text-ink text-sm font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-bad mb-3">
            Missing keywords ({missingKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.length === 0 && (
              <span className="text-sm text-ink-soft">None — great coverage.</span>
            )}
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full border border-bad/40 text-bad text-sm font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">
          Suggestions
        </h3>
        <ul className="space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="border border-line rounded-lg p-4 bg-white/40">
              <p className="font-display text-sm font-semibold text-ink mb-1">{s.area}</p>
              <p className="text-sm text-ink-soft leading-relaxed">{s.recommendation}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
