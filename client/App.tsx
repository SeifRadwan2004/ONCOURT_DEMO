import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Coach Pages
import CoachDashboard from "./pages/coach/Dashboard";
import CoachGroups from "./pages/coach/Groups";
import CoachBooking from "./pages/coach/Booking";
import CoachSubscriptions from "./pages/coach/Subscriptions";

// Admin Pages
import AdminOverview from "./pages/admin/Overview";
import AdminCoaches from "./pages/admin/Coaches";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminConfirmations from "./pages/admin/Confirmations";
import AdminLibrary from "./pages/admin/Library";
import AdminActiveTestDays from "./pages/admin/ActiveTestDays";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />

    {/* Coach Routes */}
    <Route
      path="/coach/dashboard"
      element={
        <ProtectedRoute>
          <CoachDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/coach/groups"
      element={
        <ProtectedRoute>
          <CoachGroups />
        </ProtectedRoute>
      }
    />
    <Route
      path="/coach/booking"
      element={
        <ProtectedRoute>
          <CoachBooking />
        </ProtectedRoute>
      }
    />
    <Route
      path="/coach/subscriptions"
      element={
        <ProtectedRoute>
          <CoachSubscriptions />
        </ProtectedRoute>
      }
    />

    {/* Admin Routes */}
    <Route
      path="/admin/overview"
      element={
        <ProtectedRoute>
          <AdminOverview />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/coaches"
      element={
        <ProtectedRoute>
          <AdminCoaches />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/analytics"
      element={
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/confirmations"
      element={
        <ProtectedRoute>
          <AdminConfirmations />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/library"
      element={
        <ProtectedRoute>
          <AdminLibrary />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/active-test-days"
      element={
        <ProtectedRoute>
          <AdminActiveTestDays />
        </ProtectedRoute>
      }
    />

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Initialize the app
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.hasChildNodes()) {
  createRoot(rootElement).render(<App />);
}
