import { INITIAL_USERS, type User } from '../data/users'
import { INITIAL_CHALLENGES, type Challenge, type Solution } from '../data/challenges'

const USERS_KEY = 'bugarena_users'
const CHALLENGES_KEY = 'bugarena_challenges'

// ─── Seed helpers ─────────────────────────────────────────────────────────────

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : [...INITIAL_USERS]
  } catch {
    return [...INITIAL_USERS]
  }
}

function loadChallenges(): Challenge[] {
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY)
    return raw ? JSON.parse(raw) : [...INITIAL_CHALLENGES]
  } catch {
    return [...INITIAL_CHALLENGES]
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveChallenges(challenges: Challenge[]): void {
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges))
}

// Seed on first load
if (!localStorage.getItem(USERS_KEY)) saveUsers(INITIAL_USERS)
if (!localStorage.getItem(CHALLENGES_KEY)) saveChallenges(INITIAL_CHALLENGES)

// ─── Users ────────────────────────────────────────────────────────────────────

export const userStore = {
  getAll(): User[] {
    return loadUsers()
  },

  getById(id: string): User | undefined {
    return loadUsers().find((u) => u.id === id)
  },

  getByUsername(username: string): User | undefined {
    return loadUsers().find((u) => u.username.toLowerCase() === username.toLowerCase())
  },

  getByEmail(email: string): User | undefined {
    return loadUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
  },

  create(data: Omit<User, 'id' | 'points' | 'solvedCount' | 'createdCount' | 'joinedAt'>): User {
    const users = loadUsers()
    const newUser: User = {
      ...data,
      id: `u${Date.now()}`,
      points: 0,
      solvedCount: 0,
      createdCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    }
    saveUsers([...users, newUser])
    return newUser
  },

  update(id: string, patch: Partial<User>): User | undefined {
    const users = loadUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return undefined
    users[idx] = { ...users[idx], ...patch }
    saveUsers(users)
    return users[idx]
  },

  getRanked(): User[] {
    return loadUsers().sort((a, b) => b.points - a.points)
  },
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export const challengeStore = {
  getAll(): Challenge[] {
    return loadChallenges()
  },

  getById(id: string): Challenge | undefined {
    return loadChallenges().find((c) => c.id === id)
  },

  getByAuthor(authorId: string): Challenge[] {
    return loadChallenges().filter((c) => c.authorId === authorId)
  },

  create(data: Omit<Challenge, 'id' | 'createdAt' | 'solutions'>): Challenge {
    const challenges = loadChallenges()
    const newChallenge: Challenge = {
      ...data,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      solutions: [],
    }
    saveChallenges([...challenges, newChallenge])

    // Award points to author
    const author = userStore.getById(data.authorId)
    if (author) {
      userStore.update(author.id, {
        points: author.points + 25,
        createdCount: author.createdCount + 1,
      })
    }

    return newChallenge
  },

  addSolution(
    challengeId: string,
    data: Omit<Solution, 'id' | 'challengeId' | 'votes' | 'voters' | 'createdAt'>
  ): Solution | undefined {
    const challenges = loadChallenges()
    const idx = challenges.findIndex((c) => c.id === challengeId)
    if (idx === -1) return undefined

    const newSolution: Solution = {
      ...data,
      id: `s${Date.now()}`,
      challengeId,
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString().split('T')[0],
    }

    challenges[idx].solutions.push(newSolution)
    saveChallenges(challenges)

    // Award points to solution author
    const author = userStore.getById(data.authorId)
    if (author) {
      userStore.update(author.id, {
        points: author.points + 50,
        solvedCount: author.solvedCount + 1,
      })
    }

    return newSolution
  },

  voteSolution(challengeId: string, solutionId: string, voterId: string): boolean {
    const challenges = loadChallenges()
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return false

    const solution = challenge.solutions.find((s) => s.id === solutionId)
    if (!solution) return false

    const alreadyVoted = solution.voters.includes(voterId)
    if (alreadyVoted) {
      // Unvote
      solution.voters = solution.voters.filter((id) => id !== voterId)
      solution.votes--
      const solutionAuthor = userStore.getById(solution.authorId)
      if (solutionAuthor) {
        userStore.update(solutionAuthor.id, { points: solutionAuthor.points - 10 })
      }
    } else {
      // Vote
      solution.voters.push(voterId)
      solution.votes++
      const solutionAuthor = userStore.getById(solution.authorId)
      if (solutionAuthor) {
        userStore.update(solutionAuthor.id, { points: solutionAuthor.points + 10 })
      }
    }

    saveChallenges(challenges)
    return !alreadyVoted
  },
}
