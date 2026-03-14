import { Task, Resource, JobOpening } from './types';

export const TASKS: Task[] = [
  {
    id: 'logic-1',
    title: 'The Boolean Bridge',
    description: 'Understand basic true/false logic gates.',
    category: 'Logic',
    difficulty: 'Easy',
    xpReward: 50,
    type: 'multiple-choice',
    question: 'What is the result of (true && false) || true?',
    options: ['true', 'false', 'undefined', 'null'],
    correctAnswer: 'true',
    explanation: 'In boolean logic, (true && false) is false. Then, (false || true) is true.'
  },
  {
    id: 'syntax-1',
    title: 'Variable Voyage',
    description: 'Learn how to declare variables correctly.',
    category: 'Syntax',
    difficulty: 'Easy',
    xpReward: 50,
    type: 'multiple-choice',
    question: 'Which of these is a valid variable declaration in JavaScript?',
    options: ['var 1name = "AI";', 'let name = "AI";', 'const "name" = "AI";', 'variable name = "AI";'],
    correctAnswer: 'let name = "AI";',
    explanation: 'Variables cannot start with numbers and "let" is a standard keyword for declaration.'
  },
  {
    id: 'algo-1',
    title: 'Loop Labyrinth',
    description: 'Trace the output of a simple loop.',
    category: 'Algorithms',
    difficulty: 'Medium',
    xpReward: 100,
    type: 'multiple-choice',
    question: 'How many times will this loop run? for(let i=0; i<5; i++) { ... }',
    options: ['4', '5', '6', 'Infinite'],
    correctAnswer: '5',
    explanation: 'The loop starts at 0 and runs while i is less than 5 (0, 1, 2, 3, 4), which is 5 iterations.'
  },
  {
    id: 'debug-1',
    title: 'Semicolon Search',
    description: 'Identify the bug in the code snippet.',
    category: 'Debugging',
    difficulty: 'Easy',
    xpReward: 75,
    type: 'multiple-choice',
    question: 'What is wrong with this code? function greet() { return "Hello" }',
    options: ['Missing semicolon', 'Missing parameter', 'Nothing, it works', 'Incorrect keyword'],
    correctAnswer: 'Nothing, it works',
    explanation: 'While semicolons are good practice, JavaScript has automatic semicolon insertion, so this code is technically valid.'
  },
  {
    id: 'logic-2',
    title: 'Conditional Crossroads',
    description: 'Navigate through nested if-statements.',
    category: 'Logic',
    difficulty: 'Medium',
    xpReward: 100,
    type: 'multiple-choice',
    question: 'If x = 10 and y = 5, what does this return? if(x > 5) { if(y > 10) { return "A" } else { return "B" } }',
    options: ['A', 'B', 'undefined', 'Error'],
    correctAnswer: 'B',
    explanation: 'x is greater than 5, so we enter the first block. y is not greater than 10, so we hit the else block returning "B".'
  },
  {
    id: 'algo-hard-1',
    title: 'The Recursive Riddle',
    description: 'Solve a complex recursive logic problem.',
    category: 'Algorithms',
    difficulty: 'Hard',
    xpReward: 250,
    type: 'multiple-choice',
    question: 'What is the value of f(4) if f(n) = f(n-1) + f(n-2) with f(0)=0, f(1)=1?',
    options: ['2', '3', '5', '8'],
    correctAnswer: '3',
    explanation: 'f(0)=0, f(1)=1, f(2)=1, f(3)=2, f(4)=3. This is the Fibonacci sequence.'
  },
  {
    id: 'logic-hard-1',
    title: 'Quantum Logic Gate',
    description: 'Advanced boolean manipulation with multiple operators.',
    category: 'Logic',
    difficulty: 'Hard',
    xpReward: 300,
    type: 'multiple-choice',
    question: 'Which expression is equivalent to !(A && B)?',
    options: ['!A && !B', '!A || !B', 'A || B', '!A || B'],
    correctAnswer: '!A || !B',
    explanation: "This is De Morgan's Law: the negation of a conjunction is the disjunction of the negations."
  }
];

export const RESOURCES: Resource[] = [
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/',
    description: 'The definitive resource for web development and JavaScript.',
    category: 'Syntax'
  },
  {
    title: 'FreeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    description: 'Learn to code for free with interactive projects.',
    category: 'Algorithms'
  },
  {
    title: 'Exercism',
    url: 'https://exercism.org/',
    description: 'Code practice and mentorship for 67+ languages.',
    category: 'Debugging'
  },
  {
    title: 'Logic.ly',
    url: 'https://logic.ly/demo/',
    description: 'Interactive logic gate simulator.',
    category: 'Logic'
  }
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    company: 'TechFlow Systems',
    role: 'Junior Frontend Developer',
    description: 'Join our dynamic team building next-generation user interfaces. You will work closely with senior developers to implement responsive designs and optimize web performance.',
    location: 'Remote / San Francisco',
    salary: '$70k - $90k',
    type: 'Full-time',
    requiredSkills: ['Syntax', 'Logic'],
    matchScore: 85,
    postedDate: '2026-03-12',
    preparationSchedule: [
      { day: 1, task: 'Review JavaScript ES6+ Syntax', resourceLink: 'https://developer.mozilla.org/' },
      { day: 2, task: 'Practice Logic Puzzles on CodeQuest', resourceLink: '#' },
      { day: 3, task: 'Build a small React component' }
    ]
  },
  {
    id: 'job-2',
    company: 'DataScale AI',
    role: 'Algorithm Engineer Intern',
    description: 'Looking for a brilliant mind to help optimize our data processing pipelines. You will be working on large-scale datasets and implementing efficient algorithms for real-time analysis.',
    location: 'New York, NY',
    salary: '$35/hr',
    type: 'Internship',
    requiredSkills: ['Algorithms', 'Logic'],
    matchScore: 70,
    postedDate: '2026-03-13',
    preparationSchedule: [
      { day: 1, task: 'Study Big O Notation', resourceLink: 'https://www.freecodecamp.org/' },
      { day: 2, task: 'Solve 3 Medium Algorithm Tasks' },
      { day: 3, task: 'Mock Technical Interview' }
    ]
  },
  {
    id: 'job-3',
    company: 'SecureNet',
    role: 'QA & Debugging Specialist',
    description: 'Help us ensure the highest quality for our security products. You will be responsible for identifying edge cases, debugging complex issues, and writing automated tests.',
    location: 'Austin, TX',
    salary: '$80k - $100k',
    type: 'Full-time',
    requiredSkills: ['Debugging', 'Syntax'],
    matchScore: 90,
    postedDate: '2026-03-14',
    preparationSchedule: [
      { day: 1, task: 'Learn Chrome DevTools Debugging', resourceLink: 'https://developer.chrome.com/docs/devtools/' },
      { day: 2, task: 'Practice Debugging Scenarios' },
      { day: 3, task: 'Review Unit Testing Basics' }
    ]
  }
];
