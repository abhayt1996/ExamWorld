import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Laptop,
  Atom,
  Receipt,
  Briefcase,
  TrendingUp,
  Landmark,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import { SUBJECTS_BY_CLASS, CLASSES_LIST } from '../data/curriculumData';
import { ClassLevel, Subject } from '../types';

interface SubjectSelectionViewProps {
  classId: ClassLevel;
  onBackToClasses: () => void;
  onSelectSubject: (subject: Subject) => void;
}

// Icon helper to render subject icon dynamically
const renderSubjectIcon = (iconName: string, className: string = 'w-6 h-6') => {
  switch (iconName) {
    case 'Calculator':
      return <Calculator className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'BookOpen':
    default:
      return <BookOpen className={className} />;
  }
};

// Pastel card styling palette inspired by DIKSHA portal (Screenshot 661)
const PASTEL_PALETTE: Array<{
  bg: string;
  hoverBg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
}> = [
  {
    bg: 'bg-[#C8ECEF]', // Cyan pastel (Accountancy / Math)
    hoverBg: 'hover:bg-[#B5E5E9]',
    border: 'border-[#9ED8DC]',
    iconBg: 'bg-[#00897B]',
    iconColor: 'text-white',
    textColor: 'text-[#004D40]',
  },
  {
    bg: 'bg-[#FBC4C4]', // Coral/Red pastel (Arts / Hindi)
    hoverBg: 'hover:bg-[#F9AEAE]',
    border: 'border-[#F69696]',
    iconBg: 'bg-[#D32F2F]',
    iconColor: 'text-white',
    textColor: 'text-[#5C0A0A]',
  },
  {
    bg: 'bg-[#BAE7ED]', // Bright Teal pastel (Biology)
    hoverBg: 'hover:bg-[#A3DFE7]',
    border: 'border-[#87D4DF]',
    iconBg: 'bg-[#0097A7]',
    iconColor: 'text-white',
    textColor: 'text-[#004D54]',
  },
  {
    bg: 'bg-[#DDD2F9]', // Violet/Lavender pastel (Biotechnology / Physics)
    hoverBg: 'hover:bg-[#CEC0F7]',
    border: 'border-[#BEA9F4]',
    iconBg: 'bg-[#7B1FA2]',
    iconColor: 'text-white',
    textColor: 'text-[#3E0A56]',
  },
  {
    bg: 'bg-[#FFDAB3]', // Soft Orange pastel (Business Studies / SST)
    hoverBg: 'hover:bg-[#FFCFA0]',
    border: 'border-[#FFBE7D]',
    iconBg: 'bg-[#E65100]',
    iconColor: 'text-white',
    textColor: 'text-[#5E2100]',
  },
  {
    bg: 'bg-[#C7D7FA]', // Soft Periwinkle Blue pastel (Chemistry)
    hoverBg: 'hover:bg-[#B2C7F9]',
    border: 'border-[#9BB6F7]',
    iconBg: 'bg-[#2962FF]',
    iconColor: 'text-white',
    textColor: 'text-[#0D2B78]',
  },
  {
    bg: 'bg-[#BFE5FA]', // Soft Sky Blue pastel (Computer Science)
    hoverBg: 'hover:bg-[#A8DCF9]',
    border: 'border-[#8ECFF7]',
    iconBg: 'bg-[#0288D1]',
    iconColor: 'text-white',
    textColor: 'text-[#014166]',
  },
  {
    bg: 'bg-[#CEEBB4]', // Soft Leaf Green pastel (Economics)
    hoverBg: 'hover:bg-[#BCE49D]',
    border: 'border-[#A6DB81]',
    iconBg: 'bg-[#43A047]',
    iconColor: 'text-white',
    textColor: 'text-[#1B4B1E]',
  },
];

export const SubjectSelectionView: React.FC<SubjectSelectionViewProps> = ({
  classId,
  onBackToClasses,
  onSelectSubject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<'All' | 'Science' | 'Commerce' | 'Humanities'>('All');

  const classInfo = CLASSES_LIST.find((c) => c.id === classId) || CLASSES_LIST[4];
  const allSubjects = SUBJECTS_BY_CLASS[classId] || SUBJECTS_BY_CLASS['10'] || [];

  // Stream filtering for classes 11 & 12
  const isSeniorSecondary = classId === '11' || classId === '12';

  const filteredSubjects = allSubjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (isSeniorSecondary && selectedStream !== 'All') {
      return subject.stream === selectedStream || subject.stream === 'General';
    }

    return true;
  });

  return (
    <div className="w-full">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToClasses}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Classes</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#7F6E5F]">
            <span>Classes</span>
            <span className="text-[#C8BCAF]">/</span>
            <span className="text-[#D46244] bg-[#F4ECE1] px-2.5 py-1 rounded-md border border-[#E3D6C5]">
              {classInfo.name}
            </span>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#8C7A6B]">
          Stage: <span className="text-[#32261E] font-bold">{classInfo.stage}</span>
        </div>
      </div>

      {/* View Header with Title and Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2F241C] tracking-tight">
              {classInfo.name} Subjects
            </h1>
            <p className="text-sm text-[#735F50] mt-1.5 font-medium max-w-xl">
              Select a subject below to access chapter-wise question sets, conceptual diagnostic tests, and full-length simulated mock exams.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8777]" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] placeholder-[#A8988A] focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Stream Filter for Class 11 and Class 12 */}
        {isSeniorSecondary && (
          <div className="mt-5 flex items-center gap-2 p-1.5 bg-[#EFE6DA] rounded-xl border border-[#DFD4C4] w-fit">
            <span className="text-xs font-bold text-[#7A6757] px-2 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Stream:
            </span>
            {(['All', 'Science', 'Commerce', 'Humanities'] as const).map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedStream === stream
                    ? 'bg-white text-[#2F241C] shadow-sm'
                    : 'text-[#6D5B4D] hover:text-[#2F241C]'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Browse By Subjects Section Banner (Inspired by Screenshot 661 DIKSHA design) */}
      <div className="mb-6 flex items-center justify-between border-b border-[#E6DBCE] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#D46244]" />
          <h2 className="text-lg font-heading font-bold text-[#32261E]">
            Browse By Subjects
          </h2>
        </div>
        <span className="text-xs font-semibold text-[#8C7A6B]">
          {filteredSubjects.length} {filteredSubjects.length === 1 ? 'Subject' : 'Subjects'} Available
        </span>
      </div>

      {/* Grid of Subject Cards (DIKSHA Pastel Styled Pills / Cards from Screenshot 661) */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredSubjects.map((subject, index) => {
            const palette = PASTEL_PALETTE[index % PASTEL_PALETTE.length];
            const totalTests = subject.topics.reduce((acc, top) => acc + top.tests.length, 0);

            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className={`
                  group relative text-left p-4 rounded-2xl
                  ${palette.bg} ${palette.hoverBg} border-2 ${palette.border}
                  shadow-sm hover:shadow-md
                  transition-all duration-200 ease-out cursor-pointer
                  hover:-translate-y-1 active:translate-y-0.5
                  flex items-center justify-between gap-3
                `}
                aria-label={`Open ${subject.name} topics`}
              >
                {/* Left Side: Subject Book/Flask Icon + Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`
                      w-12 h-12 rounded-xl shrink-0 flex items-center justify-center
                      ${palette.iconBg} ${palette.iconColor} shadow-xs
                      transition-transform duration-200 group-hover:scale-105 group-hover:rotate-2
                    `}
                  >
                    {renderSubjectIcon(subject.icon, 'w-6 h-6')}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`
                        font-heading font-extrabold text-base sm:text-lg tracking-tight
                        ${palette.textColor} truncate
                      `}
                    >
                      {subject.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#54625A] opacity-90 mt-0.5">
                      <span>{subject.topics.length} Chapters</span>
                      <span>·</span>
                      <span>{totalTests} Tests</span>
                    </div>
                  </div>
                </div>

                {/* Right Arrow Indicator */}
                <div
                  className={`
                    w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center shrink-0
                    ${palette.textColor} transition-transform duration-150 group-hover:translate-x-1 shadow-2xs
                  `}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#F6EFE6] rounded-2xl border border-[#E3D7C7]">
          <p className="text-base font-bold text-[#45362B]">No subjects found</p>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Try adjusting your search query or stream filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStream('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#D46244] text-white text-xs font-bold cursor-pointer hover:bg-[#C25538]"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Helpful curriculum note */}
      <div className="mt-12 p-4 rounded-xl bg-[#FAF5EE] border border-[#E8DFC8] text-xs text-[#7F6E60] flex items-center justify-between">
        <span>
          Each subject is structured strictly according to the national syllabus. Click any subject to explore chapter tests and practice series.
        </span>
        <button
          onClick={onBackToClasses}
          className="text-[#D46244] font-bold hover:underline shrink-0 ml-4 cursor-pointer"
        >
          Change Grade
        </button>
      </div>
    </div>
  );
};
