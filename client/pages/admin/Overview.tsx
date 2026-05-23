import { AdminLayout } from "@/components/AdminLayout";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Dumbbell,
  Wind,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ProgressionCategory {
  name: string;
  average: number;
  trend: number;
  icon: React.ReactNode;
}

function StatCard({ metric }: { metric: MetricCard }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
          <p className="text-3xl font-bold text-white">{metric.value}</p>
        </div>
        <div className={`p-3 rounded-lg ${metric.color}`}>
          {metric.icon}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {metric.change >= 0 ? (
          <>
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              +{metric.change}%
            </span>
          </>
        ) : (
          <>
            <ArrowDownRight className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">
              {metric.change}%
            </span>
          </>
        )}
        <span className="text-xs text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
}

function ProgressionCard({
  category,
}: {
  category: ProgressionCategory;
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            {category.icon}
          </div>
          <h3 className="font-semibold text-white">{category.name}</h3>
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-3">{category.average}</p>
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full"
          style={{ width: `${Math.min(category.average, 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">
        {category.trend > 0 ? (
          <>
            <span className="text-green-400 font-medium">
              ↑ {category.trend}% improvement
            </span>
            {" "}from last period
          </>
        ) : (
          <>
            <span className="text-red-400 font-medium">
              ↓ {Math.abs(category.trend)}% decline
            </span>
            {" "}from last period
          </>
        )}
      </p>
    </div>
  );
}

export default function AdminOverview() {
  const mainMetrics: MetricCard[] = [
    {
      label: "Total Active Users",
      value: "2,847",
      change: 12,
      icon: <Users className="w-6 h-6 text-blue-400" />,
      color: "bg-blue-500/20",
    },
    {
      label: "Total Active Entities",
      value: "156",
      change: 8,
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      color: "bg-purple-500/20",
    },
    {
      label: "Total Test Days Conducted",
      value: "1,294",
      change: 25,
      icon: <Calendar className="w-6 h-6 text-green-400" />,
      color: "bg-green-500/20",
    },
    {
      label: "Average Athletes Per Test",
      value: "18.5",
      change: 5,
      icon: <Activity className="w-6 h-6 text-orange-400" />,
      color: "bg-orange-500/20",
    },
  ];

  const progressionCategories: ProgressionCategory[] = [
    {
      name: "Speed (m/s)",
      average: 8.2,
      trend: 3,
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
    },
    {
      name: "Strength (kg)",
      average: 75.4,
      trend: 5,
      icon: <Dumbbell className="w-5 h-5 text-red-400" />,
    },
    {
      name: "Agility (sec)",
      average: 6.1,
      trend: -2,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
    },
    {
      name: "Explosive Power (cm)",
      average: 52.8,
      trend: 8,
      icon: <Award className="w-5 h-5 text-pink-400" />,
    },
  ];

  const additionalMetrics: MetricCard[] = [
    {
      label: "Growth Rate (YoY)",
      value: "34.2%",
      change: 7,
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      color: "bg-green-500/20",
    },
    {
      label: "Platform Engagement",
      value: "76.5%",
      change: 4,
      icon: <Target className="w-6 h-6 text-blue-400" />,
      color: "bg-blue-500/20",
    },
    {
      label: "Test Completion Rate",
      value: "91.3%",
      change: 2,
      icon: <Award className="w-6 h-6 text-purple-400" />,
      color: "bg-purple-500/20",
    },
    {
      label: "Active Programs",
      value: "12",
      change: 0,
      icon: <Activity className="w-6 h-6 text-orange-400" />,
      color: "bg-orange-500/20",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-gray-400">
            Business metrics, growth analytics, and performance data
          </p>
        </div>

        {/* Main Metrics Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Key Business Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainMetrics.map((metric) => (
              <StatCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        {/* Progression Averages Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Athletic Performance Progression Averages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {progressionCategories.map((category) => (
              <ProgressionCard
                key={category.name}
                category={category}
              />
            ))}
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Additional Business Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalMetrics.map((metric) => (
              <StatCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        {/* Bottom Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Entity */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Top Performing Entity
            </h3>
            <p className="text-2xl font-bold text-blue-300 mb-2">
              Dubai Sports Institute
            </p>
            <p className="text-sm text-blue-200 mb-3">
              342 active athletes | 89 test days conducted
            </p>
            <div className="text-sm text-blue-100">
              Average progression: <span className="font-semibold">+15.2%</span>
            </div>
          </div>

          {/* Growth Highlights */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 border border-green-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Growth Highlights
            </h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                34.2% YoY growth in active users
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                156 entities currently active
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                91.3% test completion rate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
