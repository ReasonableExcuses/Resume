'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-900 leading-none">
              Smart Resume
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mt-0.5">
              Intelligence Platform
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            Core Features
          </a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
            How It Works
          </a>
          <a href="#ats-simulator" className="hover:text-indigo-600 transition-colors">
            ATS Simulator
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            Launch Interactive Demo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-700 p-1"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white p-6 md:hidden space-y-4">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>
              Core Features
            </a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </a>
            <a href="#ats-simulator" onClick={() => setMobileMenuOpen(false)}>
              ATS Simulator
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs"
            >
              Launch Interactive Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
