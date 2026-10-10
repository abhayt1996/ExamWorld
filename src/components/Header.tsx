import React from 'react';
import { GraduationCap, BookOpen, Layers, Sparkles } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  activeView: 'classes' | 'subjects' | 'topics';
  selectedClassName?: string;
  selectedSubjectName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  activeView,
  selectedClassName,
  selectedSubjectName,
}) => {
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#D46244] shadow-sm flex items-center justify-center text-white font-black text-xl tracking-tight transition-transform duration-200 group-hover:rotate-[-4deg]">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-[#2B231D]">
                  Exam <span className="text-[#D46244]">WORLD</span>
                </span>
                <span className="text-[11px] font-semibold text-[#8C7A6B] bg-[#EFE8DC] px-1.5 py-0.5 rounded tracking-wide">
                  examworld.site
                </span>
              </div>
              <p className="text-xs text-[#8C7A6B] font-medium hidden sm:block">
                Interactive Indian School Examination & Test Portal
              </p>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#6E5D4F]">
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

          {/* Zone 3: Primary Action / Quick Jump */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#4A3B32] bg-[#EFE6DA] border border-[#DDD0BF] hover:bg-[#E6DBCC] active:bg-[#DECFC0] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-4 h-4 text-[#D46244]" />
              <span>Select Class</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
