import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { ActiveTestState, Question } from '../types';

interface TestRunnerModalProps {
  testState: ActiveTestState;
  onClose: () => void;
  onRecordTestCompleted?: (score: number, totalMarks: number, percentage: number) => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({
  testState,
  onClose,
  onRecordTestCompleted,
}) => {
  const { test, topicTitle, chapterNumber, subjectName, className } = testState;
  const questions: Question[] = test.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);

  // References for scrolling back up to top of question container
  const questionContainerRef = React.useRef<HTMLDivElement>(null);
  const modalBodyRef = React.useRef<HTMLDivElement>(null);

  // Smooth scroll helper ensuring the new question is perfectly in view
  const scrollToQuestionTop = () => {
    // Schedule on next frame for reliable DOM transition
    setTimeout(() => {
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (questionContainerRef.current) {
        questionContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      scrollToQuestionTop();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      scrollToQuestionTop();
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    scrollToQuestionTop();
  };

  // Live countdown timer
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const earned = Math.round((correct / questions.length) * test.marks);
    const pct = Math.round((correct / questions.length) * 100);
    if (onRecordTestCompleted) {
      onRecordTestCompleted(earned, test.marks, pct);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setSecondsRemaining(test.durationMinutes * 60);
  };

  // Calculations for results
  const totalQuestions = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q, idx) => {
    const selected = selectedAnswers[idx];
    if (selected === undefined) {
      unattemptedCount++;
    } else if (selected === q.correctIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const marksEarned = Math.round((correctCount / totalQuestions) * test.marks);
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF7F2] rounded-3xl border border-[#DFD5C6] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Test Header */}
        <div className="px-6 py-4 bg-[#F2E9DE] border-b border-[#DDD1C0] flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              <span>{className}</span>
              <span>·</span>
              <span>{subjectName}</span>
              <span>·</span>
              <span>Chapter {chapterNumber}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#2F241C] tracking-tight">
              {test.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Timer */}
            {!isSubmitted && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  secondsRemaining < 120
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-white/80 text-[#543F30] border-[#D8CABE]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#D46244]" />
                <span className="tabular-nums font-mono text-sm">{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/70 hover:bg-white text-[#5F4B3C] border border-[#DDD0BF] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close test modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with auto-scroll target */}
        <div ref={modalBodyRef} className="flex-1 overflow-y-auto p-5 sm:p-7 scroll-smooth">
          {!isSubmitted ? (
            /* Active Test Interface */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question & Options Area (3 Columns) with question container ref for auto-scrolling */}
              <div ref={questionContainerRef} className="lg:col-span-3 flex flex-col justify-between scroll-mt-4">
                <div>
                  {/* Question Index Progress */}
                  <div className="flex items-center justify-between text-xs font-bold text-[#7E6C5D] mb-4">
                    <span>
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span>
                      {selectedAnswers[currentIndex] !== undefined ? (
                        <span className="text-[#2E7D32]">Answered</span>
                      ) : (
                        <span className="text-[#A8988A]">Not Answered</span>
                      )}
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs mb-6">
                    <p className="text-base sm:text-lg font-semibold text-[#2D231B] leading-relaxed">
                      {currentQ.question}
                    </p>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-3 mb-6">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`
                            w-full p-4 rounded-xl text-left border-2 transition-all duration-150 cursor-pointer
                            flex items-center gap-3.5
                            ${
                              isSelected
                                ? 'bg-[#FAF0E7] border-[#D46244] shadow-xs text-[#2E2017]'
                                : 'bg-white border-[#E4D8C8] hover:border-[#D5C2B0] text-[#3E3228]'
                            }
                          `}
                        >
                          <div
                            className={`
                              w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0
                              ${
                                isSelected
                                  ? 'bg-[#D46244] text-white shadow-2xs'
                                  : 'bg-[#F0E6D8] text-[#695444]'
                              }
                            `}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-sm font-medium leading-snug">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="pt-4 border-t border-[#E8DFC8] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentIndex === 0}
                      className="px-3.5 py-2 rounded-xl border border-[#DDD0BF] bg-white text-xs font-bold text-[#564436] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF4ED] cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={toggleFlag}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        flaggedQuestions[currentIndex]
                          ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                          : 'bg-white border-[#DDD0BF] text-[#564436] hover:bg-[#FAF4ED]'
                      }`}
                    >
                      {flaggedQuestions[currentIndex] ? '★ Flagged' : '☆ Mark for Review'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 rounded-xl bg-[#4A3728] hover:bg-[#3D2C1E] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256828] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Submit Assessment</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Navigation Pallet (Right Column) */}
              <div className="lg:col-span-1 bg-[#F5EDE1] p-4 rounded-2xl border border-[#E4D8C8]">
                <h4 className="text-xs font-heading font-extrabold text-[#4F3C2E] uppercase tracking-wider mb-3">
                  Question Palette
                </h4>

                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-3 gap-2 mb-4">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = idx === currentIndex;
                    const isFlagged = flaggedQuestions[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`
                          h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative
                          ${
                            isCurrent
                              ? 'ring-2 ring-[#D46244] ring-offset-1 font-black shadow-xs'
                              : ''
                          }
                          ${
                            isAnswered
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-white text-[#564436] border border-[#DDD0BF]'
                          }
                        `}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] font-semibold space-y-1.5 text-[#735F50] pt-3 border-t border-[#E1D3C2]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#2E7D32]" />
                    <span>Answered ({Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-white border border-[#DDD0BF]" />
                    <span>Unanswered ({totalQuestions - Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#F59E0B]" />
                    <span>Marked for Review</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full mt-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Submit Test Now
                </button>
              </div>
            </div>
          ) : (
            /* Results & Verified Explanations View */
            <div className="space-y-8 animate-fade-in">
              {/* Scorecard Hero */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F5EDE1] to-[#EBE0D0] border border-[#DDD1C0] text-center max-w-xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#D46244] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="w-9 h-9" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-[#7A614E]">
                  Test Assessment Completed
                </span>

                <h3 className="text-3xl sm:text-4xl font-heading font-black text-[#2F241C] mt-1">
                  {percentage}% Score
                </h3>

                <p className="text-sm font-semibold text-[#665243] mt-1">
                  Earned {marksEarned} out of {test.marks} Total Marks
                </p>

                {/* Performance Metrics Row */}
                <div className="mt-6 grid grid-cols-3 gap-3 bg-white/80 p-3.5 rounded-2xl border border-[#DDD0BF]">
                  <div>
                    <span className="block text-lg font-black text-[#2E7D32]">
                      {correctCount}
                    </span>
                    <span className="text-[11px] font-bold text-[#8C7A6B]">Correct</span>
                  </div>
                  <div className="border-x border-[#E3D6C5]">
                    <span className="block text-lg font-black text-[#C62828]">
                      {incorrectCount}
                    </span>
                    <span className="text-[11px] font-bold text-[#8C7A6B]">Incorrect</span>
                  </div>
                  <div>
                    <span className="block text-lg font-black text-[#7A614E]">
                      {unattemptedCount}
                    </span>
                    <span className="text-[11px] font-bold text-[#8C7A6B]">Skipped</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleRetake}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#DDD0BF] text-xs font-bold text-[#564436] hover:bg-[#FAF4ED] cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#D46244] text-white text-xs font-bold hover:bg-[#C25538] cursor-pointer shadow-xs"
                  >
                    <span>Return to Chapter Topics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detailed Question Explanations List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E3D6C5] pb-2">
                  <h4 className="text-base font-heading font-extrabold text-[#2F241C]">
                    Detailed Answer Explanations
                  </h4>
                  <span className="text-xs font-medium text-[#8C7A6B]">
                    Review correct options & concepts
                  </span>
                </div>

                {questions.map((q, idx) => {
                  const userChoice = selectedAnswers[idx];
                  const isCorrect = userChoice === q.correctIndex;
                  const isUnattempted = userChoice === undefined;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border bg-white ${
                        isCorrect
                          ? 'border-[#A5D6A7]'
                          : isUnattempted
                          ? 'border-[#DDD0BF]'
                          : 'border-[#FFCDD2]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-xs font-bold text-[#8C7A6B]">
                          Question {idx + 1}
                        </span>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-[#E8F5E9] text-[#2E7D32]'
                              : isUnattempted
                              ? 'bg-[#F5EDE1] text-[#78614E]'
                              : 'bg-[#FFEBEE] text-[#C62828]'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct</span>
                            </>
                          ) : isUnattempted ? (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Skipped</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Incorrect</span>
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base font-semibold text-[#2F241C] mb-4">
                        {q.question}
                      </p>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {q.options.map((opt, optIdx) => {
                          const isOptCorrect = optIdx === q.correctIndex;
                          const isUserPicked = optIdx === userChoice;

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-2 ${
                                isOptCorrect
                                  ? 'bg-[#E8F5E9] border-[#81C784] text-[#1B5E20] font-bold'
                                  : isUserPicked
                                  ? 'bg-[#FFEBEE] border-[#E57373] text-[#B71C1C]'
                                  : 'bg-[#FAF7F2] border-[#E8DFC8] text-[#5C4D40]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center font-bold text-[10px]">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isOptCorrect && (
                                <span className="text-[10px] uppercase font-bold text-[#2E7D32]">
                                  Correct
                                </span>
                              )}
                              {isUserPicked && !isOptCorrect && (
                                <span className="text-[10px] uppercase font-bold text-[#C62828]">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Verified Explanation Box */}
                      <div className="p-3.5 rounded-xl bg-[#F6EFE6] border border-[#E3D6C5] text-xs text-[#523F31]">
                        <span className="font-bold text-[#3B2B1F] block mb-1">
                          Pedagogical Explanation:
                        </span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
