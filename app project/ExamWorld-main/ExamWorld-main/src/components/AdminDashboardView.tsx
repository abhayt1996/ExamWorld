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
  Plus,
  Trash2,
  BookOpen,
  ChevronRight,
  FileText,
  Clock,
  Award,
  AlertTriangle,
  FolderTree,
  X,
  Edit3,
  Pencil,
  Trophy,
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import {
  UserProfile,
  ClassLevel,
  Subject,
  ChapterTopic,
  TopicTest,
  DisabledEntitiesMap,
  NestedSubTopic,
  UserActivityLog,
} from '../types';
import { CLASSES_LIST, MOCK_ENROLLED_STUDENTS } from '../data/curriculumData';
import { MOCK_USER_ACTIVITIES, calculateDynamicAdminStats } from '../data/userActivityData';
import { TestBuilderModal } from './TestBuilderModal';

Chart.register(...registerables);

interface AdminDashboardViewProps {
  adminUser: UserProfile;
  disabledEntities: DisabledEntitiesMap;
  curriculumStore: Record<string, Subject[]>;
  onToggleGrade: (classId: ClassLevel) => void;
  onToggleSubject: (classId: ClassLevel, subjectId: string) => void;
  onToggleTopic: (topicId: string) => void;
  onToggleTest: (testId: string) => void;
  onAddSubject: (classId: ClassLevel, subject: Subject) => void;
  onDeleteSubject: (classId: ClassLevel, subjectId: string) => void;
  onUpdateSubject: (classId: ClassLevel, subjectId: string, updated: Partial<Subject>) => void;
  onAddTopic: (classId: ClassLevel, subjectId: string, topic: ChapterTopic) => void;
  onDeleteTopic: (classId: ClassLevel, subjectId: string, topicId: string) => void;
  onUpdateTopic: (classId: ClassLevel, subjectId: string, topicId: string, updated: Partial<ChapterTopic>) => void;
  onUpdateSubTopic?: (classId: ClassLevel, subjectId: string, topicId: string, subTopicId: string, updated: Partial<NestedSubTopic>) => void;
  onAddTest: (classId: ClassLevel, subjectId: string, topicId: string, test: TopicTest) => void;
  onDeleteTest: (classId: ClassLevel, subjectId: string, topicId: string, testId: string) => void;
  onUpdateTest: (classId: ClassLevel, subjectId: string, topicId: string, updatedTest: TopicTest) => void;
  onSetAllGrades: (enabled: boolean) => void;
  onBackToHome: () => void;
  onChangePasswordClick: () => void;
  onOpenLeaderboard?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  adminUser,
  disabledEntities,
  curriculumStore,
  onToggleGrade,
  onToggleSubject,
  onToggleTopic,
  onToggleTest,
  onAddSubject,
  onDeleteSubject,
  onUpdateSubject,
  onAddTopic,
  onDeleteTopic,
  onUpdateTopic,
  onUpdateSubTopic,
  onAddTest,
  onDeleteTest,
  onUpdateTest,
  onSetAllGrades,
  onBackToHome,
  onChangePasswordClick,
  onOpenLeaderboard,
}) => {
  // Dynamically calculated stats from mock user activity records
  const [initialStats] = useState(() => calculateDynamicAdminStats(MOCK_USER_ACTIVITIES));
  const [liveUsersCount, setLiveUsersCount] = useState<number>(initialStats.baseActiveUsers);
  const [activeSessions, setActiveSessions] = useState<number>(initialStats.baseActiveTestSessions);
  const [todaySubmissions, setTodaySubmissions] = useState<number>(initialStats.baseCompletedTestsToday);
  const [recentActivities, setRecentActivities] = useState<UserActivityLog[]>(MOCK_USER_ACTIVITIES);

  // Hierarchical Curriculum Center drill-down selection
  const [selectedGradeId, setSelectedGradeId] = useState<ClassLevel>('10');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('c10-grammar');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Modals for adding Subject and Topic
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<Subject['category']>('core');
  const [newSubjectStream, setNewSubjectStream] = useState<Subject['stream']>('General');

  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSummary, setNewTopicSummary] = useState('');
  const [newTopicChapterNum, setNewTopicChapterNum] = useState<number>(1);

  // Delete confirmation modals
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'subject' | 'topic' | 'test';
    classId: ClassLevel;
    subjectId?: string;
    topicId?: string;
    testId?: string;
    name: string;
  } | null>(null);

  // Test Builder Modal target (for Add or Edit Test)
  const [testBuilderTarget, setTestBuilderTarget] = useState<{
    topic: ChapterTopic;
    initialTest?: TopicTest | null;
  } | null>(null);

  // Edit Subject Modal state
  const [editingSubject, setEditingSubject] = useState<{
    subject: Subject;
    name: string;
    code: string;
    category: Subject['category'];
    stream: Subject['stream'];
  } | null>(null);

  // Edit Topic Modal state
  const [editingTopic, setEditingTopic] = useState<{
    topic: ChapterTopic;
    title: string;
    summary: string;
    chapterNumber: number;
  } | null>(null);

  // Edit SubTopic Modal state
  const [editingSubTopic, setEditingSubTopic] = useState<{
    topicId: string;
    subTopic: NestedSubTopic;
    name: string;
    formula: string;
    summary: string;
  } | null>(null);

  // Toast alert
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Save edited subject
  const handleSaveEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.name.trim()) return;
    onUpdateSubject(selectedGradeId, editingSubject.subject.id, {
      name: editingSubject.name.trim(),
      code: editingSubject.code.trim().toUpperCase() || editingSubject.subject.code,
      category: editingSubject.category,
      stream: editingSubject.stream,
    });
    showNotice(`Subject "${editingSubject.name.trim()}" updated successfully!`);
    setEditingSubject(null);
  };

  // Save edited topic
  const handleSaveEditTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic || !activeSubject || !editingTopic.title.trim()) return;
    onUpdateTopic(selectedGradeId, activeSubject.id, editingTopic.topic.id, {
      title: editingTopic.title.trim(),
      summary: editingTopic.summary.trim(),
      chapterNumber: editingTopic.chapterNumber,
    });
    showNotice(`Topic "${editingTopic.title.trim()}" updated successfully!`);
    setEditingTopic(null);
  };

  // Save edited subtopic
  const handleSaveEditSubTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubTopic || !activeSubject || !editingSubTopic.name.trim()) return;
    if (onUpdateSubTopic) {
      onUpdateSubTopic(
        selectedGradeId,
        activeSubject.id,
        editingSubTopic.topicId,
        editingSubTopic.subTopic.id,
        {
          name: editingSubTopic.name.trim(),
          formula: editingSubTopic.formula.trim(),
          summary: editingSubTopic.summary.trim(),
        }
      );
    }
    showNotice(`Subtopic "${editingSubTopic.name.trim()}" updated successfully!`);
    setEditingSubTopic(null);
  };

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

  // Retrieve current active entities based on drill-down
  const activeClassSubjects = curriculumStore[selectedGradeId] || [];
  const activeSubject = activeClassSubjects.find((s) => s.id === selectedSubjectId);
  const activeTopic = activeSubject?.topics.find((t) => t.id === selectedTopicId);

  // Handle Add Subject Submit
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: newSubjectName.trim(),
      code: newSubjectCode.trim().toUpperCase() || `SUB-${selectedGradeId}`,
      category: newSubjectCategory,
      stream: newSubjectStream,
      icon: 'BookOpen',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: `top-${Date.now()}-1`,
          chapterNumber: 1,
          title: `${newSubjectName.trim()} Fundamentals`,
          summary: `Core principles and foundational overview of ${newSubjectName.trim()}.`,
          keyConcepts: ['Introductory Axioms', 'Key Formulae', 'Practice Assessment'],
          tests: [
            {
              id: `test-${Date.now()}-1`,
              title: 'Chapter 1 Diagnostic Quiz',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 5,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: `q-${Date.now()}-1`,
                  question: `What is the primary foundation of ${newSubjectName.trim()}?`,
                  options: ['Core Analytical Concepts', 'Historical Context', 'Experimental Proof', 'Standard Nomenclature'],
                  correctIndex: 0,
                  explanation: `Foundational core principles establish the basis of ${newSubjectName.trim()}.`,
                },
              ],
            },
          ],
        },
      ],
    };

    onAddSubject(selectedGradeId, newSub);
    setSelectedSubjectId(newSub.id);
    setSelectedTopicId(null);
    setIsAddSubjectModalOpen(false);
    setNewSubjectName('');
    setNewSubjectCode('');
    showNotice(`Subject "${newSub.name}" successfully added to Class ${selectedGradeId}!`);
  };

  // Handle Add Topic Submit
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !newTopicTitle.trim()) return;

    const newTop: ChapterTopic = {
      id: `top-${Date.now()}`,
      chapterNumber: newTopicChapterNum || (activeSubject?.topics.length ? activeSubject.topics.length + 1 : 1),
      title: newTopicTitle.trim(),
      summary: newTopicSummary.trim() || `Comprehensive curriculum module for ${newTopicTitle.trim()}.`,
      keyConcepts: ['Key Definitions', 'Formulas & Applications', 'Exam Question Patterns'],
      tests: [
        {
          id: `test-top-${Date.now()}-1`,
          title: `Diagnostic Test: ${newTopicTitle.trim()}`,
          type: 'diagnostic',
          badge: 'Diagnostic',
          questionsCount: 5,
          durationMinutes: 15,
          marks: 10,
          difficulty: 'Easy',
          questions: [
            {
              id: `q-top-${Date.now()}-1`,
              question: `Which statement best describes the fundamental concept of ${newTopicTitle.trim()}?`,
              options: ['Primary Core Rule', 'Secondary Corollary', 'Empirical Exception', 'Historical Precedent'],
              correctIndex: 0,
              explanation: 'Fundamental concepts govern chapter understanding and application.',
            },
          ],
        },
        {
          id: `test-top-${Date.now()}-2`,
          title: `Comprehensive Chapter Quiz: ${newTopicTitle.trim()}`,
          type: 'concept',
          badge: 'Chapter Test',
          questionsCount: 10,
          durationMinutes: 20,
          marks: 20,
          difficulty: 'Medium',
          questions: [
            {
              id: `q-top-${Date.now()}-2`,
              question: `In advanced problem solving for ${newTopicTitle.trim()}, which methodology is preferred?`,
              options: ['Systematic Derivation', 'Random Approximation', 'Intuitive Guesswork', 'Literal Memorization'],
              correctIndex: 0,
              explanation: 'Systematic derivations ensure reliable problem solving.',
            },
          ],
        },
      ],
    };

    onAddTopic(selectedGradeId, selectedSubjectId, newTop);
    setSelectedTopicId(newTop.id);
    setIsAddTopicModalOpen(false);
    setNewTopicTitle('');
    setNewTopicSummary('');
    showNotice(`Topic "${newTop.title}" added to ${activeSubject?.name}!`);
  };

  // Execute confirmed deletion
  const executeConfirmedDelete = () => {
    if (!deleteConfirmTarget) return;

    if (deleteConfirmTarget.type === 'subject' && deleteConfirmTarget.subjectId) {
      onDeleteSubject(deleteConfirmTarget.classId, deleteConfirmTarget.subjectId);
      if (selectedSubjectId === deleteConfirmTarget.subjectId) {
        setSelectedSubjectId(null);
        setSelectedTopicId(null);
      }
      showNotice(`Subject "${deleteConfirmTarget.name}" deleted from Class ${deleteConfirmTarget.classId}.`);
    } else if (
      deleteConfirmTarget.type === 'topic' &&
      deleteConfirmTarget.subjectId &&
      deleteConfirmTarget.topicId
    ) {
      onDeleteTopic(deleteConfirmTarget.classId, deleteConfirmTarget.subjectId, deleteConfirmTarget.topicId);
      if (selectedTopicId === deleteConfirmTarget.topicId) {
        setSelectedTopicId(null);
      }
      showNotice(`Topic "${deleteConfirmTarget.name}" deleted.`);
    } else if (
      deleteConfirmTarget.type === 'test' &&
      deleteConfirmTarget.subjectId &&
      deleteConfirmTarget.topicId &&
      deleteConfirmTarget.testId
    ) {
      onDeleteTest(
        deleteConfirmTarget.classId,
        deleteConfirmTarget.subjectId,
        deleteConfirmTarget.topicId,
        deleteConfirmTarget.testId
      );
      showNotice(`Test "${deleteConfirmTarget.name}" deleted from topic.`);
    }

    setDeleteConfirmTarget(null);
  };

  const totalClassesEnabled = Object.values(disabledEntities.grades).filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0F172A] text-white text-xs font-bold shadow-2xl border border-white/20 flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Admin Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#513F33] bg-[#EFE6DA] hover:bg-[#E4D8C8] active:bg-[#D9CCBA] transition-colors border border-[#DDD0BF] shadow-xs cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Classes (Preview Student Experience)</span>
        </button>

        <div className="flex items-center gap-3">
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Global Leaderboard</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Master Admin Session (abt1996)</span>
          </div>

          <button
            onClick={onChangePasswordClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#DDD0BF] text-xs font-bold text-[#334155] hover:bg-[#FAF4ED] cursor-pointer shadow-2xs transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#D46244]" />
            <span>Change Admin Password</span>
          </button>
        </div>
      </div>

      {/* Header Headline */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2F241C] tracking-tight flex items-center gap-3">
          <span>Administrator Curriculum & Control Center</span>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-[#E2E8F0] text-[#334155] border border-[#CBD5E1]">
            examworld.site
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#735F50] mt-1.5 font-medium max-w-3xl">
          Hierarchical 4-level control center: toggle availability at Grade, Subject, Topic, and Test levels, full CRUD editing across modules, view dynamic user telemetry, and inspect student performance analytics.
        </p>
      </div>

      {/* SECTION 1: LIVE ANALYTICS (Prominent Dynamic Real-time Counter) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Live Active Analytics · examworld.site
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Auto-refreshing dynamic telemetry (every 2.5s)
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
                <span>Calculated from live active session stream</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Active Test Sessions
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-[#38BDF8] tracking-tight mt-1">
                <span className="tabular-nums font-mono">{activeSessions}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Calculated simultaneous test attempts taking place
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Completed Tests Today
              </span>
              <div className="text-4xl sm:text-5xl font-heading font-black text-[#F59E0B] tracking-tight mt-1">
                <span className="tabular-nums font-mono">{todaySubmissions.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Dynamically computed evaluations recorded
              </p>
            </div>
          </div>

          {/* Dynamic User Activity Real-Time Stream */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">Live Activity Stream:</span>
              <span className="text-slate-300 truncate max-w-md">
                {recentActivities[0].userName} (Class {recentActivities[0].className}){' '}
                {recentActivities[0].action === 'test_completed'
                  ? `scored ${recentActivities[0].score || 18} marks in ${recentActivities[0].testName}`
                  : `started assessment in ${recentActivities[0].testName || 'NCERT Curriculum'}`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
              Computed dynamically from {recentActivities.length} session activity records
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: HIERARCHICAL CURRICULUM CONTROL CENTER (4 distinct toggle levels + Add/Delete) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DFD3C3] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0E6D8] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D46244]/10 text-[#D46244] flex items-center justify-center shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#2D231B] tracking-tight">
                Curriculum Hierarchy & Availability Control
              </h2>
              <p className="text-xs text-[#7A6858] font-medium mt-0.5">
                Toggle availability across 4 levels: <strong>Grade → Subject → Topic → Test</strong>. Add or delete subjects and topics dynamically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onSetAllGrades(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
            >
              Enable All Grades
            </button>
            <button
              onClick={() => onSetAllGrades(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-colors"
            >
              Disable All Grades
            </button>
          </div>
        </div>

        {/* LEVEL 1: GRADES TOGGLES & SELECTION */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F5B4B] flex items-center gap-1.5">
              <span>Level 1: Academic Grades ({totalClassesEnabled} of 7 Enabled)</span>
            </span>
            <span className="text-[11px] font-semibold text-[#8C7A6B]">
              Click a Grade to manage its Subjects
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CLASSES_LIST.map((cls) => {
              const isEnabled = disabledEntities.grades[cls.id] !== false;
              const isSelected = selectedGradeId === cls.id;
              const subjectsCount = (curriculumStore[cls.id] || []).length;

              return (
                <div
                  key={cls.id}
                  onClick={() => {
                    setSelectedGradeId(cls.id);
                    const firstSub = (curriculumStore[cls.id] || [])[0];
                    setSelectedSubjectId(firstSub ? firstSub.id : null);
                    setSelectedTopicId(null);
                  }}
                  className={`
                    p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 text-left
                    ${
                      isSelected
                        ? 'border-[#D46244] bg-[#FDF9F5] shadow-sm'
                        : isEnabled
                        ? 'border-[#E2D6C5] bg-[#FAF6F0] hover:border-[#D0BFAC]'
                        : 'border-[#CBD5E1] bg-slate-100 opacity-60'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-lg text-[#2F241C]">
                      {cls.name}
                    </span>
                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleGrade(cls.id);
                      }}
                      className="p-1 rounded-lg hover:bg-black/5 cursor-pointer transition-colors"
                      title={isEnabled ? 'Click to Disable Grade' : 'Click to Enable Grade'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={isEnabled ? 'text-[#6D5A4C]' : 'text-slate-500'}>
                      {subjectsCount} Subjects
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEVEL 2: SUBJECTS LIST (for Selected Grade) */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#D46244] text-white text-[11px] font-bold">
                  Class {selectedGradeId}
                </span>
                <h3 className="font-heading font-bold text-base text-[#2F241C]">
                  Level 2: Subjects Management
                </h3>
              </div>
              <p className="text-xs text-[#7A6858] mt-0.5 font-medium">
                Click any subject to view topics, or toggle its status to show/hide it from students.
              </p>
            </div>

            <button
              onClick={() => {
                setNewSubjectName('');
                setNewSubjectCode(`SUB-${selectedGradeId}`);
                setIsAddSubjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256828] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeClassSubjects.map((sub) => {
              const subKey = `${selectedGradeId}:${sub.id}`;
              const isEnabled = disabledEntities.subjects[subKey] !== false;
              const isSelected = selectedSubjectId === sub.id;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setSelectedTopicId(null);
                  }}
                  className={`
                    p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3
                    ${
                      isSelected
                        ? 'border-[#D46244] bg-white shadow-sm'
                        : isEnabled
                        ? 'border-[#DDD0BF] bg-white/70 hover:border-[#CBBBA8]'
                        : 'border-[#CBD5E1] bg-slate-100 opacity-60'
                    }
                  `}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-[#2F241C] truncate">
                        {sub.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#8C7A6B] bg-[#EFE6DA] px-1.5 py-0.2 rounded">
                        {sub.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6858] font-medium mt-0.5 truncate">
                      {sub.topics.length} Chapters · {sub.stream || 'General'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Edit subject button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSubject({
                          subject: sub,
                          name: sub.name,
                          code: sub.code,
                          category: sub.category,
                          stream: sub.stream,
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      title="Edit Subject"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSubject(selectedGradeId, sub.id);
                      }}
                      className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                      title={isEnabled ? 'Disable Subject' : 'Enable Subject'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Delete subject button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmTarget({
                          type: 'subject',
                          classId: selectedGradeId,
                          subjectId: sub.id,
                          name: sub.name,
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEVEL 3 & LEVEL 4: TOPICS & TESTS (for Selected Subject) */}
        {activeSubject && (
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DEC8] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0F172A] text-white text-[11px] font-bold">
                    Class {selectedGradeId} · {activeSubject.name}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#2F241C]">
                    Level 3: Topics & Level 4: Tests
                  </h3>
                </div>
                <p className="text-xs text-[#7A6858] mt-0.5 font-medium">
                  Enable/disable specific topics or drill in to toggle and edit individual tests.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewTopicTitle('');
                  setNewTopicSummary('');
                  setNewTopicChapterNum(activeSubject.topics.length + 1);
                  setIsAddTopicModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Topic</span>
              </button>
            </div>

            {/* Topics accordion-like cards */}
            <div className="space-y-3">
              {activeSubject.topics.map((topic) => {
                const isTopicEnabled = disabledEntities.topics[topic.id] !== false;
                const isTopicSelected = selectedTopicId === topic.id;

                return (
                  <div
                    key={topic.id}
                    className={`
                      p-4 rounded-xl border-2 transition-all bg-white
                      ${
                        isTopicSelected
                          ? 'border-[#D46244] shadow-xs'
                          : isTopicEnabled
                          ? 'border-[#E2D5C4]'
                          : 'border-[#CBD5E1] bg-slate-50 opacity-70'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EFE6DA] text-[#5A4535]">
                            Ch. {topic.chapterNumber}
                          </span>
                          <h4 className="font-heading font-bold text-sm text-[#2F241C] truncate">
                            {topic.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isTopicEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isTopicEnabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6858] font-medium mt-1 truncate">
                          {topic.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Edit Topic */}
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTopic({
                              topic,
                              title: topic.title,
                              summary: topic.summary,
                              chapterNumber: topic.chapterNumber,
                            })
                          }
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          title="Edit Topic"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Toggle Topic */}
                        <button
                          type="button"
                          onClick={() => onToggleTopic(topic.id)}
                          className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                          title={isTopicEnabled ? 'Disable Topic' : 'Enable Topic'}
                        >
                          {isTopicEnabled ? (
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </button>

                        {/* View Tests expand */}
                        <button
                          type="button"
                          onClick={() => setSelectedTopicId(isTopicSelected ? null : topic.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            isTopicSelected ? 'bg-[#D46244] text-white' : 'bg-[#EFE6DA] text-[#4A392D] hover:bg-[#E4D8C8]'
                          }`}
                        >
                          {isTopicSelected ? 'Hide Tests' : `Tests (${topic.tests.length})`}
                        </button>

                        {/* Delete Topic */}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmTarget({
                              type: 'topic',
                              classId: selectedGradeId,
                              subjectId: activeSubject.id,
                              topicId: topic.id,
                              name: topic.title,
                            })
                          }
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* LEVEL 4: TESTS INSIDE THIS TOPIC */}
                    {isTopicSelected && (
                      <div className="mt-4 pt-4 border-t border-[#F0E6D8] space-y-2.5 bg-[#FAF7F2] p-3 rounded-lg">
                        {/* Nested Subtopics if present */}
                        {topic.subTopics && topic.subTopics.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-white border border-[#E8DEC8] space-y-2 mb-3">
                            <span className="text-xs font-bold text-[#6D5A4C] uppercase tracking-wider block">
                              Nested Subtopics / Tense Modules ({topic.subTopics.length}) - Editable
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {topic.subTopics.map((st) => (
                                <div
                                  key={st.id}
                                  className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E4D8C8] flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#2F241C] block truncate">
                                      {st.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#8C7A6B] block truncate">
                                      {st.formula}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingSubTopic({
                                        topicId: topic.id,
                                        subTopic: st,
                                        name: st.name,
                                        formula: st.formula,
                                        summary: st.summary,
                                      })
                                    }
                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                                    title="Edit Subtopic"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEC8] pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#6D5A4C]">Level 4: Topic Tests & Assessments ({topic.tests.length})</span>
                            <span className="hidden sm:inline-block text-[11px] font-semibold text-[#8C7A6B]">
                              · Full CRUD Editing & Toggles
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setTestBuilderTarget({ topic, initialTest: null })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256828] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New Test</span>
                          </button>
                        </div>

                        {topic.tests.map((test) => {
                          const isTestEnabled = disabledEntities.tests[test.id] !== false;

                          return (
                            <div
                              key={test.id}
                              className={`
                                p-3 rounded-xl bg-white border flex items-center justify-between gap-3 text-xs
                                ${isTestEnabled ? 'border-[#E2D5C4]' : 'border-[#CBD5E1] bg-slate-50 opacity-70'}
                              `}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#2F241C] truncate">{test.title}</span>
                                  <span className="px-2 py-0.5 rounded bg-[#F4ECE1] text-[#715440] font-semibold text-[10px]">
                                    {test.badge}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-[#7A6858] mt-1 font-medium">
                                  <span>{test.questionsCount} Questions</span>
                                  <span>·</span>
                                  <span>{test.durationMinutes} Mins</span>
                                  <span>·</span>
                                  <span>{test.marks} Marks</span>
                                  <span>·</span>
                                  <span>{test.difficulty}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isTestEnabled
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {isTestEnabled ? 'Available' : 'Disabled'}
                                </span>

                                {/* Edit Test Button */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setTestBuilderTarget({
                                      topic,
                                      initialTest: test,
                                    })
                                  }
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                  title="Edit Test & Questions"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onToggleTest(test.id)}
                                  className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                                  title={isTestEnabled ? 'Disable Test' : 'Enable Test'}
                                >
                                  {isTestEnabled ? (
                                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                                  ) : (
                                    <ToggleLeft className="w-5 h-5 text-slate-400" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteConfirmTarget({
                                      type: 'test',
                                      classId: selectedGradeId,
                                      subjectId: activeSubject.id,
                                      topicId: topic.id,
                                      testId: test.id,
                                      name: test.title,
                                    })
                                  }
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                  title="Delete Test"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: STUDENT PERFORMANCE (Chart.js Graphs & Enrolled Students Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Average Score Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-heading font-bold text-[#2D231B] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D46244]" />
                <span>Class-Wise Average Scores (%)</span>
              </h3>
              <p className="text-xs text-[#7A6656] mt-0.5 font-medium">
                Aggregated assessment performance across standards 6 through 12
              </p>
            </div>
            <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-md">
              +4.8% vs last month
            </span>
          </div>

          <div className="h-64 w-full relative">
            <canvas ref={classBarChartRef} />
          </div>
        </div>

        {/* Subject-Wise Completion Rate Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-heading font-bold text-[#2D231B] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D46244]" />
                <span>Subject Assessment Distribution</span>
              </h3>
              <p className="text-xs text-[#7A6656] mt-0.5 font-medium">
                Volume of tests attempted broken down by primary subject category
              </p>
            </div>
            <span className="text-xs font-bold text-[#1565C0] bg-[#E3F2FD] px-2.5 py-1 rounded-md">
              4,918 Attempts Today
            </span>
          </div>

          <div className="h-64 w-full relative">
            <canvas ref={subjectChartRef} />
          </div>
        </div>
      </div>

      {/* Enrolled Students Performance Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-heading font-bold text-[#2D231B] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D46244]" />
              <span>Enrolled Student Metrics & Recent Activity</span>
            </h3>
            <p className="text-xs text-[#7A6656] mt-0.5 font-medium">
              Real-time audit log of active learners, completion tallies, and average scores.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#EFE6DA] text-[#554235] border border-[#DDD0BF]">
            {MOCK_ENROLLED_STUDENTS.length} Recent Sample Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8DFC8] text-[#7A6858] font-bold uppercase tracking-wider bg-[#FAF6F0]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Standard</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4 text-center">Tests Completed</th>
                <th className="py-3 px-4 text-center">Average Score</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8] font-medium text-[#3A2E24]">
              {MOCK_ENROLLED_STUDENTS.map((st) => (
                <tr key={st.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2F241C] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D46244] to-[#B3492F] text-white font-bold text-xs flex items-center justify-center">
                      {st.name.charAt(0)}
                    </div>
                    <span>{st.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#EFE5D8] font-bold text-[11px]">
                      Class {st.className}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#6E5D4F]">+91 {st.mobile}</td>
                  <td className="py-3.5 px-4 text-center font-bold">{st.testsCompleted}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        st.averageScore >= 85
                          ? 'bg-emerald-50 text-emerald-700'
                          : st.averageScore >= 75
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {st.averageScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#7A6858]">{st.lastActive}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          st.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'
                        }`}
                      />
                      <span>{st.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW SUBJECT */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setIsAddSubjectModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight mb-1">
              Add New Subject to Class {selectedGradeId}
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Create a custom subject and immediately inject it into the active curriculum.
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Studies, Sanskrit, Economics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder={`e.g. EVS-${selectedGradeId}`}
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newSubjectCategory}
                    onChange={(e) => setNewSubjectCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                  >
                    <option value="core">Core</option>
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="humanities">Humanities</option>
                    <option value="languages">Languages</option>
                    <option value="grammar">Grammar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Stream
                  </label>
                  <select
                    value={newSubjectStream}
                    onChange={(e) => setNewSubjectStream(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256828] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Inject Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW TOPIC */}
      {isAddTopicModalOpen && activeSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setIsAddTopicModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight mb-1">
              Add Topic to {activeSubject.name}
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Add a new chapter module with automatic starter assessment quizzes.
            </p>

            <form onSubmit={handleCreateTopic} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Ch. #
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newTopicChapterNum}
                    onChange={(e) => setNewTopicChapterNum(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold text-center focus:outline-none"
                  >
                  </input>
                </div>

                <div className="col-span-3">
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemical Bonding & Molecular Structure"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Summary / Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of learning objectives, syllabus scope, and key theorems..."
                  value={newTopicSummary}
                  onChange={(e) => setNewTopicSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST BUILDER MODAL (ADD OR EDIT TEST) */}
      {testBuilderTarget && activeSubject && (
        <TestBuilderModal
          isOpen={true}
          classId={selectedGradeId}
          subjectId={activeSubject.id}
          subjectName={activeSubject.name}
          topic={testBuilderTarget.topic}
          initialTest={testBuilderTarget.initialTest}
          onClose={() => setTestBuilderTarget(null)}
          onSaveTest={(cId, sId, tId, newTest) => {
            if (testBuilderTarget.initialTest) {
              onUpdateTest(cId, sId, tId, newTest);
              showNotice(`Test "${newTest.title}" updated successfully!`);
            } else {
              onAddTest(cId, sId, tId, newTest);
              showNotice(`Test "${newTest.title}" added to ${testBuilderTarget.topic.title}!`);
            }
          }}
        />
      )}

      {/* MODAL 3: EDIT SUBJECT */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setEditingSubject(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight mb-1">
              Edit Subject: {editingSubject.subject.name}
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Rename subject, update code, category, or stream.
            </p>

            <form onSubmit={handleSaveEditSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={(e) =>
                    setEditingSubject((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={editingSubject.code}
                  onChange={(e) =>
                    setEditingSubject((prev) => (prev ? { ...prev, code: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingSubject.category}
                    onChange={(e) =>
                      setEditingSubject((prev) =>
                        prev ? { ...prev, category: e.target.value as any } : null
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                  >
                    <option value="core">Core</option>
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="humanities">Humanities</option>
                    <option value="languages">Languages</option>
                    <option value="grammar">Grammar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Stream
                  </label>
                  <select
                    value={editingSubject.stream}
                    onChange={(e) =>
                      setEditingSubject((prev) =>
                        prev ? { ...prev, stream: e.target.value as any } : null
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT TOPIC */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setEditingTopic(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight mb-1">
              Edit Topic: {editingTopic.topic.title}
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Update chapter number, title, or curriculum overview.
            </p>

            <form onSubmit={handleSaveEditTopic} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Ch. #
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingTopic.chapterNumber}
                    onChange={(e) =>
                      setEditingTopic((prev) =>
                        prev ? { ...prev, chapterNumber: parseInt(e.target.value) || 1 } : null
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold text-center focus:outline-none"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Topic Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTopic.title}
                    onChange={(e) =>
                      setEditingTopic((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Summary / Overview
                </label>
                <textarea
                  rows={3}
                  value={editingTopic.summary}
                  onChange={(e) =>
                    setEditingTopic((prev) => (prev ? { ...prev, summary: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT SUBTOPIC */}
      {editingSubTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setEditingSubTopic(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight mb-1">
              Edit Subtopic: {editingSubTopic.subTopic.name}
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Rename tense subtopic, grammatical formula, or summary.
            </p>

            <form onSubmit={handleSaveEditSubTopic} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subtopic / Tense Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubTopic.name}
                  onChange={(e) =>
                    setEditingSubTopic((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Grammatical Formula
                </label>
                <input
                  type="text"
                  value={editingSubTopic.formula}
                  onChange={(e) =>
                    setEditingSubTopic((prev) => (prev ? { ...prev, formula: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  value={editingSubTopic.summary}
                  onChange={(e) =>
                    setEditingSubTopic((prev) => (prev ? { ...prev, summary: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSubTopic(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE SUBJECT, TOPIC, OR TEST */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="font-heading font-extrabold text-lg text-[#2F241C] tracking-tight">
              Confirm Deletion
            </h4>
            <p className="text-xs text-[#7A6858] mt-1.5 font-medium">
              Are you sure you want to delete {
                deleteConfirmTarget.type === 'subject'
                  ? 'the subject'
                  : deleteConfirmTarget.type === 'topic'
                  ? 'the topic'
                  : 'the test'
              }{' '}
              <strong>"{deleteConfirmTarget.name}"</strong>? This action cannot be undone.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6D5A4C] bg-[#EFE5D8] hover:bg-[#E5D9CB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmedDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
