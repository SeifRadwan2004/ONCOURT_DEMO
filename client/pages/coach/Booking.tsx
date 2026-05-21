import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { useGroup } from "@/contexts/GroupContext";
import { testCategories } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronDown,
  ChevronRight,
  MapPin,
  ClipboardList,
  Users,
  Clock,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Tag definitions ──────────────────────────────────────────────────────────
// "Above 13" tag applies to bundles / tests recommended for athletes over 13
const ABOVE_13_BUNDLES = ["Speed", "Agility", "Power", "Endurance", "Strength"];
const ABOVE_13_TESTS = [
  "30m Sprint", "5-10-5", "T-Test", "Broad Jump",
  "Yo-Yo Test", "Beep Test", "Grip Left", "Grip Right", "Push-Ups",
];

function Above13Tag() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-medium border border-blue-500/20">
      <Tag className="w-2.5 h-2.5" />
      Above 13
    </span>
  );
}

// ─── Time options ─────────────────────────────────────────────────────────────
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 20; h++) {
  ["00", "30"].forEach((m) => {
    const label = `${h.toString().padStart(2, "0")}:${m}`;
    TIME_OPTIONS.push(label);
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
type SelectedTests = Record<string, Set<string>>; // category → Set of test names

export default function CoachBooking() {
  const { groups } = useGroup();

  // Form state
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [date, setDate]                       = useState<Date | undefined>();
  const [time, setTime]                       = useState<string>("");
  const [location, setLocation]               = useState<string>("");
  const [comments, setComments]               = useState<string>("");
  const [selectedTests, setSelectedTests]     = useState<SelectedTests>({});
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted]             = useState(false);

  // Derived
  const categories = Object.entries(testCategories) as [
    string,
    { name: string; unit: string }[]
  ][];

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const allSelectedTests = Object.entries(selectedTests).flatMap(([cat, tests]) =>
    Array.from(tests).map((t) => ({ category: cat, name: t }))
  );

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function toggleBundle(category: string, tests: { name: string }[]) {
    setSelectedTests((prev) => {
      const next = { ...prev };
      const current = next[category];
      const allNames = tests.map((t) => t.name);
      const allSelected = current && allNames.every((n) => current.has(n));
      if (allSelected) {
        const s = new Set(current);
        allNames.forEach((n) => s.delete(n));
        next[category] = s;
      } else {
        next[category] = new Set(allNames);
      }
      return next;
    });
  }

  function toggleTest(category: string, testName: string) {
    setSelectedTests((prev) => {
      const s = new Set(prev[category] ?? []);
      if (s.has(testName)) s.delete(testName);
      else s.add(testName);
      return { ...prev, [category]: s };
    });
  }

  function isBundleFullySelected(category: string, tests: { name: string }[]) {
    const s = selectedTests[category];
    return !!s && tests.every((t) => s.has(t.name));
  }

  function isBundlePartiallySelected(category: string, tests: { name: string }[]) {
    const s = selectedTests[category];
    if (!s) return false;
    const names = tests.map((t) => t.name);
    const count = names.filter((n) => s.has(n)).length;
    return count > 0 && count < names.length;
  }

  function toggleExpand(category: string) {
    setExpandedBundles((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function reset() {
    setSelectedGroupId("");
    setDate(undefined);
    setTime("");
    setLocation("");
    setComments("");
    setSelectedTests({});
    setExpandedBundles(new Set());
    setSubmitted(false);
  }

  // ─── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <CoachLayout>
        <div className="flex items-center justify-center min-h-full p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Test Day Booked!</h2>
            <p className="text-muted-foreground text-sm">
              Your test day for <span className="text-foreground font-medium">{selectedGroup?.name}</span> on{" "}
              <span className="text-foreground font-medium">
                {date ? format(date, "PPP") : ""} at {time}
              </span>{" "}
              has been scheduled.
            </p>
            <button
              onClick={reset}
              className="mt-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Book Another
            </button>
          </div>
        </div>
      </CoachLayout>
    );
  }

  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Book Test Day</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Schedule a new test day for your group
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            {/* ── LEFT COLUMN — Form ─────────────────────────────────────────── */}
            <div className="flex-1 space-y-5 min-w-0">

              {/* Group Selector */}
              <Section icon={<Users className="w-4 h-4" />} title="Group">
                <Select value={selectedGroupId} onValueChange={setSelectedGroupId} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a group folder…" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({g.athleteIds.length} athletes)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Section>

              {/* Date & Time */}
              <Section icon={<CalendarIcon className="w-4 h-4" />} title="Date & Time">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Date picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm transition hover:border-primary/50",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 shrink-0" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Time picker */}
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger className="sm:w-36">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Time" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Section>

              {/* Location */}
              <Section icon={<MapPin className="w-4 h-4" />} title="Location">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Zayed Sports City, Field 3"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </Section>

              {/* Test Battery */}
              <Section icon={<ClipboardList className="w-4 h-4" />} title="Test Battery">
                <p className="text-xs text-muted-foreground mb-3">
                  Select entire bundles or pick individual tests. Tags indicate age recommendations.
                </p>
                <div className="space-y-2">
                  {categories.map(([category, tests]) => {
                    const isExpanded     = expandedBundles.has(category);
                    const fullSelected   = isBundleFullySelected(category, tests);
                    const partialSelected = isBundlePartiallySelected(category, tests);
                    const hasAbove13Bundle = ABOVE_13_BUNDLES.includes(category);

                    return (
                      <div
                        key={category}
                        className={cn(
                          "rounded-xl border transition-all",
                          fullSelected
                            ? "border-primary/50 bg-primary/5"
                            : partialSelected
                            ? "border-primary/30 bg-primary/3"
                            : "border-border bg-card"
                        )}
                      >
                        {/* Bundle Header */}
                        <div className="flex items-center gap-3 px-4 py-3">
                          {/* Bundle checkbox */}
                          <Checkbox
                            checked={fullSelected ? true : partialSelected ? "indeterminate" : false}
                            onCheckedChange={() => toggleBundle(category, tests)}
                          />

                          {/* Expand/collapse */}
                          <button
                            type="button"
                            className="flex-1 flex items-center gap-2 text-left"
                            onClick={() => toggleExpand(category)}
                          >
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                              : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            }
                            <span className="text-sm font-semibold text-foreground">
                              {category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({tests.length} tests)
                            </span>
                            {hasAbove13Bundle && (
                              <span className="ml-1"><Above13Tag /></span>
                            )}
                            {(fullSelected || partialSelected) && (
                              <span className="ml-auto text-xs text-primary font-medium">
                                {Array.from(selectedTests[category] ?? []).length}/{tests.length} selected
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Individual Tests */}
                        {isExpanded && (
                          <div className="border-t border-border divide-y divide-border">
                            {tests.map((test) => {
                              const isSelected = selectedTests[category]?.has(test.name) ?? false;
                              const hasAbove13Test = ABOVE_13_TESTS.includes(test.name);
                              return (
                                <label
                                  key={test.name}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                                    isSelected ? "bg-primary/5" : "hover:bg-muted/40"
                                  )}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleTest(category, test.name)}
                                  />
                                  <span className="flex-1 text-sm text-foreground">
                                    {test.name}
                                    <span className="text-xs text-muted-foreground ml-1.5">
                                      ({test.unit})
                                    </span>
                                  </span>
                                  {hasAbove13Test && <Above13Tag />}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Additional Comments */}
              <Section icon={<ClipboardList className="w-4 h-4" />} title="Additional Comments">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Any notes for this test day… (optional)"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </Section>

              {/* Submit */}
              <button
                type="submit"
                disabled={!selectedGroupId || !date || !time || !location || allSelectedTests.length === 0}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </div>

            {/* ── RIGHT COLUMN — Summary Sidebar ──────────────────────────── */}
            <div className="xl:w-80 w-full xl:sticky xl:top-6">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <h2 className="text-sm font-semibold text-foreground">Booking Summary</h2>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Group */}
                  <SummaryRow
                    icon={<Users className="w-4 h-4" />}
                    label="Group"
                    value={selectedGroup?.name ?? "—"}
                    empty={!selectedGroup}
                  />

                  {/* Date & time */}
                  <SummaryRow
                    icon={<CalendarIcon className="w-4 h-4" />}
                    label="Date & Time"
                    value={date && time ? `${format(date, "PP")} · ${time}` : date ? format(date, "PP") : time || "—"}
                    empty={!date && !time}
                  />

                  {/* Location */}
                  <SummaryRow
                    icon={<MapPin className="w-4 h-4" />}
                    label="Location"
                    value={location || "—"}
                    empty={!location}
                  />

                  {/* Tests */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Tests
                      </span>
                      {allSelectedTests.length > 0 && (
                        <span className="ml-auto text-xs font-semibold text-primary">
                          {allSelectedTests.length} selected
                        </span>
                      )}
                    </div>

                    {allSelectedTests.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic pl-6">
                        No tests selected
                      </p>
                    ) : (
                      <div className="pl-6 space-y-2">
                        {Object.entries(
                          allSelectedTests.reduce<Record<string, string[]>>((acc, t) => {
                            if (!acc[t.category]) acc[t.category] = [];
                            acc[t.category].push(t.name);
                            return acc;
                          }, {})
                        ).map(([cat, names]) => (
                          <div key={cat}>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              {cat}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {names.map((n) => (
                                <span
                                  key={n}
                                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                                >
                                  {n}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completeness indicator */}
                <div className="px-5 py-3 border-t border-border bg-muted/20">
                  {[
                    { label: "Group",    done: !!selectedGroupId },
                    { label: "Date",     done: !!date },
                    { label: "Time",     done: !!time },
                    { label: "Location", done: !!location },
                    { label: "Tests",    done: allSelectedTests.length > 0 },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2 py-0.5">
                      <span className={cn("w-1.5 h-1.5 rounded-full", done ? "bg-green-400" : "bg-muted-foreground/30")} />
                      <span className={cn("text-xs", done ? "text-foreground" : "text-muted-foreground")}>
                        {label}
                      </span>
                      {done && <span className="ml-auto text-green-400 text-xs">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </CoachLayout>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  empty,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  empty: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={cn("text-sm pl-6", empty ? "text-muted-foreground italic" : "text-foreground font-medium")}>
        {value}
      </p>
    </div>
  );
}
