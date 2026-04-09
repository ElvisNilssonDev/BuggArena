import { useState, useEffect } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import Icon from "../components/ui/Icon";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Stat from "../components/ui/Stat";
import ChallengeCard from "../components/ChallengeCard";

export default function ProfilePage({ userId }) {
  const { navigate } = useNav();
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      userService.getProfile(userId),
      userService.getChallenges(userId),
    ])
      .then(([profileData, challengesData]) => {
        setUser(profileData);
        setChallenges(challengesData);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <main className="page">
        <div className="empty-state">Loading profile...</div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="page">
        <div className="empty-state">{error || "User not found."}</div>
      </main>
    );
  }

  const isOwn = auth.isAuthenticated && auth.user.id === userId;

  return (
    <main className="page">
      <header className="profile-header card">
        <Avatar username={user.username} size="xl" />

        <div className="profile-header__info">
          <div className="profile-header__name-row">
            <h1 className="profile-header__name">{user.username}</h1>
            {user.role !== "User" && (
              <Badge
                text={user.role}
                variant={user.role === "Admin" ? "danger" : "special"}
              />
            )}
          </div>
          <p className="text-muted">
            Rank #{user.rank} · {user.email}
          </p>
        </div>

        {isOwn && (
          <button className="btn btn--ghost" onClick={auth.logout}>
            <Icon name="logout" size={14} /> Log Out
          </button>
        )}
      </header>

      <section className="stats-row" aria-label="User statistics">
        <Stat
          value={user.totalPoints.toLocaleString()}
          label="Total Points"
          accent="var(--accent)"
        />
        <Stat
          value={`#${user.rank}`}
          label="Global Rank"
          accent="var(--gold)"
        />
        <Stat
          value={user.challengesSolved}
          label="Bugs Fixed"
          accent="var(--accent-alt)"
        />
        <Stat
          value={user.challengesCreated}
          label="Created"
          accent="var(--info)"
        />
      </section>

      <section aria-labelledby="user-challenges-heading">
        <h2 id="user-challenges-heading" className="section-heading">
          Challenges by {user.username}
        </h2>

        {challenges.length === 0 ? (
          <div className="empty-state">No challenges yet.</div>
        ) : (
          <div className="card-list">
            {challenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}