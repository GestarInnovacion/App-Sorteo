import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import HomePage from './pages/HomePage';
import ParticipantPage from './pages/ParticipantPage';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from "@/components/ui/toaster";
import './index.css';


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/participant" element={<ParticipantPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
