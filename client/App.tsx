import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
