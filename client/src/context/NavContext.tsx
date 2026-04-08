import { createContext, useState, useCallback, type ReactNode } from 'react'

interface NavContextValue {
  mobileOpen: boolean
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
}

export const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), [])

  return (
    <NavContext.Provider value={{ mobileOpen, openMobile, closeMobile, toggleMobile }}>
      {children}
    </NavContext.Provider>
  )
}
