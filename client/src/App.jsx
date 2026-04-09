import { AuthProvider } from "./context/AuthContext";
import { NavProvider } from "./context/NavContext";
import Navbar from "./components/Navbar";
import Router from "./Router";

export default function App() {
  return (
    <AuthProvider>
      <NavProvider>
        <div className="app">
          <div className="bg-glow bg-glow--top" aria-hidden="true" />
          <div className="bg-glow bg-glow--bottom" aria-hidden="true" />
          <div className="app__content">
            <Navbar />
            <Router />
          </div>
        </div>
      </NavProvider>
    </AuthProvider>
  );
}