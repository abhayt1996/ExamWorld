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
  imageUrl?: string;
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

export interface NestedSubTopic {
  id: string;
  name: string;
  tenseCategory: 'Present' | 'Past' | 'Future';
  formula: string;
  summary: string;
  tests: TopicTest[];
}

export interface ChapterTopic {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  tests: TopicTest[];
  subTopics?: NestedSubTopic[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'core' | 'science' | 'commerce' | 'humanities' | 'languages' | 'grammar';
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

export interface UserTestRecord {
  id: string;
  testId: string;
  testTitle: string;
  subjectName: string;
  className: string;
  chapterTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  date: string;
  timeSpentMinutes: number;
  totalTimeSpentSeconds?: number;
  timeSpentPerQuestion?: number[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  className: ClassLevel;
  totalScore: number;
  totalTimeSpentSeconds: number;
  testsCompleted: number;
  avatarColor: string;
  rank?: number;
  isCurrentUser?: boolean;
}

export interface UserActivityLog {
  id: string;
  userName: string;
  action: 'test_started' | 'test_completed' | 'logged_in' | 'viewing_chapter';
  testName?: string;
  className: ClassLevel;
  timestamp: number;
  activeNow: boolean;
  score?: number;
  timeSpentSeconds?: number;
}

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  username?: string;
  mobile: string;
  email: string;
  currentClass: ClassLevel;
  avatarColor: string;
  joinedDate: string;
  testHistory: UserTestRecord[];
}

export type GradeStatusMap = Record<ClassLevel, boolean>;

export interface DisabledEntitiesMap {
  grades: Record<ClassLevel, boolean>;
  subjects: Record<string, boolean>; // `${classId}:${subjectId}` -> false = disabled
  topics: Record<string, boolean>;   // topicId -> false = disabled
  tests: Record<string, boolean>;    // testId -> false = disabled
}

export interface StudentEnrollmentRecord {
  id: string;
  name: string;
  mobile: string;
  className: ClassLevel;
  testsCompleted: number;
  averageScore: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

