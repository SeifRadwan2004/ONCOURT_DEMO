import { AdminLayout } from "@/components/AdminLayout";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, BarChart2, Table2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
  LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
type PHVStatus = "Pre-PHV" | "Mid-PHV" | "Post-PHV" | "Mature";
type Gender = "Male" | "Female";

interface Athlete {
  id: string;
  name: string;
  gender: Gender;
  sport: string;
  entity: string;
  chronoAge: number;
  bioAge: number;
  phvStatus: PHVStatus;
  speed30m: number;
  cmjHeight: number;
  yoyoLevel: number;
  gripStrength: number;
  agility: number;
  flexibility: number;
}

const ATHLETES: Athlete[] = [
  { id:"a01", name:"Amir Hassan",      gender:"Male",   sport:"Football",   entity:"Zayed FC Academy",        chronoAge:14, bioAge:15, phvStatus:"Post-PHV",  speed30m:4.9, cmjHeight:38, yoyoLevel:14, gripStrength:32, agility:15.2, flexibility:28 },
  { id:"a02", name:"Layla Khalid",     gender:"Female", sport:"Athletics",  entity:"Desert Runners Club",     chronoAge:13, bioAge:12, phvStatus:"Pre-PHV",   speed30m:5.4, cmjHeight:29, yoyoLevel:11, gripStrength:21, agility:16.5, flexibility:35 },
  { id:"a03", name:"Omar Saeed",       gender:"Male",   sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:16, bioAge:16, phvStatus:"Mature",    speed30m:4.7, cmjHeight:44, yoyoLevel:17, gripStrength:41, agility:14.6, flexibility:30 },
  { id:"a04", name:"Fatima Al Nouri",  gender:"Female", sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:15, bioAge:16, phvStatus:"Post-PHV",  speed30m:5.1, cmjHeight:36, yoyoLevel:13, gripStrength:26, agility:15.8, flexibility:32 },
  { id:"a05", name:"Khalid Mansoor",   gender:"Male",   sport:"Tennis",     entity:"Falcon Tennis Academy",   chronoAge:12, bioAge:11, phvStatus:"Pre-PHV",   speed30m:5.6, cmjHeight:26, yoyoLevel:9,  gripStrength:18, agility:17.1, flexibility:22 },
  { id:"a06", name:"Sara Al Rashidi",  gender:"Female", sport:"Football",   entity:"Al Ain Youth SC",         chronoAge:14, bioAge:14, phvStatus:"Mid-PHV",   speed30m:5.3, cmjHeight:31, yoyoLevel:12, gripStrength:23, agility:16.2, flexibility:36 },
  { id:"a07", name:"Yousef Nasser",    gender:"Male",   sport:"Athletics",  entity:"Sharjah Athletics",       chronoAge:17, bioAge:17, phvStatus:"Mature",    speed30m:4.5, cmjHeight:47, yoyoLevel:18, gripStrength:45, agility:14.1, flexibility:27 },
  { id:"a08", name:"Hessa Butti",      gender:"Female", sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:13, bioAge:13, phvStatus:"Mid-PHV",   speed30m:5.5, cmjHeight:27, yoyoLevel:10, gripStrength:20, agility:16.8, flexibility:38 },
  { id:"a09", name:"Rashid Al Ketbi",  gender:"Male",   sport:"Football",   entity:"Zayed FC Academy",        chronoAge:11, bioAge:10, phvStatus:"Pre-PHV",   speed30m:5.9, cmjHeight:22, yoyoLevel:8,  gripStrength:15, agility:17.8, flexibility:24 },
  { id:"a10", name:"Maryam Hamdan",    gender:"Female", sport:"Tennis",     entity:"Falcon Tennis Academy",   chronoAge:16, bioAge:15, phvStatus:"Post-PHV",  speed30m:5.0, cmjHeight:34, yoyoLevel:13, gripStrength:25, agility:15.5, flexibility:40 },
  { id:"a11", name:"Saeed Al Dhaheri", gender:"Male",   sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:15, bioAge:16, phvStatus:"Post-PHV",  speed30m:4.8, cmjHeight:42, yoyoLevel:15, gripStrength:37, agility:14.9, flexibility:26 },
  { id:"a12", name:"Noor Khalifa",     gender:"Female", sport:"Athletics",  entity:"Desert Runners Club",     chronoAge:12, bioAge:11, phvStatus:"Pre-PHV",   speed30m:5.7, cmjHeight:24, yoyoLevel:8,  gripStrength:17, agility:17.4, flexibility:33 },
  { id:"a13", name:"Hamad Al Ali",     gender:"Male",   sport:"Football",   entity:"Al Ain Youth SC",         chronoAge:16, bioAge:17, phvStatus:"Mature",    speed30m:4.6, cmjHeight:46, yoyoLevel:18, gripStrength:43, agility:14.3, flexibility:29 },
  { id:"a14", name:"Reem Al Mazrouei",gender:"Female", sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:14, bioAge:14, phvStatus:"Mid-PHV",   speed30m:5.2, cmjHeight:30, yoyoLevel:12, gripStrength:22, agility:16.0, flexibility:37 },
  { id:"a15", name:"Faris Obaid",      gender:"Male",   sport:"Athletics",  entity:"Sharjah Athletics",       chronoAge:13, bioAge:12, phvStatus:"Pre-PHV",   speed30m:5.5, cmjHeight:27, yoyoLevel:10, gripStrength:19, agility:16.9, flexibility:23 },
  { id:"a16", name:"Dana Al Suwaidi",  gender:"Female", sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:17, bioAge:17, phvStatus:"Mature",    speed30m:4.9, cmjHeight:37, yoyoLevel:14, gripStrength:28, agility:15.3, flexibility:39 },
  { id:"a17", name:"Jassim Farhan",    gender:"Male",   sport:"Football",   entity:"Zayed FC Academy",        chronoAge:15, bioAge:15, phvStatus:"Mid-PHV",   speed30m:5.0, cmjHeight:40, yoyoLevel:15, gripStrength:34, agility:15.1, flexibility:25 },
  { id:"a18", name:"Hind Al Qassimi",  gender:"Female", sport:"Tennis",     entity:"Falcon Tennis Academy",   chronoAge:11, bioAge:10, phvStatus:"Pre-PHV",   speed30m:5.8, cmjHeight:22, yoyoLevel:7,  gripStrength:14, agility:17.9, flexibility:34 },
  { id:"a19", name:"Abdulla Mubarak",  gender:"Male",   sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:17, bioAge:18, phvStatus:"Mature",    speed30m:4.4, cmjHeight:50, yoyoLevel:19, gripStrength:48, agility:13.9, flexibility:31 },
  { id:"a20", name:"Shamma Al Romaithi",gender:"Female",sport:"Athletics",  entity:"Desert Runners Club",     chronoAge:15, bioAge:15, phvStatus:"Mid-PHV",   speed30m:5.2, cmjHeight:32, yoyoLevel:13, gripStrength:24, agility:15.9, flexibility:41 },
  { id:"a21", name:"Ahmed Hareb",      gender:"Male",   sport:"Football",   entity:"Al Ain Youth SC",         chronoAge:12, bioAge:12, phvStatus:"Pre-PHV",   speed30m:5.7, cmjHeight:25, yoyoLevel:9,  gripStrength:16, agility:17.6, flexibility:22 },
  { id:"a22", name:"Maitha Al Falasi", gender:"Female", sport:"Football",   entity:"Al Ain Youth SC",         chronoAge:16, bioAge:15, phvStatus:"Post-PHV",  speed30m:5.1, cmjHeight:33, yoyoLevel:13, gripStrength:25, agility:15.7, flexibility:38 },
  { id:"a23", name:"Sultan Al Nuaimi", gender:"Male",   sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:14, bioAge:13, phvStatus:"Pre-PHV",   speed30m:5.3, cmjHeight:34, yoyoLevel:12, gripStrength:27, agility:15.6, flexibility:23 },
  { id:"a24", name:"Aisha Al Balushi", gender:"Female", sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:12, bioAge:12, phvStatus:"Pre-PHV",   speed30m:5.6, cmjHeight:25, yoyoLevel:9,  gripStrength:16, agility:17.2, flexibility:36 },
  { id:"a25", name:"Marwan Al Hajri",  gender:"Male",   sport:"Athletics",  entity:"Sharjah Athletics",       chronoAge:16, bioAge:16, phvStatus:"Mature",    speed30m:4.6, cmjHeight:45, yoyoLevel:17, gripStrength:42, agility:14.2, flexibility:28 },
  { id:"a26", name:"Noura Saeed",      gender:"Female", sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:13, bioAge:13, phvStatus:"Mid-PHV",   speed30m:5.4, cmjHeight:28, yoyoLevel:11, gripStrength:20, agility:16.6, flexibility:35 },
  { id:"a27", name:"Hamoud Al Zaabi",  gender:"Male",   sport:"Tennis",     entity:"Falcon Tennis Academy",   chronoAge:15, bioAge:14, phvStatus:"Mid-PHV",   speed30m:5.1, cmjHeight:39, yoyoLevel:14, gripStrength:31, agility:15.3, flexibility:26 },
  { id:"a28", name:"Latifa Al Hosani", gender:"Female", sport:"Athletics",  entity:"Desert Runners Club",     chronoAge:17, bioAge:16, phvStatus:"Post-PHV",  speed30m:4.8, cmjHeight:36, yoyoLevel:14, gripStrength:27, agility:15.4, flexibility:42 },
  { id:"a29", name:"Saif Al Shamsi",   gender:"Male",   sport:"Football",   entity:"Zayed FC Academy",        chronoAge:13, bioAge:14, phvStatus:"Mid-PHV",   speed30m:5.2, cmjHeight:35, yoyoLevel:13, gripStrength:28, agility:15.8, flexibility:25 },
  { id:"a30", name:"Meera Al Hosani",  gender:"Female", sport:"Tennis",     entity:"Falcon Tennis Academy",   chronoAge:14, bioAge:13, phvStatus:"Pre-PHV",   speed30m:5.5, cmjHeight:27, yoyoLevel:10, gripStrength:19, agility:16.7, flexibility:37 },
  { id:"a31", name:"Khalifa Al Sayed", gender:"Male",   sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:15, bioAge:15, phvStatus:"Mid-PHV",   speed30m:4.9, cmjHeight:41, yoyoLevel:16, gripStrength:36, agility:14.8, flexibility:29 },
  { id:"a32", name:"Hoor Al Muhairi",  gender:"Female", sport:"Football",   entity:"Zayed FC Academy",        chronoAge:11, bioAge:10, phvStatus:"Pre-PHV",   speed30m:5.9, cmjHeight:21, yoyoLevel:7,  gripStrength:13, agility:18.2, flexibility:32 },
  { id:"a33", name:"Zayed Al Remeithi",gender:"Male",   sport:"Athletics",  entity:"Sharjah Athletics",       chronoAge:14, bioAge:15, phvStatus:"Post-PHV",  speed30m:4.8, cmjHeight:43, yoyoLevel:16, gripStrength:38, agility:14.7, flexibility:27 },
  { id:"a34", name:"Salama Al Khoori", gender:"Female", sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:16, bioAge:16, phvStatus:"Mature",    speed30m:4.9, cmjHeight:35, yoyoLevel:14, gripStrength:26, agility:15.6, flexibility:40 },
  { id:"a35", name:"Bader Al Neyadi",  gender:"Male",   sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:17, bioAge:18, phvStatus:"Mature",    speed30m:4.5, cmjHeight:49, yoyoLevel:19, gripStrength:50, agility:13.8, flexibility:24 },
  { id:"a36", name:"Alyazia Al Falasi",gender:"Female", sport:"Athletics",  entity:"Desert Runners Club",     chronoAge:14, bioAge:14, phvStatus:"Mid-PHV",   speed30m:5.3, cmjHeight:30, yoyoLevel:12, gripStrength:22, agility:16.1, flexibility:38 },
  { id:"a37", name:"Tariq Al Ghafri",  gender:"Male",   sport:"Tennis",     entity:"Falcon Tennis Academy",   chronoAge:16, bioAge:16, phvStatus:"Mature",    speed30m:4.8, cmjHeight:44, yoyoLevel:16, gripStrength:39, agility:14.9, flexibility:28 },
  { id:"a38", name:"Shaikha Al Ahbabi",gender:"Female", sport:"Basketball", entity:"Abu Dhabi Ballers",       chronoAge:15, bioAge:14, phvStatus:"Mid-PHV",   speed30m:5.2, cmjHeight:33, yoyoLevel:12, gripStrength:24, agility:16.0, flexibility:36 },
  { id:"a39", name:"Naseem Al Tunaiji",gender:"Male",   sport:"Football",   entity:"Al Ain Youth SC",         chronoAge:13, bioAge:13, phvStatus:"Mid-PHV",   speed30m:5.4, cmjHeight:32, yoyoLevel:12, gripStrength:25, agility:16.3, flexibility:22 },
  { id:"a40", name:"Wadha Al Mansoori",gender:"Female", sport:"Swimming",   entity:"Emirates Swim Team",      chronoAge:11, bioAge:11, phvStatus:"Pre-PHV",   speed30m:5.7, cmjHeight:23, yoyoLevel:8,  gripStrength:14, agility:17.5, flexibility:34 },
];

const MOCK_TREND = [
  { month: "Sep '25", avgSpeed: 5.3, avgCMJ: 31, avgYoYo: 11 },
  { month: "Oct '25", avgSpeed: 5.2, avgCMJ: 32, avgYoYo: 11 },
  { month: "Nov '25", avgSpeed: 5.1, avgCMJ: 33, avgYoYo: 12 },
  { month: "Dec '25", avgSpeed: 5.0, avgCMJ: 34, avgYoYo: 12 },
  { month: "Jan '26", avgSpeed: 5.0, avgCMJ: 35, avgYoYo: 13 },
  { month: "Feb '26", avgSpeed: 4.9, avgCMJ: 36, avgYoYo: 13 },
  { month: "Mar '26", avgSpeed: 4.9, avgCMJ: 37, avgYoYo: 14 },
  { month: "Apr '26", avgSpeed: 4.8, avgCMJ: 38, avgYoYo: 14 },
  { month: "May '26", avgSpeed: 4.8, avgCMJ: 39, avgYoYo: 15 },
];

// ─── Constants ─────────────────────────────────────────────
const SPORTS    = ["Football", "Athletics", "Swimming", "Basketball", "Tennis"] as const;
const ENTITIES  = ["Zayed FC Academy","Desert Runners Club","Emirates Swim Team","Abu Dhabi Ballers","Falcon Tennis Academy","Al Ain Youth SC","Sharjah Athletics"] as const;
const PHV_LIST: PHVStatus[] = ["Pre-PHV","Mid-PHV","Post-PHV","Mature"];
const GENDERS: Gender[]     = ["Male","Female"];
const TESTS     = ["Speed 30m","CMJ Height","Yo-Yo Level","Grip Strength","Agility","Flexibility"] as const;
const CHRONO_BINS = ["10–11","12–13","14–15","16–17","18+"] as const;
const BIO_BINS   = ["<11","11–12","13–14","15–16","17+"] as const;

// Chart palette
const PALETTE = ["#f97316","#3b82f6","#22c55e","#a855f7","#eab308","#ec4899","#14b8a6","#f43f5e"];

const PHV_COLORS: Record<PHVStatus, string> = {
  "Pre-PHV": "#3b82f6",
  "Mid-PHV": "#eab308",
  "Post-PHV": "#f97316",
  "Mature":   "#22c55e",
};

// ─── Helpers ────────────────────────────────────────────────
function avg(arr: number[]) {
  if (!arr.length) return 0;
  return +(arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(2);
}
function countBy<T extends string>(arr: T[]): { name: T; value: number }[] {
  const m = new Map<T, number>();
  arr.forEach((v) => m.set(v, (m.get(v) ?? 0) + 1));
  return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
}
function ageBin(age: number, bins: readonly string[]): string {
  if (bins === CHRONO_BINS) {
    if (age <= 11) return "10–11";
    if (age <= 13) return "12–13";
    if (age <= 15) return "14–15";
    if (age <= 17) return "16–17";
    return "18+";
  }
  if (age < 11) return "<11";
  if (age <= 12) return "11–12";
  if (age <= 14) return "13–14";
  if (age <= 16) return "15–16";
  return "17+";
}

// ─── Custom tooltip ─────────────────────────────────────────
function ChartTip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs space-y-1">
      {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? "#f97316" }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ═══════════════════════════════════════════════════════════
type Tab = "graphical" | "tabular";
type SortKey = keyof Omit<Athlete, "id">;

const PAGE_SIZE = 10;

export default function AdminAnalytics() {
  // ── Filters ────────────────────────────────────────────
  const [fTest,    setFTest]    = useState("All");
  const [fChrono,  setFChrono]  = useState("All");
  const [fBio,     setFBio]     = useState("All");
  const [fPHV,     setFPHV]     = useState("All");
  const [fGender,  setFGender]  = useState("All");
  const [fSport,   setFSport]   = useState("All");
  const [fEntity,  setFEntity]  = useState("All");

  const [tab,      setTab]      = useState<Tab>("graphical");
  const [search,   setSearch]   = useState("");
  const [sortKey,  setSortKey]  = useState<SortKey>("name");
  const [sortDir,  setSortDir]  = useState<"asc" | "desc">("asc");
  const [page,     setPage]     = useState(1);

  // ── Filtered set ───────────────────────────────────────
  const filtered = useMemo(() => {
    return ATHLETES.filter((a) => {
      if (fSport  !== "All" && a.sport      !== fSport)  return false;
      if (fEntity !== "All" && a.entity     !== fEntity) return false;
      if (fGender !== "All" && a.gender     !== fGender) return false;
      if (fPHV    !== "All" && a.phvStatus  !== fPHV)    return false;
      if (fChrono !== "All" && ageBin(a.chronoAge, CHRONO_BINS) !== fChrono) return false;
      if (fBio    !== "All" && ageBin(a.bioAge,    BIO_BINS)    !== fBio)    return false;
      return true;
    });
  }, [fSport, fEntity, fGender, fPHV, fChrono, fBio]);

  // ── Chart distributions ────────────────────────────────
  const sportDist   = useMemo(() => countBy(filtered.map((a) => a.sport)), [filtered]);
  const genderDist  = useMemo(() => countBy(filtered.map((a) => a.gender)), [filtered]);
  const phvDist     = useMemo(() => countBy(filtered.map((a) => a.phvStatus)), [filtered]);
  const entityDist  = useMemo(() => countBy(filtered.map((a) => a.entity)), [filtered]);
  const chronoDist  = useMemo(() => {
    const bins: Record<string, number> = { "10–11":0, "12–13":0, "14–15":0, "16–17":0, "18+":0 };
    filtered.forEach((a) => bins[ageBin(a.chronoAge, CHRONO_BINS)]++);
    return Object.entries(bins).map(([name, value]) => ({ name, value }));
  }, [filtered]);
  const bioDist     = useMemo(() => {
    const bins: Record<string, number> = { "<11":0, "11–12":0, "13–14":0, "15–16":0, "17+":0 };
    filtered.forEach((a) => bins[ageBin(a.bioAge, BIO_BINS)]++);
    return Object.entries(bins).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // ── Performance by sport ───────────────────────────────
  const perfBySport = useMemo(() =>
    SPORTS.map((s) => {
      const sub = filtered.filter((a) => a.sport === s);
      return {
        sport: s,
        "Speed 30m": avg(sub.map((a) => a.speed30m)),
        "CMJ (cm)":  avg(sub.map((a) => a.cmjHeight)),
        "Yo-Yo Lvl": avg(sub.map((a) => a.yoyoLevel)),
      };
    }).filter((r) => r["CMJ (cm)"] > 0),
  [filtered]);

  // ── Radar: avg metrics (normalised 0-10) ──────────────
  const radarData = useMemo(() => {
    const sub = filtered;
    if (!sub.length) return [];
    const normalize = (val: number, min: number, max: number) =>
      +((val - min) / (max - min) * 10).toFixed(1);
    return [
      { metric: "Speed",       value: normalize(avg(sub.map((a) => a.speed30m)),    4.4, 6.0) },
      { metric: "CMJ",         value: normalize(avg(sub.map((a) => a.cmjHeight)),   20,  52)  },
      { metric: "Yo-Yo",       value: normalize(avg(sub.map((a) => a.yoyoLevel)),   7,   20)  },
      { metric: "Grip",        value: normalize(avg(sub.map((a) => a.gripStrength)),13,  52)  },
      { metric: "Agility",     value: normalize(avg(sub.map((a) => a.agility)),     13.8,18.5)},
      { metric: "Flexibility", value: normalize(avg(sub.map((a) => a.flexibility)), 22,  42)  },
    ];
  }, [filtered]);

  // ── KPI stats ──────────────────────────────────────────
  const kpis = useMemo(() => {
    const sub = filtered;
    return {
      total: sub.length,
      avgChronoAge: avg(sub.map((a) => a.chronoAge)),
      maleCount: sub.filter((a) => a.gender === "Male").length,
      entities: new Set(sub.map((a) => a.entity)).size,
    };
  }, [filtered]);

  // ── Table sorting + search + pagination ────────────────
  const tableData = useMemo(() => {
    const q = search.toLowerCase();
    return filtered
      .filter((a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q) ||
        a.entity.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const cmp = typeof av === "number" && typeof bv === "number"
          ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [filtered, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(tableData.length / PAGE_SIZE));
  const pageData   = tableData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }
  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20 inline ml-1" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-3 h-3 opacity-70 inline ml-1" />
      : <ChevronDown className="w-3 h-3 opacity-70 inline ml-1" />;
  }

  function resetFilters() {
    setFTest("All"); setFChrono("All"); setFBio("All"); setFPHV("All");
    setFGender("All"); setFSport("All"); setFEntity("All");
    setSearch(""); setPage(1);
  }

  const activeFilterCount = [fTest,fChrono,fBio,fPHV,fGender,fSport,fEntity].filter((v) => v !== "All").length;

  // ── Active metric label for test filter tooltip ────────
  const TEST_FIELD: Record<string, keyof Athlete> = {
    "Speed 30m":   "speed30m",
    "CMJ Height":  "cmjHeight",
    "Yo-Yo Level": "yoyoLevel",
    "Grip Strength":"gripStrength",
    "Agility":     "agility",
    "Flexibility": "flexibility",
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* ═══ Page Header ═══ */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Athlete Performance Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Platform-wide testing data across all athletes, sports, and entities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("graphical")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${tab === "graphical" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}
            >
              <BarChart2 className="w-4 h-4" /> Graphical
            </button>
            <button
              onClick={() => setTab("tabular")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${tab === "tabular" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}
            >
              <Table2 className="w-4 h-4" /> Tabular
            </button>
          </div>
        </div>

        {/* ═══ Filter Bar ═══ */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filters</p>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="text-xs text-primary hover:underline">
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterSelect label="Test"            value={fTest}   onChange={setFTest}   options={TESTS as unknown as string[]} />
            <FilterSelect label="Chrono Age"      value={fChrono} onChange={setFChrono} options={CHRONO_BINS as unknown as string[]} />
            <FilterSelect label="Biological Age"  value={fBio}    onChange={setFBio}    options={BIO_BINS as unknown as string[]} />
            <FilterSelect label="PHV Status"      value={fPHV}    onChange={setFPHV}    options={PHV_LIST} />
            <FilterSelect label="Gender"          value={fGender} onChange={setFGender} options={GENDERS} />
            <FilterSelect label="Sport"           value={fSport}  onChange={setFSport}  options={SPORTS as unknown as string[]} />
            <FilterSelect label="Entity"          value={fEntity} onChange={setFEntity} options={ENTITIES as unknown as string[]} />
          </div>
        </div>

        {/* ═══ KPI Cards ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Total Athletes"    value={kpis.total}        sub="in filtered view" />
          <KpiCard label="Avg Chrono Age"    value={kpis.avgChronoAge} sub="years"            />
          <KpiCard label="Male / Female"     value={`${kpis.maleCount} / ${kpis.total - kpis.maleCount}`} sub="gender split" />
          <KpiCard label="Active Entities"   value={kpis.entities}     sub="clubs & academies" />
        </div>

        {/* ═══ GRAPHICAL VIEW ═══ */}
        {tab === "graphical" && (
          <div className="space-y-6">

            {/* Row 1: Sport dist + Gender dist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="Athletes by Sport" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sportDist} layout="vertical" barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                    <XAxis type="number" tick={{ fill:"#888", fontSize:11 }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fill:"#aaa", fontSize:11 }} />
                    <Tooltip content={<ChartTip />} cursor={{ fill:"#ffffff08" }} />
                    <Bar dataKey="value" name="Athletes" radius={[0,4,4,0]}>
                      {sportDist.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Gender Distribution">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={38} paddingAngle={3}>
                      {genderDist.map((_, i) => <Cell key={i} fill={i === 0 ? "#3b82f6" : "#ec4899"} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, color:"#aaa" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 2: Chrono age dist + Bio age dist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Chronological Age Distribution">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chronoDist} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill:"#aaa", fontSize:11 }} />
                    <YAxis tick={{ fill:"#888", fontSize:11 }} allowDecimals={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill:"#ffffff08" }} />
                    <Bar dataKey="value" name="Athletes" radius={[4,4,0,0]}>
                      {chronoDist.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Biological Age Distribution">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bioDist} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill:"#aaa", fontSize:11 }} />
                    <YAxis tick={{ fill:"#888", fontSize:11 }} allowDecimals={false} />
                    <Tooltip content={<ChartTip />} cursor={{ fill:"#ffffff08" }} />
                    <Bar dataKey="value" name="Athletes" radius={[4,4,0,0]}>
                      {bioDist.map((_, i) => <Cell key={i} fill={PALETTE[(i+2) % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 3: PHV status + Entity distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="PHV / Maturity Status">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={phvDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={36} paddingAngle={3}>
                      {phvDist.map((d, i) => <Cell key={i} fill={PHV_COLORS[d.name as PHVStatus] ?? PALETTE[i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:"#aaa" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Entity Distribution" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={entityDist} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                    <XAxis type="number" tick={{ fill:"#888", fontSize:11 }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fill:"#aaa", fontSize:10 }} />
                    <Tooltip content={<ChartTip />} cursor={{ fill:"#ffffff08" }} />
                    <Bar dataKey="value" name="Athletes" radius={[0,4,4,0]}>
                      {entityDist.map((_, i) => <Cell key={i} fill={PALETTE[(i+3) % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 4: Trend chart + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="Platform Performance Trend" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MOCK_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" tick={{ fill:"#aaa", fontSize:11 }} />
                    <YAxis yAxisId="left"  tick={{ fill:"#888", fontSize:11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill:"#888", fontSize:11 }} />
                    <Tooltip content={<ChartTip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, color:"#aaa" }} />
                    <Line yAxisId="right" type="monotone" dataKey="avgCMJ"   name="Avg CMJ (cm)"  stroke="#f97316" strokeWidth={2} dot={{ r:3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="avgYoYo"  name="Avg Yo-Yo Lvl" stroke="#3b82f6" strokeWidth={2} dot={{ r:3 }} />
                    <Line yAxisId="left"  type="monotone" dataKey="avgSpeed" name="Avg Speed 30m"  stroke="#22c55e" strokeWidth={2} dot={{ r:3 }} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Avg Fitness Profile (Normalised)">
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={75}>
                    <PolarGrid stroke="#ffffff15" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill:"#aaa", fontSize:10 }} />
                    <PolarRadiusAxis angle={30} domain={[0,10]} tick={{ fill:"#666", fontSize:9 }} />
                    <Radar name="Platform Avg" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
                    <Tooltip content={<ChartTip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 5: Performance comparison by sport */}
            <ChartCard title="Performance Averages by Sport">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={perfBySport} barGap={4} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="sport" tick={{ fill:"#aaa", fontSize:11 }} />
                  <YAxis tick={{ fill:"#888", fontSize:11 }} />
                  <Tooltip content={<ChartTip />} cursor={{ fill:"#ffffff08" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, color:"#aaa" }} />
                  <Bar dataKey="CMJ (cm)"   fill="#f97316" radius={[4,4,0,0]} barSize={20} />
                  <Bar dataKey="Yo-Yo Lvl" fill="#3b82f6" radius={[4,4,0,0]} barSize={20} />
                  <Bar dataKey="Speed 30m" fill="#22c55e" radius={[4,4,0,0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        )}

        {/* ═══ TABULAR VIEW ═══ */}
        {tab === "tabular" && (
          <div className="space-y-4">
            {/* Table search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search athlete, sport or entity…"
                value={search}
                onChange={(ev) => { setSearch(ev.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      {(
                        [
                          ["name",         "Name"],
                          ["gender",       "Gender"],
                          ["sport",        "Sport"],
                          ["entity",       "Entity"],
                          ["chronoAge",    "C-Age"],
                          ["bioAge",       "B-Age"],
                          ["phvStatus",    "PHV"],
                          ["speed30m",     "Speed 30m"],
                          ["cmjHeight",    "CMJ (cm)"],
                          ["yoyoLevel",    "Yo-Yo"],
                          ["gripStrength", "Grip (kg)"],
                          ["agility",      "Agility"],
                          ["flexibility",  "Flex (cm)"],
                        ] as [SortKey, string][]
                      ).map(([key, label]) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key)}
                          className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-foreground transition"
                        >
                          {label}<SortIcon col={key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="px-4 py-10 text-center text-muted-foreground text-sm">
                          No athletes match your filters.
                        </td>
                      </tr>
                    ) : pageData.map((a, i) => (
                      <tr
                        key={a.id}
                        className={`border-b border-border last:border-0 hover:bg-muted/30 transition ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                      >
                        <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{a.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{a.gender}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{a.sport}</td>
                        <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{a.entity}</td>
                        <td className="px-3 py-2.5 text-center text-foreground">{a.chronoAge}</td>
                        <td className="px-3 py-2.5 text-center text-foreground">{a.bioAge}</td>
                        <td className="px-3 py-2.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: PHV_COLORS[a.phvStatus] + "22", color: PHV_COLORS[a.phvStatus], border: `1px solid ${PHV_COLORS[a.phvStatus]}44` }}>
                            {a.phvStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums text-foreground">{a.speed30m}s</td>
                        <td className="px-3 py-2.5 text-center tabular-nums text-foreground">{a.cmjHeight}</td>
                        <td className="px-3 py-2.5 text-center tabular-nums text-foreground">{a.yoyoLevel}</td>
                        <td className="px-3 py-2.5 text-center tabular-nums text-foreground">{a.gripStrength}</td>
                        <td className="px-3 py-2.5 text-center tabular-nums text-foreground">{a.agility}s</td>
                        <td className="px-3 py-2.5 text-center tabular-nums text-foreground">{a.flexibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, tableData.length)}–{Math.min(page * PAGE_SIZE, tableData.length)} of {tableData.length} athletes
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx-1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition ${page === p ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════
//  Small reusable components
// ═══════════════════════════════════════════════════════════
function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className={`px-3 py-1.5 text-xs rounded-lg border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer ${
          value !== "All" ? "border-primary/60 text-primary" : "border-border"
        }`}
      >
        <option value="All">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: number | string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <p className="text-sm font-semibold text-foreground mb-4">{title}</p>
      {children}
    </div>
  );
}
