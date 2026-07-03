import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/ui/LoadingScreen';
import { Agentation } from 'agentation';
import Landing from './pages/Landing';
import AuthPage from './pages/auth/AuthPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import MarsRover from './pages/dashboard/MarsRover';
import AsteroidTracker from './pages/dashboard/AsteroidTracker';
import EarthImagery from './pages/dashboard/EarthImagery';
import NasaSearch from './pages/dashboard/NasaSearch';
import AIChat from './pages/dashboard/AIChat';
import Favorites from './pages/dashboard/Favorites';
import SpaceJournal from './pages/dashboard/SpaceJournal';
import Profile from './pages/dashboard/Profile';
import MoonPhase from './pages/dashboard/MoonPhase';
import ISSTracker from './pages/dashboard/ISSTracker';
import PlanetExplorer from './pages/dashboard/PlanetExplorer';
import Exoplanets from './pages/dashboard/Exoplanets';
import SolarActivity from './pages/dashboard/SolarActivity';
import SpaceNews from './pages/dashboard/SpaceNews';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
          <Route path="/reset-password/:token" element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="mars" element={<MarsRover />} />
            <Route path="asteroids" element={<AsteroidTracker />} />
            <Route path="earth" element={<EarthImagery />} />
            <Route path="search" element={<NasaSearch />} />
            <Route path="ai" element={<AIChat />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="journal" element={<SpaceJournal />} />
            <Route path="profile" element={<Profile />} />
            <Route path="moon" element={<MoonPhase />} />
            <Route path="iss" element={<ISSTracker />} />
            <Route path="planets" element={<PlanetExplorer />} />
            <Route path="exoplanets" element={<Exoplanets />} />
            <Route path="solar" element={<SolarActivity />} />
            <Route path="news" element={<SpaceNews />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  );
}
