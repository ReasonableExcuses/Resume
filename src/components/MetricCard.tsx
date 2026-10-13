'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'neutral';
  };
  linkHref?: string;
  linkText?: string;
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber';
}

export function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  linkHref,
  linkText = 'View Details',
  accentColor = 'indigo',
}: MetricCardProps) {
  const iconBgClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const badgeClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconBgClasses[accentColor]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </span>
          {badge && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeClasses[badge.variant]}`}
            >
              {badge.text}
            </span>
          )}
        </div>

        {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
      </div>

      {linkHref && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <Link
            href={linkHref}
            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {linkText} →
          </Link>
        </div>
      )}
    </div>
  );
}
