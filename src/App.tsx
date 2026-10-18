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
import { LeaderboardView } from './components/LeaderboardView';
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
  NestedSubTopic,
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
import {
  fetchLiveCurriculum,
  seedDatabaseCurriculum,
  createSubjectApi,
  updateSubjectApi,
  deleteSubjectApi,
  createTopicApi,
  updateTopicApi,
  deleteTopicApi,
  toggleEntityVisibility,
  submitTestAttempt,
} from './services/curriculumApi';
import { ShieldAlert } from 'lucide-react';

// Maps raw API subject records into the frontend Record<string, Subject[]> curriculum store
function mapApiSubjectsToStore(subjects: any[]): Record<string, Subject[]> {
  const store: Record<string, Subject[]> = {};
  for (const sub of subjects) {
    const classKey = String(sub.class_id || sub.classId || '10');
    if (!store[classKey]) {
      store[classKey] = [];
    }
    
    const mappedTopics: ChapterTopic[] = (sub.topics || []).map((top: any) => {
      // Find matching default topic to preserve subTopics (e.g. ALL_12_TENSES for Tenses chapter)
      let defaultSubTopics: NestedSubTopic[] = [];
      const classSubjects = SUBJECTS_BY_CLASS[classKey] || [];
      const matchingSub = classSubjects.find((s) => s.id === sub.id || s.name === sub.name);
      if (matchingSub) {
        const matchingTop = matchingSub.topics.find((t) => t.id === top.id || t.title === top.title);
        if (matchingTop?.subTopics) {
          defaultSubTopics = matchingTop.subTopics;
        }
      }

      return {
        id: top.id,
        chapterNumber: top.chapter_number ?? top.chapterNumber ?? 1,
        title: top.title,
        summary: top.summary || '',
        subTopics: Array.isArray(top.subTopics) && top.subTopics.length > 0 ? top.subTopics : defaultSubTopics,
        tests: (top.tests || []).map((tst: any) => ({
          id: tst.id,
          title: tst.title || 'Assessment Test',
          type: tst.type || 'concept',
          badge: tst.badge || 'Chapter Quiz',
          questionsCount: tst.questions_count ?? tst.questionsCount ?? (tst.questions?.length || 0),
          durationMinutes: tst.duration_minutes ?? tst.durationMinutes ?? 15,
          marks: tst.marks ?? 20,
          difficulty: tst.difficulty || 'Medium',
          questions: (tst.questions || []).map((q: any) => ({
            id: q.id,
            question: q.question_text ?? q.question ?? 'Missing Question',
            options: Array.isArray(q.options) && q.options.length > 0 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: q.correct_index ?? q.correctIndex ?? 0,
            explanation: q.explanation || '',
            imageUrl: q.image_url ?? q.imageUrl ?? null,
          })),
        })),
      };
    });

    store[classKey].push({
      id: sub.id,
      name: sub.name,
      code: sub.code,
      icon: sub.icon || 'BookOpen',
      colorScheme: sub.colorScheme || {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      category: sub.category || 'core',
      stream: sub.stream || 'General',
      topics: mappedTopics,
    });
  }
  return store;
}
export default function App() {
  const [activeView, setActiveView] = useState<'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard' | 'leaderboard'>('classes');
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

  // Reactive Curriculum Store initialized empty and populated via fetchLiveCurriculum()
  const [curriculumStore, setCurriculumStore] = useState<Record<string, Subject[]>>({});

  // Populate curriculumStore from MySQL on mount; seed if database is empty
  useEffect(() => {
    let isMounted = true;

    const loadCurriculum = async () => {
      try {
        let liveSubjects = await fetchLiveCurriculum();
        if (!liveSubjects || liveSubjects.length === 0) {
          console.log('[Curriculum] Database empty. Seeding NCERT modules to MySQL...');
          await seedDatabaseCurriculum(SUBJECTS_BY_CLASS);
          liveSubjects = await fetchLiveCurriculum();
        }

        if (isMounted) {
          if (liveSubjects && liveSubjects.length > 0) {
            const mapped = mapApiSubjectsToStore(liveSubjects);
            setCurriculumStore(mapped);
          } else {
            setCurriculumStore(SUBJECTS_BY_CLASS);
          }
        }
      } catch (err) {
        console.warn('[Curriculum] Live curriculum fetch warning, fallback to local store:', err);
        if (isMounted) {
          setCurriculumStore(SUBJECTS_BY_CLASS);
        }
      }
    };

    loadCurriculum();

    return () => {
      isMounted = false;
    };
  }, []);

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
          username: existingSession.identifier || prev.username,
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
          'Security Alert: Unauthorized test access blocked. Valid student login session required.'
        );
        setTimeout(() => setSecurityNotice(null), 4000);
      }
    }
  }, [activeTestState]);

  // Safe navigation with client-side Route Guard middleware
  const navigateToView = (
    targetView: 'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard' | 'leaderboard',
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

  // Handle Student Login: sets verified session token in sessionStorage & persists across platform
  const handleStudentSuccess = (userData: Partial<UserProfile> & { token?: string }) => {
    const studentName = userData.name || 'Abhay';
    const identifier = userData.username || userData.mobile || 'student1';

    // Create session in sessionStorage
    const session = createAuthSession('student', identifier, studentName);
    if (userData.token) {
      try {
        const stored = sessionStorage.getItem('examworld_secure_session_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.token = userData.token;
          sessionStorage.setItem('examworld_secure_session_v1', JSON.stringify(parsed));
        }
      } catch (err) {
        console.warn('Could not update session token in sessionStorage:', err);
      }
    }

    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
      id: userData.id || prev.id,
      role: 'student',
      name: studentName,
      username: userData.username || prev.username,
      mobile: userData.mobile || prev.mobile,
      currentClass: userData.currentClass || selectedClassId,
      token: userData.token || session.token,
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

  // Level 2: Toggle Subject - persists in MySQL via PATCH /api/admin/toggle
  const handleToggleSubject = async (classId: ClassLevel, subjectId: string) => {
    const key = `${classId}:${subjectId}`;
    const isCurrentlyDisabled = disabledEntities.subjects[key] === false || disabledEntities.subjects[subjectId] === false;
    const nextVal = isCurrentlyDisabled ? true : false;

    try {
      await toggleEntityVisibility('subject', subjectId, nextVal);
    } catch (err) {
      console.warn('[Curriculum] Subject visibility toggle warning:', err);
    }

    setDisabledEntities((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [key]: nextVal,
        [subjectId]: nextVal,
      },
    }));
  };

  // Level 3: Toggle Topic - persists in MySQL via PATCH /api/admin/toggle
  const handleToggleTopic = async (topicId: string) => {
    const isCurrentlyDisabled = disabledEntities.topics[topicId] === false;
    const nextVal = isCurrentlyDisabled ? true : false;

    try {
      await toggleEntityVisibility('topic', topicId, nextVal);
    } catch (err) {
      console.warn('[Curriculum] Topic visibility toggle warning:', err);
    }

    setDisabledEntities((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [topicId]: nextVal,
      },
    }));
  };

  // Level 4: Toggle Test - persists in MySQL via PATCH /api/admin/toggle
  const handleToggleTest = async (testId: string) => {
    const isCurrentlyDisabled = disabledEntities.tests[testId] === false;
    const nextVal = isCurrentlyDisabled ? true : false;

    try {
      await toggleEntityVisibility('test', testId, nextVal);
    } catch (err) {
      console.warn('[Curriculum] Test visibility toggle warning:', err);
    }

    setDisabledEntities((prev) => ({
      ...prev,
      tests: {
        ...prev.tests,
        [testId]: nextVal,
      },
    }));
  };

  // Add Subject dynamically into curriculum store after persisting to MySQL
  const handleAddSubject = async (classId: ClassLevel, newSubject: Subject) => {
    try {
      await createSubjectApi({
        id: newSubject.id,
        classId,
        name: newSubject.name,
        code: newSubject.code,
        category: newSubject.category,
        stream: newSubject.stream,
        isActive: true,
      });
    } catch (err) {
      console.warn('[Curriculum] Error persisting subject:', err);
    }

    setCurriculumStore((prev) => {
      const currentList = prev[classId] || [];
      return {
        ...prev,
        [classId]: [newSubject, ...currentList],
      };
    });
  };

  // Delete Subject dynamically from curriculum store after deleting from MySQL
  const handleDeleteSubject = async (classId: ClassLevel, subjectId: string) => {
    try {
      await deleteSubjectApi(subjectId);
    } catch (err) {
      console.warn('[Curriculum] Error deleting subject:', err);
    }

    setCurriculumStore((prev) => {
      const currentList = prev[classId] || [];
      return {
        ...prev,
        [classId]: currentList.filter((s) => s.id !== subjectId),
      };
    });
  };

  // Add Topic dynamically into selected subject after persisting to MySQL
  const handleAddTopic = async (classId: ClassLevel, subjectId: string, newTopic: ChapterTopic) => {
    try {
      await createTopicApi({
        id: newTopic.id,
        subjectId,
        chapterNumber: newTopic.chapterNumber,
        title: newTopic.title,
        summary: newTopic.summary,
        isActive: true,
      });
    } catch (err) {
      console.warn('[Curriculum] Error persisting topic:', err);
    }

    // SAFEGUARD: Ensure tests array exists so React never crashes into a black screen!
    const safeTopic = { ...newTopic, tests: newTopic.tests || [] };

    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updated = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: [...sub.topics, safeTopic],
          };
        }
        return sub;
      });

      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) => (s ? { ...s, topics: [...s.topics, safeTopic] } : null));
      }

      return {
        ...prev,
        [classId]: updated,
      };
    });
  };
  // Delete Topic dynamically from selected subject after deleting from MySQL
  const handleDeleteTopic = async (classId: ClassLevel, subjectId: string, topicId: string) => {
    try {
      await deleteTopicApi(topicId);
    } catch (err) {
      console.warn('[Curriculum] Error deleting topic:', err);
    }

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

  // Add Test dynamically into selected topic and send to Python Backend
  
  // Update Subject details (rename, code, category, stream) - persists to MySQL via PUT /api/admin/subjects/{id}
  const handleUpdateSubject = async (
    classId: ClassLevel,
    subjectId: string,
    updated: Partial<Subject>
  ) => {
    try {
      await updateSubjectApi(subjectId, {
        classId,
        name: updated.name,
        code: updated.code,
        category: updated.category,
        stream: updated.stream,
      });
    } catch (err) {
      console.warn('[Curriculum] Error updating subject in database:', err);
    }

    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updatedList = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return { ...sub, ...updated };
        }
        return sub;
      });

      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) => (s ? { ...s, ...updated } : null));
      }

      return {
        ...prev,
        [classId]: updatedList,
      };
    });
  };

  // Update Topic details (title, summary, chapterNumber) - persists to MySQL via PUT /api/admin/topics/{id}
  // Update Topic details (title, summary, chapterNumber) - persists to MySQL via PUT /api/admin/topics/{id}
  const handleUpdateTopic = async (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    updatedTopic: Partial<ChapterTopic>
  ) => {
    try {
      await updateTopicApi(topicId, {
        subjectId: subjectId, // <-- FIX: This was missing, causing silent database rejections
        title: updatedTopic.title,
        summary: updatedTopic.summary,
        chapterNumber: updatedTopic.chapterNumber,
      });
    } catch (err) {
      console.warn('[Curriculum] Error updating topic in database:', err);
    }

    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updatedList = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((t) => {
              if (t.id === topicId) {
                return { ...t, ...updatedTopic };
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
            topics: s.topics.map((t) => (t.id === topicId ? { ...t, ...updatedTopic } : t)),
          };
        });
      }

      return {
        ...prev,
        [classId]: updatedList,
      };
    });
  };
  // Update Subtopic / Tense details
  const handleUpdateSubTopic = (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    subTopicId: string,
    updatedSub: Partial<NestedSubTopic>
  ) => {
    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updatedList = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((t) => {
              if (t.id === topicId && t.subTopics) {
                return {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId ? { ...st, ...updatedSub } : st
                  ),
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
            topics: s.topics.map((t) => {
              if (t.id === topicId && t.subTopics) {
                return {
                  ...t,
                  subTopics: t.subTopics.map((st) =>
                    st.id === subTopicId ? { ...st, ...updatedSub } : st
                  ),
                };
              }
              return t;
            }),
          };
        });
      }

      return {
        ...prev,
        [classId]: updatedList,
      };
    });
  };

  // Update Test details & questions
  
  // Add Test dynamically into selected topic and send to Python Backend
  const handleAddTest = async (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    newTest: TopicTest
  ) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/tests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newTest.id,
          topic_id: topicId,
          title: newTest.title,
          durationMinutes: newTest.durationMinutes,
          marks: newTest.marks,
          difficulty: newTest.difficulty,
          questions: newTest.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            imageUrl: q.imageUrl || null
          }))
        }),
      });

      // STRICT CHECK: If MySQL fails, stop immediately and show the exact error!
      if (!response.ok) {
        const errorMsg = await response.text();
        alert("Database Error: Could not save test to MySQL. \n\nDetails: " + errorMsg);
        return; 
      }

      // ONLY update the UI if the database successfully saved it
      setCurriculumStore((prev) => {
        const classSubjects = prev[classId] || [];
        const updated = classSubjects.map((sub) => {
          if (sub.id === subjectId) {
            return {
              ...sub,
              topics: sub.topics.map((t) => t.id === topicId ? { ...t, tests: [...(t.tests || []), newTest] } : t),
            };
          }
          return sub;
        });

        if (selectedSubject && selectedSubject.id === subjectId) {
          setSelectedSubject((s) => s ? {
            ...s,
            topics: s.topics.map((t) => t.id === topicId ? { ...t, tests: [...(t.tests || []), newTest] } : t),
          } : null);
        }
        return { ...prev, [classId]: updated };
      });
    } catch (error) {
      console.warn("Error saving test to backend:", error);
      alert("Network Error: Could not connect to Python server. Is it running?");
    }
  };
  // Delete Test dynamically from MySQL and local state
  const handleDeleteTest = async (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    testId: string
  ) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/tests/${testId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[Curriculum] Error deleting test:', err);
    }

    setCurriculumStore((prev) => {
      const classSubjects = prev[classId] || [];
      const updated = classSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((t) => t.id === topicId ? {
              ...t,
              tests: (t.tests || []).filter((test) => test.id !== testId),
            } : t),
          };
        }
        return sub;
      });

      if (selectedSubject && selectedSubject.id === subjectId) {
        setSelectedSubject((s) => s ? {
          ...s,
          topics: s.topics.map((t) => t.id === topicId ? { ...t, tests: (t.tests || []).filter((test) => test.id !== testId) } : t),
        } : null);
      }
      return { ...prev, [classId]: updated };
    });
  };

  // Update Test details & questions (Sends to same Add endpoint to UPSERT)
  const handleUpdateTest = async (
    classId: ClassLevel,
    subjectId: string,
    topicId: string,
    updatedTest: TopicTest
  ) => {
    try {
      await fetch('http://127.0.0.1:8000/api/admin/tests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedTest.id,
          topic_id: topicId,
          title: updatedTest.title,
          durationMinutes: updatedTest.durationMinutes,
          marks: updatedTest.marks,
          difficulty: updatedTest.difficulty,
          questions: updatedTest.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            imageUrl: q.imageUrl || null
          }))
        }),
      });

      setCurriculumStore((prev) => {
        const classSubjects = prev[classId] || [];
        const updatedList = classSubjects.map((sub) => {
          if (sub.id === subjectId) {
            return {
              ...sub,
              topics: sub.topics.map((t) => t.id === topicId ? {
                ...t,
                tests: (t.tests || []).map((test) => test.id === updatedTest.id ? updatedTest : test),
              } : t),
            };
          }
          return sub;
        });

        if (selectedSubject && selectedSubject.id === subjectId) {
          setSelectedSubject((s) => s ? {
            ...s,
            topics: s.topics.map((t) => t.id === topicId ? {
              ...t,
              tests: (t.tests || []).map((test) => test.id === updatedTest.id ? updatedTest : test),
            } : t),
          } : null);
        }
        return { ...prev, [classId]: updatedList };
      });
    } catch (err) {
      console.warn("Error updating test:", err);
    }
  };
  // When a test is completed in the test runner, dynamically append to user history with granular time tracking
  const handleRecordTestCompleted = async (
    score: number,
    totalMarks: number,
    percentage: number,
    totalTimeSpentSeconds?: number,
    timeSpentPerQuestion?: number[]
  ) => {
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
      timeSpentMinutes: totalTimeSpentSeconds
        ? Math.max(1, Math.round(totalTimeSpentSeconds / 60))
        : activeTestState.test.durationMinutes,
      totalTimeSpentSeconds: totalTimeSpentSeconds || activeTestState.test.durationMinutes * 60,
      timeSpentPerQuestion,
    };

    setUserProfile((prev) => ({
      ...prev,
      testHistory: [newRecord, ...prev.testHistory],
    }));

    // Post to unified backend API and await result
    try {
      await submitTestAttempt({
        user_id: userProfile.id || 'usr-student-local',
        test_id: activeTestState.test.id,
        score,
        totalMarks,
        percentage,
        totalTimeSpentSeconds: totalTimeSpentSeconds || activeTestState.test.durationMinutes * 60,
        timeSpentPerQuestion: timeSpentPerQuestion || [],
      });
      console.log('[Exam WORLD] Test submission persisted to MySQL successfully.');
    } catch (err) {
      console.warn('[Exam WORLD] Failed to record test submission to backend:', err);
    }
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
        onOpenLeaderboard={() => navigateToView('leaderboard')}
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
                onUpdateSubject={handleUpdateSubject}
                onAddTopic={handleAddTopic}
                onDeleteTopic={handleDeleteTopic}
                onUpdateTopic={handleUpdateTopic}
                onUpdateSubTopic={handleUpdateSubTopic}
                onAddTest={handleAddTest}
                onDeleteTest={handleDeleteTest}
                onUpdateTest={handleUpdateTest}
                onSetAllGrades={handleSetAllGrades}
                onBackToHome={handleBackToClasses}
                onChangePasswordClick={() => navigateToView('profile')}
                onOpenLeaderboard={() => navigateToView('leaderboard')}
              />
            ) : (
              <DashboardView
                user={userProfile}
                onBackToHome={handleBackToClasses}
                onSelectClassToPractice={handleBackToClasses}
                onOpenLeaderboard={() => navigateToView('leaderboard')}
              />
            )}
          </div>
        )}

        {/* Global Student Leaderboard View */}
        {activeView === 'leaderboard' && (
          <div className="animate-in fade-in duration-200">
            <LeaderboardView
              currentUser={isLoggedIn ? userProfile : null}
              onBackToDashboard={() => navigateToView('dashboard', isAdmin)}
              onSelectClassToPractice={handleBackToClasses}
            />
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
