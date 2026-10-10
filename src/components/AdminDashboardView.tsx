import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Layers,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  School,
  Lock,
  Unlock,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { UserProfile, ClassLevel, GradeStatusMap } from '../types';
import { CLASSES_LIST, MOCK_ENROLLED_STUDENTS } from '../data/curriculumData';

Chart.register(...registerables);

interface AdminDashboardViewProps {
  adminUser: UserProfile;
  gradeStatus: GradeStatusMap;
  onToggleGrade: (classId: ClassLevel) => void;
  onSetAllGrades: (enabled: boolean) => void;
  onBackToHome: () => void;
  onChangePasswordClick: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  gradeStatus,
  onToggleGrade,
  onSetAllGrades,
  onBackToHome,
  onChangePasswordClick,
}) => {
  // Live Analytics State - simulates dynamic real-time user count fluctuation
  const [liveUsersCount, setLiveUsersCount] = useState<number>(1482);
  const [activeSessions, setActiveSessions] = useState<number>(341);
  const [todaySubmissions, setTodaySubmissions] = useState<number>(4918);

  const classBarChartRef = useRef<HTMLCanvasElement>(null);
  const subjectChartRef = useRef<HTMLCanvasElement>(null);

  const classChartInstance = useRef<Chart | null>(null);
  const subjectChartInstance = useRef<Chart | null>(null);

  // Dynamic live user counter ticking every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsersCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(1200, prev + delta);
      });
      setActiveSessions((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(250, prev + delta);
      });
      setTodaySubmissions((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Initialize Chart.js Graphs
  useEffect(() => {
    // 1. Class Performance Chart
    if (classBarChartRef.current) {
      if (classChartInstance.current) {
        classChartInstance.current.destroy();
      }

      classChartInstance.current = new Chart(classBarChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
          datasets: [
            {
              label: 'Average Score (%)',
              data: [82.4, 79.8, 81.5, 76.2, 86.8, 74.5, 89.2],
              backgroundColor: '#D46244',
              borderRadius: 8,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Avg Score: ${ctx.parsed.y}%`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (val) => `${val}%`,
                font: { family: 'Plus Jakarta Sans', size: 11 },
              },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            x: {
              ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } },
              grid: { display: false },
            },
          },
        },
      });
    }

    // 2. Subject Test Completion Chart
    if (subjectChartRef.current) {
      if (subjectChartInstance.current) {
        subjectChartInstance.current.destroy();
      }

      subjectChartInstance.current = new Chart(subjectChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['English Grammar', 'Mathematics', 'Science', 'Social Science', 'Languages'],
          datasets: [
            {
              data: [1420, 1180, 990, 750, 578],
              backgroundColor: ['#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6', '#F43F5E'],
              borderWidth: 2,
              borderColor: '#FAF7F2',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Plus Jakarta Sans', size: 11 },
                boxWidth: 12,
              },
            },
          },
        },
      });
    }

    return () => {
      if (classChartInstance.current) classChartInstance.current.destroy();
      if (subjectChartInstance.current) subjectChartInstance.current.destroy();
    };
  }, []);

  const totalEnabled = Object.values(gradeStatus).filter(Boolean).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Admin Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Classes (Preview Student View)</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Mode (abt1996)</span>
          </div>

          <button
            onClick={onChangePasswordClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#DDD0BF] text-xs font-bold text-[#334155] hover:bg-[#FAF4ED] cursor-pointer shadow-2xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#D46244]" />
            <span>Change Admin Password</span>
          </button>
        </div>
      </div>

      {/* Header Headline */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2F241C] tracking-tight flex items-center gap-3">
          <span>Administrator Control Panel</span>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-[#E2E8F0] text-[#334155] border border-[#CBD5E1]">
            examworld.site
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#735F50] mt-1.5 font-medium max-w-2xl">
          Manage grade availability, view simulated real-time active student traffic, and analyze student test scores with Chart.js.
        </p>
      </div>

      {/* SECTION 2: LIVE ANALYTICS (Prominent Dynamic Real-time Counter) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] text-white shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Live Analytics & Active Telemetry
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Auto-updating every 2.5s
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Live Counter Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Active Users / Live Now
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                <span className="tabular-nums font-mono">{liveUsersCount.toLocaleString()}</span>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-normal">online</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated live active concurrent learners</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Active Quiz Sessions
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-[#38BDF8] tracking-tight mt-1">
                <span className="tabular-nums font-mono">{activeSessions}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Students actively solving MCQs right now
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Tests Submitted Today
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-[#F59E0B] tracking-tight mt-1">
                <span className="tabular-nums font-mono">{todaySubmissions.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Total graded assessments recorded today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: GRADE MANAGEMENT (Toggles for Classes 6 to 12) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DFD3C3] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE1D3] mb-6">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-[#2F241C] flex items-center gap-2">
              <School className="w-5 h-5 text-[#D46244]" />
              <span>Grade Availability Management</span>
            </h2>
            <p className="text-xs text-[#7A6656] font-medium mt-0.5">
              Independently enable or disable classes. Disabled classes will be greyed out and unclickable for students on the Home Page.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onSetAllGrades(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] hover:bg-[#C8E6C9] cursor-pointer"
            >
              Enable All (7)
            </button>
            <button
              onClick={() => onSetAllGrades(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] hover:bg-[#FFCDD2] cursor-pointer"
            >
              Lock All
            </button>
          </div>
        </div>

        {/* Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CLASSES_LIST.map((cls) => {
            const isEnabled = gradeStatus[cls.id] ?? true;

            return (
              <div
                key={cls.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isEnabled
                    ? 'bg-[#FAF7F2] border-[#E3D6C5]'
                    : 'bg-slate-50 border-slate-300 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl font-heading font-black text-lg flex items-center justify-center ${
                      isEnabled
                        ? 'bg-[#D46244] text-white shadow-xs'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {cls.id}
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#2F241C]">
                      {cls.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isEnabled
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isEnabled ? 'Active / Visible' : 'Disabled / Greyed'}
                    </span>
                  </div>
                </div>

                {/* Switch Toggle Button */}
                <button
                  onClick={() => onToggleGrade(cls.id)}
                  className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                    isEnabled
                      ? 'bg-[#2E7D32] text-white border-[#1B5E20]'
                      : 'bg-slate-200 text-slate-500 border-slate-300'
                  }`}
                  title={isEnabled ? `Disable ${cls.name}` : `Enable ${cls.name}`}
                  aria-label={`Toggle ${cls.name}`}
                >
                  {isEnabled ? (
                    <Unlock className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-[#FAF5EE] border border-[#E9DFC8] text-xs text-[#7A6453] flex items-center justify-between">
          <span>
            Current Status: <strong>{totalEnabled} of 7</strong> Grades Enabled for Student Access.
          </span>
          <button
            onClick={onBackToHome}
            className="text-[#D46244] font-bold hover:underline cursor-pointer"
          >
            Check Home Page Preview →
          </button>
        </div>
      </div>

      {/* SECTION 3: STUDENT PERFORMANCE & CHART.JS VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart.js Graph 1: Class-wise Performance Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#2F241C] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#D46244]" />
                  <span>Student Performance by Grade (Chart.js)</span>
                </h3>
                <p className="text-xs text-[#8C7A6B] font-medium">
                  Average overall score percentage across Classes 6 through 12
                </p>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#F4ECE1] text-[#634937]">
                Live Chart.js Canvas
              </span>
            </div>

            <div className="h-64 w-full">
              <canvas ref={classBarChartRef} />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E6D8] text-[11px] text-[#8C7A6B] flex items-center justify-between">
            <span>Aggregated across enrolled students</span>
            <span className="font-bold text-[#2E7D32]">Highest: Class 12 (89.2%)</span>
          </div>
        </div>

        {/* Chart.js Graph 2: Subject-wise Test Volume Doughnut Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-bold text-base text-[#2F241C]">
                Submissions by Subject
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32]">
                4,918 Tests
              </span>
            </div>
            <p className="text-xs text-[#8C7A6B] font-medium mb-3">
              Distribution of tests taken
            </p>

            <div className="h-60 w-full relative">
              <canvas ref={subjectChartRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DFD3C3] shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E6DBCE]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D46244]" />
            <h3 className="font-heading font-bold text-lg text-[#2F241C]">
              Enrolled Students Directory & Completion Rates
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#8C7A6B]">
            Showing 8 Active Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DFC8] text-[#8C7A6B] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Mobile</th>
                <th className="py-3 px-3 text-center">Tests Completed</th>
                <th className="py-3 px-3 text-center">Average Score</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E9DE]">
              {MOCK_ENROLLED_STUDENTS.map((st) => (
                <tr key={st.id} className="hover:bg-[#FAF6F0] transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[#2F241C]">
                    {st.name}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#5C4535]">
                    Class {st.className}
                  </td>
                  <td className="py-3.5 px-3 text-[#7A6656] font-mono">
                    +91 {st.mobile}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-[#2F241C]">
                    {st.testsCompleted}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
                        st.averageScore >= 85
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : 'bg-[#FFF8E1] text-[#F57F17]'
                      }`}
                    >
                      {st.averageScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#8C7A6B]">
                    {st.lastActive}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
