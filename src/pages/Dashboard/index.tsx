import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { SquarePen, BookOpen, Users, TrendingUp, Clock, CheckCircle, FileText, ArrowRight, Plus } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import type { Test } from '../../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const getDifficultyColor = (difficulty?: string): string => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'medium':    return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'difficult': return 'bg-red-50 text-red-700 border-red-200';
    default:          return 'bg-neutral-50 text-neutral-500 border-neutral-200';
  }
};

const getStatusConfig = (status: Test['status']) => {
  switch (status) {
    case 'published': return { label: 'Published', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    case 'draft':     return { label: 'Draft',     cls: 'bg-amber-50  text-amber-700  border-amber-200',   dot: 'bg-amber-400' };
    case 'archived':  return { label: 'Archived',  cls: 'bg-neutral-100 text-neutral-500 border-neutral-200', dot: 'bg-neutral-400' };
    default:          return { label: status,       cls: 'bg-neutral-100 text-neutral-500 border-neutral-200', dot: 'bg-neutral-400' };
  }
};

// ── Mock test history (supplemented from localStorage currentTest) ────────────

const MOCK_TESTS: Test[] = [
  {
    id: 'test-demo-1',
    title: 'JEE Mains - Physics Set A',
    description: 'Physics - Kinematics (Projectiles)',
    duration: 90,
    passingScore: 40,
    status: 'published',
    questionsCount: 30,
    creatorId: 'usr-1',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    subject: 'Physics',
    topic: 'Kinematics',
    subTopic: 'Projectiles',
    difficulty: 'medium',
    totalMarks: 120,
  },
  {
    id: 'test-demo-2',
    title: 'Chemistry Organic - Full Test',
    description: 'Chemistry - Organic Chemistry (Alcohols)',
    duration: 60,
    passingScore: 40,
    status: 'published',
    questionsCount: 25,
    creatorId: 'usr-1',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    subTopic: 'Alcohols & Ethers',
    difficulty: 'difficult',
    totalMarks: 100,
  },
  {
    id: 'test-demo-3',
    title: 'Mathematics - Calculus Chapter 1',
    description: 'Mathematics - Calculus (Integration)',
    duration: 45,
    passingScore: 40,
    status: 'draft',
    questionsCount: 20,
    creatorId: 'usr-1',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    subject: 'Mathematics',
    topic: 'Calculus',
    subTopic: 'Integration',
    difficulty: 'easy',
    totalMarks: 80,
  },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, accent }) => (
  <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider truncate">{label}</p>
      <p className="text-2xl font-black text-neutral-900 leading-none mt-0.5">{value}</p>
      {sub && <p className="text-[11px] text-neutral-400 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  useDocumentTitle('Dashboard');
  const navigate = useNavigate();
  const currentTest = useAppSelector((state) => state.tests.currentTest);

  // Merge mock history with current test from Redux (if unique)
  const allTests = useMemo((): Test[] => {
    if (currentTest && !MOCK_TESTS.some((t) => t.id === currentTest.id)) {
      return [currentTest, ...MOCK_TESTS];
    }
    return MOCK_TESTS.map((t) => (currentTest?.id === t.id ? currentTest : t));
  }, [currentTest]);

  const publishedCount = allTests.filter((t) => t.status === 'published').length;
  const draftCount     = allTests.filter((t) => t.status === 'draft').length;
  const totalQuestions = allTests.reduce((sum, t) => sum + (t.questionsCount || 0), 0);
  const totalMarks     = allTests.reduce((sum, t) => sum + (t.totalMarks || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your tests and track progress.</p>
        </div>
        <button
          onClick={() => navigate('/tests/create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F83F1] hover:bg-[#3D72E1] text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98]"
          aria-label="Create a new test"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Test
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Tests"
          value={allTests.length}
          sub={`${publishedCount} published · ${draftCount} draft`}
          icon={<FileText className="h-5 w-5 text-indigo-600" aria-hidden="true" />}
          accent="bg-indigo-50"
        />
        <StatCard
          label="Published Tests"
          value={publishedCount}
          sub="Live & accessible"
          icon={<CheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />}
          accent="bg-emerald-50"
        />
        <StatCard
          label="Total Questions"
          value={totalQuestions}
          sub="Across all tests"
          icon={<BookOpen className="h-5 w-5 text-amber-600" aria-hidden="true" />}
          accent="bg-amber-50"
        />
        <StatCard
          label="Total Marks"
          value={totalMarks}
          sub="Sum of all tests"
          icon={<TrendingUp className="h-5 w-5 text-violet-600" aria-hidden="true" />}
          accent="bg-violet-50"
        />
      </div>

      {/* Recent Tests Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Recent Tests</h2>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">Your latest test configurations</p>
          </div>
          <button
            onClick={() => navigate('/tests/create')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F83F1] hover:text-[#3D72E1] transition-colors"
            aria-label="Go to test creation"
          >
            <span>New Test</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {allTests.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
              <SquarePen className="h-6 w-6 text-neutral-300" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-neutral-700 mb-1">No tests yet</p>
            <p className="text-xs text-neutral-400 mb-5">Get started by creating your first test.</p>
            <button
              onClick={() => navigate('/tests/create')}
              className="px-5 py-2.5 bg-[#4F83F1] hover:bg-[#3D72E1] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Create your first test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Recent tests">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-100">
                  <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Test Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Subject</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Questions</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Difficulty</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th scope="col" className="px-4 py-3 text-right text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {allTests.map((test) => {
                  const statusCfg = getStatusConfig(test.status);
                  return (
                    <tr key={test.id} className="hover:bg-neutral-50/50 transition-colors group">
                      {/* Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900 text-[13px] leading-snug line-clamp-1">
                              {test.title}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-medium line-clamp-1 sm:hidden">
                              {test.subject} · {test.questionsCount}Q
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Subject */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-[12px] font-semibold text-neutral-600">{test.subject ?? '—'}</span>
                      </td>
                      {/* Questions */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-[12px] font-semibold text-neutral-600">
                          <Users className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                          {test.questionsCount}
                        </div>
                      </td>
                      {/* Duration */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-[12px] font-semibold text-neutral-600">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                          {test.duration} min
                        </div>
                      </td>
                      {/* Difficulty */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold border capitalize ${getDifficultyColor(test.difficulty)}`}>
                          {test.difficulty ?? '—'}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${statusCfg.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} aria-hidden="true" />
                          {statusCfg.label}
                        </span>
                      </td>
                      {/* Created */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-[12px] text-neutral-400 font-medium">{formatDate(test.createdAt)}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => navigate(`/tests/${test.id}/questions`)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#4F83F1] hover:text-[#3D72E1] opacity-0 group-hover:opacity-100 transition-all"
                          aria-label={`Edit questions for ${test.title}`}
                        >
                          Edit
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Create Test CTA */}
        <button
          onClick={() => navigate('/tests/create')}
          className="flex items-center gap-4 bg-white rounded-xl border border-neutral-200 shadow-sm p-5 text-left hover:shadow-md hover:border-indigo-200 transition-all group"
          aria-label="Start creating a new test"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
            <SquarePen className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900">Create New Test</p>
            <p className="text-[12px] text-neutral-400 font-medium mt-0.5">Set up a new chapter-wise or mock test</p>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-indigo-400 transition-colors" aria-hidden="true" />
        </button>

        {/* Resume draft (if current test is draft) */}
        {currentTest && currentTest.status === 'draft' ? (
          <button
            onClick={() => navigate(`/tests/${currentTest.id}/questions`)}
            className="flex items-center gap-4 bg-white rounded-xl border border-amber-200 shadow-sm p-5 text-left hover:shadow-md hover:border-amber-300 transition-all group"
            aria-label={`Resume draft: ${currentTest.title}`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
              <BookOpen className="h-5 w-5 text-amber-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Resume Draft</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5 truncate">{currentTest.title}</p>
              <p className="text-[12px] text-neutral-400 font-medium mt-0.5">{currentTest.questionsCount} questions · {currentTest.duration} min</p>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-amber-400 transition-colors" aria-hidden="true" />
          </button>
        ) : (
          <div className="flex items-center gap-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">All caught up!</p>
              <p className="text-[12px] text-white/70 font-medium mt-0.5">{publishedCount} tests live · {totalQuestions} questions ready</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
