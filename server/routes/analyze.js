import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Analysis from "../models/Analysis.js";
import { extractResumeText, isSupportedFile } from "../utils/extractResumeText.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (isSupportedFile(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are supported."));
    }
  },
});
const genAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Check https://aistudio.google.com for the current recommended Flash model
// name if this one is ever deprecated - Google renames these periodically.
function getModel() {
  return genAI().getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
}

const SYSTEM_PROMPT = `You are an expert technical recruiter and resume coach.
You will be given a candidate's resume text and a job description.
Compare them carefully and respond with ONLY valid JSON (no markdown fences, no prose outside the JSON) matching this exact shape:

{
  "jobTitle": "string - best guess at the role title from the job description",
  "matchScore": number between 0 and 100,
  "summary": "2-3 sentence honest assessment of fit",
  "matchedKeywords": ["array of specific skills/tools/keywords present in both resume and job description"],
  "missingKeywords": ["array of important skills/tools/keywords in the job description that are missing or weak in the resume"],
  "suggestions": [
    { "area": "string - which resume section", "recommendation": "string - specific, actionable rewrite suggestion" }
  ]
}

Be specific and honest. Do not inflate the score. Base matchedKeywords/missingKeywords on actual terms, not vague categories. Provide 3-6 suggestions.`;

router.post("/", upload.single("resumeFile"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    let { resumeText } = req.body;

    // If a file was uploaded, extract text from it (overrides pasted text).
    if (req.file) {
      try {
        resumeText = await extractResumeText(req.file.buffer, req.file.mimetype);
      } catch (extractErr) {
        return res.status(400).json({ error: extractErr.message });
      }
    }

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText and jobDescription are required" });
    }

    const prompt = `${SYSTEM_PROMPT}\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;

    const result = await getModel().generateContent(prompt);
    const rawText = result.response.text() ?? "{}";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse Gemini response:", cleaned);
      return res.status(502).json({ error: "AI response could not be parsed. Please try again." });
    }

    const analysis = await Analysis.create({
      jobTitle: parsed.jobTitle || "Untitled role",
      resumeText,
      jobDescription,
      matchScore: parsed.matchScore ?? 0,
      summary: parsed.summary ?? "",
      matchedKeywords: parsed.matchedKeywords ?? [],
      missingKeywords: parsed.missingKeywords ?? [],
      suggestions: parsed.suggestions ?? [],
    });

    res.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Something went wrong analyzing your resume." });
  }
});

// Get analysis history
router.get("/history", async (req, res) => {
  try {
    const analyses = await Analysis.find()
      .select("-resumeText -jobDescription")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history." });
  }
});

// Get single analysis by id
router.get("/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: "Not found" });
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch analysis." });
  }
});

// Handles multer errors (file too large, wrong type) with a clean JSON response
// instead of the default HTML error page.
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File is too large. Max size is 5MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default router;
