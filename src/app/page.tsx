'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ScoreGauge } from '@/components/ScoreGauge';
import { useAuth } from '@/lib/authContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  PenTool,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Users,
  Search,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  const { switchRole } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Smart Resume Analyzer differ from standard keyword scanners?',
      a: 'Traditional tools merely count exact keyword frequencies. Smart Resume Analyzer evaluates contextual skill demonstration, distinguishes required from preferred competencies, tests ATS document reading order heuristics, identifies generic phrasing, and allows conversational Q&A grounded in documented resume passages.',
    },
    {
      q: 'Does the ATS Simulator guarantee my resume will pass all corporate systems?',
      a: 'No scanner can guarantee internal system behavior across proprietary company implementations like Workday or Taleo. Our ATS Simulator tests documented parsing heuristics—such as multi-column reading order risks, tables, text extraction fidelity, and standard heading recognition—to maximize readability across standard parsing engines.',
    },
    {
      q: 'Does the AI Writing Review accuse candidates of using ChatGPT?',
      a: 'Never. AI-generated text cannot be reliably detected with absolute certainty. Our system provides stylistic observations—such as generic buzzwords, unsubstantiated claims, and direct job-description phrase overlap—along with recruiter verification questions to facilitate responsible human evaluation.',
    },
    {
      q: 'How does the interactive Resume Chatbot work?',
      a: 'The chatbot uses Retrieval-Augmented Generation (RAG). It splits the resume into indexed chunks, retrieves relevant passages matching your question, and formulates answers with explicit page and section citations. If information is not in the resume, it clearly acknowledges the absence rather than fabricating facts.',
    },
    {
      q: 'Can recruiters use this platform to compare candidates fairly?',
      a: 'Yes. Recruiters can view structured candidate profiles, compare documented qualifications side-by-side against the same job description, and generate objective verification questions without relying on biased automated rejection algorithms.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50 to-indigo-50/30">
        <div className="mx-auto max-w-7xl px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Next-Generation AI Resume Intelligence Platform
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl max-w-4xl mx-auto leading-tight">
            Your Resume.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">
              Smarter. Stronger.
            </span>{' '}
            ATS-Ready.
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-base text-slate-600 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Analyze resumes, uncover job-specific skill gaps, identify formatting risks, and explore candidate experience through intelligent AI-powered tools.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/app/analyze"
              onClick={() => switchRole('job_seeker')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
            >
              <FileCheck2 className="h-4 w-4" /> Analyze My Resume
            </Link>
            <Link
              href="/app/compare"
              onClick={() => switchRole('recruiter')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            >
              <Users className="h-4 w-4 text-indigo-600" /> Explore Recruiter Tools
            </Link>
          </div>

          {/* Interactive Live Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-indigo-950/5 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <span className="ml-2 text-xs font-mono font-semibold text-slate-400">
                  Demo Analysis • Alex Rivera vs Senior Full-Stack Engineer
                </span>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Live Simulation
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Score Gauges */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <ScoreGauge score={92} label="Job Match" size="sm" subtitle="Strong Alignment" />
                  <ScoreGauge score={96} label="ATS Health" size="sm" subtitle="Optimal Format" />
                </div>
                <div className="mt-4 w-full rounded-xl bg-white border border-slate-200 p-3 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900 block mb-0.5">Primary Alignment:</span>
                  Exceeds 5-year experience requirement with proven TypeScript, React, Next.js, and AWS architecture.
                </div>
              </div>

              {/* Skill Breakdown Snippet */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                  Skill Alignment Breakdown
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-white border border-emerald-200 p-2 text-xs">
                    <span className="font-semibold text-slate-800">TypeScript & React.js</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Strong Match
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white border border-emerald-200 p-2 text-xs">
                    <span className="font-semibold text-slate-800">Node.js & PostgreSQL</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Strong Match
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white border border-amber-200 p-2 text-xs">
                    <span className="font-semibold text-slate-800">Kubernetes (K8s)</span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Partial Evidence
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 p-2 text-xs">
                    <span className="font-semibold text-slate-800">Terraform (IaC)</span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Missing Gap
                    </span>
                  </div>
                </div>
              </div>

              {/* RAG Resume Chat Preview */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                    Evidence-Grounded Chatbot
                  </span>
                  <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs shadow-2xs space-y-2">
                    <div className="font-semibold text-indigo-600">
                      Q: Does Alex have experience leading engineers?
                    </div>
                    <div className="text-slate-700 text-[11px] leading-relaxed">
                      &quot;Yes. Alex mentored 6 engineers across sprint planning and code reviews at Vanguard Cloud Technologies.&quot;
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      <BookOpen className="h-3 w-3" /> Page 1 • Experience Section
                    </span>
                  </div>
                </div>

                <Link
                  href="/app"
                  className="mt-4 text-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Explore Full Interactive Report →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase: 4 Major Capabilities */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Core Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Complete Resume Intelligence
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Four unified modules that transform how job seekers craft resumes and how recruiters evaluate talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Smart Job Matching</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Compare a resume against any job description with explainable scoring. See exact alignment across required skills, relevant work history, project metrics, and transferable domain knowledge.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  0–100 weighted score breakdown with transparent category weights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Strong, partial, missing, and transferable skill classifications
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">ATS Compatibility Simulator</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Inspect document structure, multi-column layouts, tables, text extraction order, and contact headers before submitting your resume to recruitment portals.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                  Sequential text stream preview reflecting ATS parser order
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                  Categorized findings by severity (Critical, High, Medium, Passed)
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md">
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">AI Writing & Authenticity Insights</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Review generic language, buzzword saturation, and job-description phrase overlap with responsible, non-punitive recruiter verification questions.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  Specific suggestions for unsubstantiated claims and clichés
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  Ethical review safeguard: AI writing detection is never proof of dishonesty
                </li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-8 hover:bg-white hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-md">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Interactive Resume Chat (RAG)</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Ask targeted questions about qualifications and experience. Receive answers grounded exclusively in document evidence, with exact section and page citations.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Page and section reference citations for every claim
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  Explicitly acknowledges when evidence is missing rather than hallucinating
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 4-Step Workflow
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              How Smart Resume Analyzer Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Document',
                desc: 'Upload PDF or DOCX file, or paste text directly. We extract selectable text and inspect layout hierarchy.',
              },
              {
                step: '02',
                title: 'Enter Target Job',
                desc: 'Paste the target job description or choose from curated industry presets to extract target requirements.',
              },
              {
                step: '03',
                title: 'Inspect & Improve',
                desc: 'Review ATS compatibility risks, skill gaps, writing signals, and actionable before/after recommendations.',
              },
              {
                step: '04',
                title: 'Explore with RAG Chat',
                desc: 'Ask conversational questions directly against the resume with citations and export professional PDF reports.',
              },
            ].map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative">
                <span className="text-3xl font-black text-indigo-100 block mb-3">{s.step}</span>
                <h4 className="text-base font-bold text-slate-900">{s.title}</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Job Seekers & Recruiters */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-8 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                For Job Seekers
              </span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Land Interviews with Total Confidence
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Eliminate guesswork before submitting your application to competitive roles.
              </p>
              <div className="mt-6 space-y-3 text-xs text-slate-700">
                <div className="rounded-xl bg-white p-3.5 border border-indigo-100 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Identify Hidden Gaps:</span>
                  Discover missing competencies and weakly demonstrated achievements.
                </div>
                <div className="rounded-xl bg-white p-3.5 border border-indigo-100 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Ensure ATS Ingestion:</span>
                  Fix multi-column reading order and formatting traps that drop credentials.
                </div>
                <div className="rounded-xl bg-white p-3.5 border border-indigo-100 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Download ATS Guides:</span>
                  Export clean text resumes optimized for high parsing reliability.
                </div>
              </div>
            </div>

            {/* For Recruiters */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                For Recruiters & Hiring Teams
              </span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Accelerate Candidate Screening with Evidence
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Ground candidate evaluations in documented facts, not inflated keywords.
              </p>
              <div className="mt-6 space-y-3 text-xs text-slate-700">
                <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Candidate Comparison:</span>
                  Compare multiple resumes side-by-side using job-related, explainable criteria.
                </div>
                <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Targeted Verification:</span>
                  Generate tailored interview questions to probe vague metrics or claims.
                </div>
                <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">Ethical AI Decision Support:</span>
                  Support human discernment without biased automated rejection algorithms.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Frequently Asked Questions
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5" /> Instant Local Demo Available
          </span>
          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
            Ready to Analyze Your Resume?
          </h2>
          <p className="mt-4 text-base text-indigo-200 max-w-xl mx-auto">
            Experience the complete platform right now with sample candidate profiles and job descriptions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-950 shadow-lg hover:bg-indigo-50 transition-all hover:scale-[1.02]"
            >
              Launch Interactive Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-xs">
              S
            </div>
            <span className="font-bold text-slate-900">Smart Resume Analyzer</span>
            <span>• College Final-Year Project & Demonstration Platform</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/app" className="hover:text-indigo-600">
              Demo Portal
            </Link>
            <Link href="/app/settings" className="hover:text-indigo-600">
              Settings
            </Link>
            <a href="#faq" className="hover:text-indigo-600">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
