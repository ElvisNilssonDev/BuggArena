import { useNavigate } from 'react-router-dom'
import { Badge } from './ui/Badge'
import { Avatar } from './ui/Avatar'
import { Icon } from './ui/Icon'
import type { Challenge } from '../data/challenges'
import { userStore } from '../services/dataStore'
import type { Difficulty } from '../constants'

interface ChallengeCardProps {
  challenge: Challenge
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const navigate = useNavigate()
  const author = userStore.getById(challenge.authorId)

  function handleClick() {
    navigate(`/challenges/${challenge.id}`)
  }

  return (
    <article
      className="card card-interactive challenge-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={challenge.title}
    >
      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <h3 className="challenge-card-title">{challenge.title}</h3>
          <Badge variant={challenge.difficulty as Difficulty}>{challenge.difficulty}</Badge>
        </div>

        <p className="challenge-card-description">{challenge.description}</p>

        <div className="challenge-card-tags">
          <Badge variant="secondary">{challenge.language}</Badge>
          {challenge.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="neutral">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="challenge-card-meta">
          <div className="challenge-card-author">
            {author && <Avatar username={author.username} size="sm" />}
            <span>{author?.username ?? 'unknown'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="code" size={14} />
              {challenge.solutions.length} solution{challenge.solutions.length !== 1 ? 's' : ''}
            </span>
            <span>{challenge.createdAt}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
