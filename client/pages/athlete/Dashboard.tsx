import { AthleteLayout } from "@/components/AthleteLayout";

export default function AthleteDashboard() {
  return (
    <AthleteLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your athletic profile</p>
        </div>

        {/* FIFA STYLE Placeholder */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg p-12 text-center border border-blue-600">
          <div className="text-6xl mb-4">⚽</div>
          <h2 className="text-3xl font-bold text-white mb-3">FIFA STYLE</h2>
          <p className="text-blue-200 text-lg">
            Your personalized athletic dashboard coming soon
          </p>
        </div>
      </div>
    </AthleteLayout>
  );
}
