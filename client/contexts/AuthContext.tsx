import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "coach" | "admin" | "athlete";

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("oncourt_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string, role: UserRole) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem("oncourt_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("oncourt_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
