import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
  HelpCircle,
  Award,
} from 'lucide-react';
import { TopicTest, Question, ChapterTopic, ClassLevel } from '../types';

interface QuestionDraft {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctIndex: number;
  explanation: string;
}

interface TestBuilderModalProps {
  isOpen: boolean;
  classId: ClassLevel;
  subjectName: string;
  topic: ChapterTopic | null;
  onClose: () => void;
  onSaveTest: (classId: ClassLevel, subjectId: string, topicId: string, test: TopicTest) => void;
  subjectId: string;
}

const SAMPLE_QUESTION_TEMPLATES: QuestionDraft[] = [
  {
    question: 'Identify the sentence in the Present Perfect Continuous tense:',
    optionA: 'She has completed her project.',
    optionB: 'She has been working on her project for three hours.',
    optionC: 'She was working on her project all morning.',
    optionD: 'She will have been working on her project.',
    correctIndex: 1,
    explanation:
      'Present Perfect Continuous uses "has/have + been + verb-ing" to describe an action that started in the past and is still ongoing.',
  },
  {
    question: 'Choose the correct form of the verb: "Neither the teacher nor the students ____ present."',
    optionA: 'was',
    optionB: 'were',
    optionC: 'is',
    optionD: 'has been',
    correctIndex: 1,
    explanation:
      'When two subjects are joined by "neither... nor", the verb agrees with the subject closest to it ("students" is plural, so "were").',
  },
  {
    question: 'Spot the error: "He is having two brothers and one sister."',
    optionA: 'He is having',
    optionB: 'two brothers',
    optionC: 'and one sister',
    optionD: 'No error',
    correctIndex: 0,
    explanation:
      'Verbs of possession like "have" are stative verbs and generally not used in the continuous form. It should be "He has two brothers".',
  },
];

export const TestBuilderModal: React.FC<TestBuilderModalProps> = ({
  isOpen,
  classId,
  subjectName,
  topic,
  onClose,
  onSaveTest,
  subjectId,
}) => {
  if (!isOpen || !topic) return null;

  // Test Settings
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [testType, setTestType] = useState<TopicTest['type']>('concept');
  const [difficulty, setDifficulty] = useState<TopicTest['difficulty']>('Medium');
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(2);

  // Dynamic Questions Array (up to 10 questions)
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: '',
    },
  ]);

  // Validation Error message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add Question block (max 10)
  const handleAddQuestion = () => {
    if (questions.length >= 10) {
      setErrorMsg('A test can contain up to 10 questions maximum.');
      return;
    }
    setErrorMsg(null);
    setQuestions((prev) => [
      ...prev,
      {
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctIndex: 0,
        explanation: '',
      },
    ]);
  };

  // Remove question block
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      setErrorMsg('Test must have at least 1 question.');
      return;
    }
    setErrorMsg(null);
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update specific question field
  const handleUpdateQuestion = (
    index: number,
    field: keyof QuestionDraft,
    value: string | number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Quick autofill sample helper
  const handlePrefillSample = () => {
    const sample = SAMPLE_QUESTION_TEMPLATES[Math.floor(Math.random() * SAMPLE_QUESTION_TEMPLATES.length)];
    setTitle((prev) => prev.trim() || `Mastery Test: ${topic.title}`);
    setQuestions((prev) => {
      // replace first question or append
      if (prev.length === 1 && !prev[0].question.trim()) {
        return [{ ...sample }];
      }
      if (prev.length < 10) {
        return [...prev, { ...sample }];
      }
      return prev;
    });
    setErrorMsg(null);
  };

  // Save Test Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Please specify a Test Name/Title.');
      return;
    }

    if (durationMinutes < 1) {
      setErrorMsg('Duration must be at least 1 minute.');
      return;
    }

    if (questions.length === 0) {
      setErrorMsg('Please add at least one question.');
      return;
    }

    // Validate each question has content
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorMsg(`Question #${i + 1} is missing Question Text.`);
        return;
      }
      if (!q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
        setErrorMsg(`Question #${i + 1} must have all 4 options (Option A, B, C, D) filled in.`);
        return;
      }
    }

    // Determine badge text
    const badgeMap: Record<TopicTest['type'], string> = {
      diagnostic: 'Diagnostic',
      concept: 'Chapter Quiz',
      hots: 'HOTS Challenge',
      mock: 'Mock Exam',
      speed: 'Speed Drill',
    };

    // Compile into TopicTest schema
    const newTest: TopicTest = {
      id: `test-builder-${Date.now()}`,
      title: title.trim(),
      type: testType,
      badge: badgeMap[testType] || 'Custom Test',
      questionsCount: questions.length,
      durationMinutes: Number(durationMinutes),
      marks: questions.length * marksPerQuestion,
      difficulty,
      questions: questions.map((q, idx) => ({
        id: `q-bld-${Date.now()}-${idx + 1}`,
        question: q.question.trim(),
        options: [q.optionA.trim(), q.optionB.trim(), q.optionC.trim(), q.optionD.trim()],
        correctIndex: q.correctIndex,
        explanation: q.explanation.trim() || 'Standard curriculum explanation.',
      })),
    };

    onSaveTest(classId, subjectId, topic.id, newTest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF7F2] rounded-3xl border border-[#DFD3C3] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E8DEC8] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#D46244] text-white text-[11px] font-bold">
                Class {classId} · {subjectName}
              </span>
              <span className="text-xs font-mono text-[#8C7A6B] bg-[#EFE6DA] px-2 py-0.5 rounded">
                Ch. {topic.chapterNumber}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#2F241C] mt-1 flex items-center gap-2">
              <span>Interactive Test Builder</span>
              <span className="text-xs font-bold text-[#8C7A6B] font-body">
                (for {topic.title})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrefillSample}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE6DA] hover:bg-[#E4D8C8] text-[#554234] text-xs font-bold transition-colors cursor-pointer border border-[#DDD0BF]"
              title="Add a sample grammar question quickly"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D46244]" />
              <span>Autofill Sample</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#F0E6D8] hover:bg-[#E5D9C8] text-[#5A4535] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Test Settings */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#2F241C] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D46244]" />
              <span>1. Test Settings & Configuration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Test Name/Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#564436] mb-1">
                  Test Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Tenses Master Assessment Quiz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-semibold text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                />
              </div>

              {/* Custom Timer in minutes */}
              <div>
                <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D46244]" />
                  <span>Custom Timer (Minutes)</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-bold text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-[#564436] mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as TopicTest['difficulty'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-bold text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Test Type / Category */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#564436] mb-1">
                  Assessment Badge / Type
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as TopicTest['type'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-semibold text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all cursor-pointer"
                >
                  <option value="concept">Chapter Test / Concept Quiz</option>
                  <option value="diagnostic">Diagnostic Assessment</option>
                  <option value="hots">HOTS Challenge (Higher Order Thinking)</option>
                  <option value="mock">Standard Mock Exam</option>
                  <option value="speed">Speed Drill Test</option>
                </select>
              </div>

              {/* Marks per question */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center justify-between">
                  <span>Marks Per Question</span>
                  <span className="text-[11px] font-mono text-[#8C7A6B]">
                    Total Marks: {questions.length * marksPerQuestion}
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={marksPerQuestion}
                  onChange={(e) => setMarksPerQuestion(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-bold text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Question Builder UI */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#2F241C] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D46244]" />
                  <span>2. Dynamic Question Builder</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EFE6DA] text-[#634E3E] text-xs font-mono font-bold">
                    {questions.length} / 10 Questions
                  </span>
                </h3>
                <p className="text-xs text-[#7A6858] font-medium mt-0.5">
                  Configure question prompt, 4 options (A-D), select correct answer, and provide verified explanation.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={questions.length >= 10}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256828] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question ({questions.length}/10)</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs space-y-4 relative"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#D46244] text-white text-xs font-bold flex items-center justify-center font-heading">
                        {idx + 1}
                      </span>
                      <h4 className="font-heading font-bold text-xs text-[#2F241C] uppercase tracking-wider">
                        Question #{idx + 1} Block
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete this question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 1. Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-[#564436] mb-1">
                      Question Text (Prompt) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                      placeholder="e.g., Which of the following sentences correctly applies the Past Perfect tense?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all resize-none"
                    />
                  </div>

                  {/* 2. Options Grid: A, B, C, D */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Option A */}
                    <div>
                      <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-[#EFE6DA] text-[#695444] text-[11px] font-bold flex items-center justify-center">
                          A
                        </span>
                        <span>Option A</span> <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={q.optionA}
                        onChange={(e) => handleUpdateQuestion(idx, 'optionA', e.target.value)}
                        placeholder="Option A text..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                      />
                    </div>

                    {/* Option B */}
                    <div>
                      <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-[#EFE6DA] text-[#695444] text-[11px] font-bold flex items-center justify-center">
                          B
                        </span>
                        <span>Option B</span> <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={q.optionB}
                        onChange={(e) => handleUpdateQuestion(idx, 'optionB', e.target.value)}
                        placeholder="Option B text..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                      />
                    </div>

                    {/* Option C */}
                    <div>
                      <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-[#EFE6DA] text-[#695444] text-[11px] font-bold flex items-center justify-center">
                          C
                        </span>
                        <span>Option C</span> <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={q.optionC}
                        onChange={(e) => handleUpdateQuestion(idx, 'optionC', e.target.value)}
                        placeholder="Option C text..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                      />
                    </div>

                    {/* Option D */}
                    <div>
                      <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-[#EFE6DA] text-[#695444] text-[11px] font-bold flex items-center justify-center">
                          D
                        </span>
                        <span>Option D</span> <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={q.optionD}
                        onChange={(e) => handleUpdateQuestion(idx, 'optionD', e.target.value)}
                        placeholder="Option D text..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all"
                      />
                    </div>
                  </div>

                  {/* 3. Correct Answer Dropdown & 4. Explanation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1 text-[#2E7D32]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Select Correct Answer</span> <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={q.correctIndex}
                        onChange={(e) =>
                          handleUpdateQuestion(idx, 'correctIndex', parseInt(e.target.value))
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#564436] mb-1 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#D46244]" />
                        <span>Detailed Explanation / Grammar Rule</span>
                      </label>
                      <textarea
                        rows={2}
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                        placeholder="Explain why this option is correct and cite the grammatical rule..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#E8DEC8] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-[#FAF7F2] py-3">
            <div className="text-xs text-[#7A6858] font-medium">
              Will create a verified <span className="font-bold text-[#2F241C]">{questions.length}-question</span> test with a <span className="font-bold text-[#2F241C]">{durationMinutes}-minute</span> live timer.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#DDD0BF] bg-white text-xs font-bold text-[#564436] hover:bg-[#F4ECE1] cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D46244] hover:bg-[#C25538] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Test to Curriculum</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
