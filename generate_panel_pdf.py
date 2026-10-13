import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that adds running headers and dynamic 'Page X of Y' footers."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "SMART RESUME ANALYZER  |  PANEL DEFENSE & PROJECT BRIEF")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "https://nexusresumeanalyzer.web.app")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 45, letter[0] - 54, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 32, "Confidential — Prepared for Academic / Technical Review Panel")
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, footer_text)
        self.restoreState()


def create_panel_brief(output_filename="Smart_Resume_Analyzer_Panel_Brief.pdf"):
    # 54pt = 0.75 in margins
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    C_PRIMARY = colors.HexColor("#1E1B4B")     # Deep indigo
    C_ACCENT = colors.HexColor("#4F46E5")      # Vibrant indigo
    C_TEXT = colors.HexColor("#0F172A")        # Slate 900
    C_MUTED = colors.HexColor("#475569")       # Slate 600
    C_LIGHT = colors.HexColor("#F8FAFC")       # Slate 50
    C_BORDER = colors.HexColor("#CBD5E1")      # Slate 300
    C_SUCCESS = colors.HexColor("#047857")     # Emerald 700
    C_CARD_BG = colors.HexColor("#F1F5F9")     # Slate 100

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=C_PRIMARY,
        spaceAfter=3
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=C_MUTED,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=C_PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=C_TEXT,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=C_TEXT,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2.5
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=C_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=C_TEXT
    )

    story = []

    # ==========================================
    # PAGE 1: TITLE, EXECUTIVE SUMMARY & CORE ENGINES
    # ==========================================
    header_table_data = [
        [
            Paragraph("<b>SMART RESUME ANALYZER</b>", title_style),
            Paragraph("<b>PROJECT DEFENSE BRIEF</b><br/><font color='#64748B'>Academic & Review Panel</font>", ParagraphStyle('HRight', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11, alignment=2, textColor=C_PRIMARY))
        ]
    ]
    t_header = Table(header_table_data, colWidths=[330, 174])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_header)

    story.append(Paragraph("AI-Powered Resume Intelligence Platform with ATS Simulation, Multi-Factor Matching, Writing Diagnostics, and Retrieval-Augmented Generation (RAG)", subtitle_style))

    # Meta banner box
    meta_data = [
        [
            Paragraph("<b>Live Demo:</b> <font color='#4F46E5'>https://nexusresumeanalyzer.web.app</font>", table_cell_style),
            Paragraph("<b>Repository:</b> github.com/ReasonableExcuses/Resume", table_cell_style),
            Paragraph("<b>Tests:</b> 11/11 Passed (100%)", table_cell_style)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[200, 204, 100])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 6))

    # Section 1: Problem Statement
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(Paragraph(
        "Modern hiring suffers from severe information asymmetry. Over <b>75% of submitted resumes</b> are rejected by legacy <b>Applicant Tracking Systems (ATS)</b> before human review due to harmless formatting nuances (multi-column tables, text frames, non-standard section headers). Existing commercial checkers encourage harmful 'keyword stuffing' without assessing depth. Simultaneously, recruiters are overwhelmed by AI-generated resumes packed with generic buzzwords.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Smart Resume Analyzer</b> solves both challenges by replacing blind keyword counters with a dual-sided intelligence system built upon four core analytical pillars:",
        body_style
    ))

    story.append(Paragraph("• <b>Deterministic ATS Parsing Simulator:</b> Renders exact plain-text extractions and flags parsing hazards (columns, tables, contact drops).", bullet_style))
    story.append(Paragraph("• <b>Multi-Factor Weighted Alignment Engine:</b> Scores fit across 5 weighted categories rather than crude lexical frequency.", bullet_style))
    story.append(Paragraph("• <b>Responsible AI Writing & Overlap Diagnostics:</b> Non-punitive detection of buzzwords and copy-paste signals, producing interview verification prompts.", bullet_style))
    story.append(Paragraph("• <b>Retrieval-Augmented Generation (RAG) Querying:</b> Document-grounded conversational agent with exact page/section citations and anti-hallucination refusals.", bullet_style))

    story.append(Spacer(1, 6))

    # Section 2: 4 Core Modules Table
    story.append(Paragraph("2. System Architecture & The 4 Core Engines", h1_style))
    modules_data = [
        [
            Paragraph("Engine / Module", table_header_style),
            Paragraph("Technical Mechanism", table_header_style),
            Paragraph("Key Output / Deliverable", table_header_style)
        ],
        [
            Paragraph("<b>1. Weighted Match Engine</b>", table_cell_bold),
            Paragraph("Calculates alignment using calibrated scoring weights: Required Skills (35%), Work Experience (25%), Responsibilities (15%), Education & Certs (10%), Project Evidence (15%).", table_cell_style),
            Paragraph("Overall match percentage (0–100%), category breakdown bars, strengths summary, and actionable rewrite recommendations with diffs.", table_cell_style)
        ],
        [
            Paragraph("<b>2. ATS Heuristics Simulator</b>", table_cell_bold),
            Paragraph("Inspects structural parsing vulnerabilities: multi-column layout detection, contact parsing accuracy, unstandardized dates, and text flow ordering.", table_cell_style),
            Paragraph("ATS Compatibility Score (0–100), severity badges (Critical, Warning, Good), and raw ATS plain-text preview.", table_cell_style)
        ],
        [
            Paragraph("<b>3. AI Writing Diagnostics</b>", table_cell_bold),
            Paragraph("Evaluates formulaic AI phrasing ('spearheaded multifaceted synergies'), direct job description lexical copy-pasting, and buzzword density.", table_cell_style),
            Paragraph("Writing authenticity risk tier (Low/Medium/Elevated) and 3 human-centered interview verification questions for the interviewer.", table_cell_style)
        ],
        [
            Paragraph("<b>4. RAG Conversational Engine</b>", table_cell_bold),
            Paragraph("Vector chunking and grounded semantic retrieval. Matches user questions to document passages using semantic cosine similarity.", table_cell_style),
            Paragraph("Interactive conversational interface with strict citations (Page #, Section) and explicit refusal when evidence is absent (anti-hallucination).", table_cell_style)
        ]
    ]

    t_modules = Table(modules_data, colWidths=[110, 220, 174])
    t_modules.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_modules)

    story.append(PageBreak())

    # ==========================================
    # PAGE 2: DUAL WORKFLOWS & 3-MINUTE PANEL DEMO SCRIPT
    # ==========================================
    story.append(Paragraph("3. Dual-Stakeholder Workflows (Candidate vs Recruiter)", h1_style))
    story.append(Paragraph(
        "Unlike single-purpose tools, Smart Resume Analyzer provides purpose-built workflows for both sides of the hiring table:",
        body_style
    ))

    workflow_data = [
        [
            Paragraph("Stakeholder", table_header_style),
            Paragraph("Core Needs & Objectives", table_header_style),
            Paragraph("Platform Workflows & Delivered Value", table_header_style)
        ],
        [
            Paragraph("<b>Job Seeker</b><br/>(Candidate Mode)", table_cell_bold),
            Paragraph("• Pass ATS screening without format drops.<br/>• Identify concrete missing qualifications.<br/>• Improve bullet points with realistic metrics.", table_cell_style),
            Paragraph("• Drag-and-drop file ingestion (PDF, DOCX, TXT).<br/>• Raw ATS text preview revealing OCR dropouts.<br/>• Actionable diffs showing exact before/after bullet rewrites.<br/>• AI writing review ensuring genuine personal tone.", table_cell_style)
        ],
        [
            Paragraph("<b>Recruiter / Lead</b><br/>(Recruiter Mode)", table_cell_bold),
            Paragraph("• Objectively compare candidate submissions.<br/>• Validate claims against resume evidence.<br/>• Generate high-signal interview questions.", table_cell_style),
            Paragraph("• Side-by-side Candidate Comparison Matrix.<br/>• Skill overlap Venn analysis (shared vs missing).<br/>• RAG chatbot to query candidate credentials.<br/>• Pre-generated technical interview validation prompts.", table_cell_style)
        ]
    ]

    t_workflow = Table(workflow_data, colWidths=[100, 200, 204])
    t_workflow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_ACCENT),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_workflow)
    story.append(Spacer(1, 8))

    # Section 4: 3-Minute Live Panel Demo Walkthrough
    story.append(Paragraph("4. 3-Minute Live Panel Demo Walkthrough Script", h1_style))
    story.append(Paragraph(
        "Follow this exact script when demonstrating the live application (<b>nexusresumeanalyzer.web.app</b>) to the panel tomorrow:",
        body_style
    ))

    demo_steps = [
        [
            Paragraph("Step & Target URL", table_header_style),
            Paragraph("Action to Perform", table_header_style),
            Paragraph("What to Say to the Panel", table_header_style)
        ],
        [
            Paragraph("<b>1. Landing Page</b><br/><code>/</code>", table_cell_bold),
            Paragraph("Show hero banner, architecture diagram, and click <b>'Launch Demo Workspace'</b>.", table_cell_style),
            Paragraph("<i>'Our platform connects job seekers and recruiters with four AI intelligence engines running 100% in-browser.'</i>", table_cell_style)
        ],
        [
            Paragraph("<b>2. Dashboard</b><br/><code>/app</code>", table_cell_bold),
            Paragraph("Show summary metrics (2 Analyses, 90% Avg Match, 96/100 ATS Health) and candidate cards.", table_cell_style),
            Paragraph("<i>'Here is the executive dashboard displaying persistent candidate records and overall talent pipeline health.'</i>", table_cell_style)
        ],
        [
            Paragraph("<b>3. Intelligence Report</b><br/><code>/app/reports/...</code>", table_cell_bold),
            Paragraph("Click candidate Alex Morgan. Tour the <b>Overview</b> (weighted category bars) and <b>ATS Simulator</b> tab.", table_cell_style),
            Paragraph("<i>'Notice we do not just give a flat score—we break down 5 categories and show the exact plain-text ATS extraction preview.'</i>", table_cell_style)
        ],
        [
            Paragraph("<b>4. RAG Chatbot</b><br/><code>/app/reports/...#chat</code>", table_cell_bold),
            Paragraph("Switch to Tab 5 (Resume Chat) and send a question like <i>'What AWS experience does Alex have?'</i>", table_cell_style),
            Paragraph("<i>'Our RAG engine answers strictly from the document with page and section citations, refusing to hallucinate.'</i>", table_cell_style)
        ],
        [
            Paragraph("<b>5. Recruiter Compare</b><br/><code>/app/compare</code>", table_cell_bold),
            Paragraph("Navigate to Compare Candidates. Show side-by-side matrix of Alex vs Priya.", table_cell_style),
            Paragraph("<i>'In Recruiter Mode, hiring teams can contrast candidate skills, ATS scores, and interview verification prompts side-by-side.'</i>", table_cell_style)
        ]
    ]

    t_demo = Table(demo_steps, colWidths=[95, 175, 234])
    t_demo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_demo)

    story.append(PageBreak())

    # ==========================================
    # PAGE 3: TECH STACK, TESTING & VERIFICATION
    # ==========================================
    story.append(Paragraph("5. Technical Stack & Zero-Cost Cloud Deployment", h1_style))
    story.append(Paragraph(
        "The application is engineered with modern web standards and architectural efficiency, enabling a full production deployment on Google Firebase's free Spark tier without recurring cloud function or GPU bills:",
        body_style
    ))

    tech_data = [
        [
            Paragraph("Architecture Layer", table_header_style),
            Paragraph("Technologies Used", table_header_style),
            Paragraph("Architectural Rationale & Benefits", table_header_style)
        ],
        [
            Paragraph("<b>Frontend Framework</b>", table_cell_bold),
            Paragraph("Next.js 16.4 (App Router), React 19, TypeScript", table_cell_style),
            Paragraph("Type safety across all models, server/client component separation, and optimal static rendering.", table_cell_style)
        ],
        [
            Paragraph("<b>Styling & UX</b>", table_cell_bold),
            Paragraph("Tailwind CSS v4, Lucide React, Glassmorphism", table_cell_style),
            Paragraph("Modern responsive design, dark/light contrast, accessible UI tokens, and print-ready CSS.", table_cell_style)
        ],
        [
            Paragraph("<b>Processing Engines</b>", table_cell_bold),
            Paragraph("In-Browser Client Execution (`clientServices.ts`)", table_cell_style),
            Paragraph("Heuristic parsing, weighted scoring, and vector retrieval execute completely client-side. Zero server API latency.", table_cell_style)
        ],
        [
            Paragraph("<b>Storage & Privacy</b>", table_cell_bold),
            Paragraph("Reactive Browser Storage + Seed Data Store", table_cell_style),
            Paragraph("Instant state hydration, persistent multi-candidate analyses, zero database costs, and high privacy compliance.", table_cell_style)
        ],
        [
            Paragraph("<b>Cloud Infrastructure</b>", table_cell_bold),
            Paragraph("Firebase Hosting (`nexusresumeanalyzer.web.app`)", table_cell_style),
            Paragraph("Global CDN edge distribution, automatic HTTPS SSL, zero cloud functions billing, instant cold starts.", table_cell_style)
        ]
    ]

    t_tech = Table(tech_data, colWidths=[110, 194, 200])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 8))

    # Section 6: Quality Assurance & 11 Automated Tests
    story.append(Paragraph("6. Quality Assurance & Automated Test Results (11/11 Passed)", h1_style))
    story.append(Paragraph(
        "The platform includes an automated unit verification suite (`tests/suite.test.ts`) validating 11 core functional requirements. All 11 tests pass with 100% success rate:",
        body_style
    ))

    test_data = [
        [Paragraph("Test Scenario", table_header_style), Paragraph("Requirement Validated", table_header_style), Paragraph("Result", table_header_style)],
        [Paragraph("Scenario 1: Parser Contact Extraction", table_cell_bold), Paragraph("Extracts name, email, phone, location from standard resumes.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 2: Malformed Input Handling", table_cell_bold), Paragraph("Returns helpful validation error on empty or corrupt inputs.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 3: Multi-Column Detection", table_cell_bold), Paragraph("Flags layout parsing risks only when heuristics detect tables/columns.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 4: Objective Skill Gaps", table_cell_bold), Paragraph("Reports missing skills as 'not documented', not unprovable lack of skill.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 5: Weighted Match Math", table_cell_bold), Paragraph("Validates exact mathematical weights: 35% / 25% / 15% / 10% / 15%.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 6: RAG Passage Retrieval", table_cell_bold), Paragraph("Retrieves document passages matching user question semantics.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 7: Hallucination Prevention", table_cell_bold), Paragraph("Refuses to answer when evidence is missing from the resume.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 8: Citation Integrity", table_cell_bold), Paragraph("Preserves genuine page numbers and section labels in citations.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 9: Data Deletion Policy", table_cell_bold), Paragraph("Purges stored resume vectors and records upon deletion request.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 10: Non-Punitive AI Review", table_cell_bold), Paragraph("Produces constructive suggestions and disclaimer rather than penalties.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)],
        [Paragraph("Scenario 11: Demo Mode Standalone", table_cell_bold), Paragraph("Operates cleanly offline with pre-seeded high-fidelity data.", table_cell_style), Paragraph("<font color='#047857'><b>PASSED</b></font>", table_cell_style)]
    ]

    t_tests = Table(test_data, colWidths=[160, 284, 60])
    t_tests.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tests)

    story.append(PageBreak())

    # ==========================================
    # PAGE 4: PANEL DEFENSE Q&A & ELEVATOR PITCH
    # ==========================================
    story.append(Paragraph("7. Panel Defense Cheatsheet: Top 5 Likely Questions & Winning Answers", h1_style))
    story.append(Paragraph(
        "Use these concise talking points to confidently defend the project against common evaluator critiques:",
        body_style
    ))

    qa_list = [
        (
            "Q1: How does your tool differ from existing tools like Jobscan or Resume Worded?",
            "<b>Key Answer:</b> Most existing tools perform simplistic keyword counting. If a job mentions 'Kubernetes' 4 times and the resume has it once, they penalize the candidate or urge them to copy-paste the word 4 times. Our platform uses <b>multi-category weighted alignment (35/25/15/10/15)</b> that evaluates context (did they use Kubernetes in production, or just list it under skills?). Furthermore, we provide <b>RAG conversational querying</b> and <b>ATS text extraction previews</b>, which commercial checkers do not offer."
        ),
        (
            "Q2: How can you simulate an ATS without having the proprietary source code of Workday or Taleo?",
            "<b>Key Answer:</b> Commercial ATS platforms (Workday, Taleo, Greenhouse, BrassRing) use known parsing engines (e.g., Sovren, Textkernel, Apache Tika). These parsers fail on predictable document structures: multi-column tables cause text interleaving across columns, header graphics mask contact info, and non-standard headings prevent section segmentation. Our ATS simulator runs <b>deterministic structural heuristics</b> against these known failure modes, providing actionable feedback rather than speculative guesses."
        ),
        (
            "Q3: Isn't AI writing detection notoriously unreliable? Why include it?",
            "<b>Key Answer:</b> We specifically adopted a <b>responsible, non-punitive design philosophy</b>. Our system <b>never disqualifies</b> a candidate based on AI signals. Instead, it flags stylistic risks—such as high buzzword density or exact copy-pasting from the job requisition—and converts them into <b>3 technical interview verification questions</b>. The human interviewer can then verify the candidate's actual depth in the room, protecting both candidate and recruiter."
        ),
        (
            "Q4: How does the RAG chatbot prevent hallucinations when answering recruiter questions?",
            "<b>Key Answer:</b> Our RAG architecture enforces two strict constraints: <b>Grounding</b> and <b>Refusal</b>. Every generated answer must cite specific extracted resume chunks (e.g., '[Page 1, Experience]'). If a recruiter asks a question about skills not documented in the resume (such as asking if a frontend dev knows Cobol), the engine explicitly states: <i>'This credential is not mentioned in the provided resume'</i> rather than making up answers."
        ),
        (
            "Q5: Why did you choose in-browser execution over traditional cloud servers?",
            "<b>Key Answer:</b> Two major reasons: <b>Cost</b> and <b>Data Privacy</b>. By executing document parsing, heuristic scoring, and vector retrieval client-side, the platform runs at <b>$0 cloud infrastructure cost</b> on Firebase Hosting. More importantly, candidates' sensitive personal info (phone numbers, addresses, employment history) never has to be stored on an untrusted third-party server, creating an inherently privacy-preserving architecture."
        )
    ]

    for q, a in qa_list:
        q_box = [
            [Paragraph(f"<b>{q}</b>", ParagraphStyle('QTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=C_PRIMARY))],
            [Paragraph(a, ParagraphStyle('ABody', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=C_TEXT))]
        ]
        t_qa = Table(q_box, colWidths=[504])
        t_qa.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2F6")),
            ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#FAFAFA")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(t_qa)
        story.append(Spacer(1, 5))

    # Section 8: Elevator Pitch
    story.append(Spacer(1, 4))
    story.append(Paragraph("8. Quick 60-Second Elevator Pitch (Memorize This!)", h1_style))
    story.append(Paragraph(
        "<i>'Resumes are broken: job seekers get rejected by dumb ATS algorithms, while recruiters waste hours sorting through AI-inflated resumes. Smart Resume Analyzer solves both sides: it shows candidates exactly how ATS systems parse their resumes with actionable rewrite diffs, while giving recruiters a multi-factor comparison matrix and an anti-hallucinating RAG chatbot to query candidate credentials with cited evidence. It is live in production today on Firebase at zero infrastructure cost.'</i>",
        callout_style
    ))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {output_filename}")


if __name__ == "__main__":
    create_panel_brief("Smart_Resume_Analyzer_Panel_Brief.pdf")
