import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CodeBlock } from '../components/ui/CodeBlock'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { VoteWidget } from '../components/VoteWidget'
import { SolutionForm } from '../components/SolutionForm'
import { Icon } from '../components/ui/Icon'
import { challengeStore, userStore } from '../services/dataStore'
import type { Challenge, Solution } from '../data/challenges'
import type { Difficulty } from '../constants'

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    if (!id) return
    const found = challengeStore.getById(id)
    if (!found) navigate('/challenges', { replace: true })
    else setChallenge(found)
  }, [id, navigate])

  function handleSolutionSubmitted(_solution: Solution) {
    const updated = challengeStore.getById(id!)
    if (updated) setChallenge({ ...updated })
  }

  if (!challenge) return null

  const author = userStore.getById(challenge.authorId)
  const sortedSolutions = [...challenge.solutions].sort((a, b) => b.votes - a.votes)

  return (
    <main className="page">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/challenges" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
              <Icon name="arrow-right" size={14} />
            </span>
            Back to Challenges
          </Link>
        </div>

        <div className="detail-layout">
          {/* Main content */}
          <div>
            <div className="detail-header">
              <h1 className="detail-title">{challenge.title}</h1>
              <div className="detail-meta">
                <Badge variant={challenge.difficulty as Difficulty}>{challenge.difficulty}</Badge>
                <Badge variant="secondary">{challenge.language}</Badge>
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">{tag}</Badge>
                ))}
              </div>
            </div>

            <p className="detail-description">{challenge.description}</p>

            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: '12px' }}>
              Buggy Code
            </h2>
            <CodeBlock code={challenge.buggyCode} language={challenge.language} />

            {/* Solutions */}
            <div style={{ marginTop: 'var(--space-10)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: '8px' }}>
                Solutions
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-text-faint)', marginLeft: '8px' }}>
                  {challenge.solutions.length}
                </span>
              </h2>

              {sortedSolutions.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <div className="empty-state-icon">🧩</div>
                  <p className="empty-state-title">No solutions yet</p>
                  <p>Be the first to crack this bug!</p>
                </div>
              ) : (
                <div className="solutions-list">
                  {sortedSolutions.map((solution) => {
                    const solutionAuthor = userStore.getById(solution.authorId)
                    return (
                      <article key={solution.id} className="solution-card">
                        <div className="solution-card-header">
                          <div className="solution-author">
                            {solutionAuthor && (
                              <Avatar username={solutionAuthor.username} size="sm" />
                            )}
                            <div>
                              <div className="solution-author-name">
                                {solutionAuthor?.username ?? 'Unknown'}
                              </div>
                              <div className="solution-author-date">{solution.createdAt}</div>
                            </div>
                          </div>
                          <VoteWidget solution={solution} />
                        </div>
                        <CodeBlock code={solution.code} language={challenge.language} />
                        {solution.explanation && (
                          <div className="solution-explanation">
                            <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '6px' }}>
                              Explanation
                            </strong>
                            {solution.explanation}
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Submit solution */}
            <div style={{ marginTop: 'var(--space-10)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
                Submit Your Fix
              </h2>
              <SolutionForm challengeId={challenge.id} onSubmitted={handleSolutionSubmitted} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Posted by
                </div>
                {author ? (
                  <Link
                    to={`/profile/${author.username}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                  >
                    <Avatar username={author.username} size="md" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{author.username}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                        {author.points} pts
                      </div>
                    </div>
                  </Link>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)' }}>Unknown</span>
                )}
              </div>

              <hr className="divider" style={{ margin: 0 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Difficulty</span>
                  <Badge variant={challenge.difficulty as Difficulty}>{challenge.difficulty}</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Language</span>
                  <Badge variant="secondary">{challenge.language}</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Solutions</span>
                  <strong>{challenge.solutions.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Posted</span>
                  <span>{challenge.createdAt}</span>
                </div>
              </div>

              <hr className="divider" style={{ margin: 0 }} />

              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Tags
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {challenge.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
