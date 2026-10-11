import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Play,
  BookMarked,
  HelpCircle,
  Zap,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Subject, ChapterTopic, TopicTest, NestedSubTopic } from '../types';

interface TopicsViewProps {
  className: string;
  subject: Subject;
  isLoggedIn: boolean;
  disabledTopics?: Record<string, boolean>;
  disabledTests?: Record<string, boolean>;
  isAdmin?: boolean;
  onBackToSubjects: () => void;
  onStartTest: (topic: ChapterTopic, test: TopicTest) => void;
  onRequestLoginForTest: (topic: ChapterTopic, test: TopicTest) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  className,
  subject,
  isLoggedIn,
  disabledTopics = {},
  disabledTests = {},
  isAdmin = false,
  onBackToSubjects,
  onStartTest,
  onRequestLoginForTest,
}) => {
  // Store expanded main chapter IDs. Default expand chapter 1 or chapter 2 for immediate demonstrability!
  const [expandedTopicIds, setExpandedTopicIds] = useState<string[]>(() => {
    return subject.topics.length > 0 ? [subject.topics[0].id] : [];
  });

  // Store expanded nested sub-topics (e.g. specific tense ID within Tenses chapter)
  const [expandedSubTopicIds, setExpandedSubTopicIds] = useState<string[]>(['tense-1-sim-pres']);

  // Tense category filter for Tenses topic
  const [tenseFilter, setTenseFilter] = useState<'All' | 'Present' | 'Past' | 'Future'>('All');

  const toggleAccordion = (topicId: string) => {
    setExpandedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const toggleSubAccordion = (subTopicId: string) => {
    setExpandedSubTopicIds((prev) =>
      prev.includes(subTopicId) ? prev.filter((id) => id !== subTopicId) : [...prev, subTopicId]
    );
  };

  const expandAll = () => {
    setExpandedTopicIds(subject.topics.map((t) => t.id));
    // Also expand subtopics if present
    const allSubs: string[] = [];
    subject.topics.forEach((t) => {
      if (t.subTopics) {
        t.subTopics.forEach((st) => allSubs.push(st.id));
      }
    });
    setExpandedSubTopicIds(allSubs);
  };

  const collapseAll = () => {
    setExpandedTopicIds([]);
    setExpandedSubTopicIds([]);
  };

  const handleTestClick = (topic: ChapterTopic, test: TopicTest) => {
    if (!isLoggedIn) {
      onRequestLoginForTest(topic, test);
    } else {
      onStartTest(topic, test);
    }
  };

  const isEnglishGrammar = subject.name.toLowerCase().includes('grammar');

  return (
    <div className="w-full">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSubjects}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Subjects</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#7F6E5F]">
            <span>{className}</span>
            <span className="text-[#C8BCAF]">/</span>
            <span className="text-[#D46244] bg-[#F4ECE1] px-2.5 py-1 rounded-md border border-[#E3D6C5]">
              {subject.name}
            </span>
          </div>
        </div>

        {/* Global Expand/Collapse Affordance */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#675446] bg-[#F0E7DC] hover:bg-[#E6DCCF] border border-[#DDD0BF] cursor-pointer transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#675446] bg-[#F0E7DC] hover:bg-[#E6DCCF] border border-[#DDD0BF] cursor-pointer transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F4EDE2] border border-[#DFD3C3] mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#E8DCB] text-[#715440] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span>Code: {subject.code}</span>
              <span>·</span>
              <span>{isEnglishGrammar ? 'Standard NCERT Grammar Syllabus' : `${subject.stream || 'General'} Curriculum`}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#2F241C] tracking-tight">
              {subject.name} — Chapter Modules & Tests
            </h1>
            <p className="text-xs sm:text-sm text-[#705E4F] mt-1.5 font-medium max-w-2xl">
              {isEnglishGrammar
                ? 'Standard NCERT English Grammar concepts. Explore Parts of Speech, the 12 Tenses (Present, Past, Future), Voice, Speech, Modals, Determiners, Clauses & Concord.'
                : 'Click any full-width chapter bar below to expand diagnostic assessments, chapter quizzes, and comprehensive mock tests.'}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/70 px-4 py-3 rounded-2xl border border-[#DDD0BF] shrink-0 self-start sm:self-auto">
            <div className="text-center px-2">
              <span className="block text-xl font-heading font-black text-[#2F241C]">
                {subject.topics.length}
              </span>
              <span className="text-[11px] font-semibold text-[#8C7A6B]">Topics</span>
            </div>
            <div className="w-[1px] h-8 bg-[#E3D6C5]" />
            <div className="text-center px-2">
              <span className="block text-xl font-heading font-black text-[#D46244]">
                {isEnglishGrammar ? '24+ Tests' : `${subject.topics.reduce((acc, t) => acc + t.tests.length, 0)} Tests`}
              </span>
              <span className="text-[11px] font-semibold text-[#8C7A6B]">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* View 3: Topics List (Full-Width Accordions stretching left-to-right) */}
      <div className="space-y-4 w-full">
        {subject.topics.map((topic) => {
          const isExpanded = expandedTopicIds.includes(topic.id);
          const hasSubTopics = topic.subTopics && topic.subTopics.length > 0;

          // Filter subtopics if category filter is active
          const filteredSubTopics = hasSubTopics
            ? topic.subTopics!.filter((st) =>
                tenseFilter === 'All' ? true : st.tenseCategory === tenseFilter
              )
            : [];

          return (
            <div
              key={topic.id}
              className={`
                w-full rounded-2xl border transition-all duration-200 overflow-hidden
                ${
                  isExpanded
                    ? 'border-[#CBB79F] shadow-md bg-[#FAF6F0]'
                    : 'border-[#E2D5C4] hover:border-[#D0C0AC] bg-[#F7F1E8] shadow-xs'
                }
              `}
            >
              {/* Full-Width Clickable Accordion Bar (Warm Beige/Brown Aesthetic) */}
              <button
                onClick={() => toggleAccordion(topic.id)}
                className={`
                  w-full px-5 sm:px-7 py-4.5 sm:py-5 text-left cursor-pointer
                  flex items-center justify-between gap-4
                  transition-colors duration-150
                  ${
                    isExpanded
                      ? 'bg-[#EFE5D8] hover:bg-[#EBDDCF]'
                      : 'bg-[#F4ECE1] hover:bg-[#EFE5D8]'
                  }
                `}
                aria-expanded={isExpanded}
              >
                {/* Left Side: Chapter Number & Title */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  <span className="shrink-0 px-3 py-1.5 rounded-xl bg-[#E2D4C2] text-[#4A3728] font-heading font-extrabold text-xs sm:text-sm tracking-tight border border-[#D5C4AF]">
                    Chapter {topic.chapterNumber}
                  </span>

                  <div className="min-w-0">
                    <h2 className="font-heading font-bold text-base sm:text-lg text-[#2F241C] tracking-tight truncate flex items-center gap-2">
                      <span>{topic.title}</span>
                      {hasSubTopics && (
                        <span className="hidden sm:inline-flex text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#D46244] text-white">
                          All 12 Tenses
                        </span>
                      )}
                      {disabledTopics[topic.id] === false && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Disabled by Admin</span>
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-[#7A6858] font-medium hidden sm:block truncate mt-0.5">
                      {topic.summary}
                    </p>
                  </div>
                </div>

                {/* Right Side: Tests Count & Animated Chevron Indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/80 text-[#543F30] text-xs font-bold border border-[#DDD0BF]">
                    <Zap className="w-3.5 h-3.5 text-[#D46244]" />
                    <span>
                      {hasSubTopics ? '24 Tense Tests (2 per Tense)' : `${topic.tests.length} Tests Ready`}
                    </span>
                  </span>

                  <div
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                      ${
                        isExpanded
                          ? 'bg-[#4A3728] text-white shadow-xs'
                          : 'bg-[#E6D9C8] text-[#4A3728] hover:bg-[#DFD0BE]'
                      }
                    `}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Accordion Expanded Content */}
              {isExpanded && (
                <div className="px-5 sm:px-7 py-6 border-t border-[#DFD1BF] bg-[#FDFBF7]">
                  {/* Summary & Key Concepts Sub-section */}
                  <div className="mb-6 p-4 rounded-xl bg-[#F5EDE1]/70 border border-[#E4D7C5]">
                    <div className="flex items-start gap-2.5">
                      <BookMarked className="w-4 h-4 text-[#8C5D3B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A5B45]">
                          Chapter Overview & Key Concepts
                        </h4>
                        <p className="text-xs sm:text-sm text-[#4E3D31] font-medium mt-1">
                          {topic.summary}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                        {topic.keyConcepts?.map((concept, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white border border-[#E2D5C4] text-[#5C483A]"
                            >
                              • {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SPECIAL NESTED DROPDOWN FOR TENSES: ALL 12 TENSES ACROSS PRESENT, PAST, FUTURE */}
                  {hasSubTopics ? (
                    <div className="space-y-6">
                      {/* Tenses Banner and Category Filter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC8] pb-4">
                        <div>
                          <h3 className="text-base font-heading font-extrabold text-[#2F241C] flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[#D46244]" />
                            <span>Nested Tenses Curriculum: All 12 Tenses (Present, Past & Future)</span>
                          </h3>
                          <p className="text-xs text-[#7A6858] font-medium mt-0.5">
                            Click any of the 12 tenses below to access exactly 2 comprehensive tests (10 Questions each: Error Detection & Fill-in-the-Blanks).
                          </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1.5 p-1 bg-[#EFE5D8] rounded-xl border border-[#DFD3C2] self-start sm:self-auto">
                          {(['All', 'Present', 'Past', 'Future'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setTenseFilter(cat)}
                              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                tenseFilter === cat
                                  ? 'bg-white text-[#2F241C] shadow-xs'
                                  : 'text-[#6C5747] hover:text-[#2F241C]'
                              }`}
                            >
                              {cat} {cat === 'All' ? '(12)' : '(4)'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stacked Nested Accordions for all 12 Tenses */}
                      <div className="space-y-3.5">
                        {filteredSubTopics.map((subTopic: NestedSubTopic) => {
                          const isSubExpanded = expandedSubTopicIds.includes(subTopic.id);

                          return (
                            <div
                              key={subTopic.id}
                              className={`
                                rounded-xl border transition-all duration-150 overflow-hidden
                                ${
                                  isSubExpanded
                                    ? 'border-[#D46244]/40 bg-[#FAF7F2] shadow-xs'
                                    : 'border-[#E2D5C4] bg-white hover:border-[#D5C5B0]'
                                }
                              `}
                            >
                              {/* Clickable Sub-Topic Bar */}
                              <button
                                onClick={() => toggleSubAccordion(subTopic.id)}
                                className={`
                                  w-full px-4 sm:px-5 py-3.5 text-left cursor-pointer flex items-center justify-between gap-3
                                  ${isSubExpanded ? 'bg-[#F6EFE6]' : 'hover:bg-[#FAF6F0]'}
                                `}
                                aria-expanded={isSubExpanded}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                                      subTopic.tenseCategory === 'Present'
                                        ? 'bg-[#E0F2FE] text-[#0369A1]'
                                        : subTopic.tenseCategory === 'Past'
                                        ? 'bg-[#FEF3C7] text-[#92400E]'
                                        : 'bg-[#F3E8FF] text-[#6B21A8]'
                                    }`}
                                  >
                                    {subTopic.tenseCategory}
                                  </span>

                                  <div className="min-w-0">
                                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#2F241C] truncate">
                                      {subTopic.name}
                                    </h4>
                                    <p className="text-[11px] font-mono font-semibold text-[#8C7A6B] truncate">
                                      {subTopic.formula}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0">
                                  <span className="text-[11px] font-bold text-[#564335] bg-white px-2 py-0.5 rounded border border-[#E3D6C5] hidden sm:inline-block">
                                    2 Tests Available
                                  </span>
                                  <div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center text-[#4A3728]">
                                    {isSubExpanded ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>
                              </button>

                              {/* Nested Sub-Topic Tests Area (revealing exactly 2 tests) */}
                              {isSubExpanded && (
                                <div className="p-4 sm:p-5 border-t border-[#E8DFC8] bg-white space-y-4 animate-in fade-in duration-150">
                                  <div className="p-3 rounded-lg bg-[#FAF5EE] border border-[#EBDDCF] text-xs text-[#523E30] flex items-center justify-between">
                                    <span>
                                      <strong>Rule / Structure:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#D46244] font-bold">{subTopic.formula}</code>
                                    </span>
                                    <span className="text-[#8C7A6B] hidden md:inline">
                                      {subTopic.summary}
                                    </span>
                                  </div>

                                  {/* The Exactly 2 Clickable Tests for each Tense */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {subTopic.tests.map((test) => (
                                      <div
                                        key={test.id}
                                        className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E4D8C8] shadow-2xs hover:border-[#D46244]/50 hover:shadow-xs transition-all flex flex-col justify-between"
                                      >
                                        <div>
                                          <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFE5D8] text-[#5C4535]">
                                              {test.badge}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32]">
                                              10 Questions
                                            </span>
                                          </div>

                                          <h5 className="font-heading font-bold text-sm sm:text-base text-[#2E231C]">
                                            {test.title}
                                          </h5>

                                          <div className="mt-2 flex items-center gap-3 text-xs text-[#7B6A5C] font-semibold">
                                            <div className="flex items-center gap-1">
                                              <HelpCircle className="w-3.5 h-3.5 text-[#A08E7F]" />
                                              <span>{test.questionsCount} MCQs</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Clock className="w-3.5 h-3.5 text-[#A08E7F]" />
                                              <span>{test.durationMinutes} Mins</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Award className="w-3.5 h-3.5 text-[#A08E7F]" />
                                              <span>{test.marks} Marks</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-[#EDE3D6] flex items-center justify-between">
                                          <span className="text-[11px] text-[#8C7A6B] font-medium">
                                            Auto-Scroll Question UI
                                          </span>

                                          {disabledTests[test.id] === false && !isAdmin ? (
                                            <button
                                              disabled
                                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide bg-slate-200 text-slate-500 cursor-not-allowed select-none opacity-60"
                                            >
                                              <Lock className="w-3 h-3" />
                                              <span>Disabled by Admin</span>
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleTestClick(topic, test)}
                                              className={`
                                                inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer shadow-xs hover:shadow-sm
                                                ${
                                                  disabledTests[test.id] === false && isAdmin
                                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                    : isLoggedIn
                                                    ? 'bg-[#D46244] hover:bg-[#C25538] text-white'
                                                    : 'bg-[#4A3728] hover:bg-[#3D2C1E] text-white'
                                                }
                                              `}
                                            >
                                              {disabledTests[test.id] === false && isAdmin ? (
                                                <>
                                                  <Play className="w-3 h-3 fill-white" />
                                                  <span>Disabled (Admin)</span>
                                                </>
                                              ) : isLoggedIn ? (
                                                <>
                                                  <Play className="w-3 h-3 fill-white" />
                                                  <span>Start Test</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Lock className="w-3 h-3" />
                                                  <span>Login to Start</span>
                                                </>
                                              )}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Standard Non-Tenses Chapter Tests List */
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-heading font-extrabold text-[#32261E] tracking-tight uppercase">
                          Available Chapter Tests & Quizzes ({topic.tests.length})
                        </h3>
                        <span className="text-xs font-medium text-[#8C7A6B]">
                          Timed assessments with instant explanations
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {topic.tests.map((test) => (
                          <div
                            key={test.id}
                            className="p-4 rounded-2xl bg-white border border-[#E4D8C8] shadow-xs hover:border-[#D46244]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3ECE1] text-[#694F3B] border border-[#E2D5C3]">
                                  {test.badge}
                                </span>
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                    test.difficulty === 'Easy'
                                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                      : test.difficulty === 'Medium'
                                      ? 'bg-[#FFF8E1] text-[#F57F17]'
                                      : 'bg-[#FFEBEE] text-[#C62828]'
                                  }`}
                                >
                                  {test.difficulty}
                                </span>
                              </div>

                              <h4 className="font-heading font-bold text-base text-[#2E231C]">
                                {test.title}
                              </h4>

                              <div className="mt-2.5 flex items-center gap-4 text-xs text-[#7B6A5C] font-semibold">
                                <div className="flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-[#A08E7F]" />
                                  <span>{test.questionsCount} MCQs</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-[#A08E7F]" />
                                  <span>{test.durationMinutes} Mins</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Award className="w-3.5 h-3.5 text-[#A08E7F]" />
                                  <span>{test.marks} Marks</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#F1E9DE] flex items-center justify-between">
                              <span className="text-[11px] text-[#8C7A6B] font-medium">
                                Immediate Score & Solution
                              </span>

                              {disabledTests[test.id] === false && !isAdmin ? (
                                <button
                                  disabled
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide bg-slate-200 text-slate-500 cursor-not-allowed select-none opacity-60"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Disabled by Admin</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleTestClick(topic, test)}
                                  className={`
                                    inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm
                                    ${
                                      disabledTests[test.id] === false && isAdmin
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                        : isLoggedIn
                                        ? 'bg-[#D46244] hover:bg-[#C25538] active:bg-[#B3492F] text-white'
                                        : 'bg-[#4A3728] hover:bg-[#3D2C1E] active:bg-[#322317] text-white'
                                    }
                                  `}
                                >
                                  {disabledTests[test.id] === false && isAdmin ? (
                                    <>
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>Disabled (Admin)</span>
                                    </>
                                  ) : isLoggedIn ? (
                                    <>
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>Start Test</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Login to Start</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
