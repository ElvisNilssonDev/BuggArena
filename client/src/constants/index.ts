export const ROUTES = {
  HOME: '/',
  CHALLENGES: '/challenges',
  CHALLENGE_DETAIL: '/challenges/:id',
  CREATE_CHALLENGE: '/challenges/new',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile/:username',
  LOGIN: '/login',
} as const

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Rust',
  'Go',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Swift',
] as const
export type Language = (typeof LANGUAGES)[number]

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export const POINTS_PER_SOLVE = 50
export const POINTS_PER_VOTE_RECEIVED = 10
export const POINTS_PER_CHALLENGE_CREATED = 25
