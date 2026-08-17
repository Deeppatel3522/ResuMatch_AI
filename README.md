# ResuMatch AI

An AI-powered tool that scores how well a resume matches a job description, using Google's Gemini API to find missing keywords and suggest concrete resume improvements. Supports both pasting resume text and uploading a PDF or DOCX file directly.

Built with: React (Vite) · Node.js/Express · MongoDB · Google Gemini API

---

## 1. Local setup

### Prerequisites
- Node.js 18+
- A MongoDB database — easiest option is a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster, or run MongoDB locally
- A free [Google AI Studio API key](https://aistudio.google.com/apikey)

### Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env and add your GEMINI_API_KEY and MONGODB_URI
npm run dev
```

Server runs on `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend.

Open `http://localhost:5173`, paste a resume and a job description, and hit **Analyze match**.

---

## 2. Deployment (free tier friendly)

**Database — MongoDB Atlas**
1. Create a free cluster at mongodb.com/cloud/atlas
2. Create a database user, allow network access from anywhere (0.0.0.0/0) for simplicity
3. Copy the connection string into `MONGODB_URI`

**Backend — Render**
1. Push this repo to GitHub
2. On [render.com](https://render.com), create a new Web Service pointing at the `server` folder
3. Build command: `npm install` · Start command: `npm start`
4. Add environment variables: `GEMINI_API_KEY`, `MONGODB_URI`

**Frontend — Vercel**
1. Import the repo on [vercel.com](https://vercel.com), set root directory to `client`
2. Add an environment-based API URL, or set up a rewrite in `vercel.json` pointing `/api/*` to your Render backend URL
3. Deploy

Once deployed, add the live link to your resume/portfolio and to your GitHub repo description.

---

## 3. Suggested roadmap (good to mention in interviews as "what's next")

- User accounts + auth (JWT) so people can log in and see their own history
- OCR fallback for scanned/image-based PDFs (current PDF parsing requires a text layer)
- Resume rewrite suggestions applied inline with diff view
- Rate limiting on the analyze endpoint
- Unit tests (Jest) for the analyze route and gauge component
- CI/CD via GitHub Actions to auto-deploy on push

---

## 4. How to talk about this project in interviews

- **Problem**: Job seekers don't know why their resume isn't landing interviews — ATS keyword mismatches are invisible to the human eye.
- **Your role**: Designed and built the full stack — API integration with an LLM, schema design, and the frontend UX for a technical but non-technical-feeling result.
- **Technical decisions worth mentioning**: structured JSON output from the LLM (rather than freeform text) so the frontend can render deterministic UI; separating stored fields from the AI response to keep the schema stable even if prompt output varies; proxy setup in Vite for clean local dev.
- **What you'd improve with more time**: the roadmap above — this shows product thinking, not just "I built X."
