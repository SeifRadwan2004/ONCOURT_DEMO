import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("athlete");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login(email, password, selectedRole);
    if (selectedRole === "coach") {
      navigate("/coach/dashboard");
    } else if (selectedRole === "admin") {
      navigate("/admin/overview");
    } else {
      navigate("/athlete/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">OC</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">OnCourt</h1>
          <p className="text-muted-foreground">
            Youth Athlete Talent Identification & Development
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className="w-full bg-background border-border"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                className="w-full bg-background border-border"
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("athlete")}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedRole === "athlete"
                      ? "bg-accent text-accent-foreground ring-2 ring-accent"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Athlete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("coach")}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedRole === "coach"
                      ? "bg-accent text-accent-foreground ring-2 ring-accent"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Coach
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedRole === "admin"
                      ? "bg-accent text-accent-foreground ring-2 ring-accent"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-orange-600 text-accent-foreground font-semibold py-3 rounded-lg mt-6"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Demo Mode: Use any email and password (min 6 chars) to sign in
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          © 2024 OnCourt. All rights reserved.
        </p>
      </div>
    </div>
  );
}
