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
import { Footer } from './components/Footer';
import { CLASSES_LIST } from './data/curriculumData';
import { ClassLevel, Subject, ChapterTopic, TopicTest, ActiveTestState } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'classes' | 'subjects' | 'topics'>('classes');
  const [selectedClassId, setSelectedClassId] = useState<ClassLevel>('10');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeTestState, setActiveTestState] = useState<ActiveTestState | null>(null);

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

  // Open interactive Test Taking Engine
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

  // Close Test modal
  const handleCloseTest = () => {
    setActiveTestState(null);
  };

  const selectedClassInfo = CLASSES_LIST.find((c) => c.id === selectedClassId);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans">
      {/* Brand Header */}
      <Header
        onGoHome={handleBackToClasses}
        activeView={activeView}
        selectedClassName={selectedClassInfo?.name}
        selectedSubjectName={selectedSubject?.name}
      />

      {/* Main View Area with Smooth Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-300">
        {activeView === 'classes' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <ClassSelectionView onSelectClass={handleSelectClass} />
          </div>
        )}

        {activeView === 'subjects' && selectedClassId && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <SubjectSelectionView
              classId={selectedClassId}
              onBackToClasses={handleBackToClasses}
              onSelectSubject={handleSelectSubject}
            />
          </div>
        )}

        {activeView === 'topics' && selectedSubject && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <TopicsView
              className={selectedClassInfo?.name || `Class ${selectedClassId}`}
              subject={selectedSubject}
              onBackToSubjects={handleBackToSubjects}
              onStartTest={handleStartTest}
            />
          </div>
        )}
      </main>

      {/* Interactive Full Test Runner Modal */}
      {activeTestState && (
        <TestRunnerModal
          testState={activeTestState}
          onClose={handleCloseTest}
        />
      )}

      {/* Global Clean Platform Footer */}
      <Footer onSelectClass={handleSelectClass} />
    </div>
  );
}
