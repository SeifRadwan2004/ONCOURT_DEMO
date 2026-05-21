import { useState, useMemo } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { useGroup } from "@/contexts/GroupContext";
import {
  mockAthletes,
  mockTestSessions,
  testCategories,
  Athlete,
  TestResult,
} from "@/data/mockData";
import { AgeBadges } from "@/components/athlete-metrics/AgeBadges";
import { PHVGauge } from "@/components/athlete-metrics/PHVGauge";
import { PHVStatusBar } from "@/components/athlete-metrics/PHVStatusBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Benchmarks ─────────────────────────────────────────────────────────────
// lowerIsBetter: true = lower result is better (e.g. sprints)
const benchmarks: Record<
  string,
  { value: number; lowerIsBetter: boolean }
> = {
  "10m Sprint": { value: 1.8, lowerIsBetter: true },
  "30m Sprint": { value: 4.2, lowerIsBetter: true },
  "5-10-5": { value: 5.0, lowerIsBetter: true },
  "T-Test": { value: 10.5, lowerIsBetter: true },
  "Vertical Jump": { value: 40, lowerIsBetter: false },
  "Broad Jump": { value: 180, lowerIsBetter: false },
  "Yo-Yo Test": { value: 10, lowerIsBetter: false },
  "Beep Test": { value: 8, lowerIsBetter: false },
  "Grip Left": { value: 25, lowerIsBetter: false },
  "Grip Right": { value: 27, lowerIsBetter: false },
  "Push-Ups": { value: 20, lowerIsBetter: false },
  Height: { value: 160, lowerIsBetter: false },
  Weight: { value: 55, lowerIsBetter: false },
  Wingspan: { value: 162, lowerIsBetter: false },
  "Sitting Height": { value: 82, lowerIsBetter: false },
};

type BenchmarkStatus = "above" | "at" | "below";

function getBenchmarkStatus(
  testName: string,
  value: number
): BenchmarkStatus | null {
  const b = benchmarks[testName];
  if (!b) return null;
  const pct = Math.abs(value - b.value) / b.value;
  if (pct <= 0.05) return "at";
  if (b.lowerIsBetter) return value < b.value ? "above" : "below";
  return value > b.value ? "above" : "below";
}

function BenchmarkTag({ status }: { status: BenchmarkStatus }) {
  if (status === "above")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
        🟢 Above
      </span>
    );
  if (status === "at")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
        🟡 At
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
      🔴 Below
    </span>
  );
}

// ─── Athlete Header ──────────────────────────────────────────────────────────
function AthleteHeaderCard({ athlete }: { athlete: Athlete }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <img
          src={athlete.photo}
          alt={athlete.name}
          className="w-16 h-16 rounded-full bg-muted border border-border"
        />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {athlete.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            DOB: {athlete.dateOfBirth}
          </p>
        </div>
      </div>

      {/* Age Badges */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Age
        </p>
        <AgeBadges
          chronologicalAge={athlete.chronologicalAge}
          biologicalAge={athlete.biologicalAge}
        />
      </div>

      {/* PHV Gauge */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide text-center">
          PHV Stage
        </p>
        <PHVGauge status={athlete.phvStatus} size="sm" />
      </div>

      {/* PHV Status Bar */}
      <div className="min-w-[120px] space-y-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Maturity
        </p>
        <PHVStatusBar status={athlete.phvStatus} size="sm" />
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface TestPoint {
  date: string;
  value: number;
}

interface TestCardData {
  category: string;
  testName: string;
  unit: string;
  latestValue: number;
  points: TestPoint[];
}

// ─── Expanded Chart Modal ────────────────────────────────────────────────────
function ExpandedChartModal({
  card,
  open,
  onClose,
}: {
  card: TestCardData;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {card.testName}{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({card.unit})
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Full Chart */}
        <div className="h-56 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={card.points}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{
                    fontSize: 11,
                    fill: "hsl(var(--foreground))",
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Session Date
                </th>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Result
                </th>
                <th className="px-4 py-2 text-left text-muted-foreground font-medium">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {card.points.map((pt, i) => (
                <tr
                  key={i}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-2 text-foreground">{pt.date}</td>
                  <td className="px-4 py-2 text-foreground font-semibold">
                    {pt.value}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {card.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Mini Test Card ──────────────────────────────────────────────────────────
function TestCard({ card }: { card: TestCardData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/40 transition-colors">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground">{card.testName}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {card.latestValue}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {card.unit}
              </span>
            </p>
          </div>
        </div>

        {/* Mini Chart — clickable */}
        <button
          className="w-full h-16 cursor-pointer group"
          onClick={() => setExpanded(true)}
          title="Click to expand"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={card.points}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                dot={{ r: 2, fill: "hsl(var(--primary))" }}
                isAnimationActive={false}
              />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: 11,
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ display: "none" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-1 group-hover:text-primary transition-colors">
            Tap to expand
          </p>
        </button>
      </div>

      {expanded && (
        <ExpandedChartModal
          card={card}
          open={expanded}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  );
}

// ─── Card View ───────────────────────────────────────────────────────────────
function CardView({
  cards,
}: {
  cards: TestCardData[];
}) {
  const grouped = useMemo(() => {
    const map: Record<string, TestCardData[]> = {};
    for (const c of cards) {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    }
    return map;
  }, [cards]);

  const categoryOrder = Object.keys(testCategories);

  const presentCategories = categoryOrder.filter(
    (cat) => grouped[cat] && grouped[cat].length > 0
  );

  if (presentCategories.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No test data available for this athlete.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {presentCategories.map((cat) => (
        <div key={cat}>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            {cat}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {grouped[cat].map((card) => (
              <TestCard key={`${cat}-${card.testName}`} card={card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tabular View ────────────────────────────────────────────────────────────
function TabularView({
  athleteId,
  groupId,
}: {
  athleteId: string;
  groupId: string;
}) {
  const sessions = mockTestSessions
    .filter((s) => s.groupId === groupId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const [selectedSessionId, setSelectedSessionId] = useState(
    sessions[0]?.id ?? ""
  );

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const athleteResults: TestResult[] = selectedSession
    ? selectedSession.results.filter((r) => r.athleteId === athleteId)
    : [];

  // Build rows per category order
  const categoryOrder = Object.keys(testCategories) as Array<
    keyof typeof testCategories
  >;

  const rowsByCategory: Record<string, TestResult[]> = {};
  for (const r of athleteResults) {
    if (!rowsByCategory[r.testType]) rowsByCategory[r.testType] = [];
    rowsByCategory[r.testType].push(r);
  }

  const athlete = mockAthletes.find((a) => a.id === athleteId);

  // Supplement anthropometrics from athlete object if no session data
  const anthropoFromAthlete: TestResult[] = athlete
    ? [
        { athleteId, testType: "Anthropometrics", testName: "Height", value: athlete.height, unit: "cm", date: selectedSession?.date ?? "" },
        { athleteId, testType: "Anthropometrics", testName: "Weight", value: athlete.weight, unit: "kg", date: selectedSession?.date ?? "" },
        { athleteId, testType: "Anthropometrics", testName: "Wingspan", value: athlete.wingspan, unit: "cm", date: selectedSession?.date ?? "" },
        { athleteId, testType: "Anthropometrics", testName: "Sitting Height", value: athlete.sittingHeight, unit: "cm", date: selectedSession?.date ?? "" },
      ]
    : [];

  if (!rowsByCategory["Anthropometrics"] || rowsByCategory["Anthropometrics"].length === 0) {
    rowsByCategory["Anthropometrics"] = anthropoFromAthlete;
  }

  const hasAnyData = categoryOrder.some(
    (cat) => rowsByCategory[cat] && rowsByCategory[cat].length > 0
  );

  if (!selectedSession && sessions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No test sessions found for this group.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Date Dropdown */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground font-medium">
          Session:
        </label>
        <Select
          value={selectedSessionId}
          onValueChange={setSelectedSessionId}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                Category
              </th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                Test Name
              </th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                Result
              </th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                Unit
              </th>
              <th className="px-4 py-3 text-left text-muted-foreground font-medium">
                Benchmark
              </th>
            </tr>
          </thead>
          <tbody>
            {!hasAnyData && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No results recorded for this athlete in this session.
                </td>
              </tr>
            )}
            {categoryOrder.map((cat) => {
              const rows = rowsByCategory[cat];
              if (!rows || rows.length === 0) return null;
              return rows.map((row, idx) => {
                const numVal =
                  typeof row.value === "number" ? row.value : parseFloat(String(row.value));
                const bm = benchmarks[row.testName];
                const status = bm ? getBenchmarkStatus(row.testName, numVal) : null;
                return (
                  <tr
                    key={`${cat}-${row.testName}-${idx}`}
                    className="border-t border-border hover:bg-muted/20 transition-colors"
                  >
                    {idx === 0 ? (
                      <td
                        rowSpan={rows.length}
                        className="px-4 py-3 align-middle"
                      >
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                          {cat}
                        </span>
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-foreground">{row.testName}</td>
                    <td className="px-4 py-3 text-foreground font-semibold">
                      {typeof row.value === "number"
                        ? row.value
                        : row.value}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.unit}
                    </td>
                    <td className="px-4 py-3">
                      {bm ? (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            {bm.value} {row.unit}
                          </span>
                          {status && <BenchmarkTag status={status} />}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Per Athlete View ────────────────────────────────────────────────────────
function PerAthleteView() {
  const { selectedGroupId, getGroupAthletes } = useGroup();
  const athletes = getGroupAthletes(selectedGroupId);

  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(
    () => athletes[0]?.id ?? ""
  );

  // When group changes, reset to first athlete
  const athlete = athletes.find((a) => a.id === selectedAthleteId) ?? athletes[0] ?? null;
  const effectiveAthleteId = athlete?.id ?? "";

  const [viewMode, setViewMode] = useState<"card" | "tabular">("card");

  // Build test card data from sessions
  const cards: TestCardData[] = useMemo(() => {
    if (!effectiveAthleteId) return [];

    const sessions = mockTestSessions
      .filter((s) => s.groupId === selectedGroupId)
      .sort((a, b) => a.date.localeCompare(b.date));

    // Collect all results for this athlete across sessions, keyed by testName
    const byTest: Record<
      string,
      { category: string; unit: string; points: TestPoint[] }
    > = {};

    for (const session of sessions) {
      for (const r of session.results) {
        if (r.athleteId !== effectiveAthleteId) continue;
        const numVal =
          typeof r.value === "number" ? r.value : parseFloat(String(r.value));
        if (!byTest[r.testName]) {
          byTest[r.testName] = { category: r.testType, unit: r.unit, points: [] };
        }
        byTest[r.testName].points.push({ date: r.date, value: numVal });
      }
    }

    // Add Anthropometrics from athlete object
    if (athlete) {
      const anthropo = [
        { testName: "Height", value: athlete.height, unit: "cm" },
        { testName: "Weight", value: athlete.weight, unit: "kg" },
        { testName: "Wingspan", value: athlete.wingspan, unit: "cm" },
        { testName: "Sitting Height", value: athlete.sittingHeight, unit: "cm" },
      ];
      for (const a of anthropo) {
        if (!byTest[a.testName]) {
          const singlePoint = sessions.length > 0
            ? sessions.map((s) => ({ date: s.date, value: a.value }))
            : [{ date: "Current", value: a.value }];
          byTest[a.testName] = {
            category: "Anthropometrics",
            unit: a.unit,
            points: singlePoint,
          };
        }
      }
    }

    return Object.entries(byTest).map(([testName, data]) => ({
      category: data.category,
      testName,
      unit: data.unit,
      latestValue: data.points[data.points.length - 1]?.value ?? 0,
      points: data.points,
    }));
  }, [effectiveAthleteId, selectedGroupId, athlete]);

  if (athletes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No athletes in this group.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Step 1 — Athlete Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Athlete:
        </label>
        <Select
          value={effectiveAthleteId}
          onValueChange={setSelectedAthleteId}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select athlete" />
          </SelectTrigger>
          <SelectContent>
            {athletes.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2 — Athlete Header Card */}
      {athlete && <AthleteHeaderCard athlete={athlete} />}

      {/* Step 3 — View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("card")}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
            viewMode === "card"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Card View
        </button>
        <button
          onClick={() => setViewMode("tabular")}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
            viewMode === "tabular"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Tabular View
        </button>
      </div>

      {/* Step 4 — Card / Tabular View */}
      {viewMode === "card" ? (
        <CardView cards={cards} />
      ) : (
        <TabularView
          athleteId={effectiveAthleteId}
          groupId={selectedGroupId}
        />
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function CoachDashboard() {
  const [topTab, setTopTab] = useState<"per-athlete" | "group">("per-athlete");

  return (
    <CoachLayout>
      <div className="p-6 space-y-6">
        {/* Top-level Tabs */}
        <div className="flex gap-1 border-b border-border pb-0">
          <button
            onClick={() => setTopTab("per-athlete")}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all -mb-px border-b-2 ${
              topTab === "per-athlete"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Per Athlete
          </button>
          <button
            onClick={() => setTopTab("group")}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all -mb-px border-b-2 ${
              topTab === "group"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Group View
          </button>
        </div>

        {/* Tab Content */}
        {topTab === "per-athlete" ? (
          <PerAthleteView />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="text-4xl">🏗️</div>
            <h3 className="text-xl font-semibold text-foreground">
              Coming Soon
            </h3>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Group View will let you compare all athletes side-by-side. Stay
              tuned!
            </p>
          </div>
        )}
      </div>
    </CoachLayout>
  );
}
