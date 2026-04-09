import { useState, useCallback } from "react";

export function useVote(initialCount) {
  const [count, setCount] = useState(initialCount);
  const [direction, setDirection] = useState(0);

  const upvote = useCallback(() => {
    setCount((prev) =>
      direction === 1 ? prev - 1 : prev + 1 + (direction === -1 ? 1 : 0)
    );
    setDirection((prev) => (prev === 1 ? 0 : 1));
  }, [direction]);

  const downvote = useCallback(() => {
    setCount((prev) =>
      direction === -1 ? prev + 1 : prev - 1 - (direction === 1 ? 1 : 0)
    );
    setDirection((prev) => (prev === -1 ? 0 : -1));
  }, [direction]);

  return { count, direction, upvote, downvote };
}