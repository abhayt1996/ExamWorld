export type ClassLevel = '6' | '7' | '8' | '9' | '10' | '11' | '12';

export interface ClassTheme {
  bg: string;
  hoverBg: string;
  border: string;
  shadowColor: string;
  activeShadowColor: string;
  textColor: string;
  accentBadge: string;
  gradient: string;
}

export interface ClassData {
  id: ClassLevel;
  name: string;
  badge: string;
  stage: string;
  ageGroup: string;
  theme: ClassTheme;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicTest {
  id: string;
  title: string;
  type: 'diagnostic' | 'concept' | 'hots' | 'mock' | 'speed';
  badge: string;
  questionsCount: number;
  durationMinutes: number;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
}

export interface ChapterTopic {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  tests: TopicTest[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'core' | 'science' | 'commerce' | 'humanities' | 'languages';
  stream?: 'Science' | 'Commerce' | 'Humanities' | 'General';
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    iconBg: string;
    iconColor: string;
    textColor: string;
  };
  topics: ChapterTopic[];
}

export interface ActiveTestState {
  topicTitle: string;
  chapterNumber: number;
  subjectName: string;
  className: string;
  test: TopicTest;
}
