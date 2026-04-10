import { memo, useCallback } from "react";
import { useNav } from "../hooks/useNav";
import { ROUTES } from "../constants";
import Badge from "./ui/Badge";
import Stat from "./ui/Stat";

function getAuthorName(author) {
  if (!author) return "Unknown";
  if (typeof author === "string") return author;
  return author.username || "Unknown";
}

function getAuthorId(challenge) {
  return challenge.authorId || challenge.author?.id || null;
}

function ChallengeCard({ challenge }) {
  const { navigate } = useNav();

  const handleClick = useCallback(() => {
    navigate(ROUTES.CHALLENGE, challenge.id);
  }, [navigate, challenge.id]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <article
      className="challenge-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`Challenge: ${challenge.title}`}
    >
      <div className="challenge-card__body">
        <div className="challenge-card__tags">
          <Badge
            text={challenge.difficulty}
            variant={challenge.difficulty.toLowerCase()}
          />
          <Badge text={challenge.language} variant="lang" />
        </div>
        <h3 className="challenge-card__title">{challenge.title}</h3>
        <p className="challenge-card__meta">
          by <span className="text-accent-dim">{getAuthorName(challenge.author)}</span> ·{" "}
          {challenge.createdAt}
        </p>
      </div>

      <div className="challenge-card__stats">
        <Stat value={challenge.maxPoints} label="pts" accent="var(--accent)" />
        <Stat value={challenge.solutions || 0} label="solves" />
        <Stat value={challenge.votes || 0} label="votes" />
      </div>
    </article>
  );
}

export default memo(ChallengeCard);