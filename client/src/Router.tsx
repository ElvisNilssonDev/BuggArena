import { Routes, Route, Link } from 'react-router-dom'
import { ROUTES } from './constants'
import { HomePage } from './pages/HomePage'
import { ChallengesPage } from './pages/ChallengesPage'
import { ChallengeDetailPage } from './pages/ChallengeDetailPage'
import { CreateChallengePage } from './pages/CreateChallengePage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'

export function Router() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.CHALLENGES} element={<ChallengesPage />} />
      {/* /challenges/new must come before /challenges/:id so the static segment wins */}
      <Route path={ROUTES.CREATE_CHALLENGE} element={<CreateChallengePage />} />
      <Route path={ROUTES.CHALLENGE_DETAIL} element={<ChallengeDetailPage />} />
      <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '4rem' }}>🐛</div>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>404 — Bug not found</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>This page doesn't exist in the arena.</p>
      <Link to={ROUTES.HOME} className="btn btn-primary">Go home</Link>
    </main>
  )
}
