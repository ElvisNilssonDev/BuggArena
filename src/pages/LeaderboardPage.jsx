import { useState, useEffect, useCallback, memo } from "react";
import { useNav } from "../hooks/useNav";
import { ROUTES } from "../constants";
import { leaderboardService } from "../services/leaderboardService";
import { cx } from "../utils/cx";
import Icon from "../components/ui/Icon";
import Avatar from "../components/ui/Avatar";

const PODIUM_COLORS = ["var(--gold)", "var(--silver)", "var(--bronze)"];
const PODIUM_HEIGHTS = [160, 128, 108];

const PodiumSlot = memo(function PodiumSlot({ user, rank, points }) {
  const { navigate } = useNav();
  const idx = rank - 1;

  return (
    <button
      className="podium-slot"
      onClick={() => navigate(ROUTES.PROFILE, user.id)}
      aria-label={`Rank ${rank}: ${user.username}, ${points} points`}
    >
      <Avatar username={user.username} size={rank === 1 ? "lg" : "md"} />
      <span className="podium-slot__name">{user.username}</span>
     <span className="podium-slot__pts">
        {(points || 0).toLocaleString()} pts
      </span>
      <div
        className="podium-slot__bar"
        style={{
          height: PODIUM_HEIGHTS[idx],
          "--podium-color": PODIUM_COLORS[idx],
        }}
      >
        <span className="podium-slot__rank">#{rank}</span>
      </div>
    </button>
  );
});

export default function LeaderboardPage() {
  const { navigate } = useNav();
  const [tab, setTab] = useState("global");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData =
      tab === "global"
        ? leaderboardService.getGlobal()
        : leaderboardService.getWeekly();

    fetchData
      .then((result) => setData(result))
      .catch(() => setError("Failed to load leaderboard."))
      .finally(() => setLoading(false));
  }, [tab]);

  const getPoints = useCallback(
    (u) => (tab === "global" ? (u.totalPoints || 0) : (u.weeklyPoints || u.totalPoints || 0)),
    [tab]
  );

  return (
    <main className="page">
      <h1 className="page-title">
        <Icon name="trophy" size={28} className="text-warning" /> Leaderboard
      </h1>
      <p className="page-subtitle">Top bug hunters ranked by points.</p>

      <div className="tab-bar" role="tablist" aria-label="Leaderboard period">
        {[
          ["global", "All Time"],
          ["weekly", "This Week"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={cx(
              "tab-bar__tab",
              tab === key && "tab-bar__tab--active"
            )}
            onClick={() => setTab(key)}
            role="tab"
            aria-selected={tab === key}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Loading leaderboard...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : data.length === 0 ? (
        <div className="empty-state">No rankings yet.</div>
      ) : (
        <>
          <section className="podium" aria-label="Top 3 players">
            {[1, 0, 2].map((i) =>
              data[i] ? (
                <PodiumSlot
                  key={data[i].id}
                  user={data[i]}
                  rank={i === 0 ? 1 : i === 1 ? 2 : 3}
                  points={getPoints(data[i])}
                />
              ) : null
            )}
          </section>

          {data.length > 3 && (
            <ol
              className="rank-list"
              start={4}
              aria-label="Rankings 4 and below"
            >
              {data.slice(3).map((u, i) => (
                <li
                  key={u.id}
                  className="rank-list__item"
                  onClick={() => navigate(ROUTES.PROFILE, u.id)}
                  tabIndex={0}
                  role="link"
                >
                  <span className="rank-list__rank">#{i + 4}</span>
                  <Avatar username={u.username} size="sm" />
                  <span className="rank-list__name">{u.username}</span>
                  <span className="rank-list__pts">
                    {getPoints(u).toLocaleString()}
                  </span>
                  <span className="text-muted text-xs">pts</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </main>
  );
}