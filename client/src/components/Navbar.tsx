import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Avatar } from './ui/Avatar'
import { Icon } from './ui/Icon'
import { useAuth } from '../hooks/useAuth'
import { cx } from '../utils/cx'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">🐛</span>
          <span>BugArena</span>
        </Link>

        <nav className="navbar-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => cx('navbar-link', isActive ? 'active' : '')}
          >
            Home
          </NavLink>
          <NavLink
            to="/challenges"
            className={({ isActive }) => cx('navbar-link', isActive ? 'active' : '')}
          >
            Challenges
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => cx('navbar-link', isActive ? 'active' : '')}
          >
            Leaderboard
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <Link
                to={`/profile/${user.username}`}
                className="navbar-user"
                style={{ gap: '8px', textDecoration: 'none' }}
              >
                <Avatar username={user.username} size="sm" />
                <span className="navbar-username">{user.username}</span>
              </Link>
              <Link to="/challenges/new" className="btn btn-primary btn-sm">
                <Icon name="plus" size={14} />
                Post Bug
              </Link>
              <button
                className="btn btn-ghost btn-icon"
                onClick={handleLogout}
                title="Log out"
                type="button"
              >
                <Icon name="logout" size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log in
              </Link>
              <Link to="/login?tab=register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
