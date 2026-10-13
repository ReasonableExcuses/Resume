import { Resume, JobDescription, AnalysisResult } from './types';

export const SAMPLE_RESUMES: Resume[] = [
  {
    id: 'res-alex-rivera',
    userId: 'user-demo-seeker',
    title: 'Alex Rivera - Senior Full-Stack Engineer Resume',
    candidateName: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (Open to Remote)',
    linkedin: 'linkedin.com/in/alexrivera-dev',
    github: 'github.com/alexrivera-eng',
    summary:
      'Results-driven Senior Full-Stack Software Engineer with 6+ years of experience architecting cloud-native web applications, distributed microservices, and reactive user interfaces. Proven track record reducing API latency by 42% and scaling SaaS platforms to over 500,000 monthly active users.',
    skills: [
      'TypeScript',
      'JavaScript (ES6+)',
      'React.js',
      'Next.js',
      'Node.js',
      'Express',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS (S3, ECS, Lambda, CloudFront)',
      'GraphQL',
      'RESTful API Design',
      'CI/CD Pipelines (GitHub Actions)',
      'Jest',
      'Playwright',
      'Microservices Architecture',
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Vanguard Cloud Technologies',
        role: 'Senior Full-Stack Engineer',
        startDate: '2022-03',
        endDate: 'Present',
        description: [
          'Architected and led the migration of a monolithic e-commerce dashboard into modular Next.js micro-frontends with Node.js/GraphQL backends, reducing page load times by 38%.',
          'Spearheaded caching strategies using Redis and CloudFront, cutting high-traffic database query loads by 60% and saving $14,000/month in cloud infrastructure costs.',
          'Mentored a cross-functional team of 6 engineers across sprint planning, comprehensive code reviews, and test-driven development practices.',
          'Integrated automated CI/CD deployment pipelines on AWS ECS with zero-downtime blue/green deployments.',
        ],
        technologies: ['Next.js', 'TypeScript', 'Node.js', 'GraphQL', 'AWS ECS', 'Redis', 'Docker'],
      },
      {
        id: 'exp-2',
        company: 'Apex Data Systems',
        role: 'Full-Stack Software Engineer',
        startDate: '2019-06',
        endDate: '2022-02',
        description: [
          'Engineered real-time telemetry analytics platform consuming over 2 million events per hour using Node.js, WebSockets, and PostgreSQL.',
          'Designed responsive UI components using React and Tailwind CSS, increasing enterprise client engagement metrics by 28%.',
          'Implemented end-to-end testing with Playwright and Jest, increasing code test coverage from 64% to 91%.',
        ],
        technologies: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'WebSockets', 'Jest'],
      },
      {
        id: 'exp-3',
        company: 'Beacon Interactive',
        role: 'Junior Frontend Developer',
        startDate: '2018-01',
        endDate: '2019-05',
        description: [
          'Built accessible web interfaces adhering to WCAG 2.1 AA standards for healthcare and finance clients.',
          'Collaborated closely with UI/UX designers to translate Figma design tokens into clean component libraries.',
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git'],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationYear: '2018',
        gpa: '3.82 / 4.0',
      },
    ],
    rawText: `ALEX RIVERA
San Francisco, CA | alex.rivera@example.com | +1 (555) 234-5678 | linkedin.com/in/alexrivera-dev | github.com/alexrivera-eng

SUMMARY
Results-driven Senior Full-Stack Software Engineer with 6+ years of experience architecting cloud-native web applications, distributed microservices, and reactive user interfaces. Proven track record reducing API latency by 42% and scaling SaaS platforms to over 500,000 monthly active users.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), Python, SQL
Frontend: React.js, Next.js, Redux, Tailwind CSS, Webpack, Vite
Backend: Node.js, Express, FastAPI, GraphQL, RESTful APIs
Databases & Cache: PostgreSQL, Redis, MongoDB
DevOps & Cloud: Docker, Kubernetes, AWS (S3, ECS, Lambda, CloudFront), GitHub Actions CI/CD
Testing: Jest, Playwright, React Testing Library

PROFESSIONAL EXPERIENCE

Senior Full-Stack Engineer | Vanguard Cloud Technologies | San Francisco, CA | 2022-03 - Present
- Architected and led the migration of a monolithic e-commerce dashboard into modular Next.js micro-frontends with Node.js/GraphQL backends, reducing page load times by 38%.
- Spearheaded caching strategies using Redis and CloudFront, cutting high-traffic database query loads by 60% and saving $14,000/month in cloud infrastructure costs.
- Mentored a cross-functional team of 6 engineers across sprint planning, comprehensive code reviews, and test-driven development practices.
- Integrated automated CI/CD deployment pipelines on AWS ECS with zero-downtime blue/green deployments.

Full-Stack Software Engineer | Apex Data Systems | San Jose, CA | 2019-06 - 2022-02
- Engineered real-time telemetry analytics platform consuming over 2 million events per hour using Node.js, WebSockets, and PostgreSQL.
- Designed responsive UI components using React and Tailwind CSS, increasing enterprise client engagement metrics by 28%.
- Implemented end-to-end testing with Playwright and Jest, increasing code test coverage from 64% to 91%.

Junior Frontend Developer | Beacon Interactive | Oakland, CA | 2018-01 - 2019-05
- Built accessible web interfaces adhering to WCAG 2.1 AA standards for healthcare and finance clients.
- Collaborated closely with UI/UX designers to translate Figma design tokens into clean component libraries.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2014 - 2018 | GPA: 3.82`,
    extractedTextOrder: `ALEX RIVERA
alex.rivera@example.com | +1 (555) 234-5678 | San Francisco, CA
SUMMARY: Results-driven Senior Full-Stack Software Engineer...
TECHNICAL SKILLS: TypeScript, JavaScript, Python, React.js, Next.js, Node.js...
EXPERIENCE: Senior Full-Stack Engineer at Vanguard Cloud Technologies...`,
    layoutStructure: {
      detectedColumns: 1,
      hasTables: false,
      hasTextBoxes: false,
      hasHeaderFooterContact: false,
      unusualCharacters: [],
      fontCount: 2,
      pageCount: 2,
      isScannedOrImage: false,
      readingOrderRisk: 'low',
    },
    fileType: 'pdf',
    fileSize: '148 KB',
    fileName: 'Alex_Rivera_Senior_FullStack_Resume.pdf',
    createdAt: '2026-10-10T09:30:00Z',
    updatedAt: '2026-10-10T09:30:00Z',
  },
  {
    id: 'res-priya-sharma',
    userId: 'user-demo-seeker',
    title: 'Priya Sharma - Senior Data Analyst Resume',
    candidateName: 'Priya Sharma',
    email: 'priya.sharma@analyticsmail.com',
    phone: '+1 (555) 987-6543',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/priyasharma-data',
    github: 'github.com/psharma-analytics',
    summary:
      'Analytical Senior Data Analyst with 5+ years of experience turning complex datasets into strategic business decisions. Specialized in customer lifetime value modeling, executive BI dashboard development, and statistical A/B experimentation across fintech and e-commerce domains.',
    skills: [
      'SQL (Advanced Window Functions, CTEs)',
      'Python (Pandas, NumPy, Scikit-learn, SciPy)',
      'Tableau Desktop & Server',
      'Power BI',
      'Snowflake',
      'Google BigQuery',
      'A/B Testing & Hypothesis Testing',
      'Statistical Analysis',
      'dbt (data build tool)',
      'Looker',
      'Excel (VBA & Advanced Modeling)',
      'ETL Pipeline Monitoring',
      'Data Storytelling',
    ],
    experience: [
      {
        id: 'exp-p1',
        company: 'FinLeap Global',
        role: 'Lead Business Data Analyst',
        startDate: '2021-08',
        endDate: 'Present',
        description: [
          'Engineered executive Tableau and Looker dashboards for C-suite monitoring $85M ARR, reducing weekly reporting preparation time from 16 hours to 45 minutes.',
          'Designed and evaluated 45+ statistical A/B experiments on onboarding funnels, unlocking an estimated 8.4% increase in user conversion.',
          'Built predictive churn models using Python Scikit-learn with 83% precision, enabling the retention team to proactively retain $1.2M in annual recurring revenue.',
        ],
        technologies: ['Python', 'SQL', 'Tableau', 'Snowflake', 'dbt'],
      },
      {
        id: 'exp-p2',
        company: 'MetricsWave Consulting',
        role: 'Data Analyst',
        startDate: '2019-01',
        endDate: '2021-07',
        description: [
          'Optimized complex SQL queries on Snowflake and BigQuery, cutting warehouse compute costs by 35%.',
          'Created automated anomaly detection scripts in Python to monitor daily transaction inconsistencies.',
        ],
        technologies: ['SQL', 'Python', 'BigQuery', 'Power BI'],
      },
    ],
    education: [
      {
        id: 'edu-p1',
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Science',
        field: 'Statistics and Data Science',
        graduationYear: '2018',
        gpa: '3.90 / 4.0',
      },
    ],
    rawText: `PRIYA SHARMA
Austin, TX | priya.sharma@analyticsmail.com | +1 (555) 987-6543 | linkedin.com/in/priyasharma-data

SUMMARY
Analytical Senior Data Analyst with 5+ years of experience turning complex datasets into strategic business decisions. Specialized in customer lifetime value modeling, executive BI dashboard development, and statistical A/B experimentation across fintech and e-commerce domains.

SKILLS
Data Analysis & Scripting: SQL (Window Functions, CTEs), Python (Pandas, NumPy, Scikit-learn)
Visualization & BI: Tableau, Power BI, Looker
Data Warehousing: Snowflake, BigQuery, dbt
Methodologies: A/B Testing, Cohort Analysis, Predictive Modeling, Regression

EXPERIENCE
Lead Business Data Analyst | FinLeap Global | 2021-08 - Present
- Engineered executive Tableau and Looker dashboards for C-suite monitoring $85M ARR, reducing weekly reporting preparation time from 16 hours to 45 minutes.
- Designed and evaluated 45+ statistical A/B experiments on onboarding funnels, unlocking an estimated 8.4% increase in user conversion.
- Built predictive churn models using Python Scikit-learn with 83% precision, enabling the retention team to proactively retain $1.2M in annual recurring revenue.

Data Analyst | MetricsWave Consulting | 2019-01 - 2021-07
- Optimized complex SQL queries on Snowflake and BigQuery, cutting warehouse compute costs by 35%.
- Created automated anomaly detection scripts in Python to monitor daily transaction inconsistencies.

EDUCATION
B.S. in Statistics and Data Science | UT Austin | 2018`,
    extractedTextOrder: `PRIYA SHARMA
Austin, TX | priya.sharma@analyticsmail.com | +1 (555) 987-6543
SUMMARY: Analytical Senior Data Analyst with 5+ years of experience...`,
    layoutStructure: {
      detectedColumns: 2,
      hasTables: true,
      hasTextBoxes: false,
      hasHeaderFooterContact: true,
      unusualCharacters: ['•', '→'],
      fontCount: 4,
      pageCount: 1,
      isScannedOrImage: false,
      readingOrderRisk: 'medium',
    },
    fileType: 'pdf',
    fileSize: '210 KB',
    fileName: 'Priya_Sharma_Senior_Data_Analyst.pdf',
    createdAt: '2026-10-09T14:15:00Z',
    updatedAt: '2026-10-09T14:15:00Z',
  },
  {
    id: 'res-marcus-chen',
    userId: 'user-demo-seeker',
    title: 'Marcus Chen - Technical Project Manager Resume',
    candidateName: 'Marcus Chen',
    email: 'marcus.chen@pmlead.com',
    phone: '+1 (555) 345-6789',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/marcuschen-pm',
    summary:
      'Certified Senior Technical Project Manager (PMP, CSM) with 7+ years of experience driving complex, multi-team software engineering delivery across distributed global squads. Expert in Agile/Scrum transformation, roadmap alignment, engineering velocity optimization, and enterprise vendor stakeholder management.',
    skills: [
      'Agile / Scrum / Kanban Methodologies',
      'JIRA & Confluence Administration',
      'Sprint Planning & Backlog Grooming',
      'Risk Management & Mitigation',
      'Cross-Functional Stakeholder Alignment',
      'Budget Management ($5M+ portfolios)',
      'CI/CD Delivery Cycles',
      'OKRs & KPI Tracking',
      'Vendor & Contract Negotiation',
      'Product Requirement Documentation (PRD)',
    ],
    experience: [
      {
        id: 'exp-m1',
        company: 'Horizon Cloud Platforms',
        role: 'Senior Technical Project Manager',
        startDate: '2020-04',
        endDate: 'Present',
        description: [
          'Led delivery of cloud infrastructure modernization across 5 distributed squads (40+ engineers), delivering 3 major releases on-schedule within an $8.2M annual budget.',
          'Standardized sprint cadences and velocity estimation across the engineering department, increasing release predictability from 68% to 94%.',
          'Managed enterprise risk log and weekly executive steering committee updates for Fortune 500 partner integrations.',
        ],
        technologies: ['JIRA', 'Confluence', 'Agile', 'Roadmunk', 'AWS'],
      },
      {
        id: 'exp-m2',
        company: 'Cascade Digital Labs',
        role: 'Technical Project Manager / Scrum Master',
        startDate: '2017-06',
        endDate: '2020-03',
        description: [
          'Facilitated daily standups, backlog refinement, sprint retrospectives, and sprint planning meetings for 2 mobile application squads.',
          'Reduced customer-reported critical bugs post-release by 45% through strict Definition-of-Done criteria and QA automated gates.',
        ],
        technologies: ['JIRA', 'Scrum', 'Asana', 'GitLab'],
      },
    ],
    education: [
      {
        id: 'edu-m1',
        institution: 'University of Washington',
        degree: 'Bachelor of Science',
        field: 'Industrial & Systems Engineering',
        graduationYear: '2017',
      },
    ],
    rawText: `MARCUS CHEN, PMP, CSM
Seattle, WA | marcus.chen@pmlead.com | +1 (555) 345-6789 | linkedin.com/in/marcuschen-pm

PROFESSIONAL SUMMARY
Certified Senior Technical Project Manager (PMP, CSM) with 7+ years of experience driving complex, multi-team software engineering delivery across distributed global squads. Expert in Agile/Scrum transformation, roadmap alignment, engineering velocity optimization, and enterprise vendor stakeholder management.

CORE COMPETENCIES
- Agile & Scrum Coaching
- JIRA & Confluence Enterprise Administration
- Budget & Resource Allocation ($8M+ scope)
- Sprint Cadence & Velocity Engineering
- Risk Assessment & Steering Committee Communication

EXPERIENCE
Senior Technical Project Manager | Horizon Cloud Platforms | 2020-04 - Present
- Led delivery of cloud infrastructure modernization across 5 distributed squads (40+ engineers), delivering 3 major releases on-schedule within an $8.2M annual budget.
- Standardized sprint cadences and velocity estimation across the engineering department, increasing release predictability from 68% to 94%.
- Managed enterprise risk log and weekly executive steering committee updates for Fortune 500 partner integrations.

Technical Project Manager / Scrum Master | Cascade Digital Labs | 2017-06 - 2020-03
- Facilitated daily standups, backlog refinement, sprint retrospectives, and sprint planning meetings for 2 mobile application squads.
- Reduced customer-reported critical bugs post-release by 45% through strict Definition-of-Done criteria and QA automated gates.

CERTIFICATIONS
- Project Management Professional (PMP) #2847193
- Certified ScrumMaster (CSM) - Scrum Alliance`,
    extractedTextOrder: `MARCUS CHEN, PMP, CSM
Seattle, WA | marcus.chen@pmlead.com | +1 (555) 345-6789
SUMMARY: Certified Senior Technical Project Manager...`,
    layoutStructure: {
      detectedColumns: 1,
      hasTables: false,
      hasTextBoxes: false,
      hasHeaderFooterContact: false,
      unusualCharacters: [],
      fontCount: 2,
      pageCount: 2,
      isScannedOrImage: false,
      readingOrderRisk: 'low',
    },
    fileType: 'docx',
    fileSize: '95 KB',
    fileName: 'Marcus_Chen_Technical_Project_Manager.docx',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-08T11:00:00Z',
  },
];

export const SAMPLE_JOBS: JobDescription[] = [
  {
    id: 'job-senior-fullstack',
    title: 'Senior Full-Stack Engineer (React, Node, Cloud)',
    company: 'Starlight Scale Technologies',
    location: 'San Francisco, CA / Remote',
    experienceYears: 5,
    requiredSkills: [
      'TypeScript',
      'React.js',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'Docker',
      'REST / GraphQL APIs',
      'CI/CD Pipelines',
      'Microservices Architecture',
    ],
    preferredSkills: [
      'Kubernetes',
      'Redis',
      'Playwright or Cypress',
      'FastAPI / Python',
      'Terraform',
      'System Design for High Scale',
    ],
    educationRequirement: "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience",
    responsibilities: [
      'Architect, develop, and maintain robust client-facing web applications using React, Next.js, and TypeScript.',
      'Design reliable backend services and APIs in Node.js and PostgreSQL, with attention to performance, security, and scalability.',
      'Lead architecture discussions, conduct thoughtful code reviews, and mentor mid-level and junior engineers.',
      'Collaborate closely with product managers, UX designers, and infrastructure teams to deliver high-impact roadmap initiatives.',
      'Own operational health, testing, and continuous deployment of production services on AWS.',
    ],
    rawText: `Job Title: Senior Full-Stack Engineer (React, Node, Cloud)
Company: Starlight Scale Technologies
Location: San Francisco, CA / Remote

About The Role:
Starlight Scale is looking for an experienced Senior Full-Stack Software Engineer to lead the architecture and delivery of our core customer analytics portal. You will work across the modern TypeScript stack (React, Next.js, Node.js, PostgreSQL, AWS) to deliver resilient, delightful, and highly performant web applications.

Requirements:
- 5+ years of software development experience with modern web technologies.
- Strong proficiency in TypeScript, React.js, Next.js, and modern Node.js backends.
- Solid understanding of database architecture (PostgreSQL), index optimization, and distributed caching (Redis).
- Hands-on experience containerizing applications with Docker and deploying to AWS cloud environments.
- Experience building automated test suites (unit, integration, and end-to-end with Jest/Playwright).
- Demonstrated ownership of complex technical initiatives and mentoring team members.

Preferred Qualifications:
- Familiarity with Kubernetes orchestration and infrastructure-as-code (Terraform).
- Experience handling real-time data or GraphQL APIs.
- B.S. in Computer Science or related STEM field.`,
    createdAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'job-senior-data-analyst',
    title: 'Senior Data & Product Analyst',
    company: 'Fintech Velocity Group',
    location: 'Austin, TX / Hybrid',
    experienceYears: 4,
    requiredSkills: [
      'SQL',
      'Python',
      'Tableau or Power BI',
      'A/B Testing & Experimentation',
      'Data Warehousing (Snowflake or BigQuery)',
      'Statistical Analysis',
      'dbt',
    ],
    preferredSkills: [
      'Looker',
      'Predictive Modeling (Scikit-learn)',
      'Customer Lifetime Value (LTV) Modeling',
      'Fintech Domain Experience',
    ],
    educationRequirement: 'B.S. in Statistics, Mathematics, Economics, Computer Science or related quantitative field',
    responsibilities: [
      'Partner with product and engineering leaders to design, execute, and analyze rigorous A/B experiments on payment flows.',
      'Build and maintain scalable business intelligence dashboards in Tableau and Looker.',
      'Write optimized SQL data transformation models in Snowflake and dbt for production reporting.',
      'Conduct deep-dive exploratory data analysis to discover user friction points and conversion drop-offs.',
    ],
    rawText: `Job Title: Senior Data & Product Analyst
Company: Fintech Velocity Group
Location: Austin, TX / Hybrid

We are seeking a Senior Data Analyst to empower product decisions across our payment platform. You will formulate hypotheses, design statistical experiments, and communicate actionable insights to executive leadership.

Qualifications:
- 4+ years of data analytics experience.
- Mastery of SQL (CTEs, window functions, query performance tuning).
- Strong proficiency in Python for data analysis (Pandas, NumPy).
- Proven track record with BI tools (Tableau, Looker, or Power BI).
- Deep understanding of statistical A/B test analysis, sample size determination, and significance testing.`,
    createdAt: '2026-10-09T10:00:00Z',
  },
  {
    id: 'job-technical-pm',
    title: 'Lead Technical Project Manager (Engineering)',
    company: 'Nexis Enterprise Solutions',
    location: 'Seattle, WA / Remote',
    experienceYears: 6,
    requiredSkills: [
      'Agile / Scrum Methodologies',
      'JIRA Administration',
      'Sprint Planning',
      'Risk Management',
      'Stakeholder Management',
      'Software Delivery Lifecycle (SDLC)',
      'Engineering Capacity Planning',
    ],
    preferredSkills: [
      'PMP Certification',
      'CSM Certification',
      'Cloud Architecture Familiarity (AWS/Azure)',
      'Budget Management',
    ],
    educationRequirement: "Bachelor's degree in Engineering, Business, or related discipline",
    responsibilities: [
      'Orchestrate sprint planning, backlog grooming, and cross-team dependency mapping for 4 engineering squads.',
      'Deliver complex cloud migration initiatives on time, within scope, and aligned with budget targets.',
      'Provide transparent risk registers and executive milestone reporting to VP and C-level stakeholders.',
    ],
    rawText: `Job Title: Lead Technical Project Manager (Engineering)
Company: Nexis Enterprise Solutions

We need an experienced Technical Project Manager to coordinate cross-squad delivery for enterprise cloud services.`,
    createdAt: '2026-10-08T09:00:00Z',
  },
];

export const SAMPLE_ANALYSES: AnalysisResult[] = [
  {
    id: 'analysis-alex-senior-fullstack',
    userId: 'user-demo-seeker',
    resumeId: 'res-alex-rivera',
    jobDescriptionId: 'job-senior-fullstack',
    resumeTitle: 'Alex Rivera - Senior Full-Stack Engineer Resume',
    candidateName: 'Alex Rivera',
    targetJobTitle: 'Senior Full-Stack Engineer (React, Node, Cloud)',
    targetCompany: 'Starlight Scale Technologies',
    overallMatchScore: 92,
    categoryScores: {
      requiredSkills: 95,
      workExperience: 94,
      responsibilities: 90,
      educationCertifications: 88,
      projectEvidence: 93,
    },
    skillAnalysis: {
      matchedCount: 14,
      partialCount: 2,
      missingCount: 1,
      transferableCount: 3,
      skills: [
        {
          skill: 'TypeScript',
          status: 'strong',
          evidenceInResume: 'Used throughout Vanguard Cloud & Apex Data for frontend & backend microservices.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Extensive production usage demonstrated across multiple roles.',
        },
        {
          skill: 'React.js & Next.js',
          status: 'strong',
          evidenceInResume: 'Led migration to Next.js micro-frontends at Vanguard, improving page loads by 38%.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Clear architectural leadership and quantified business outcome.',
        },
        {
          skill: 'Node.js & Express',
          status: 'strong',
          evidenceInResume: 'Engineered real-time telemetry analytics platform consuming 2M+ events/hour.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Demonstrated high-throughput backend service delivery.',
        },
        {
          skill: 'PostgreSQL',
          status: 'strong',
          evidenceInResume: 'Primary relational database at Apex Data with complex queries and real-time streams.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Explicitly proven in production context.',
        },
        {
          skill: 'AWS (ECS, S3, CloudFront)',
          status: 'strong',
          evidenceInResume: 'Architected caching & CI/CD deployment on AWS ECS with blue/green cutovers.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Cloud deployment and architecture requirements well satisfied.',
        },
        {
          skill: 'Docker & Microservices',
          status: 'strong',
          evidenceInResume: 'Contained microservices architecture migration at Vanguard Technologies.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Meets containerization and architectural prerequisites.',
        },
        {
          skill: 'Kubernetes',
          status: 'partial',
          evidenceInResume: 'Listed in technical skills; lack of detailed production cluster management bullet.',
          requiredByJob: false,
          importance: 'preferred',
          rationale: 'Candidate claims skill, but could provide a concrete deployment example to prove depth.',
        },
        {
          skill: 'Terraform (IaC)',
          status: 'missing',
          evidenceInResume: 'Not found in documented resume experience.',
          requiredByJob: false,
          importance: 'preferred',
          rationale: 'Job lists Terraform as preferred; candidate has AWS ECS experience which is transferable.',
        },
      ],
    },
    experienceAnalysis: {
      relevanceScore: 94,
      documentedYears: 6.5,
      requiredYears: 5,
      keyAchievements: [
        'Reduced API latency by 42% and saved $14,000/month via Redis/CloudFront caching.',
        'Migrated monolithic frontend to Next.js micro-frontends with 38% page speed increase.',
        'Scaled data ingestion to 2 million events per hour using Node.js & WebSockets.',
      ],
      unsupportedClaims: [
        'Kubernetes cluster operations mentioned in skill list but not detailed in experience bullets.',
      ],
      missingExperienceAreas: [
        'Infrastructure-as-Code (Terraform) not explicitly detailed.',
      ],
      summary:
        "The candidate exceeds the 5-year requirement with directly applicable technical leadership in TypeScript, React, Next.js, Node.js, and AWS. Achievements are quantified with strong engineering metrics.",
    },
    recommendations: [
      {
        id: 'rec-1',
        category: 'impact_metric',
        priority: 'high',
        title: 'Highlight Kubernetes Cluster Management Experience',
        description:
          'You list Kubernetes in your skills, but neither role bullet mentions how you configured or orchestrated clusters. Adding 1 sentence about Helm charts or deployment manifests will solidify this preferred requirement.',
        actionableStep:
          'Add a bullet under Vanguard Cloud detailing how you configured Kubernetes manifests or autoscaling policies if accurate.',
        exampleDiff: {
          original: 'Mentored a cross-functional team of 6 engineers...',
          suggested: 'Configured Kubernetes ECS manifests and mentored a team of 6 engineers across automated deployments...',
        },
      },
      {
        id: 'rec-2',
        category: 'skill_gap',
        priority: 'medium',
        title: 'Clarify Infrastructure-as-Code (Terraform) Experience',
        description:
          'The job description prefers Terraform. If you have provisioned AWS resources using Terraform or AWS CDK, state this clearly in your Cloud experience.',
        actionableStep:
          'Mention Terraform in the Vanguard Cloud stack if you used it to provision AWS ECS clusters.',
      },
      {
        id: 'rec-3',
        category: 'positioning',
        priority: 'low',
        title: 'Elevate Mentorship & System Design Contributions',
        description:
          'The target role seeks senior technical ownership. Your team mentoring bullet at Vanguard is strong; position it near the top of the role description.',
        actionableStep: 'Reorder bullets so architectural ownership and mentorship precede routine integrations.',
      },
    ],
    atsResult: {
      score: 96,
      status: 'pass',
      findings: [
        {
          id: 'ats-1',
          title: 'Single-Column Clean Layout',
          severity: 'passed',
          evidence: 'Single column layout detected with clear visual hierarchy.',
          whyItMatters: 'Parsing engines read top-to-bottom sequentially without column-jumping bugs.',
          recommendedFix: 'No changes required. Keep this structure.',
          confidence: 'verified',
        },
        {
          id: 'ats-2',
          title: 'Selectable Text Extraction',
          severity: 'passed',
          evidence: '100% of characters parsed cleanly; zero OCR distortion or image layers.',
          whyItMatters: 'Applicant tracking systems can ingest all text without skipping sections.',
          recommendedFix: 'Maintain standard TrueType or OpenType vector fonts.',
          confidence: 'verified',
        },
        {
          id: 'ats-3',
          title: 'Standard Contact Header Placement',
          severity: 'passed',
          evidence: 'Name, email, phone number, location, and GitHub links extracted in sequence at top.',
          whyItMatters: 'ATS parsers accurately associate contact details with the applicant record.',
          recommendedFix: 'None required.',
          confidence: 'verified',
        },
        {
          id: 'ats-4',
          title: 'Standard Section Headers Used',
          severity: 'passed',
          evidence: 'Standard headings found: SUMMARY, TECHNICAL SKILLS, PROFESSIONAL EXPERIENCE, EDUCATION.',
          whyItMatters: 'Allows deterministic semantic categorizing across Workday, Taleo, Greenhouse, and Lever.',
          recommendedFix: 'Retain standard headings.',
          confidence: 'verified',
        },
      ],
      textExtractionPreview: {
        originalPreview: 'ALEX RIVERA\nSan Francisco, CA | alex.rivera@example.com | +1 (555) 234-5678\nSUMMARY: Results-driven Senior Full-Stack...',
        extractedOrder: 'ALEX RIVERA\nSan Francisco, CA | alex.rivera@example.com | +1 (555) 234-5678\nSUMMARY\nResults-driven Senior Full-Stack Software Engineer with 6+ years of experience...\nTECHNICAL SKILLS\nLanguages: TypeScript, JavaScript (ES6+), Python, SQL...',
        extractedWordCount: 420,
      },
      layoutChecks: [
        { name: 'Multi-column detection', status: 'passed', details: 'Document uses a reliable single-column format.' },
        { name: 'Table extraction risk', status: 'passed', details: 'No nested table structures used for core credentials.' },
        { name: 'Header/Footer isolation', status: 'passed', details: 'No vital contact data hidden in floating header/footer margins.' },
        { name: 'Graphic text boxes', status: 'passed', details: 'Zero floating text boxes or shape drawings detected.' },
        { name: 'Character encoding test', status: 'passed', details: 'Standard UTF-8 characters; no broken symbol glyphs.' },
      ],
      suggestedHeadings: ['Professional Summary', 'Core Technical Skills', 'Professional Experience', 'Education'],
      singleColumnGuidance: 'Your resume follows the recommended single-column layout, ensuring optimal readability across all ATS systems.',
    },
    writingInsights: {
      reviewScore: 89,
      phraseOverlapScore: 24,
      buzzwordDensity: 3.2,
      observations: [
        {
          id: 'obs-1',
          type: 'vague_metric',
          severity: 'low',
          flaggedText: 'Mentored a cross-functional team of 6 engineers across sprint planning...',
          context: 'Experience at Vanguard Cloud Technologies',
          reason: 'Mentorship is stated clearly, but adding an outcome (e.g. 2 engineers promoted) adds high credibility.',
          suggestion: 'Optional: include whether mentorship accelerated velocity or onboarding times.',
        },
        {
          id: 'obs-2',
          type: 'generic_buzzword',
          severity: 'low',
          flaggedText: 'Results-driven Senior Full-Stack Software Engineer',
          context: 'Summary opening statement',
          reason: '"Results-driven" is a frequent cliché; your specific achievements speak for themselves.',
          suggestion: 'Consider opening directly with your specialization: "Senior Full-Stack Software Engineer specialized in distributed systems and Next.js platforms..."',
        },
      ],
      phraseOverlapItems: [
        {
          phrase: 'Next.js micro-frontends with Node.js/GraphQL',
          overlapType: 'standard_industry_term',
          count: 1,
          relevanceExplanation: 'Standard modern stack terminology appropriate for the target role.',
        },
        {
          phrase: 'zero-downtime blue/green deployments',
          overlapType: 'exact_job_match',
          count: 1,
          relevanceExplanation: 'Demonstrates direct operational capability requested by the job description.',
        },
      ],
      recruiterVerificationQuestions: [
        {
          id: 'q-1',
          topic: 'Architecture Migration',
          flaggedResumeStatement: 'Architected and led the migration of a monolithic e-commerce dashboard into Next.js micro-frontends...',
          recruiterQuestion: 'Can you walk us through the rollout strategy you used for the micro-frontend migration, and how you handled shared state?',
          suggestedLookout: 'Candidate should describe module federation, iframe isolation, or route-level proxies, as well as deployment rollbacks.',
        },
        {
          id: 'q-2',
          topic: 'High-Volume Event Telemetry',
          flaggedResumeStatement: 'Consuming over 2 million events per hour using Node.js, WebSockets, and PostgreSQL.',
          recruiterQuestion: 'How did you prevent database connection pool exhaustion or lock contention at 2M events/hour in PostgreSQL?',
          suggestedLookout: 'Candidate should mention batching, message queues (Kafka/RabbitMQ), or pgBouncer connection pooling.',
        },
      ],
      disclaimer:
        'AI Writing & Authenticity Review provides stylistic and verification insights to assist human judgment. A high score does not guarantee human authorship, nor does generic wording imply dishonesty. Overlap reflects tailored relevance.',
    },
    isDemo: true,
    createdAt: '2026-10-10T09:35:00Z',
  },
  {
    id: 'analysis-priya-senior-data',
    userId: 'user-demo-seeker',
    resumeId: 'res-priya-sharma',
    jobDescriptionId: 'job-senior-data-analyst',
    resumeTitle: 'Priya Sharma - Senior Data Analyst Resume',
    candidateName: 'Priya Sharma',
    targetJobTitle: 'Senior Data & Product Analyst',
    targetCompany: 'Fintech Velocity Group',
    overallMatchScore: 88,
    categoryScores: {
      requiredSkills: 92,
      workExperience: 88,
      responsibilities: 86,
      educationCertifications: 94,
      projectEvidence: 85,
    },
    skillAnalysis: {
      matchedCount: 11,
      partialCount: 2,
      missingCount: 1,
      transferableCount: 2,
      skills: [
        {
          skill: 'SQL (Advanced Window Functions)',
          status: 'strong',
          evidenceInResume: 'Optimized complex SQL queries on Snowflake and BigQuery, cutting costs by 35%.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Deep database analysis and query optimization proven.',
        },
        {
          skill: 'Python (Pandas, Scikit-learn)',
          status: 'strong',
          evidenceInResume: 'Built predictive churn models with 83% precision; anomaly detection scripts.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Demonstrated programmatic modeling and automation.',
        },
        {
          skill: 'A/B Testing & Experimentation',
          status: 'strong',
          evidenceInResume: 'Designed and evaluated 45+ statistical A/B experiments on onboarding funnels (+8.4% conversion).',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Exceptional evidence directly matching core job requirements.',
        },
        {
          skill: 'Tableau & Looker',
          status: 'strong',
          evidenceInResume: 'Built executive dashboards for C-suite monitoring $85M ARR.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Proven high-visibility BI dashboard construction.',
        },
        {
          skill: 'dbt (data build tool)',
          status: 'partial',
          evidenceInResume: 'Listed in tech stack at FinLeap Global, but lacks a detailed standalone modeling sentence.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Could provide details on dbt tests, incremental models, or version control workflow.',
        },
      ],
    },
    experienceAnalysis: {
      relevanceScore: 90,
      documentedYears: 5.2,
      requiredYears: 4,
      keyAchievements: [
        'Reduced C-suite weekly reporting prep from 16 hours to 45 mins via automated Tableau dashboards.',
        'Executed 45+ A/B tests yielding +8.4% conversion bump.',
        'Retained $1.2M ARR using predictive churn models.',
      ],
      unsupportedClaims: [],
      missingExperienceAreas: ['dbt pipeline modeling architecture details.'],
      summary: 'Strong candidate with deep analytical rigor, quantified impact, and direct fintech relevance.',
    },
    recommendations: [
      {
        id: 'rec-p1',
        category: 'formatting',
        priority: 'high',
        title: 'Resolve 2-Column Layout for ATS Parsers',
        description:
          'Your resume uses a 2-column layout with table elements. Some legacy ATS parsers may blend your skills section into the company name column.',
        actionableStep: 'Switch to a clean single-column hierarchy to prevent text extraction interleaving.',
      },
      {
        id: 'rec-p2',
        category: 'skill_gap',
        priority: 'medium',
        title: 'Elaborate on dbt Modeling Practices',
        description:
          'The employer emphasizes dbt. Mention how you wrote incremental models or CI testing for data transformations.',
        actionableStep: 'Add 1 bullet describing your dbt workflow in Snowflake.',
      },
    ],
    atsResult: {
      score: 78,
      status: 'warning',
      findings: [
        {
          id: 'ats-p1',
          title: 'Two-Column Layout Detected',
          severity: 'medium',
          evidence: 'Two vertical text streams detected on page 1.',
          whyItMatters: 'Some older applicant tracking systems read across columns horizontally, jumbling sentences.',
          recommendedFix: 'Convert to a streamlined single-column layout.',
          confidence: 'verified',
        },
        {
          id: 'ats-p2',
          title: 'Contact Information in Header Margin',
          severity: 'medium',
          evidence: 'Phone and email placed in upper header bounding area.',
          whyItMatters: 'Header margins are sometimes stripped by parsers prior to text extraction.',
          recommendedFix: 'Place contact info within the main document body text.',
          confidence: 'verified',
        },
      ],
      textExtractionPreview: {
        originalPreview: 'PRIYA SHARMA | Austin, TX\nSUMMARY: Analytical Senior Data Analyst...',
        extractedOrder: 'PRIYA SHARMA | Austin, TX\nSKILLS: SQL, Python... SUMMARY: Analytical Senior...',
        extractedWordCount: 380,
      },
      layoutChecks: [
        { name: 'Multi-column detection', status: 'warning', details: 'Dual column layout detected.' },
        { name: 'Table extraction risk', status: 'warning', details: 'Table layout detected for skills section.' },
        { name: 'Header/Footer isolation', status: 'warning', details: 'Header margin contains email and phone.' },
        { name: 'Graphic text boxes', status: 'passed', details: 'No unselectable text shapes.' },
        { name: 'Character encoding test', status: 'passed', details: 'UTF-8 valid.' },
      ],
      suggestedHeadings: ['Professional Summary', 'Core Technical Skills', 'Professional Experience', 'Education'],
      singleColumnGuidance: 'Transform your two-column format into single-column to improve compatibility from 78% to 95%+',
    },
    writingInsights: {
      reviewScore: 92,
      phraseOverlapScore: 18,
      buzzwordDensity: 2.1,
      observations: [],
      phraseOverlapItems: [
        {
          phrase: 'customer lifetime value modeling',
          overlapType: 'standard_industry_term',
          count: 1,
          relevanceExplanation: 'Standard quantitative analytics terminology.',
        },
      ],
      recruiterVerificationQuestions: [
        {
          id: 'qp-1',
          topic: 'A/B Test Statistical Significance',
          flaggedResumeStatement: 'Designed and evaluated 45+ statistical A/B experiments on onboarding funnels...',
          recruiterQuestion: 'How did you determine sample size and guard against peeking problems (p-hacking) during experiments?',
          suggestedLookout: 'Look for understanding of minimum detectable effect (MDE), power calculations, or sequential testing methods.',
        },
      ],
      disclaimer: 'Writing signals indicate highly evidence-grounded statements with concrete metrics.',
    },
    isDemo: true,
    createdAt: '2026-10-09T14:20:00Z',
  },
];
