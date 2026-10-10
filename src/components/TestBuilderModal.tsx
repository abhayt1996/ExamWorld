import React, { useState, useEffect } from 'react';
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
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TopicTest, Question, ChapterTopic, ClassLevel } from '../types';

interface QuestionDraft {
  id?: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctIndex: number;
  explanation: string;
  isEditing?: boolean;
}

interface TestBuilderModalProps {
  isOpen: boolean;
  classId: ClassLevel;
  subjectName: string;
  topic: ChapterTopic | null;
  onClose: () => void;
  onSaveTest: (classId: ClassLevel, subjectId: string, topicId: string, test: TopicTest) => void;
  subjectId: string;
  initialTest?: TopicTest | null;
}

const SAMPLE_QUESTION_TEMPLATES: Omit<QuestionDraft, 'id' | 'isEditing'>[] = [
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
  {
    question: 'Fill in the blank with the correct modal: "You ____ submit your assignment before 5 PM today."',
    optionA: 'might',
    optionB: 'must',
    optionC: 'could',
    optionD: 'would',
    correctIndex: 1,
    explanation:
      '"Must" expresses compulsory requirement or strong obligation.',
  },
  {
    question: 'Which of the following sentences is in the Passive Voice?',
    optionA: 'The chef cooked a delightful gourmet feast.',
    optionB: 'The song was performed beautifully by the choir.',
    optionC: 'Students read the textbook in silence.',
    optionD: 'Rain flooded the agricultural fields.',
    correctIndex: 1,
    explanation:
      'In passive voice, the subject receives the action ("was performed by the choir").',
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
  initialTest,
}) => {
  if (!isOpen || !topic) return null;

  const isEditMode = Boolean(initialTest);

  // Test Settings
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [testType, setTestType] = useState<TopicTest['type']>('concept');
  const [difficulty, setDifficulty] = useState<TopicTest['difficulty']>('Medium');
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(2);

  // Dynamic Questions Array - UNLIMITED QUESTIONS!
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: '',
      isEditing: true,
    },
  ]);

  // Validation Error message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preload test if editing existing test
  useEffect(() => {
    if (initialTest) {
      setTitle(initialTest.title);
      setDurationMinutes(initialTest.durationMinutes || 15);
      setTestType(initialTest.type || 'concept');
      setDifficulty(initialTest.difficulty || 'Medium');
      const marksPerQ =
        initialTest.questions.length > 0
          ? Math.max(1, Math.round(initialTest.marks / initialTest.questions.length))
          : 2;
      setMarksPerQuestion(marksPerQ);

      const drafts: QuestionDraft[] = initialTest.questions.map((q) => ({
        id: q.id,
        question: q.question,
        optionA: q.options[0] || '',
        optionB: q.options[1] || '',
        optionC: q.options[2] || '',
        optionD: q.options[3] || '',
        correctIndex: q.correctIndex,
        explanation: q.explanation || '',
        isEditing: false, // collapsed review by default for rapid overview
      }));

      setQuestions(drafts.length > 0 ? drafts : [
        {
          question: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctIndex: 0,
          explanation: '',
          isEditing: true,
        },
      ]);
    } else {
      setTitle('');
      setDurationMinutes(15);
      setTestType('concept');
      setDifficulty('Medium');
      setMarksPerQuestion(2);
      setQuestions([
        {
          question: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctIndex: 0,
          explanation: '',
          isEditing: true,
        },
      ]);
    }
  }, [initialTest]);

  // Add Question block - NO LIMIT (unlimited questions)
  const handleAddQuestion = () => {
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
        isEditing: true,
      },
    ]);
  };

  // Toggle edit state for a specific question
  const handleToggleEditQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, isEditing: !q.isEditing } : q))
    );
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
    value: string | number | boolean
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Quick autofill sample helper
  const handlePrefillSample = () => {
    const sample =
      SAMPLE_QUESTION_TEMPLATES[
        Math.floor(Math.random() * SAMPLE_QUESTION_TEMPLATES.length)
      ];
    setTitle((prev) => prev.trim() || `Mastery Test: ${topic.title}`);
    setQuestions((prev) => {
      // replace first question if blank, otherwise append
      if (prev.length === 1 && !prev[0].question.trim()) {
        return [{ ...sample, isEditing: true }];
      }
      return [...prev, { ...sample, isEditing: true }];
    });
    setErrorMsg(null);
  };

  // Expand all questions for editing
  const handleExpandAllQuestions = () => {
    setQuestions((prev) => prev.map((q) => ({ ...q, isEditing: true })));
  };

  // Collapse all questions
  const handleCollapseAllQuestions = () => {
    setQuestions((prev) => prev.map((q) => ({ ...q, isEditing: false })));
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
    const testId = initialTest ? initialTest.id : `test-builder-${Date.now()}`;
    const newTest: TopicTest = {
      id: testId,
      title: title.trim(),
      type: testType,
      badge: badgeMap[testType] || (initialTest?.badge || 'Custom Test'),
      questionsCount: questions.length,
      durationMinutes: Number(durationMinutes),
      marks: questions.length * marksPerQuestion,
      difficulty,
      questions: questions.map((q, idx) => ({
        id: q.id || `q-bld-${Date.now()}-${idx + 1}`,
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
              {isEditMode && (
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">
                  Editing Existing Test
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#2F241C] mt-1 flex items-center gap-2">
              <span>{isEditMode ? 'Modify & Update Test' : 'Interactive Test Builder'}</span>
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
              title="Add a sample grammar question"
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

          {/* Section 2: Unlimited Question Builder UI with Edit Capability */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#2F241C] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D46244]" />
                  <span>2. Unlimited Question Builder</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFE6DA] text-[#634E3E] text-xs font-mono font-bold">
                    {questions.length} Question{questions.length !== 1 ? 's' : ''} (Unlimited)
                  </span>
                </h3>
                <p className="text-xs text-[#7A6858] font-medium mt-0.5">
                  Add any number of questions. Click "Edit Question" on any card to modify its prompt, options, correct answer, or explanation.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleExpandAllQuestions}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EFE6DA] hover:bg-[#E4D8C8] text-[#554234] border border-[#DDD0BF] cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={handleCollapseAllQuestions}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EFE6DA] hover:bg-[#E4D8C8] text-[#554234] border border-[#DDD0BF] cursor-pointer"
                >
                  Collapse All
                </button>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256828] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#E3D7C7] shadow-xs space-y-4 relative transition-all"
                >
                  {/* Question Header & Controls */}
                  <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#D46244] text-white text-xs font-bold flex items-center justify-center font-heading shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-heading font-bold text-xs text-[#2F241C] uppercase tracking-wider truncate max-w-xs sm:max-w-md">
                        {q.question.trim() ? q.question.trim().substring(0, 60) + (q.question.length > 60 ? '...' : '') : `Question #${idx + 1}`}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit Question Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleEditQuestion(idx)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                          q.isEditing
                            ? 'bg-[#D46244] text-white border-[#D46244]'
                            : 'bg-[#FAF4ED] text-[#554234] border-[#DDD0BF] hover:bg-[#F2E8DC]'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{q.isEditing ? 'Editing Question' : 'Edit Question'}</span>
                        {q.isEditing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

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

                  {/* Collapsed Preview when isEditing is false */}
                  {!q.isEditing ? (
                    <div className="text-xs text-[#554234] space-y-2 py-1">
                      <p className="font-semibold text-sm text-[#2F241C]">
                        {q.question || <span className="text-slate-400 italic">No question prompt entered</span>}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#695444]">
                        <span className={q.correctIndex === 0 ? 'font-bold text-emerald-700' : ''}>
                          A) {q.optionA || '-'}
                        </span>
                        <span className={q.correctIndex === 1 ? 'font-bold text-emerald-700' : ''}>
                          B) {q.optionB || '-'}
                        </span>
                        <span className={q.correctIndex === 2 ? 'font-bold text-emerald-700' : ''}>
                          C) {q.optionC || '-'}
                        </span>
                        <span className={q.correctIndex === 3 ? 'font-bold text-emerald-700' : ''}>
                          D) {q.optionD || '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Correct: Option {String.fromCharCode(65 + q.correctIndex)}
                        </span>
                        {q.explanation && (
                          <span className="text-[#8C7A6B] truncate max-w-sm">
                            Explanation: {q.explanation}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Expanded Question Edit Form */
                    <div className="space-y-4 animate-in fade-in duration-100">
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
                            <span>Detailed Explanation / Rule Rationale</span>
                          </label>
                          <textarea
                            rows={2}
                            value={q.explanation}
                            onChange={(e) =>
                              handleUpdateQuestion(idx, 'explanation', e.target.value)
                            }
                            placeholder="Explain why this option is correct and cite the rule..."
                            className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD0BF] text-xs font-medium text-[#2F241C] focus:bg-white focus:outline-none focus:border-[#D46244] transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#E8DEC8] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-[#FAF7F2] py-3">
            <div className="text-xs text-[#7A6858] font-medium">
              Will {isEditMode ? 'update' : 'create'} a verified{' '}
              <span className="font-bold text-[#2F241C]">{questions.length}-question</span> test with a{' '}
              <span className="font-bold text-[#2F241C]">{durationMinutes}-minute</span> timer.
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
                <span>{isEditMode ? 'Save & Update Test' : 'Save Test to Curriculum'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
