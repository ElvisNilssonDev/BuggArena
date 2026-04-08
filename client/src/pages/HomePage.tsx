import { Link } from 'react-router-dom'
import { ChallengeCard } from '../components/ChallengeCard'
import { Avatar } from '../components/ui/Avatar'
import { Stat } from '../components/ui/Stat'
import { Icon } from '../components/ui/Icon'
import { challengeStore, userStore } from '../services/dataStore'

export function HomePage() {
  const challenges = challengeStore.getAll()
  const users = userStore.getRanked()
  const featured = challenges.slice(0, 3)
  const top3 = users.slice(0, 3)

  const totalSolutions = challenges.reduce((acc, c) => acc + c.solutions.length, 0)

  return (
    <main className="page">
      {/* Hero */}
      <section className="container">
        <div className="hero">
          <div className="hero-eyebrow">
            <Icon name="flame" size={12} />
            Competitive Bug Hunting
          </div>
          <h1 className="hero-title">
            Find the Bug,{' '}
            <span className="hero-title-gradient">Win the Arena</span>
          </h1>
          <p className="hero-subtitle">
            Real code, real bugs. Submit fixes, earn votes, and climb the leaderboard.
            No tutorials — just battle-tested debugging.
          </p>
          <div className="hero-actions">
            <Link to="/challenges" className="btn btn-primary btn-lg">
              <Icon name="bug" size={18} />
              Browse Challenges
            </Link>
            <Link to="/challenges/new" className="btn btn-secondary btn-lg">
              <Icon name="plus" size={18} />
              Post a Bug
            </Link>
          </div>

          <div className="hero-stats">
            <Stat value={challenges.length} label="Challenges" accent="var(--color-primary)" />
            <Stat value={totalSolutions} label="Solutions" accent="var(--color-secondary)" />
            <Stat value={users.length} label="Hunters" accent="var(--color-accent)" />
          </div>
        </div>
      </section>

      {/* Featured challenges */}
      <section className="container" style={{ marginTop: 'var(--space-16)' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Bugs</h2>
            <p className="section-subtitle">Jump in and start debugging</p>
          </div>
          <Link to="/challenges" className="btn btn-ghost">
            View all <Icon name="arrow-right" size={16} />
          </Link>
        </div>
        <div className="challenge-grid">
          {featured.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>

      {/* Top hunters */}
      <section className="container" style={{ marginTop: 'var(--space-16)' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Top Hunters</h2>
            <p className="section-subtitle">This month's leaderboard</p>
          </div>
          <Link to="/leaderboard" className="btn btn-ghost">
            Full leaderboard <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        <div className="podium">
          {/* 2nd place */}
          {top3[1] && (
            <div className="podium-item">
              <Avatar username={top3[1].username} size="lg" />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{top3[1].username}</span>
              <div className="podium-pedestal podium-pedestal-2">
                <span className="podium-rank podium-rank-2">2</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  {top3[1].points} pts
                </span>
              </div>
            </div>
          )}
          {/* 1st place */}
          {top3[0] && (
            <div className="podium-item">
              <span className="podium-crown">👑</span>
              <Avatar username={top3[0].username} size="xl" />
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{top3[0].username}</span>
              <div className="podium-pedestal podium-pedestal-1">
                <span className="podium-rank podium-rank-1">1</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  {top3[0].points} pts
                </span>
              </div>
            </div>
          )}
          {/* 3rd place */}
          {top3[2] && (
            <div className="podium-item">
              <Avatar username={top3[2].username} size="lg" />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{top3[2].username}</span>
              <div className="podium-pedestal podium-pedestal-3">
                <span className="podium-rank podium-rank-3">3</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  {top3[2].points} pts
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
