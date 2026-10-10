/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
} from './data/curriculumData';
import {
  ClassLevel,
  Subject,
  ChapterTopic,
  TopicTest,
  ActiveTestState,
  UserProfile,
  UserTestRecord,
  GradeStatusMap,
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard'>('classes');
  const [selectedClassId, setSelectedClassId] = useState<ClassLevel>('10');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Admin Master State
  const [adminPassword, setAdminPassword] = useState<string>('12345');
  const [gradeStatus, setGradeStatus] = useState<GradeStatusMap>(DEFAULT_GRADE_STATUS);

  // Test Runner State & Pending test queue for login prompt
  const [activeTestState, setActiveTestState] = useState<ActiveTestState | null>(null);
  const [pendingTestForLogin, setPendingTestForLogin] = useState<{
    topic: ChapterTopic;
    test: TopicTest;
  } | null>(null);

  // Navigate to Subject Selection View
  const handleSelectClass = (classId: ClassLevel) => {
    // If grade is disabled and user is not admin, prevent access
    if (gradeStatus[classId] === false && !(isLoggedIn && userProfile.role === 'admin')) {
      return;
    }
    setSelectedClassId(classId);
    setSelectedSubject(null);
    setActiveView('subjects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Class Selection View
  const handleBackToClasses = () => {
    setActiveView('classes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll directly down to Class Selection Grid (Grades 6-12)
  const handleScrollToGrades = () => {
    if (activeView !== 'classes') {
      setActiveView('classes');
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
    setSelectedSubject(subject);
    setActiveView('topics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Subject Selection View
  const handleBackToSubjects = () => {
    setActiveView('subjects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open interactive Test Taking Engine (only for logged-in users)
  const handleStartTest = (topic: ChapterTopic, test: TopicTest) => {
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

  // Handle Student Login via OTP
  const handleStudentSuccess = (userData: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
      role: 'student',
      name: userData.name || prev.name,
      mobile: userData.mobile || prev.mobile,
      currentClass: userData.currentClass || selectedClassId,
    }));
    setIsLoginModalOpen(false);

    // If student was trying to take a test, launch it immediately!
    if (pendingTestForLogin) {
      handleStartTest(pendingTestForLogin.topic, pendingTestForLogin.test);
      setPendingTestForLogin(null);
    }
  };

  // Handle Admin Login (abt1996 / 12345)
  const handleAdminSuccess = () => {
    setIsLoggedIn(true);
    setUserProfile({
      ...INITIAL_ADMIN_PROFILE,
    });
    setIsLoginModalOpen(false);
    // Directly navigate admin to the control panel dashboard!
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(INITIAL_USER_PROFILE);
    setActiveView('classes');
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

  // Handle Toggle Grade independently by Admin
  const handleToggleGrade = (classId: ClassLevel) => {
    setGradeStatus((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  // Handle Set All Grades
  const handleSetAllGrades = (enabled: boolean) => {
    setGradeStatus({
      '6': enabled,
      '7': enabled,
      '8': enabled,
      '9': enabled,
      '10': enabled,
      '11': enabled,
      '12': enabled,
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans">
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
        onOpenProfile={() => setActiveView('profile')}
        onOpenDashboard={() => setActiveView('dashboard')}
        onLogout={handleLogout}
      />

      {/* Main View Area with Smooth Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-300">
        {/* View 1: Home Page (Class Selection) */}
        {activeView === 'classes' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <ClassSelectionView
              onSelectClass={handleSelectClass}
              gradeStatus={gradeStatus}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {/* View 2: Subject Selection */}
        {activeView === 'subjects' && selectedClassId && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <SubjectSelectionView
              classId={selectedClassId}
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
              onOpenDashboard={() => setActiveView('dashboard')}
            />
          </div>
        )}

        {/* Progress Dashboard View: Admin Control Panel OR Student Visual Progress Graphs */}
        {activeView === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            {isAdmin ? (
              <AdminDashboardView
                adminUser={userProfile}
                gradeStatus={gradeStatus}
                onToggleGrade={handleToggleGrade}
                onSetAllGrades={handleSetAllGrades}
                onBackToHome={handleBackToClasses}
                onChangePasswordClick={() => setActiveView('profile')}
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
