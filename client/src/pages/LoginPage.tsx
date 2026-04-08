import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FormField } from '../components/ui/FormField'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'

const LOGIN_INIT = { email: '', password: '' }
const REGISTER_INIT = { username: '', email: '', password: '', confirm: '' }

function validateLogin(values: typeof LOGIN_INIT) {
  const errors: Record<string, string> = {}
  if (!values.email.trim()) errors.email = 'Email is required.'
  if (!values.password) errors.password = 'Password is required.'
  return errors
}

function validateRegister(values: typeof REGISTER_INIT) {
  const errors: Record<string, string> = {}
  if (!values.username.trim()) errors.username = 'Username is required.'
  if (values.username.length < 3) errors.username = 'Username must be at least 3 characters.'
  if (!/^[a-z0-9_]+$/i.test(values.username)) errors.username = 'Only letters, numbers, and underscores.'
  if (!values.email.trim()) errors.email = 'Email is required.'
  if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.password) errors.password = 'Password is required.'
  if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (values.confirm !== values.password) errors.confirm = 'Passwords do not match.'
  return errors
}

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  )
  const { user, login, register } = useAuth()
  const navigate = useNavigate()

  const loginForm = useForm(LOGIN_INIT, validateLogin)
  const registerForm = useForm(REGISTER_INIT, validateRegister)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  function handleLogin() {
    loginForm.handleSubmit(async (values) => {
      const result = login(values.email, values.password)
      if (!result.ok) {
        loginForm.setFieldError('password', result.error ?? 'Login failed.')
      }
    })
  }

  function handleRegister() {
    registerForm.handleSubmit(async (values) => {
      const result = register(values.username, values.email, values.password)
      if (!result.ok) {
        registerForm.setFieldError('email', result.error ?? 'Registration failed.')
      }
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="card-body">
          <div className="auth-header">
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🐛</div>
            <h1 className="auth-title">
              {tab === 'login' ? 'Welcome back' : 'Join the Arena'}
            </h1>
            <p className="auth-subtitle">
              {tab === 'login'
                ? 'Log in to squash some bugs'
                : 'Create your hunter account'}
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              padding: '4px',
              marginBottom: '24px',
            }}
          >
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  background: tab === t ? 'var(--color-surface-3)' : 'transparent',
                  color: tab === t ? 'var(--color-text)' : 'var(--color-text-muted)',
                  border: tab === t ? '1px solid var(--color-border)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <div className="auth-form">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={loginForm.touched.email ? loginForm.errors.email : undefined}
                placeholder="you@example.com"
                required
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={loginForm.touched.password ? loginForm.errors.password : undefined}
                placeholder="••••••••"
                required
              />
              <button
                className="btn btn-primary"
                onClick={handleLogin}
                disabled={loginForm.submitting}
                type="button"
                style={{ width: '100%' }}
              >
                {loginForm.submitting ? 'Logging in…' : 'Log in'}
              </button>

              <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                <strong style={{ color: 'var(--color-text-muted)' }}>Demo accounts:</strong>{' '}
                diana@example.com / alice@example.com / bob@example.com — password: <code>password123</code>
              </div>
            </div>
          ) : (
            <div className="auth-form">
              <FormField
                label="Username"
                name="username"
                value={registerForm.values.username}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
                error={registerForm.touched.username ? registerForm.errors.username : undefined}
                placeholder="bug_hunter_42"
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={registerForm.values.email}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
                error={registerForm.touched.email ? registerForm.errors.email : undefined}
                placeholder="you@example.com"
                required
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                value={registerForm.values.password}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
                error={registerForm.touched.password ? registerForm.errors.password : undefined}
                placeholder="At least 6 characters"
                required
              />
              <FormField
                label="Confirm Password"
                name="confirm"
                type="password"
                value={registerForm.values.confirm}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
                error={registerForm.touched.confirm ? registerForm.errors.confirm : undefined}
                placeholder="••••••••"
                required
              />
              <button
                className="btn btn-primary"
                onClick={handleRegister}
                disabled={registerForm.submitting}
                type="button"
                style={{ width: '100%' }}
              >
                {registerForm.submitting ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
