# Smart Resume Analyzer

[![Firebase Hosting](https://img.shields.io/badge/Live%20Demo-Firebase%20Hosting-FFA000?style=flat-square&logo=firebase)](https://nexusresumeanalyzer.web.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-11%20Passed-emerald?style=flat-square)](https://github.com/ReasonableExcuses/Resume)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

An enterprise-grade resume intelligence platform providing ATS compatibility simulation, contextual job matching, AI writing verification, and document-grounded Retrieval-Augmented Generation (RAG) conversational querying.

**Live Deployment:** [https://nexusresumeanalyzer.web.app](https://nexusresumeanalyzer.web.app)

---

## System Architecture

```mermaid
flowchart LR
    subgraph Ingestion
        A[Resume File<br/>PDF / DOCX / TXT] --> B[Document Parser]
        C[Job Requisition] --> D[Requirement Extractor]
    end

    subgraph Intelligence Engines
        B --> E[ATS Heuristics Simulator]
        B --> F[Weighted Matching Engine]
        D --> F
        B --> G[Writing & Overlap Analyzer]
        D --> G
        B --> H[Vector & RAG Indexer]
    end

    subgraph Deliverables
        E --> I[ATS Compatibility Report]
        F --> J[Skill Alignment & Scoring]
        G --> K[Verification Questions]
        H --> L[Interactive RAG Chatbot]
    end
```

---

## Core Capabilities

| Capability | Technical Approach | Outcome |
|---|---|---|
| **Contextual Job Matching** | 5-category weighted scoring (Skills 35%, Experience 25%, Responsibilities 15%, Education 10%, Projects 15%) | Objective 0–100 match index with strong, partial, missing, and transferable classifications |
| **ATS Compatibility Simulator** | Heuristic inspection of multi-column streams, tables, frames, contact placement, and encoding | Identifies document parsing bottlenecks with a linear text stream preview |
| **AI Writing Review** | N-gram phrase overlap detection and cliché density profiling | Generates interviewer verification prompts without punitive or ungrounded accusations |
| **Document RAG Chatbot** | Semantic text chunking with hybrid keyword/vector search and stop-word filtering | Verifiable answers citing exact document sections and page numbers |
| **Candidate Comparison** | Multi-candidate matrix across uniform job requisitions | Side-by-side screening with built-in fair hiring compliance notices |

---

## Technical Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Visualization**: Recharts, SVG Gauge Primitives
- **Document Ingestion**: `pdf-parse`, `mammoth`
- **Testing**: Node.js Test Runner with `tsx`

---

## Quickstart

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation
```bash
git clone https://github.com/ReasonableExcuses/Resume.git
cd Resume
npm install
```

### Development
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

### Testing
```bash
npm test
```
Executes the automated test suite covering parsers, match algorithms, ATS heuristics, and RAG retrieval.

### Production Build
```bash
npm run build
npm start
```

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resumes/upload` | Ingest and parse PDF/DOCX file (10MB limit) |
| `GET` | `/api/resumes` | Retrieve stored candidate records |
| `GET` | `/api/resumes/:id` | Fetch specific resume metadata |
| `DELETE` | `/api/resumes/:id` | Purge candidate document and linked records |
| `POST` | `/api/analyses` | Execute end-to-end analysis pipeline |
| `GET` | `/api/analyses/:id` | Retrieve comprehensive analysis record |
| `GET` | `/api/analyses/:id/report` | Export structured JSON analysis report |
| `POST` | `/api/ats/check` | Standalone ATS layout compatibility audit |
| `POST` | `/api/writing-insights/analyze` | Standalone stylistic and phrase overlap audit |
| `POST` | `/api/chat/sessions/:id/messages` | Query document RAG engine with evidence citations |
| `POST` | `/api/candidates/compare` | Evaluate multiple resumes against a target job requisition |

---

## Security and Ethics Principles

1. **Untrusted Input Sanitation**: All uploaded documents are treated strictly as structured text input, neutralizing execution and prompt injection vectors.
2. **Responsible AI Review**: Stylistic reviews highlight areas requiring human validation rather than inferring automated dishonesty.
3. **Session Data Isolation**: Records are bound to authenticated or local demo sessions with user-directed purge capabilities.
4. **Fair Hiring Guardrails**: Prohibits filtering by demographic, photographic, or protected attributes.

---

## License

Released under the MIT License.
