# Smart Resume Analyzer — AI-Powered Resume Intelligence Platform

> **"Your Resume. Smarter. Stronger. ATS-Ready."**  
> A modern, full-stack platform built with Next.js 16, TypeScript, Tailwind CSS, heuristic ATS simulation, Retrieval-Augmented Generation (RAG) chatbot, and recruiter decision-support intelligence.

---

## 🌟 Executive Summary

Unlike basic keyword scanners that only count keyword frequencies, **Smart Resume Analyzer** provides comprehensive, evidence-grounded intelligence for both **Job Seekers** and **Recruiters**:

1. **Smart Resume–Job Matching**: Multi-category weighted alignment (Required Skills 35%, Experience 25%, Responsibilities 15%, Education 10%, Project Evidence 15%) with transparent classifications (Strong, Partial, Missing, Transferable) and actionable recommendations.
2. **ATS Compatibility Simulator**: Inspects document structure, multi-column layouts, tables, text boxes, and linear extraction order to identify parsing risks before submission.
3. **AI Writing & Authenticity Insights**: Identifies repetitive clichés, buzzword density, and job-description phrase overlap while providing responsible recruiter verification questions. *(Never treats AI-writing signals as proof of dishonesty).*
4. **Interactive Resume Chatbot (RAG)**: Conversational assistant strictly grounded in the document with page numbers and section citations, politely acknowledging when facts are not documented.
5. **Recruiter Candidate Comparison**: Side-by-side multi-candidate comparison against target requisitions with fair hiring notices.
6. **Dual Persona Demo Mode**: 1-click role switching between Job Seeker (Alex Rivera) and Recruiter (Sarah Jenkins) with preloaded demonstration profiles and job descriptions.

---

## 🏗️ Architecture & Technology Stack

```
Smart Resume Analyzer
├── Frontend (Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4)
│   ├── Landing Page (/)
│   ├── Unified App Shell (/app)
│   ├── Resume Analysis Workflow (/app/analyze)
│   ├── Comprehensive Multi-Tab Reports (/app/reports/[id])
│   ├── Dedicated ATS Simulator (/app/ats-simulator)
│   ├── Dedicated Writing Insights (/app/writing-insights)
│   ├── Contextual RAG Chatbot (/app/chat)
│   ├── Candidate Comparison (/app/compare)
│   ├── Analysis History (/app/history)
│   └── Settings & AI Keys (/app/settings)
├── Document Parsing Engine (src/lib/documentParser.ts)
│   ├── PDF Vector & Text Extraction (pdf-parse)
│   ├── DOCX Text Extraction (mammoth)
│   └── Layout Heuristics (multi-column, tables, headers, unicode)
├── Core Intelligence Engines
│   ├── Heuristic ATS Simulator (src/lib/atsSimulator.ts)
│   ├── Weighted Match Engine (src/lib/matchEngine.ts)
│   ├── Writing Style & Phrase Overlap Analyzer (src/lib/writingAnalyzer.ts)
│   └── Grounded RAG Chat Engine (src/lib/ragEngine.ts)
└── REST API Layer (src/app/api/...)
    ├── /api/resumes (GET, POST upload)
    ├── /api/analyses (GET, POST analysis pipeline)
    ├── /api/ats/check (POST standalone inspection)
    ├── /api/writing-insights/analyze (POST standalone signals)
    ├── /api/chat/sessions/[id]/messages (POST RAG interaction)
    └── /api/candidates/compare (POST multi-candidate comparison)
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v22+ recommended)
- **npm**: v9+

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npm test
```
Executes the test suite covering document parsing, ATS heuristics, score weighting, RAG citations, unreadable file handling, and ethics checks.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resumes` | List stored candidate resumes |
| `POST` | `/api/resumes/upload` | Multipart file upload for PDF/DOCX (up to 10MB) |
| `POST` | `/api/resumes` | Create resume from pasted text |
| `GET` | `/api/resumes/:id` | Fetch specific resume with extracted layout metadata |
| `DELETE` | `/api/resumes/:id` | Purge resume and linked analyses |
| `POST` | `/api/analyses` | Run full analysis pipeline (Skills, ATS, Writing, Recs) |
| `GET` | `/api/analyses` | List stored analysis records |
| `GET` | `/api/analyses/:id` | Retrieve comprehensive analysis record |
| `GET` | `/api/analyses/:id/report` | Export structured JSON report data |
| `POST` | `/api/ats/check` | Standalone ATS compatibility inspection |
| `POST` | `/api/writing-insights/analyze` | Standalone AI writing and phrase overlap check |
| `POST` | `/api/chat/sessions` | Create or fetch RAG chat session |
| `POST` | `/api/chat/sessions/:id/messages` | Send question and receive evidence-grounded answer with citations |
| `POST` | `/api/candidates/compare` | Compare 2+ resumes against a job description |

---

## 🔒 Security, Privacy & Fairness Safeguards

1. **Client-side & Server-side Document Validation**: Enforces a 10MB file limit, sanitizes file names, and inspects MIME structures.
2. **Untrusted Text Ingestion**: Resume content is treated strictly as data, never as executable code or prompt instructions.
3. **No Punitive AI Accusations**: Clear disclaimers stating that AI writing metrics measure phrase overlap and generic wording to assist human interviewers, not to accuse candidates of dishonesty.
4. **Data Retention & Session Purging**: Users can purge all cached records and reset to clean defaults at any time via Settings.
5. **No Discriminatory Ranking**: The comparison engine compares only documented, job-related criteria, excluding protected demographic attributes.

---

## 🧪 Demonstration Personas Included

- **Alex Rivera**: Senior Full-Stack Engineer (6+ years exp, React, Next.js, TypeScript, Node.js, AWS ECS, Redis).
- **Priya Sharma**: Senior Data Analyst (5+ years exp, SQL, Python, Tableau, Snowflake, A/B Testing).
- **Marcus Chen**: Lead Technical Project Manager (7+ years exp, PMP, CSM, Agile/Scrum, JIRA, Cloud migrations).

---

## 📜 License
Developed for academic demonstration and portfolio presentation. MIT License.
