import { UserActivityLog, LeaderboardEntry, ClassLevel, UserProfile } from '../types';

/**
 * Mock data array of user activity.
 * Used to dynamically calculate active users, active test sessions,
 * completed tests, and traffic metrics rather than hardcoding.
 */
export const MOCK_USER_ACTIVITIES: UserActivityLog[] = [
  {
    id: 'act-101',
    userName: 'Aarav Sharma',
    action: 'test_completed',
    testName: 'Tenses Master Assessment',
    className: '10',
    timestamp: Date.now() - 45000,
    activeNow: true,
    score: 18,
    timeSpentSeconds: 312,
  },
  {
    id: 'act-102',
    userName: 'Ananya Verma',
    action: 'test_started',
    testName: 'Differential Calculus Diagnostic',
    className: '12',
    timestamp: Date.now() - 90000,
    activeNow: true,
  },
  {
    id: 'act-103',
    userName: 'Rohan Gupta',
    action: 'test_started',
    testName: 'Nationalism in Europe Quiz',
    className: '10',
    timestamp: Date.now() - 120000,
    activeNow: true,
  },
  {
    id: 'act-104',
    userName: 'Ishita Patel',
    action: 'viewing_chapter',
    className: '9',
    timestamp: Date.now() - 150000,
    activeNow: true,
  },
  {
    id: 'act-105',
    userName: 'Devendra Singh',
    action: 'test_completed',
    testName: 'Electrochemistry Concept Drill',
    className: '12',
    timestamp: Date.now() - 210000,
    activeNow: true,
    score: 20,
    timeSpentSeconds: 420,
  },
  {
    id: 'act-106',
    userName: 'Priya Nambiar',
    action: 'test_started',
    testName: 'Algebraic Expressions & Identities',
    className: '8',
    timestamp: Date.now() - 240000,
    activeNow: true,
  },
  {
    id: 'act-107',
    userName: 'Kabir Mukherjee',
    action: 'test_completed',
    testName: 'Fractions & Decimals Practice',
    className: '7',
    timestamp: Date.now() - 360000,
    activeNow: false,
    score: 16,
    timeSpentSeconds: 280,
  },
  {
    id: 'act-108',
    userName: 'Tanvi Joshi',
    action: 'test_started',
    testName: 'Knowing Our Numbers Drill',
    className: '6',
    timestamp: Date.now() - 180000,
    activeNow: true,
  },
  {
    id: 'act-109',
    userName: 'Vikramaditya Roy',
    action: 'test_completed',
    testName: 'Organic Compounds Structure',
    className: '11',
    timestamp: Date.now() - 480000,
    activeNow: true,
    score: 22,
    timeSpentSeconds: 510,
  },
  {
    id: 'act-110',
    userName: 'Meera Iyer',
    action: 'test_started',
    testName: 'Active & Passive Voice Drill',
    className: '10',
    timestamp: Date.now() - 80000,
    activeNow: true,
  },
  {
    id: 'act-111',
    userName: 'Aryan Deshmukh',
    action: 'test_completed',
    testName: 'Kinematics 1D Motion Test',
    className: '11',
    timestamp: Date.now() - 600000,
    activeNow: false,
    score: 18,
    timeSpentSeconds: 380,
  },
  {
    id: 'act-112',
    userName: 'Simran Kaur',
    action: 'test_started',
    testName: 'Direct & Indirect Speech Test',
    className: '10',
    timestamp: Date.now() - 35000,
    activeNow: true,
  },
  {
    id: 'act-113',
    userName: 'Aditya Nair',
    action: 'viewing_chapter',
    className: '12',
    timestamp: Date.now() - 110000,
    activeNow: true,
  },
  {
    id: 'act-114',
    userName: 'Diya Chawla',
    action: 'test_completed',
    testName: 'Modals & Conditionals Speed Quiz',
    className: '8',
    timestamp: Date.now() - 290000,
    activeNow: true,
    score: 14,
    timeSpentSeconds: 240,
  },
  {
    id: 'act-115',
    userName: 'Yashvardhan Kulkarni',
    action: 'test_started',
    testName: 'Surface Areas & Volumes Mock',
    className: '10',
    timestamp: Date.now() - 50000,
    activeNow: true,
  },
];

/**
 * Dynamically computes baseline platform statistics from user activities and enrolled students.
 * Multiplies by active concurrency factor to reflect whole platform scale.
 */
export function calculateDynamicAdminStats(activities: UserActivityLog[]) {
  const activeNowCount = activities.filter((a) => a.activeNow).length;
  const inTestSessionCount = activities.filter((a) => a.action === 'test_started').length;
  const completedTodayCount = activities.filter((a) => a.action === 'test_completed').length;

  // Multiplier represents active concurrent student sessions on examworld.site
  const concurrencyMultiplier = 124;

  const baseActiveUsers = activeNowCount * concurrencyMultiplier + 142;
  const baseActiveTestSessions = inTestSessionCount * 48 + 19;
  const baseCompletedTestsToday = completedTodayCount * 360 + 512;

  return {
    baseActiveUsers,
    baseActiveTestSessions,
    baseCompletedTestsToday,
  };
}

/**
 * Baseline Global Leaderboard dataset across Classes 6-12
 */
export const BASE_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    name: 'Ananya Verma',
    className: '12',
    totalScore: 488,
    totalTimeSpentSeconds: 4120, // ~68 mins
    testsCompleted: 26,
    avatarColor: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]',
  },
  {
    id: 'lb-2',
    name: 'Devendra Singh',
    className: '11',
    totalScore: 472,
    totalTimeSpentSeconds: 4350,
    testsCompleted: 25,
    avatarColor: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
  },
  {
    id: 'lb-3',
    name: 'Tanvi Joshi',
    className: '10',
    totalScore: 450,
    totalTimeSpentSeconds: 3890,
    testsCompleted: 23,
    avatarColor: 'bg-gradient-to-br from-[#6366F1] to-[#4F46E5]',
  },
  {
    id: 'lb-4',
    name: 'Aarav Sharma',
    className: '10',
    totalScore: 450,
    totalTimeSpentSeconds: 4180, // Tied with Tanvi on score, but took more time -> ranks lower!
    testsCompleted: 24,
    avatarColor: 'bg-gradient-to-br from-[#D46244] to-[#B3492F]',
  },
  {
    id: 'lb-5',
    name: 'Ishita Patel',
    className: '9',
    totalScore: 418,
    totalTimeSpentSeconds: 3620,
    testsCompleted: 21,
    avatarColor: 'bg-gradient-to-br from-[#EC4899] to-[#DB2777]',
  },
  {
    id: 'lb-6',
    name: 'Vikramaditya Roy',
    className: '11',
    totalScore: 396,
    totalTimeSpentSeconds: 3800,
    testsCompleted: 20,
    avatarColor: 'bg-gradient-to-br from-[#0EA5E9] to-[#0284C7]',
  },
  {
    id: 'lb-7',
    name: 'Meera Iyer',
    className: '10',
    totalScore: 384,
    totalTimeSpentSeconds: 3410,
    testsCompleted: 19,
    avatarColor: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]',
  },
  {
    id: 'lb-8',
    name: 'Priya Nambiar',
    className: '8',
    totalScore: 360,
    totalTimeSpentSeconds: 3200,
    testsCompleted: 18,
    avatarColor: 'bg-gradient-to-br from-[#14B8A6] to-[#0D9488]',
  },
  {
    id: 'lb-9',
    name: 'Rohan Gupta',
    className: '10',
    totalScore: 342,
    totalTimeSpentSeconds: 3750,
    testsCompleted: 17,
    avatarColor: 'bg-gradient-to-br from-[#F97316] to-[#EA580C]',
  },
  {
    id: 'lb-10',
    name: 'Simran Kaur',
    className: '10',
    totalScore: 320,
    totalTimeSpentSeconds: 2980,
    testsCompleted: 16,
    avatarColor: 'bg-gradient-to-br from-[#84CC16] to-[#65A30D]',
  },
  {
    id: 'lb-11',
    name: 'Kabir Mukherjee',
    className: '7',
    totalScore: 298,
    totalTimeSpentSeconds: 2710,
    testsCompleted: 14,
    avatarColor: 'bg-gradient-to-br from-[#64748B] to-[#475569]',
  },
  {
    id: 'lb-12',
    name: 'Diya Chawla',
    className: '6',
    totalScore: 280,
    totalTimeSpentSeconds: 2600,
    testsCompleted: 13,
    avatarColor: 'bg-gradient-to-br from-[#A855F7] to-[#9333EA]',
  },
];

/**
 * Computes and ranks the leaderboard.
 * Sorting rule required:
 * 1. Total Score (Highest first)
 * 2. Time Spent (If scores are tied, student who finished in less time ranks higher)
 */
export function getRankedLeaderboard(
  currentUser?: UserProfile | null,
  classFilter?: ClassLevel | 'All'
): LeaderboardEntry[] {
  let entries = [...BASE_LEADERBOARD_ENTRIES];

  // If logged-in user is a student, compute their real stats from their test history
  if (currentUser && currentUser.role === 'student') {
    const userTests = currentUser.testHistory || [];
    const userScore = userTests.reduce((acc, t) => acc + t.score, 0);
    const userSeconds = userTests.reduce((acc, t) => {
      return acc + (t.totalTimeSpentSeconds || t.timeSpentMinutes * 60 || 120);
    }, 0);

    // Check if current user already exists in base entries
    const existingIndex = entries.findIndex((e) => e.name.toLowerCase() === currentUser.name.toLowerCase());
    if (existingIndex >= 0) {
      entries[existingIndex] = {
        ...entries[existingIndex],
        totalScore: Math.max(entries[existingIndex].totalScore, userScore || 70),
        totalTimeSpentSeconds: entries[existingIndex].totalTimeSpentSeconds + userSeconds,
        testsCompleted: Math.max(entries[existingIndex].testsCompleted, userTests.length),
        isCurrentUser: true,
      };
    } else {
      entries.push({
        id: `user-live-${currentUser.id}`,
        name: currentUser.name || 'You',
        className: currentUser.currentClass,
        totalScore: userScore || 62,
        totalTimeSpentSeconds: userSeconds || 740,
        testsCompleted: Math.max(1, userTests.length),
        avatarColor: currentUser.avatarColor || 'bg-gradient-to-br from-[#D46244] to-[#B3492F]',
        isCurrentUser: true,
      });
    }
  }

  // Filter by class standard if requested
  if (classFilter && classFilter !== 'All') {
    entries = entries.filter((e) => e.className === classFilter);
  }

  // Strict sorting:
  // 1. Total Score (Highest first: b.totalScore - a.totalScore)
  // 2. Time Spent (If tied, student who finished in LESS time ranks higher: a.totalTimeSpentSeconds - b.totalTimeSpentSeconds)
  entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return a.totalTimeSpentSeconds - b.totalTimeSpentSeconds;
  });

  // Assign 1-indexed ranks
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
