import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Users,
  Activity,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  School,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Pencil,
  Trophy,
  Eye,
  EyeOff,
  Search,
  UserPlus,
  Phone,
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
import { MOCK_USER_ACTIVITIES } from '../data/userActivityData';
import { TestBuilderModal } from './TestBuilderModal';
import {
  getStudents,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  StudentData,
} from '../services/authApi';
import { getAdminAnalytics } from '../services/curriculumApi';

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

const DEFAULT_MOCK_STUDENTS: StudentData[] = MOCK_ENROLLED_STUDENTS.map((st) => ({
  id: st.id,
  name: st.name,
  username: st.name.toLowerCase().replace(/\s+/g, ''),
  mobile: st.mobile,
  role: 'student',
  current_class: st.className,
  tests_count: st.testsCompleted,
  average_score: st.averageScore,
  created_at: new Date().toISOString(),
}));

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
  // Dynamic live stats from MySQL / FastAPI backend
  //const [liveUsersCount, setLiveUsersCount] = useState<number>(14);
  //const [activeSessions, setActiveSessions] = useState<number>(4);
  //const [todaySubmissions, setTodaySubmissions] = useState<number>(8);
  //const [recentActivities, setRecentActivities] = useState<UserActivityLog[]>(MOCK_USER_ACTIVITIES);
  // Live database analytics state
  const [liveUsersCount, setLiveUsersCount] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<number>(0);
  const [todaySubmissions, setTodaySubmissions] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<UserActivityLog[]>([]);

  // Fetch telemetry directly from MySQL via FastAPI backend
  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        const stats = await getAdminAnalytics();
        if (!isMounted) return;
        setLiveUsersCount(stats.activeUsers || 0);
        setActiveSessions(stats.activeTestSessions || 0);
        setTodaySubmissions(stats.completedTestsToday || 0);
        if (Array.isArray(stats.recentActivities)) {
          setRecentActivities(stats.recentActivities);
        }
      } catch (err: any) {
        console.warn('[Admin] Analytics fetch note:', err?.message || err);
      }
    };

    fetchAnalytics();
    const timer = setInterval(fetchAnalytics, 5000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Dashboard Tab Mode ('all' shows everything in continuous flow, or filter to specific view)
  const [activeAdminTab, setActiveAdminTab] = useState<'all' | 'students' | 'curriculum' | 'analytics'>('all');

  // Curriculum Drill-Down Selected States
  const [selectedGradeId, setSelectedGradeId] = useState<ClassLevel>('10');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('c10-grammar');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('eg-ch1');

  // Student Management State
  const [studentsList, setStudentsList] = useState<StudentData[]>(DEFAULT_MOCK_STUDENTS);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [studentClassFilter, setStudentClassFilter] = useState<string>('all');
  const [studentModalError, setStudentModalError] = useState<string>('');
  const [isSubmittingStudent, setIsSubmittingStudent] = useState<boolean>(false);

  // Student Modals State
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentUsername, setNewStudentUsername] = useState<string>('');
  const [newStudentMobile, setNewStudentMobile] = useState<string>('');
  const [newStudentClass, setNewStudentClass] = useState<ClassLevel>('10');
  const [newStudentPassword, setNewStudentPassword] = useState<string>('');
  const [showNewStudentPassword, setShowNewStudentPassword] = useState<boolean>(false);

  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [editStudentName, setEditStudentName] = useState<string>('');
  const [editStudentUsername, setEditStudentUsername] = useState<string>('');
  const [editStudentMobile, setEditStudentMobile] = useState<string>('');
  const [editStudentClass, setEditStudentClass] = useState<ClassLevel>('10');
  const [editStudentPassword, setEditStudentPassword] = useState<string>('');
  const [showEditStudentPassword, setShowEditStudentPassword] = useState<boolean>(false);

  const [viewingStudent, setViewingStudent] = useState<StudentData | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentData | null>(null);

  // Curriculum Modals State
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectCategory, setNewSubjectCategory] = useState<Subject['category']>('core');
  const [newSubjectStream, setNewSubjectStream] = useState<Subject['stream']>('General');

  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSummary, setNewTopicSummary] = useState('');
  const [newTopicChapterNum, setNewTopicChapterNum] = useState<number>(1);

  const [editingSubject, setEditingSubject] = useState<{
    subject: Subject;
    name: string;
    code: string;
    category: Subject['category'];
    stream: Subject['stream'];
  } | null>(null);

  const [editingTopic, setEditingTopic] = useState<{
    topic: ChapterTopic;
    title: string;
    summary: string;
    chapterNumber: number;
  } | null>(null);

  const [testBuilderTarget, setTestBuilderTarget] = useState<{
    topic: ChapterTopic;
    initialTest?: TopicTest | null;
  } | null>(null);

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'subject' | 'topic' | 'test';
    classId: ClassLevel;
    subjectId?: string;
    topicId?: string;
    testId?: string;
    name: string;
  } | null>(null);

  // Toast Notifications
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Fetch students from backend/MySQL
  const refreshStudentsList = async () => {
    setIsLoadingStudents(true);
    try {
      const data = await getStudents();
      if (Array.isArray(data)) {
        setStudentsList(data);
      }
    } catch (err: any) {
      console.warn('[Admin] Note: Using active student dataset fallback:', err?.message || err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    refreshStudentsList();
  }, []);

  // Polling useEffect that calls getAdminAnalytics() every 5 seconds
  useEffect(() => {
    let isMounted = true;

    const pollAnalytics = async () => {
      try {
        const stats = await getAdminAnalytics();
        if (!isMounted) return;
        setLiveUsersCount(stats.activeUsers);
        setActiveSessions(stats.activeTestSessions);
        setTodaySubmissions(stats.completedTestsToday);
        if (Array.isArray(stats.recentActivities) && stats.recentActivities.length > 0) {
          setRecentActivities(stats.recentActivities);
        }
      } catch (err: any) {
        console.warn('[Admin] Polling analytics note:', err?.message || err);
      }
    };

    pollAnalytics();
    const timer = setInterval(pollAnalytics, 5000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Chart References
  const classChartRef = useRef<HTMLCanvasElement | null>(null);
  const subjectDonutChartRef = useRef<HTMLCanvasElement | null>(null);
  const classChartInstance = useRef<Chart | null>(null);
  const donutChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // 1. Class-Wise Average Scores Bar Chart
    if (classChartRef.current) {
      const ctx = classChartRef.current.getContext('2d');
      if (ctx) {
        if (classChartInstance.current) {
          classChartInstance.current.destroy();
        }
        classChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
            datasets: [
              {
                label: 'Average Score (%)',
                data: [82, 79, 81, 76, 86, 74, 88],
                backgroundColor: '#D46244',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (val) => `${val}%`,
                  font: { family: 'Plus Jakarta Sans', size: 10 },
                  color: '#7A6656',
                },
                grid: { color: '#EFE5D8' },
              },
              x: {
                ticks: {
                  font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                  color: '#554235',
                },
                grid: { display: false },
              },
            },
          },
        });
      }
    }

    // 2. Subject Assessment Distribution Donut Chart
    if (subjectDonutChartRef.current) {
      const ctx = subjectDonutChartRef.current.getContext('2d');
      if (ctx) {
        if (donutChartInstance.current) {
          donutChartInstance.current.destroy();
        }
        donutChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['English Grammar', 'Mathematics', 'Science', 'Social Science', 'Languages'],
            datasets: [
              {
                data: [32, 26, 20, 14, 8],
                backgroundColor: ['#10B981', '#F59E0B', '#0EA5E9', '#8B5CF6', '#EF4444'],
                borderWidth: 2,
                borderColor: '#FFFFFF',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                  color: '#554235',
                  boxWidth: 12,
                  padding: 14,
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (classChartInstance.current) classChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();
    };
  }, []);

  // CRUD Student Handlers
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentUsername.trim() || !newStudentPassword.trim()) {
      setStudentModalError('Name, username, and password are all required.');
      return;
    }

    setStudentModalError('');
    setIsSubmittingStudent(true);

    try {
      const created = await createStudent({
        name: newStudentName.trim(),
        username: newStudentUsername.trim().toLowerCase(),
        mobile: newStudentMobile.trim() || undefined,
        current_class: newStudentClass,
        password: newStudentPassword.trim(),
      });

      const newRecord: StudentData = created.data || {
        id: `st-${Date.now().toString(36)}`,
        name: newStudentName.trim(),
        username: newStudentUsername.trim().toLowerCase(),
        mobile: newStudentMobile.trim() || undefined,
        role: 'student',
        current_class: newStudentClass,
        tests_count: 0,
        average_score: 0,
        created_at: new Date().toISOString(),
      };

      setStudentsList((prev) => [newRecord, ...prev]);
      showNotice(`Student "${newStudentName.trim()}" added successfully!`);
      setIsAddStudentModalOpen(false);
      setNewStudentName('');
      setNewStudentUsername('');
      setNewStudentMobile('');
      setNewStudentPassword('');
      setShowNewStudentPassword(false);
      // Refresh table to pull latest server/database records
      refreshStudentsList();
    } catch (err: any) {
      setStudentModalError(err.message || 'Failed to create student in database.');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleOpenEditStudent = (st: StudentData) => {
    setEditingStudent(st);
    setEditStudentName(st.name);
    setEditStudentUsername(st.username);
    setEditStudentMobile(st.mobile || '');
    setEditStudentClass((st.current_class as ClassLevel) || '10');
    setEditStudentPassword('');
    setShowEditStudentPassword(false);
    setStudentModalError('');
  };

  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editStudentName.trim() || !editStudentUsername.trim()) {
      setStudentModalError('Name and username are required.');
      return;
    }

    setStudentModalError('');
    setIsSubmittingStudent(true);

    try {
      await updateStudent(editingStudent.id, {
        name: editStudentName.trim(),
        username: editStudentUsername.trim().toLowerCase(),
        mobile: editStudentMobile.trim() || undefined,
        current_class: editStudentClass,
        password: editStudentPassword.trim() || undefined,
      });

      setStudentsList((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                name: editStudentName.trim(),
                username: editStudentUsername.trim().toLowerCase(),
                mobile: editStudentMobile.trim() || undefined,
                current_class: editStudentClass,
              }
            : s
        )
      );

      showNotice(`Student "${editStudentName.trim()}" updated successfully!`);
      setEditingStudent(null);
      // Refresh table to ensure complete sync with database
      refreshStudentsList();
    } catch (err: any) {
      setStudentModalError(err.message || 'Failed to update student in database.');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    setIsSubmittingStudent(true);

    try {
      await deleteStudent(deletingStudent.id);
      setStudentsList((prev) => prev.filter((s) => s.id !== deletingStudent.id));
      showNotice(`Student "${deletingStudent.name}" (@${deletingStudent.username}) removed.`);
      setDeletingStudent(null);
      // Refresh table to ensure complete sync with database
      refreshStudentsList();
    } catch (err: any) {
      showNotice(`Error deleting student: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  // Filtered students for display
  const filteredStudents = studentsList.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      st.username.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      (st.mobile && st.mobile.includes(studentSearchQuery));
    const matchesClass =
      studentClassFilter === 'all' || st.current_class === studentClassFilter;
    return matchesSearch && matchesClass;
  });

  // Curriculum Handlers
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;

    const newSub: Subject = {
      id: `sub-${selectedGradeId}-${Date.now().toString(36)}`,
      name: newSubjectName.trim(),
      code: newSubjectCode.trim().toUpperCase(),
      category: newSubjectCategory,
      stream: newSubjectStream,
      icon: 'BookOpen',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-900',
      },
      topics: [],
    };

    onAddSubject(selectedGradeId, newSub);
    setSelectedSubjectId(newSub.id);
    setIsAddSubjectModalOpen(false);
    setNewSubjectName('');
    setNewSubjectCode('');
    showNotice(`Added new subject: ${newSub.name}`);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !selectedSubjectId) return;

    const newTop: ChapterTopic = {
      id: `top-${selectedGradeId}-${Date.now().toString(36)}`,
      chapterNumber: newTopicChapterNum,
      title: newTopicTitle.trim(),
      summary: newTopicSummary.trim() || 'Core concepts and assessments.',
      keyConcepts: ['Foundation', 'Concept Review', 'Sample Problems'],
      tests: [],
    };

    onAddTopic(selectedGradeId, selectedSubjectId, newTop);
    setExpandedTopicId(newTop.id);
    setIsAddTopicModalOpen(false);
    setNewTopicTitle('');
    setNewTopicSummary('');
    showNotice(`Added new chapter: ${newTop.title}`);
  };

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

  const handleSaveEditTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic || !editingTopic.title.trim() || !selectedSubjectId) return;
    onUpdateTopic(selectedGradeId, selectedSubjectId, editingTopic.topic.id, {
      title: editingTopic.title.trim(),
      summary: editingTopic.summary.trim(),
      chapterNumber: editingTopic.chapterNumber,
    });
    showNotice(`Topic "${editingTopic.title.trim()}" updated successfully!`);
    setEditingTopic(null);
  };

  const executeConfirmedDelete = () => {
    if (!deleteConfirmTarget) return;

    if (deleteConfirmTarget.type === 'subject' && deleteConfirmTarget.subjectId) {
      onDeleteSubject(deleteConfirmTarget.classId, deleteConfirmTarget.subjectId);
      if (selectedSubjectId === deleteConfirmTarget.subjectId) {
        setSelectedSubjectId(null);
      }
      showNotice(`Subject "${deleteConfirmTarget.name}" deleted from Class ${deleteConfirmTarget.classId}.`);
    } else if (
      deleteConfirmTarget.type === 'topic' &&
      deleteConfirmTarget.subjectId &&
      deleteConfirmTarget.topicId
    ) {
      onDeleteTopic(deleteConfirmTarget.classId, deleteConfirmTarget.subjectId, deleteConfirmTarget.topicId);
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

  const currentGradeSubjects = curriculumStore[selectedGradeId] || [];
  const currentSubject = currentGradeSubjects.find((s) => s.id === selectedSubjectId) || currentGradeSubjects[0];
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
            <span>Master Admin Session ({adminUser.username})</span>
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
          Complete administration portal: Manage registered students with database persistence, toggle availability across all 4 curriculum levels, configure custom tests, and inspect performance analytics.
        </p>
      </div>

      {/* DASHBOARD NAVIGATION QUICK TABS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EFE5D8] rounded-2xl border border-[#DFD3C3] w-fit shadow-xs">
        <button
          onClick={() => setActiveAdminTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'all'
              ? 'bg-[#2F241C] text-white shadow-sm'
              : 'text-[#6E5D4F] hover:text-[#2F241C] hover:bg-[#FAF4ED]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Complete Overview (All Sections)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'students'
              ? 'bg-[#D46244] text-white shadow-sm'
              : 'text-[#6E5D4F] hover:text-[#2F241C] hover:bg-[#FAF4ED]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Management ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('curriculum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'curriculum'
              ? 'bg-[#2F241C] text-white shadow-sm'
              : 'text-[#6E5D4F] hover:text-[#2F241C] hover:bg-[#FAF4ED]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Curriculum Hierarchy & Availability (4 Levels)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'analytics'
              ? 'bg-[#2F241C] text-white shadow-sm'
              : 'text-[#6E5D4F] hover:text-[#2F241C] hover:bg-[#FAF4ED]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Performance Analytics</span>
        </button>
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
                Simultaneous test attempts taking place right now
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
                Evaluations recorded across all classes
              </p>
            </div>
          </div>

          {/* Dynamic User Activity Real-Time Stream */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white">Live Activity Stream:</span>
              <span className="text-slate-300 truncate max-w-md">
              {recentActivities[0]?.userName || 'No recent student'} (Class {recentActivities[0]?.className || '10'}){' '}
        {recentActivities[0]?.action === 'test_completed'
          ? `scored ${recentActivities[0]?.score || 18} marks in ${recentActivities[0]?.testName || 'Assessment'}`
          : `started assessment in ${recentActivities[0]?.testName || 'NCERT Curriculum'}`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
              Computed dynamically from {recentActivities.length} session activity records
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CURRICULUM HIERARCHY & AVAILABILITY CONTROL (THE FULL 4 LEVELS) */}
      {/* ========================================================================= */}
      {(activeAdminTab === 'all' || activeAdminTab === 'curriculum') && (
        <div className="space-y-6">
        {/* Title bar with Enable All / Disable All buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-[#2F241C] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D46244]" />
              <span>Curriculum Hierarchy & Availability Control</span>
            </h2>
            <p className="text-xs text-[#7A6656] mt-1 font-medium">
              Toggle availability across 4 levels: Grade → Subject → Topic → Test. Add or delete subjects and topics dynamically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetAllGrades(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
            >
              Enable All Grades
            </button>
            <button
              onClick={() => onSetAllGrades(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors cursor-pointer"
            >
              Disable All Grades
            </button>
          </div>
        </div>

        {/* LEVEL 1: ACADEMIC GRADES (7 OF 7 ENABLED) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold tracking-wider">
            <span className="uppercase text-[#564335]">
              LEVEL 1: ACADEMIC GRADES ({totalClassesEnabled} OF 7 ENABLED)
            </span>
            <span className="text-[#8C7A6B] font-medium lowercase">Click a Grade to manage its Subjects</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {CLASSES_LIST.map((cls) => {
              const isEnabled = disabledEntities.grades[cls.id] !== false;
              const isSelected = selectedGradeId === cls.id;
              const subjectsCount = (curriculumStore[cls.id] || []).length;

              return (
                <div
                  key={cls.id}
                  onClick={() => {
                    setSelectedGradeId(cls.id);
                    const subs = curriculumStore[cls.id] || [];
                    if (!subs.some((s) => s.id === selectedSubjectId)) {
                      setSelectedSubjectId(subs[0]?.id || null);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none bg-white flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-[#D46244] shadow-sm ring-2 ring-[#D46244]/15'
                      : 'border-[#E8DFC8] hover:border-[#D46244]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-extrabold text-sm text-[#2F241C]">
                      Class {cls.id}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleGrade(cls.id);
                      }}
                      className="p-1 cursor-pointer transition-colors"
                      title={isEnabled ? 'Click to disable Class' : 'Click to enable Class'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F0E6D8] text-[11px]">
                    <span className="text-[#8C7A6B] font-medium">{subjectsCount} Subjects</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
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

        {/* LEVEL 2: SUBJECTS MANAGEMENT */}
        <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#D46244] text-white text-xs font-bold font-mono">
                  Class {selectedGradeId}
                </span>
                <h3 className="font-heading font-extrabold text-base text-[#2F241C]">
                  Level 2: Subjects Management
                </h3>
              </div>
              <p className="text-xs text-[#7A6656] mt-0.5">
                Click any subject to view topics, or toggle its status to show/hide it from students.
              </p>
            </div>

            <button
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {currentGradeSubjects.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              const isSubDisabled = disabledEntities.subjects[sub.id] === true;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white flex items-center justify-between ${
                    isSelected
                      ? 'border-2 border-[#D46244] shadow-sm ring-2 ring-[#D46244]/15'
                      : 'border-[#E8DFC8] hover:border-[#D46244]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-sm text-[#2F241C]">
                        {sub.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#EFE6DA] text-[#6E5D4F] text-[10px] font-mono font-bold">
                        {sub.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7A6B] mt-1 font-medium">
                      {sub.topics.length} Chapters · {sub.stream || 'General'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() =>
                        setEditingSubject({
                          subject: sub,
                          name: sub.name,
                          code: sub.code,
                          category: sub.category,
                          stream: sub.stream,
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                      title="Edit Subject"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleSubject(selectedGradeId, sub.id)}
                      className="p-1.5 cursor-pointer transition-colors"
                      title={isSubDisabled ? 'Enable Subject' : 'Disable Subject'}
                    >
                      {!isSubDisabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirmTarget({
                          type: 'subject',
                          classId: selectedGradeId,
                          subjectId: sub.id,
                          name: sub.name,
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEVEL 3: TOPICS & LEVEL 4: TESTS */}
        {currentSubject && (
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#1E293B] text-white text-xs font-bold font-mono">
                    Class {selectedGradeId} - {currentSubject.name}
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-[#2F241C]">
                    Level 3: Topics & Level 4: Tests
                  </h3>
                </div>
                <p className="text-xs text-[#7A6656] mt-0.5">
                  Enable/disable specific topics or drill in to toggle and edit individual tests.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewTopicChapterNum((currentSubject.topics.length || 0) + 1);
                  setIsAddTopicModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Topic</span>
              </button>
            </div>

            {currentSubject.topics.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E8DFC8]">
                <p className="text-xs text-[#8C7A6B]">
                  No chapters yet in this subject. Click "Add New Topic" to create one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentSubject.topics.map((top) => {
                  const isTopDisabled = disabledEntities.topics[top.id] === true;
                  const isExpanded = expandedTopicId === top.id;

                  return (
                    <div
                      key={top.id}
                      className="p-4 rounded-2xl border border-[#E8DFC8] bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-[#FAF6F0] border border-[#E8DFC8] text-[#554235] font-bold text-xs">
                              Ch. {top.chapterNumber}
                            </span>
                            <span className="font-heading font-extrabold text-sm text-[#2F241C]">
                              {top.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                !isTopDisabled
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {!isTopDisabled ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                          <p className="text-xs text-[#7A6656] mt-1.5 leading-relaxed">
                            {top.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() =>
                              setEditingTopic({
                                topic: top,
                                title: top.title,
                                summary: top.summary,
                                chapterNumber: top.chapterNumber,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                            title="Edit Chapter"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onToggleTopic(top.id)}
                            className="p-1.5 cursor-pointer transition-colors"
                            title={isTopDisabled ? 'Enable Topic' : 'Disable Topic'}
                          >
                            {!isTopDisabled ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-300" />
                            )}
                          </button>

                          <button
                            onClick={() => setExpandedTopicId(isExpanded ? null : top.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isExpanded
                                ? 'bg-[#1E293B] text-white shadow-xs'
                                : 'bg-[#FAF6F0] hover:bg-[#EFE5D8] text-[#554235] border border-[#DDD0BF]'
                            }`}
                          >
                            <span>Tests ({top.tests.length})</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirmTarget({
                                type: 'topic',
                                classId: selectedGradeId,
                                subjectId: currentSubject.id,
                                topicId: top.id,
                                name: top.title,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* LEVEL 4: TESTS EXPANDABLE TRAY */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-[#F0E6D8] space-y-2.5 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A6656]">
                              Level 4: Assessments in this Chapter ({top.tests.length})
                            </span>
                            <button
                              onClick={() =>
                                setTestBuilderTarget({
                                  topic: top,
                                  initialTest: null,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Test</span>
                            </button>
                          </div>

                          {top.tests.length === 0 ? (
                            <p className="text-xs text-[#8C7A6B] py-2 italic">
                              No tests configured yet. Click "Add Test" to build an interactive quiz.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              {top.tests.map((test) => {
                                const isTestDisabled = disabledEntities.tests[test.id] === true;
                                return (
                                  <div
                                    key={test.id}
                                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-between text-xs"
                                  >
                                    <div>
                                      <span className="font-bold text-[#2F241C] block truncate max-w-[180px]">
                                        {test.title}
                                      </span>
                                      <span className="text-[10px] text-[#7A6656]">
                                        {test.questions.length} Qs · {test.durationMinutes}m · {test.marks || 15} Marks
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => onToggleTest(test.id)}
                                        className="p-1 cursor-pointer"
                                        title={isTestDisabled ? 'Enable Test' : 'Disable Test'}
                                      >
                                        {!isTestDisabled ? (
                                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                          <ToggleLeft className="w-4 h-4 text-slate-300" />
                                        )}
                                      </button>

                                      <button
                                        onClick={() =>
                                          setTestBuilderTarget({
                                            topic: top,
                                            initialTest: test,
                                          })
                                        }
                                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                        title="Edit Test"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </button>

                                      <button
                                        onClick={() =>
                                          setDeleteConfirmTarget({
                                            type: 'test',
                                            classId: selectedGradeId,
                                            subjectId: currentSubject.id,
                                            topicId: top.id,
                                            testId: test.id,
                                            name: test.title,
                                          })
                                        }
                                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                        title="Delete Test"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PERFORMANCE CHARTS & VISUALIZATIONS (BAR + DONUT) */}
      {/* ========================================================================= */}
      {(activeAdminTab === 'all' || activeAdminTab === 'analytics') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class-Wise Average Scores */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#D46244]" />
              <h3 className="font-heading font-extrabold text-base text-[#2F241C]">
                Class-Wise Average Scores (%)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              +4.8% vs last month
            </span>
          </div>
          <p className="text-xs text-[#7A6656] mb-4">
            Aggregated assessment performance across standards 6 through 12
          </p>
          <div className="h-64 w-full relative">
            <canvas ref={classChartRef} />
          </div>
        </div>

        {/* Subject Assessment Distribution */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D46244]" />
              <h3 className="font-heading font-extrabold text-base text-[#2F241C]">
                Subject Assessment Distribution
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
              4,918 Attempts Today
            </span>
          </div>
          <p className="text-xs text-[#7A6656] mb-4">
            Volume of tests attempted broken down by primary subject category
          </p>
          <div className="h-64 w-full relative">
            <canvas ref={subjectDonutChartRef} />
          </div>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ENROLLED STUDENT METRICS & STUDENT MANAGEMENT (CRUD TABLE) */}
      {/* ========================================================================= */}
      {(activeAdminTab === 'all' || activeAdminTab === 'students') && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DFD3C3] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE5D8]">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D46244]" />
              <h3 className="font-heading font-extrabold text-lg text-[#2F241C]">
                Enrolled Student Metrics & Recent Activity
              </h3>
            </div>
            <p className="text-xs text-[#7A6656] mt-0.5">
              Real-time audit log of active learners, completion tallies, and database records.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#6E5D4F] border border-[#E0D5C5] text-xs font-bold">
              {filteredStudents.length} Registered Records
            </span>

            <button
              onClick={() => {
                setStudentModalError('');
                setNewStudentName('');
                setNewStudentUsername('');
                setNewStudentMobile('');
                setNewStudentClass('10');
                setNewStudentPassword('');
                setShowNewStudentPassword(false);
                setIsAddStudentModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#948375]" />
            <input
              type="text"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder="Search by student name, @username, or mobile..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#DDD0BF] text-[#2F241C] text-xs font-semibold placeholder-[#9E8E80] focus:outline-none focus:ring-2 focus:ring-[#D46244]/30"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#7A6656]">Filter Class:</span>
              <select
                value={studentClassFilter}
                onChange={(e) => setStudentClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#DDD0BF] text-xs font-bold text-[#2F241C] focus:outline-none focus:ring-2 focus:ring-[#D46244]/30 cursor-pointer"
              >
                <option value="all">All Standards (6-12)</option>
                {CLASSES_LIST.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#E8DFC8]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8DFC8] text-[#7A6858] font-bold uppercase tracking-wider bg-[#FAF6F0]">
                <th className="py-3 px-4">STUDENT NAME</th>
                <th className="py-3 px-4">STANDARD</th>
                <th className="py-3 px-4">MOBILE</th>
                <th className="py-3 px-4 text-center">TESTS COMPLETED</th>
                <th className="py-3 px-4 text-center">AVERAGE SCORE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8] font-medium text-[#3A2E24]">
              {isLoadingStudents ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#7A6656]">
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4 animate-spin text-[#D46244]" />
                      <span>Loading student records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7A6656]">
                    <Users className="w-8 h-8 text-[#C4B5A5] mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#3A2E24]">No students found</p>
                    <p className="text-xs mt-0.5">
                      {studentSearchQuery || studentClassFilter !== 'all'
                        ? 'Try clearing your search query or class filter.'
                        : 'Click "Add New Student" above to create your first student record.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2F241C]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D46244] to-[#B3492F] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                          {st.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block">{st.name}</span>
                          <span className="text-[10px] text-[#8C7A6B] font-mono font-normal">
                            @{st.username}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F2E8DC] text-[#4A392D] font-bold text-[11px] border border-[#E3D6C5]">
                        Class {st.current_class}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#6E5D4F]">
                      {st.mobile ? (
                        <span>+91 {st.mobile}</span>
                      ) : (
                        <span className="text-slate-400 italic">No phone</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold">
                      {st.tests_count ?? 0}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          (st.average_score ?? 0) >= 80
                            ? 'bg-emerald-50 text-emerald-700'
                            : (st.average_score ?? 0) >= 60
                            ? 'bg-amber-50 text-amber-700'
                            : (st.average_score ?? 0) > 0
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {st.average_score ? `${st.average_score}%` : 'N/A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                          title="View student profile details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditStudent(st)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFE5D8] hover:bg-[#E5D9CB] text-[#4A3B30] font-bold text-[11px] cursor-pointer transition-colors border border-[#DDD0BF]"
                          title="Edit student and reset password"
                        >
                          <Pencil className="w-3 h-3 text-[#D46244]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setDeletingStudent(st)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                          title="Delete student record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD NEW STUDENT */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setIsAddStudentModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#D46244]/10 text-[#D46244] flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight">
                  Add New Student
                </h3>
                <span className="text-[11px] font-bold text-[#8C7A6B]">
                  Persists into database user store
                </span>
              </div>
            </div>

            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Enter the student's name, username, mobile, class, and plain-text password.
            </p>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Unique Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-mono font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={newStudentUsername}
                    onChange={(e) => setNewStudentUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="aarav10"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 lowercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={newStudentMobile}
                    onChange={(e) => setNewStudentMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Enrolled Class / Standard *
                </label>
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value as ClassLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 cursor-pointer"
                >
                  {CLASSES_LIST.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      Class {cls.id} ({cls.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Initial Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewStudentPassword ? 'text' : 'password'}
                    required
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    placeholder="Enter student password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewStudentPassword(!showNewStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#564335] cursor-pointer"
                  >
                    {showNewStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {studentModalError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {studentModalError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStudent}
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingStudent ? 'Creating...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT & RESET PASSWORD */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#D46244]/10 text-[#D46244] flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight">
                  Edit Student Profile
                </h3>
                <span className="text-[11px] font-mono text-[#8C7A6B]">
                  ID: {editingStudent.id}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Update student details or set a new password. Changes take effect immediately.
            </p>

            <form onSubmit={handleSaveEditStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] font-mono font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={editStudentUsername}
                    onChange={(e) => setEditStudentUsername(e.target.value.replace(/\s+/g, ''))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 lowercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={editStudentMobile}
                    onChange={(e) => setEditStudentMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Enrolled Class *
                </label>
                <select
                  value={editStudentClass}
                  onChange={(e) => setEditStudentClass(e.target.value as ClassLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40 cursor-pointer"
                >
                  {CLASSES_LIST.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      Class {cls.id} ({cls.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-[#E8DFC8]">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#564335] uppercase tracking-wider">
                    Reset Student Password
                  </label>
                  <span className="text-[10px] text-[#8C7A6B]">Optional</span>
                </div>
                <div className="relative">
                  <input
                    type={showEditStudentPassword ? 'text' : 'password'}
                    value={editStudentPassword}
                    onChange={(e) => setEditStudentPassword(e.target.value)}
                    placeholder="Leave empty to keep unchanged"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D46244]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditStudentPassword(!showEditStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#564335] cursor-pointer"
                  >
                    {showEditStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                  Enter a new password to explicitly overwrite this student's login credentials
                </p>
              </div>

              {studentModalError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {studentModalError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] hover:bg-[#EFE5D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStudent}
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingStudent ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW STUDENT DETAILS */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D46244] to-[#B3492F] text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                {viewingStudent.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-[#2F241C] tracking-tight">
                {viewingStudent.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="font-mono font-bold text-xs text-[#D46244] bg-[#EFE5D8] px-2 py-0.5 rounded-lg border border-[#DDD0BF]">
                  @{viewingStudent.username}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#F2E8DC] text-[#554235]">
                  Class {viewingStudent.current_class}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DFC8] text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E6D8]">
                <span className="text-[#8C7A6B] font-bold uppercase">System ID</span>
                <span className="font-mono text-[#2F241C] font-semibold">{viewingStudent.id}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E6D8]">
                <span className="text-[#8C7A6B] font-bold uppercase">Mobile</span>
                <span className="font-mono text-[#2F241C]">
                  {viewingStudent.mobile ? `+91 ${viewingStudent.mobile}` : 'Not linked'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E6D8]">
                <span className="text-[#8C7A6B] font-bold uppercase">Tests Completed</span>
                <span className="font-bold text-[#2F241C]">{viewingStudent.tests_count ?? 0}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E6D8]">
                <span className="text-[#8C7A6B] font-bold uppercase">Average Score</span>
                <span className="font-bold text-[#D46244]">
                  {viewingStudent.average_score ? `${viewingStudent.average_score}%` : 'No attempts recorded'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8C7A6B] font-bold uppercase">Registered</span>
                <span className="font-mono text-[#2F241C]">
                  {viewingStudent.created_at ? new Date(viewingStudent.created_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6D5A4C] bg-[#EFE5D8] hover:bg-[#E5D9CB] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingStudent;
                  setViewingStudent(null);
                  handleOpenEditStudent(target);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE STUDENT CONFIRMATION */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h4 className="font-heading font-extrabold text-lg text-[#2F241C] tracking-tight">
              Delete Student?
            </h4>
            <p className="text-xs text-[#7A6858] mt-1.5 font-medium leading-relaxed">
              Are you sure you want to permanently delete student{' '}
              <strong>"{deletingStudent.name}"</strong> (@{deletingStudent.username})?
              All associated test attempt records will also be removed.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6D5A4C] bg-[#EFE5D8] hover:bg-[#E5D9CB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingStudent}
                onClick={handleConfirmDeleteStudent}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmittingStudent ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SUBJECT */}
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
              Add New Subject (Class {selectedGradeId})
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Enter subject title, syllabus code, and category.
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  required
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  placeholder="e.g. CS-10"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newSubjectCategory}
                  onChange={(e) => setNewSubjectCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="core">Core Subject</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="humanities">Humanities</option>
                  <option value="languages">Languages</option>
                  <option value="grammar">Grammar</option>
                </select>
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
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW TOPIC */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl p-6 sm:p-7">
            <button
              onClick={() => setIsAddTopicModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-[#6F5B4B] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-[#2F241C] tracking-tight mb-1">
              Add New Chapter
            </h3>
            <p className="text-xs text-[#7A6656] font-medium mb-4">
              Enter chapter number and unit title.
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
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                    Chapter Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="e.g. Quadratic Equations"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Summary / Overview
                </label>
                <textarea
                  rows={2}
                  value={newTopicSummary}
                  onChange={(e) => setNewTopicSummary(e.target.value)}
                  placeholder="Key concepts covered in this chapter..."
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
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Add Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUBJECT */}
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
              Edit Subject
            </h3>

            <form onSubmit={handleSaveEditSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={(e) =>
                    setEditingSubject((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Code
                </label>
                <input
                  type="text"
                  required
                  value={editingSubject.code}
                  onChange={(e) =>
                    setEditingSubject((prev) => (prev ? { ...prev, code: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none uppercase font-mono"
                />
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
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TOPIC */}
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
              Edit Chapter
            </h3>

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
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTopic.title}
                    onChange={(e) =>
                      setEditingTopic((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-[#2F241C] font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564335] uppercase tracking-wider mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
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
                  className="px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST BUILDER MODAL */}
      {testBuilderTarget && (
        <TestBuilderModal
          isOpen={true}
          classId={selectedGradeId}
          subjectId={selectedSubjectId || ''}
          subjectName={currentSubject?.name || 'Subject'}
          topic={testBuilderTarget.topic}
          initialTest={testBuilderTarget.initialTest}
          onClose={() => setTestBuilderTarget(null)}
          onSaveTest={(clsId, subId, topId, savedTest) => {
            if (testBuilderTarget.initialTest) {
              onUpdateTest(clsId, subId, topId, savedTest);
              showNotice(`Test "${savedTest.title}" updated.`);
            } else {
              onAddTest(clsId, subId, topId, savedTest);
              showNotice(`New test "${savedTest.title}" added to chapter.`);
            }
            setTestBuilderTarget(null);
          }}
        />
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