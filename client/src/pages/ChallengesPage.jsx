import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { useChallengeFilters } from "../hooks/useChallengeFilters";
import { ROUTES, LANGUAGES, DIFFICULTIES } from "../constants";
import Icon from "../components/ui/Icon";
import ChallengeCard from "../components/ChallengeCard";

export default function ChallengesPage() {
  const { navigate } = useNav();
  const { isAuthenticated } = useAuth();
  const {
    language,
    difficulty,
    search,
    setLanguage,
    setDifficulty,
    setSearch,
    results,
    loading,
    error,
  } = useChallengeFilters();

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Challenges</h1>
          <p className="page-subtitle">Find bugs, fix code, earn points.</p>
        </div>
        {isAuthenticated && (
          <button
            className="btn btn--primary"
            onClick={() => navigate(ROUTES.CREATE)}
          >
            <Icon name="plus" size={16} /> New Challenge
          </button>
        )}
      </header>

      <div className="filters" role="search" aria-label="Filter challenges">
        <div className="filters__search">
          <Icon name="search" size={16} className="filters__search-icon" />
          <input
            type="search"
            className="input input--search"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search challenges by title"
          />
        </div>

        <select
          className="select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Filter by language"
        >
          <option value="All">All Languages</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
        >
          <option value="All">All Difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="card-list" role="list" aria-label="Challenge list">
        {loading ? (
          <div className="empty-state">Loading challenges...</div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : results.length === 0 ? (
          <div className="empty-state" role="status">
            No challenges match your filters.
          </div>
        ) : (
          results.map((c) => <ChallengeCard key={c.id} challenge={c} />)
        )}
      </div>
    </main>
  );
}