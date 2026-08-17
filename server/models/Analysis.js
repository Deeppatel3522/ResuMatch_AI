import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, default: "Untitled role" },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true }, // 0-100
    summary: { type: String, required: true },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [
      {
        area: String, // e.g. "Experience section", "Skills section"
        recommendation: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
