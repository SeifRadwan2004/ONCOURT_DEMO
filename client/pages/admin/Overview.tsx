import { AdminLayout } from "@/components/AdminLayout";
import {
  Users,
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";

// Mock data aggregated from the platform
const PLATFORM_DATA = {
  totalAthletes: 247,
  activeAthletes: 193,
  totalEntities: 18,
  activeEntities: 15,
  totalCoaches: 42,
  activeCoaches: 38,
  upcomingTestDays: 8,
  completedTestDays: 34,
  progressions: 127,
  activeSubscriptions: 56,
  trialSubscriptions: 12,
  expiredSubscriptions: 8,
  totalRevenue: 185750,
  monthlyRevenue: 18200,
};

interface MetricCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color: "blue" | "green" | "orange" | "purple" | "red";
}

const METRIC_COLORS = {
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
};

function MetricCard({
  title,
  value,
  description,
  icon,
  color,
  trend,
}: MetricCard) {
  const colorClasses = METRIC_COLORS[color];
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg border ${colorClasses}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center gap-1.5 pt-1">
          <TrendingUp
            className={`w-3.5 h-3.5 ${
              trend.direction === "down" ? "rotate-180" : ""
            } ${trend.direction === "up" ? "text-green-400" : "text-red-400"}`}
          />
          <span
            className={`text-xs font-medium ${
              trend.direction === "up" ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend.direction === "up" ? "+" : "-"}
            {Math.abs(trend.value)}% from last month
          </span>
        </div>
      )}
    </div>
  );
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "green" | "yellow" | "red" | "blue" | "orange";
}

const STAT_COLORS = {
  green: "bg-green-500/10 text-green-400",
  yellow: "bg-yellow-500/10 text-yellow-400",
  red: "bg-red-500/10 text-red-400",
  blue: "bg-blue-500/10 text-blue-400",
  orange: "bg-orange-500/10 text-orange-400",
};

function StatCard({ label, value, icon, color }: StatCard) {
  const colorClass = STAT_COLORS[color];
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  current,
  total,
  color,
}: {
  label: string;
  current: number;
  total: number;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const percentage = (current / total) * 100;
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm font-semibold text-muted-foreground">
          {current}/{total}
        </p>
      </div>
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const activeUserPercentage = (
    (PLATFORM_DATA.activeAthletes / PLATFORM_DATA.totalAthletes) *
    100
  ).toFixed(1);
  const activeEntityPercentage = (
    (PLATFORM_DATA.activeEntities / PLATFORM_DATA.totalEntities) *
    100
  ).toFixed(1);

  return (
    <AdminLayout>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border bg-gradient-to-r from-card to-card/50">
          <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time snapshot of your OnCourt platform metrics and performance
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Users"
              value={PLATFORM_DATA.activeAthletes}
              description={`${activeUserPercentage}% of ${PLATFORM_DATA.totalAthletes} total athletes`}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend={{ value: 12, direction: "up" }}
            />
            <MetricCard
              title="Test Days"
              value={PLATFORM_DATA.completedTestDays}
              description={`${PLATFORM_DATA.upcomingTestDays} upcoming sessions scheduled`}
              icon={<Calendar className="w-5 h-5" />}
              color="green"
              trend={{ value: 8, direction: "up" }}
            />
            <MetricCard
              title="Active Entities"
              value={PLATFORM_DATA.activeEntities}
              description={`${activeEntityPercentage}% of ${PLATFORM_DATA.totalEntities} registered`}
              icon={<Building2 className="w-5 h-5" />}
              color="orange"
              trend={{ value: 3, direction: "up" }}
            />
            <MetricCard
              title="Athlete Progressions"
              value={PLATFORM_DATA.progressions}
              description="Total advancement records tracked"
              icon={<TrendingUp className="w-5 h-5" />}
              color="purple"
              trend={{ value: 5, direction: "down" }}
            />
          </div>

          {/* Overall Impact & Progress */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Platform Impact & Growth
              </h3>
              <p className="text-xs text-muted-foreground">
                Comprehensive overview of OnCourt's reach and influence across the sports ecosystem
              </p>
            </div>

            {/* Impact Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-end justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Total Athletes Impacted</p>
                  <span className="text-xs text-green-400 font-medium">+18%</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{PLATFORM_DATA.totalAthletes}</p>
                <p className="text-xs text-muted-foreground mt-1">Across {PLATFORM_DATA.totalEntities} entities</p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-end justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Total Progressions Tracked</p>
                  <span className="text-xs text-green-400 font-medium">+24%</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{PLATFORM_DATA.progressions}</p>
                <p className="text-xs text-muted-foreground mt-1">Individual athlete advancements</p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-end justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Test Sessions Completed</p>
                  <span className="text-xs text-green-400 font-medium">+31%</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{PLATFORM_DATA.completedTestDays}</p>
                <p className="text-xs text-muted-foreground mt-1">Benchmarking & evaluation events</p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-end justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Coaches Employed</p>
                  <span className="text-xs text-green-400 font-medium">+7%</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{PLATFORM_DATA.totalCoaches}</p>
                <p className="text-xs text-muted-foreground mt-1">Professional evaluation experts</p>
              </div>
            </div>

            {/* Progress Visualization */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Platform Reach</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {PLATFORM_DATA.totalAthletes} of 500 capacity
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${(PLATFORM_DATA.totalAthletes / 500) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">User Activation</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {activeUserPercentage}% active
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      style={{
                        width: `${(PLATFORM_DATA.activeAthletes / PLATFORM_DATA.totalAthletes) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Progression Rate</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {(
                        (PLATFORM_DATA.progressions / PLATFORM_DATA.totalAthletes) *
                        100
                      ).toFixed(1)}
                      % tracked
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                      style={{
                        width: `${(PLATFORM_DATA.progressions / PLATFORM_DATA.totalAthletes) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Entity Engagement</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {activeEntityPercentage}% engaged
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                      style={{
                        width: `${(PLATFORM_DATA.activeEntities / PLATFORM_DATA.totalEntities) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(
                    (PLATFORM_DATA.activeAthletes / PLATFORM_DATA.totalAthletes) * 100
                  )}
                  %
                </p>
                <p className="text-xs text-muted-foreground mt-1">Active Engagement</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {(PLATFORM_DATA.progressions / PLATFORM_DATA.completedTestDays).toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Avg Progressions per Test</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(
                    PLATFORM_DATA.totalAthletes / PLATFORM_DATA.totalCoaches
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Athletes per Coach</p>
              </div>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Subscription Status
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {PLATFORM_DATA.activeSubscriptions +
                    PLATFORM_DATA.trialSubscriptions +
                    PLATFORM_DATA.expiredSubscriptions}{" "}
                  Total
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              <StatCard
                label="Active"
                value={PLATFORM_DATA.activeSubscriptions}
                icon={<CheckCircle2 className="w-4 h-4" />}
                color="green"
              />
              <StatCard
                label="Trial"
                value={PLATFORM_DATA.trialSubscriptions}
                icon={<Clock3 className="w-4 h-4" />}
                color="yellow"
              />
              <StatCard
                label="Expired"
                value={PLATFORM_DATA.expiredSubscriptions}
                icon={<AlertCircle className="w-4 h-4" />}
                color="red"
              />
            </div>
          </div>

          {/* User & Entity Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users Breakdown */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  Users Overview
                </h3>
              </div>
              <div className="space-y-3">
                <StatCard
                  label="Total Athletes"
                  value={PLATFORM_DATA.totalAthletes}
                  icon={<Users className="w-4 h-4" />}
                  color="blue"
                />
                <StatCard
                  label="Active Athletes"
                  value={PLATFORM_DATA.activeAthletes}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  color="green"
                />
                <StatCard
                  label="Total Coaches"
                  value={PLATFORM_DATA.totalCoaches}
                  icon={<BarChart3 className="w-4 h-4" />}
                  color="orange"
                />
              </div>
            </div>

            {/* Entities Breakdown */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  Entities Overview
                </h3>
              </div>
              <div className="space-y-3">
                <StatCard
                  label="Total Entities"
                  value={PLATFORM_DATA.totalEntities}
                  icon={<Building2 className="w-4 h-4" />}
                  color="orange"
                />
                <StatCard
                  label="Active Entities"
                  value={PLATFORM_DATA.activeEntities}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  color="green"
                />
                <div className="text-sm space-y-1 pt-2 border-t border-border">
                  <p className="text-muted-foreground">
                    Avg athletes per entity: <span className="font-semibold text-foreground">13.7</span>
                  </p>
                  <p className="text-muted-foreground">
                    Avg coaches per entity: <span className="font-semibold text-foreground">2.3</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  Performance
                </h3>
              </div>
              <div className="space-y-3">
                <StatCard
                  label="Athlete Progressions"
                  value={PLATFORM_DATA.progressions}
                  icon={<TrendingUp className="w-4 h-4" />}
                  color="blue"
                />
                <StatCard
                  label="Completed Tests"
                  value={PLATFORM_DATA.completedTestDays}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  color="green"
                />
                <StatCard
                  label="Upcoming Tests"
                  value={PLATFORM_DATA.upcomingTestDays}
                  icon={<Calendar className="w-4 h-4" />}
                  color="yellow"
                />
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Platform Health
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  User Activation
                </p>
                <ProgressBar
                  label="Athletes Active"
                  current={PLATFORM_DATA.activeAthletes}
                  total={PLATFORM_DATA.totalAthletes}
                  color="blue"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Entity Engagement
                </p>
                <ProgressBar
                  label="Entities Active"
                  current={PLATFORM_DATA.activeEntities}
                  total={PLATFORM_DATA.totalEntities}
                  color="green"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Subscription Health
                </p>
                <ProgressBar
                  label="Active vs Expired"
                  current={PLATFORM_DATA.activeSubscriptions}
                  total={
                    PLATFORM_DATA.activeSubscriptions +
                    PLATFORM_DATA.expiredSubscriptions
                  }
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
