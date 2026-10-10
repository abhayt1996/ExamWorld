import { ClassData, Subject, ChapterTopic, UserProfile } from '../types';
import { ALL_12_TENSES } from './tensesData';

// Standard NCERT English Grammar chapter modules strictly as specified in prompt
const NCERT_ENGLISH_GRAMMAR_TOPICS: ChapterTopic[] = [
  {
    id: 'eg-ch1',
    chapterNumber: 1,
    title: 'Parts of Speech & Word Classes',
    summary: 'Identification and contextual functions of Nouns, Pronouns, Adjectives, Verbs, Adverbs, Prepositions, Conjunctions, and Interjections.',
    keyConcepts: ['Noun Types & Abstract Nouns', 'Transitive vs Intransitive Verbs', 'Prepositional Phrases', 'Coordinating vs Subordinating Conjunctions'],
    tests: [
      {
        id: 't-eg-pos-1',
        title: 'Diagnostic Test: Identifying Parts of Speech',
        type: 'diagnostic',
        badge: 'Diagnostic',
        questionsCount: 4,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Easy',
        questions: [
          {
            id: 'q-pos-1',
            question: 'Identify the part of speech of the capitalized word: "She spoke very SOFTLY during the assembly."',
            options: ['Adjective', 'Adverb', 'Verb', 'Preposition'],
            correctIndex: 1,
            explanation: '"Softly" modifies the verb "spoke", describing how the action was performed. Therefore, it is an adverb of manner.'
          },
          {
            id: 'q-pos-2',
            question: 'Which of the following sentences contains an abstract noun?',
            options: ['The wooden chair was broken.', 'Honesty is the greatest virtue in life.', 'He drank a glass of cold water.', 'Birds build nests in tall trees.'],
            correctIndex: 1,
            explanation: '"Honesty" and "virtue" refer to intangible concepts, qualities, and states that cannot be physically touched, making them abstract nouns.'
          },
          {
            id: 'q-pos-3',
            question: 'In "The train arrived ON time", what part of speech is "ON"?',
            options: ['Conjunction', 'Preposition', 'Adverb', 'Interjection'],
            correctIndex: 1,
            explanation: '"On" shows the temporal relationship between the arrival of the train and the scheduled time; it functions as a preposition.'
          },
          {
            id: 'q-pos-4',
            question: 'Identify the coordinating conjunction in: "He studied hard, YET he was nervous before the exam."',
            options: ['hard', 'before', 'yet', 'nervous'],
            correctIndex: 2,
            explanation: '"Yet" connects two independent clauses showing contrast, functioning as a coordinating conjunction (FANBOYS).'
          }
        ]
      },
      {
        id: 't-eg-pos-2',
        title: 'Mastery Test: Advanced Syntactic Functions',
        type: 'concept',
        badge: 'Concept Test',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Medium',
        questions: [
          {
            id: 'q-pos-m1',
            question: 'In "He ran FAST", "fast" is an adverb. In "He is a FAST runner", "fast" is a/an:',
            options: ['Adverb', 'Adjective', 'Noun', 'Pronoun'],
            correctIndex: 1,
            explanation: 'In the second sentence, "fast" directly modifies the noun "runner", so it functions as an adjective.'
          },
          {
            id: 'q-pos-m2',
            question: 'Which underlined word is a reflexive pronoun?',
            options: ['She taught HERSELF Spanish.', 'This is HER book.', 'SHE went to the library.', 'Give it to HER.'],
            correctIndex: 0,
            explanation: '"Herself" reflects the action back onto the subject "she", functioning as a reflexive pronoun.'
          },
          {
            id: 'q-pos-m3',
            question: 'Which of the following contains a collective noun?',
            options: ['A pride of lions rested beneath the tree.', 'Many brave soldiers were honored.', 'The blue ocean looked calm.', 'She read two new novels.'],
            correctIndex: 0,
            explanation: '"Pride" refers to a group or collection of lions taken together as a single unit.'
          }
        ]
      }
    ]
  },
  {
    id: 'eg-ch2',
    chapterNumber: 2,
    title: 'Tenses & Aspect Systems',
    summary: 'Present, Past, and Future tenses across Simple, Continuous, Perfect, and Perfect Continuous forms with time adverbials.',
    keyConcepts: ['Present Perfect vs Simple Past', 'Past Perfect in Sequential Narrative', 'Future with Will / Going To', 'Stative Verbs Constraints'],
    tests: [
      {
        id: 't-eg-tns-1',
        title: 'Diagnostic Test: Tenses & Time Expressions',
        type: 'diagnostic',
        badge: 'Diagnostic',
        questionsCount: 4,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Medium',
        questions: [
          {
            id: 'q-tns-1',
            question: 'Fill in the blank: "By next December, we _______ in this city for ten years."',
            options: ['will live', 'will have been living', 'are living', 'had been living'],
            correctIndex: 1,
            explanation: 'The sentence refers to an action continuing up to a specific point in the future ("by next December"), requiring the Future Perfect Continuous tense.'
          },
          {
            id: 'q-tns-2',
            question: '"The train _______ before we reached the railway station."',
            options: ['had left', 'left', 'has left', 'was leaving'],
            correctIndex: 0,
            explanation: 'When two past actions occur sequentially, the earlier action is expressed in the Past Perfect tense ("had left") and the later in Simple Past ("reached").'
          },
          {
            id: 'q-tns-3',
            question: 'Choose the correct form: "She _______ her homework just now."',
            options: ['completed', 'has completed', 'had completed', 'completes'],
            correctIndex: 1,
            explanation: 'The adverbial "just now" or "just" connected with present relevance requires the Present Perfect tense ("has completed").'
          },
          {
            id: 'q-tns-4',
            question: 'Identify the tense: "The scientist has been conducting this research since 2021."',
            options: ['Present Perfect Continuous', 'Past Continuous', 'Future Continuous', 'Present Continuous'],
            correctIndex: 0,
            explanation: '"Has been conducting" features has + been + verb-ing with "since", denoting Present Perfect Continuous tense.'
          }
        ]
      }
    ],
    subTopics: ALL_12_TENSES,
  },
  {
    id: 'eg-ch3',
    chapterNumber: 3,
    title: 'Active & Passive Voice',
    summary: 'Transformation rules across various tenses, imperative passive forms, modal auxiliaries in passive, and agent omission rules.',
    keyConcepts: ['Object to Subject Inversion', 'Auxiliary Be + Past Participle V3', 'Passive of Imperatives (Let + be + V3)', 'Omission of Vague Agents (Someone, People)'],
    tests: [
      {
        id: 't-eg-vox-1',
        title: 'Test 1: Voice Transformations & Modals',
        type: 'concept',
        badge: 'Voice Mastery',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Medium',
        questions: [
          {
            id: 'q-vox-1',
            question: 'Convert into Passive Voice: "The municipal workers are repairing the road."',
            options: [
              'The road was being repaired by the municipal workers.',
              'The road is being repaired by the municipal workers.',
              'The road has been repaired by the municipal workers.',
              'The road is repaired by the municipal workers.'
            ],
            correctIndex: 1,
            explanation: 'Present continuous active (are repairing) transforms into "is/are being + past participle" (is being repaired).'
          },
          {
            id: 'q-vox-2',
            question: 'Convert imperative to passive: "Close the windows immediately."',
            options: [
              'Let the windows be closed immediately.',
              'The windows should close immediately.',
              'You must close windows.',
              'The windows were closed immediately.'
            ],
            correctIndex: 0,
            explanation: 'Imperative sentences follow the pattern: "Let + object + be + past participle (V3)".'
          },
          {
            id: 'q-vox-3',
            question: 'Passive form of: "Someone stole my grandfather\'s antique watch."',
            options: [
              'My grandfather\'s antique watch was stolen.',
              'My grandfather\'s antique watch has been stolen by someone.',
              'Someone had stolen my grandfather\'s antique watch.',
              'My grandfather\'s watch is stolen by someone.'
            ],
            correctIndex: 0,
            explanation: 'In past simple ("stole"), passive is "was/were + V3". Indefinite pronouns like "someone" are naturally omitted in standard formal passive.'
          }
        ]
      }
    ]
  },
  {
    id: 'eg-ch4',
    chapterNumber: 4,
    title: 'Direct & Indirect Speech (Reported Speech)',
    summary: 'Reporting statements, interrogatives, imperatives, exclamations; backshifting of tenses and pronoun/time-expression shifts.',
    keyConcepts: ['Said to → Told', 'Tense Backshift Rules', 'Questions with If/Whether or Wh-word', 'Time Adverbial Shifts (Now → Then, Tomorrow → Next Day)'],
    tests: [
      {
        id: 't-eg-rep-1',
        title: 'Test 1: Reported Speech Rules & Shifts',
        type: 'concept',
        badge: 'Reporting Mastery',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Medium',
        questions: [
          {
            id: 'q-rep-1',
            question: 'Convert to indirect speech: The teacher said, "The earth revolves around the sun."',
            options: [
              'The teacher said that the earth revolved around the sun.',
              'The teacher said that the earth revolves around the sun.',
              'The teacher said whether the earth was revolving around the sun.',
              'The teacher told that the earth had revolved around the sun.'
            ],
            correctIndex: 1,
            explanation: 'Universal scientific truths and general facts do not change their tense even when the reporting verb is in the past tense.'
          },
          {
            id: 'q-rep-2',
            question: 'Convert to indirect: Rohan asked Priya, "Where are you going for summer vacations?"',
            options: [
              'Rohan asked Priya where she was going for summer vacations.',
              'Rohan asked Priya where was she going for summer vacations.',
              'Rohan asked Priya if she is going for summer vacations.',
              'Rohan asked Priya that where she went for vacations.'
            ],
            correctIndex: 0,
            explanation: 'In indirect interrogatives with Wh-words, retain the Wh-word and change inverted question order to affirmative word order (subject + verb: "where she was going").'
          },
          {
            id: 'q-rep-3',
            question: 'Convert: Father said to me, "Do not waste your time on social media."',
            options: [
              'Father advised me not to waste my time on social media.',
              'Father asked me that I should not waste time.',
              'Father said to me do not waste your time.',
              'Father ordered me that not wasting my time.'
            ],
            correctIndex: 0,
            explanation: 'Negative imperatives use "advised / forbade + infinitive (not to + V1)" with appropriate pronoun changes.'
          }
        ]
      }
    ]
  },
  {
    id: 'eg-ch5',
    chapterNumber: 5,
    title: 'Modals & Auxiliary Verbs',
    summary: 'Expressing ability, permission, obligation, necessity, possibility, deduction, and polite requests using modal auxiliaries.',
    keyConcepts: ['Can / Could (Ability & Politeness)', 'May / Might (Possibility & Permission)', 'Must / Ought to (Obligation & Moral Duty)', 'Shall / Should (Recommendation & Advice)'],
    tests: [
      {
        id: 't-eg-mod-1',
        title: 'Test 1: Modal Usage in Context',
        type: 'diagnostic',
        badge: 'Modals Test',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Easy',
        questions: [
          {
            id: 'q-mod-1',
            question: 'Select the best modal for moral duty: "We _______ respect our national symbols and elders."',
            options: ['can', 'ought to', 'might', 'could'],
            correctIndex: 1,
            explanation: '"Ought to" expresses moral obligation and ethical civic responsibility.'
          },
          {
            id: 'q-mod-2',
            question: 'The sky is heavily overcast with dark clouds. It _______ rain this afternoon.',
            options: ['may', 'should', 'would', 'shall'],
            correctIndex: 0,
            explanation: '"May" conveys a strong factual possibility based on visible present evidence.'
          },
          {
            id: 'q-mod-3',
            question: 'Which sentence correctly makes a formal, polite request?',
            options: [
              'Could you please forward the document to my email?',
              'You must forward the email.',
              'Forward the email right now.',
              'Can you forward it now?'
            ],
            correctIndex: 0,
            explanation: '"Could you please..." is the standard formal polite construction for solicitations.'
          }
        ]
      }
    ]
  },
  {
    id: 'eg-ch6',
    chapterNumber: 6,
    title: 'Determiners & Articles',
    summary: 'Usage of Articles (A, An, The), Demonstratives, Possessives, Quantifiers (Some, Any, Much, Many, Little, Few, Each, Every).',
    keyConcepts: ['Definite vs Indefinite Articles', 'Few vs A Few vs The Few', 'Little vs A Little vs The Little', 'Distributives: Each vs Every'],
    tests: [
      {
        id: 't-eg-det-1',
        title: 'Test 1: Quantifiers & Article Precision',
        type: 'concept',
        badge: 'Determiners',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Medium',
        questions: [
          {
            id: 'q-det-1',
            question: 'He is _______ European scholar who won an international award.',
            options: ['a', 'an', 'the', 'no article'],
            correctIndex: 0,
            explanation: 'Although "European" begins with the vowel letter "E", its initial phonetic sound is the consonant glide /j/ ("yu-ro-pean"), hence taking article "a".'
          },
          {
            id: 'q-det-2',
            question: 'There is _______ hope of his recovery as his medical parameters have stabilized.',
            options: ['little', 'a little', 'few', 'a few'],
            correctIndex: 1,
            explanation: '"A little" denotes a positive small amount (some hope) with uncountable nouns, whereas "little" alone conveys almost no hope (negative sense).'
          },
          {
            id: 'q-det-3',
            question: '_______ student in the classroom was presented with a certificate.',
            options: ['Each', 'All', 'Both', 'Many'],
            correctIndex: 0,
            explanation: '"Each" is used with a singular countable noun ("student") and singular verb ("was") to emphasize individuals in a definite group.'
          }
        ]
      }
    ]
  },
  {
    id: 'eg-ch7',
    chapterNumber: 7,
    title: 'Clauses & Sentence Synthesis',
    summary: 'Noun clauses, Adverbial clauses (Condition, Time, Reason, Contrast), and Relative/Adjective clauses in complex sentences.',
    keyConcepts: ['Independent vs Dependent Clauses', 'Relative Pronouns (Who, Whom, Whose, Which, That)', 'Conditional Clauses (Zero, First, Second, Third)', 'Adverbial Clauses of Concession (Although, Even though)'],
    tests: [
      {
        id: 't-eg-cls-1',
        title: 'Test 1: Clause Identification & Synthesis',
        type: 'hots',
        badge: 'HOTS Test',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Hard',
        questions: [
          {
            id: 'q-cls-1',
            question: 'In "I knew THAT HE WOULD WIN THE COMPETITION", the underlined clause is a/an:',
            options: ['Noun clause', 'Adjective clause', 'Adverb clause of condition', 'Prepositional clause'],
            correctIndex: 0,
            explanation: 'The clause functions as the direct object of the transitive verb "knew" (answers "knew what?"), making it a Noun Clause.'
          },
          {
            id: 'q-cls-2',
            question: 'Complete Third Conditional: "If you had informed me earlier, I _______ the tickets."',
            options: ['would book', 'would have booked', 'will book', 'had booked'],
            correctIndex: 1,
            explanation: 'Past hypothetical condition (past perfect: had informed) requires "would have + past participle" (would have booked).'
          },
          {
            id: 'q-cls-3',
            question: 'Combine into a single sentence using relative clause: "This is the laboratory. Sir C.V. Raman conducted his scattering experiments here."',
            options: [
              'This is the laboratory where Sir C.V. Raman conducted his scattering experiments.',
              'This is the laboratory and Sir C.V. Raman conducted experiments here.',
              'Because Sir C.V. Raman conducted experiments, this is the laboratory.',
              'This laboratory Sir C.V. Raman conducted scattering experiments.'
            ],
            correctIndex: 0,
            explanation: 'The relative adverb "where" synthesizes the place reference into an adjective relative clause modifying "laboratory".'
          }
        ]
      }
    ]
  },
  {
    id: 'eg-ch8',
    chapterNumber: 8,
    title: 'Subject-Verb Concord (Agreement)',
    summary: 'Rules of agreement in number and person between subjects and verbs, compound subjects, and collective nouns.',
    keyConcepts: ['Either...or / Neither...nor proximity rule', 'Along with / As well as parenthetical phrases', 'Indefinite pronouns (Everyone, Nobody)', 'Plural in form but singular in meaning (Mathematics, Physics, News)'],
    tests: [
      {
        id: 't-eg-svc-1',
        title: 'Test 1: Subject-Verb Agreement Invariants',
        type: 'concept',
        badge: 'Concord Test',
        questionsCount: 3,
        durationMinutes: 15,
        marks: 15,
        difficulty: 'Medium',
        questions: [
          {
            id: 'q-svc-1',
            question: 'The captain, along with his entire team, _______ arriving this evening.',
            options: ['is', 'are', 'were', 'have been'],
            correctIndex: 0,
            explanation: 'When subjects are joined by "along with" or "as well as", the verb agrees with the primary subject ("The captain", which is singular).'
          },
          {
            id: 'q-svc-2',
            question: 'Neither the manager nor the employees _______ available for the briefing.',
            options: ['was', 'were', 'is', 'has been'],
            correctIndex: 1,
            explanation: 'In "neither...nor" constructions, the verb agrees with the subject closest to it ("the employees", which is plural).'
          },
          {
            id: 'q-svc-3',
            question: 'Mathematics _______ always considered a foundational discipline.',
            options: ['has been', 'have been', 'are', 'were'],
            correctIndex: 0,
            explanation: 'Names of disciplines ending in -s (Mathematics, Physics, Economics) take singular verbs.'
          }
        ]
      }
    ]
  }
];

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

// Helper to create the distinct "English Grammar" subject object for every class
const createEnglishGrammarSubject = (classId: string): Subject => ({
  id: `c${classId}-eng-grammar`,
  name: 'English Grammar',
  code: `ENG-GRM-${classId}`,
  category: 'grammar',
  stream: 'General',
  icon: 'BookOpen',
  colorScheme: {
    bg: 'bg-[#EBF7F0]',
    border: 'border-[#B4E5CA]',
    iconBg: 'bg-[#10B981] text-white',
    iconColor: 'text-[#065F46]',
    textColor: 'text-[#064E3B]',
  },
  topics: NCERT_ENGLISH_GRAMMAR_TOPICS,
});

// Mock Initial User Profile for demonstration
export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_882041',
  name: 'Aarav Sharma',
  mobile: '9876543210',
  email: 'aarav.sharma@examworld.site',
  currentClass: '10',
  avatarColor: 'bg-gradient-to-br from-[#D46244] to-[#B3492F]',
  joinedDate: 'Jan 2026',
  testHistory: [
    {
      id: 'rec-1',
      testId: 't-eg-pos-1',
      testTitle: 'Diagnostic Test: Identifying Parts of Speech',
      subjectName: 'English Grammar',
      className: 'Class 10',
      chapterTitle: 'Parts of Speech & Word Classes',
      score: 15,
      totalMarks: 15,
      percentage: 100,
      date: 'Today, 10:30 AM',
      timeSpentMinutes: 8,
    },
    {
      id: 'rec-2',
      testId: 't-rn-1',
      testTitle: 'Test 1: Fundamental Concepts & Prime Factorization',
      subjectName: 'Mathematics',
      className: 'Class 10',
      chapterTitle: 'Real Numbers',
      score: 12,
      totalMarks: 15,
      percentage: 80,
      date: 'Yesterday, 4:15 PM',
      timeSpentMinutes: 12,
    },
    {
      id: 'rec-3',
      testId: 't-cr-1',
      testTitle: 'Test 1: Types of Reactions & Balancing',
      subjectName: 'Science',
      className: 'Class 10',
      chapterTitle: 'Chemical Reactions and Equations',
      score: 13,
      totalMarks: 15,
      percentage: 86.6,
      date: '2 days ago',
      timeSpentMinutes: 10,
    },
    {
      id: 'rec-4',
      testId: 't-eg-tns-1',
      testTitle: 'Diagnostic Test: Tenses & Time Expressions',
      subjectName: 'English Grammar',
      className: 'Class 10',
      chapterTitle: 'Tenses & Aspect Systems',
      score: 14,
      totalMarks: 15,
      percentage: 93.3,
      date: '3 days ago',
      timeSpentMinutes: 11,
    },
    {
      id: 'rec-5',
      testId: 't-ne-1',
      testTitle: 'Test 1: European Nationalism Milestones',
      subjectName: 'Social Science',
      className: 'Class 10',
      chapterTitle: 'The Rise of Nationalism in Europe',
      score: 10,
      totalMarks: 15,
      percentage: 66.7,
      date: '5 days ago',
      timeSpentMinutes: 14,
    },
  ],
};

// Subjects map ensuring EVERY single class includes English Grammar as a distinct subject
export const SUBJECTS_BY_CLASS: Record<string, Subject[]> = {
  '10': [
    createEnglishGrammarSubject('10'),
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
    }
  ],
  '6': [
    createEnglishGrammarSubject('6'),
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
    }
  ],
  '7': [
    createEnglishGrammarSubject('7'),
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
    }
  ],
  '8': [
    createEnglishGrammarSubject('8'),
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
    }
  ],
  '9': [
    createEnglishGrammarSubject('9'),
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
    }
  ],
  '11': [
    createEnglishGrammarSubject('11'),
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
  ],
  '12': [
    createEnglishGrammarSubject('12'),
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
    }
  ]
};
