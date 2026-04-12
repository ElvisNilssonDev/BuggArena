import { useState, useEffect } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { solutionService } from "../services/solutionService";
import Icon from "../components/ui/Icon";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Stat from "../components/ui/Stat";
import ChallengeCard from "../components/ChallengeCard";

function getAuthorName(author) {
  if (!author) return "Unknown";
  if (typeof author === "string") return author;
  return author.username || "Unknown";
}

export default function ProfilePage({ userId }) {
  const { navigate } = useNav();
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("challenges");

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

  // Load solutions for own challenges when viewing own profile
  useEffect(() => {
    if (!user || !auth.isAuthenticated || auth.user.id !== userId) return;
    if (challenges.length === 0) return;

    const loadSolutions = async () => {
      const allSolutions = [];
      for (const challenge of challenges) {
        try {
          const data = await solutionService.getForChallenge(challenge.id);
          const items = Array.isArray(data) ? data : data.items || [];
          items.forEach((s) => {
            allSolutions.push({
              ...s,
              challengeTitle: challenge.title,
              challengeId: challenge.id,
            });
          });
        } catch {
          // Skip if error
        }
      }
      setSolutions(allSolutions);
    };

    loadSolutions();
  }, [user, challenges, auth, userId]);

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
  const pendingSolutions = solutions.filter((s) => s.status === "Pending");

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
            Joined {new Date(user.createdAt).toLocaleDateString()}
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
          value={user.totalPoints?.toLocaleString() || "0"}
          label="Total Points"
          accent="var(--accent)"
        />
        <Stat
          value={user.challengesSolved || 0}
          label="Bugs Fixed"
          accent="var(--accent-alt)"
        />
        <Stat
          value={user.challengesCreated || 0}
          label="Created"
          accent="var(--info)"
        />
        {isOwn && (
          <Stat
            value={pendingSolutions.length}
            label="Pending Reviews"
            accent="var(--warning)"
          />
        )}
      </section>

      {isOwn && (
        <div className="tab-bar" role="tablist" aria-label="Profile sections">
          <button
            className={`tab-bar__tab ${activeTab === "challenges" ? "tab-bar__tab--active" : ""}`}
            onClick={() => setActiveTab("challenges")}
            role="tab"
            aria-selected={activeTab === "challenges"}
          >
            My Challenges
          </button>
          <button
            className={`tab-bar__tab ${activeTab === "solutions" ? "tab-bar__tab--active" : ""}`}
            onClick={() => setActiveTab("solutions")}
            role="tab"
            aria-selected={activeTab === "solutions"}
          >
            Solutions to Review
            {pendingSolutions.length > 0 && (
              <span className="badge badge--danger" style={{ marginLeft: 8 }}>
                {pendingSolutions.length}
              </span>
            )}
          </button>
        </div>
      )}

      {(!isOwn || activeTab === "challenges") && (
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
      )}

      {isOwn && activeTab === "solutions" && (
        <section aria-labelledby="solutions-heading">
          <h2 id="solutions-heading" className="section-heading">
            Solutions to Review
          </h2>

          {solutions.length === 0 ? (
            <div className="empty-state">
              No solutions submitted to your challenges yet.
            </div>
          ) : (
            <div className="card-list">
              {solutions.map((s) => (
                <SolutionReviewCard
                  key={s.id}
                  solution={s}
                  onReviewed={(updatedSolution) => {
                    setSolutions((prev) =>
                      prev.map((sol) =>
                        sol.id === updatedSolution.id ? { ...sol, ...updatedSolution } : sol
                      )
                    );
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function SolutionReviewCard({ solution, onReviewed }) {
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async (status) => {
    setReviewing(true);
    try {
      const updated = await solutionService.review(solution.id, status);
      onReviewed({ ...solution, ...updated, status });
    } catch {
      alert("Failed to review solution.");
    } finally {
      setReviewing(false);
    }
  };

  const isReviewed = solution.status === "Approved" || solution.status === "Rejected";

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            {solution.challengeTitle}
          </p>
          <p className="text-muted" style={{ fontSize: 13 }}>
            by {solution.solver?.username || solution.solverName || "Unknown"} ·{" "}
            {solution.timeToSolveSeconds}s ·{" "}
            Attempt #{solution.attemptNumber || 1}
          </p>
        </div>
        {isReviewed && (
          <Badge
            text={solution.status}
            variant={solution.status === "Approved" ? "easy" : "hard"}
          />
        )}
      </div>

      <div className="code-block">
        <div className="code-block__label">Fixed Code</div>
        <pre className="code-block__pre">
          <code>{solution.fixedCode}</code>
        </pre>
      </div>

      {solution.explanation && (
        <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7, marginBottom: 16 }}>
          <strong>Explanation:</strong> {solution.explanation}
        </p>
      )}

      {!isReviewed && (
        <div className="form-actions">
          <button
            className="btn btn--primary btn--sm"
            onClick={() => handleReview("Approved")}
            disabled={reviewing}
          >
            <Icon name="check" size={14} /> Approve
          </button>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => handleReview("Rejected")}
            disabled={reviewing}
          >
            <Icon name="chevronLeft" size={14} /> Reject
          </button>
        </div>
      )}

      {solution.pointsAwarded > 0 && (
        <p style={{ fontSize: 13, color: "var(--accent)", marginTop: 8, fontWeight: 700 }}>
          +{solution.pointsAwarded} points awarded
        </p>
      )}
    </div>
  );
}