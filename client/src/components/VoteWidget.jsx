import { useVote } from "../hooks/useVote";
import { cx } from "../utils/cx";
import Icon from "./ui/Icon";

export default function VoteWidget({ initialCount }) {
  const { count, direction, upvote, downvote } = useVote(initialCount);

  return (
    <div className="vote-widget" role="group" aria-label="Vote on challenge">
      <button
        className={cx("btn btn--icon", direction === 1 && "btn--voted-up")}
        onClick={upvote}
        aria-label="Upvote"
        aria-pressed={direction === 1}
      >
        <Icon name="arrowUp" size={20} />
      </button>

      <span className="vote-widget__count" aria-live="polite">
        {count}
      </span>

      <button
        className={cx("btn btn--icon", direction === -1 && "btn--voted-down")}
        onClick={downvote}
        aria-label="Downvote"
        aria-pressed={direction === -1}
      >
        <Icon name="arrowDown" size={20} />
      </button>
    </div>
  );
}