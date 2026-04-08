import { useState, useMemo } from 'react'
import type { Challenge } from '../data/challenges'
import type { Difficulty } from '../constants'

type SortBy = 'newest' | 'popular' | 'difficulty'

export function useChallengeFilters(challenges: Challenge[]) {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [language, setLanguage] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortBy>('newest')

  const filtered = useMemo(() => {
    let result = [...challenges]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (difficulty !== 'all') {
      result = result.filter((c) => c.difficulty === difficulty)
    }

    if (language !== 'all') {
      result = result.filter((c) => c.language === language)
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'popular') {
        return b.solutions.length - a.solutions.length
      }
      if (sortBy === 'difficulty') {
        const order = { easy: 0, medium: 1, hard: 2 }
        return order[a.difficulty] - order[b.difficulty]
      }
      return 0
    })

    return result
  }, [challenges, search, difficulty, language, sortBy])

  return {
    search, setSearch,
    difficulty, setDifficulty,
    language, setLanguage,
    sortBy, setSortBy,
    filtered,
  }
}
