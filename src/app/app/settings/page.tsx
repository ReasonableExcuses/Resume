'use client';

import React, { useState } from 'react';
import { Settings, Shield, Key, Sliders, Trash2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [provider, setProvider] = useState<'offline' | 'openai' | 'gemini' | 'anthropic'>('offline');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Scoring weights
  const [skillWeight, setSkillWeight] = useState(35);
  const [expWeight, setExpWeight] = useState(25);
  const [respWeight, setRespWeight] = useState(15);
  const [eduWeight, setEduWeight] = useState(10);
  const [projWeight, setProjWeight] = useState(15);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sra_provider', provider);
    if (apiKey) localStorage.setItem('sra_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleClearCache = () => {
    if (confirm('Reset custom settings and reload demo records?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
          <Settings className="h-3.5 w-3.5" /> Platform Configuration
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Settings & AI Configuration
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Configure external LLM providers, customize match scoring category weights, and manage document retention policies.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: AI Provider */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Key className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              AI Provider & Inference Integration
            </h2>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 block">
              Active LLM / Synthesis Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'offline',
                  name: 'Built-in Grounded Engine (Active)',
                  desc: 'High-fidelity offline RAG & heuristics. No external API key required.',
                },
                {
                  id: 'openai',
                  name: 'OpenAI (GPT-4o / GPT-4-turbo)',
                  desc: 'Requires valid OpenAI API key from platform.openai.com',
                },
                {
                  id: 'gemini',
                  name: 'Google Gemini (1.5 Pro / Flash)',
                  desc: 'Requires Google AI Studio API key',
                },
                {
                  id: 'anthropic',
                  name: 'Anthropic Claude (3.5 Sonnet)',
                  desc: 'Requires Anthropic console API key',
                },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProvider(p.id as typeof provider)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    provider === p.id
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{p.name}</span>
                    <input
                      type="radio"
                      name="provider"
                      checked={provider === p.id}
                      onChange={() => setProvider(p.id as typeof provider)}
                      className="text-indigo-600"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {provider !== 'offline' && (
              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Private API Key ({provider.toUpperCase()})
                </label>
                <input
                  type="password"
                  placeholder={`Enter your ${provider} API key (e.g. sk-...)`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
                <span className="mt-1 block text-[10px] text-slate-400">
                  Keys are stored exclusively in your local browser session and are never logged to public servers.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Configurable Match Scoring Weights */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Sliders className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Scoring Category Weights (Total: {skillWeight + expWeight + respWeight + eduWeight + projWeight}%)
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Required Skills Alignment</span>
                <span>{skillWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={skillWeight}
                onChange={(e) => setSkillWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Relevant Work Experience Duration</span>
                <span>{expWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={expWeight}
                onChange={(e) => setExpWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Core Responsibilities Overlap</span>
                <span>{respWeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={respWeight}
                onChange={(e) => setRespWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Education & Certifications</span>
                <span>{eduWeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                value={eduWeight}
                onChange={(e) => setEduWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Quantified Project Evidence</span>
                <span>{projWeight}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={projWeight}
                onChange={(e) => setProjWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Privacy & Data Retention */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Shield className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Privacy, Document Deletion & Data Retention
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Uploaded resumes are processed in memory and bound strictly to your user session. You can purge all cached documents and reset to clean demonstration records at any time.
          </p>

          <button
            type="button"
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Purge Stored Session Data & Reset
          </button>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            Save Configuration
          </button>

          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Preferences Saved Successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
