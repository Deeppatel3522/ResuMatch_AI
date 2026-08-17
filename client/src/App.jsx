import { useState } from "react";
import ResultsPanel from "./components/ResultsPanel.jsx";
import ResumeDropzone from "./components/ResumeDropzone.jsx";

export default function App() {
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "paste"
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  function handleFileSelect(file, err) {
    setResumeFile(file);
    setFileError(err || "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const hasResume = resumeMode === "upload" ? Boolean(resumeFile) : Boolean(resumeText.trim());

    if (!hasResume || !jobDescription.trim()) {
      setError(
        resumeMode === "upload"
          ? "Upload your resume and paste the job description first."
          : "Paste both your resume and the job description first."
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (resumeMode === "upload") {
        formData.append("resumeFile", resumeFile);
      } else {
        formData.append("resumeText", resumeText);
      }
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper font-body">
      <header className="border-b border-line">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="w-8 h-8 rounded-lg" aria-hidden="true" />
            <h1 className="font-display text-xl font-semibold text-ink">ResuMatch AI</h1>
          </div>
          <p className="font-mono text-xs text-ink-soft uppercase tracking-widest hidden sm:block">
            resume × job description
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {!result && (
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink mb-3 leading-tight">
              See how your resume actually stacks up.
            </h2>
            <p className="text-ink-soft leading-relaxed">
              Paste your resume and a job description. Claude reads both and tells you your
              match score, which keywords you're missing, and exactly what to fix.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs uppercase tracking-widest text-ink-soft">
                Your resume
              </label>
              <div className="flex rounded-full border border-line overflow-hidden text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setResumeMode("upload")}
                  className={`px-3 py-1 transition-colors ${resumeMode === "upload" ? "bg-ink text-paper" : "text-ink-soft hover:bg-white/60"
                    }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode("paste")}
                  className={`px-3 py-1 transition-colors ${resumeMode === "paste" ? "bg-ink text-paper" : "text-ink-soft hover:bg-white/60"
                    }`}
                >
                  Paste text
                </button>
              </div>
            </div>

            {resumeMode === "upload" ? (
              <ResumeDropzone file={resumeFile} onFileSelect={handleFileSelect} error={fileError} />
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={12}
                placeholder="Paste your resume text here..."
                className="w-full rounded-lg border border-line bg-white/60 p-4 text-sm text-ink leading-relaxed focus-ring resize-y"
              />
            )}
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
              Job description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              placeholder="Paste the job posting here..."
              className="w-full rounded-lg border border-line bg-white/60 p-4 text-sm text-ink leading-relaxed focus-ring resize-y"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-ink text-paper font-medium text-sm hover:bg-ink-soft transition-colors disabled:opacity-50 focus-ring"
            >
              {loading ? "Analyzing..." : "Analyze match"}
            </button>
            {error && <p className="text-sm text-bad">{error}</p>}
          </div>
        </form>

        {result && (
          <div className="border-t border-line pt-10">
            <ResultsPanel result={result} />
          </div>
        )}
      </main>
    </div>
  );
}
