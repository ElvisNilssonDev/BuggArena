import { memo } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";
import { cx } from "../utils/cx";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";

function Navbar() {
  const { page, navigate } = useNav();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <button
        className="navbar__logo"
        onClick={() => navigate(ROUTES.HOME)}
        aria-label="BugArena Home"
      >
        <Icon name="bug" size={22} className="text-accent" />
        <span className="navbar__logo-text">BugArena</span>
      </button>

      <div className="navbar__links">
        <button
          className={cx(
            "navbar__link",
            page === ROUTES.CHALLENGES && "navbar__link--active"
          )}
          onClick={() => navigate(ROUTES.CHALLENGES)}
        >
          Challenges
        </button>

        <button
          className={cx(
            "navbar__link",
            page === ROUTES.LEADERBOARD && "navbar__link--active"
          )}
          onClick={() => navigate(ROUTES.LEADERBOARD)}
        >
          Leaderboard
        </button>

        {isAuthenticated && user ? (
          <button
            className="navbar__user"
            onClick={() => navigate(ROUTES.PROFILE, user.id)}
            aria-label={`Profile: ${user.username}`}
          >
            <Avatar username={user.username} size="sm" />
            <span className="navbar__user-name">{user.username}</span>
          </button>
        ) : (
          <button
            className="btn btn--primary btn--sm"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}

export default memo(Navbar);