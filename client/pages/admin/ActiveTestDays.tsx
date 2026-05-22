import { AdminLayout } from "@/components/AdminLayout";
import { useState, useMemo } from "react";
import {
  Play, CheckCircle2, Circle, Users, MapPin,
  CalendarDays, Phone, Building2, X, ChevronRight,
  Flag, CreditCard, AlertTriangle, Save, ArrowLeft,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
//  TEST → OUTPUT VARIABLES MAP
// ═══════════════════════════════════════════════════════════
const TEST_INPUTS: Record<string, { label: string; unit: string }[]> = {
  "30m Sprint":                    [{ label:"Time", unit:"s" }, { label:"Split 10m", unit:"s" }],
  "60m Sprint":                    [{ label:"Time", unit:"s" }, { label:"Reaction Time", unit:"ms" }],
  "Flying 20m":                    [{ label:"Time", unit:"s" }, { label:"Max Velocity", unit:"m/s" }],
  "Illinois Agility Test":         [{ label:"Time", unit:"s" }],
  "505 Agility Test":              [{ label:"5-0-5 Time", unit:"s" }, { label:"Preferred Leg", unit:"s" }, { label:"Non-Preferred Leg", unit:"s" }],
  "Spider Court Test":             [{ label:"Total Time", unit:"s" }],
  "CMJ":                           [{ label:"Jump Height", unit:"cm" }, { label:"Peak Power", unit:"W" }, { label:"Peak Power/kg", unit:"W/kg" }],
  "Standing Broad Jump":           [{ label:"Distance", unit:"cm" }],
  "Overhead Medicine Ball Throw":  [{ label:"Distance", unit:"m" }],
  "Grip Strength":                 [{ label:"Dominant Hand", unit:"kg" }, { label:"Non-Dominant Hand", unit:"kg" }],
  "1RM Back Squat":                [{ label:"1RM", unit:"kg" }, { label:"1RM/BW Ratio", unit:"index" }],
  "Push-Up Endurance Test":        [{ label:"Repetitions", unit:"reps" }],
  "Yo-Yo Test L1":                 [{ label:"Level", unit:"level" }, { label:"Total Distance", unit:"m" }, { label:"VO2max Est", unit:"score" }],
  "Cooper 12-min Run Test":        [{ label:"Distance", unit:"m" }, { label:"VO2max Est", unit:"score" }],
  "400m Swim Time Trial":          [{ label:"Time", unit:"s" }, { label:"Stroke Rate", unit:"score" }],
  "FMS":                           [{ label:"Total Score", unit:"score" }, { label:"Deep Squat", unit:"score" }, { label:"Hurdle Step", unit:"score" }, { label:"Inline Lunge", unit:"score" }, { label:"Shoulder Mobility", unit:"score" }],
  "Sit & Reach":                   [{ label:"Distance", unit:"cm" }],
  "Single-Leg Balance Test":       [{ label:"Eyes Open – Dom", unit:"s" }, { label:"Eyes Open – Non-Dom", unit:"s" }, { label:"Eyes Closed – Dom", unit:"s" }],
  "Y-Balance Test":                [{ label:"Anterior", unit:"cm" }, { label:"Posteromedial", unit:"cm" }, { label:"Posterolateral", unit:"cm" }, { label:"Composite Score", unit:"%" }],
  "Simple Reaction Time":          [{ label:"Mean RT", unit:"ms" }, { label:"Best RT", unit:"ms" }],
  "Choice Reaction Time":          [{ label:"Mean CRT", unit:"ms" }, { label:"Error Rate", unit:"%" }],
  "Rhythmic Bouncing Test":        [{ label:"Timing Error", unit:"ms" }, { label:"Rhythm Score", unit:"score" }],
  "Anthropometric Battery":        [{ label:"Height", unit:"cm" }, { label:"Body Mass", unit:"kg" }, { label:"Sitting Height", unit:"cm" }, { label:"Leg Length", unit:"cm" }, { label:"BMI", unit:"score" }, { label:"Arm Span", unit:"cm" }],
  "50m Freestyle Sprint":          [{ label:"Time", unit:"s" }, { label:"Stroke Count", unit:"reps" }, { label:"Stroke Rate", unit:"score" }],
  "Wingate Anaerobic Test":        [{ label:"Peak Power", unit:"W" }, { label:"Mean Power", unit:"W" }, { label:"Fatigue Index", unit:"%" }],
  "Pull-Up Endurance":             [{ label:"Repetitions", unit:"reps" }],
};

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
interface Athlete {
  id: string;
  name: string;
  age: number;
  hasPaid: boolean;
}

interface ActiveTestDay {
  id: string;
  requestId: string;
  contact: string;
  contactNumber: string;
  entity: string;
  date: Date;
  time: string;
  location: string;
  athletes: Athlete[];
  tests: string[];
  paidCount: number;
}

// Per-athlete per-test result map: athleteId → testName → { values, completed }
type ResultMap = Record<string, Record<string, { values: Record<string, string>; completed: boolean }>>;

// ═══════════════════════════════════════════════════════════
//  MOCK DATA  (all confirmed bookings)
// ═══════════════════════════════════════════════════════════
const MOCK_ACTIVE: ActiveTestDay[] = [
  {
    id:"td01", requestId:"002",
    contact:"Lina Petrov", contactNumber:"+971 55 234 5678",
    entity:"Sharjah Basketball Club",
    date:new Date(2026,4,26), time:"08:00",
    location:"Sharjah Indoor Arena",
    tests:["CMJ","505 Agility Test","Grip Strength","Yo-Yo Test L1"],
    paidCount:10,
    athletes:[
      {id:"a01",name:"Ahmed Al-Rashid",   age:17,hasPaid:true},
      {id:"a02",name:"Mohammed Yusuf",    age:16,hasPaid:true},
      {id:"a03",name:"Saif Al-Blooshi",   age:18,hasPaid:false},
      {id:"a04",name:"Khalid Hamdan",     age:17,hasPaid:true},
      {id:"a05",name:"Omar Al-Shamsi",    age:16,hasPaid:true},
      {id:"a06",name:"Bilal Hassan",      age:17,hasPaid:false},
      {id:"a07",name:"Yousef Al-Zaabi",   age:18,hasPaid:true},
      {id:"a08",name:"Tariq Mansoor",     age:16,hasPaid:true},
      {id:"a09",name:"Rashed Al-Nuaimi",  age:17,hasPaid:false},
      {id:"a10",name:"Hamad Al-Kaabi",    age:18,hasPaid:true},
      {id:"a11",name:"Faris Khalil",      age:16,hasPaid:true},
      {id:"a12",name:"Zayed Al-Marri",    age:17,hasPaid:true},
    ],
  },
  {
    id:"td02", requestId:"005",
    contact:"Khalid Al-Mansoori", contactNumber:"+971 54 567 8901",
    entity:"Ras Al Khaimah FC",
    date:new Date(2026,5,5), time:"09:00",
    location:"RAK Stadium – Training Ground",
    tests:["FMS","30m Sprint","CMJ","Yo-Yo Test L1","Grip Strength"],
    paidCount:14,
    athletes:[
      {id:"b01",name:"Jaber Al-Suwaidi",  age:22,hasPaid:true},
      {id:"b02",name:"Nasser Al-Falasi",  age:21,hasPaid:true},
      {id:"b03",name:"Salem Al-Muhairi",  age:23,hasPaid:false},
      {id:"b04",name:"Abdulla Khoury",    age:20,hasPaid:true},
      {id:"b05",name:"Humaid Al-Mazrouei",age:22,hasPaid:true},
      {id:"b06",name:"Saeed Bin Omair",   age:21,hasPaid:true},
      {id:"b07",name:"Obaid Al-Shamsi",   age:23,hasPaid:false},
      {id:"b08",name:"Rashid Al-Hassani", age:22,hasPaid:true},
      {id:"b09",name:"Yousif Al-Ahbabi",  age:20,hasPaid:true},
      {id:"b10",name:"Hamdan Al-Zaabi",   age:21,hasPaid:true},
      {id:"b11",name:"Sultan Al-Nuaimi",  age:22,hasPaid:true},
      {id:"b12",name:"Saqer Al-Blooshi",  age:23,hasPaid:true},
      {id:"b13",name:"Khalifa Mansoor",   age:20,hasPaid:true},
      {id:"b14",name:"Ahmad Al-Ketbi",    age:21,hasPaid:true},
      {id:"b15",name:"Majed Al-Falasi",   age:22,hasPaid:false},
      {id:"b16",name:"Ibrahim Khoury",    age:23,hasPaid:true},
    ],
  },
  {
    id:"td03", requestId:"009",
    contact:"Tariq Al-Blooshi", contactNumber:"+971 50 901 2345",
    entity:"Abu Dhabi Handball Club",
    date:new Date(2026,5,15), time:"09:00",
    location:"Abu Dhabi Handball Arena",
    tests:["505 Agility Test","CMJ","Overhead Medicine Ball Throw","Yo-Yo Test L1"],
    paidCount:13,
    athletes:[
      {id:"c01",name:"Ali Al-Kaabi",      age:19,hasPaid:true},
      {id:"c02",name:"Hassan Al-Rashidi", age:20,hasPaid:true},
      {id:"c03",name:"Marwan Al-Shamsi",  age:18,hasPaid:false},
      {id:"c04",name:"Saif Al-Mazrouei", age:20,hasPaid:true},
      {id:"c05",name:"Yousuf Al-Blooshi", age:19,hasPaid:true},
      {id:"c06",name:"Omar Al-Ketbi",     age:21,hasPaid:true},
      {id:"c07",name:"Faisal Al-Marri",   age:19,hasPaid:true},
      {id:"c08",name:"Rashid Al-Suwaidi", age:20,hasPaid:true},
      {id:"c09",name:"Khalid Mansoor",    age:18,hasPaid:false},
      {id:"c10",name:"Ahmad Al-Nuaimi",   age:19,hasPaid:true},
      {id:"c11",name:"Jaber Al-Falasi",   age:20,hasPaid:true},
      {id:"c12",name:"Nasser Al-Ahbabi",  age:21,hasPaid:true},
      {id:"c13",name:"Humaid Al-Zaabi",   age:19,hasPaid:true},
      {id:"c14",name:"Salem Al-Hassani",  age:20,hasPaid:false},
      {id:"c15",name:"Abdulla Al-Shamsi", age:18,hasPaid:true},
      {id:"c16",name:"Obaid Al-Ketbi",    age:19,hasPaid:true},
    ],
  },
  {
    id:"td04", requestId:"014",
    contact:"Reem Al-Marri", contactNumber:"+971 52 456 7802",
    entity:"Dubai Athletics Club",
    date:new Date(2026,6,14), time:"06:30",
    location:"Dubai Athletics Stadium",
    tests:["30m Sprint","60m Sprint","Flying 20m","Wingate Anaerobic Test"],
    paidCount:12,
    athletes:[
      {id:"d01",name:"Noura Al-Rashid",   age:20,hasPaid:true},
      {id:"d02",name:"Fatima Al-Blooshi", age:19,hasPaid:true},
      {id:"d03",name:"Shaikha Al-Marri",  age:21,hasPaid:false},
      {id:"d04",name:"Hessa Al-Falasi",   age:20,hasPaid:true},
      {id:"d05",name:"Maryam Al-Shamsi",  age:18,hasPaid:true},
      {id:"d06",name:"Latifa Al-Nuaimi",  age:21,hasPaid:true},
      {id:"d07",name:"Aisha Al-Suwaidi",  age:20,hasPaid:false},
      {id:"d08",name:"Mahra Al-Ketbi",    age:19,hasPaid:true},
      {id:"d09",name:"Sara Al-Mazrouei",  age:22,hasPaid:true},
      {id:"d10",name:"Reem Al-Kaabi",     age:20,hasPaid:true},
      {id:"d11",name:"Hind Al-Ahbabi",    age:19,hasPaid:true},
      {id:"d12",name:"Dana Al-Zaabi",     age:21,hasPaid:true},
      {id:"d13",name:"Nada Al-Hassani",   age:20,hasPaid:false},
      {id:"d14",name:"Lina Al-Mansoor",   age:18,hasPaid:true},
      {id:"d15",name:"Alia Al-Shamsi",    age:21,hasPaid:true},
    ],
  },
];

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

function buildEmptyResults(athletes: Athlete[], tests: string[]): ResultMap {
  const result: ResultMap = {};
  for (const a of athletes) {
    result[a.id] = {};
    for (const t of tests) {
      const inputs = TEST_INPUTS[t] ?? [{ label:"Score", unit:"" }];
      const values: Record<string,string> = {};
      for (const inp of inputs) values[inp.label] = "";
      result[a.id][t] = { values, completed: false };
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AdminActiveTestDays() {
  const [testDays] = useState<ActiveTestDay[]>(MOCK_ACTIVE);

  // Which test day is "active" (execution mode)
  const [activeDay, setActiveDay] = useState<ActiveTestDay | null>(null);

  // Payment popup: which test day's unpaid list to show
  const [paymentPopup, setPaymentPopup] = useState<string | null>(null);

  // ── Execution state ────────────────────────────────────────
  const [results,         setResults]         = useState<ResultMap>({});
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [inputPopup,      setInputPopup]      = useState<{ athleteId:string; testName:string } | null>(null);
  const [inputValues,     setInputValues]     = useState<Record<string,string>>({});

  // ── Start a test day ───────────────────────────────────────
  function startTestDay(td: ActiveTestDay) {
    setActiveDay(td);
    setResults(buildEmptyResults(td.athletes, td.tests));
    setSelectedAthlete(td.athletes[0]);
    setInputPopup(null);
  }

  // ── Finish test day ────────────────────────────────────────
  function finishTestDay() {
    setActiveDay(null);
    setSelectedAthlete(null);
    setResults({});
  }

  // ── Open input popup for a test ────────────────────────────
  function openInput(athleteId: string, testName: string) {
    const existing = results[athleteId]?.[testName]?.values ?? {};
    setInputValues({ ...existing });
    setInputPopup({ athleteId, testName });
  }

  // ── Save test result ───────────────────────────────────────
  function saveResult() {
    if (!inputPopup) return;
    const { athleteId, testName } = inputPopup;
    setResults((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        [testName]: { values: { ...inputValues }, completed: true },
      },
    }));
    setInputPopup(null);
  }

  // ── Progress helpers ───────────────────────────────────────
  function athleteProgress(athleteId: string, tests: string[]) {
    if (!results[athleteId]) return 0;
    return tests.filter((t) => results[athleteId][t]?.completed).length;
  }

  function allDone(td: ActiveTestDay) {
    return td.athletes.every(
      (a) => td.tests.every((t) => results[a.id]?.[t]?.completed)
    );
  }

  // ── Total progress across all athletes ────────────────────
  const overallProgress = useMemo(() => {
    if (!activeDay) return 0;
    const total = activeDay.athletes.length * activeDay.tests.length;
    if (total === 0) return 0;
    let done = 0;
    for (const a of activeDay.athletes) done += athleteProgress(a.id, activeDay.tests);
    return Math.round((done / total) * 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, results]);

  // ══════════════════════════════════════════════════════════
  //  RENDER — LIST VIEW
  // ══════════════════════════════════════════════════════════
  if (!activeDay) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Active Test Days</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {testDays.length} confirmed test day{testDays.length !== 1 ? "s" : ""} ready to run
            </p>
          </div>

          <div className="space-y-4">
            {testDays.map((td) => {
              const unpaid = td.athletes.filter((a) => !a.hasPaid);
              const isPayOpen = paymentPopup === td.id;
              const pricePerAthlete = 350;

              return (
                <div key={td.id} className="bg-card border border-border rounded-2xl overflow-visible">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">#{td.requestId}</span>
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">{td.entity}</h2>
                        <p className="text-xs text-muted-foreground">{td.contact}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startTestDay(td)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-green-500/20"
                    >
                      <Play className="w-4 h-4 fill-white" /> Start Test Day
                    </button>
                  </div>

                  {/* Info grid */}
                  <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoItem icon={<Phone className="w-3.5 h-3.5"/>}       label="Contact"  value={td.contactNumber} />
                    <InfoItem icon={<CalendarDays className="w-3.5 h-3.5"/>} label="Date"     value={`${fmtDate(td.date)} · ${td.time}`} />
                    <InfoItem icon={<MapPin className="w-3.5 h-3.5"/>}       label="Location" value={td.location} />
                    <InfoItem icon={<Building2 className="w-3.5 h-3.5"/>}    label="Tests"    value={td.tests.join(", ")} truncate />
                  </div>

                  {/* Payment row */}
                  <div className="px-5 pb-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Payment:</span>
                        <span className="text-sm font-semibold text-foreground">
                          {td.paidCount}/{td.athletes.length} athletes
                        </span>
                        <span className="text-sm text-muted-foreground">
                          · AED {(td.paidCount * pricePerAthlete).toLocaleString()}
                        </span>
                      </div>

                      {/* Payment progress bar */}
                      <div className="w-28 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width:`${(td.paidCount/td.athletes.length)*100}%` }}
                        />
                      </div>
                    </div>

                    {unpaid.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setPaymentPopup(isPayOpen ? null : td.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {unpaid.length} unpaid
                          <ChevronRight className={`w-3 h-3 transition-transform ${isPayOpen ? "rotate-90" : ""}`} />
                        </button>

                        {isPayOpen && (
                          <div className="absolute right-0 bottom-9 z-30 w-56 bg-card border border-border rounded-xl shadow-2xl py-2">
                            <p className="px-3 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border mb-1">
                              Unpaid Athletes
                            </p>
                            {unpaid.map((a) => (
                              <div key={a.id} className="flex items-center gap-2 px-3 py-1.5">
                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                                  {a.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                                </div>
                                <span className="text-xs text-foreground">{a.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ══════════════════════════════════════════════════════════
  //  RENDER — EXECUTION VIEW
  // ══════════════════════════════════════════════════════════
  const totalTests  = activeDay.tests.length;
  const totalCells  = activeDay.athletes.length * totalTests;
  const doneCells   = activeDay.athletes.reduce((sum, a) => sum + athleteProgress(a.id, activeDay.tests), 0);

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-card border-b border-border shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button onClick={finishTestDay} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground text-sm leading-tight">{activeDay.entity}</h1>
              <p className="text-xs text-muted-foreground">{fmtDate(activeDay.date)} · {activeDay.time} · {activeDay.location}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{doneCells}/{totalCells}</span> tests recorded
            </div>
            <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width:`${overallProgress}%` }} />
            </div>
            <span className="text-xs font-semibold text-primary">{overallProgress}%</span>
          </div>

          <button
            onClick={finishTestDay}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              allDone(activeDay)
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                : "bg-secondary text-secondary-foreground border border-border"
            }`}
          >
            <Flag className="w-4 h-4" />
            {allDone(activeDay) ? "Finish Test Day" : "Finish Test Day"}
          </button>
        </div>

        {/* ── Main split ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── LEFT: Athlete queue ── */}
          <div className="w-72 shrink-0 border-r border-border overflow-y-auto bg-card/50">
            <div className="px-4 py-3 border-b border-border sticky top-0 bg-card z-10">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Athlete Queue
                <span className="ml-auto text-muted-foreground font-normal">{activeDay.athletes.length} athletes</span>
              </p>
            </div>

            <div className="py-2">
              {activeDay.athletes.map((athlete, idx) => {
                const done  = athleteProgress(athlete.id, activeDay.tests);
                const isAll = done === totalTests;
                const isSel = selectedAthlete?.id === athlete.id;

                return (
                  <button
                    key={athlete.id}
                    onClick={() => setSelectedAthlete(athlete)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition text-left ${
                      isSel ? "bg-primary/10 border-r-2 border-primary" : "hover:bg-secondary/60"
                    }`}
                  >
                    {/* Queue number */}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isAll ? "bg-green-500 text-white" : isSel ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>{idx+1}</span>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSel ? "text-primary" : "text-foreground"}`}>{athlete.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {done}/{totalTests} tests · Age {athlete.age}
                      </p>
                    </div>

                    {/* Mini progress dots */}
                    <div className="flex gap-0.5 shrink-0">
                      {activeDay.tests.map((t) => (
                        <span key={t} className={`w-1.5 h-1.5 rounded-full ${results[athlete.id]?.[t]?.completed ? "bg-green-400" : "bg-secondary border border-border"}`} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Test list ── */}
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedAthlete ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Select an athlete from the queue</p>
              </div>
            ) : (
              <>
                {/* Athlete header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <span className="text-base font-bold text-primary">
                      {selectedAthlete.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedAthlete.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Age {selectedAthlete.age} ·{" "}
                      {athleteProgress(selectedAthlete.id, activeDay.tests)}/{totalTests} tests completed ·{" "}
                      {selectedAthlete.hasPaid
                        ? <span className="text-green-400 font-medium">Paid</span>
                        : <span className="text-red-400 font-medium">Unpaid</span>
                      }
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round((athleteProgress(selectedAthlete.id, activeDay.tests)/totalTests)*100)}%
                    </p>
                  </div>
                </div>

                {/* Test cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeDay.tests.map((testName) => {
                    const res       = results[selectedAthlete.id]?.[testName];
                    const done      = res?.completed ?? false;
                    const inputs    = TEST_INPUTS[testName] ?? [{ label:"Score", unit:"" }];

                    return (
                      <button
                        key={testName}
                        onClick={() => !done && openInput(selectedAthlete.id, testName)}
                        className={`relative text-left p-4 rounded-xl border transition ${
                          done
                            ? "bg-green-500/10 border-green-500/30 cursor-default"
                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {done
                              ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                              : <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                            }
                            <div>
                              <p className={`text-sm font-semibold ${done ? "text-green-400" : "text-foreground"}`}>{testName}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {inputs.map(i=>`${i.label} (${i.unit})`).join(" · ")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Show saved values if done */}
                        {done && res && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {inputs.map(inp=>(
                              <span key={inp.label} className="text-xs px-2 py-0.5 rounded-md bg-green-500/20 text-green-300 border border-green-500/30">
                                {inp.label}: <strong>{res.values[inp.label]}</strong> {inp.unit}
                              </span>
                            ))}
                          </div>
                        )}

                        {!done && (
                          <div className="mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition">
                            Tap to record →
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Bottom finish bar ── */}
        <div className="shrink-0 border-t border-border bg-card px-6 py-3 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{doneCells}</span> of{" "}
            <span className="text-foreground font-semibold">{totalCells}</span> test results recorded across {activeDay.athletes.length} athletes
          </div>
          <button
            onClick={finishTestDay}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition ${
              allDone(activeDay)
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 animate-pulse"
                : "bg-secondary text-secondary-foreground border border-border"
            }`}
          >
            <Flag className="w-4 h-4" />
            Finish Test Day
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TEST INPUT POPUP
      ═══════════════════════════════════════════════════════ */}
      {inputPopup && (() => {
        const { athleteId, testName } = inputPopup;
        const athlete = activeDay.athletes.find(a=>a.id===athleteId);
        const inputs  = TEST_INPUTS[testName] ?? [{ label:"Score", unit:"" }];
        const allFilled = inputs.every(i => (inputValues[i.label]??"").trim() !== "");

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => e.target===e.currentTarget && setInputPopup(null)}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground">{athlete?.name}</p>
                  <h2 className="text-base font-bold text-foreground mt-0.5">{testName}</h2>
                </div>
                <button onClick={()=>setInputPopup(null)} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Input fields */}
              <div className="px-5 py-5 space-y-4">
                {inputs.map((inp) => (
                  <div key={inp.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {inp.label} {inp.unit && <span className="text-primary normal-case font-normal">({inp.unit})</span>}
                    </label>
                    <input
                      type="number"
                      step="any"
                      autoFocus={inputs[0].label === inp.label}
                      placeholder={`Enter ${inp.label.toLowerCase()}…`}
                      value={inputValues[inp.label] ?? ""}
                      onChange={e=>setInputValues(v=>({...v,[inp.label]:e.target.value}))}
                      onKeyDown={(e)=>e.key==="Enter" && allFilled && saveResult()}
                      className="w-full px-4 py-3 text-lg font-semibold bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition text-center"
                    />
                  </div>
                ))}
              </div>

              {/* Save button */}
              <div className="px-5 pb-5">
                <button
                  onClick={saveResult}
                  disabled={!allFilled}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                >
                  <Save className="w-4 h-4" /> Save Result
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════
//  Small helpers
// ═══════════════════════════════════════════════════════════
function InfoItem({ icon, label, value, truncate }: { icon:React.ReactNode; label:string; value:string; truncate?:boolean }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={`text-sm text-foreground ${truncate ? "truncate" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
