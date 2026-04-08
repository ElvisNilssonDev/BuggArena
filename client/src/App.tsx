import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NavProvider } from './context/NavContext'
import { Navbar } from './components/Navbar'
import { Router } from './Router'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavProvider>
          <div className="app">
            <div className="bg-glow" aria-hidden="true" />
            <Navbar />
            <div className="app-content">
              <Router />
            </div>
          </div>
        </NavProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
