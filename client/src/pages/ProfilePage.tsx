import { useParams, Link } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { ChallengeCard } from '../components/ChallengeCard'
import { Stat } from '../components/ui/Stat'
import { userStore, challengeStore } from '../services/dataStore'

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const user = username ? userStore.getByUsername(username) : null

  if (!user) {
    return (
      <main className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '8px' }}>User not found</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            That hunter doesn't exist in the arena.
          </p>
          <Link to="/leaderboard" className="btn btn-primary">View Leaderboard</Link>
        </div>
      </main>
    )
  }

  const allUsers = userStore.getRanked()
  const rank = allUsers.findIndex((u) => u.id === user.id) + 1
  const createdChallenges = challengeStore.getByAuthor(user.id)

  return (
    <main className="page">
      <div className="container">
        {/* Profile header */}
        <div className="profile-header">
          <Avatar username={user.username} size="xl" />
          <div className="profile-info">
            <h1 className="profile-username">{user.username}</h1>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-stats">
              <Stat value={`#${rank}`} label="Rank" accent="var(--color-primary)" />
              <Stat value={user.points} label="Points" accent="var(--color-accent)" />
              <Stat value={user.solvedCount} label="Solved" accent="var(--color-secondary)" />
              <Stat value={user.createdCount} label="Posted" accent="var(--color-success)" />
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', alignSelf: 'flex-start' }}>
            Joined {user.joinedAt}
          </div>
        </div>

        {/* Posted challenges */}
        <div>
          <div className="section-header">
            <h2 className="section-title">
              Posted Bugs
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-text-faint)', marginLeft: '8px' }}>
                {createdChallenges.length}
              </span>
            </h2>
          </div>

          {createdChallenges.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🐛</div>
              <p className="empty-state-title">No bugs posted yet</p>
              <p>{user.username} hasn't posted any challenges.</p>
            </div>
          ) : (
            <div className="challenge-grid">
              {createdChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
