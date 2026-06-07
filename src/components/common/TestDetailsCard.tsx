import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Test } from '../../types';

interface TestDetailsCardProps {
  /** The full test object — at minimum needs title, subject, topic, subTopic, difficulty, duration, questionsCount, totalMarks */
  test: Test;
  /** If provided, the bottom-right metrics pill is rendered. */
  showMetrics?: boolean;
}

/**
 * Reusable card that displays test metadata in a consistent style.
 * Used on the Questions page and the Preview/Publish page to avoid duplication.
 */
const TestDetailsCard: React.FC<TestDetailsCardProps> = memo(({ test, showMetrics = true }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 select-none relative animate-fade-in">
      {/* Top bar: Chapter Wise pill on left, Edit icon on right */}
      <div className="flex items-center justify-between">
        <span className="bg-[#0A1128] text-white text-[11px] font-bold tracking-wider px-3.5 py-1 rounded-full uppercase">
          Chapter Wise
        </span>
        <button
          onClick={() => navigate('/tests/create')}
          className="text-[#3B72E1] hover:text-[#2E5DBF] transition-colors p-1.5 rounded-lg hover:bg-neutral-50"
          title="Edit Test Details"
          aria-label="Edit test details"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      </div>

      {/* Icon + Test Title + Difficulty pill */}
      <div className="flex items-center gap-3 mt-4">
        {/* Graduation cap badge icon */}
        <div className="w-8 h-8 rounded-lg bg-[#EFF2FE] flex items-center justify-center border border-[#E2E8F0] shadow-sm shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2L4 5V11C4 16.52 7.42 20.74 12 22C16.58 20.74 20 16.52 20 11V5L12 2Z" fill="#7C3AED" opacity="0.15" />
            <path d="M12 2L4 5V11C4 16.52 7.42 20.74 12 22C16.58 20.74 20 16.52 20 11V5L12 2Z" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12.5" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            <path d="M12 5.5L7 8L12 10.5L17 8L12 5.5Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" strokeLinejoin="round" />
            <path d="M9 9V11.5C9 12.5 10.34 13 12 13C13.66 13 15 12.5 15 11.5V9" stroke="#0F172A" strokeWidth="1" />
            <path d="M16 8.5V11" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
            <circle cx="16" cy="11.5" r="0.5" fill="#D97706" />
            <path d="M10.5 12.5C10.5 12.5 11 13.2 12 13.2C13 13.2 13.5 12.5 13.5 12.5" stroke="#78350F" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="10.8" cy="11.8" r="0.3" fill="#78350F" />
            <circle cx="13.2" cy="11.8" r="0.3" fill="#78350F" />
          </svg>
        </div>

        <h2 className="text-base font-extrabold text-[#1E293B] leading-none">
          {test.title}
        </h2>

        <div className="flex items-center gap-1 bg-[#2bb1a4] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg capitalize shadow-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M12 5v14" />
          </svg>
          <span>{test.difficulty ?? 'easy'}</span>
        </div>
      </div>

      {/* Subject / Topic / Sub Topic metadata rows */}
      <div className="space-y-2.5 mt-5">
        {/* Subject */}
        <div className="flex items-center text-xs font-semibold text-neutral-400">
          <span className="w-[72px]">Subject</span>
          <span className="text-neutral-350 mr-3.5">:</span>
          <span className="text-[#475569] font-bold text-[13px]">{test.subject ?? '—'}</span>
        </div>

        {/* Topic */}
        <div className="flex items-center text-xs font-semibold text-neutral-400">
          <span className="w-[72px]">Topic</span>
          <span className="text-neutral-350 mr-3.5">:</span>
          <div className="flex flex-wrap gap-2">
            {test.topic ? (
              test.topic.split(/,\s*/).map((t) => (
                <span key={t} className="border border-amber-300 bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
                  {t}
                </span>
              ))
            ) : (
              <span className="border border-amber-300 bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">—</span>
            )}
          </div>
        </div>

        {/* Sub Topic */}
        <div className="flex items-center text-xs font-semibold text-neutral-400">
          <span className="w-[72px]">Sub Topic</span>
          <span className="text-neutral-350 mr-3.5">:</span>
          <span className="border border-amber-300 bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            {test.subTopic ?? '—'}
          </span>
        </div>
      </div>

      {/* Bottom-right metrics pill: Duration | Questions | Marks */}
      {showMetrics && (
        <div className="md:absolute md:bottom-6 md:right-6 mt-6 md:mt-0 flex justify-end">
          <div
            className="inline-flex items-center border border-neutral-200/80 rounded-xl px-4 py-2 bg-white text-xs font-bold text-neutral-500 shadow-sm"
            role="list"
            aria-label="Test metrics"
          >
            {/* Duration */}
            <div className="flex items-center" role="listitem">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 mr-1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{test.duration} Min</span>
            </div>
            <div className="h-4 w-px bg-neutral-200 mx-3.5" aria-hidden="true" />
            {/* Questions count */}
            <div className="flex items-center" role="listitem">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 mr-1.5" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <path d="M9 17h6" /><path d="M9 12h6" /><path d="M9 8h6" />
              </svg>
              <span>{test.questionsCount} Q's</span>
            </div>
            <div className="h-4 w-px bg-neutral-200 mx-3.5" aria-hidden="true" />
            {/* Total marks */}
            <div className="flex items-center" role="listitem">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 mr-1.5" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>{test.totalMarks ?? 0} Marks</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TestDetailsCard.displayName = 'TestDetailsCard';

export default TestDetailsCard;
