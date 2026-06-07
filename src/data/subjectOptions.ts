/**
 * Centralised subject → topic → sub-topic mapping.
 * Used by CreateTest, Questions editor, and any other feature
 * that needs to render subject-aware dropdowns.
 */
export const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'] as const;

export type SubjectKey = 'physics' | 'chemistry' | 'mathematics' | 'biology' | 'english';

export const TOPIC_MAP: Record<SubjectKey, string[]> = {
  physics:     ['Kinematics', 'Thermodynamics', 'Electrostatics', 'Optics', 'Modern Physics'],
  chemistry:   ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Electrochemistry'],
  mathematics: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry'],
  biology:     ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Evolution'],
  english:     ['Grammar', 'Writing', 'Literature', 'Vocabulary'],
};

export const SUB_TOPIC_MAP: Record<SubjectKey, string[]> = {
  physics:     ['Laws of Motion', 'Projectiles', 'Heat Transfer', 'Circuits', 'Wave Optics'],
  chemistry:   ['Alcohols & Ethers', 'Periodic Table', 'Mole Concept', 'Chemical Bonding', 'Redox Reactions'],
  mathematics: ['Matrices', 'Integration', 'Differentiation', 'Permutations', 'Probability'],
  biology:     ['Mitosis', 'DNA Replication', 'Food Chains', 'Blood Circulation', 'Natural Selection'],
  english:     ['Application', 'Sentence structure', 'Punctuation', 'Reading Comprehension'],
};

/** Returns the topic list for a given subject string (case-insensitive). */
export const getTopicsForSubject = (subject: string): string[] => {
  const key = subject.toLowerCase() as SubjectKey;
  return TOPIC_MAP[key] ?? TOPIC_MAP.english;
};

/** Returns the sub-topic list for a given subject string (case-insensitive). */
export const getSubTopicsForSubject = (subject: string): string[] => {
  const key = subject.toLowerCase() as SubjectKey;
  return SUB_TOPIC_MAP[key] ?? SUB_TOPIC_MAP.english;
};
