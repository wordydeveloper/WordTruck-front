import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import BackendApp from './components/BackendApp';

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <BackendApp
      user={user}
      onLogout={logout}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}