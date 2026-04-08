import { useNavigate, Link } from 'react-router-dom'
import { FormField } from '../components/ui/FormField'
import { Icon } from '../components/ui/Icon'
import { useForm } from '../hooks/useForm'
import { useAuth } from '../hooks/useAuth'
import { challengeStore } from '../services/dataStore'
import { LANGUAGES, DIFFICULTIES } from '../constants'

const INITIAL_VALUES = {
  title: '',
  description: '',
  buggyCode: '',
  language: 'JavaScript',
  difficulty: 'easy',
  tags: '',
}

function validate(values: typeof INITIAL_VALUES) {
  const errors: Record<string, string> = {}
  if (!values.title.trim()) errors.title = 'Title is required.'
  if (values.title.length > 80) errors.title = 'Title must be 80 characters or fewer.'
  if (!values.description.trim()) errors.description = 'Description is required.'
  if (values.description.trim().length < 30) errors.description = 'Description must be at least 30 characters.'
  if (!values.buggyCode.trim()) errors.buggyCode = 'Buggy code is required.'
  if (values.buggyCode.trim().length < 20) errors.buggyCode = 'Code is too short.'
  return errors
}

export function CreateChallengePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const form = useForm(INITIAL_VALUES, validate)

  if (!user) {
    return (
      <main className="page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '8px' }}>Login Required</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            You need to be logged in to post a challenge.
          </p>
          <Link to="/login" className="btn btn-primary">Log in</Link>
        </div>
      </main>
    )
  }

  function handleSubmit() {
    form.handleSubmit(async (values) => {
      const tags = values.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

      const challenge = challengeStore.create({
        title: values.title.trim(),
        description: values.description.trim(),
        buggyCode: values.buggyCode,
        language: values.language,
        difficulty: values.difficulty as 'easy' | 'medium' | 'hard',
        tags,
        authorId: user!.id,
      })

      navigate(`/challenges/${challenge.id}`)
    })
  }

  return (
    <main className="page">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/challenges" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
              <Icon name="arrow-right" size={14} />
            </span>
            Back to Challenges
          </Link>
        </div>

        <div className="page-header">
          <h1 className="page-title">Post a Bug</h1>
          <p className="page-subtitle">Share a tricky bug and challenge the community to fix it.</p>
        </div>

        <div className="create-form">
          <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormField
              label="Title"
              name="title"
              value={form.values.title}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.title ? form.errors.title : undefined}
              placeholder="e.g. Off-by-one error in pagination logic"
              required
            />

            <FormField
              label="Description"
              name="description"
              value={form.values.description}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.description ? form.errors.description : undefined}
              type="textarea"
              placeholder="Describe what the code is supposed to do and what's going wrong..."
              rows={4}
              required
            />

            <div className="create-form-grid">
              <FormField
                label="Language"
                name="language"
                value={form.values.language}
                onChange={form.handleChange}
                type="select"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </FormField>

              <FormField
                label="Difficulty"
                name="difficulty"
                value={form.values.difficulty}
                onChange={form.handleChange}
                type="select"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} style={{ textTransform: 'capitalize' }}>{d}</option>
                ))}
              </FormField>
            </div>

            <FormField
              label="Buggy Code"
              name="buggyCode"
              value={form.values.buggyCode}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.touched.buggyCode ? form.errors.buggyCode : undefined}
              type="textarea"
              placeholder="// Paste the buggy code here..."
              rows={12}
              required
              hint="Paste the code with the bug. Don't fix it — let the community find it!"
            />

            <FormField
              label="Tags"
              name="tags"
              value={form.values.tags}
              onChange={form.handleChange}
              placeholder="loops, indexing, async  (comma-separated)"
              hint="Add up to 5 tags to help people find your challenge."
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link to="/challenges" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={form.submitting}
                type="button"
              >
                {form.submitting ? 'Posting…' : 'Post Challenge'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
