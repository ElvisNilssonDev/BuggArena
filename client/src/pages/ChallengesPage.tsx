import { Link } from 'react-router-dom'
import { ChallengeCard } from '../components/ChallengeCard'
import { Icon } from '../components/ui/Icon'
import { challengeStore } from '../services/dataStore'
import { useChallengeFilters } from '../hooks/useChallengeFilters'
import { DIFFICULTIES, LANGUAGES } from '../constants'
import { cx } from '../utils/cx'

export function ChallengesPage() {
  const allChallenges = challengeStore.getAll()
  const { search, setSearch, difficulty, setDifficulty, language, setLanguage, sortBy, setSortBy, filtered } =
    useChallengeFilters(allChallenges)

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 className="page-title">Challenges</h1>
              <p className="page-subtitle">{filtered.length} bug{filtered.length !== 1 ? 's' : ''} waiting to be squashed</p>
            </div>
            <Link to="/challenges/new" className="btn btn-primary">
              <Icon name="plus" size={16} />
              Post a Bug
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filters-search">
            <span className="filters-search-icon">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              className="input"
              placeholder="Search challenges, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search challenges"
            />
          </div>

          <div className="filters-group">
            <button
              className={cx('filter-chip', difficulty === 'all' ? 'active' : '')}
              onClick={() => setDifficulty('all')}
            >
              All
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={cx('filter-chip', difficulty === d ? 'active' : '')}
                onClick={() => setDifficulty(d)}
                style={{ textTransform: 'capitalize' }}
              >
                {d}
              </button>
            ))}
          </div>

          <select
            className="input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: 'auto' }}
            aria-label="Filter by language"
          >
            <option value="all">All Languages</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'difficulty')}
            style={{ width: 'auto' }}
            aria-label="Sort by"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Solutions</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No challenges found</p>
            <p>Try different filters or be the first to post one!</p>
          </div>
        ) : (
          <div className="challenge-grid">
            {filtered.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
