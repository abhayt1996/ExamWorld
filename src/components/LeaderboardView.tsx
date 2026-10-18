import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  X,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { UserProfile, ClassLevel, LeaderboardEntry, UserTestRecord } from '../types';
import { getLiveLeaderboard, getStudentHistory } from '../services/curriculumApi';

interface LeaderboardViewProps {
  currentUser: UserProfile | null;
  onBackToDashboard: () => void;
  onSelectClassToPractice?: () => void;
}

type TimeRangeOption = 'week' | 'last_week' | '24h' | '1h' | 'month' | 'all';
type SortField = 'date' | 'testTitle' | 'subjectName' | 'percentage' | 'totalTimeSpentSeconds';
type SortDirection = 'asc' | 'desc';

const TIME_RANGE_LABELS: { id: TimeRangeOption; label: string }[] = [
  { id: 'week', label: 'This Week (Sun–Sat)' },
  { id: 'last_week', label: 'Last Week' },
  { id: '24h', label: 'Last 24 Hours' },
  { id: '1h', label: 'Last 1 Hour' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All-Time' },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  onBackToDashboard,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<ClassLevel | 'All'>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeOption>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [rankedEntries, setRankedEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Student History Modal State
  const [viewingStudentHistory, setViewingStudentHistory] = useState<LeaderboardEntry | null>(null);
  const [studentHistoryData, setStudentHistoryData] = useState<UserTestRecord[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const isAdmin = currentUser?.role === 'admin';

  // Helper to show the current Sunday 12:00 AM – Saturday 11:59 PM date window
  const getCurrentWeekWindowText = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    const fmt = (d: Date) =>
      d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `Sun, ${fmt(sunday)} (12:00 AM) – Sat, ${fmt(saturday)} (11:59 PM)`;
  };

  // Fetch live calculated leaderboard
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getLiveLeaderboard(selectedClassFilter, selectedTimeRange)
      .then((data) => {
        if (!isMounted) return;
        const mapped = data.map((entry: LeaderboardEntry, idx: number) => ({
          ...entry,
          rank: idx + 1,
          isCurrentUser: Boolean(
            currentUser &&
              (entry.id === currentUser.id ||
                (currentUser.username &&
                  entry.username &&
                  entry.username.toLowerCase() === currentUser.username.toLowerCase()) ||
                (entry.name &&
                  currentUser.name &&
                  entry.name.toLowerCase() === currentUser.name.toLowerCase()))
          ),
        }));
        setRankedEntries(mapped);
      })
      .catch((err) => {
        console.warn('[Leaderboard] Live fetch warning:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedClassFilter, selectedTimeRange, currentUser]);

  // Apply search filter
  const filteredEntries = rankedEntries.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Current student rank
  const currentUserEntry = rankedEntries.find((e) => e.isCurrentUser);

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs shadow-2xs">
          <span>🥇</span>
          <span>1st</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-xs shadow-2xs">
          <span>🥈</span>
          <span>2nd</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-700/10 text-amber-800 border border-amber-600/30 font-extrabold text-xs shadow-2xs">
          <span>🥉</span>
          <span>3rd</span>
        </span>
      );
    }
    return (
      <span className="font-heading font-bold text-sm text-[#735F50] px-2 py-0.5 rounded-md bg-[#FAF4ED]">
        #{rank}
      </span>
    );
  };

  // Click Handler for Admin to view student history
  const handleStudentClick = async (student: LeaderboardEntry) => {
    if (!isAdmin) return;
    setViewingStudentHistory(student);
    setIsHistoryLoading(true);
    try {
      const response = await getStudentHistory(student.id);
      if (response.success && response.data) {
        setStudentHistoryData(response.data);
      }
    } catch (err) {
      console.warn("Failed to fetch student history", err);
      setStudentHistoryData([]);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedHistory = useMemo(() => {
    return [...studentHistoryData].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle custom string date sorting loosely by assuming 'date' strings might need parsing if they aren't 'Just now'
      if (sortField === 'date') {
         aVal = new Date(a.date).getTime() || 0;
         bVal = new Date(b.date).getTime() || 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [studentHistoryData, sortField, sortDirection]);

  // Group to count test attempts
  const testAttemptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    studentHistoryData.forEach(record => {
      counts[record.testId] = (counts[record.testId] || 0) + 1;
    });
    return counts;
  }, [studentHistoryData]);


  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {selectedTimeRange === 'week' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Weekly Reset Window: {getCurrentWeekWindowText()}</span>
            </span>
          )}
          <span className="text-xs font-bold text-[#7A6858] bg-[#F4ECE1] px-3 py-1.5 rounded-xl border border-[#E3D6C5]">
            Metric: Total Score (High) · Tie-Breaker: Time Spent (Low)
          </span>
        </div>
      </div>

      {/* Hero Podium Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D231B] via-[#3E2F23] to-[#1E1712] text-white p-6 sm:p-10 shadow-lg border border-[#523F31]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D46244]/20 border border-[#D46244]/40 text-[#FFA085] text-xs font-bold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>
              {selectedTimeRange === 'week'
                ? 'Weekly Scholastic Leaderboard (Resets Every Sunday 12:00 AM)'
                : 'All-India Scholastic Leaderboard'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-[#FAF4ED]">
            Student Performance Rankings
          </h1>
          <p className="text-sm text-[#DDD0BF] font-medium mt-2 leading-relaxed">
            Points are counted freshly every week from Sunday 12:00 AM to Saturday 11:59 PM. {isAdmin ? "As an admin, click on any student's name below to view their full assessment history." : "All historical points remain safely stored in student profiles and All-Time rankings."}
          </p>

          {/* Current Student's Rank Callout Card */}
          {currentUser && currentUserEntry && (
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 inline-flex flex-wrap items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D46244] text-white font-heading font-bold flex items-center justify-center">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <span className="font-bold text-white block">{currentUser.name}</span>
                  <span className="text-[#DDD0BF]">Class {currentUser.currentClass}</span>
                </div>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div>
                <span className="text-[#FFA085] font-bold block">Current Standing</span>
                <span className="font-heading font-black text-sm text-white">
                  Rank #{currentUserEntry.rank} of {rankedEntries.length}
                </span>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div>
                <span className="text-[#FFA085] font-bold block">Points Earned</span>
                <span className="font-heading font-black text-sm text-white">
                  {currentUserEntry.totalScore} pts
                </span>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div>
                <span className="text-[#FFA085] font-bold block">Total Time</span>
                <span className="font-heading font-black text-sm text-white">
                  {formatDuration(currentUserEntry.totalTimeSpentSeconds)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {rankedEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {rankedEntries.slice(0, 3).map((topEntry, idx) => (
            <div
              key={topEntry.id}
              className={`p-5 rounded-3xl border-2 transition-all bg-white relative ${
                idx === 0
                  ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 to-white shadow-md'
                  : idx === 1
                  ? 'border-slate-300 bg-gradient-to-b from-slate-50/50 to-white shadow-xs'
                  : 'border-amber-600/30 bg-gradient-to-b from-amber-50/30 to-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FAF4ED] text-[#715440] border border-[#DDD0BF]">
                  Class {topEntry.className}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl ${topEntry.avatarColor} text-white font-heading font-bold text-base flex items-center justify-center shadow-xs`}
                >
                  {topEntry.name[0]}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#2F241C] flex items-center gap-1.5">
                    <span 
                      onClick={() => handleStudentClick(topEntry)}
                      className={isAdmin ? "cursor-pointer hover:text-[#D46244] underline decoration-[#DDD0BF] underline-offset-4 transition-colors" : ""}
                    >
                      {topEntry.name}
                    </span>
                    {topEntry.isCurrentUser && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#D46244] text-white font-extrabold">
                        YOU
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-[#7A6858] font-medium">
                    {topEntry.testsCompleted} Tests Completed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F0E6D8] text-xs">
                <div>
                  <span className="text-[#8C7A6B] block text-[11px] font-medium">Score</span>
                  <span className="font-heading font-black text-sm text-[#2E7D32]">
                    {topEntry.totalScore} Marks
                  </span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block text-[11px] font-medium">Time Taken</span>
                  <span className="font-heading font-bold text-sm text-[#544133]">
                    {formatDuration(topEntry.totalTimeSpentSeconds)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Bar: Timeline + Grade + Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs space-y-3">
        {/* Row 1: Timeline Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#F0E6D8] pb-3">
          <span className="text-xs font-bold text-[#7A6858] mr-1 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#D46244]" />
            <span>Timeline:</span>
          </span>
          {TIME_RANGE_LABELS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTimeRange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedTimeRange === item.id
                  ? 'bg-[#2F241C] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#695444] hover:bg-[#F2E8DC] border border-[#E8DFC8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Row 2: Class Standard Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-[#7A6858] mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#D46244]" />
              <span>Grade:</span>
            </span>
            {(['All', '6', '7', '8', '9', '10', '11', '12'] as (ClassLevel | 'All')[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClassFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedClassFilter === c
                    ? 'bg-[#D46244] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#695444] hover:bg-[#F2E8DC] border border-[#E8DFC8]'
                }`}
              >
                {c === 'All' ? 'All Classes' : `Class ${c}`}
              </button>
            ))}
          </div>

          {/* Search Candidate */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244]"
            />
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-[#DFD3C3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8DEC8] text-[#715440] font-heading font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Standard</th>
                <th className="py-3.5 px-4 text-center">Tests Taken</th>
                <th className="py-3.5 px-4 text-right">Total Score</th>
                <th className="py-3.5 px-4 text-right">Time Spent</th>
                <th className="py-3.5 px-4 text-center">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7A6858] font-semibold">
                    Loading leaderboard rankings...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7A6858]">
                    <p className="font-bold text-sm text-[#2F241C]">No test attempts recorded for this timeline & grade filter yet.</p>
                    <p className="text-xs mt-1">Switch to "All-Time" above to view complete historical rankings.</p>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((student) => {
                  const isUser = student.isCurrentUser;
                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isUser
                          ? 'bg-[#FFF8F0] font-bold hover:bg-[#FFF2E3]'
                          : 'hover:bg-[#FAF7F2]/60'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold">
                        {getRankBadge(student.rank || 0)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div 
                          className={`flex items-center gap-2.5 ${isAdmin ? 'cursor-pointer group' : ''}`}
                          onClick={() => handleStudentClick(student)}
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${student.avatarColor} text-white font-heading font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs group-hover:ring-2 ring-[#D46244]/30 transition-all`}
                          >
                            {student.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-heading font-bold text-sm ${isAdmin ? 'group-hover:text-[#D46244] underline decoration-transparent group-hover:decoration-[#D46244]/30 underline-offset-4 transition-colors' : 'text-[#2F241C]'}`}>
                                {student.name}
                              </span>
                              {isUser && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#D46244] text-white font-extrabold uppercase tracking-wider">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8C7A6B]">
                              Verified Candidate
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#FAF4ED] text-[#695444] border border-[#DDD0BF] font-bold text-xs">
                          Class {student.className}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-[#544133]">
                        {student.testsCompleted} tests
                      </td>

                      <td className="py-3.5 px-4 text-right font-heading font-black text-sm text-[#2E7D32]">
                        {student.totalScore} pts
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#564436]">
                        {formatDuration(student.totalTimeSpentSeconds)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {(student.rank || 0) <= 3 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                            Podium Elite
                          </span>
                        ) : (student.rank || 0) <= 10 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            Top 10 Scholar
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            Ranked Candidate
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT HISTORY MODAL (Admin Only) */}
      {viewingStudentHistory && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl">
            <div className="px-6 py-5 bg-white border-b border-[#E8DEC8] flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight">
                  {viewingStudentHistory.name}'s Assessment History
                </h3>
                <span className="text-xs font-medium text-[#8C7A6B]">
                  Complete log of all tests submitted across all subjects.
                </span>
              </div>
              <button
                onClick={() => setViewingStudentHistory(null)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isHistoryLoading ? (
                <div className="py-12 text-center text-[#7A6858] font-semibold text-sm">
                  Fetching complete student history...
                </div>
              ) : studentHistoryData.length === 0 ? (
                <div className="py-12 text-center text-[#7A6858] font-semibold text-sm">
                  No tests recorded for this student yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F2] border-b border-[#E8DFC8] text-[#715440] font-bold uppercase tracking-wider select-none">
                        <th className="py-3 px-4 cursor-pointer hover:bg-[#F2E8DC] transition-colors" onClick={() => handleSort('date')}>
                          <div className="flex items-center gap-1.5">Date <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="py-3 px-4 cursor-pointer hover:bg-[#F2E8DC] transition-colors" onClick={() => handleSort('subjectName')}>
                          <div className="flex items-center gap-1.5">Subject <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="py-3 px-4 cursor-pointer hover:bg-[#F2E8DC] transition-colors" onClick={() => handleSort('testTitle')}>
                          <div className="flex items-center gap-1.5">Test Name <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="py-3 px-4 text-center cursor-pointer hover:bg-[#F2E8DC] transition-colors" onClick={() => handleSort('percentage')}>
                          <div className="flex items-center justify-center gap-1.5">Score <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="py-3 px-4 text-right cursor-pointer hover:bg-[#F2E8DC] transition-colors" onClick={() => handleSort('totalTimeSpentSeconds')}>
                          <div className="flex items-center justify-end gap-1.5">Time Spent <ArrowUpDown className="w-3 h-3" /></div>
                        </th>
                        <th className="py-3 px-4 text-center">Attempts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0E6D8]">
                      {sortedHistory.map((record) => (
                        <tr key={record.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3 px-4 font-medium text-[#544133] whitespace-nowrap">{record.date}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#EFE5D8] text-[#4A392D] font-bold text-[10px] border border-[#DDD0BF]">
                              <BookOpen className="w-3 h-3" /> {record.subjectName}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#2F241C]">{record.testTitle}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold px-2 py-0.5 rounded-md ${
                                record.percentage >= 80 ? 'bg-emerald-50 text-emerald-700' :
                                record.percentage >= 60 ? 'bg-amber-50 text-amber-700' :
                                'bg-rose-50 text-rose-700'
                              }`}>
                              {record.percentage}% ({record.score}/{record.totalMarks})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-[#564436]">
                            {formatDuration(record.totalTimeSpentSeconds || record.timeSpentMinutes * 60)}
                          </td>
                          <td className="py-3 px-4 text-center text-[#7A6858] font-bold">
                            {testAttemptCounts[record.testId]}x
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
