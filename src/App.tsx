import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import HomePage from './pages/HomePage';
import ParticipantPage from './pages/ParticipantPage';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from "@/components/ui/toaster";
import './index.css';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { request } from '@/services/index';
import { URL_PROFILE } from '@/constants/index'

const checkUserProfile = async () => {
  try {
    const response = await request(URL_PROFILE, 'GET');
    return response.status_code === 200 ? response.data : null;
  } catch (error) {
    console.error('Error verificando perfil:', error);
    return null;
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const userData = await checkUserProfile();
      setUser(userData);
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/participant" element={<ParticipantPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
