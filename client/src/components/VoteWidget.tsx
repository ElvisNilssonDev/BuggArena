import { Icon } from './ui/Icon'
import { useVote } from '../hooks/useVote'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import type { Solution } from '../data/challenges'
import { cx } from '../utils/cx'

interface VoteWidgetProps {
  solution: Solution
}

export function VoteWidget({ solution }: VoteWidgetProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { votes, hasVoted, vote } = useVote(
    solution.challengeId,
    solution.id,
    solution.votes,
    solution.voters
  )

  const isAuthor = user?.id === solution.authorId
  const voted = user ? hasVoted(user.id) : false

  function handleVote() {
    if (!user) {
      navigate('/login')
      return
    }
    vote(user.id)
  }

  return (
    <div className="vote-widget">
      <button
        className={cx('vote-btn', voted ? 'voted' : '')}
        onClick={handleVote}
        disabled={isAuthor}
        title={
          isAuthor
            ? "You can't vote on your own solution"
            : !user
            ? 'Log in to vote'
            : voted
            ? 'Remove vote'
            : 'Vote for this solution'
        }
        type="button"
      >
        <Icon name="chevron-up" size={16} />
        <span>{votes}</span>
      </button>
    </div>
  )
}
