import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Layers,
  LogIn,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onGoHome: () => void;
  onScrollToGrades: () => void;
  activeView: 'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard' | 'leaderboard';
  selectedClassName?: string;
  selectedSubjectName?: string;
  isLoggedIn: boolean;
  user: UserProfile | null;
  onOpenLoginModal: () => void;
  onOpenProfile: () => void;
  onOpenDashboard: () => void;
  onOpenLeaderboard?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onScrollToGrades,
  activeView,
  selectedClassName,
  selectedSubjectName,
  isLoggedIn,
  user,
  onOpenLoginModal,
  onOpenProfile,
  onOpenDashboard,
  onOpenLeaderboard,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarInitial = user && user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 group text-left cursor-pointer transition-transform duration-150 active:scale-95"
            aria-label="Exam WORLD Home"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#D46244] shadow-sm flex items-center justify-center text-white font-black text-xl tracking-tight transition-transform duration-200 group-hover:rotate-[-4deg]">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#2B231D]">
                  Exam <span className="text-[#D46244]">WORLD</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C7A6B] bg-[#EFE8DC] px-1.5 py-0.5 rounded tracking-wide">
                  examworld.site
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B] font-medium hidden sm:block">
                Interactive Indian School Examination & Test Portal
              </p>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#6E5D4F]">
            <button
              onClick={onGoHome}
              className={`transition-colors cursor-pointer hover:text-[#2B231D] ${
                activeView === 'classes' ? 'text-[#D46244] font-bold' : ''
              }`}
            >
              Classes (6–12)
            </button>
            <span className="text-[#C8BCAB] select-none">/</span>
            <span
              className={`transition-colors ${
                activeView === 'subjects' ? 'text-[#D46244] font-bold' : 'text-[#8C7A6B]'
              }`}
            >
              {selectedClassName ? `${selectedClassName} Subjects` : 'Subject Catalog'}
            </span>
            <span className="text-[#C8BCAB] select-none">/</span>
            <span
              className={`transition-colors ${
                activeView === 'topics' ? 'text-[#D46244] font-bold' : 'text-[#8C7A6B]'
              }`}
            >
              {selectedSubjectName ? `${selectedSubjectName} Tests` : 'Topic Accordions'}
            </span>
          </nav>

          {/* Zone 3: Authentication & User Profile System */}
          <div className="flex items-center gap-3">
            {/* Quick Class Selection Action */}
            <button
              onClick={onScrollToGrades}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#4A3B32] bg-[#EFE6DA] border border-[#DDD0BF] hover:bg-[#E6DBCC] active:bg-[#DECFC0] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
              title="Scroll directly to Grades 6-12 selection"
            >
              <Layers className="w-3.5 h-3.5 text-[#D46244]" />
              <span>Grades 6-12</span>
            </button>

            {/* Quick Leaderboard Navigation Action */}
            {onOpenLeaderboard && (
              <button
                onClick={onOpenLeaderboard}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                title="Global Leaderboard"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>
            )}

            {/* User Profile System: Logged Out vs Logged In */}
            {!isLoggedIn ? (
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#D46244] hover:bg-[#C25538] active:bg-[#B3492F] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Google-like Circular User Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#EFE5D8] transition-colors cursor-pointer border border-[#DDD0BF] focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className={`w-9 h-9 rounded-full text-white font-heading font-black text-sm flex items-center justify-center shadow-xs ${
                    user?.role === 'admin' ? 'bg-[#1E293B]' : 'bg-gradient-to-br from-[#D46244] to-[#B3492F]'
                  }`}>
                    {user?.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      avatarInitial
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6E5D4F] transition-transform duration-200 hidden sm:block ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Profile Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-[#DFD3C3] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Summary Header */}
                    <div className="px-4 py-3 border-b border-[#F0E6D8] bg-[#FAF6F0]/60">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full text-white font-heading font-black text-base flex items-center justify-center shadow-xs shrink-0 ${
                          user?.role === 'admin' ? 'bg-[#0F172A]' : 'bg-gradient-to-br from-[#D46244] to-[#B3492F]'
                        }`}>
                          {user?.role === 'admin' ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          ) : (
                            avatarInitial
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-heading font-bold text-[#2F241C] truncate">
                            {user?.name}
                          </p>
                          <p className="text-[11px] font-semibold text-[#8C7A6B] truncate">
                            {user?.role === 'admin' ? 'Master Admin (abt1996)' : `+91 ${user?.mobile}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                        {user?.role === 'admin' ? (
                          <span className="bg-[#1E293B] text-emerald-400 px-2 py-0.5 rounded">System Administrator</span>
                        ) : (
                          <span className="bg-[#EFE3D5] text-[#5C4535] px-2 py-0.5 rounded">Class {user?.currentClass} Student</span>
                        )}
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="py-1 text-xs font-semibold text-[#4A3B30]">
                      {/* Option 1: My Profile */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#FAF4ED] flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#D46244]" />
                        <span>{user?.role === 'admin' ? 'Admin Profile & Change Password' : 'My Profile (Edit Info)'}</span>
                      </button>

                      {/* Option 2: Dashboard */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenDashboard();
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-[#FAF4ED] flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D46244]" />
                        <span>{user?.role === 'admin' ? 'Admin Dashboard (Grade Control & Telemetry)' : 'Dashboard & Progress Graphs'}</span>
                      </button>

                      {/* Option 3: Global Leaderboard */}
                      {onOpenLeaderboard && (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenLeaderboard();
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-[#FAF4ED] flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Trophy className="w-4 h-4 text-amber-600" />
                          <span>Global Student Leaderboard</span>
                        </button>
                      )}

                      <div className="my-1 border-t border-[#F2EAE0]" />

                      {/* Option 3: Logout */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-rose-50 text-rose-700 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
