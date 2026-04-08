import { createContext, useState, useCallback, type ReactNode } from 'react'
import { userStore } from '../services/dataStore'
import type { User } from '../data/users'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (username: string, email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_KEY = 'bugarena_session'

function loadSession(): User | null {
  try {
    const id = sessionStorage.getItem(SESSION_KEY)
    if (!id) return null
    return userStore.getById(id) ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession)

  const login = useCallback((email: string, password: string) => {
    const found = userStore.getByEmail(email)
    if (!found) return { ok: false, error: 'No account found with that email.' }
    if (found.password !== password) return { ok: false, error: 'Incorrect password.' }
    sessionStorage.setItem(SESSION_KEY, found.id)
    setUser(found)
    return { ok: true }
  }, [])

  const register = useCallback((username: string, email: string, password: string) => {
    if (userStore.getByEmail(email)) return { ok: false, error: 'Email already in use.' }
    if (userStore.getByUsername(username)) return { ok: false, error: 'Username already taken.' }
    const newUser = userStore.create({ username, email, password, bio: '' })
    sessionStorage.setItem(SESSION_KEY, newUser.id)
    setUser(newUser)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
