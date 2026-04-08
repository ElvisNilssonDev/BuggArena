import { useState, useCallback } from 'react'
import { challengeStore } from '../services/dataStore'

export function useVote(challengeId: string, solutionId: string, initialVotes: number, initialVoters: string[]) {
  const [votes, setVotes] = useState(initialVotes)
  const [voters, setVoters] = useState(initialVoters)

  const vote = useCallback(
    (userId: string) => {
      const didVote = challengeStore.voteSolution(challengeId, solutionId, userId)
      if (didVote) {
        setVotes((v) => v + 1)
        setVoters((prev) => [...prev, userId])
      } else {
        setVotes((v) => v - 1)
        setVoters((prev) => prev.filter((id) => id !== userId))
      }
    },
    [challengeId, solutionId]
  )

  const hasVoted = useCallback((userId: string) => voters.includes(userId), [voters])

  return { votes, hasVoted, vote }
}
