'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Sparkles, Eye, EyeOff, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'job_seeker' | 'recruiter'>('job_seeker');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    login(email, role);
    router.push('/app');
  };

  const handleDemoLogin = (demoRole: 'job_seeker' | 'recruiter') => {
    loginAsDemoUser(demoRole);
    router.push('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-950/5 space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Smart Resume Analyzer
            </span>
          </Link>
          <h1 className="text-xl font-black text-slate-900 mt-2">Sign in to your account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your resume compatibility reports and candidate profiles
          </p>
        </div>

        {/* Demo One-Click Access */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
            Instant Demo Access (No Password Required):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('job_seeker')}
              className="flex flex-col items-center justify-center rounded-xl border border-indigo-200 bg-white p-2.5 text-center shadow-2xs hover:bg-indigo-50 transition-colors"
            >
              <UserCheck className="h-4 w-4 text-indigo-600 mb-1" />
              <span className="text-xs font-bold text-slate-900 leading-tight">Job Seeker</span>
              <span className="text-[9px] text-slate-500">Alex Rivera</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('recruiter')}
              className="flex flex-col items-center justify-center rounded-xl border border-indigo-200 bg-white p-2.5 text-center shadow-2xs hover:bg-indigo-50 transition-colors"
            >
              <Briefcase className="h-4 w-4 text-indigo-600 mb-1" />
              <span className="text-xs font-bold text-slate-900 leading-tight">Recruiter</span>
              <span className="text-[9px] text-slate-500">Sarah Jenkins</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold uppercase text-slate-400 absolute">
            Or Sign In With Email
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`rounded-xl border p-2 text-center font-bold transition-all ${
                  role === 'job_seeker'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`rounded-xl border p-2 text-center font-bold transition-all ${
                  role === 'recruiter'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-bold text-indigo-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
