import { useState, useEffect } from "react";
import { useNav } from "../hooks/useNav";
import { ROUTES } from "../constants";
import { challengeService } from "../services/challengeService";
import { leaderboardService } from "../services/leaderboardService";
import Icon from "../components/ui/Icon";
import Stat from "../components/ui/Stat";
import ChallengeCard from "../components/ChallengeCard";

export default function HomePage() {
  const { navigate } = useNav();
  const [trending, setTrending] = useState([]);
  const [stats, setStats] = useState({ challenges: 0, players: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [challengeData, leaderboardData] = await Promise.all([
          challengeService.getAll({ language: "All", difficulty: "All", search: "" }),
          leaderboardService.getGlobal(),
        ]);

        setTrending(challengeData.items.slice(0, 3));
        setStats({
          challenges: challengeData.totalCount || challengeData.items.length,
          players: leaderboardData.length || 0,
        });
      } catch {
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="page page--home">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__badge">
          <Icon name="zap" size={14} />
          <span>Competitive Debugging</span>
        </div>

        <h1 id="hero-heading" className="hero__title">
          <span className="hero__line">
            Find the <em className="text-accent">Bug</em>.
          </span>
          <span className="hero__line">
            Earn the <em className="text-accent-alt">Glory</em>.
          </span>
        </h1>

        <p className="hero__subtitle">
          A battle arena for developers. Submit buggy code, race to fix
          challenges, climb the global leaderboard.
        </p>

        <div className="hero__actions">
          <button
            className="btn btn--primary"
            onClick={() => navigate(ROUTES.CHALLENGES)}
          >
            <Icon name="bug" size={16} /> Browse Challenges
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => navigate(ROUTES.LEADERBOARD)}
          >
            <Icon name="trophy" size={16} /> Leaderboard
          </button>
        </div>
      </section>

      <section className="stats-row" aria-label="Platform statistics">
        <Stat value={stats.challenges} label="Active Challenges" accent="var(--accent)" />
        <Stat value={stats.players} label="Players" accent="var(--accent)" />
      </section>

      <section aria-labelledby="trending-heading">
        <h2 id="trending-heading" className="section-heading">
          <Icon name="fire" size={20} className="text-warning" /> Trending
          Challenges
        </h2>

        {loading ? (
          <div className="empty-state">Loading challenges...</div>
        ) : trending.length === 0 ? (
          <div className="empty-state">No challenges yet. Be the first!</div>
        ) : (
          <div className="card-list">
            {trending.map((c) => (
              <ChallengeCard key={c.id} challenge={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}