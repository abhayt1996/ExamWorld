/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ClassSelectionView } from './components/ClassSelectionView';
import { SubjectSelectionView } from './components/SubjectSelectionView';
import { TopicsView } from './components/TopicsView';
import { TestRunnerModal } from './components/TestRunnerModal';
import { LoginModal } from './components/LoginModal';
import { ProfileView } from './components/ProfileView';
import { DashboardView } from './components/DashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { Footer } from './components/Footer';
import {
  CLASSES_LIST,
  INITIAL_USER_PROFILE,
  INITIAL_ADMIN_PROFILE,
  DEFAULT_GRADE_STATUS,
  SUBJECTS_BY_CLASS,
} from './data/curriculumData';
import {
  ClassLevel,
  Subject,
  ChapterTopic,
  TopicTest,
  ActiveTestState,
  UserProfile,
  UserTestRecord,
  DisabledEntitiesMap,
} from './types';
import {
  createAuthSession,
  getActiveAuthSession,
  clearAuthSession,
  executeRouteGuard,
  secureVault,
} from './utils/security';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard'>('classes');
  const [selectedClassId, setSelectedClassId] = useState<ClassLevel>('10');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Security Route Guard Alert Banner
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  // Hierarchical Availability State (Grades, Subjects, Topics, Tests)
  const [disabledEntities, setDisabledEntities] = useState<DisabledEntitiesMap>(() => ({
    grades: { ...DEFAULT_GRADE_STATUS },
    subjects: {},
    topics: {},
    tests: {},
  }));

  // Reactive Curriculum Store allowing dynamic additions, deletions, and edits
  const [curriculumStore, setCurriculumStore] = useState<Record<string, Subject[]>>(() => ({
    ...SUBJECTS_BY_CLASS,
  }));

  // Admin Master Password State
  const [adminPassword, setAdminPassword] = useState<string>('12345');

  // Test Runner State & Pending test queue for login prompt
  const [activeTestState, setActiveTestState] = useState<ActiveTestState | null>(null);
  const [pendingTestForLogin, setPendingTestForLogin] = useState<{
    topic: ChapterTopic;
    test: TopicTest;
  } | null>(null);

  // Check existing session token on mount (Strict Client-Side Route Guard initialization)
  useEffect(() => {
    const existingSession = getActiveAuthSession();
    if (existingSession) {
      setIsLoggedIn(true);
      if (existingSession.role === 'admin') {
        setUserProfile(INITIAL_ADMIN_PROFILE);
      } else {
        setUserProfile((prev) => ({
          ...prev,
          name: existingSession.name || prev.name,
          mobile: existingSession.identifier || prev.mobile,
          role: 'student',
        }));
      }
    }
  }, []);

  // Strict Middleware-like Route Guard: checks sessionStorage on view or test state change
  useEffect(() => {
    const session = getActiveAuthSession();

    if (activeView === 'dashboard') {
      const isAdminTarget = userProfile.role === 'admin';
      const guard = executeRouteGuard('dashboard', isAdminTarget);
      if (!guard.allowed) {
        setActiveView(guard.targetView);
        if (guard.securityMessage) {
          setSecurityNotice(guard.securityMessage);
          setTimeout(() => setSecurityNotice(null), 4000);
        }
      }
    } else if (activeView === 'profile') {
      const guard = executeRouteGuard('profile', false);
      if (!guard.allowed) {
        setActiveView(guard.targetView);
        if (guard.securityMessage) {
          setSecurityNotice(guard.securityMessage);
          setTimeout(() => setSecurityNotice(null), 4000);
        }
      }
    }
  }, [activeView, userProfile.role]);

  // Protected Test Route Guard: enforces active session before test taking
  useEffect(() => {
    if (activeTestState) {
      const session = getActiveAuthSession();
      if (!session) {
        setActiveTestState(null);
        setActiveView('classes');
        setIsLoginModalOpen(true);
        setSecurityNotice(
          'Security Alert: Unauthorized test access blocked. Valid mobile session required.'
        );
        setTimeout(() => setSecurityNotice(null), 4000);
      }
    }
  }, [activeTestState]);

  // Safe navigation with client-side Route Guard middleware
  const navigateToView = (
    targetView: 'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard',
    targetIsAdmin = false
  ) => {
    const guard = executeRouteGuard(targetView, targetIsAdmin);

    if (!guard.allowed) {
      setActiveView(guard.targetView);
      if (guard.securityMessage) {
        setSecurityNotice(guard.securityMessage);
        setTimeout(() => setSecurityNotice(null), 4000);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Subject Selection View
  const handleSelectClass = (classId: ClassLevel) => {
    // Check if grade is disabled and user is not admin
    const isAdmin = isLoggedIn && userProfile.role === 'admin';
    if (disabledEntities.grades[classId] === false && !isAdmin) {
      setSecurityNotice(`Class ${classId} is temporarily disabled by administrator.`);
      setTimeout(() => setSecurityNotice(null), 3000);
      return;
    }

    setSelectedClassId(classId);
    setSelectedSubject(null);
    navigateToView('subjects');
  };

  // Back to Class Selection View
  const handleBackToClasses = () => {
    navigateToView('classes');
  };

  // Scroll directly down to Class Selection Grid (Grades 6-12)
  const handleScrollToGrades = () => {
    if (activeView !== 'classes') {
      navigateToView('classes');
      setTimeout(() => {
        const gridElem = document.getElementById('class-selection-grid');
        if (gridElem) {
          gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } else {
      const gridElem = document.getElementById('class-selection-grid');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Navigate to Topics & Tests View
  const handleSelectSubject = (subject: Subject) => {
    const subKey = `${selectedClassId}:${subject.id}`;
    const isAdmin = isLoggedIn && userProfile.role === 'admin';

    if (disabledEntities.subjects[subKey] === false && !isAdmin) {
      setSecurityNotice(`Subject "${subject.name}" is currently disabled by administrator.`);
      setTimeout(() => setSecurityNotice(null), 3000);
      return;
    }

    setSelectedSubject(subject);
    navigateToView('topics');
  };

  // Back to Subject Selection View
  const handleBackToSubjects = () => {
    navigateToView('subjects');
  };

  // Open interactive Test Taking Engine (only for logged-in users with active session)
  const handleStartTest = (topic: ChapterTopic, test: TopicTest) => {
    // Route guard check for protected test content
    const session = getActiveAuthSession();
    if (!session || !isLoggedIn) {
      handleRequestLoginForTest(topic, test);
      return;
    }

    // Check if test is disabled
    const isAdmin = session.role === 'admin';
    if (disabledEntities.tests[test.id] === false && !isAdmin) {
      setSecurityNotice(`Test "${test.title}" is currently disabled by administrator.`);
      setTimeout(() => setSecurityNotice(null), 3000);
      return;
    }

    const currentClassInfo = CLASSES_LIST.find((c) => c.id === selectedClassId);
    setActiveTestState({
      topicTitle: topic.title,
      chapterNumber: topic.chapterNumber,
      subjectName: selectedSubject?.name || 'Subject',
      className: currentClassInfo?.name || `Class ${selectedClassId}`,
      test,
    });
  };

  // Trigger login modal if user tries to start test while logged out
  const handleRequestLoginForTest = (topic: ChapterTopic, test: TopicTest) => {
    setPendingTestForLogin({ topic, test });
    setIsLoginModalOpen(true);
  };

  // Handle Student Login via OTP: sets verified session token in sessionStorage
  const handleStudentSuccess = (userData: Partial<UserProfile>) => {
    const studentName = userData.name || 'Aarav Sharma';
    const mobile = userData.mobile || '9876543210';

    // Create session in sessionStorage
    createAuthSession('student', mobile, studentName);

    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
      role: 'student',
      name: studentName,
      mobile,
      currentClass: userData.currentClass || selectedClassId,
    }));
    setIsLoginModalOpen(false);

    // If student was trying to take a test, launch it immediately!
    if (pendingTestForLogin) {
      handleStartTest(pendingTestForLogin.topic, pendingTestForLogin.test);
      setPendingTestForLogin(null);
    }
  };

  // Handle Admin Login (abt1996 / 12345): sets verified admin session token in sessionStorage
  const handleAdminSuccess = () => {
    createAuthSession('admin', 'abt1996', 'Chief Administrator');

    setIsLoggedIn(true);
    setUserProfile({
      ...INITIAL_ADMIN_PROFILE,
    });
    setIsLoginModalOpen(false);
    // Route directly to Admin Dashboard Control Center
    navigateToView('dashboard', true);
  };

  // Handle Logout: destroys sessionStorage token and kicks back to Home
  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setUserProfile(INITIAL_USER_PROFILE);
    navigateToView('classes');
  };

  // Handle Profile Update
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updatedProfile = { ...prev, ...updated };
      if (updated.currentClass) {
        setSelectedClassId(updated.currentClass);
      }
      return updatedProfile;
    });
  };

  // Handle Admin Change Password
  const handleAdminChangePassword = (newPass: string) => {
    setAdminPassword(newPass);
  };

  // Level 1: Toggle Grade
  const handleToggleGrade = (classId: ClassLevel) => {
    setDisabledEntities((prev) => ({
      ...prev,
      grades: {
        ...prev.grades,
        [classId]: !prev.grades[classId],
      },
    }));
  };

  // Level 1: Set All Grades
  const handleSetAllGrades = (enabled: boolean) => {
    setDisabledEntities((prev) => ({
      ...prev,
      grades: {
        '6': enabled,
        '7': enabled,
        '8': enabled,
        '9': enabled,
        '10': enabled,
        '11': enabled,
        '12': enabled,
      },
    }));
  };

  // Level 2: Toggle Subject
  const handleToggleSubject = (classId: ClassLevel, subjectId: string) => {
    const key = `${classId}:${subjectId}`;
    setDisabledEntities((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [key]: prev.subjects[key] === false ? true : false,
      },
    }));
  };

  // Level 3: Toggle Topic
  const handleToggleTopic = (topicId: string) => {
    setDisabledEntities((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [topicId]: prev.topics[topicId] === false ? true : false,
      },
    }));
  };

  // Level 4: Toggle Test
  const handleToggleTest = (testId: string) => {
    setDisabledEntities((prev) => ({
      ...prev,
      tests: {
        ...prev.tests,
        [testId]: prev.tests[testId] === false ? true : false,
      },
    }));
  };

  // Add Subject dynamically into curriculum store
  const handleAddSubject = (classId: ClassLevel, newSubject: Subject) => {
    setCurriculumStore((prev) => {
      const currentList = prev[classId] || [];
      return {
        ...prev,
        [classId]: [newSubject, ...currentList],
      };
    });
  };

  // Delete Subject dynamically from curriculum store
  const handleDeleteSubject = (classId: ClassLevel, subjectId: string) => {
    setCurriculumStore((prev) => {
      const currentList = prev[classId] || [];
      return {
        ...prev,
        [classId]: currentList.filter((s) => s.id !== subjectId),
      };
    });
  };

  // Add Topic dynamically into selected subject
  const handleAddTopic = (classId: ClassLevel, subjectId: string, newTopic: ChapterTopic) => {
    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updated = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: [...sub.topics, newTopic],
          };
        }
        return sub;
      });

      // Also sync selected subject if currently active
      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) => (s ? { ...s, topics: [...s.topics, newTopic] } : null));
      }

      return {
        ...prev,
        [classId]: updated,
      };
    });
  };

  // Delete Topic dynamically from selected subject
  const handleDeleteTopic = (classId: ClassLevel, subjectId: string, topicId: string) => {
    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updated = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.filter((t) => t.id !== topicId),
          };
        }
        return sub;
      });

      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) =>
          s ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) } : null
        );
      }

      return {
        ...prev,
        [classId]: updated,
      };
    });
  };

  // Add Test dynamically into selected topic inside curriculum store
  const handleAddTest = (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    newTest: TopicTest
  ) => {
    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updated = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((t) => {
              if (t.id === topicId) {
                return {
                  ...t,
                  tests: [...t.tests, newTest],
                };
              }
              return t;
            }),
          };
        }
        return sub;
      });

      // Real-time synchronization if this subject is currently active for students
      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) => {
          if (!s) return null;
          return {
            ...s,
            topics: s.topics.map((t) =>
              t.id === topicId ? { ...t, tests: [...t.tests, newTest] } : t
            ),
          };
        });
      }

      return {
        ...prev,
        [classId]: updated,
      };
    });
  };

  // Delete Test dynamically from selected topic inside curriculum store
  const handleDeleteTest = (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    testId: string
  ) => {
    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updated = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((t) => {
              if (t.id === topicId) {
                return {
                  ...t,
                  tests: t.tests.filter((test) => test.id !== testId),
                };
              }
              return t;
            }),
          };
        }
        return sub;
      });

      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) => {
          if (!s) return null;
          return {
            ...s,
            topics: s.topics.map((t) =>
              t.id === topicId
                ? { ...t, tests: t.tests.filter((test) => test.id !== testId) }
                : t
            ),
          };
        });
      }

      return {
        ...prev,
        [classId]: updated,
      };
    });
  };

  // When a test is completed in the test runner, dynamically append to user history
  const handleRecordTestCompleted = (score: number, totalMarks: number, percentage: number) => {
    if (!activeTestState) return;

    const newRecord: UserTestRecord = {
      id: `rec-${Date.now()}`,
      testId: activeTestState.test.id,
      testTitle: activeTestState.test.title,
      subjectName: activeTestState.subjectName,
      className: activeTestState.className,
      chapterTitle: activeTestState.topicTitle,
      score,
      totalMarks,
      percentage,
      date: 'Just now',
      timeSpentMinutes: activeTestState.test.durationMinutes,
    };

    setUserProfile((prev) => ({
      ...prev,
      testHistory: [newRecord, ...prev.testHistory],
    }));
  };

  const selectedClassInfo = CLASSES_LIST.find((c) => c.id === selectedClassId);
  const isAdmin = isLoggedIn && userProfile.role === 'admin';
  const currentClassSubjects = curriculumStore[selectedClassId] || [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans">
      {/* Route Guard Security Alert Banner */}
      {securityNotice && (
        <div className="sticky top-0 z-50 bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-rose-500/30 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{securityNotice}</span>
          </div>
          <button
            onClick={() => setSecurityNotice(null)}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Brand Header with User Profile system */}
      <Header
        onGoHome={handleBackToClasses}
        onScrollToGrades={handleScrollToGrades}
        activeView={activeView}
        selectedClassName={selectedClassInfo?.name}
        selectedSubjectName={selectedSubject?.name}
        isLoggedIn={isLoggedIn}
        user={isLoggedIn ? userProfile : null}
        onOpenLoginModal={() => {
          setPendingTestForLogin(null);
          setIsLoginModalOpen(true);
        }}
        onOpenProfile={() => navigateToView('profile')}
        onOpenDashboard={() => navigateToView('dashboard', isAdmin)}
        onLogout={handleLogout}
      />

      {/* Main View Area with Smooth Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-300">
        {/* View 1: Home Page (Class Selection) */}
        {activeView === 'classes' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <ClassSelectionView
              onSelectClass={handleSelectClass}
              gradeStatus={disabledEntities.grades}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {/* View 2: Subject Selection */}
        {activeView === 'subjects' && selectedClassId && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <SubjectSelectionView
              classId={selectedClassId}
              subjectsList={currentClassSubjects}
              disabledSubjects={disabledEntities.subjects}
              isAdmin={isAdmin}
              onBackToClasses={handleBackToClasses}
              onSelectSubject={handleSelectSubject}
            />
          </div>
        )}

        {/* View 3: Topics & Tests (Full-Width Accordions) */}
        {activeView === 'topics' && selectedSubject && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <TopicsView
              className={selectedClassInfo?.name || `Class ${selectedClassId}`}
              subject={selectedSubject}
              isLoggedIn={isLoggedIn}
              disabledTopics={disabledEntities.topics}
              disabledTests={disabledEntities.tests}
              isAdmin={isAdmin}
              onBackToSubjects={handleBackToSubjects}
              onStartTest={handleStartTest}
              onRequestLoginForTest={handleRequestLoginForTest}
            />
          </div>
        )}

        {/* My Profile View */}
        {activeView === 'profile' && (
          <div className="animate-in fade-in duration-200">
            <ProfileView
              user={userProfile}
              currentAdminPassword={adminPassword}
              onUpdateProfile={handleUpdateProfile}
              onAdminChangePassword={handleAdminChangePassword}
              onBackToHome={handleBackToClasses}
              onOpenDashboard={() => navigateToView('dashboard', isAdmin)}
            />
          </div>
        )}

        {/* Progress Dashboard View: Admin Control Panel OR Student Visual Progress Graphs */}
        {activeView === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            {isAdmin ? (
              <AdminDashboardView
                adminUser={userProfile}
                disabledEntities={disabledEntities}
                curriculumStore={curriculumStore}
                onToggleGrade={handleToggleGrade}
                onToggleSubject={handleToggleSubject}
                onToggleTopic={handleToggleTopic}
                onToggleTest={handleToggleTest}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
                onAddTopic={handleAddTopic}
                onDeleteTopic={handleDeleteTopic}
                onAddTest={handleAddTest}
                onDeleteTest={handleDeleteTest}
                onSetAllGrades={handleSetAllGrades}
                onBackToHome={handleBackToClasses}
                onChangePasswordClick={() => navigateToView('profile')}
              />
            ) : (
              <DashboardView
                user={userProfile}
                onBackToHome={handleBackToClasses}
                onSelectClassToPractice={handleBackToClasses}
              />
            )}
          </div>
        )}
      </main>

      {/* Interactive Full Test Runner Modal */}
      {activeTestState && (
        <TestRunnerModal
          testState={activeTestState}
          onClose={() => setActiveTestState(null)}
          onRecordTestCompleted={handleRecordTestCompleted}
        />
      )}

      {/* Unified Login Modal (Student OTP vs Admin abt1996) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingTestForLogin(null);
        }}
        onStudentSuccess={handleStudentSuccess}
        onAdminSuccess={handleAdminSuccess}
        targetTestTitle={pendingTestForLogin?.test.title}
        defaultClass={selectedClassId}
        currentAdminPassword={adminPassword}
      />

      {/* Global Clean Platform Footer */}
      <Footer onSelectClass={handleSelectClass} />
    </div>
  );
}
