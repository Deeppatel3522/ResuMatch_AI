import { useRef, useState } from "react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ResumeDropzone({ file, onFileSelect, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const selected = fileList?.[0];
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onFileSelect(null, "Please upload a PDF or DOCX file.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      onFileSelect(null, "File is too large. Max size is 5MB.");
      return;
    }
    onFileSelect(selected, null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`w-full rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors focus-ring ${
          isDragging
            ? "border-highlight bg-highlight-soft/40"
            : "border-line bg-white/40 hover:border-ink-soft"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {file ? (
          <div>
            <p className="font-display text-sm font-semibold text-ink mb-1">{file.name}</p>
            <p className="text-xs text-ink-soft">
              {(file.size / 1024).toFixed(0)} KB &middot; click or drop to replace
            </p>
          </div>
        ) : (
          <div>
            <p className="font-display text-sm font-semibold text-ink mb-1">
              Drop your resume here
            </p>
            <p className="text-xs text-ink-soft">PDF or DOCX, up to 5MB &middot; or click to browse</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-bad mt-2">{error}</p>}
    </div>
  );
}
