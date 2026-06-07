import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/auth/authSlice';
import {
  TrendingUp,
  SquarePen,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart2,
} from 'lucide-react';

// ── PrepRoute Logo ───────────────────────────────────────────────────────────

const PrepRouteLogo: React.FC = () => (
  <img
    src="/logo.png"
    alt="PrepRoute"
    className="h-8 w-auto object-contain select-none"
    draggable={false}
  />
);

// ── Nav items (matching Figma exactly: Dashboard, Test Creation, Test Tracking) ─

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: TrendingUp,
  },
  {
    name: 'Test Creation',
    path: '/tests/create',
    icon: SquarePen,
    matchPaths: ['/tests/create', '/tests/', '/questions', '/preview'],
  },
  {
    name: 'Test Tracking',
    path: '/tracking',
    icon: BarChart2,
  },
] as const;

// ── Breadcrumb helper ─────────────────────────────────────────────────────────

const Breadcrumb: React.FC<{ pathname: string; testTitle?: string }> = ({ pathname, testTitle }) => {
  const isTestFlow =
    pathname === '/tests/create' ||
    pathname.includes('/questions') ||
    pathname.includes('/preview');

  if (isTestFlow) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 select-none">
        <span>Test Creation</span>
        <span className="text-neutral-300 mx-0.5">/</span>
        <span>Create Test</span>
        <span className="text-neutral-300 mx-0.5">/</span>
        <span className="text-[#3B72E1] font-semibold">
          {testTitle || 'Chapter Wise'}
        </span>
      </div>
    );
  }
  return (
    <span className="text-sm font-bold text-neutral-800">Dashboard</span>
  );
};

// ── Main Layout ───────────────────────────────────────────────────────────────

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  const currentTest = useAppSelector((state) => state.tests.currentTest);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  /** Check if a nav item should be "active" based on current path */
  const isNavActive = (item: (typeof NAV_ITEMS)[number]): boolean => {
    if ('matchPaths' in item) {
      return item.matchPaths.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname === item.path;
  };

  const isTestFlow =
    location.pathname.includes('/questions') ||
    location.pathname.includes('/preview');

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-[200px] bg-white border-r border-neutral-200 z-20">
        {/* Logo area */}
        <div className="flex items-center h-16 px-5 border-b border-neutral-100 shrink-0">
          <PrepRouteLogo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-3 pb-4 overflow-y-auto" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={() =>
                  `group relative flex items-center gap-3 pl-5 pr-4 py-3 text-sm transition-all duration-150 ${
                    active
                      ? 'bg-[#EEF4FF] text-[#3B72E1] font-semibold'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 font-medium'
                  }`
                }
              >
                {/* Active left bar indicator */}
                {active && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#3B72E1] rounded-r-full"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active ? 'text-[#3B72E1]' : 'text-neutral-400 group-hover:text-neutral-600'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content Column ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 md:pl-[200px]">

        {/* ── Top Header ─────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-10 flex items-center justify-between h-16 bg-white border-b border-neutral-200 px-5 md:px-6 shrink-0"
          role="banner"
        >
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 border border-neutral-200 mr-3"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Breadcrumb */}
          <div className="flex-1">
            <Breadcrumb
              pathname={location.pathname}
              testTitle={currentTest?.title}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Publish button — only on question/preview pages */}
            {isTestFlow && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('publish-test'))}
                className="hidden sm:inline-flex items-center px-5 py-2 text-xs font-semibold rounded-lg bg-[#4F83F1] hover:bg-[#3D72E1] text-white shadow-sm transition-all active:scale-[0.98]"
                aria-label="Publish test"
              >
                Publish
              </button>
            )}

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-full text-neutral-500 hover:bg-neutral-50 border border-neutral-200 transition-all"
              aria-label="View notifications"
            >
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              {/* Green dot indicator */}
              <span
                className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white"
                aria-hidden="true"
              />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setIsProfileDropdownOpen((o) => !o)}
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
                aria-label="Open user menu"
              >
                {/* Avatar */}
                <img
                  src="/avatar.png"
                  alt={user?.name || 'User avatar'}
                  className="h-8 w-8 rounded-full object-cover border border-neutral-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className =
                        'h-8 w-8 rounded-full bg-[#3B72E1] flex items-center justify-center text-white text-xs font-bold shrink-0';
                      fallback.textContent = (user?.name || 'A').charAt(0).toUpperCase();
                      parent.insertBefore(fallback, target);
                    }
                  }}
                />
                {/* Name + role */}
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-bold text-neutral-800">{user?.name || 'Alex Wando'}</p>
                  <p className="text-[10px] text-neutral-400 font-medium capitalize">{user?.role || 'Admin'}</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-neutral-200 shadow-lg z-20 overflow-hidden animate-scale-in"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-xs font-semibold text-neutral-800 truncate">
                        {user?.name || 'Alex Wando'}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {user?.email || 'admin@preproute.com'}
                      </p>
                    </div>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="flex-1 py-6 px-5 md:px-8 w-full max-w-7xl mx-auto animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Drawer Backdrop ──────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ───────────────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[200px] bg-white border-r border-neutral-200 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 shrink-0">
          <PrepRouteLogo />
          <button
            type="button"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile nav items */}
        <nav className="flex-1 pt-3 pb-4 overflow-y-auto" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={() =>
                  `group relative flex items-center gap-3 pl-5 pr-4 py-3 text-sm transition-all ${
                    active
                      ? 'bg-[#EEF4FF] text-[#3B72E1] font-semibold'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 font-medium'
                  }`
                }
              >
                {active && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#3B72E1] rounded-r-full"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active ? 'text-[#3B72E1]' : 'text-neutral-400 group-hover:text-neutral-600'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile bottom user section */}
        <div className="border-t border-neutral-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#3B72E1] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-800">{user?.name || 'Alex Wando'}</p>
              <p className="text-[10px] text-neutral-400 capitalize">{user?.role || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
            className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
