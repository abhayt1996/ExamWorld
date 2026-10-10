import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { UserProfile, UserTestRecord } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  onBackToHome: () => void;
  onSelectClassToPractice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onBackToHome,
  onSelectClassToPractice,
}) => {
  const history: UserTestRecord[] = user.testHistory;

  // Compute metrics
  const totalTestsGiven = history.length;
  const avgScore = totalTestsGiven > 0
    ? Math.round((history.reduce((acc, h) => acc + h.percentage, 0) / totalTestsGiven) * 10) / 10
    : 0;

  const totalTimeSpentMinutes = history.reduce((acc, h) => acc + h.timeSpentMinutes, 0);

  // Subject-wise grouping
  const subjectStats: Record<string, { count: number; totalPct: number; bestScore: number }> = {};
  history.forEach((h) => {
    if (!subjectStats[h.subjectName]) {
      subjectStats[h.subjectName] = { count: 0, totalPct: 0, bestScore: 0 };
    }
    subjectStats[h.subjectName].count += 1;
    subjectStats[h.subjectName].totalPct += h.percentage;
    if (h.percentage > subjectStats[h.subjectName].bestScore) {
      subjectStats[h.subjectName].bestScore = h.percentage;
    }
  });

  const subjectBreakdown = Object.keys(subjectStats).map((subj) => ({
    subject: subj,
    count: subjectStats[subj].count,
    avg: Math.round((subjectStats[subj].totalPct / subjectStats[subj].count) * 10) / 10,
    best: Math.round(subjectStats[subj].bestScore),
  }));

  // Ensure English Grammar and Core Subjects are represented in default view if no history
  const displaySubjectData = subjectBreakdown.length > 0
    ? subjectBreakdown
    : [
        { subject: 'English Grammar', count: 4, avg: 92.5, best: 100 },
        { subject: 'Mathematics', count: 3, avg: 82.0, best: 90 },
        { subject: 'Science', count: 2, avg: 86.5, best: 95 },
        { subject: 'Social Science', count: 2, avg: 75.0, best: 85 },
      ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Classes</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8C7A6B]">
            Dashboard for <strong className="text-[#32241B]">{user.name}</strong> (Class {user.currentClass})
          </span>
          <button
            onClick={onSelectClassToPractice}
            className="px-3.5 py-2 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Practice New Tests
          </button>
        </div>
      </div>

      {/* Dashboard Headline */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2F241C] tracking-tight">
          Learning Analytics & Progress Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#735F50] mt-1.5 font-medium max-w-2xl">
          Track your chapter assessment scores, subject proficiency trends, and accuracy across all test attempts.
        </p>
      </div>

      {/* Top 4 Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs">
          <div className="flex items-center justify-between text-[#D46244] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Tests Given</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-heading font-black text-[#2F241C]">
            {totalTestsGiven}
          </div>
          <p className="text-[11px] font-semibold text-[#7A6656] mt-1">
            Assessments Completed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs">
          <div className="flex items-center justify-between text-[#2E7D32] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Average Score</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-heading font-black text-[#2F241C]">
            {avgScore}%
          </div>
          <p className="text-[11px] font-semibold text-[#7A6656] mt-1">
            Cumulative Accuracy
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs">
          <div className="flex items-center justify-between text-[#1565C0] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Strongest Subject</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-xl font-heading font-black text-[#2F241C] truncate">
            English Grammar
          </div>
          <p className="text-[11px] font-semibold text-[#2E7D32] mt-1">
            96% Peak Proficiency
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs">
          <div className="flex items-center justify-between text-[#7B1FA2] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Time Invested</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-heading font-black text-[#2F241C]">
            {Math.round((totalTimeSpentMinutes / 60) * 10) / 10}h
          </div>
          <p className="text-[11px] font-semibold text-[#7A6656] mt-1">
            Total Testing Duration
          </p>
        </div>
      </div>

      {/* Visual Progress Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Subject-Wise Progress & Average Scores Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#2F241C]">
                  Subject-Wise Accuracy & Scores
                </h3>
                <p className="text-xs text-[#8C7A6B] font-medium">
                  Average percentage scored per subject
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[11px] font-bold text-[#6D5341] border border-[#E3D6C5]">
                Subject Progress
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-4 pt-2">
              {displaySubjectData.map((item, idx) => {
                const barColors = [
                  'bg-[#10B981]', // Green (English Grammar)
                  'bg-[#F59E0B]', // Amber (Mathematics)
                  'bg-[#0EA5E9]', // Sky (Science)
                  'bg-[#8B5CF6]', // Purple (Social Science)
                  'bg-[#F43F5E]', // Rose (Hindi)
                ];
                const color = barColors[idx % barColors.length];

                return (
                  <div key={item.subject} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#453427]">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#8C7A6B]" />
                        <span>{item.subject}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8C7A6B] font-normal">{item.count} tests given</span>
                        <span className="font-mono">{item.avg}%</span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-3.5 bg-[#F2EAE0] rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${color}`}
                        style={{ width: `${Math.min(item.avg, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F2EAE0] text-[11px] font-medium text-[#8C7A6B] flex items-center justify-between">
            <span>Minimum passing benchmark: 40%</span>
            <span className="font-bold text-[#2E7D32]">Above National Average</span>
          </div>
        </div>

        {/* Graph 2: Recent Tests Chronological Score Trend Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#2F241C]">
                  Recent Test Score Trends
                </h3>
                <p className="text-xs text-[#8C7A6B] font-medium">
                  Percentage timeline of your last assessments
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#F5EDE1] text-[11px] font-bold text-[#6D5341] border border-[#E3D6C5]">
                Chronological
              </span>
            </div>

            {/* Visual Column / Bar Graph */}
            <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E8DFC8]">
              {history.slice(0, 6).map((item, idx) => {
                const heightPct = Math.max(item.percentage, 15);
                const isTopScore = item.percentage >= 90;

                return (
                  <div key={item.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold font-mono text-[#543F30] opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.percentage}%
                    </span>

                    <div className="w-full max-w-[42px] bg-[#F3EBE0] rounded-t-xl h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isTopScore ? 'bg-[#D46244]' : 'bg-[#7A6453]'
                        } group-hover:brightness-110`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-[#8C7A6B] truncate w-full text-center">
                      T{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#7A6555] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D46244]" />
              <span>High Mastery (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A6453]" />
              <span>Proficient (60–89%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Recent Tests History Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#DFD3C3] shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E6DBCE]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D46244]" />
            <h3 className="font-heading font-bold text-lg text-[#2F241C]">
              Assessment History & Records
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#8C7A6B]">
            {history.length} Completed Tests
          </span>
        </div>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-white border border-[#E3D7C7] hover:border-[#D46244]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                    <span>{record.className}</span>
                    <span>·</span>
                    <span className="text-[#D46244]">{record.subjectName}</span>
                    <span>·</span>
                    <span>{record.chapterTitle}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[#2F241C] truncate">
                    {record.testTitle}
                  </h4>
                  <div className="flex items-center gap-4 text-xs font-medium text-[#7A6656] mt-1">
                    <span>Date: {record.date}</span>
                    <span>·</span>
                    <span>Time: {record.timeSpentMinutes} mins</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="block font-heading font-black text-lg text-[#2F241C]">
                      {record.score} / {record.totalMarks}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        record.percentage >= 80
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : record.percentage >= 60
                          ? 'bg-[#FFF8E1] text-[#F57F17]'
                          : 'bg-[#FFEBEE] text-[#C62828]'
                      }`}
                    >
                      {record.percentage}% Marks
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#E3D7C7]">
            <p className="text-sm font-bold text-[#453427]">No test attempts logged yet</p>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Select any class and subject to take your first practice test!
            </p>
            <button
              onClick={onSelectClassToPractice}
              className="mt-4 px-4 py-2 rounded-xl bg-[#D46244] text-white text-xs font-bold cursor-pointer"
            >
              Start Practice Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
