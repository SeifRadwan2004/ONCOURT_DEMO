import { useNavigate } from "react-router-dom";
import { AthleteLayout } from "@/components/AthleteLayout";
import { Button } from "@/components/ui/button";

export default function AthleteDashboard() {
  const navigate = useNavigate();

  return (
    <AthleteLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your athletic profile</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-lg p-8 shadow-xl border border-border">
          <div className="text-center">
            <div className="text-6xl mb-4">⚽</div>
            <h2 className="text-3xl font-bold text-white mb-3">Your Athletic Profile</h2>
            <p className="text-muted-foreground text-lg mb-6">
              View your detailed performance metrics, anthropometric data, and test results history
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/athlete/profile")}
              className="bg-accent hover:bg-orange-600 text-accent-foreground"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
}
