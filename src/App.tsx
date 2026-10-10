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
import { Footer } from './components/Footer';
import { CLASSES_LIST, INITIAL_USER_PROFILE } from './data/curriculumData';
import {
  ClassLevel,
  Subject,
  ChapterTopic,
  TopicTest,
  ActiveTestState,
  UserProfile,
  UserTestRecord,
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'classes' | 'subjects' | 'topics' | 'profile' | 'dashboard'>('classes');
  const [selectedClassId, setSelectedClassId] = useState<ClassLevel>('10');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Test Runner State & Pending test queue for login prompt
  const [activeTestState, setActiveTestState] = useState<ActiveTestState | null>(null);
  const [pendingTestForLogin, setPendingTestForLogin] = useState<{
    topic: ChapterTopic;
    test: TopicTest;
  } | null>(null);

  // Navigate to Subject Selection View
  const handleSelectClass = (classId: ClassLevel) => {
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

  // Handle successful login
  const handleLoginSuccess = (userData: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
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

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans">
      {/* Brand Header with User Profile system */}
      <Header
        onGoHome={handleBackToClasses}
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
            <ClassSelectionView onSelectClass={handleSelectClass} />
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
              onUpdateProfile={handleUpdateProfile}
              onBackToHome={handleBackToClasses}
              onOpenDashboard={() => setActiveView('dashboard')}
            />
          </div>
        )}

        {/* Dedicated Progress Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            <DashboardView
              user={userProfile}
              onBackToHome={handleBackToClasses}
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

      {/* Mobile + OTP Verification Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingTestForLogin(null);
        }}
        onSuccess={handleLoginSuccess}
        targetTestTitle={pendingTestForLogin?.test.title}
        defaultClass={selectedClassId}
      />

      {/* Global Clean Platform Footer */}
      <Footer onSelectClass={handleSelectClass} />
    </div>
  );
}
