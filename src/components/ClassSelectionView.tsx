import React from 'react';
import { Sparkles, ArrowRight, BookOpenCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CLASSES_LIST } from '../data/curriculumData';
import { ClassData, ClassLevel } from '../types';

interface ClassSelectionViewProps {
  onSelectClass: (classId: ClassLevel) => void;
}

// Dedicated tactile 3D styling specifications per class for rich pastel tactile realism
const CLASS_3D_STYLES: Record<
  ClassLevel,
  {
    bg: string;
    border: string;
    borderBottomColor: string;
    shadowColor: string;
    numeralColor: string;
    labelColor: string;
    tagBg: string;
    tagColor: string;
    ringColor: string;
  }
> = {
  '6': {
    bg: 'bg-[#EBF7F0]',
    border: 'border-[#BBE8CD]',
    borderBottomColor: 'border-b-[#78D39E]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(16,185,129,0.25)]',
    numeralColor: 'text-[#1D6340]',
    labelColor: 'text-[#134E2E]',
    tagBg: 'bg-[#D1F0DE]',
    tagColor: 'text-[#134E2E]',
    ringColor: 'focus-visible:ring-[#10B981]',
  },
  '7': {
    bg: 'bg-[#EDF5FD]',
    border: 'border-[#B9DDF8]',
    borderBottomColor: 'border-b-[#71BEF3]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(14,165,233,0.25)]',
    numeralColor: 'text-[#145C8E]',
    labelColor: 'text-[#0C4A75]',
    tagBg: 'bg-[#D4EAFB]',
    tagColor: 'text-[#0C4A75]',
    ringColor: 'focus-visible:ring-[#0EA5E9]',
  },
  '8': {
    bg: 'bg-[#F5EDFD]',
    border: 'border-[#DCBEF8]',
    borderBottomColor: 'border-b-[#B77BF2]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(168,85,247,0.25)]',
    numeralColor: 'text-[#5E2B96]',
    labelColor: 'text-[#481E78]',
    tagBg: 'bg-[#EBD6FC]',
    tagColor: 'text-[#481E78]',
    ringColor: 'focus-visible:ring-[#A855F7]',
  },
  '9': {
    bg: 'bg-[#FDF0F3]',
    border: 'border-[#F8C1CD]',
    borderBottomColor: 'border-b-[#F47D98]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(244,63,94,0.25)]',
    numeralColor: 'text-[#8C1E37]',
    labelColor: 'text-[#6D1429]',
    tagBg: 'bg-[#FCD8E0]',
    tagColor: 'text-[#6D1429]',
    ringColor: 'focus-visible:ring-[#F43F5E]',
  },
  '10': {
    bg: 'bg-[#FEF7EC]',
    border: 'border-[#FBDDB2]',
    borderBottomColor: 'border-b-[#F6B357]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(245,158,11,0.25)]',
    numeralColor: 'text-[#874A07]',
    labelColor: 'text-[#6D3802]',
    tagBg: 'bg-[#FDE7C6]',
    tagColor: 'text-[#6D3802]',
    ringColor: 'focus-visible:ring-[#F59E0B]',
  },
  '11': {
    bg: 'bg-[#EBF9F7]',
    border: 'border-[#B4ECE4]',
    borderBottomColor: 'border-b-[#5FCEC0]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(20,184,166,0.25)]',
    numeralColor: 'text-[#115E59]',
    labelColor: 'text-[#0E4945]',
    tagBg: 'bg-[#CFF3ED]',
    tagColor: 'text-[#0E4945]',
    ringColor: 'focus-visible:ring-[#14B8A6]',
  },
  '12': {
    bg: 'bg-[#EEF1FE]',
    border: 'border-[#C2CBFC]',
    borderBottomColor: 'border-b-[#8595FA]',
    shadowColor: 'hover:shadow-[0_12px_24px_-6px_rgba(99,102,241,0.25)]',
    numeralColor: 'text-[#373BB0]',
    labelColor: 'text-[#282B8C]',
    tagBg: 'bg-[#D9DFFD]',
    tagColor: 'text-[#282B8C]',
    ringColor: 'focus-visible:ring-[#6366F1]',
  },
};

export const ClassSelectionView: React.FC<ClassSelectionViewProps> = ({ onSelectClass }) => {
  return (
    <div className="w-full">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5EEE3] via-[#EFE6D8] to-[#E8DDD0] border border-[#DDD0BF] p-8 sm:p-12 mb-12 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5D7C5]/80 text-[#5F4534] text-xs font-bold tracking-wide uppercase mb-4 border border-[#D5C4AF]">
            <BookOpenCheck className="w-4 h-4 text-[#D46244]" />
            <span>Select Your Standard to Start Practicing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#2F241C] tracking-tight leading-tight sm:leading-tight mb-4">
            Master Every Subject with <span className="text-[#D46244]">Topic-Wise Tests</span> & Mock Exams
          </h1>
          <p className="text-base sm:text-lg text-[#6B5747] leading-relaxed max-w-2xl font-medium">
            Choose your academic grade below. Access complete chapter question banks, timed mock assessments, and step-by-step verified explanations designed strictly around the Indian school syllabus.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-[#5B483B]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Classes 6 to 12</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Full-Width Chapter Accordions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Instant Grading & Review</span>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-[#E4D5C2]/40 blur-2xl pointer-events-none" />
      </div>

      {/* View 1: Section Heading */}
      <div id="class-selection-grid" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#2D231B] tracking-tight">
            Select Your Grade
          </h2>
          <p className="text-sm text-[#7F6C5D] mt-1 font-medium">
            Click on any square button to explore curriculum subjects and tests for that standard.
          </p>
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#9E8A79] bg-[#EFE7DB] px-3.5 py-1.5 rounded-lg border border-[#DDD1C0] self-start sm:self-auto">
          7 Standards Available
        </div>
      </div>

      {/* View 1: Grid of square-shaped, 3D-looking tactile buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
        {CLASSES_LIST.map((cls) => {
          const style = CLASS_3D_STYLES[cls.id];
          return (
            <button
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={`
                group relative aspect-square w-full rounded-2xl sm:rounded-3xl p-3 sm:p-4
                flex flex-col items-center justify-between text-center
                ${style.bg} border-2 ${style.border} ${style.borderBottomColor} border-b-[6px]
                shadow-sm ${style.shadowColor}
                transition-all duration-150 ease-out cursor-pointer
                hover:-translate-y-1.5 active:translate-y-1 active:border-b-2
                focus:outline-none ${style.ringColor} focus-visible:ring-4
              `}
              aria-label={`Select ${cls.name}`}
            >
              {/* Top Pill Subtitle inside the square button */}
              <div
                className={`
                  w-full py-1 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-tight uppercase
                  ${style.tagBg} ${style.tagColor} truncate transition-transform duration-150 group-hover:scale-105
                `}
              >
                {cls.badge}
              </div>

              {/* Center 3D Tactile Numeral */}
              <div className="my-auto flex flex-col items-center justify-center">
                <span
                  className={`
                    font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight
                    ${style.numeralColor} transition-transform duration-200 group-hover:scale-110
                    drop-shadow-sm leading-none
                  `}
                >
                  {cls.id}
                </span>
                <span
                  className={`
                    font-heading font-extrabold text-sm sm:text-base tracking-tight mt-1
                    ${style.labelColor}
                  `}
                >
                  {cls.name}
                </span>
              </div>

              {/* Bottom Interactive Affordance */}
              <div
                className={`
                  w-full flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold
                  ${style.labelColor} opacity-80 group-hover:opacity-100 transition-opacity
                `}
              >
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </div>

              {/* Subtle top glare highlight for 3D tactile button illusion */}
              <div className="absolute top-1 left-2 right-2 h-1.5 rounded-full bg-white/40 pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Curriculum Informational Strip */}
      <div className="mt-14 p-6 rounded-2xl bg-[#F6EFE6] border border-[#E3D7C7] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#E6D7C3] flex items-center justify-center shrink-0 text-[#6B4F3B]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-heading font-bold text-[#32261E]">
              100% Comprehensive National Curriculum Coverage
            </h4>
            <p className="text-xs sm:text-sm text-[#7A6656] mt-0.5 font-medium">
              Every chapter incorporates diagnostic assessments, core mastery questions, higher-order thinking (HOTS) challenges, and full-length simulated mock tests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectClass('10')}
            className="px-4 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] active:bg-[#B3492F] text-white font-bold text-xs tracking-wide transition-colors cursor-pointer shadow-sm flex items-center gap-2"
          >
            <span>Jump to Class 10 (Board Year)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
