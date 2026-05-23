import { useState, useMemo } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { useGroup } from "@/contexts/GroupContext";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import library data structure
const BUNDLES = ["Talent Detection", "Athlete Development", "Professional Practice"];
const SPORTS = [
  "Tennis","Squash","Padel","Table Tennis","Basketball","Volleyball","Handball",
  "Football","Sprint Swimming","Distance Swimming","Sprint Running","Distance Running",
  "Boxing","Karate","Taekwondo","Judo","Wrestling","BJJ",
  "Weightlifting","Artistic Gymnastics","Rhythmic Gymnastics","Artistic Swimming",
  "Triathlon","Pentathlon",
];
const CATEGORIES = [
  "Speed & Acceleration",
  "Change of Direction & Agility",
  "Power & Explosiveness",
  "Strength",
  "Muscular Endurance",
  "Aerobic & Anaerobic Capacity",
  "Stability, Mobility & Injury Screening",
  "Balance & Coordination",
  "Movement Literacy",
  "Reactivity & Neural Coordination",
  "Rhythm & Timing",
  "Anthropometrics",
];

// Mock test data
interface MockTest {
  name: string;
  category: string;
  sports: string[] | "all";
  unit: string;
  bundle: string;
}

const MOCK_TESTS: MockTest[] = [
  { name: "30m Sprint", category: "Speed & Acceleration", sports: ["Football", "Sprint Running", "Basketball"], unit: "s", bundle: "Talent Detection" },
  { name: "Illinois Agility Test", category: "Change of Direction & Agility", sports: ["Football", "Basketball", "Handball"], unit: "s", bundle: "Talent Detection" },
  { name: "505 Agility Test", category: "Change of Direction & Agility", sports: "all", unit: "s", bundle: "Athlete Development" },
  { name: "Countermovement Jump (CMJ)", category: "Power & Explosiveness", sports: "all", unit: "cm", bundle: "Talent Detection" },
  { name: "Standing Broad Jump", category: "Power & Explosiveness", sports: "all", unit: "cm", bundle: "Talent Detection" },
  { name: "Grip Strength", category: "Strength", sports: "all", unit: "kg", bundle: "Talent Detection" },
  { name: "1RM Back Squat", category: "Strength", sports: ["Weightlifting", "Wrestling"], unit: "kg", bundle: "Professional Practice" },
  { name: "Push-Up Endurance Test", category: "Muscular Endurance", sports: "all", unit: "reps", bundle: "Athlete Development" },
  { name: "Yo-Yo Test L1", category: "Aerobic & Anaerobic Capacity", sports: ["Football", "Basketball"], unit: "m", bundle: "Talent Detection" },
  { name: "Sit & Reach", category: "Stability, Mobility & Injury Screening", sports: "all", unit: "cm", bundle: "Athlete Development" },
  { name: "Single-Leg Balance Test", category: "Balance & Coordination", sports: ["Artistic Gymnastics", "Taekwondo"], unit: "s", bundle: "Talent Detection" },
  { name: "Simple Reaction Time", category: "Reactivity & Neural Coordination", sports: ["Boxing", "Table Tennis"], unit: "ms", bundle: "Talent Detection" },
  { name: "Anthropometric Battery", category: "Anthropometrics", sports: "all", unit: "cm/kg", bundle: "Talent Detection" },
];

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

// Outer shell — renders CoachLayout (which contains GroupProvider) then delegates
// to BookingForm which is now safely inside the GroupProvider tree.
export default function CoachBooking() {
  return (
    <CoachLayout>
      <BookingForm />
    </CoachLayout>
  );
}

function BookingForm() {
  const { groups } = useGroup();

  // Form state
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [date, setDate]                       = useState<Date | undefined>();
  const [time, setTime]                       = useState<string>("");
  const [location, setLocation]               = useState<string>("");
  const [comments, setComments]               = useState<string>("");
  const [selectedTests, setSelectedTests]     = useState<SelectedTests>({});
  const [expandedBundles, setExpandedBundles] = useState<Set<string>>(new Set());
  const [expandedSports, setExpandedSports]   = useState<Set<string>>(new Set());
  const [submitted, setSubmitted]             = useState(false);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const allSelectedTests = Object.entries(selectedTests).flatMap(([cat, tests]) =>
    Array.from(tests).map((t) => ({ category: cat, name: t }))
  );

  // Helper to get tests for a given bundle, sport, and category
  const getTests = useMemo(() => {
    return (bundle: string, sport: string, category: string): MockTest[] => {
      return MOCK_TESTS.filter(
        (t) =>
          t.bundle === bundle &&
          t.category === category &&
          (t.sports === "all" || t.sports.includes(sport))
      );
    };
  }, []);

  // Helper to get tests by category only (for Talent Detection)
  const getTestsByCategory = useMemo(() => {
    return (bundle: string, category: string): MockTest[] => {
      return MOCK_TESTS.filter((t) => t.bundle === bundle && t.category === category);
    };
  }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function toggleTest(testName: string) {
    setSelectedTests((prev) => {
      const key = `_${testName}`;
      const s = new Set(prev[key] ?? []);
      if (s.has(testName)) s.delete(testName);
      else s.add(testName);
      return { ...prev, [key]: s };
    });
  }

  function toggleBundle(bundle: string, sport: string, category: string, tests: MockTest[]) {
    setSelectedTests((prev) => {
      const key = `_${bundle}_${sport}_${category}`;
      const current = new Set(prev[key]);
      const allNames = tests.map((t) => t.name);
      const allSelected = allNames.every((n) => current.has(n));

      if (allSelected) {
        allNames.forEach((n) => current.delete(n));
      } else {
        allNames.forEach((n) => current.add(n));
      }

      if (current.size === 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: current };
    });
  }

  function isBundleFullySelected(tests: MockTest[]) {
    return tests.length > 0 && tests.every((t) =>
      Object.values(selectedTests).some((s) => s.has(t.name))
    );
  }

  function isBundlePartiallySelected(tests: MockTest[]) {
    const selected = tests.filter((t) =>
      Object.values(selectedTests).some((s) => s.has(t.name))
    );
    return selected.length > 0 && selected.length < tests.length;
  }

  function toggleExpand(key: string) {
    setExpandedBundles((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSportExpand(key: string) {
    setExpandedSports((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
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
    );
  }

  return (
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
                  Select from bundles organized by categories. Structure matches the library.
                </p>
                <div className="space-y-3">
                  {BUNDLES.map((bundle) => {
                    const bundleKey = bundle;
                    const isExpanded = expandedBundles.has(bundleKey);
                    const isTalentDetection = bundle === "Talent Detection";

                    return (
                      <div key={bundle} className="border border-border rounded-xl overflow-hidden">
                        {/* Bundle Header */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(bundleKey)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition text-left"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="font-semibold text-foreground">{bundle}</span>
                          </div>
                        </button>

                        {/* Bundle Content */}
                        {isExpanded && (
                          <div className="divide-y divide-border border-t border-border">
                            {isTalentDetection ? (
                              // Talent Detection: Categories only
                              CATEGORIES.map((category) => {
                                const catTests = getTestsByCategory(bundle, category);
                                if (catTests.length === 0) return null;

                                const catKey = `${bundle}_${category}`;
                                const isCatExpanded = expandedSports.has(catKey);
                                const fullSelected = isBundleFullySelected(catTests);
                                const partialSelected = isBundlePartiallySelected(catTests);

                                return (
                                  <div key={category}>
                                    <button
                                      type="button"
                                      onClick={() => toggleSportExpand(catKey)}
                                      className="w-full flex items-center justify-between px-6 py-3 bg-muted/20 hover:bg-muted/40 transition text-left"
                                    >
                                      <div className="flex items-center gap-3">
                                        {isCatExpanded ? (
                                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                        <span className="text-sm font-medium text-foreground">{category}</span>
                                        <span className="text-xs text-muted-foreground">({catTests.length})</span>
                                      </div>
                                    </button>

                                    {isCatExpanded && (
                                      <div className="px-6 divide-y divide-border/50">
                                        {catTests.map((test) => {
                                          const isSelected = Object.values(selectedTests).some((s) => s.has(test.name));
                                          return (
                                            <label
                                              key={test.name}
                                              className={cn(
                                                "flex items-center gap-3 px-0 py-2.5 cursor-pointer transition-colors hover:bg-muted/20",
                                                isSelected ? "bg-primary/5" : ""
                                              )}
                                            >
                                              <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleTest(test.name)}
                                              />
                                              <span className="flex-1 text-sm text-foreground">
                                                {test.name}
                                                <span className="text-xs text-muted-foreground ml-1.5">
                                                  ({test.unit})
                                                </span>
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              // Other bundles: Sports > Categories
                              SPORTS.map((sport) => {
                                const sportKey = `${bundle}_${sport}`;
                                const isSportExpanded = expandedSports.has(sportKey);

                                const hasSportTests = CATEGORIES.some(
                                  (cat) => getTests(bundle, sport, cat).length > 0
                                );

                                if (!hasSportTests) return null;

                                return (
                                  <div key={sport}>
                                    <button
                                      type="button"
                                      onClick={() => toggleSportExpand(sportKey)}
                                      className="w-full flex items-center justify-between px-6 py-3 bg-muted/20 hover:bg-muted/40 transition text-left"
                                    >
                                      <div className="flex items-center gap-3">
                                        {isSportExpanded ? (
                                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                        <span className="text-sm font-medium text-foreground">{sport}</span>
                                      </div>
                                    </button>

                                    {isSportExpanded && (
                                      <div className="divide-y divide-border/50">
                                        {CATEGORIES.map((category) => {
                                          const catTests = getTests(bundle, sport, category);
                                          if (catTests.length === 0) return null;

                                          const catKey = `${bundle}_${sport}_${category}`;
                                          const isCatExpanded = expandedSports.has(catKey);
                                          const fullSelected = isBundleFullySelected(catTests);
                                          const partialSelected = isBundlePartiallySelected(catTests);

                                          return (
                                            <div key={category}>
                                              <button
                                                type="button"
                                                onClick={() => toggleSportExpand(catKey)}
                                                className="w-full flex items-center justify-between px-8 py-2.5 hover:bg-muted/20 transition text-left"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    {category}
                                                  </span>
                                                  <span className="text-xs text-muted-foreground/60">({catTests.length})</span>
                                                </div>
                                                {isCatExpanded ? (
                                                  <ChevronDown className="w-3 h-3 text-muted-foreground/50" />
                                                ) : (
                                                  <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                                                )}
                                              </button>

                                              {isCatExpanded && (
                                                <div className="px-8 divide-y divide-border/50">
                                                  {catTests.map((test) => {
                                                    const isSelected = Object.values(selectedTests).some((s) => s.has(test.name));
                                                    return (
                                                      <label
                                                        key={test.name}
                                                        className={cn(
                                                          "flex items-center gap-3 px-0 py-2.5 cursor-pointer transition-colors hover:bg-muted/20",
                                                          isSelected ? "bg-primary/5" : ""
                                                        )}
                                                      >
                                                        <Checkbox
                                                          checked={isSelected}
                                                          onCheckedChange={() => toggleTest(test.name)}
                                                        />
                                                        <span className="flex-1 text-sm text-foreground">
                                                          {test.name}
                                                          <span className="text-xs text-muted-foreground ml-1.5">
                                                            ({test.unit})
                                                          </span>
                                                        </span>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
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
