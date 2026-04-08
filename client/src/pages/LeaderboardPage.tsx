import { Avatar } from '../components/ui/Avatar'
import { Stat } from '../components/ui/Stat'
import { Link } from 'react-router-dom'
import { userStore } from '../services/dataStore'

export function LeaderboardPage() {
  const ranked = userStore.getRanked()
  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <main className="page">
      <div className="container">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title">🏆 Leaderboard</h1>
          <p className="page-subtitle">The arena's finest bug hunters</p>
        </div>

        {/* Podium */}
        <div className="podium">
          {top3[1] && (
            <div className="podium-item">
              <Link to={`/profile/${top3[1].username}`}>
                <Avatar username={top3[1].username} size="lg" />
              </Link>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{top3[1].username}</span>
              <div className="podium-pedestal podium-pedestal-2">
                <span className="podium-rank podium-rank-2">2</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  {top3[1].points} pts
                </span>
              </div>
            </div>
          )}
          {top3[0] && (
            <div className="podium-item">
              <span className="podium-crown">👑</span>
              <Link to={`/profile/${top3[0].username}`}>
                <Avatar username={top3[0].username} size="xl" />
              </Link>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{top3[0].username}</span>
              <div className="podium-pedestal podium-pedestal-1">
                <span className="podium-rank podium-rank-1">1</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                  {top3[0].points} pts
                </span>
              </div>
            </div>
          )}
          {top3[2] && (
            <div className="podium-item">
              <Link to={`/profile/${top3[2].username}`}>
                <Avatar username={top3[2].username} size="lg" />
              </Link>
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

        {/* Full table */}
        {rest.length > 0 && (
          <div style={{ marginTop: 'var(--space-10)' }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hunter</th>
                  <th>Points</th>
                  <th>Solved</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((user, idx) => (
                  <tr key={user.id} className="leaderboard-row">
                    <td className="leaderboard-row-rank">{idx + 4}</td>
                    <td>
                      <Link
                        to={`/profile/${user.username}`}
                        className="leaderboard-row-user"
                        style={{ textDecoration: 'none' }}
                      >
                        <Avatar username={user.username} size="sm" />
                        <span style={{ fontWeight: 600 }}>{user.username}</span>
                      </Link>
                    </td>
                    <td className="leaderboard-row-points">{user.points}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{user.solvedCount}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{user.createdCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Global stats */}
        <div
          className="card card-body"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-16)',
            marginTop: 'var(--space-12)',
            flexWrap: 'wrap',
          }}
        >
          <Stat value={ranked.length} label="Total Hunters" accent="var(--color-primary)" />
          <Stat
            value={ranked.reduce((acc, u) => acc + u.solvedCount, 0)}
            label="Bugs Squashed"
            accent="var(--color-secondary)"
          />
          <Stat
            value={ranked.reduce((acc, u) => acc + u.points, 0)}
            label="Points Earned"
            accent="var(--color-accent)"
          />
        </div>
      </div>
    </main>
  )
}
