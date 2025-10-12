import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Mail } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const success = await onLogin(email, password);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm shadow-elegant">
            <Shield className="w-10 h-10 text-white animate-glow" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            HQ Admin
          </h1>
          <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
            Secure headquarters management platform for enterprise operations
          </p>
          <div className="mt-12 flex items-center justify-center gap-8 text-white/70">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">256-bit</div>
              <div className="text-sm">Encryption</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-subtle">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-primary shadow-elegant mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">HQ Admin</h2>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl shadow-elegant p-8 border border-border/50">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-glow transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-elegant transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">
                    Secure authentication
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Protected by enterprise-grade encryption
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 HQ Admin. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
