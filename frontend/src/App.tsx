import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import api, { setAuthToken } from "./services/api";

const queryClient = new QueryClient();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const newToken = res.data.token;
      setToken(newToken);
      setAuthToken(newToken);
      localStorage.setItem('token', newToken);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setToken('');
    setAuthToken('');
    localStorage.removeItem('token');
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage onLogout={handleLogout} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
