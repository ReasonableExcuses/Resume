'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
}

export function ScoreGauge({
  score,
  label,
  size = 'md',
  showSubtitle = true,
  subtitle,
}: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG parameters
  const dimensions = size === 'sm' ? 90 : size === 'lg' ? 170 : 130;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
  const radius = (dimensions - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // emerald-500
  let textColor = 'text-emerald-700';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = 'Excellent Match';

  if (clampedScore < 70) {
    strokeColor = '#f43f5e'; // rose-500
    textColor = 'text-rose-700';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    badgeText = 'Needs Work';
  } else if (clampedScore < 85) {
    strokeColor = '#f59e0b'; // amber-500
    textColor = 'text-amber-700';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    badgeText = 'Good Fit';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions}
          height={dimensions}
          className="transform -rotate-90 transition-all duration-1000 ease-out"
        >
          {/* Background circle */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span
            className={`font-black tracking-tight ${
              size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
            } ${textColor}`}
          >
            {clampedScore}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        {showSubtitle && (
          <span
            className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeBg}`}
          >
            {subtitle || badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
