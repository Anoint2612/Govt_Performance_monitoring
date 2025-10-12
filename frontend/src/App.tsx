import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ManagerDashboard from "./pages/ManagerDashboard.tsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.tsx";
import NotFound from "./pages/NotFound";
import api, { setAuthToken } from "./services/api";

const queryClient = new QueryClient();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [profileLoaded, setProfileLoaded] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const newToken = res.data.token;
      const userRole = res.data.role || '';
      setToken(newToken);
      setRole(userRole);
      setAuthToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', userRole);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
    setAuthToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  if (!token) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  // if token exists but profile not yet loaded, fetch /auth/me
  if (token && !profileLoaded) {
    setAuthToken(token);
    (async () => {
      try {
        const me = await api.get('/auth/me');
        setRole(me.data.role || '');
        localStorage.setItem('role', me.data.role || '');
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // invalid token, clear
        setToken('');
        setAuthToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } finally {
        setProfileLoaded(true);
      }
    })();
    return <div>Loading...</div>; // small placeholder while loading
  }
  // route to role-specific dashboards
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {role === 'HQAdmin' && <Route path="/" element={<DashboardPage onLogout={handleLogout} />} />}
            {role === 'Manager' && <Route path="/" element={<ManagerDashboard onLogout={handleLogout} />} />}
            {role === 'Employee' && <Route path="/" element={<EmployeeDashboard onLogout={handleLogout} />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
