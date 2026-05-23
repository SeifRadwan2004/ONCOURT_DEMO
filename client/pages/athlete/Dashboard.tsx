import { useState } from "react";
import { AthleteLayout } from "@/components/AthleteLayout";
import { Button } from "@/components/ui/button";
import { mockAthletes, mockTestSessions } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function AthleteDashboard() {
  const athleteId = "a1";
  const athlete = mockAthletes.find((a) => a.id === athleteId);

  const [selectedTestName, setSelectedTestName] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "tabular">("card");

  if (!athlete) {
    return (
      <AthleteLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Athlete not found</p>
        </div>
      </AthleteLayout>
    );
  }

  const athleteTestResults = mockTestSessions.flatMap((session) =>
    session.results
      .filter((r) => r.athleteId === athleteId)
      .map((r) => ({ ...r, sessionId: session.id, sessionDate: session.date }))
  );

  const latestResults: Record<string, typeof athleteTestResults[0]> = {};
  athleteTestResults.forEach((result) => {
    const key = result.testName;
    if (
      !latestResults[key] ||
      new Date(result.date) > new Date(latestResults[key].date)
    ) {
      latestResults[key] = result;
    }
  });

  const radarData = [
    {
      name: "Speed",
      value:
        100 -
        (((latestResults["10m Sprint"]?.value as number) || 0) * 100) / 2,
      fullMark: 100,
    },
    {
      name: "COD",
      value: 100 - (((latestResults["5-10-5"]?.value as number) || 0) * 100) / 8,
      fullMark: 100,
    },
    {
      name: "Agility",
      value: 100 - (((latestResults["T-Test"]?.value as number) || 0) * 100) / 10,
      fullMark: 100,
    },
    {
      name: "Explosiveness",
      value: ((latestResults["Vertical Jump"]?.value as number) || 0) * 2,
      fullMark: 100,
    },
    {
      name: "Strength",
      value: ((latestResults["Grip Right"]?.value as number) || 0) * 1.5,
      fullMark: 100,
    },
    {
      name: "Endurance",
      value: ((latestResults["Yo-Yo Test"]?.value as number) || 0) * 10,
      fullMark: 100,
    },
  ];

  const testHistory = selectedTestName
    ? athleteTestResults
        .filter((r) => r.testName === selectedTestName)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const sessions = mockTestSessions.filter((s) =>
    s.results.some((r) => r.athleteId === athleteId)
  );

  const filteredResults = selectedSession
    ? athleteTestResults.filter((r) => r.sessionId === selectedSession)
    : athleteTestResults;

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const age = calculateAge(athlete.dateOfBirth);

  return (
    <AthleteLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Athlete Profile</h1>
          <p className="text-muted-foreground">Your performance and anthropometric data</p>
        </div>

        {/* Athlete Info and Performance Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-card rounded-lg p-6 shadow-xl border border-border">
            <div className="text-center">
              <img
                src={athlete.photo}
                alt={athlete.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent"
              />
              <h2 className="text-2xl font-bold mb-1">{athlete.name}</h2>
              <div className="space-y-3 mt-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-wider">Age</p>
                  <p className="text-foreground font-semibold">
                    {age.years}y {age.months}m
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider">PHV Status</p>
                  <p className="text-foreground font-semibold">
                    {athlete.phvStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider">
                    Biological Age
                  </p>
                  <p className="text-foreground font-semibold">
                    {athlete.biologicalAge}y
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Radar Chart */}
          <div className="lg:col-span-2 bg-card rounded-lg p-6 shadow-xl border border-border">
            <h3 className="text-lg font-bold mb-6">Performance Profile</h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <PolarRadiusAxis stroke="hsl(var(--border))" />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Anthropometric Data */}
        <div className="bg-card rounded-lg p-6 shadow-xl border border-border">
          <h3 className="text-lg font-bold mb-6">Anthropometric Data</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Height
              </p>
              <p className="text-2xl font-bold text-accent">{athlete.height}</p>
              <p className="text-xs text-muted-foreground">cm</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Weight
              </p>
              <p className="text-2xl font-bold text-accent">{athlete.weight}</p>
              <p className="text-xs text-muted-foreground">kg</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Wingspan
              </p>
              <p className="text-2xl font-bold text-accent">
                {athlete.wingspan}
              </p>
              <p className="text-xs text-muted-foreground">cm</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Sitting Height
              </p>
              <p className="text-2xl font-bold text-accent">
                {athlete.sittingHeight}
              </p>
              <p className="text-xs text-muted-foreground">cm</p>
            </div>
          </div>
        </div>

        {/* Test Results - Card View or Tabular View Toggle */}
        <div className="space-y-4">
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => { setViewMode("card"); setSelectedTestName(null); }}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                viewMode === "card"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode("tabular")}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                viewMode === "tabular"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Table View
            </button>
          </div>

          {viewMode === "tabular" ? (
            /* TABLE VIEW */
            <div className="bg-card rounded-lg p-6 shadow-xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">All Test Results</h3>
                <div className="w-48">
                  <Select value={selectedSession ? selectedSession : "all"} onValueChange={(val) => setSelectedSession(val === "all" ? null : val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions</SelectItem>
                      {sessions.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          {new Date(session.date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {result.testName}
                        </TableCell>
                        <TableCell>{result.testType}</TableCell>
                        <TableCell className="text-accent font-semibold">
                          {result.value}
                        </TableCell>
                        <TableCell>{result.unit}</TableCell>
                        <TableCell>
                          {new Date(result.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTestName(result.testName)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            /* CARD VIEW */
            <div>
              <h3 className="text-lg font-bold mb-4">Latest Test Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(latestResults)
                  .slice(0, 8)
                  .map((result) => {
                    const testHistory = athleteTestResults
                      .filter((r) => r.testName === result.testName)
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    return (
                      <button
                        key={result.testName}
                        onClick={() => setSelectedTestName(result.testName)}
                        className="bg-card border border-border rounded-lg p-4 hover:border-accent hover:shadow-lg transition-all cursor-pointer text-left space-y-3 group"
                      >
                        {/* Header */}
                        <div>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                            {result.testType}
                          </p>
                          <p className="text-2xl font-bold text-accent">
                            {result.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.testName}
                          </p>
                        </div>

                        {/* Mini Chart */}
                        {testHistory.length > 0 && (
                          <div className="w-full h-12 cursor-pointer">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={testHistory}
                                margin={{ top: 2, right: 2, left: 0, bottom: 0 }}
                              >
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="hsl(var(--accent))"
                                  strokeWidth={1.5}
                                  dot={{ r: 2, fill: "hsl(var(--accent))" }}
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
                          </div>
                        )}

                        {/* Footer */}
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-accent group-hover:text-orange-400 transition-colors mt-1">
                            Tap to expand
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Test History Graph Dialog */}
        <Dialog open={!!selectedTestName} onOpenChange={() => setSelectedTestName(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedTestName} - Development Over Time
              </DialogTitle>
            </DialogHeader>
            {testHistory.length > 0 && (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={testHistory}>
                    <CartesianGrid stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                      formatter={(value: any) => [value, selectedTestName]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))" }}
                      name={selectedTestName}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Latest
                    </p>
                    <p className="text-xl font-bold text-accent">
                      {testHistory[testHistory.length - 1].value}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Highest
                    </p>
                    <p className="text-xl font-bold text-accent">
                      {Math.max(...testHistory.map((h) => h.value as number))}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Lowest
                    </p>
                    <p className="text-xl font-bold text-accent">
                      {Math.min(...testHistory.map((h) => h.value as number))}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Change
                    </p>
                    <p className="text-xl font-bold text-accent">
                      {(
                        (testHistory[testHistory.length - 1].value as number) -
                        (testHistory[0].value as number)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Detailed Table */}
                <div>
                  <h4 className="font-semibold mb-3">Detailed History</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testHistory.map((record, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {record.value}
                            </TableCell>
                            <TableCell>{record.unit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AthleteLayout>
  );
}
