import { useNav } from "./hooks/useNav";
import { ROUTES } from "./constants";
import HomePage from "./pages/HomePage";
import ChallengesPage from "./pages/ChallengesPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import CreateChallengePage from "./pages/CreateChallengePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

export default function Router() {
  const { page, param } = useNav();

  switch (page) {
    case ROUTES.HOME:
      return <HomePage />;
    case ROUTES.CHALLENGES:
      return <ChallengesPage />;
    case ROUTES.CHALLENGE:
      return <ChallengeDetailPage id={param} />;
    case ROUTES.CREATE:
      return <CreateChallengePage />;
    case ROUTES.LEADERBOARD:
      return <LeaderboardPage />;
    case ROUTES.PROFILE:
      return <ProfilePage userId={param} />;
    case ROUTES.LOGIN:
      return <LoginPage />;
    case ROUTES.ADMIN:
      return <AdminPage />;
    default:
      return <HomePage />;
  }
}