import { AdminLayout } from "@/components/AdminLayout";
import { useState, useMemo, useId } from "react";
import {
  Search, Plus, X, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle2, Trash2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
//  SEED LISTS  (stateful — items can be added at runtime)
// ═══════════════════════════════════════════════════════════
type Bundle  = string;
type Category = string;

const SEED_BUNDLES: Bundle[] = [
  "Talent Detection", "Athlete Development", "Professional Practice",
];

const SEED_SPORTS: string[] = [
  "Tennis","Squash","Padel","Table Tennis","Basketball","Volleyball","Handball",
  "Football","Sprint Swimming","Distance Swimming","Sprint Running","Distance Running",
  "Boxing","Karate","Taekwondo","Judo","Wrestling","BJJ",
  "Weightlifting","Artistic Gymnastics","Rhythmic Gymnastics","Artistic Swimming",
  "Triathlon","Pentathlon",
];

const SEED_CATEGORIES: Category[] = [
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

const UNITS = [
  "s","ms","m","cm","mm","kg","N","W","°",
  "m/s","km/h","W/kg","N/kg","kN/m",
  "reps","score","level","%","bpm","index","other",
] as const;

const PRESENTATION_TYPES = [
  "Line Graph","Bar Chart","Pie Chart","Gauge Meter",
  "Radar Chart","Number Card","Table","Scatter Plot",
] as const;

const STATUSES = ["Active","Draft","Archived"] as const;
type Status = typeof STATUSES[number];
const EQUIP_LEVELS = ["Automated","Elite"] as const;

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
interface OutputVar  { id:string; label:string; unit:string; otherUnit:string }
interface DerivedRow { id:string; name:string; formula:string; unit:string }
interface LibTest {
  id:string; name:string; bundles:Bundle[]; sports:string[]|"all";
  category:Category; equipmentLevel:"Automated"|"Elite";
  supervisionRequired:boolean; minAge:number|null; maxAge:number|null;
  presentationTypes:string[]; status:Status;
  outputVars:{label:string;unit:string}[]; citation?:string;
}

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const MOCK_TESTS: LibTest[] = [
  { id:"t01", name:"30m Sprint", bundles:["Talent Detection","Athlete Development"], sports:["Football","Sprint Running","Basketball","Handball"], category:"Speed & Acceleration", equipmentLevel:"Automated", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Line Graph","Number Card"], status:"Active", outputVars:[{label:"Time",unit:"s"},{label:"Split 10m",unit:"s"}], citation:"Haugen et al. (2019)" },
  { id:"t02", name:"60m Sprint", bundles:["Talent Detection","Professional Practice"], sports:["Sprint Running","Pentathlon"], category:"Speed & Acceleration", equipmentLevel:"Automated", supervisionRequired:true, minAge:12, maxAge:null, presentationTypes:["Line Graph","Number Card"], status:"Active", outputVars:[{label:"Time",unit:"s"},{label:"Reaction Time",unit:"ms"}] },
  { id:"t03", name:"Flying 20m", bundles:["Professional Practice"], sports:["Sprint Running","Football"], category:"Speed & Acceleration", equipmentLevel:"Automated", supervisionRequired:false, minAge:14, maxAge:null, presentationTypes:["Number Card"], status:"Active", outputVars:[{label:"Time",unit:"s"},{label:"Max Velocity",unit:"m/s"}] },
  { id:"t04", name:"Illinois Agility Test", bundles:["Talent Detection","Athlete Development"], sports:["Football","Basketball","Handball","Tennis"], category:"Change of Direction & Agility", equipmentLevel:"Elite", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Line Graph","Bar Chart"], status:"Active", outputVars:[{label:"Time",unit:"s"}], citation:"Pauole et al. (2000)" },
  { id:"t05", name:"505 Agility Test", bundles:["Athlete Development","Professional Practice"], sports:["Basketball","Volleyball","Tennis","Squash"], category:"Change of Direction & Agility", equipmentLevel:"Automated", supervisionRequired:true, minAge:12, maxAge:null, presentationTypes:["Bar Chart","Number Card"], status:"Active", outputVars:[{label:"5-0-5 Time",unit:"s"},{label:"Preferred Leg",unit:"s"},{label:"Non-Preferred Leg",unit:"s"}] },
  { id:"t06", name:"Spider Court Test", bundles:["Talent Detection","Athlete Development"], sports:["Tennis","Squash","Padel","Table Tennis"], category:"Change of Direction & Agility", equipmentLevel:"Elite", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Line Graph","Number Card"], status:"Active", outputVars:[{label:"Total Time",unit:"s"}] },
  { id:"t07", name:"Countermovement Jump (CMJ)", bundles:["Talent Detection","Athlete Development","Professional Practice"], sports:"all", category:"Power & Explosiveness", equipmentLevel:"Automated", supervisionRequired:true, minAge:8, maxAge:null, presentationTypes:["Line Graph","Bar Chart","Number Card"], status:"Active", outputVars:[{label:"Jump Height",unit:"cm"},{label:"Peak Power",unit:"W"},{label:"Peak Power/kg",unit:"W/kg"}], citation:"Moran et al. (2017)" },
  { id:"t08", name:"Standing Broad Jump", bundles:["Talent Detection"], sports:"all", category:"Power & Explosiveness", equipmentLevel:"Elite", supervisionRequired:false, minAge:8, maxAge:null, presentationTypes:["Bar Chart","Number Card"], status:"Active", outputVars:[{label:"Distance",unit:"cm"}] },
  { id:"t09", name:"Overhead Medicine Ball Throw", bundles:["Talent Detection","Athlete Development"], sports:["Basketball","Volleyball","Handball","Football"], category:"Power & Explosiveness", equipmentLevel:"Elite", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Bar Chart","Number Card"], status:"Active", outputVars:[{label:"Distance",unit:"m"}] },
  { id:"t10", name:"Grip Strength", bundles:["Talent Detection","Athlete Development","Professional Practice"], sports:"all", category:"Strength", equipmentLevel:"Automated", supervisionRequired:false, minAge:8, maxAge:null, presentationTypes:["Number Card","Gauge Meter","Bar Chart"], status:"Active", outputVars:[{label:"Dominant Hand",unit:"kg"},{label:"Non-Dominant Hand",unit:"kg"}] },
  { id:"t11", name:"1RM Back Squat", bundles:["Professional Practice"], sports:["Weightlifting","Wrestling","Judo","BJJ"], category:"Strength", equipmentLevel:"Elite", supervisionRequired:true, minAge:16, maxAge:null, presentationTypes:["Number Card","Line Graph"], status:"Active", outputVars:[{label:"1RM",unit:"kg"},{label:"1RM/BW Ratio",unit:"index"}], citation:"Baechle & Earle (2008)" },
  { id:"t12", name:"Push-Up Endurance Test", bundles:["Talent Detection","Athlete Development"], sports:["Boxing","Karate","Wrestling","BJJ","Taekwondo","Judo"], category:"Muscular Endurance", equipmentLevel:"Elite", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Number Card","Bar Chart"], status:"Active", outputVars:[{label:"Repetitions",unit:"reps"}] },
  { id:"t13", name:"Yo-Yo Intermittent Recovery Test L1", bundles:["Talent Detection","Athlete Development"], sports:["Football","Basketball","Handball","Volleyball","Hockey"], category:"Aerobic & Anaerobic Capacity", equipmentLevel:"Elite", supervisionRequired:true, minAge:12, maxAge:null, presentationTypes:["Line Graph","Bar Chart","Number Card"], status:"Active", outputVars:[{label:"Level",unit:"level"},{label:"Total Distance",unit:"m"},{label:"VO2max Est",unit:"score"}], citation:"Bangsbo et al. (2008)" },
  { id:"t14", name:"Cooper 12-min Run Test", bundles:["Talent Detection","Athlete Development"], sports:["Distance Running","Triathlon","Pentathlon"], category:"Aerobic & Anaerobic Capacity", equipmentLevel:"Elite", supervisionRequired:true, minAge:12, maxAge:null, presentationTypes:["Number Card","Line Graph"], status:"Active", outputVars:[{label:"Distance",unit:"m"},{label:"VO2max Est",unit:"score"}], citation:"Cooper (1968)" },
  { id:"t15", name:"400m Swim Time Trial", bundles:["Athlete Development","Professional Practice"], sports:["Distance Swimming","Triathlon","Artistic Swimming"], category:"Aerobic & Anaerobic Capacity", equipmentLevel:"Automated", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Line Graph","Number Card"], status:"Active", outputVars:[{label:"Time",unit:"s"},{label:"Stroke Rate",unit:"score"}] },
  { id:"t16", name:"Functional Movement Screen (FMS)", bundles:["Talent Detection","Athlete Development","Professional Practice"], sports:"all", category:"Stability, Mobility & Injury Screening", equipmentLevel:"Elite", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Radar Chart","Number Card","Table"], status:"Active", outputVars:[{label:"Total Score",unit:"score"},{label:"Deep Squat",unit:"score"},{label:"Hurdle Step",unit:"score"},{label:"Inline Lunge",unit:"score"},{label:"Shoulder Mobility",unit:"score"}], citation:"Cook et al. (2006)" },
  { id:"t17", name:"Sit & Reach", bundles:["Talent Detection","Athlete Development"], sports:"all", category:"Stability, Mobility & Injury Screening", equipmentLevel:"Elite", supervisionRequired:false, minAge:8, maxAge:null, presentationTypes:["Number Card","Gauge Meter"], status:"Active", outputVars:[{label:"Distance",unit:"cm"}] },
  { id:"t18", name:"Single-Leg Balance Test", bundles:["Talent Detection","Athlete Development"], sports:["Artistic Gymnastics","Rhythmic Gymnastics","Artistic Swimming","Taekwondo","Karate"], category:"Balance & Coordination", equipmentLevel:"Automated", supervisionRequired:false, minAge:8, maxAge:null, presentationTypes:["Number Card","Bar Chart"], status:"Active", outputVars:[{label:"Eyes Open – Dom",unit:"s"},{label:"Eyes Open – Non-Dom",unit:"s"},{label:"Eyes Closed – Dom",unit:"s"}] },
  { id:"t19", name:"Y-Balance Test", bundles:["Athlete Development","Professional Practice"], sports:"all", category:"Balance & Coordination", equipmentLevel:"Elite", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Radar Chart","Number Card"], status:"Active", outputVars:[{label:"Anterior",unit:"cm"},{label:"Posteromedial",unit:"cm"},{label:"Posterolateral",unit:"cm"},{label:"Composite Score",unit:"%"}], citation:"Plisky et al. (2006)" },
  { id:"t20", name:"Fundamental Movement Skills Screen", bundles:["Talent Detection"], sports:"all", category:"Movement Literacy", equipmentLevel:"Elite", supervisionRequired:true, minAge:6, maxAge:14, presentationTypes:["Table","Radar Chart"], status:"Active", outputVars:[{label:"Run",unit:"score"},{label:"Jump",unit:"score"},{label:"Throw",unit:"score"},{label:"Catch",unit:"score"},{label:"Kick",unit:"score"}] },
  { id:"t21", name:"Simple Reaction Time", bundles:["Talent Detection","Athlete Development"], sports:["Boxing","Taekwondo","Karate","Table Tennis","Tennis","Squash"], category:"Reactivity & Neural Coordination", equipmentLevel:"Automated", supervisionRequired:false, minAge:8, maxAge:null, presentationTypes:["Number Card","Bar Chart"], status:"Active", outputVars:[{label:"Mean RT",unit:"ms"},{label:"Best RT",unit:"ms"}], citation:"Pain & Hibbs (2007)" },
  { id:"t22", name:"Choice Reaction Time", bundles:["Athlete Development","Professional Practice"], sports:["Tennis","Table Tennis","Squash","Padel","Football","Basketball"], category:"Reactivity & Neural Coordination", equipmentLevel:"Automated", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Number Card","Line Graph"], status:"Active", outputVars:[{label:"Mean CRT",unit:"ms"},{label:"Error Rate",unit:"%"}] },
  { id:"t23", name:"Rhythmic Bouncing Test", bundles:["Talent Detection","Athlete Development"], sports:["Artistic Gymnastics","Rhythmic Gymnastics","Artistic Swimming"], category:"Rhythm & Timing", equipmentLevel:"Automated", supervisionRequired:true, minAge:6, maxAge:null, presentationTypes:["Number Card","Line Graph"], status:"Draft", outputVars:[{label:"Timing Error",unit:"ms"},{label:"Rhythm Score",unit:"score"}] },
  { id:"t24", name:"Anthropometric Battery", bundles:["Talent Detection","Athlete Development","Professional Practice"], sports:"all", category:"Anthropometrics", equipmentLevel:"Elite", supervisionRequired:false, minAge:6, maxAge:null, presentationTypes:["Table","Number Card","Line Graph"], status:"Active", outputVars:[{label:"Height",unit:"cm"},{label:"Body Mass",unit:"kg"},{label:"Sitting Height",unit:"cm"},{label:"Leg Length",unit:"cm"},{label:"BMI",unit:"score"},{label:"Arm Span",unit:"cm"}] },
  { id:"t25", name:"50m Freestyle Sprint", bundles:["Talent Detection","Professional Practice"], sports:["Sprint Swimming","Triathlon","Pentathlon"], category:"Speed & Acceleration", equipmentLevel:"Automated", supervisionRequired:true, minAge:10, maxAge:null, presentationTypes:["Line Graph","Number Card"], status:"Active", outputVars:[{label:"Time",unit:"s"},{label:"Stroke Count",unit:"reps"},{label:"Stroke Rate",unit:"score"}] },
  { id:"t26", name:"Clean & Jerk Max", bundles:["Professional Practice"], sports:["Weightlifting","Wrestling"], category:"Power & Explosiveness", equipmentLevel:"Elite", supervisionRequired:true, minAge:16, maxAge:null, presentationTypes:["Number Card","Line Graph"], status:"Active", outputVars:[{label:"Max Load",unit:"kg"},{label:"Sinclair Score",unit:"score"}], citation:"IWF Technical & Competition Rules (2022)" },
  { id:"t27", name:"Pull-Up Endurance", bundles:["Talent Detection","Athlete Development"], sports:["Wrestling","BJJ","Judo","Artistic Gymnastics"], category:"Muscular Endurance", equipmentLevel:"Elite", supervisionRequired:false, minAge:10, maxAge:null, presentationTypes:["Number Card","Bar Chart"], status:"Active", outputVars:[{label:"Repetitions",unit:"reps"}] },
  { id:"t28", name:"Wingate Anaerobic Test", bundles:["Professional Practice"], sports:["Sprint Running","Sprint Swimming","Cycling","Boxing","Wrestling"], category:"Aerobic & Anaerobic Capacity", equipmentLevel:"Automated", supervisionRequired:true, minAge:14, maxAge:null, presentationTypes:["Line Graph","Number Card","Gauge Meter"], status:"Draft", outputVars:[{label:"Peak Power",unit:"W"},{label:"Mean Power",unit:"W"},{label:"Fatigue Index",unit:"%"}], citation:"Inbar et al. (1996)" },
];

// ═══════════════════════════════════════════════════════════
//  EMPTY FORM
// ═══════════════════════════════════════════════════════════
const newVar  = (): OutputVar  => ({ id: crypto.randomUUID(), label:"", unit:"s", otherUnit:"" });
const newRow  = (): DerivedRow => ({ id: crypto.randomUUID(), name:"", formula:"", unit:"" });

const EMPTY_FORM = () => ({
  name: "",
  bundles: [] as string[],
  allSports: true,
  sports: [] as string[],
  category: "",
  outputVars: [newVar()] as OutputVar[],
  hasDerived: false,
  derivedRows: [] as DerivedRow[],
  equipmentLevel: "" as "Automated"|"Elite"|"",
  equipmentName: "",
  supervisionRequired: false,
  minAge: "",
  maxAge: "",
  presentationTypes: [] as string[],
  citation: "",
  status: "Draft" as Status,
});

// ─── Status badge ────────────────────────────────────────────
const STATUS_CLS: Record<Status, string> = {
  Active:   "bg-green-500/15 text-green-400 border border-green-500/30",
  Draft:    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Archived: "bg-red-500/15 text-red-400 border border-red-500/30",
};

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AdminLibrary() {
  const [tests,      setTests]      = useState<LibTest[]>(MOCK_TESTS);
  const [search,     setSearch]     = useState("");
  const [fSport,     setFSport]     = useState("All");
  const [fCategory,  setFCategory]  = useState("All");
  const [fStatus,    setFStatus]    = useState("All");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM());
  const [errors,     setErrors]     = useState<Record<string,string>>({});

  // Expanded state: set of "bundle", "bundle::sport", "bundle::sport::category"
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Talent Detection"]));

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  // ── Filtered tests ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tests.filter((t) => {
      if (q && !t.name.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      if (fSport !== "All") {
        if (t.sports !== "all" && !t.sports.includes(fSport)) return false;
      }
      if (fCategory !== "All" && t.category !== fCategory) return false;
      if (fStatus !== "All" && t.status !== fStatus) return false;
      return true;
    });
  }, [tests, search, fSport, fCategory, fStatus]);

  // ── When search active, auto-expand everything ──────────
  const autoExpand = search.length > 0 || fSport !== "All" || fCategory !== "All" || fStatus !== "All";

  function getTests(bundle: Bundle, sport: string, category: Category) {
    return filtered.filter((t) => {
      const inBundle   = t.bundles.includes(bundle);
      const inSport    = t.sports === "all" || t.sports.includes(sport);
      const inCategory = t.category === category;
      return inBundle && inSport && inCategory;
    });
  }
  function sportHasTests(bundle: Bundle, sport: string) {
    return CATEGORIES.some((cat) => getTests(bundle, sport, cat).length > 0);
  }
  function bundleHasTests(bundle: Bundle) {
    return SPORTS.some((sp) => sportHasTests(bundle, sp));
  }

  // ── Modal helpers ────────────────────────────────────────
  function openModal() { setForm(EMPTY_FORM()); setErrors({}); setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  function setF<K extends keyof ReturnType<typeof EMPTY_FORM>>(k: K, v: ReturnType<typeof EMPTY_FORM>[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = {...e}; delete n[k as string]; return n; });
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!form.name.trim())         e.name     = "Required";
    if (!form.bundles.length)      e.bundles  = "Select at least one bundle";
    if (!form.category)            e.category = "Required";
    if (!form.equipmentLevel)      e.equipmentLevel = "Required";
    if (form.outputVars.some((v) => !v.label.trim())) e.outputVars = "All variable labels are required";
    if (form.outputVars.some((v) => v.unit === "other" && !v.otherUnit.trim())) e.outputVars = "Specify unit for 'other'";
    if (!form.allSports && !form.sports.length) e.sports = "Select at least one sport or toggle 'Applies to All'";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newTest: LibTest = {
      id: `t${Date.now()}`,
      name: form.name.trim(),
      bundles: form.bundles,
      sports: form.allSports ? "all" : form.sports,
      category: form.category as Category,
      equipmentLevel: form.equipmentLevel as "Automated"|"Elite",
      supervisionRequired: form.supervisionRequired,
      minAge: form.minAge ? parseInt(form.minAge) : null,
      maxAge: form.maxAge ? parseInt(form.maxAge) : null,
      presentationTypes: form.presentationTypes,
      status: form.status,
      outputVars: form.outputVars.map((v) => ({
        label: v.label,
        unit: v.unit === "other" ? v.otherUnit : v.unit,
      })),
      citation: form.citation || undefined,
    };
    setTests((prev) => [...prev, newTest]);
    closeModal();
  }

  const isExp = (key: string) => autoExpand || expanded.has(key);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Test Library</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} test{filtered.length !== 1 ? "s" : ""} across {BUNDLES.length} bundles · {SPORTS.length} sports · {CATEGORIES.length} categories
            </p>
          </div>
          <button onClick={openModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add Test
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="Search tests…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <ToolbarSelect label="Sport"    value={fSport}    onChange={setFSport}    options={SPORTS as unknown as string[]} />
          <ToolbarSelect label="Category" value={fCategory} onChange={setFCategory} options={CATEGORIES as unknown as string[]} />
          <ToolbarSelect label="Status"   value={fStatus}   onChange={setFStatus}   options={STATUSES as unknown as string[]} />
        </div>

        {/* ── Nested accordion ── */}
        <div className="space-y-3">
          {(BUNDLES as unknown as Bundle[]).map((bundle) => {
            const bHas = bundleHasTests(bundle);
            if (!bHas) return null;
            return (
              <div key={bundle} className="border border-border rounded-xl overflow-hidden">
                {/* Bundle header */}
                <button
                  onClick={() => toggle(bundle)}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-card hover:bg-muted/30 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <BundleIcon bundle={bundle} />
                    <span className="font-semibold text-foreground">{bundle}</span>
                    <span className="text-xs text-muted-foreground">
                      ({filtered.filter((t) => t.bundles.includes(bundle)).length} tests)
                    </span>
                  </div>
                  {isExp(bundle) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isExp(bundle) && (
                  <div className="divide-y divide-border border-t border-border">
                    {(SPORTS as unknown as string[]).map((sport) => {
                      if (!sportHasTests(bundle as Bundle, sport)) return null;
                      const sportKey = `${bundle}::${sport}`;
                      return (
                        <div key={sport}>
                          {/* Sport header */}
                          <button
                            onClick={() => toggle(sportKey)}
                            className="w-full flex items-center justify-between px-6 py-3 bg-muted/20 hover:bg-muted/40 transition text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{sport}</span>
                            </div>
                            {isExp(sportKey) ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>

                          {isExp(sportKey) && (
                            <div className="divide-y divide-border/50">
                              {(CATEGORIES as unknown as Category[]).map((cat) => {
                                const catTests = getTests(bundle as Bundle, sport, cat);
                                if (!catTests.length) return null;
                                const catKey = `${bundle}::${sport}::${cat}`;
                                return (
                                  <div key={cat}>
                                    {/* Category header */}
                                    <button
                                      onClick={() => toggle(catKey)}
                                      className="w-full flex items-center justify-between px-8 py-2.5 hover:bg-muted/20 transition text-left"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cat}</span>
                                        <span className="text-xs text-muted-foreground/60">({catTests.length})</span>
                                      </div>
                                      {isExp(catKey) ? <ChevronDown className="w-3 h-3 text-muted-foreground/50" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
                                    </button>

                                    {isExp(catKey) && (
                                      <div className="px-8 pb-3">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="border-b border-border/50">
                                              {["Test Name","Bundles","Equipment","Age Range","Outputs","Presentation","Status"].map((h) => (
                                                <th key={h} className="pb-2 pt-1 text-left text-muted-foreground font-semibold uppercase tracking-wide pr-4 whitespace-nowrap">{h}</th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {catTests.map((t) => (
                                              <tr key={t.id} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition">
                                                <td className="py-2.5 pr-4 font-medium text-foreground whitespace-nowrap">
                                                  {t.name}
                                                  {t.supervisionRequired && <AlertTriangle className="w-3 h-3 text-yellow-400 inline ml-1.5" aria-label="Supervision required" />}
                                                </td>
                                                <td className="py-2.5 pr-4">
                                                  <div className="flex flex-wrap gap-1">
                                                    {t.bundles.map((b) => (
                                                      <span key={b} className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-primary/15 text-primary border border-primary/20">{b.split(" ")[0]}</span>
                                                    ))}
                                                  </div>
                                                </td>
                                                <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">{t.equipmentLevel}</td>
                                                <td className="py-2.5 pr-4 text-muted-foreground whitespace-nowrap">
                                                  {t.minAge !== null || t.maxAge !== null
                                                    ? `${t.minAge ?? "—"}–${t.maxAge ?? "∞"}`
                                                    : "Any"}
                                                </td>
                                                <td className="py-2.5 pr-4 text-muted-foreground">
                                                  {t.outputVars.map((v) => `${v.label} (${v.unit})`).join(", ")}
                                                </td>
                                                <td className="py-2.5 pr-4 text-muted-foreground">{t.presentationTypes.join(", ")}</td>
                                                <td className="py-2.5">
                                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_CLS[t.status]}`}>{t.status}</span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
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
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No tests match your current filters.
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          ADD TEST MODAL
      ═══════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">Add New Test</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

              {/* §1 — Identity */}
              <ModalSection num={1} title="Identity">
                <Field label="Test Name" error={errors.name} required>
                  <input type="text" placeholder="e.g. 30m Sprint" value={form.name} onChange={(e) => setF("name", e.target.value)} className={iCls(!!errors.name)} />
                </Field>
              </ModalSection>

              {/* §2 — Program & Sport */}
              <ModalSection num={2} title="Program & Sport">
                <Field label="Bundle" error={errors.bundles} required>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(BUNDLES as unknown as Bundle[]).map((b) => (
                      <button type="button" key={b}
                        onClick={() => setF("bundles", form.bundles.includes(b) ? form.bundles.filter((x) => x !== b) : [...form.bundles, b])}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${form.bundles.includes(b) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Sport Applicability" error={errors.sports}>
                  <div className="flex items-center gap-3 mt-1">
                    <Toggle checked={form.allSports} onChange={(v) => setF("allSports", v)} />
                    <span className="text-sm text-foreground">Applies to All Sports</span>
                  </div>
                  {!form.allSports && (
                    <div className="mt-3 grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {(SPORTS as unknown as string[]).map((s) => (
                        <label key={s} className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground">
                          <input type="checkbox" className="accent-primary" checked={form.sports.includes(s)}
                            onChange={(e) => setF("sports", e.target.checked ? [...form.sports, s] : form.sports.filter((x) => x !== s))} />
                          {s}
                        </label>
                      ))}
                    </div>
                  )}
                </Field>

                <Field label="Category" error={errors.category} required>
                  <select value={form.category} onChange={(e) => setF("category", e.target.value as Category)} className={iCls(!!errors.category)}>
                    <option value="">Select category…</option>
                    {(CATEGORIES as unknown as string[]).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </ModalSection>

              {/* §3 — Output Variables */}
              <ModalSection num={3} title="Recorded Output Variables">
                {errors.outputVars && <p className="text-xs text-red-400 -mt-2">{errors.outputVars}</p>}
                <div className="space-y-3">
                  {form.outputVars.map((v, idx) => (
                    <div key={v.id} className="flex items-start gap-2">
                      <input type="text" placeholder="Variable label" value={v.label}
                        onChange={(e) => setF("outputVars", form.outputVars.map((r) => r.id === v.id ? {...r, label: e.target.value} : r))}
                        className={`${iCls(false)} flex-1`} />
                      <select value={v.unit}
                        onChange={(e) => setF("outputVars", form.outputVars.map((r) => r.id === v.id ? {...r, unit: e.target.value} : r))}
                        className={`${iCls(false)} w-28`}>
                        {(UNITS as unknown as string[]).map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                      {v.unit === "other" && (
                        <input type="text" placeholder="Unit…" value={v.otherUnit}
                          onChange={(e) => setF("outputVars", form.outputVars.map((r) => r.id === v.id ? {...r, otherUnit: e.target.value} : r))}
                          className={`${iCls(false)} w-24`} />
                      )}
                      {form.outputVars.length > 1 && (
                        <button type="button" onClick={() => setF("outputVars", form.outputVars.filter((r) => r.id !== v.id))}
                          className="p-2 text-muted-foreground hover:text-red-400 transition mt-0.5"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setF("outputVars", [...form.outputVars, newVar()])}
                    className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Output Variable
                  </button>
                </div>
              </ModalSection>

              {/* §4 — Derived Metrics */}
              <ModalSection num={4} title="Derived Metrics">
                <div className="flex items-center gap-3">
                  <Toggle checked={form.hasDerived} onChange={(v) => { setF("hasDerived", v); if (v && !form.derivedRows.length) setF("derivedRows", [newRow()]); }} />
                  <span className="text-sm text-foreground">This test produces derived/calculated metrics</span>
                </div>
                {form.hasDerived && (
                  <div className="mt-3 space-y-3">
                    <p className="text-xs text-muted-foreground italic">Reference recorded variable labels exactly as defined above.</p>
                    {form.derivedRows.map((r) => (
                      <div key={r.id} className="grid grid-cols-3 gap-2 items-start">
                        <input type="text" placeholder="Metric name" value={r.name}
                          onChange={(e) => setF("derivedRows", form.derivedRows.map((d) => d.id === r.id ? {...d, name: e.target.value} : d))}
                          className={iCls(false)} />
                        <input type="text" placeholder="Formula e.g. Peak Power / Body Mass" value={r.formula}
                          onChange={(e) => setF("derivedRows", form.derivedRows.map((d) => d.id === r.id ? {...d, formula: e.target.value} : d))}
                          className={iCls(false)} />
                        <div className="flex gap-2">
                          <input type="text" placeholder="Unit" value={r.unit}
                            onChange={(e) => setF("derivedRows", form.derivedRows.map((d) => d.id === r.id ? {...d, unit: e.target.value} : d))}
                            className={`${iCls(false)} flex-1`} />
                          <button type="button" onClick={() => setF("derivedRows", form.derivedRows.filter((d) => d.id !== r.id))}
                            className="p-2 text-muted-foreground hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setF("derivedRows", [...form.derivedRows, newRow()])}
                      className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Derived Metric
                    </button>
                  </div>
                )}
              </ModalSection>

              {/* §5 — Administration */}
              <ModalSection num={5} title="Administration Requirements">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Minimum Equipment Level" error={errors.equipmentLevel} required>
                    <div className="flex gap-3 mt-1">
                      {(EQUIP_LEVELS as unknown as string[]).map((el) => (
                        <label key={el} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                          <input type="radio" name="equipLevel" value={el} checked={form.equipmentLevel === el}
                            onChange={() => setF("equipmentLevel", el as "Automated"|"Elite")} className="accent-primary" />
                          {el}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="Equipment Name">
                    <input type="text" placeholder="e.g. Force plate, Timing gates" value={form.equipmentName}
                      onChange={(e) => setF("equipmentName", e.target.value)} className={iCls(false)} />
                  </Field>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Toggle checked={form.supervisionRequired} onChange={(v) => setF("supervisionRequired", v)} />
                  <span className="text-sm text-foreground">Supervision Required</span>
                </div>
                {form.supervisionRequired && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    A supervision warning will be shown to technicians during test day.
                  </div>
                )}
              </ModalSection>

              {/* §6 — Age & Maturity */}
              <ModalSection num={6} title="Age & Maturity">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Minimum Age">
                    <input type="number" min={1} max={99} placeholder="e.g. 10 (leave blank for none)" value={form.minAge}
                      onChange={(e) => setF("minAge", e.target.value)} className={iCls(false)} />
                  </Field>
                  <Field label="Maximum Age">
                    <input type="number" min={1} max={99} placeholder="e.g. 18 (leave blank for none)" value={form.maxAge}
                      onChange={(e) => setF("maxAge", e.target.value)} className={iCls(false)} />
                  </Field>
                </div>
              </ModalSection>

              {/* §7 — Presentation Type */}
              <ModalSection num={7} title="Presentation Type">
                <div className="grid grid-cols-4 gap-2">
                  {(PRESENTATION_TYPES as unknown as string[]).map((pt) => {
                    const on = form.presentationTypes.includes(pt);
                    return (
                      <button type="button" key={pt}
                        onClick={() => setF("presentationTypes", on ? form.presentationTypes.filter((x) => x !== pt) : [...form.presentationTypes, pt])}
                        className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition text-center ${on ? "bg-primary/20 border-primary text-primary" : "bg-secondary border-border text-muted-foreground hover:border-primary/40"}`}>
                        {on && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {pt}
                      </button>
                    );
                  })}
                </div>
              </ModalSection>

              {/* §8 — Source */}
              <ModalSection num={8} title="Source & Reference (Optional)">
                <textarea rows={2} placeholder="e.g. Haugen et al. (2019). The role of maximal strength…" value={form.citation}
                  onChange={(e) => setF("citation", e.target.value)}
                  className={`${iCls(false)} resize-none`} />
              </ModalSection>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/70 transition">
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition">
                  Save Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════
//  Small helpers
// ═══════════════════════════════════════════════════════════
function iCls(err: boolean) {
  return `w-full px-3 py-2 text-sm bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${err ? "border-red-500/60" : "border-border"}`;
}

function Field({ label, error, required, children }: { label:string; error?:string; required?:boolean; children:React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function ModalSection({ num, title, children }: { num:number; title:string; children:React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">{num}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary border border-border"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
    </button>
  );
}

function ToolbarSelect({ label, value, onChange, options }: { label:string; value:string; onChange:(v:string)=>void; options:string[] }) {
  return (
    <div className="flex flex-col gap-1 min-w-[130px]">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-2 text-xs rounded-lg border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer ${value !== "All" ? "border-primary/60 text-primary" : "border-border"}`}>
        <option value="All">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function BundleIcon({ bundle }: { bundle: Bundle }) {
  const cls = "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold";
  if (bundle === "Talent Detection")    return <span className={`${cls} bg-blue-500/20 text-blue-400`}>TD</span>;
  if (bundle === "Athlete Development") return <span className={`${cls} bg-orange-500/20 text-orange-400`}>AD</span>;
  return                                       <span className={`${cls} bg-purple-500/20 text-purple-400`}>PP</span>;
}
