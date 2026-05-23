import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GroupProvider } from "@/contexts/GroupContext";
import { GroupSelectorBar } from "./GroupSelectorBar";
import {
  BarChart3,
  Users,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { useState } from "react";

const coachNavItems = [
  { label: "Dashboard", icon: BarChart3, href: "/coach/dashboard" },
  {
    label: "Benchmarking Comparisons",
    icon: Users,
    href: "/coach/groups",
  },
  { label: "Test Day Booking", icon: Calendar, href: "/coach/booking" },
  {
    label: "Service Confirmations",
    icon: CreditCard,
    href: "/coach/confirmations",
  },
  {
    label: "Subscription & Payments",
    icon: CreditCard,
    href: "/coach/subscriptions",
  },
  {
    label: "Account Settings",
    icon: Settings,
    href: "/coach/account-settings",
  },
];

export function CoachLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const layoutContent = (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform z-40 h-screen`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/coach/dashboard" className="flex items-center gap-3">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F6c6007d7a3904b5cb566ab5a6dd6c538%2F512043dd4e0c4d2b974e32c615eeae69?format=webp" alt="OnCourt" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {coachNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-3 bg-accent hover:bg-orange-600 rounded-full text-accent-foreground shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Group Selector Bar */}
        <GroupSelectorBar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );

  return (
    <GroupProvider>
      {layoutContent}
    </GroupProvider>
  );
}
