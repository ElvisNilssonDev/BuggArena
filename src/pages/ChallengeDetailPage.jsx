import { useState, useEffect, useCallback } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";
import { challengeService } from "../services/challengeService";
import { solutionService } from "../services/solutionService";
import Icon from "../components/ui/Icon";
import Badge from "../components/ui/Badge";
import CodeBlock from "../components/ui/CodeBlock";
import VoteWidget from "../components/VoteWidget";
import SolutionForm from "../components/SolutionForm";

export default function ChallengeDetailPage({ id }) {
  const { navigate } = useNav();
  const { isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    challengeService
      .getById(id)
      .then((data) => setChallenge(data))
      .catch(() => setError("Failed to load challenge."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSolutionSubmit = useCallback(
    async (values) => {
      setSubmitting(true);
      try {
        await solutionService.submit(id, {
          fixedCode: values.code,
          explanation: values.explanation,
        });
        setSubmitted(true);
      } catch {
        setError("Failed to submit solution. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [id]
  );

  if (loading) {
    return (
      <main className="page">
        <div className="empty-state">Loading challenge...</div>
      </main>
    );
  }

  if (error && !challenge) {
    return (
      <main className="page">
        <div className="empty-state">{error}</div>
      </main>
    );
  }

  if (!challenge) {
    return (
      <main className="page">
        <div className="empty-state">Challenge not found.</div>
      </main>
    );
  }

  return (
    <main className="page">
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => navigate(ROUTES.CHALLENGES)}
      >
        <Icon name="chevronLeft" size={16} /> Back to Challenges
      </button>

      <div className="detail-layout">
        <article className="detail-main">
          <div className="detail-main__tags">
            <Badge
              text={challenge.difficulty}
              variant={challenge.difficulty.toLowerCase()}
            />
            <Badge text={challenge.language} variant="lang" />
            <Badge text={challenge.status} variant="default" />
          </div>

          <h1 className="detail-main__title">{challenge.title}</h1>

          <p className="detail-main__meta">
            by{" "}
            <button
              className="link-btn"
              onClick={() => navigate(ROUTES.PROFILE, challenge.authorId)}
            >
              {challenge.author}
            </button>{" "}
            · {challenge.createdAt}
          </p>

          <section aria-label="Description">
            <p className="detail-main__desc">{challenge.description}</p>
          </section>

          <CodeBlock code={challenge.buggyCode} label="Buggy Code" />

          <div className="behavior-grid">
            <div className="behavior-card behavior-card--expected">
              <h3 className="behavior-card__heading">Expected Behavior</h3>
              <p>{challenge.expectedBehavior}</p>
            </div>
            <div className="behavior-card behavior-card--actual">
              <h3 className="behavior-card__heading">Actual Behavior</h3>
              <p>{challenge.actualBehavior}</p>
            </div>
          </div>

          {challenge.hints && (
            <div className="hint-card" role="note">
              <h3 className="hint-card__heading">Hint</h3>
              <p>{challenge.hints}</p>
            </div>
          )}

          {isAuthenticated && !submitted && (
            <SolutionForm onSubmit={handleSolutionSubmit} />
          )}

          {submitting && (
            <div className="empty-state">Submitting your solution...</div>
          )}

          {submitted && (
            <div className="success-banner" role="status">
              <Icon name="check" size={20} />
              <div>
                <strong>Solution submitted!</strong>
                <p className="success-banner__sub">
                  Waiting for the challenge author to review.
                </p>
              </div>
            </div>
          )}

          {error && challenge && (
            <div className="empty-state">{error}</div>
          )}

          {!isAuthenticated && (
            <div className="auth-prompt card">
              <p>Log in to submit your solution.</p>
              <button
                className="btn btn--primary"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Log In
              </button>
            </div>
          )}
        </article>

        <aside className="detail-sidebar">
          <div className="card">
            <VoteWidget initialCount={challenge.votes} />
          </div>

          <div className="card sidebar-reward">
            <span className="form-field__label">Reward</span>
            <div className="sidebar-reward__pts">{challenge.maxPoints}</div>
            <span className="text-muted">max points</span>
          </div>

          <div className="card sidebar-stats-list">
            <span className="form-field__label">Stats</span>
            <dl className="sidebar-dl">
              <div>
                <dt>Solutions</dt>
                <dd>{challenge.solutions}</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd
                  className={`text-lang-${challenge.language.toLowerCase()}`}
                >
                  {challenge.language}
                </dd>
              </div>
              <div>
                <dt>Difficulty</dt>
                <dd
                  className={`text-diff-${challenge.difficulty.toLowerCase()}`}
                >
                  {challenge.difficulty}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}