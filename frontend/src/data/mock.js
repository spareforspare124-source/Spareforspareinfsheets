// Mock data for InfinitySheets clone (frontend-only)

export const EXAM_TRACKS = [
  { id: 'SSLC', name: 'SSLC', title: 'State syllabus mastery', desc: 'Mathematics, science, social science, and English practice for secondary-level exams.' },
  { id: 'CBSE', name: 'CBSE', title: 'NCERT-aligned revision', desc: 'Topic practice across mathematics, sciences, and English for CBSE assessments.' },
  { id: 'ICSE', name: 'ICSE', title: 'Detailed subject practice', desc: 'Broad, rigorous preparation including science, English, and computer applications.' },
  { id: 'IGCSE', name: 'IGCSE', title: 'International exam technique', desc: 'Cambridge-style subject practice with structured and application-focused questions.' },
  { id: 'ASA', name: 'AS & A Level', title: 'Advanced subject depth', desc: 'Focused preparation for Cambridge advanced-level mathematics, sciences, and economics.' },
  { id: 'IB', name: 'IB', title: 'Concept and analysis practice', desc: 'Practice for IB mathematics, sciences, economics, and English coursework.' },
  { id: 'SAT', name: 'SAT', title: 'Timed reasoning practice', desc: 'Reading, writing, and math sets with pacing-focused feedback.' },
  { id: 'JEE', name: 'JEE', title: 'Concept-heavy problem solving', desc: 'Physics, chemistry, and maths sheets built around difficult multi-step questions.' },
  { id: 'NEET', name: 'NEET', title: 'High-volume recall and accuracy', desc: 'Biology-heavy revision plus chemistry and physics practice.' },
];

export const FEATURES = [
  { title: 'Progress tracking', desc: 'Readiness score, streak, questions answered, completed worksheets, and subject trends update automatically.', icon: 'LineChart' },
  { title: 'Targeted worksheets', desc: 'Choose exam, subject, topic, difficulty, and length. The app builds a worksheet instantly.', icon: 'Sigma' },
  { title: 'Weakness analysis', desc: 'Wrong answers are mapped to topics, so strengths and weaknesses are based on actual attempts.', icon: 'Sparkles' },
  { title: 'Smart recommendations', desc: 'The dashboard recommends the next topic and difficulty using your saved worksheet history.', icon: 'Calendar' },
];

export const HOW_IT_WORKS = [
  { n: '01', text: 'Create an account and choose your exam track' },
  { n: '02', text: 'Generate fresh questions by topic and difficulty' },
  { n: '03', text: 'Submit answers and get an immediate score' },
  { n: '04', text: 'Use saved results to track progress and weak areas' },
];

export const PAIN_POINTS = [
  { quote: 'I know the chapter, but I never know what type of question will show up.', label: 'Question-style uncertainty' },
  { quote: 'Practice papers help more than rereading, but finding the right ones wastes time.', label: 'Material discovery problem' },
  { quote: 'I would use it if it showed exactly what I was weak at and what to do next.', label: 'Need for clear next steps' },
];

export const PRICING = [
  { tag: 'Free', desc: 'Local account, worksheets, progress, history' },
  { tag: 'Premium later', desc: 'Cloud sync, higher limits, deeper weak-spot reports' },
  { tag: 'Schools later', desc: 'Class dashboards and shared syllabus packs' },
];

// Subjects per exam track
export const SUBJECTS = {
  SSLC: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English'],
  CBSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English'],
  ICSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Applications', 'English'],
  IGCSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'English'],
  ASA: ['Mathematics', 'Further Maths', 'Physics', 'Chemistry', 'Economics', 'Biology'],
  IB: ['Mathematics AA', 'Mathematics AI', 'Physics', 'Chemistry', 'Economics', 'English'],
  SAT: ['Math', 'Reading', 'Writing'],
  JEE: ['Physics', 'Chemistry', 'Mathematics'],
  NEET: ['Biology', 'Chemistry', 'Physics'],
};

export const TOPICS = {
  Mathematics: ['Algebra', 'Trigonometry', 'Geometry', 'Calculus', 'Probability', 'Statistics'],
  'Mathematics AA': ['Functions', 'Sequences', 'Calculus', 'Probability'],
  'Mathematics AI': ['Statistics', 'Modelling', 'Geometry'],
  'Further Maths': ['Complex Numbers', 'Matrices', 'Differential Equations'],
  Math: ['Heart of Algebra', 'Problem Solving', 'Advanced Math', 'Geometry'],
  Physics: ['Mechanics', 'Electrostatics', 'Optics', 'Thermodynamics', 'Modern Physics', 'Waves'],
  Chemistry: ['Organic', 'Inorganic', 'Physical', 'Coordination Compounds', 'Equilibrium'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology'],
  'Social Science': ['History', 'Geography', 'Civics', 'Economics'],
  English: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Writing'],
  'Computer Applications': ['Java Basics', 'OOP', 'Arrays', 'Strings'],
  Economics: ['Microeconomics', 'Macroeconomics', 'International Trade'],
  Reading: ['Passages', 'Vocabulary in Context'],
  Writing: ['Grammar', 'Rhetoric'],
};

// Question bank for worksheet generation
export const QUESTION_BANK = {
  Mechanics: [
    { q: 'A body moves with a uniform velocity of 10 m/s. What is its acceleration?', options: ['10 m/s\u00b2', '0 m/s\u00b2', '5 m/s\u00b2', '\u22125 m/s\u00b2'], a: 1 },
    { q: 'The SI unit of force is:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], a: 2 },
    { q: 'A ball is dropped from a height of 20 m. Time to reach ground (g = 10 m/s\u00b2)?', options: ['1 s', '2 s', '3 s', '4 s'], a: 1 },
    { q: 'Momentum is the product of:', options: ['Mass and velocity', 'Mass and acceleration', 'Force and time', 'Force and distance'], a: 0 },
  ],
  Electrostatics: [
    { q: 'Coulomb’s law states force is inversely proportional to:', options: ['Distance', 'Distance squared', 'Charge', 'Charge squared'], a: 1 },
    { q: 'The SI unit of electric charge is:', options: ['Volt', 'Coulomb', 'Ampere', 'Ohm'], a: 1 },
    { q: 'Like charges:', options: ['Attract', 'Repel', 'Neither', 'Both'], a: 1 },
    { q: 'Electric field at the center of a uniformly charged ring is:', options: ['Maximum', 'Zero', 'Infinite', 'Half'], a: 1 },
  ],
  Optics: [
    { q: 'A convex lens has a focal length of:', options: ['Negative', 'Positive', 'Zero', 'Infinity'], a: 1 },
    { q: 'Speed of light in vacuum is approximately:', options: ['3\u00d710\u2078 m/s', '3\u00d710\u2076 m/s', '3\u00d710\u00b9\u2070 m/s', '3\u00d710\u2074 m/s'], a: 0 },
  ],
  Thermodynamics: [
    { q: 'First law of thermodynamics is based on conservation of:', options: ['Charge', 'Energy', 'Mass', 'Momentum'], a: 1 },
  ],
  'Modern Physics': [
    { q: 'Photoelectric effect was explained by:', options: ['Newton', 'Einstein', 'Bohr', 'Planck'], a: 1 },
  ],
  Waves: [
    { q: 'Sound waves are:', options: ['Transverse', 'Longitudinal', 'Both', 'None'], a: 1 },
  ],
  Algebra: [
    { q: 'Solve: 2x + 6 = 14', options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'], a: 1 },
    { q: 'Roots of x\u00b2 \u2212 5x + 6 = 0', options: ['1, 6', '2, 3', '\u22122, \u22123', '\u22121, \u22126'], a: 1 },
  ],
  Trigonometry: [
    { q: 'sin\u00b2\u03b8 + cos\u00b2\u03b8 equals:', options: ['0', '1', '2', '\u03b8'], a: 1 },
    { q: 'tan(45\u00b0) equals:', options: ['0', '1', '\u221a3', '1/\u221a3'], a: 1 },
  ],
  Geometry: [
    { q: 'Sum of interior angles of a triangle:', options: ['90\u00b0', '180\u00b0', '270\u00b0', '360\u00b0'], a: 1 },
  ],
  Calculus: [
    { q: 'd/dx(x\u00b2) equals:', options: ['x', '2x', 'x\u00b2', '2'], a: 1 },
  ],
  Probability: [
    { q: 'Probability of an impossible event is:', options: ['0', '1', '0.5', 'Undefined'], a: 0 },
  ],
  Statistics: [
    { q: 'Median of 2, 3, 5, 7, 9 is:', options: ['3', '5', '7', '9'], a: 1 },
  ],
  Organic: [
    { q: 'Methane has how many hydrogen atoms?', options: ['2', '3', '4', '5'], a: 2 },
    { q: 'Functional group of alcohol is:', options: ['\u2013COOH', '\u2013OH', '\u2013CHO', '\u2013NH\u2082'], a: 1 },
  ],
  Inorganic: [
    { q: 'Atomic number of carbon:', options: ['4', '6', '8', '12'], a: 1 },
  ],
  Physical: [
    { q: 'pH of pure water at 25\u00b0C:', options: ['5', '6', '7', '8'], a: 2 },
  ],
  'Coordination Compounds': [
    { q: 'Central atom in [Cu(NH\u2083)\u2084]\u00b2\u207a is:', options: ['N', 'Cu', 'H', 'Cl'], a: 1 },
  ],
  Equilibrium: [
    { q: 'Le Chatelier’s principle applies to:', options: ['Reaction rate', 'Equilibrium shift', 'Catalysis', 'Solubility only'], a: 1 },
  ],
  'Cell Biology': [
    { q: 'Powerhouse of the cell:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], a: 1 },
  ],
  Genetics: [
    { q: 'Father of genetics:', options: ['Darwin', 'Mendel', 'Watson', 'Crick'], a: 1 },
  ],
  Ecology: [
    { q: 'Producers in an ecosystem are mainly:', options: ['Animals', 'Plants', 'Fungi', 'Bacteria'], a: 1 },
  ],
  'Human Physiology': [
    { q: 'Normal human body temperature in \u00b0C:', options: ['35', '36.5', '37', '38'], a: 2 },
  ],
  'Plant Physiology': [
    { q: 'Photosynthesis occurs in:', options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Vacuole'], a: 1 },
  ],
  History: [
    { q: 'Year of Indian independence:', options: ['1942', '1945', '1947', '1950'], a: 2 },
  ],
  Geography: [
    { q: 'Largest continent by area:', options: ['Africa', 'Asia', 'Europe', 'Australia'], a: 1 },
  ],
  Civics: [
    { q: 'India is a:', options: ['Monarchy', 'Republic', 'Theocracy', 'Dictatorship'], a: 1 },
  ],
  Economics: [
    { q: 'GDP stands for:', options: ['Gross Domestic Product', 'General Domestic Price', 'Gross Distribution Plan', 'Global Domestic Price'], a: 0 },
  ],
  'Reading Comprehension': [
    { q: 'The main idea of a passage is best described as:', options: ['A minor detail', 'The central message', 'A direct quote', 'A summary of words'], a: 1 },
  ],
  Grammar: [
    { q: 'Identify the verb: "She runs fast."', options: ['She', 'runs', 'fast', 'none'], a: 1 },
  ],
  Vocabulary: [
    { q: 'Synonym of "happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], a: 1 },
  ],
};

// Default fallback questions for any topic missing
export const FALLBACK_QUESTIONS = [
  { q: 'This worksheet uses sample questions. Pick the correct option:', options: ['Option A', 'Option B (correct)', 'Option C', 'Option D'], a: 1 },
  { q: 'Which of these is true about practice?', options: ['It is unhelpful', 'It builds mastery', 'It is random', 'None'], a: 1 },
  { q: 'A worksheet helps you to:', options: ['Avoid study', 'Test understanding', 'Sleep', 'Browse social'], a: 1 },
  { q: 'Best way to review mistakes:', options: ['Ignore them', 'Analyze and retry', 'Delete them', 'Forget'], a: 1 },
  { q: 'Spaced repetition improves:', options: ['Speed only', 'Long-term recall', 'Sleep', 'Nothing'], a: 1 },
];

export const STATS_LANDING = [
  { num: '9', label: 'exam and syllabus pathways' },
  { num: '48', label: 'subjects across all courses' },
  { num: '400+', label: 'focused syllabus topics' },
];
