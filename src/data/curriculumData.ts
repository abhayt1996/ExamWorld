import { ClassData, Subject } from '../types';

export const CLASSES_LIST: ClassData[] = [
  {
    id: '6',
    name: 'Class 6',
    badge: 'Middle Stage',
    stage: 'Foundational Middle School',
    ageGroup: 'Ages 11-12',
    theme: {
      bg: 'bg-emerald-50 hover:bg-emerald-100/90',
      hoverBg: 'hover:bg-emerald-100',
      border: 'border-emerald-300',
      shadowColor: '#10b981',
      activeShadowColor: '#059669',
      textColor: 'text-emerald-950',
      accentBadge: 'bg-emerald-200/70 text-emerald-900 border-emerald-300/80',
      gradient: 'from-emerald-50 to-teal-50',
    },
  },
  {
    id: '7',
    name: 'Class 7',
    badge: 'Middle Stage',
    stage: 'Intermediate Middle School',
    ageGroup: 'Ages 12-13',
    theme: {
      bg: 'bg-sky-50 hover:bg-sky-100/90',
      hoverBg: 'hover:bg-sky-100',
      border: 'border-sky-300',
      shadowColor: '#0ea5e9',
      activeShadowColor: '#0284c7',
      textColor: 'text-sky-950',
      accentBadge: 'bg-sky-200/70 text-sky-900 border-sky-300/80',
      gradient: 'from-sky-50 to-cyan-50',
    },
  },
  {
    id: '8',
    name: 'Class 8',
    badge: 'Middle Stage',
    stage: 'Advanced Middle School',
    ageGroup: 'Ages 13-14',
    theme: {
      bg: 'bg-purple-50 hover:bg-purple-100/90',
      hoverBg: 'hover:bg-purple-100',
      border: 'border-purple-300',
      shadowColor: '#a855f7',
      activeShadowColor: '#9333ea',
      textColor: 'text-purple-950',
      accentBadge: 'bg-purple-200/70 text-purple-900 border-purple-300/80',
      gradient: 'from-purple-50 to-indigo-50',
    },
  },
  {
    id: '9',
    name: 'Class 9',
    badge: 'Secondary Stage',
    stage: 'Secondary Foundation',
    ageGroup: 'Ages 14-15',
    theme: {
      bg: 'bg-rose-50 hover:bg-rose-100/90',
      hoverBg: 'hover:bg-rose-100',
      border: 'border-rose-300',
      shadowColor: '#f43f5e',
      activeShadowColor: '#e11d48',
      textColor: 'text-rose-950',
      accentBadge: 'bg-rose-200/70 text-rose-900 border-rose-300/80',
      gradient: 'from-rose-50 to-pink-50',
    },
  },
  {
    id: '10',
    name: 'Class 10',
    badge: 'Board Prep Stage',
    stage: 'Secondary Board Examination',
    ageGroup: 'Ages 15-16',
    theme: {
      bg: 'bg-amber-50 hover:bg-amber-100/90',
      hoverBg: 'hover:bg-amber-100',
      border: 'border-amber-300',
      shadowColor: '#f59e0b',
      activeShadowColor: '#d97706',
      textColor: 'text-amber-950',
      accentBadge: 'bg-amber-200/70 text-amber-900 border-amber-300/80',
      gradient: 'from-amber-50 to-orange-50',
    },
  },
  {
    id: '11',
    name: 'Class 11',
    badge: 'Senior Secondary',
    stage: 'Senior Secondary Foundation',
    ageGroup: 'Ages 16-17',
    theme: {
      bg: 'bg-teal-50 hover:bg-teal-100/90',
      hoverBg: 'hover:bg-teal-100',
      border: 'border-teal-300',
      shadowColor: '#14b8a6',
      activeShadowColor: '#0d9488',
      textColor: 'text-teal-950',
      accentBadge: 'bg-teal-200/70 text-teal-900 border-teal-300/80',
      gradient: 'from-teal-50 to-emerald-50',
    },
  },
  {
    id: '12',
    name: 'Class 12',
    badge: 'Senior Board Stage',
    stage: 'Higher Secondary Final Examination',
    ageGroup: 'Ages 17-18',
    theme: {
      bg: 'bg-indigo-50 hover:bg-indigo-100/90',
      hoverBg: 'hover:bg-indigo-100',
      border: 'border-indigo-300',
      shadowColor: '#6366f1',
      activeShadowColor: '#4f46e5',
      textColor: 'text-indigo-950',
      accentBadge: 'bg-indigo-200/70 text-indigo-900 border-indigo-300/80',
      gradient: 'from-indigo-50 to-violet-50',
    },
  },
];

export const SUBJECTS_BY_CLASS: Record<string, Subject[]> = {
  '10': [
    {
      id: 'c10-maths',
      name: 'Mathematics',
      code: 'MATH-10',
      category: 'core',
      stream: 'General',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-500 text-white',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-950',
      },
      topics: [
        {
          id: 'c10-m-ch1',
          chapterNumber: 1,
          title: 'Real Numbers',
          summary: 'Fundamental Theorem of Arithmetic, Euclid division concepts, revisiting irrational numbers and decimal expansions.',
          keyConcepts: ['Prime Factorization', 'HCF and LCM relation', 'Irrationality Proofs of √2, √3, √5', 'Terminating/Non-terminating decimals'],
          tests: [
            {
              id: 't-rn-1',
              title: 'Test 1: Fundamental Concepts & Prime Factorization',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 5,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q1',
                  question: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:',
                  options: ['xy', 'xy²', 'x³y³', 'x²y²'],
                  correctIndex: 1,
                  explanation: 'HCF is the product of the smallest powers of each common prime factor involved in the numbers. Smallest power of x is x¹, and of y is y². Hence HCF = xy².'
                },
                {
                  id: 'q2',
                  question: 'The product of a non-zero rational and an irrational number is always:',
                  options: ['Always rational', 'Always irrational', 'Rational or irrational', 'Zero'],
                  correctIndex: 1,
                  explanation: 'The product of any non-zero rational number with an irrational number is always an irrational number.'
                },
                {
                  id: 'q3',
                  question: 'If HCF(306, 657) = 9, what is LCM(306, 657)?',
                  options: ['22,338', '21,540', '18,450', '24,112'],
                  correctIndex: 0,
                  explanation: 'LCM × HCF = Product of two numbers. Therefore, LCM = (306 × 657) / 9 = 34 × 657 = 22,338.'
                },
                {
                  id: 'q4',
                  question: 'Which of the following numbers has a terminating decimal expansion?',
                  options: ['17 / 90', '13 / 3125', '64 / 455', '29 / 343'],
                  correctIndex: 1,
                  explanation: 'Denominator of 13 / 3125 is 3125 = 5⁵ = 2⁰ × 5⁵. Since the denominator is in the form 2ᵐ × 5ⁿ, its decimal expansion terminates.'
                },
                {
                  id: 'q5',
                  question: 'The largest number which divides 70 and 125 leaving remainders 5 and 8 respectively is:',
                  options: ['13', '65', '875', '1750'],
                  correctIndex: 0,
                  explanation: 'Required number is HCF of (70 - 5 = 65) and (125 - 8 = 117). 65 = 13 × 5 and 117 = 13 × 9. HCF is 13.'
                }
              ]
            },
            {
              id: 't-rn-2',
              title: 'Test 2: Standard Level Chapter Assessment',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 4,
              durationMinutes: 20,
              marks: 20,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'q2-1',
                  question: 'If p is a prime number and p divides a², where a is a positive integer, then:',
                  options: ['p divides a', 'p² divides a', 'a divides p', 'p + a is prime'],
                  correctIndex: 0,
                  explanation: 'According to the fundamental theorem, if prime p divides a², then p also divides a.'
                },
                {
                  id: 'q2-2',
                  question: 'The decimal representation of 14587 / (2¹ × 5⁴) will terminate after how many decimal places?',
                  options: ['1 place', '2 places', '3 places', '4 places'],
                  correctIndex: 3,
                  explanation: 'The maximum power between 2 and 5 in the denominator is 4 (from 5⁴), so it terminates after 4 decimal places.'
                },
                {
                  id: 'q2-3',
                  question: 'Express 0.142857... as a fraction in simplest terms:',
                  options: ['1/7', '2/7', '1/14', '3/21'],
                  correctIndex: 0,
                  explanation: '1/7 in decimal expansion is repeating 0.142857142857...'
                },
                {
                  id: 'q2-4',
                  question: 'For any natural number n, 6ⁿ can never end with the digit 0 because:',
                  options: ['6 is divisible by 2', 'Prime factorization of 6 does not contain 5', '6 is an even number', 'n can be 0'],
                  correctIndex: 1,
                  explanation: 'To end with digit 0, a number must have both 2 and 5 in its prime factorization. Prime factors of 6 are 2 and 3, lacking 5.'
                }
              ]
            },
            {
              id: 't-rn-3',
              title: 'Test 3: Higher Order Thinking (HOTS) Challenge',
              type: 'hots',
              badge: 'HOTS Test',
              questionsCount: 3,
              durationMinutes: 25,
              marks: 15,
              difficulty: 'Hard',
              questions: [
                {
                  id: 'q3-1',
                  question: 'If n is an odd integer, then n² - 1 is always divisible by:',
                  options: ['8', '16', '32', '6'],
                  correctIndex: 0,
                  explanation: 'Any odd integer can be written as (4q + 1) or (4q + 3). Squaring gives n² - 1 = 16q² + 8q = 8(2q² + q), which is always divisible by 8.'
                },
                {
                  id: 'q3-2',
                  question: 'What is the remainder when 3²⁰²⁶ is divided by 5?',
                  options: ['1', '4', '2', '3'],
                  correctIndex: 1,
                  explanation: 'Powers of 3 modulo 5 cycle in periods of 4: 3¹≡3, 3²≡4, 3³≡2, 3⁴≡1. 2026 mod 4 = 2. Thus 3²⁰²⁶ ≡ 3² ≡ 4 (mod 5).'
                },
                {
                  id: 'q3-3',
                  question: 'If the HCF of 65 and 117 is expressible in the form 65m - 117, then the value of m is:',
                  options: ['4', '2', '1', '3'],
                  correctIndex: 1,
                  explanation: 'HCF(65, 117) = 13. 65m - 117 = 13 => 65m = 130 => m = 2.'
                }
              ]
            },
            {
              id: 't-rn-4',
              title: 'Mock Exam: Comprehensive Chapter Review',
              type: 'mock',
              badge: 'Mock Exam',
              questionsCount: 5,
              durationMinutes: 30,
              marks: 25,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qm-1',
                  question: 'The least number that is divisible by all numbers from 1 to 10 (both inclusive) is:',
                  options: ['10', '100', '504', '2520'],
                  correctIndex: 3,
                  explanation: 'LCM(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) = 2³ × 3² × 5 × 7 = 8 × 9 × 5 × 7 = 2520.'
                },
                {
                  id: 'qm-2',
                  question: 'Which of the following is an irrational number?',
                  options: ['3.141414...', '2 + √3', '√9 + √16', '(√2 + √3)(√2 - √3)'],
                  correctIndex: 1,
                  explanation: '2 is rational, √3 is irrational. The sum of a rational and irrational number is always irrational.'
                },
                {
                  id: 'qm-3',
                  question: 'If LCM(a, 18) = 36 and HCF(a, 18) = 2, then a =',
                  options: ['2', '3', '4', '1'],
                  correctIndex: 2,
                  explanation: 'a × 18 = LCM × HCF = 36 × 2 = 72 => a = 72 / 18 = 4.'
                },
                {
                  id: 'qm-4',
                  question: 'Is √p + √q irrational when p and q are distinct prime numbers?',
                  options: ['Always irrational', 'Always rational', 'Can be rational', 'Cannot be determined'],
                  correctIndex: 0,
                  explanation: 'The sum of the square roots of two distinct primes is always irrational.'
                },
                {
                  id: 'qm-5',
                  question: 'The ratio between LCM and HCF of 5, 15, and 20 is:',
                  options: ['9:1', '4:3', '11:1', '12:1'],
                  correctIndex: 3,
                  explanation: 'HCF(5, 15, 20) = 5. LCM(5, 15, 20) = 60. Ratio = 60:5 = 12:1.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-m-ch2',
          chapterNumber: 2,
          title: 'Polynomials',
          summary: 'Geometrical meaning of zeroes, relationship between zeroes and coefficients of quadratic & cubic polynomials.',
          keyConcepts: ['Zeroes of Quadratic Polynomials', 'Sum (α + β = -b/a)', 'Product (αβ = c/a)', 'Parabola geometric graphs'],
          tests: [
            {
              id: 't-poly-1',
              title: 'Test 1: Zeroes & Coefficients Relations',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 4,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qp-1',
                  question: 'If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is:',
                  options: ['10', '-10', '-7', '-2'],
                  correctIndex: 1,
                  explanation: 'Substitute x = 2: 2² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.'
                },
                {
                  id: 'qp-2',
                  question: 'A quadratic polynomial whose zeroes are -3 and 4 is:',
                  options: ['x² - x + 12', 'x² + x + 12', 'x² - x - 12', '2x² + 2x - 24'],
                  correctIndex: 2,
                  explanation: 'Sum of zeroes = -3 + 4 = 1. Product = (-3)(4) = -12. Polynomial: x² - (sum)x + product = x² - x - 12.'
                },
                {
                  id: 'qp-3',
                  question: 'If α and β are zeroes of p(x) = 2x² + 5x + k such that α² + β² + αβ = 21/4, find k:',
                  options: ['1', '2', '3', '-1'],
                  correctIndex: 1,
                  explanation: 'α + β = -5/2, αβ = k/2. α² + β² + αβ = (α + β)² - αβ = 25/4 - k/2 = 21/4 => k/2 = 4/4 = 1 => k = 2.'
                },
                {
                  id: 'qp-4',
                  question: 'Number of zeroes of a polynomial whose graph cuts the x-axis at 3 points and touches at 1 point is:',
                  options: ['3', '4', '1', '2'],
                  correctIndex: 1,
                  explanation: 'The number of real zeroes is the total number of intersection and tangency points with the x-axis: 3 + 1 = 4.'
                }
              ]
            },
            {
              id: 't-poly-2',
              title: 'Test 2: Standard Level Polynomials Mastery',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 20,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qp2-1',
                  question: 'If zeroes of quadratic polynomial ax² + bx + c are both positive, then:',
                  options: ['a and b have same sign', 'a and c have opposite signs', 'a, b, and c all have same sign', 'a and c have same sign, and b has opposite sign'],
                  correctIndex: 3,
                  explanation: 'If α, β > 0, αβ = c/a > 0 (so a, c have same sign) and α + β = -b/a > 0 (so b/a < 0, meaning b and a have opposite signs).'
                },
                {
                  id: 'qp2-2',
                  question: 'If one zero of 3x² + 8x + k is reciprocal of the other, then value of k is:',
                  options: ['3', '-3', '1/3', '-1/3'],
                  correctIndex: 0,
                  explanation: 'If zeroes are α and 1/α, their product is α × (1/α) = 1. Product of zeroes = c/a = k/3 => k/3 = 1 => k = 3.'
                },
                {
                  id: 'qp2-3',
                  question: 'What is the degree of the zero polynomial?',
                  options: ['0', '1', 'Undefined', 'Any real number'],
                  correctIndex: 2,
                  explanation: 'The degree of the zero polynomial is mathematically undefined.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-m-ch3',
          chapterNumber: 3,
          title: 'Pair of Linear Equations in Two Variables',
          summary: 'Graphical method of solution, consistency/inconsistency, algebraic methods (substitution, elimination).',
          keyConcepts: ['Unique solution (a1/a2 ≠ b1/b2)', 'Infinite solutions (coincident)', 'No solution (parallel lines)', 'Elimination method'],
          tests: [
            {
              id: 't-le-1',
              title: 'Test 1: Consistency & Algebraic Methods',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'ql-1',
                  question: 'For what value of k do equations kx - 2y = 3 and 3x + y = 5 have a unique solution?',
                  options: ['k = -6', 'k ≠ -6', 'k = 6', 'k ≠ 6'],
                  correctIndex: 1,
                  explanation: 'For unique solution, a1/a2 ≠ b1/b2. Here k/3 ≠ -2/1 => k ≠ -6.'
                },
                {
                  id: 'ql-2',
                  question: 'The pair of linear equations 2x + 3y = 5 and 4x + 6y = 15 represents lines that are:',
                  options: ['Intersecting', 'Coincident', 'Parallel', 'Perpendicular'],
                  correctIndex: 2,
                  explanation: 'a1/a2 = 2/4 = 1/2. b1/b2 = 3/6 = 1/2. c1/c2 = 5/15 = 1/3. Since a1/a2 = b1/b2 ≠ c1/c2, the lines are parallel.'
                },
                {
                  id: 'ql-3',
                  question: 'Solve for x and y: x + y = 14 and x - y = 4:',
                  options: ['x = 9, y = 5', 'x = 10, y = 4', 'x = 8, y = 6', 'x = 11, y = 3'],
                  correctIndex: 0,
                  explanation: 'Adding both equations: 2x = 18 => x = 9. Substituting x gives y = 14 - 9 = 5.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-m-ch4',
          chapterNumber: 4,
          title: 'Quadratic Equations',
          summary: 'Standard form ax² + bx + c = 0, solutions by factorization and quadratic formula, nature of roots.',
          keyConcepts: ['Discriminant D = b² - 4ac', 'Real and distinct roots (D > 0)', 'Equal roots (D = 0)', 'Word problems'],
          tests: [
            {
              id: 't-qe-1',
              title: 'Test 1: Nature of Roots & Quadratic Formula',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qq-1',
                  question: 'The quadratic equation 2x² - √5x + 1 = 0 has:',
                  options: ['Two distinct real roots', 'Two equal real roots', 'No real roots', 'More than two roots'],
                  correctIndex: 2,
                  explanation: 'D = b² - 4ac = (-√5)² - 4(2)(1) = 5 - 8 = -3 < 0. Hence it has no real roots.'
                },
                {
                  id: 'qq-2',
                  question: 'If the equation x² + 2kx + 4 = 0 has equal roots, the values of k are:',
                  options: ['±1', '±2', '±4', '±3'],
                  correctIndex: 1,
                  explanation: 'For equal roots, D = 0 => (2k)² - 4(1)(4) = 0 => 4k² - 16 = 0 => k² = 4 => k = ±2.'
                },
                {
                  id: 'qq-3',
                  question: 'Which of the following is a root of the equation 3x² - 2√6x + 2 = 0?',
                  options: ['√(2/3)', '-√(2/3)', '√(3/2)', '2/√3'],
                  correctIndex: 0,
                  explanation: 'The equation is (√3x - √2)² = 0, giving double root x = √2 / √3 = √(2/3).'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-m-ch5',
          chapterNumber: 5,
          title: 'Arithmetic Progressions',
          summary: 'nth term of an AP, sum of the first n terms of an AP, and practical daily life applications.',
          keyConcepts: ['Common difference (d)', 'nth term: an = a + (n-1)d', 'Sum: Sn = n/2[2a + (n-1)d]', 'Arithmetic Mean'],
          tests: [
            {
              id: 't-ap-1',
              title: 'Test 1: AP Terms & Sum Formulae',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qa-1',
                  question: 'The 11th term of the AP: -3, -1/2, 2, ... is:',
                  options: ['28', '22', '-38', '-46½'],
                  correctIndex: 1,
                  explanation: 'First term a = -3, common difference d = -1/2 - (-3) = 5/2. 11th term = a + 10d = -3 + 10(5/2) = -3 + 25 = 22.'
                },
                {
                  id: 'qa-2',
                  question: 'If the sum of first n terms of an AP is 3n² + 5n, then its common difference is:',
                  options: ['3', '6', '5', '2'],
                  correctIndex: 1,
                  explanation: 'Sn = 3n² + 5n. S1 = 8 = a1. S2 = 3(4) + 10 = 22 = a1 + a2 => a2 = 14. Common difference d = 14 - 8 = 6.'
                },
                {
                  id: 'qa-3',
                  question: 'How many two-digit numbers are divisible by 3?',
                  options: ['25', '30', '33', '29'],
                  correctIndex: 1,
                  explanation: 'Series is 12, 15, ..., 99. an = 12 + (n-1)3 = 99 => 3(n-1) = 87 => n-1 = 29 => n = 30.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-m-ch6',
          chapterNumber: 6,
          title: 'Introduction to Trigonometry',
          summary: 'Trigonometric ratios of acute angles, trigonometric values for standard angles, identities.',
          keyConcepts: ['sin, cos, tan, cot, sec, cosec', 'Values at 0°, 30°, 45°, 60°, 90°', 'Identity: sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ'],
          tests: [
            {
              id: 't-trig-1',
              title: 'Test 1: Trigonometric Identities & Standard Angles',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 20,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qt-1',
                  question: 'If sin θ = 1/2, then the value of (3 cos θ - 4 cos³ θ) is:',
                  options: ['0', '1', '1/2', '√3/2'],
                  correctIndex: 0,
                  explanation: 'If sin θ = 1/2, θ = 30°. cos 30° = √3/2. 3(√3/2) - 4(3√3/8) = (3√3/2) - (3√3/2) = 0.'
                },
                {
                  id: 'qt-2',
                  question: 'The value of (1 + tan² θ)(1 - sin θ)(1 + sin θ) is equal to:',
                  options: ['0', '1', '-1', 'sec² θ'],
                  correctIndex: 1,
                  explanation: '(1 + tan² θ) = sec² θ. (1 - sin θ)(1 + sin θ) = 1 - sin² θ = cos² θ. sec² θ × cos² θ = 1.'
                },
                {
                  id: 'qt-3',
                  question: 'If tan θ + cot θ = 2, then tan² θ + cot² θ =',
                  options: ['2', '4', '1', '0'],
                  correctIndex: 0,
                  explanation: 'Squaring both sides: (tan θ + cot θ)² = 4 => tan² θ + cot² θ + 2 tan θ cot θ = 4 => tan² θ + cot² θ + 2(1) = 4 => 2.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c10-science',
      name: 'Science',
      code: 'SCI-10',
      category: 'science',
      stream: 'General',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c10-s-ch1',
          chapterNumber: 1,
          title: 'Chemical Reactions and Equations',
          summary: 'Balancing chemical equations, types of reactions (combination, decomposition, displacement, double displacement, redox).',
          keyConcepts: ['Balancing Mass Conservation', 'Exothermic & Endothermic', 'Oxidation & Reduction', 'Corrosion & Rancidity'],
          tests: [
            {
              id: 't-cr-1',
              title: 'Test 1: Types of Reactions & Balancing',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 4,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qs1',
                  question: 'When magnesium ribbon is burnt in air, the ash formed is:',
                  options: ['Black MgO₂', 'White MgO', 'Yellow Mg₃N₂', 'Grey Mg'],
                  correctIndex: 1,
                  explanation: 'Magnesium burns with a dazzling white flame to form white magnesium oxide (MgO) powder.'
                },
                {
                  id: 'qs2',
                  question: 'Heating of ferrous sulphate crystals (FeSO₄·7H₂O) is an example of:',
                  options: ['Combination reaction', 'Thermal decomposition reaction', 'Displacement reaction', 'Redox displacement'],
                  correctIndex: 1,
                  explanation: '2FeSO₄ + heat → Fe₂O₃ + SO₂ + SO₃. It breaks down into three products upon heating, characteristic of thermal decomposition.'
                },
                {
                  id: 'qs3',
                  question: 'In the reaction: CuO + H₂ → Cu + H₂O, which substance is oxidized?',
                  options: ['CuO', 'H₂', 'Cu', 'H₂O'],
                  correctIndex: 1,
                  explanation: 'Hydrogen (H₂) gains oxygen to become H₂O, which means it undergoes oxidation.'
                },
                {
                  id: 'qs4',
                  question: 'Respiration is an:',
                  options: ['Endothermic process', 'Exothermic process', 'Decomposition only', 'Combination only'],
                  correctIndex: 1,
                  explanation: 'During respiration, glucose combines with oxygen in the cells of our body and releases energy; hence it is an exothermic reaction.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-s-ch2',
          chapterNumber: 2,
          title: 'Acids, Bases and Salts',
          summary: 'Chemical properties of acids and bases, pH scale importance in everyday life, salts preparation & uses.',
          keyConcepts: ['pH scale 0 to 14', 'Neutralization reaction', 'Baking Soda & Bleaching Powder', 'Plaster of Paris'],
          tests: [
            {
              id: 't-abs-1',
              title: 'Test 1: Acid-Base Indicators & pH Scale',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qab-1',
                  question: 'What is the chemical formula of Plaster of Paris?',
                  options: ['CaSO₄·2H₂O', 'CaSO₄·½H₂O', 'CaSO₄·H₂O', '2CaSO₄·H₂O'],
                  correctIndex: 1,
                  explanation: 'Plaster of Paris is calcium sulphate hemihydrate, CaSO₄·½H₂O, prepared by heating gypsum at 373 K.'
                },
                {
                  id: 'qab-2',
                  question: 'An aqueous solution turns red litmus solution blue. Excess addition of which of the following would reverse the change?',
                  options: ['Baking powder', 'Lime', 'Ammonium hydroxide solution', 'Hydrochloric acid'],
                  correctIndex: 3,
                  explanation: 'Turning red litmus blue indicates an alkaline solution. Adding excess acid (HCl) neutralizes the base and turns the litmus back to red.'
                },
                {
                  id: 'qab-3',
                  question: 'Tooth enamel is the hardest substance in the human body. It is made up of:',
                  options: ['Calcium carbonate', 'Calcium hydroxyapatite', 'Calcium phosphate crystalline', 'Calcium fluoride'],
                  correctIndex: 1,
                  explanation: 'Tooth enamel is composed of calcium hydroxyapatite (a crystalline form of calcium phosphate), which corrodes when oral pH drops below 5.5.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-s-ch6',
          chapterNumber: 6,
          title: 'Life Processes',
          summary: 'Nutrition (autotrophic & heterotrophic), Respiration in humans and plants, Transportation and Excretion.',
          keyConcepts: ['Photosynthesis Light Reactions', 'Human Digestive Tract', 'Double Circulation in Heart', 'Nephron Filtration Unit'],
          tests: [
            {
              id: 't-lp-1',
              title: 'Test 1: Nutrition & Human Physiology',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qlp-1',
                  question: 'Which enzyme is present in human saliva that breaks down starch into simple sugar?',
                  options: ['Pepsin', 'Salivary amylase', 'Trypsin', 'Lipase'],
                  correctIndex: 1,
                  explanation: 'Salivary amylase (ptyalin) breaks down complex starch molecules into maltose sugar in the mouth.'
                },
                {
                  id: 'qlp-2',
                  question: 'The structural and functional filtration unit of kidneys is called:',
                  options: ['Neuron', 'Nephron', 'Alveolus', 'Glomerulus capsule only'],
                  correctIndex: 1,
                  explanation: 'The nephron is the basic microscopic filtration unit of the human kidney.'
                },
                {
                  id: 'qlp-3',
                  question: 'Oxygenated blood from lungs enters the human heart through:',
                  options: ['Vena Cava', 'Pulmonary Artery', 'Pulmonary Vein', 'Aorta'],
                  correctIndex: 2,
                  explanation: 'The pulmonary veins carry oxygen-rich blood from the lungs directly into the left atrium of the heart.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-s-ch10',
          chapterNumber: 10,
          title: 'Light - Reflection and Refraction',
          summary: 'Spherical mirrors, mirror formula, magnification, refraction through lenses, lens formula and power.',
          keyConcepts: ['Concave & Convex Mirrors', 'Refractive Index & Snell Law', 'Lens Formula 1/f = 1/v - 1/u', 'Power of Lens (P = 1/f in meters)'],
          tests: [
            {
              id: 't-light-1',
              title: 'Test 1: Optics & Ray Diagrams',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'ql-1',
                  question: 'A convex mirror with focal length f produces a magnification of 1/2. The distance of the object from the mirror is:',
                  options: ['f', '2f', 'f/2', '4f'],
                  correctIndex: 0,
                  explanation: 'm = -v/u = 1/2 => v = -u/2. Using mirror formula 1/f = 1/v + 1/u = -2/u + 1/u = -1/u. Thus u = -f, so object distance is f.'
                },
                {
                  id: 'ql-2',
                  question: 'SI unit of power of a lens is:',
                  options: ['Meter', 'Dioptre', 'Centimeter', 'Watt'],
                  correctIndex: 1,
                  explanation: 'The SI unit of optical power of a lens is Dioptre (D), where 1 D = 1 m⁻¹.'
                },
                {
                  id: 'ql-3',
                  question: 'Where should an object be placed in front of a convex lens to get a real image of the same size as the object?',
                  options: ['At focus F', 'At twice the focal length 2F', 'At infinity', 'Between optical center and focus'],
                  correctIndex: 1,
                  explanation: 'When placed at 2F (center of curvature), a convex lens forms an inverted, real image of the identical size at 2F on the opposite side.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c10-social',
      name: 'Social Science',
      code: 'SST-10',
      category: 'core',
      stream: 'General',
      icon: 'Globe',
      colorScheme: {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        iconBg: 'bg-sky-600 text-white',
        iconColor: 'text-sky-700',
        textColor: 'text-sky-950',
      },
      topics: [
        {
          id: 'c10-sst-ch1',
          chapterNumber: 1,
          title: 'The Rise of Nationalism in Europe',
          summary: 'French Revolution impact, making of nationalism in Europe, unification of Germany and Italy, visual representations.',
          keyConcepts: ['Frédéric Sorrieu Utopian Vision', 'Napoleonic Civil Code 1804', 'Zollverein Customs Union', 'Giuseppe Mazzini'],
          tests: [
            {
              id: 't-ne-1',
              title: 'Test 1: European Nationalism Milestones',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qs-1',
                  question: 'Who was proclaimed the King of united Italy in 1861?',
                  options: ['Victor Emmanuel II', 'Giuseppe Garibaldi', 'Count Cavour', 'Mazzini'],
                  correctIndex: 0,
                  explanation: 'In 1861 Victor Emmanuel II was officially proclaimed king of united Italy.'
                },
                {
                  id: 'qs-2',
                  question: 'The Civil Code of 1804 in France is commonly known as:',
                  options: ['French Code', 'Napoleonic Code', 'European Code', 'Jacobin Code'],
                  correctIndex: 1,
                  explanation: 'The Civil Code of 1804, introduced by Napoleon Bonaparte, abolished privileges based on birth and established equality before law.'
                },
                {
                  id: 'qs-3',
                  question: 'What was the main purpose of the Zollverein formed in 1834 at the initiative of Prussia?',
                  options: ['Military alliance', 'Abolishing tariff barriers and reducing currencies', 'Political unification', 'Religious coalition'],
                  correctIndex: 1,
                  explanation: 'Zollverein was a customs union formed to abolish tariff barriers and reduce the number of currencies from over thirty to two.'
                }
              ]
            }
          ]
        },
        {
          id: 'c10-sst-ch2',
          chapterNumber: 2,
          title: 'Power Sharing',
          summary: 'Case studies of Belgium and Sri Lanka, majoritarianism vs power sharing accommodations, forms of power sharing.',
          keyConcepts: ['Ethnic composition of Belgium', 'Majoritarianism in Sri Lanka (1956 Act)', 'Horizontal vs Vertical Sharing', 'Coalition Governments'],
          tests: [
            {
              id: 't-ps-1',
              title: 'Test 1: Models of Democratic Governance',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qps-1',
                  question: 'Which community in Sri Lanka secured official language status through the 1956 Act?',
                  options: ['Sinhala', 'Tamil', 'Indian Tamil', 'Muslim'],
                  correctIndex: 0,
                  explanation: 'In 1956, an Act was passed by the Sri Lankan parliament to recognize Sinhala as the only official language.'
                },
                {
                  id: 'qps-2',
                  question: 'Separation of powers between Legislature, Executive and Judiciary is an example of:',
                  options: ['Vertical division of power', 'Horizontal distribution of power', 'Federal system', 'Community government'],
                  correctIndex: 1,
                  explanation: 'Horizontal power sharing allows different organs of government placed at the same level to exercise different powers.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c10-english',
      name: 'English Language & Literature',
      code: 'ENG-10',
      category: 'languages',
      stream: 'General',
      icon: 'BookOpen',
      colorScheme: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-600 text-white',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-950',
      },
      topics: [
        {
          id: 'c10-eng-ch1',
          chapterNumber: 1,
          title: 'A Letter to God',
          summary: 'Story of Lencho, a poor hardworking farmer whose crops are destroyed by hailstorm, and his unshakable faith in God.',
          keyConcepts: ['Lenchos Faith & Irony', 'Postmaster Kindness', 'Human Generosity vs Cynicism', 'Symbolism of Hailstorm'],
          tests: [
            {
              id: 't-eng-1',
              title: 'Test 1: Comprehension & Character Sketch',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qe-1',
                  question: 'How much money did Lencho ask for, and how much did he receive?',
                  options: ['Asked 100 pesos, received 70 pesos', 'Asked 100 pesos, received 50 pesos', 'Asked 50 pesos, received 50 pesos', 'Asked 1000 pesos, received 700 pesos'],
                  correctIndex: 0,
                  explanation: 'Lencho asked God for 100 pesos to sow his field again, but the postmaster could gather only 70 pesos.'
                },
                {
                  id: 'qe-2',
                  question: 'What did Lencho think of the post office employees in his second letter?',
                  options: ['Angels of God', 'A bunch of crooks', 'Kind helpers', 'Uncaring officials'],
                  correctIndex: 1,
                  explanation: 'Lencho suspected that the post office workers stole the missing 30 pesos, ironic given they were the donors.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c10-hindi',
      name: 'Hindi',
      code: 'HIN-10',
      category: 'languages',
      stream: 'General',
      icon: 'Languages',
      colorScheme: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        iconBg: 'bg-rose-600 text-white',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-950',
      },
      topics: [
        {
          id: 'c10-hin-ch1',
          chapterNumber: 1,
          title: 'सूरदास के पद',
          summary: 'गोपियों और उद्धव का संवाद, विरह वेदना, कृष्ण प्रेम और योग संदेश की निरर्थकता पर व्यंग्य।',
          keyConcepts: ['उद्धव-गोपी संवाद', 'भ्रमरगीत प्रसंग', 'सगुण भक्ति बनाम निर्गुण योग', 'काव्य सौंदर्य एवं ब्रजभाषा'],
          tests: [
            {
              id: 't-hin-1',
              title: 'Test 1: पद्यांश एवं भाव-सौंदर्य परीक्षा',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qh-1',
                  question: 'गोपियों ने उद्धव के योग संदेश को किस वस्तु के समान कड़वा बताया?',
                  options: ['कड़वी ककड़ी', 'नीम का पत्ता', 'करेला', 'विष'],
                  correctIndex: 0,
                  explanation: 'सूरदास के पद में गोपियाँ उद्धव के योग को "ज्यौं करुई ककरी" (कड़वी ककड़ी) के समान कहती हैं।'
                },
                {
                  id: 'qh-2',
                  question: 'गोपियों ने अपनी तुलना गुड़ से लिपटी किससे की है?',
                  options: ['मधुमक्खी', 'चींटी (चांटी)', 'तितली', 'कोयल'],
                  correctIndex: 1,
                  explanation: '"गुर चांटी ज्यौं पागी" - गोपियाँ कहती हैं कि वे कृष्ण के प्रेम में चींटियों की तरह मग्न हैं।'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c10-it',
      name: 'Information Technology',
      code: 'IT-402',
      category: 'core',
      stream: 'General',
      icon: 'Laptop',
      colorScheme: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        iconBg: 'bg-teal-600 text-white',
        iconColor: 'text-teal-700',
        textColor: 'text-teal-950',
      },
      topics: [
        {
          id: 'c10-it-ch1',
          chapterNumber: 1,
          title: 'Digital Documentation (Advanced)',
          summary: 'Styles in word processor, inserting & formatting images, table of contents, and mail merge.',
          keyConcepts: ['Styles and Formatting', 'Mail Merge Data Source', 'Text Wrapping around Graphics', 'Template Customization'],
          tests: [
            {
              id: 't-it-1',
              title: 'Test 1: Word Processor Automation & Styles',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qit-1',
                  question: 'Which of the following features allows you to send a personalized letter to multiple recipients automatically?',
                  options: ['Mail Merge', 'Track Changes', 'Macros', 'AutoCorrect'],
                  correctIndex: 0,
                  explanation: 'Mail Merge combines a standard letter document with a recipient data source file to produce personalized output.'
                },
                {
                  id: 'qit-2',
                  question: 'Which style category formats character properties such as font name, size, bold, and italic in a document?',
                  options: ['Page Style', 'Character Style', 'Frame Style', 'List Style'],
                  correctIndex: 1,
                  explanation: 'Character Styles apply formatting to selected words or blocks of text within a paragraph without affecting the whole paragraph.'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '12': [
    {
      id: 'c12-phy',
      name: 'Physics',
      code: 'PHY-12',
      category: 'science',
      stream: 'Science',
      icon: 'Atom',
      colorScheme: {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        iconBg: 'bg-sky-600 text-white',
        iconColor: 'text-sky-700',
        textColor: 'text-sky-950',
      },
      topics: [
        {
          id: 'c12-p-ch1',
          chapterNumber: 1,
          title: 'Electric Charges and Fields',
          summary: 'Coulomb law, principle of superposition, continuous charge distribution, electric field, electric dipole, Gauss theorem.',
          keyConcepts: ['Gauss Law & Flux', 'Coulomb Force in Vector Form', 'Dipole in Uniform Electric Field', 'Electric Field lines'],
          tests: [
            {
              id: 't-ecf-1',
              title: 'Test 1: Coulomb Law & Electric Flux',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 3,
              durationMinutes: 15,
              marks: 15,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qp1',
                  question: 'SI unit of electric flux is:',
                  options: ['N C⁻¹', 'V m', 'N m C⁻²', 'V m⁻¹'],
                  correctIndex: 1,
                  explanation: 'Electric flux Φ = E · A = (N/C) · m² = (V/m) · m² = Volt · meter (V m).'
                },
                {
                  id: 'qp2',
                  question: 'An electric dipole of moment p placed in a uniform electric field E experiences maximum torque when angle between p and E is:',
                  options: ['0°', '45°', '90°', '180°'],
                  correctIndex: 2,
                  explanation: 'Torque τ = pE sin θ. Maximum torque occurs when sin θ = 1, i.e., θ = 90°.'
                },
                {
                  id: 'qp3',
                  question: 'Total electric flux through a closed surface enclosing a charge Q in vacuum is:',
                  options: ['Q / ε₀', 'Q ε₀', '4π Q', 'Zero always'],
                  correctIndex: 0,
                  explanation: 'According to Gauss law, total flux Φ = q_enclosed / ε₀.'
                }
              ]
            }
          ]
        },
        {
          id: 'c12-p-ch3',
          chapterNumber: 3,
          title: 'Current Electricity',
          summary: 'Ohm law, drift velocity, resistivity, temperature dependence, Kirchhoff laws, Wheatstone bridge.',
          keyConcepts: ['Drift Velocity & Relaxation Time', 'Kirchhoff Voltage & Current Laws', 'Wheatstone Balanced Bridge', 'Internal Resistance of Cell'],
          tests: [
            {
              id: 't-ce-1',
              title: 'Test 1: Drift Velocity & Circuit Analysis',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qce-1',
                  question: 'When temperature of a metallic conductor is increased, its electrical conductivity:',
                  options: ['Increases', 'Decreases', 'Remains constant', 'First increases then decreases'],
                  correctIndex: 1,
                  explanation: 'Higher temperature increases collision frequency of free electrons with lattice ions, decreasing relaxation time τ and conductivity.'
                },
                {
                  id: 'qce-2',
                  question: 'Kirchhoff first rule (junction rule) is based on the conservation of:',
                  options: ['Energy', 'Electric charge', 'Momentum', 'Mass'],
                  correctIndex: 1,
                  explanation: 'Kirchhoff junction rule states total incoming current equals outgoing current, reflecting conservation of electric charge.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c12-chem',
      name: 'Chemistry',
      code: 'CHEM-12',
      category: 'science',
      stream: 'Science',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c12-c-ch1',
          chapterNumber: 1,
          title: 'Solutions',
          summary: 'Types of solutions, Raoult law, colligative properties (elevation in boiling point, depression in freezing point), van\'t Hoff factor.',
          keyConcepts: ['Henry Law of Gas Solubility', 'Raoult Law of Ideal Solutions', 'Osmotic Pressure & Reverse Osmosis', 'Van\'t Hoff factor (i)'],
          tests: [
            {
              id: 't-sol-1',
              title: 'Test 1: Colligative Properties & Concentration',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qsol-1',
                  question: 'Which of the following concentration terms is independent of temperature?',
                  options: ['Molarity', 'Molality', 'Normality', 'Formality'],
                  correctIndex: 1,
                  explanation: 'Molality is defined per mass of solvent (kg). Since mass does not depend on temperature, molality is temperature-independent.'
                },
                {
                  id: 'qsol-2',
                  question: 'Van\'t Hoff factor (i) for complete dissociation of BaCl₂ in aqueous solution is:',
                  options: ['1', '2', '3', '4'],
                  correctIndex: 2,
                  explanation: 'BaCl₂ → Ba²⁺ + 2Cl⁻. One molecule yields 3 ions, so i = 3.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c12-maths',
      name: 'Mathematics',
      code: 'MATH-12',
      category: 'science',
      stream: 'Science',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-600 text-white',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-950',
      },
      topics: [
        {
          id: 'c12-m-ch1',
          chapterNumber: 1,
          title: 'Relations and Functions',
          summary: 'Reflexive, symmetric, transitive relations, equivalence relations, injective, surjective, and bijective mappings.',
          keyConcepts: ['Equivalence Relations', 'One-One (Injective)', 'Onto (Surjective)', 'Bijective Function Properties'],
          tests: [
            {
              id: 't-rf-1',
              title: 'Test 1: Relation Types & Bijection',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qrf-1',
                  question: 'Let R be a relation on the set of natural numbers defined by aRb iff a divides b. Then R is:',
                  options: ['Equivalence', 'Reflexive & transitive but not symmetric', 'Symmetric & transitive', 'Reflexive only'],
                  correctIndex: 1,
                  explanation: 'Any number divides itself (reflexive). If a|b and b|c then a|c (transitive). But 2 divides 4 while 4 does not divide 2 (not symmetric).'
                },
                {
                  id: 'qrf-2',
                  question: 'The function f: R → R defined by f(x) = 3 - 4x is:',
                  options: ['One-one and onto (bijective)', 'One-one but not onto', 'Onto but not one-one', 'Neither one-one nor onto'],
                  correctIndex: 0,
                  explanation: '3 - 4x1 = 3 - 4x2 => x1 = x2 (one-one). For any real y, x = (3 - y)/4 ∈ R (onto). Hence bijective.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c12-acc',
      name: 'Accountancy',
      code: 'ACC-12',
      category: 'commerce',
      stream: 'Commerce',
      icon: 'Receipt',
      colorScheme: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-600 text-white',
        iconColor: 'text-indigo-700',
        textColor: 'text-indigo-950',
      },
      topics: [
        {
          id: 'c12-acc-ch1',
          chapterNumber: 1,
          title: 'Accounting for Partnership Firms',
          summary: 'Nature of partnership, partnership deed, profit and loss appropriation, fixed vs fluctuating capital accounts.',
          keyConcepts: ['Profit & Loss Appropriation', 'Interest on Capital & Drawings', 'Past Adjustments in Accounts', 'Guarantee of Profits'],
          tests: [
            {
              id: 't-acc-1',
              title: 'Test 1: Partnership Fundamentals',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qa1',
                  question: 'In the absence of a partnership deed, the rate of interest allowed on partner loan is:',
                  options: ['6% p.a. simple interest', '10% p.a.', '12% p.a.', 'No interest is paid'],
                  correctIndex: 0,
                  explanation: 'According to the Indian Partnership Act 1932, in absence of agreement, interest on partner loan is 6% per annum.'
                },
                {
                  id: 'qa2',
                  question: 'Where is Interest on Partner Drawings recorded in final partnership accounts?',
                  options: ['Credit of P&L Appropriation A/c', 'Debit of P&L Appropriation A/c', 'Debit of Cash A/c only', 'Liability side of Balance Sheet'],
                  correctIndex: 0,
                  explanation: 'Interest on drawings is an income for the firm and is credited to the Profit and Loss Appropriation Account.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c12-bst',
      name: 'Business Studies',
      code: 'BST-12',
      category: 'commerce',
      stream: 'Commerce',
      icon: 'Briefcase',
      colorScheme: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        iconBg: 'bg-rose-600 text-white',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-950',
      },
      topics: [
        {
          id: 'c12-bst-ch1',
          chapterNumber: 1,
          title: 'Nature and Significance of Management',
          summary: 'Concept, objectives, importance, levels of management, management as art/science/profession, coordination essence.',
          keyConcepts: ['Effectiveness vs Efficiency', 'Fayol 14 Principles', 'Top, Middle, Lower Management', 'Coordination as Essence'],
          tests: [
            {
              id: 't-bst-1',
              title: 'Test 1: Core Principles & Management Levels',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qbs1',
                  question: 'Completing the target on time, regardless of cost, reflects:',
                  options: ['Efficiency', 'Effectiveness', 'Planning', 'Controlling'],
                  correctIndex: 1,
                  explanation: 'Effectiveness is concerned with end results and finishing the given task on time.'
                },
                {
                  id: 'qbs2',
                  question: 'Which element is considered the unifying thread and the "essence of management"?',
                  options: ['Staffing', 'Directing', 'Coordination', 'Budgeting'],
                  correctIndex: 2,
                  explanation: 'Coordination harmonizes individual efforts towards accomplishment of group goals, making it the essence of management.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c12-eco',
      name: 'Economics',
      code: 'ECO-12',
      category: 'commerce',
      stream: 'Commerce',
      icon: 'TrendingUp',
      colorScheme: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        iconBg: 'bg-teal-600 text-white',
        iconColor: 'text-teal-700',
        textColor: 'text-teal-950',
      },
      topics: [
        {
          id: 'c12-eco-ch1',
          chapterNumber: 1,
          title: 'Macroeconomics: National Income Accounting',
          summary: 'Circular flow of income, aggregates related to national income (GDP, NDP, GNP, NNP), measurement methods.',
          keyConcepts: ['Value Added Method', 'Income & Expenditure Methods', 'Real vs Nominal GDP', 'GDP Deflator'],
          tests: [
            {
              id: 't-eco-1',
              title: 'Test 1: National Income Aggregates',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'qe1',
                  question: 'National Income at factor cost is represented as:',
                  options: ['GDP_mp', 'NNP_fc', 'NDP_mp', 'GNP_fc'],
                  correctIndex: 1,
                  explanation: 'National Income is scientifically defined as Net National Product at factor cost (NNP_fc).'
                },
                {
                  id: 'qe2',
                  question: 'Real GDP measures output valued at:',
                  options: ['Current year prices', 'Base year constant prices', 'International dollar rates', 'Future expected prices'],
                  correctIndex: 1,
                  explanation: 'Real GDP evaluates physical volume of output using constant base year prices to remove inflation distortion.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c12-hist',
      name: 'History',
      code: 'HIST-12',
      category: 'humanities',
      stream: 'Humanities',
      icon: 'Landmark',
      colorScheme: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        iconBg: 'bg-orange-600 text-white',
        iconColor: 'text-orange-700',
        textColor: 'text-orange-950',
      },
      topics: [
        {
          id: 'c12-h-ch1',
          chapterNumber: 1,
          title: 'Bricks, Beads and Bones (Harappan Civilisation)',
          summary: 'Subsistence strategies, architectural layout of Mohenjodaro, craft production, seals, scripts, and decline.',
          keyConcepts: ['Harappan Town Planning & Drainage', 'The Great Bath Architecture', 'Lothal Dockyard Crafts', 'Script & Weight Standards'],
          tests: [
            {
              id: 't-har-1',
              title: 'Test 1: Harappan Settlement & Archeology',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'qh1',
                  question: 'The Great Bath was discovered in which Indus Valley site?',
                  options: ['Harappa', 'Mohenjodaro', 'Kalibangan', 'Dholavira'],
                  correctIndex: 1,
                  explanation: 'The famous monumental Great Bath was excavated in the citadel mound of Mohenjodaro.'
                },
                {
                  id: 'qh2',
                  question: 'Which stone was predominantly used by Harappans to produce micro-weights?',
                  options: ['Chert', 'Marble', 'Sandstone', 'Granite'],
                  correctIndex: 0,
                  explanation: 'Harappan cubical weights were crafted precisely from chert stones with binary grading.'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '6': [
    {
      id: 'c6-maths',
      name: 'Mathematics',
      code: 'MATH-6',
      category: 'core',
      stream: 'General',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c6-m-ch1',
          chapterNumber: 1,
          title: 'Knowing Our Numbers',
          summary: 'Comparing numbers, place value system, Indian & International number systems, estimation and Roman numerals.',
          keyConcepts: ['Large Numbers & Place Value', 'Estimation by Rounding Off', 'BODMAS Brackets', 'Roman Numerals I to M'],
          tests: [
            {
              id: 't-c6-m1',
              title: 'Test 1: Number Systems & Comparison',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q6m1',
                  question: 'How many thousands make one lakh in the Indian number system?',
                  options: ['10', '100', '1000', '10,000'],
                  correctIndex: 1,
                  explanation: '1 lakh = 1,00,000 = 100 thousands.'
                },
                {
                  id: 'q6m2',
                  question: 'Roman numeral for 79 is:',
                  options: ['LXXIX', 'LXXVIIII', 'XXCIX', 'LXIX'],
                  correctIndex: 0,
                  explanation: '79 = 70 + 9 = (50 + 10 + 10) + (10 - 1) = LXX + IX = LXXIX.'
                }
              ]
            }
          ]
        },
        {
          id: 'c6-m-ch2',
          chapterNumber: 2,
          title: 'Whole Numbers',
          summary: 'Predecessor, successor, number line representation, properties of whole numbers (closure, commutative, associative, distributive).',
          keyConcepts: ['Natural vs Whole Numbers', 'Addition on Number Line', 'Distributive Property', 'Identity for Multiplications'],
          tests: [
            {
              id: 't-c6-m2',
              title: 'Test 1: Whole Number Properties',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q6m2-1',
                  question: 'The smallest whole number is:',
                  options: ['0', '1', '-1', 'None of these'],
                  correctIndex: 0,
                  explanation: 'Whole numbers start from 0: {0, 1, 2, 3...}. Thus 0 is the smallest whole number.'
                },
                {
                  id: 'q6m2-2',
                  question: 'What is the multiplicative identity for whole numbers?',
                  options: ['0', '1', '2', '-1'],
                  correctIndex: 1,
                  explanation: 'Multiplying any whole number a by 1 gives a × 1 = a. Hence 1 is the multiplicative identity.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c6-sci',
      name: 'Science',
      code: 'SCI-6',
      category: 'science',
      stream: 'General',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        iconBg: 'bg-sky-600 text-white',
        iconColor: 'text-sky-700',
        textColor: 'text-sky-950',
      },
      topics: [
        {
          id: 'c6-s-ch1',
          chapterNumber: 1,
          title: 'Components of Food',
          summary: 'Nutrients in food (carbohydrates, fats, proteins, vitamins, minerals), dietary fibres, water, balanced diet, deficiency diseases.',
          keyConcepts: ['Energy Giving Foods', 'Body Building Proteins', 'Balanced Diet Meal Plate', 'Vitamins & Scurvy / Rickets'],
          tests: [
            {
              id: 't-c6-s1',
              title: 'Test 1: Nutrients & Deficiency Diseases',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q6s1',
                  question: 'Night blindness is caused due to deficiency of which vitamin?',
                  options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
                  correctIndex: 0,
                  explanation: 'Deficiency of Vitamin A leads to poor vision and loss of vision in darkness (night blindness).'
                },
                {
                  id: 'q6s2',
                  question: 'Blue-black color during iodine test indicates presence of:',
                  options: ['Proteins', 'Starch', 'Fats', 'Vitamins'],
                  correctIndex: 1,
                  explanation: 'When dilute iodine solution is dropped on food containing starch, it turns deep blue-black.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c6-sst',
      name: 'Social Science',
      code: 'SST-6',
      category: 'core',
      stream: 'General',
      icon: 'Globe',
      colorScheme: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-600 text-white',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-950',
      },
      topics: [
        {
          id: 'c6-sst-ch1',
          chapterNumber: 1,
          title: 'The Earth in the Solar System',
          summary: 'Celestial bodies, constellations, the sun, planets, the earth, moon, asteroids, and meteoroids.',
          keyConcepts: ['Planetary Orbits', 'Unique Living Planet Earth', 'Phases of the Moon', 'Asteroid Belt between Mars & Jupiter'],
          tests: [
            {
              id: 't-c6-sst1',
              title: 'Test 1: Solar System Explorers',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q6sst1',
                  question: 'The planet known as the "Earth\'s Twin" because of its similar size and shape is:',
                  options: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
                  correctIndex: 0,
                  explanation: 'Venus is called Earth\'s twin because its size and mass are very close to Earth\'s.'
                },
                {
                  id: 'q6sst2',
                  question: 'Which celestial body is at the center of the solar system?',
                  options: ['Earth', 'Sun', 'Moon', 'Jupiter'],
                  correctIndex: 1,
                  explanation: 'The Sun is at the center of our solar system, holding all planets in gravitational orbits.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c6-eng',
      name: 'English',
      code: 'ENG-6',
      category: 'languages',
      stream: 'General',
      icon: 'BookOpen',
      colorScheme: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        iconBg: 'bg-rose-600 text-white',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-950',
      },
      topics: [
        {
          id: 'c6-eng-ch1',
          chapterNumber: 1,
          title: 'Who Did Patrick\'s Homework?',
          summary: 'A delightful tale about young Patrick who hated homework and found a tiny elf who made him study and learn by himself.',
          keyConcepts: ['Self Help & Diligence', 'Character Growth of Patrick', 'Story Moral', 'Vocabulary Building'],
          tests: [
            {
              id: 't-c6-e1',
              title: 'Test 1: Reading Comprehension',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q6e1',
                  question: 'Who actually did Patrick\'s homework in the end?',
                  options: ['The tiny elf', 'Patrick himself', 'Patrick\'s mother', 'His teachers'],
                  correctIndex: 1,
                  explanation: 'Patrick had to look up words, do calculations, and read books to guide the elf, so Patrick did his own homework.'
                },
                {
                  id: 'q6e2',
                  question: 'What game did Patrick prefer playing instead of homework?',
                  options: ['Hockey, basketball and Nintendo', 'Chess and carrom', 'Cricket and football', 'Badminton'],
                  correctIndex: 0,
                  explanation: 'Patrick loved playing hockey, basketball, and Nintendo video games.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c6-hin',
      name: 'Hindi',
      code: 'HIN-6',
      category: 'languages',
      stream: 'General',
      icon: 'Languages',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-600 text-white',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-950',
      },
      topics: [
        {
          id: 'c6-h-ch1',
          chapterNumber: 1,
          title: 'वह चिड़िया जो (कविता)',
          summary: 'केदारनाथ अग्रवाल द्वारा रचित कविता, नीले पंखों वाली संतोषी चिड़िया का प्रकृति और नदी के जल से प्रेम।',
          keyConcepts: ['कविता का भावार्थ', 'प्रकृति प्रेम', 'संतोषी स्वभाव', 'शब्दार्थ एवं तुकांत शब्द'],
          tests: [
            {
              id: 't-c6-h1',
              title: 'Test 1: कविता भावार्थ एवं प्रश्नोत्तरी',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q6h1',
                  question: 'नीले पंखों वाली चिड़िया को किससे बहुत प्यार है?',
                  options: ['अन्न और नदी से', 'सोने के पिंजरे से', 'मिठाई से', 'खिलौनों से'],
                  correctIndex: 0,
                  explanation: 'कविता में चिड़िया को ज्वार के दाने (अन्न) और उफनती नदी के जल से अत्यंत प्रेम है।'
                },
                {
                  id: 'q6h2',
                  question: 'कविता "वह चिड़िया जो" के कवि कौन हैं?',
                  options: ['केदारनाथ अग्रवाल', 'सूर्यकांत त्रिपाठी निराला', 'सुमित्रानंदन पंत', 'महादेवी वर्मा'],
                  correctIndex: 0,
                  explanation: 'इस कविता के रचयिता केदारनाथ अग्रवाल हैं।'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '7': [
    {
      id: 'c7-maths',
      name: 'Mathematics',
      code: 'MATH-7',
      category: 'core',
      stream: 'General',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        iconBg: 'bg-sky-600 text-white',
        iconColor: 'text-sky-700',
        textColor: 'text-sky-950',
      },
      topics: [
        {
          id: 'c7-m-ch1',
          chapterNumber: 1,
          title: 'Integers',
          summary: 'Properties of addition, subtraction, multiplication, and division of positive and negative integers.',
          keyConcepts: ['Multiplication Rules', 'Distributive Property', 'Additive Inverse', 'Signs in Division'],
          tests: [
            {
              id: 't-c7-m1',
              title: 'Test 1: Integer Operations & Properties',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q7m1',
                  question: 'The value of (-25) × [(-10) + 4] is:',
                  options: ['150', '-150', '350', '-350'],
                  correctIndex: 0,
                  explanation: '(-10) + 4 = -6. Then (-25) × (-6) = +150.'
                },
                {
                  id: 'q7m2',
                  question: 'What is the additive inverse of -18?',
                  options: ['18', '0', '-1', '1/18'],
                  correctIndex: 0,
                  explanation: 'Additive inverse of -a is a because (-18) + 18 = 0.'
                }
              ]
            }
          ]
        },
        {
          id: 'c7-m-ch2',
          chapterNumber: 2,
          title: 'Fractions and Decimals',
          summary: 'Multiplication and division of proper, improper, mixed fractions and decimal numbers.',
          keyConcepts: ['Reciprocal of Fractions', 'Decimal Point Shifts', 'Word Problems', 'Fraction Product Rules'],
          tests: [
            {
              id: 't-c7-m2',
              title: 'Test 1: Fraction & Decimal Mastery',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q7m2-1',
                  question: 'Divide: 2/5 ÷ 1/2 =',
                  options: ['4/5', '1/5', '5/4', '1/10'],
                  correctIndex: 0,
                  explanation: '2/5 ÷ 1/2 = 2/5 × 2/1 = 4/5.'
                },
                {
                  id: 'q7m2-2',
                  question: '0.2 × 0.3 =',
                  options: ['0.06', '0.6', '6.0', '0.006'],
                  correctIndex: 0,
                  explanation: '2 × 3 = 6. With two total decimal places, the answer is 0.06.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c7-sci',
      name: 'Science',
      code: 'SCI-7',
      category: 'science',
      stream: 'General',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c7-s-ch1',
          chapterNumber: 1,
          title: 'Nutrition in Plants',
          summary: 'Autotrophic mode of nutrition, photosynthesis raw materials, heterotrophic plants (parasites, insectivorous, saprotrophs).',
          keyConcepts: ['Chlorophyll & Stomata', 'Pitcher Plant insect trap', 'Cuscuta Parasite', 'Symbiotic Fungi & Lichen'],
          tests: [
            {
              id: 't-c7-s1',
              title: 'Test 1: Photosynthesis & Plant Adaptations',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q7s1',
                  question: 'Which gas is released by green plants during the process of photosynthesis?',
                  options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Methane'],
                  correctIndex: 0,
                  explanation: 'Green plants absorb CO₂ and release oxygen gas (O₂) during photosynthesis.'
                },
                {
                  id: 'q7s2',
                  question: 'Pitcher plant traps insects because:',
                  options: ['It grows in nitrogen-deficient soil', 'It cannot photosynthesize', 'It needs water', 'It has no roots'],
                  correctIndex: 0,
                  explanation: 'Insectivorous plants grow in nutrient-poor soils and digest insects to fulfill their nitrogen requirements.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c7-sst',
      name: 'Social Science',
      code: 'SST-7',
      category: 'core',
      stream: 'General',
      icon: 'Globe',
      colorScheme: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-600 text-white',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-950',
      },
      topics: [
        {
          id: 'c7-sst-ch1',
          chapterNumber: 1,
          title: 'Environment & Earth Interiors',
          summary: 'Natural and human-made environment, crust, mantle, core, types of rocks (igneous, sedimentary, metamorphic).',
          keyConcepts: ['Biosphere Harmony', 'Crust SIAL & SIMA', 'Rock Cycle Transformation', 'Magma Extrusive vs Intrusive'],
          tests: [
            {
              id: 't-c7-sst1',
              title: 'Test 1: Geological Layers & Environment',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q7sst1',
                  question: 'The innermost layer of the earth is known as:',
                  options: ['Core (NIFE)', 'Mantle', 'Crust', 'Lithosphere'],
                  correctIndex: 0,
                  explanation: 'The core is the innermost layer made predominantly of nickel and iron (NIFE).'
                },
                {
                  id: 'q7sst2',
                  question: 'Rocks formed by cooling of molten magma are called:',
                  options: ['Igneous rocks', 'Sedimentary rocks', 'Metamorphic rocks', 'Fossil rocks'],
                  correctIndex: 0,
                  explanation: 'Igneous rocks (from Latin "ignis" meaning fire) are formed when magma solidifies.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c7-eng',
      name: 'English',
      code: 'ENG-7',
      category: 'languages',
      stream: 'General',
      icon: 'BookOpen',
      colorScheme: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        iconBg: 'bg-rose-600 text-white',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-950',
      },
      topics: [
        {
          id: 'c7-eng-ch1',
          chapterNumber: 1,
          title: 'Three Questions (Leo Tolstoy)',
          summary: 'A king seeks answers to three essential life questions: right time to do things, right people to listen to, and what is most important.',
          keyConcepts: ['Right Time is NOW', 'The Most Important Person', 'Doing Good to Others', 'The Wise Hermit Wisdom'],
          tests: [
            {
              id: 't-c7-e1',
              title: 'Test 1: Theme & Life Lesson',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q7e1',
                  question: 'According to the hermit, the most important time is always:',
                  options: ['Now (Present moment)', 'Tomorrow', 'Past', 'When consulting scholars'],
                  correctIndex: 0,
                  explanation: 'The hermit teaches that NOW is the only time we have any power over.'
                },
                {
                  id: 'q7e2',
                  question: 'Whom did the king help that turned out to be an enemy seeking revenge?',
                  options: ['A bearded wounded man', 'A royal soldier', 'A traveling merchant', 'The village chief'],
                  correctIndex: 0,
                  explanation: 'The king cleaned and bandaged the wounds of a bearded man, who was his enemy turned friend.'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '8': [
    {
      id: 'c8-maths',
      name: 'Mathematics',
      code: 'MATH-8',
      category: 'core',
      stream: 'General',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-600 text-white',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-950',
      },
      topics: [
        {
          id: 'c8-m-ch1',
          chapterNumber: 1,
          title: 'Rational Numbers',
          summary: 'Properties of rational numbers, representation on number line, rational numbers between two rational numbers.',
          keyConcepts: ['Closure & Associativity', 'Distributivity over Addition', 'Negative Reciprocal', 'Mean Method between Numbers'],
          tests: [
            {
              id: 't-c8-m1',
              title: 'Test 1: Rational Numbers Fundamentals',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q8m1',
                  question: 'Which number has no reciprocal?',
                  options: ['0', '1', '-1', '10'],
                  correctIndex: 0,
                  explanation: 'Division by zero is undefined, so 0 has no reciprocal.'
                },
                {
                  id: 'q8m2',
                  question: 'The product of two rational numbers is always a:',
                  options: ['Rational number', 'Irrational number', 'Natural number only', 'Integer only'],
                  correctIndex: 0,
                  explanation: 'Rational numbers are closed under multiplication.'
                }
              ]
            }
          ]
        },
        {
          id: 'c8-m-ch2',
          chapterNumber: 2,
          title: 'Linear Equations in One Variable',
          summary: 'Solving linear equations with variables on one side, variables on both sides, and real world applications.',
          keyConcepts: ['Transposition Method', 'Cross Multiplication', 'Age & Perimeter word problems', 'Simplifying expressions'],
          tests: [
            {
              id: 't-c8-m2',
              title: 'Test 1: Equation Solving Techniques',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q8m2-1',
                  question: 'Solve for x: 5x + 9 = 5 + 3x:',
                  options: ['-2', '2', '7', '-7'],
                  correctIndex: 0,
                  explanation: '5x - 3x = 5 - 9 => 2x = -4 => x = -2.'
                },
                {
                  id: 'q8m2-2',
                  question: 'The perimeter of a rectangle is 13 cm and width is 2¾ cm. Find its length:',
                  options: ['3¾ cm', '4½ cm', '3½ cm', '2½ cm'],
                  correctIndex: 0,
                  explanation: '2(l + 11/4) = 13 => l + 11/4 = 13/2 = 26/4 => l = 15/4 = 3¾ cm.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c8-sci',
      name: 'Science',
      code: 'SCI-8',
      category: 'science',
      stream: 'General',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c8-s-ch1',
          chapterNumber: 1,
          title: 'Crop Production and Management',
          summary: 'Agricultural practices: preparation of soil, sowing, adding manure/fertilizers, irrigation, harvesting, and storage.',
          keyConcepts: ['Kharif vs Rabi Crops', 'Traditional vs Drip Irrigation', 'Fertilizer vs Organic Manure', 'Silos Storage Protection'],
          tests: [
            {
              id: 't-c8-s1',
              title: 'Test 1: Crop Cycles & Soil Prep',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q8s1',
                  question: 'Which of the following is a Kharif crop sown in rainy season?',
                  options: ['Paddy (Rice)', 'Wheat', 'Gram', 'Mustard'],
                  correctIndex: 0,
                  explanation: 'Paddy is a Kharif crop requiring abundant water, grown between June and October.'
                },
                {
                  id: 'q8s2',
                  question: 'Which irrigation system waters drop by drop at the root zone, saving maximum water?',
                  options: ['Drip system', 'Sprinkler system', 'Chain pump', 'Rahat system'],
                  correctIndex: 0,
                  explanation: 'The drip irrigation system supplies water drop by drop near plant roots.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c8-sst',
      name: 'Social Science',
      code: 'SST-8',
      category: 'core',
      stream: 'General',
      icon: 'Globe',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-600 text-white',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-950',
      },
      topics: [
        {
          id: 'c8-sst-ch1',
          chapterNumber: 1,
          title: 'From Trade to Territory (The East India Company)',
          summary: 'Mercantilism, Battle of Plassey (1757), Battle of Buxar (1764), Subsidiary Alliance, Doctrine of Lapse.',
          keyConcepts: ['Robert Clive & Mir Jafar', 'Diwani rights of Bengal', 'Lord Dalhousie Annexations', 'Sepoy Army Reorganization'],
          tests: [
            {
              id: 't-c8-sst1',
              title: 'Test 1: Colonial Expansion Milestones',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q8sst1',
                  question: 'In which year was the historic Battle of Plassey fought?',
                  options: ['1757', '1764', '1857', '1707'],
                  correctIndex: 0,
                  explanation: 'The Battle of Plassey took place in 1757, marking British East India Company territorial foothold.'
                },
                {
                  id: 'q8sst2',
                  question: 'Who introduced the Doctrine of Lapse policy in India?',
                  options: ['Lord Dalhousie', 'Lord Wellesley', 'Warren Hastings', 'Lord Cornwallis'],
                  correctIndex: 0,
                  explanation: 'Governor-General Lord Dalhousie devised the Doctrine of Lapse to annex kingdoms without natural heirs.'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '9': [
    {
      id: 'c9-maths',
      name: 'Mathematics',
      code: 'MATH-9',
      category: 'core',
      stream: 'General',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        iconBg: 'bg-rose-600 text-white',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-950',
      },
      topics: [
        {
          id: 'c9-m-ch1',
          chapterNumber: 1,
          title: 'Number Systems',
          summary: 'Irrational numbers, real numbers and decimal representations, representing numbers on number line, laws of exponents for real numbers.',
          keyConcepts: ['Locating √2, √3 on Number Line', 'Rationalization of Denominators', 'Laws of Exponents (aᵖ · aᑫ = aᵖ⁺ᑫ)', 'Non-terminating Non-repeating'],
          tests: [
            {
              id: 't-c9-m1',
              title: 'Test 1: Rationalization & Exponent Rules',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'q9m1',
                  question: 'Rationalize the denominator of 1 / (√7 - √6):',
                  options: ['√7 + √6', '√7 - √6', '(√7 + √6)/13', '1'],
                  correctIndex: 0,
                  explanation: 'Multiply numerator and denominator by (√7 + √6): 1(√7 + √6) / (7 - 6) = √7 + √6.'
                },
                {
                  id: 'q9m2',
                  question: 'Value of (64)⁻¹/⁶ is:',
                  options: ['1/2', '2', '-2', '1/64'],
                  correctIndex: 0,
                  explanation: '64 = 2⁶. (2⁶)⁻¹/⁶ = 2⁻¹ = 1/2.'
                }
              ]
            }
          ]
        },
        {
          id: 'c9-m-ch2',
          chapterNumber: 2,
          title: 'Polynomials',
          summary: 'Polynomials in one variable, zeroes of a polynomial, Remainder Theorem, Factor Theorem, algebraic identities.',
          keyConcepts: ['Identity: (x+y+z)²', 'Identity: x³ + y³ + z³ - 3xyz', 'Factor Theorem Proof', 'Splitting the Middle Term'],
          tests: [
            {
              id: 't-c9-m2',
              title: 'Test 1: Algebraic Identities & Factorization',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'q9m2-1',
                  question: 'If x + y + z = 0, then x³ + y³ + z³ is equal to:',
                  options: ['3xyz', '0', 'xyz', '3(x+y+z)'],
                  correctIndex: 0,
                  explanation: 'From the identity: x³ + y³ + z³ - 3xyz = (x+y+z)(x²+y²+z²-xy-yz-zx). When x+y+z=0, x³+y³+z³ = 3xyz.'
                },
                {
                  id: 'q9m2-2',
                  question: 'Degree of the constant non-zero polynomial is:',
                  options: ['0', '1', 'Undefined', 'Any integer'],
                  correctIndex: 0,
                  explanation: 'Any non-zero constant k can be written as k · x⁰, so its degree is 0.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c9-sci',
      name: 'Science',
      code: 'SCI-9',
      category: 'science',
      stream: 'General',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c9-s-ch1',
          chapterNumber: 1,
          title: 'Matter in Our Surroundings',
          summary: 'Physical nature of matter, states of matter (solid, liquid, gas), change of state, evaporation and factors affecting it.',
          keyConcepts: ['Latent Heat of Vaporization', 'Sublimation of Camphor / NH₄Cl', 'Evaporation Cooling Effect', 'Kelvin to Celsius Scale'],
          tests: [
            {
              id: 't-c9-s1',
              title: 'Test 1: States of Matter & Phase Changes',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q9s1',
                  question: 'Convert 300 K to Celsius temperature scale:',
                  options: ['27 °C', '30 °C', '573 °C', '25 °C'],
                  correctIndex: 0,
                  explanation: '°C = K - 273 = 300 - 273 = 27 °C.'
                },
                {
                  id: 'q9s2',
                  question: 'Why do we feel cooler when acetone or perfume is applied on our palm?',
                  options: ['It absorbs heat from palm and evaporates', 'It is chemically cold', 'It reacts with skin', 'It condenses'],
                  correctIndex: 0,
                  explanation: 'Particles of acetone gain latent heat of vaporization from the palm, causing the surface to cool.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c9-sst',
      name: 'Social Science',
      code: 'SST-9',
      category: 'core',
      stream: 'General',
      icon: 'Globe',
      colorScheme: {
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        iconBg: 'bg-sky-600 text-white',
        iconColor: 'text-sky-700',
        textColor: 'text-sky-950',
      },
      topics: [
        {
          id: 'c9-sst-ch1',
          chapterNumber: 1,
          title: 'The French Revolution',
          summary: 'French society during 18th century, outbreak of revolution, constitutional monarchy, Reign of Terror, abolition of slavery.',
          keyConcepts: ['Storming of the Bastille 1789', 'Three Estates Hierarchy', 'Declaration of Rights of Man', 'Robespierre Jacobin Rule'],
          tests: [
            {
              id: 't-c9-sst1',
              title: 'Test 1: French Revolution Key Events',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q9sst1',
                  question: 'On 14th July 1789, the people of Paris stormed which fortress-prison?',
                  options: ['Bastille', 'Versailles', 'Tuileries', 'Louvre'],
                  correctIndex: 0,
                  explanation: 'The fortress-prison Bastille symbolized the despotic power of the French monarch and was stormed on July 14, 1789.'
                },
                {
                  id: 'q9sst2',
                  question: 'The patriotic song "Marseillaise" sung by French volunteers was composed by:',
                  options: ['Roget de L\'Isle', 'Rousseau', 'Voltaire', 'Montesquieu'],
                  correctIndex: 0,
                  explanation: 'The poet Roget de L\'Isle composed "Marseillaise", which became the national anthem of France.'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '11': [
    {
      id: 'c11-phy',
      name: 'Physics',
      code: 'PHY-11',
      category: 'science',
      stream: 'Science',
      icon: 'Atom',
      colorScheme: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        iconBg: 'bg-teal-600 text-white',
        iconColor: 'text-teal-700',
        textColor: 'text-teal-950',
      },
      topics: [
        {
          id: 'c11-p-ch1',
          chapterNumber: 1,
          title: 'Units and Measurements',
          summary: 'SI units, dimensional analysis and applications, checking dimensional consistency, errors in measurement.',
          keyConcepts: ['Principle of Homogeneity', 'Dimensions of Universal Constants (G, h)', 'Significant Figures', 'Propagation of Errors'],
          tests: [
            {
              id: 't-c11-p1',
              title: 'Test 1: Dimensional Analysis & Errors',
              type: 'diagnostic',
              badge: 'Diagnostic',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'q11p1',
                  question: 'The dimensional formula for Universal Gravitational Constant (G) is:',
                  options: ['[M⁻¹ L³ T⁻²]', '[M¹ L² T⁻²]', '[M⁻¹ L² T⁻¹]', '[M⁰ L³ T⁻²]'],
                  correctIndex: 0,
                  explanation: 'F = G m1 m2 / r² => G = F r² / m² = [M L T⁻²][L²] / [M²] = [M⁻¹ L³ T⁻²].'
                },
                {
                  id: 'q11p2',
                  question: 'Percentage error in measurement of mass and speed are 2% and 3% respectively. Maximum error in kinetic energy is:',
                  options: ['8%', '5%', '11%', '12%'],
                  correctIndex: 0,
                  explanation: 'KE = ½ m v². ΔKE/KE = Δm/m + 2(Δv/v) = 2% + 2(3%) = 8%.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c11-chem',
      name: 'Chemistry',
      code: 'CHEM-11',
      category: 'science',
      stream: 'Science',
      icon: 'FlaskConical',
      colorScheme: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        iconColor: 'text-emerald-700',
        textColor: 'text-emerald-950',
      },
      topics: [
        {
          id: 'c11-c-ch1',
          chapterNumber: 1,
          title: 'Some Basic Concepts of Chemistry',
          summary: 'Mole concept, molar mass, percentage composition, empirical and molecular formula, stoichiometry calculations.',
          keyConcepts: ['Avogadro Number 6.022 × 10²³', 'Limiting Reagent Stoichiometry', 'Empirical vs Molecular Formula', 'Molarity & Molality'],
          tests: [
            {
              id: 't-c11-c1',
              title: 'Test 1: Stoichiometry & Mole Concept',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'q11c1',
                  question: 'The number of atoms present in 16 grams of oxygen gas (O₂) is:',
                  options: ['6.022 × 10²³', '3.011 × 10²³', '1.204 × 10²⁴', '18 × 10²³'],
                  correctIndex: 0,
                  explanation: 'Molar mass of O₂ = 32 g/mol. 16 g is 0.5 moles of O₂ molecules. Each molecule has 2 atoms, so total atoms = 0.5 × 2 × N_A = N_A = 6.022 × 10²³.'
                },
                {
                  id: 'q11c2',
                  question: 'What is the volume occupied by 44 g of CO₂ gas at STP?',
                  options: ['22.4 Litres', '11.2 Litres', '44.8 Litres', '2.24 Litres'],
                  correctIndex: 0,
                  explanation: '44 g of CO₂ is 1 mole. 1 mole of any ideal gas occupies 22.4 L at STP.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c11-maths',
      name: 'Mathematics',
      code: 'MATH-11',
      category: 'science',
      stream: 'Science',
      icon: 'Calculator',
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-600 text-white',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-950',
      },
      topics: [
        {
          id: 'c11-m-ch1',
          chapterNumber: 1,
          title: 'Sets',
          summary: 'Sets and their representations, empty set, finite and infinite sets, subsets, power set, universal set, Venn diagrams.',
          keyConcepts: ['Union and Intersection', 'De Morgan Laws', 'Power Set cardinality 2ⁿ', 'Difference of Sets'],
          tests: [
            {
              id: 't-c11-m1',
              title: 'Test 1: Set Operations & Power Sets',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 15,
              marks: 10,
              difficulty: 'Medium',
              questions: [
                {
                  id: 'q11m1',
                  question: 'If a set A has 4 elements, how many elements does its power set P(A) contain?',
                  options: ['16', '8', '4', '32'],
                  correctIndex: 0,
                  explanation: 'Cardinality of power set is 2ⁿ = 2⁴ = 16.'
                },
                {
                  id: 'q11m2',
                  question: 'According to De Morgan Law, (A ∪ B)\' is equal to:',
                  options: ['A\' ∩ B\'', 'A\' ∪ B\'', 'A ∩ B', 'A\' - B\''],
                  correctIndex: 0,
                  explanation: 'The complement of the union is the intersection of their complements: (A ∪ B)\' = A\' ∩ B\'.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'c11-acc',
      name: 'Accountancy',
      code: 'ACC-11',
      category: 'commerce',
      stream: 'Commerce',
      icon: 'Receipt',
      colorScheme: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-600 text-white',
        iconColor: 'text-indigo-700',
        textColor: 'text-indigo-950',
      },
      topics: [
        {
          id: 'c11-acc-ch1',
          chapterNumber: 1,
          title: 'Introduction to Accounting',
          summary: 'Meaning, objectives, accounting information users, basic terms (assets, liabilities, capital, revenue, expenses).',
          keyConcepts: ['Double Entry Bookkeeping', 'Debit and Credit Rules', 'Accounting Equation A = L + C', 'Accrual Concept'],
          tests: [
            {
              id: 't-c11-a1',
              title: 'Test 1: Accounting Principles & Terms',
              type: 'concept',
              badge: 'Chapter Test',
              questionsCount: 2,
              durationMinutes: 10,
              marks: 10,
              difficulty: 'Easy',
              questions: [
                {
                  id: 'q11a1',
                  question: 'The fundamental accounting equation is:',
                  options: ['Assets = Liabilities + Capital', 'Assets = Liabilities - Capital', 'Capital = Assets + Liabilities', 'Liabilities = Assets + Capital'],
                  correctIndex: 0,
                  explanation: 'Assets = Equities (Liabilities + Owner Capital).'
                },
                {
                  id: 'q11a2',
                  question: 'Which principle states that business is treated as distinct from its proprietor?',
                  options: ['Business Entity concept', 'Money Measurement concept', 'Going Concern concept', 'Consistency concept'],
                  correctIndex: 0,
                  explanation: 'The Business Entity assumption treats the enterprise as a separate legal and accounting entity distinct from owners.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
