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
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
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

// ─── Group View mock data ────────────────────────────────────────────────────
// Hardcoded z-scores per athlete per test (chronZ, bioZ)
type ZScore = { chronZ: number; bioZ: number };
const mockZScores: Record<string, Record<string, ZScore>> = {
  a1: {
    "10m Sprint":     { chronZ: -0.8, bioZ:  1.2 },
    "30m Sprint":     { chronZ: -0.7, bioZ:  1.0 },
    "Vertical Jump":  { chronZ: -0.5, bioZ:  1.4 },
    "Broad Jump":     { chronZ: -0.6, bioZ:  1.1 },
    "Grip Right":     { chronZ: -0.4, bioZ:  0.9 },
    "Yo-Yo Test":     { chronZ: -0.9, bioZ:  1.3 },
    "5-10-5":         { chronZ: -0.8, bioZ:  1.1 },
    "T-Test":         { chronZ: -0.7, bioZ:  1.0 },
    "Push-Ups":       { chronZ: -0.5, bioZ:  0.8 },
    "Beep Test":      { chronZ: -0.8, bioZ:  1.2 },
    "Grip Left":      { chronZ: -0.4, bioZ:  1.0 },
  },
  a2: {
    "10m Sprint":     { chronZ:  0.9, bioZ:  1.5 },
    "30m Sprint":     { chronZ:  0.8, bioZ:  1.3 },
    "Vertical Jump":  { chronZ:  1.0, bioZ:  1.6 },
    "Broad Jump":     { chronZ:  0.9, bioZ:  1.4 },
    "Grip Right":     { chronZ:  0.7, bioZ:  1.2 },
    "Yo-Yo Test":     { chronZ:  0.8, bioZ:  1.5 },
    "5-10-5":         { chronZ:  0.9, bioZ:  1.4 },
    "T-Test":         { chronZ:  0.8, bioZ:  1.3 },
    "Push-Ups":       { chronZ:  0.7, bioZ:  1.1 },
    "Beep Test":      { chronZ:  0.9, bioZ:  1.4 },
    "Grip Left":      { chronZ:  0.6, bioZ:  1.0 },
  },
  a4: {
    "10m Sprint":     { chronZ:  1.4, bioZ: -0.6 },
    "30m Sprint":     { chronZ:  1.3, bioZ: -0.5 },
    "Vertical Jump":  { chronZ:  1.5, bioZ: -0.7 },
    "Broad Jump":     { chronZ:  1.4, bioZ: -0.6 },
    "Grip Right":     { chronZ:  1.2, bioZ: -0.4 },
    "Yo-Yo Test":     { chronZ:  1.3, bioZ: -0.5 },
    "5-10-5":         { chronZ:  1.4, bioZ: -0.6 },
    "T-Test":         { chronZ:  1.3, bioZ: -0.7 },
    "Push-Ups":       { chronZ:  1.1, bioZ: -0.5 },
    "Beep Test":      { chronZ:  1.4, bioZ: -0.6 },
    "Grip Left":      { chronZ:  1.2, bioZ: -0.5 },
  },
  a5: {
    "10m Sprint":     { chronZ:  0.7, bioZ:  0.8 },
    "30m Sprint":     { chronZ:  0.6, bioZ:  0.7 },
    "Vertical Jump":  { chronZ:  0.8, bioZ:  0.9 },
    "Broad Jump":     { chronZ:  0.7, bioZ:  0.8 },
    "Grip Right":     { chronZ:  0.5, bioZ:  0.7 },
    "Yo-Yo Test":     { chronZ:  0.6, bioZ:  0.9 },
    "5-10-5":         { chronZ:  0.7, bioZ:  0.8 },
    "T-Test":         { chronZ:  0.6, bioZ:  0.7 },
    "Push-Ups":       { chronZ:  0.5, bioZ:  0.6 },
    "Beep Test":      { chronZ:  0.7, bioZ:  0.8 },
    "Grip Left":      { chronZ:  0.4, bioZ:  0.6 },
  },
  a7: {
    "10m Sprint":     { chronZ: -1.2, bioZ:  0.9 },
    "30m Sprint":     { chronZ: -1.1, bioZ:  0.8 },
    "Vertical Jump":  { chronZ: -1.3, bioZ:  1.0 },
    "Broad Jump":     { chronZ: -1.2, bioZ:  0.9 },
    "Grip Right":     { chronZ: -1.0, bioZ:  0.7 },
    "Yo-Yo Test":     { chronZ: -1.1, bioZ:  0.9 },
    "5-10-5":         { chronZ: -1.2, bioZ:  0.8 },
    "T-Test":         { chronZ: -1.1, bioZ:  0.9 },
    "Push-Ups":       { chronZ: -1.0, bioZ:  0.6 },
    "Beep Test":      { chronZ: -1.2, bioZ:  0.8 },
    "Grip Left":      { chronZ: -0.9, bioZ:  0.7 },
  },
  a8: {
    "10m Sprint":     { chronZ: -0.5, bioZ: -1.1 },
    "30m Sprint":     { chronZ: -0.4, bioZ: -1.0 },
    "Vertical Jump":  { chronZ: -0.6, bioZ: -1.2 },
    "Broad Jump":     { chronZ: -0.5, bioZ: -1.1 },
    "Grip Right":     { chronZ: -0.3, bioZ: -0.9 },
    "Yo-Yo Test":     { chronZ: -0.5, bioZ: -1.1 },
    "5-10-5":         { chronZ: -0.4, bioZ: -1.0 },
    "T-Test":         { chronZ: -0.5, bioZ: -1.1 },
    "Push-Ups":       { chronZ: -0.3, bioZ: -0.8 },
    "Beep Test":      { chronZ: -0.5, bioZ: -1.0 },
    "Grip Left":      { chronZ: -0.4, bioZ: -0.9 },
  },
  a9: {
    "10m Sprint":     { chronZ: -0.3, bioZ: -0.7 },
    "30m Sprint":     { chronZ: -0.2, bioZ: -0.6 },
    "Vertical Jump":  { chronZ: -0.4, bioZ: -0.8 },
    "Broad Jump":     { chronZ: -0.3, bioZ: -0.7 },
    "Grip Right":     { chronZ: -0.2, bioZ: -0.6 },
    "Yo-Yo Test":     { chronZ: -0.3, bioZ: -0.7 },
    "5-10-5":         { chronZ: -0.2, bioZ: -0.6 },
    "T-Test":         { chronZ: -0.3, bioZ: -0.7 },
    "Push-Ups":       { chronZ: -0.1, bioZ: -0.5 },
    "Beep Test":      { chronZ: -0.3, bioZ: -0.6 },
    "Grip Left":      { chronZ: -0.2, bioZ: -0.5 },
  },
  a10: {
    "10m Sprint":     { chronZ:  1.1, bioZ: -1.3 },
    "30m Sprint":     { chronZ:  1.0, bioZ: -1.2 },
    "Vertical Jump":  { chronZ:  1.2, bioZ: -1.4 },
    "Broad Jump":     { chronZ:  1.1, bioZ: -1.3 },
    "Grip Right":     { chronZ:  0.9, bioZ: -1.1 },
    "Yo-Yo Test":     { chronZ:  1.0, bioZ: -1.2 },
    "5-10-5":         { chronZ:  1.1, bioZ: -1.3 },
    "T-Test":         { chronZ:  1.0, bioZ: -1.2 },
    "Push-Ups":       { chronZ:  0.8, bioZ: -1.0 },
    "Beep Test":      { chronZ:  1.1, bioZ: -1.2 },
    "Grip Left":      { chronZ:  0.9, bioZ: -1.1 },
  },
  // U12s athletes (fallback z-scores)
  a3: {
    "10m Sprint":     { chronZ: -0.6, bioZ: -0.3 },
    "30m Sprint":     { chronZ: -0.5, bioZ: -0.2 },
    "Vertical Jump":  { chronZ: -0.7, bioZ: -0.4 },
    "Broad Jump":     { chronZ: -0.6, bioZ: -0.3 },
    "Grip Right":     { chronZ: -0.4, bioZ: -0.2 },
    "Yo-Yo Test":     { chronZ: -0.6, bioZ: -0.3 },
    "5-10-5":         { chronZ: -0.5, bioZ: -0.2 },
    "T-Test":         { chronZ: -0.6, bioZ: -0.3 },
    "Push-Ups":       { chronZ: -0.3, bioZ: -0.2 },
    "Beep Test":      { chronZ: -0.6, bioZ: -0.3 },
    "Grip Left":      { chronZ: -0.4, bioZ: -0.3 },
  },
  a6: {
    "10m Sprint":     { chronZ:  0.4, bioZ:  0.5 },
    "30m Sprint":     { chronZ:  0.3, bioZ:  0.4 },
    "Vertical Jump":  { chronZ:  0.5, bioZ:  0.6 },
    "Broad Jump":     { chronZ:  0.4, bioZ:  0.5 },
    "Grip Right":     { chronZ:  0.3, bioZ:  0.4 },
    "Yo-Yo Test":     { chronZ:  0.4, bioZ:  0.5 },
    "5-10-5":         { chronZ:  0.3, bioZ:  0.4 },
    "T-Test":         { chronZ:  0.4, bioZ:  0.5 },
    "Push-Ups":       { chronZ:  0.2, bioZ:  0.3 },
    "Beep Test":      { chronZ:  0.4, bioZ:  0.5 },
    "Grip Left":      { chronZ:  0.3, bioZ:  0.4 },
  },
};

const PHV_COLORS: Record<string, string> = {
  "Pre-PHV":  "#ef4444",
  "In-PHV":   "#f59e0b",
  "Post-PHV": "#22c55e",
};

type QuadrantLabel = "Hidden Talent" | "Talent" | "Weak Performer" | "Maturation Spike";

function getQuadrant(chronZ: number, bioZ: number): QuadrantLabel {
  if (chronZ < 0 && bioZ >= 0) return "Hidden Talent";
  if (chronZ >= 0 && bioZ >= 0) return "Talent";
  if (chronZ < 0 && bioZ < 0)  return "Weak Performer";
  return "Maturation Spike";
}

const QUADRANT_STYLES: Record<QuadrantLabel, { emoji: string; bg: string; text: string }> = {
  "Hidden Talent":    { emoji: "🟡", bg: "bg-yellow-500/15", text: "text-yellow-400" },
  "Talent":           { emoji: "🟢", bg: "bg-green-500/15",  text: "text-green-400" },
  "Weak Performer":   { emoji: "🔴", bg: "bg-red-500/15",    text: "text-red-400" },
  "Maturation Spike": { emoji: "🟠", bg: "bg-orange-500/15", text: "text-orange-400" },
};

// Collect all test names that have z-score data
const ALL_TESTS = Object.keys(testCategories).flatMap(
  (cat) => (testCategories as Record<string, { name: string; unit: string }[]>)[cat].map((t) => t.name)
).filter((t) => !["Height","Weight","Wingspan","Sitting Height"].includes(t));

// Custom scatter dot
function ScatterDot(props: {
  cx?: number; cy?: number; payload?: {
    name: string; phvStatus: string; chronZ: number; bioZ: number;
  };
}) {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload) return null;
  const color = PHV_COLORS[payload.phvStatus] ?? "#94a3b8";
  return (
    <circle cx={cx} cy={cy} r={7} fill={color} fillOpacity={0.85} stroke="white" strokeWidth={1.5} />
  );
}

// Custom scatter tooltip
function ScatterTooltipContent({ active, payload }: {
  active?: boolean;
  payload?: { payload: { name: string; chronZ: number; bioZ: number; phvStatus: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg space-y-1">
      <p className="font-semibold text-foreground">{d.name}</p>
      <p className="text-muted-foreground">Chron Z: <span className="text-foreground font-medium">{d.chronZ.toFixed(2)}</span></p>
      <p className="text-muted-foreground">Bio Z: <span className="text-foreground font-medium">{d.bioZ.toFixed(2)}</span></p>
      <p className="text-muted-foreground">PHV: <span style={{ color: PHV_COLORS[d.phvStatus] }} className="font-medium">{d.phvStatus}</span></p>
    </div>
  );
}

// Custom bar tooltip
function BarTooltipContent({ active, payload }: {
  active?: boolean;
  payload?: { payload: { name: string; value: number; unit: string; phvStatus: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg space-y-1">
      <p className="font-semibold text-foreground">{d.name}</p>
      <p className="text-muted-foreground">Result: <span className="text-foreground font-medium">{d.value} {d.unit}</span></p>
      <p className="text-muted-foreground">PHV: <span style={{ color: PHV_COLORS[d.phvStatus] }} className="font-medium">{d.phvStatus}</span></p>
    </div>
  );
}

// ─── Group View ──────────────────────────────────────────────────────────────
function GroupView() {
  const { selectedGroupId, getGroupAthletes } = useGroup();
  const athletes = getGroupAthletes(selectedGroupId);

  // Section 1 test selector (independent of filters)
  const [quadrantTest, setQuadrantTest] = useState(ALL_TESTS[0]);

  // Filters bar state
  const [filterTest, setFilterTest]       = useState(ALL_TESTS[0]);
  const [phvFilter, setPhvFilter]         = useState<string[]>(["Pre-PHV", "In-PHV", "Post-PHV"]);
  const [sortBy, setSortBy]               = useState<"chronologicalAge" | "biologicalAge" | "result">("chronologicalAge");
  const [viewMode, setViewMode]           = useState<"graph" | "table">("graph");
  const [tableSortKey, setTableSortKey]   = useState<string>("name");
  const [tableSortDir, setTableSortDir]   = useState<1 | -1>(1);

  // Build per-athlete result lookup from most recent session
  const latestResults = useMemo(() => {
    const map: Record<string, Record<string, { value: number; unit: string }>> = {};
    const sessions = mockTestSessions
      .filter((s) => s.groupId === selectedGroupId)
      .sort((a, b) => b.date.localeCompare(a.date));
    for (const session of sessions) {
      for (const r of session.results) {
        if (!map[r.athleteId]) map[r.athleteId] = {};
        if (!map[r.athleteId][r.testName]) {
          const numVal = typeof r.value === "number" ? r.value : parseFloat(String(r.value));
          map[r.athleteId][r.testName] = { value: numVal, unit: r.unit };
        }
      }
    }
    // Anthropometrics from athlete object
    for (const a of athletes) {
      if (!map[a.id]) map[a.id] = {};
      map[a.id]["Height"]         ??= { value: a.height,        unit: "cm" };
      map[a.id]["Weight"]         ??= { value: a.weight,        unit: "kg" };
      map[a.id]["Wingspan"]       ??= { value: a.wingspan,      unit: "cm" };
      map[a.id]["Sitting Height"] ??= { value: a.sittingHeight, unit: "cm" };
    }
    return map;
  }, [athletes, selectedGroupId]);

  // Section 1 — scatter data
  const scatterData = useMemo(() =>
    athletes.map((a) => {
      const z = mockZScores[a.id]?.[quadrantTest] ?? { chronZ: 0, bioZ: 0 };
      return { name: a.name, phvStatus: a.phvStatus, chronZ: z.chronZ, bioZ: z.bioZ };
    }),
    [athletes, quadrantTest]
  );

  // Get unit for selected filter test
  const filterTestUnit = useMemo(() => {
    for (const tests of Object.values(testCategories)) {
      const t = (tests as { name: string; unit: string }[]).find((t) => t.name === filterTest);
      if (t) return t.unit;
    }
    return "";
  }, [filterTest]);

  // Filtered + sorted athlete rows
  const filteredAthletes = useMemo(() => {
    let list = athletes.filter((a) => phvFilter.includes(a.phvStatus));

    list = [...list].sort((a, b) => {
      if (sortBy === "chronologicalAge") return a.chronologicalAge - b.chronologicalAge;
      if (sortBy === "biologicalAge")    return a.biologicalAge    - b.biologicalAge;
      if (sortBy === "result") {
        const av = latestResults[a.id]?.[filterTest]?.value ?? 0;
        const bv = latestResults[b.id]?.[filterTest]?.value ?? 0;
        return av - bv;
      }
      return 0;
    });
    return list;
  }, [athletes, phvFilter, sortBy, filterTest, latestResults]);

  // Bar chart data
  const barData = useMemo(() =>
    filteredAthletes.map((a) => ({
      name: a.name,
      value: latestResults[a.id]?.[filterTest]?.value ?? 0,
      unit: filterTestUnit,
      phvStatus: a.phvStatus,
    })),
    [filteredAthletes, filterTest, filterTestUnit, latestResults]
  );

  const groupAvg = barData.length
    ? barData.reduce((s, d) => s + d.value, 0) / barData.length
    : 0;

  // Table rows
  const tableRows = useMemo(() => {
    let rows = filteredAthletes.map((a) => {
      const res  = latestResults[a.id]?.[filterTest];
      const val  = res?.value ?? 0;
      const unit = res?.unit ?? filterTestUnit;
      const z    = mockZScores[a.id]?.[filterTest] ?? { chronZ: 0, bioZ: 0 };
      const quad = getQuadrant(z.chronZ, z.bioZ);
      const bmStatus = getBenchmarkStatus(filterTest, val);
      return { athlete: a, val, unit, chronZ: z.chronZ, bioZ: z.bioZ, quad, bmStatus };
    });
    rows = [...rows].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      switch (tableSortKey) {
        case "name":              av = a.athlete.name; bv = b.athlete.name; break;
        case "chronologicalAge":  av = a.athlete.chronologicalAge; bv = b.athlete.chronologicalAge; break;
        case "biologicalAge":     av = a.athlete.biologicalAge; bv = b.athlete.biologicalAge; break;
        case "phvStatus":         av = a.athlete.phvStatus; bv = b.athlete.phvStatus; break;
        case "val":               av = a.val; bv = b.val; break;
        case "chronZ":            av = a.chronZ; bv = b.chronZ; break;
        case "bioZ":              av = a.bioZ; bv = b.bioZ; break;
        case "quad":              av = a.quad; bv = b.quad; break;
        default: break;
      }
      if (typeof av === "string") return av.localeCompare(bv as string) * tableSortDir;
      return ((av as number) - (bv as number)) * tableSortDir;
    });
    return rows;
  }, [filteredAthletes, filterTest, filterTestUnit, latestResults, tableSortKey, tableSortDir]);

  function handleTableSort(key: string) {
    if (tableSortKey === key) setTableSortDir((d) => (d === 1 ? -1 : 1));
    else { setTableSortKey(key); setTableSortDir(1); }
  }

  function SortIcon({ col }: { col: string }) {
    if (tableSortKey !== col) return <span className="text-muted-foreground/40 ml-1">↕</span>;
    return <span className="text-primary ml-1">{tableSortDir === 1 ? "↑" : "↓"}</span>;
  }

  const togglePhv = (status: string) =>
    setPhvFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );

  if (athletes.length === 0) {
    return <div className="text-center py-16 text-muted-foreground">No athletes in this group.</div>;
  }

  return (
    <div className="space-y-8">
      {/* ── SECTION 1: Talent Quadrant Chart ─────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">Talent Quadrant</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Test:</span>
            <Select value={quadrantTest} onValueChange={setQuadrantTest}>
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_TESTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart with absolute quadrant labels */}
        <div className="relative h-80">
          {/* Quadrant corner labels — positioned to sit inside each quadrant */}
          <div className="absolute inset-0 pointer-events-none z-10 pl-[52px] pb-[32px]">
            <div className="relative w-full h-full">
              <span className="absolute top-2 left-2 text-xs font-semibold text-yellow-400 opacity-70">🟡 Hidden Talent</span>
              <span className="absolute top-2 right-2 text-xs font-semibold text-green-400 opacity-70">🟢 Talent</span>
              <span className="absolute bottom-2 left-2 text-xs font-semibold text-red-400 opacity-70">🔴 Weak Performer</span>
              <span className="absolute bottom-2 right-2 text-xs font-semibold text-orange-400 opacity-70">🟠 Maturation Spike</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
              <XAxis
                type="number"
                dataKey="chronZ"
                name="Chron Z-Score"
                domain={[-2, 2]}
                tickCount={9}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                label={{ value: "Chronological Z-Score", position: "insideBottom", offset: -10, fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                type="number"
                dataKey="bioZ"
                name="Bioband Z-Score"
                domain={[-2, 2]}
                tickCount={9}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                label={{ value: "Bioband Z-Score", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <ZAxis range={[60, 60]} />
              <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={1.5} strokeDasharray="4 4" />
              <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1.5} strokeDasharray="4 4" />
              <Tooltip content={<ScatterTooltipContent />} />
              <Scatter data={scatterData} shape={<ScatterDot />} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* PHV Legend */}
        <div className="flex flex-wrap gap-4 pt-1">
          {Object.entries(PHV_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
              <span className="text-xs text-muted-foreground">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: Filters Bar ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Filter by Test */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Filter by Test</label>
            <Select value={filterTest} onValueChange={setFilterTest}>
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_TESTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter by PHV Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">PHV Status</label>
            <div className="flex gap-2">
              {(["Pre-PHV", "In-PHV", "Post-PHV"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => togglePhv(s)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                    phvFilter.includes(s)
                      ? "border-transparent text-white"
                      : "border-border bg-transparent text-muted-foreground"
                  }`}
                  style={phvFilter.includes(s) ? { backgroundColor: PHV_COLORS[s] } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sort by */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Sort by</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chronologicalAge">Chronological Age</SelectItem>
                <SelectItem value="biologicalAge">Biological Age</SelectItem>
                <SelectItem value="result">Result Value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="space-y-1.5 ml-auto">
            <label className="text-xs font-medium text-muted-foreground">View</label>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("graph")}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-all ${
                  viewMode === "graph"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Graph View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3 / 4: Graph or Table ─────────────────────────────────── */}
      {viewMode === "graph" ? (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              {filterTest}
              <span className="text-muted-foreground text-sm font-normal ml-1">({filterTestUnit})</span>
            </h2>
            <span className="text-xs text-muted-foreground">
              Avg: <span className="text-foreground font-medium">{groupAvg.toFixed(2)} {filterTestUnit}</span>
            </span>
          </div>

          {barData.filter((d) => d.value > 0).length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">No data for this test in the selected group.</p>
          ) : (
            <div style={{ height: Math.max(220, filteredAthletes.length * 44) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="opacity-10" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip content={<BarTooltipContent />} />
                  <ReferenceLine
                    x={groupAvg}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="5 3"
                    strokeWidth={1.5}
                    label={{ value: "Avg", position: "top", fontSize: 10, fill: "hsl(var(--primary))" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((d, i) => (
                      <Cell key={i} fill={PHV_COLORS[d.phvStatus] ?? "#94a3b8"} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ) : (
        /* ── TABLE VIEW ──────────────────────────────────────────────────── */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {[
                  { key: "name",             label: "Athlete" },
                  { key: "chronologicalAge", label: "Chron Age" },
                  { key: "biologicalAge",    label: "Bio Age" },
                  { key: "phvStatus",        label: "PHV Status" },
                  { key: "val",              label: filterTest },
                  { key: "unit",             label: "Unit" },
                  { key: "benchmark",        label: "Benchmark" },
                  { key: "chronZ",           label: "Chron Z" },
                  { key: "bioZ",             label: "Bio Z" },
                  { key: "quad",             label: "Quadrant" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => key !== "unit" && key !== "benchmark" && handleTableSort(key)}
                    className={`px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap ${
                      key !== "unit" && key !== "benchmark" ? "cursor-pointer hover:text-foreground" : ""
                    }`}
                  >
                    {label}
                    {key !== "unit" && key !== "benchmark" && <SortIcon col={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                    No athletes match the current filters.
                  </td>
                </tr>
              )}
              {tableRows.map(({ athlete, val, unit, chronZ, bioZ, quad, bmStatus }) => {
                const qStyle = QUADRANT_STYLES[quad];
                return (
                  <tr key={athlete.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    {/* Athlete */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={athlete.photo}
                          alt={athlete.name}
                          className="w-7 h-7 rounded-full bg-muted flex-shrink-0"
                        />
                        <span className="text-foreground font-medium">{athlete.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-foreground">{athlete.chronologicalAge.toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-foreground">{athlete.biologicalAge.toFixed(1)}</td>
                    {/* PHV Badge */}
                    <td className="px-3 py-2.5">
                      <span
                        className="inline-block text-xs px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ backgroundColor: PHV_COLORS[athlete.phvStatus] }}
                      >
                        {athlete.phvStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-foreground">
                      {val > 0 ? val : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{unit}</td>
                    {/* Benchmark */}
                    <td className="px-3 py-2.5">
                      {val > 0 && bmStatus ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            {benchmarks[filterTest]?.value} {unit}
                          </span>
                          <BenchmarkTag status={bmStatus} />
                        </div>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-foreground font-mono text-xs">{chronZ.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-foreground font-mono text-xs">{bioZ.toFixed(2)}</td>
                    {/* Quadrant */}
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${qStyle.bg} ${qStyle.text}`}>
                        {qStyle.emoji} {quad}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
          <GroupView />
        )}
      </div>
    </CoachLayout>
  );
}
