import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  BarChart3,
  Zap,
  Target,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "coach" ? "/coach/dashboard" : "/admin/overview");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F6c6007d7a3904b5cb566ab5a6dd6c538%2F512043dd4e0c4d2b974e32c615eeae69?format=webp" alt="OnCourt" className="h-10 w-auto" />
          </Link>
          <Link to="/login">
            <Button className="bg-accent hover:bg-orange-600 text-accent-foreground">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Discover Tomorrow's{" "}
            <span className="text-accent">Athletic Talent</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            OnCourt is a comprehensive youth athlete talent identification and
            development platform. Coaches and administrators can benchmark
            performance, schedule test days, and unlock athletic potential.
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="bg-accent hover:bg-orange-600 text-accent-foreground px-8 py-6 text-lg font-semibold"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-border py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Performance Analytics
              </h3>
              <p className="text-muted-foreground">
                Track and benchmark athlete performance with detailed analytics
                and insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Coach Management
              </h3>
              <p className="text-muted-foreground">
                Manage coaches, athletes, and clubs all in one centralized
                platform.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Test Day Scheduling
              </h3>
              <p className="text-muted-foreground">
                Schedule and manage test days efficiently with automated
                confirmations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Talent Development
              </h3>
              <p className="text-muted-foreground">
                Identify and nurture young talent with data-driven development
                plans.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Benchmarking
              </h3>
              <p className="text-muted-foreground">
                Compare performance metrics across groups and identify top
                performers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Real-time Insights
              </h3>
              <p className="text-muted-foreground">
                Get actionable insights and recommendations in real-time to
                improve outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent/10 to-accent/5 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join coaches and administrators worldwide in identifying and
            developing the next generation of athletes.
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="bg-accent hover:bg-orange-600 text-accent-foreground"
            >
              Sign In to OnCourt
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F6c6007d7a3904b5cb566ab5a6dd6c538%2F512043dd4e0c4d2b974e32c615eeae69?format=webp" alt="OnCourt" className="h-8 w-auto" />
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 OnCourt. All rights reserved. Youth Athlete Talent
              Identification & Development.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
