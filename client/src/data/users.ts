export interface User {
  id: string
  username: string
  email: string
  password: string
  bio: string
  points: number
  solvedCount: number
  createdCount: number
  joinedAt: string
}

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    username: 'diana_algo',
    email: 'diana@example.com',
    password: 'password123',
    bio: 'Algorithm enthusiast. I eat Big-O notation for breakfast.',
    points: 1420,
    solvedCount: 24,
    createdCount: 5,
    joinedAt: '2024-01-15',
  },
  {
    id: 'u2',
    username: 'alice_dev',
    email: 'alice@example.com',
    password: 'password123',
    bio: 'Python specialist. Turning coffee into code since 2015.',
    points: 1250,
    solvedCount: 21,
    createdCount: 3,
    joinedAt: '2024-02-03',
  },
  {
    id: 'u3',
    username: 'bob_rust',
    email: 'bob@example.com',
    password: 'password123',
    bio: 'Systems programmer. Memory safety is not optional.',
    points: 980,
    solvedCount: 16,
    createdCount: 4,
    joinedAt: '2024-02-18',
  },
  {
    id: 'u4',
    username: 'charlie_js',
    email: 'charlie@example.com',
    password: 'password123',
    bio: 'Frontend dev who occasionally touches the backend and regrets it.',
    points: 850,
    solvedCount: 13,
    createdCount: 2,
    joinedAt: '2024-03-01',
  },
  {
    id: 'u5',
    username: 'evan_debug',
    email: 'evan@example.com',
    password: 'password123',
    bio: 'Full-stack dev. printf debugging is a valid strategy.',
    points: 720,
    solvedCount: 11,
    createdCount: 6,
    joinedAt: '2024-03-20',
  },
]
