import { FormField } from './ui/FormField'
import { useForm } from '../hooks/useForm'
import { useAuth } from '../hooks/useAuth'
import { challengeStore } from '../services/dataStore'
import { useNavigate } from 'react-router-dom'
import type { Solution } from '../data/challenges'

interface SolutionFormProps {
  challengeId: string
  onSubmitted: (solution: Solution) => void
}

const INITIAL_VALUES = { code: '', explanation: '' }

function validate(values: typeof INITIAL_VALUES) {
  const errors: Record<string, string> = {}
  if (!values.code.trim()) errors.code = 'Code is required.'
  if (values.code.trim().length < 10) errors.code = 'Solution code is too short.'
  if (!values.explanation.trim()) errors.explanation = 'Please explain your fix.'
  if (values.explanation.trim().length < 20) errors.explanation = 'Explanation must be at least 20 characters.'
  return errors
}

export function SolutionForm({ challengeId, onSubmitted }: SolutionFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const form = useForm(INITIAL_VALUES, validate)

  if (!user) {
    return (
      <div className="card card-body" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          You must be logged in to submit a solution.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Log in to submit
        </button>
      </div>
    )
  }

  function handleSubmit() {
    form.handleSubmit(async (values) => {
      const solution = challengeStore.addSolution(challengeId, {
        authorId: user!.id,
        code: values.code,
        explanation: values.explanation,
      })
      if (solution) {
        form.reset()
        onSubmitted(solution)
      }
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>
          Submit Your Solution
        </h3>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField
          label="Fixed Code"
          name="code"
          value={form.values.code}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.code ? form.errors.code : undefined}
          type="textarea"
          placeholder="// Paste your fixed code here..."
          rows={8}
          required
        />
        <FormField
          label="Explanation"
          name="explanation"
          value={form.values.explanation}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.explanation ? form.errors.explanation : undefined}
          type="textarea"
          placeholder="Explain what the bug was and how your fix addresses it..."
          rows={4}
          required
        />
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={form.submitting}
          type="button"
        >
          {form.submitting ? 'Submitting…' : 'Submit Solution'}
        </button>
      </div>
    </div>
  )
}
