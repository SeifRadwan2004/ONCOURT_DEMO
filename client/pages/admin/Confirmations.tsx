import { AdminLayout } from "@/components/AdminLayout";
import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, X, Plus, Trash2,
  CheckCircle2, Clock, XCircle, MapPin, Users,
  CalendarDays, FlaskConical, Send, AlertTriangle,
  Building2, Phone, User, Search,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
type ReqStatus = "Pending" | "Confirmed" | "Declined";

interface TestDayRequest {
  id: string;
  requestId: string;
  requester: string;
  contact: string;
  entity: string;
  requestedDate: Date;
  requestedTime: string;
  numAthletes: number;
  location: string;
  status: ReqStatus;
  groupFolder: string;
  selectedTests: string[];
  sport: string;
}

// ═══════════════════════════════════════════════════════════
//  MOCK DATA  (May – July 2026)
// ═══════════════════════════════════════════════════════════
const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

const MOCK_REQUESTS: TestDayRequest[] = [
  { id:"r01", requestId:"001", requester:"James Al-Farsi",    contact:"+971 50 123 4567", entity:"Dubai FC Academy",        requestedDate:d(2026,5,24), requestedTime:"09:00", numAthletes:18, location:"Dubai Sports City – Field A",  status:"Pending",   groupFolder:"Dubai FC – U15 Squad",        selectedTests:["30m Sprint","CMJ","Illinois Agility Test","Grip Strength"], sport:"Football" },
  { id:"r02", requestId:"002", requester:"Lina Petrov",       contact:"+971 55 234 5678", entity:"Sharjah Basketball Club",  requestedDate:d(2026,5,26), requestedTime:"08:00", numAthletes:12, location:"Sharjah Indoor Arena",           status:"Confirmed", groupFolder:"SBC – U18 Development",       selectedTests:["CMJ","505 Agility Test","Grip Strength","Yo-Yo Test L1"],    sport:"Basketball" },
  { id:"r03", requestId:"003", requester:"Omar Khalil",       contact:"+971 52 345 6789", entity:"Abu Dhabi Tennis Academy", requestedDate:d(2026,5,28), requestedTime:"10:00", numAthletes:8,  location:"ADTA – Court Complex",           status:"Pending",   groupFolder:"ADTA – Elite Junior Program",  selectedTests:["Spider Court Test","Simple Reaction Time","Anthropometric Battery"], sport:"Tennis" },
  { id:"r04", requestId:"004", requester:"Sara Mansour",      contact:"+971 50 456 7890", entity:"Al Ain Athletic Club",     requestedDate:d(2026,6,2),  requestedTime:"07:30", numAthletes:22, location:"Al Ain Sports Complex",          status:"Pending",   groupFolder:"AAAC – Sprint Academy",       selectedTests:["30m Sprint","60m Sprint","Flying 20m","Standing Broad Jump"], sport:"Sprint Running" },
  { id:"r05", requestId:"005", requester:"Khalid Al-Mansoori",contact:"+971 54 567 8901", entity:"Ras Al Khaimah FC",        requestedDate:d(2026,6,5),  requestedTime:"09:00", numAthletes:16, location:"RAK Stadium – Training Ground",   status:"Confirmed", groupFolder:"RAK FC – Senior Squad",       selectedTests:["FMS","30m Sprint","CMJ","Yo-Yo Test L1","Grip Strength"],    sport:"Football" },
  { id:"r06", requestId:"006", requester:"Nour El-Sayed",     contact:"+971 56 678 9012", entity:"Dubai Swimming Federation",requestedDate:d(2026,6,8),  requestedTime:"06:30", numAthletes:14, location:"Hamdan Sports Complex – Pool",    status:"Pending",   groupFolder:"DSF – Junior Swimmers",       selectedTests:["50m Freestyle Sprint","400m Swim Time Trial","Anthropometric Battery"], sport:"Swimming" },
  { id:"r07", requestId:"007", requester:"Faisal Al-Rashidi", contact:"+971 55 789 0123", entity:"Fujairah Boxing Club",     requestedDate:d(2026,6,10), requestedTime:"10:00", numAthletes:10, location:"Fujairah Sports Academy",        status:"Declined",  groupFolder:"FBC – Amateur Division",      selectedTests:["Simple Reaction Time","Push-Up Endurance Test","Grip Strength"], sport:"Boxing" },
  { id:"r08", requestId:"008", requester:"Amira Hassan",      contact:"+971 52 890 1234", entity:"Sharjah Gymnastics Fed",  requestedDate:d(2026,6,12), requestedTime:"08:30", numAthletes:20, location:"Sharjah Gymnastics Hall",         status:"Pending",   groupFolder:"SGF – National Squad",        selectedTests:["Y-Balance Test","Single-Leg Balance Test","Rhythmic Bouncing Test","FMS"], sport:"Gymnastics" },
  { id:"r09", requestId:"009", requester:"Tariq Al-Blooshi",  contact:"+971 50 901 2345", entity:"Abu Dhabi Handball Club",  requestedDate:d(2026,6,15), requestedTime:"09:00", numAthletes:16, location:"Abu Dhabi Handball Arena",        status:"Confirmed", groupFolder:"ADHC – U20 Team",             selectedTests:["505 Agility Test","CMJ","Overhead Medicine Ball Throw","Yo-Yo Test L1"], sport:"Handball" },
  { id:"r10", requestId:"010", requester:"Dina Al-Zaabi",     contact:"+971 54 012 3456", entity:"Dubai Running Academy",   requestedDate:d(2026,6,18), requestedTime:"06:00", numAthletes:30, location:"Meydan Track & Field",            status:"Pending",   groupFolder:"DRA – Distance Programme",    selectedTests:["Cooper 12-min Run Test","Anthropometric Battery","Grip Strength"], sport:"Distance Running" },
  { id:"r11", requestId:"011", requester:"Hassan Al-Suwaidi", contact:"+971 56 123 4560", entity:"Al Wasl FC",              requestedDate:d(2026,6,20), requestedTime:"08:00", numAthletes:24, location:"Al Wasl FC Training Facility",    status:"Pending",   groupFolder:"Al Wasl – Reserve Squad",     selectedTests:["30m Sprint","CMJ","Illinois Agility Test","Grip Strength","FMS"], sport:"Football" },
  { id:"r12", requestId:"012", requester:"Yousra El-Amin",    contact:"+971 55 234 5600", entity:"Sharjah Volleyball Club", requestedDate:d(2026,7,3),  requestedTime:"09:00", numAthletes:12, location:"Sharjah Indoor Sports Hall",      status:"Pending",   groupFolder:"SVC – Women's First Team",    selectedTests:["CMJ","Standing Broad Jump","505 Agility Test"],               sport:"Volleyball" },
  { id:"r13", requestId:"013", requester:"Majid Al-Nuaimi",   contact:"+971 50 345 6701", entity:"Ajman Football Club",     requestedDate:d(2026,7,7),  requestedTime:"07:30", numAthletes:20, location:"Ajman FC Stadium",               status:"Pending",   groupFolder:"AFC – Academy U17",           selectedTests:["30m Sprint","CMJ","Grip Strength","Illinois Agility Test"],   sport:"Football" },
  { id:"r14", requestId:"014", requester:"Reem Al-Marri",     contact:"+971 52 456 7802", entity:"Dubai Athletics Club",    requestedDate:d(2026,7,14), requestedTime:"06:30", numAthletes:15, location:"Dubai Athletics Stadium",         status:"Confirmed", groupFolder:"DAC – Sprints Group",         selectedTests:["30m Sprint","60m Sprint","Flying 20m","Wingate Anaerobic Test"], sport:"Sprint Running" },
  { id:"r15", requestId:"015", requester:"Bilal Khoury",      contact:"+971 54 567 8903", entity:"Ras Al Khaimah Swimming",requestedDate:d(2026,7,18), requestedTime:"07:00", numAthletes:16, location:"RAK Aquatic Centre",              status:"Pending",   groupFolder:"RAKS – Junior Programme",     selectedTests:["50m Freestyle Sprint","400m Swim Time Trial","Anthropometric Battery"], sport:"Swimming" },
];

const ALL_TESTS = [
  "30m Sprint","60m Sprint","Flying 20m","Illinois Agility Test","505 Agility Test",
  "Spider Court Test","CMJ","Standing Broad Jump","Overhead Medicine Ball Throw",
  "Grip Strength","1RM Back Squat","Push-Up Endurance Test","Yo-Yo Test L1",
  "Cooper 12-min Run Test","400m Swim Time Trial","FMS","Sit & Reach",
  "Single-Leg Balance Test","Y-Balance Test","Simple Reaction Time","Choice Reaction Time",
  "Rhythmic Bouncing Test","Anthropometric Battery","50m Freestyle Sprint",
  "Wingate Anaerobic Test","Pull-Up Endurance",
];

// ═══════════════════════════════════════════════════════════
//  STATUS CONFIG
// ═══════════════════════════════════════════════════════════
const STATUS_CFG: Record<ReqStatus, { label:string; cls:string; dot:string; icon: React.FC<{className?:string}> }> = {
  Pending:   { label:"Pending",   cls:"bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",  dot:"bg-yellow-400", icon: Clock },
  Confirmed: { label:"Confirmed", cls:"bg-green-500/15  text-green-400  border border-green-500/30",   dot:"bg-green-400",  icon: CheckCircle2 },
  Declined:  { label:"Declined",  cls:"bg-red-500/15    text-red-400    border border-red-500/30",     dot:"bg-red-400",    icon: XCircle },
};

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
function isoDate(d: Date) { return d.toISOString().slice(0,10); }
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AdminConfirmations() {
  const [requests, setRequests] = useState<TestDayRequest[]>(MOCK_REQUESTS);

  // ── Calendar state ────────────────────────────────────────
  const [calYear,  setCalYear]  = useState(2026);
  const [calMonth, setCalMonth] = useState(5); // 1-indexed
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // ── Table filters ─────────────────────────────────────────
  const [search,    setSearch]    = useState("");
  const [fStatus,   setFStatus]   = useState<ReqStatus|"All">("All");
  const [fDate,     setFDate]     = useState("");
  const [fEntity,   setFEntity]   = useState("All");
  const [page,      setPage]      = useState(1);
  const PAGE_SIZE = 8;

  // ── Approval modal ────────────────────────────────────────
  const [selectedReq, setSelectedReq] = useState<TestDayRequest|null>(null);
  const [form, setForm] = useState(emptyApprovalForm(null));

  // ── Amendment sub-panel ───────────────────────────────────
  const [amendOpen, setAmendOpen] = useState(false);
  const [amendNote, setAmendNote] = useState("");

  // ── Toast ─────────────────────────────────────────────────
  const [toast, setToast] = useState<{msg:string;kind:"success"|"info"}|null>(null);
  function showToast(msg:string, kind:"success"|"info"="success") {
    setToast({msg,kind});
    setTimeout(() => setToast(null), 3200);
  }

  // ── Calendar helpers ───────────────────────────────────────
  const calDays = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  function prevMonth() { calMonth === 1 ? (setCalYear(y=>y-1), setCalMonth(12)) : setCalMonth(m=>m-1); }
  function nextMonth() { calMonth === 12 ? (setCalYear(y=>y+1), setCalMonth(1)) : setCalMonth(m=>m+1); }

  function dotsByDay(iso: string): ReqStatus[] {
    return requests.filter((r) => isoDate(r.requestedDate) === iso).map((r) => r.status);
  }

  function handleDayClick(iso: string) {
    setSelectedDay((prev) => prev === iso ? null : iso);
    setSearch("");
    setFStatus("All");
    setFDate(iso);
    setPage(1);
  }

  // ── Derived entity list ────────────────────────────────────
  const entities = useMemo(() => ["All", ...Array.from(new Set(requests.map((r) => r.entity))).sort()], [requests]);

  // ── Filtered table rows ────────────────────────────────────
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (fStatus !== "All" && r.status !== fStatus) return false;
      if (fDate && isoDate(r.requestedDate) !== fDate) return false;
      if (fEntity !== "All" && r.entity !== fEntity) return false;
      const q = search.toLowerCase();
      if (q && ![r.requester,r.entity,r.location,r.requestId].some(s=>s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [requests, fStatus, fDate, fEntity, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows   = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // ── Open modal ─────────────────────────────────────────────
  function openModal(r: TestDayRequest) {
    setSelectedReq(r);
    setForm(emptyApprovalForm(r));
    setAmendOpen(false);
    setAmendNote("");
  }
  function closeModal() { setSelectedReq(null); }

  // ── Confirm booking ────────────────────────────────────────
  function handleConfirm() {
    if (!selectedReq) return;
    setRequests((prev) => prev.map((r) => r.id === selectedReq.id ? {...r, status:"Confirmed"} : r));
    // TODO: POST /api/confirmations/:id/confirm — { form, recipients: ["coach","athletes"] }
    showToast(`Booking #${selectedReq.requestId} confirmed. Notification sent to coach + athletes.`);
    closeModal();
  }

  // ── Send amendments ────────────────────────────────────────
  function handleAmend() {
    if (!selectedReq || !amendNote.trim()) return;
    // TODO: POST /api/confirmations/:id/amend — { form, amendNote }
    showToast(`Amendments sent to ${selectedReq.requester}.`, "info");
    closeModal();
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Test Day Confirmations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {requests.filter(r=>r.status==="Pending").length} pending ·{" "}
            {requests.filter(r=>r.status==="Confirmed").length} confirmed ·{" "}
            {requests.filter(r=>r.status==="Declined").length} declined
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — CALENDAR
        ══════════════════════════════════════════════════════ */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Test Day Schedule</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mr-2">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Confirmed</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Pending</span>
              </div>
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm font-semibold text-foreground w-32 text-center">
                {new Date(calYear, calMonth-1).toLocaleDateString("en-GB", {month:"long", year:"numeric"})}
              </span>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Grid */}
          <div className="p-4">
            {/* Day names */}
            <div className="grid grid-cols-7 mb-1">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide py-1">{d}</div>
              ))}
            </div>
            {/* Weeks */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((cell, i) => {
                if (!cell) return <div key={i} />;
                const dots = dotsByDay(cell.iso);
                const isToday = cell.iso === isoDate(new Date());
                const isSel   = selectedDay === cell.iso;
                const hasEvents = dots.length > 0;
                return (
                  <button
                    key={i}
                    onClick={() => hasEvents && handleDayClick(cell.iso)}
                    className={`relative flex flex-col items-center py-2 rounded-xl transition text-sm
                      ${isSel      ? "bg-primary/20 ring-2 ring-primary"   : ""}
                      ${isToday && !isSel ? "ring-2 ring-primary/40 bg-primary/5" : ""}
                      ${hasEvents  ? "cursor-pointer hover:bg-secondary"   : "cursor-default opacity-70"}
                      ${!hasEvents && !isToday ? "" : ""}
                    `}
                  >
                    <span className={`font-medium ${isSel ? "text-primary" : isToday ? "text-primary" : "text-foreground"}`}>{cell.day}</span>
                    {dots.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from(new Set(dots)).map((s) => (
                          <span key={s} className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[s].dot}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day detail strip */}
          {selectedDay && (() => {
            const dayReqs = requests.filter(r => isoDate(r.requestedDate) === selectedDay);
            return (
              <div className="border-t border-border px-5 py-3 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Events on {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}
                  </p>
                  <button onClick={()=>{setSelectedDay(null);setFDate("");}} className="text-xs text-muted-foreground hover:text-foreground transition">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dayReqs.map((r) => {
                    const S = STATUS_CFG[r.status];
                    return (
                      <button key={r.id} onClick={() => openModal(r)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition hover:opacity-80 ${S.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`} />
                        #{r.requestId} · {r.entity} · {r.requestedTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — REQUESTS TABLE
        ══════════════════════════════════════════════════════ */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-wrap items-end gap-3 px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input type="text" placeholder="Search requester, entity, location…" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            </div>
            <TSelect label="Status" value={fStatus} onChange={(v)=>{setFStatus(v as ReqStatus|"All");setPage(1);}}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Declined">Declined</option>
            </TSelect>
            <TSelect label="Date" value={fDate} onChange={(v)=>{setFDate(v);setPage(1);}}>
              <option value="">All Dates</option>
              {Array.from(new Set(requests.map(r=>isoDate(r.requestedDate)))).sort().map(d=>(
                <option key={d} value={d}>{new Date(d+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</option>
              ))}
            </TSelect>
            <TSelect label="Entity" value={fEntity} onChange={(v)=>{setFEntity(v);setPage(1);}}>
              {entities.map(e=><option key={e} value={e}>{e}</option>)}
            </TSelect>
            {(fStatus!=="All"||fDate||fEntity!=="All"||search) && (
              <button onClick={()=>{setFStatus("All");setFDate("");setFEntity("All");setSearch("");setSelectedDay(null);setPage(1);}}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["ID","Requester","Contact","Club / Entity","Date","Athletes","Location","Status"].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">No requests match the current filters.</td></tr>
                )}
                {pageRows.map((r) => {
                  const S = STATUS_CFG[r.status];
                  const SIcon = S.icon;
                  return (
                    <tr key={r.id}
                      onClick={() => openModal(r)}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer transition">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{r.requestId}</td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.requester}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.contact}</td>
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">{r.entity}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(r.requestedDate)} {r.requestedTime}</td>
                      <td className="px-4 py-3 text-center text-foreground">{r.numAthletes}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{r.location}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${S.cls}`}>
                          <SIcon className="w-3 h-3" />{S.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {filtered.length} result{filtered.length!==1?"s":""} · page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition ${p===page?"bg-primary text-primary-foreground":"hover:bg-secondary text-muted-foreground"}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          APPROVAL MODAL
      ═════════════════════════════════════════════════════════ */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => e.target===e.currentTarget && closeModal()}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">#{selectedReq.requestId}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_CFG[selectedReq.status].cls}`}>
                    {selectedReq.status}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-foreground mt-0.5">{selectedReq.entity}</h2>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

              {/* ── Section 1: Request Overview ── */}
              <ModalSection num={1} title="Request Overview">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow icon={<User className="w-3.5 h-3.5" />}     label="Group Folder"  value={selectedReq.groupFolder} />
                  <InfoRow icon={<CalendarDays className="w-3.5 h-3.5"/>} label="Date & Time" value={`${fmtDate(selectedReq.requestedDate)} at ${selectedReq.requestedTime}`} />
                  <InfoRow icon={<Users className="w-3.5 h-3.5" />}    label="Athletes"      value={String(selectedReq.numAthletes)} />
                  <InfoRow icon={<MapPin className="w-3.5 h-3.5" />}   label="Location"      value={selectedReq.location} />
                  <InfoRow icon={<Phone className="w-3.5 h-3.5" />}    label="Contact"       value={selectedReq.contact} />
                  <InfoRow icon={<Building2 className="w-3.5 h-3.5"/>} label="Entity"        value={selectedReq.entity} />
                </div>
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                    <FlaskConical className="w-3 h-3" /> Requested Tests
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedReq.selectedTests.map(t=>(
                      <span key={t} className="px-2 py-0.5 rounded-md text-xs bg-secondary border border-border text-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </ModalSection>

              {/* ── Section 2: Approval & Editing ── */}
              <ModalSection num={2} title="Approval & Editing">
                <div className="space-y-5">

                  {/* Approve Group Folder */}
                  <MField label="Approve Group Folder" required>
                    <input type="text" value={form.approvedFolder}
                      onChange={e=>setForm(f=>({...f,approvedFolder:e.target.value}))}
                      className={mInput} />
                  </MField>

                  {/* Test list */}
                  <MField label="Test List — Approval / Edit" required>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.approvedTests.map(t=>(
                        <span key={t} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-md text-xs bg-primary/15 border border-primary/30 text-primary">
                          {t}
                          <button onClick={()=>setForm(f=>({...f,approvedTests:f.approvedTests.filter(x=>x!==t)}))}
                            className="hover:text-red-400 transition ml-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <select
                        value=""
                        onChange={e=>{
                          const v = e.target.value;
                          if (v && !form.approvedTests.includes(v)) setForm(f=>({...f,approvedTests:[...f.approvedTests,v]}));
                        }}
                        className={mInput}>
                        <option value="">+ Add test…</option>
                        {ALL_TESTS.filter(t=>!form.approvedTests.includes(t)).map(t=>(
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </MField>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Technicians */}
                    <MField label="Needed Technicians" required>
                      <input type="number" min={1} max={20} value={form.technicians}
                        onChange={e=>setForm(f=>({...f,technicians:e.target.value}))}
                        className={mInput} placeholder="e.g. 3" />
                    </MField>

                    {/* Equipment level */}
                    <MField label="Equipment Stack Level" required>
                      <select value={form.equipmentLevel}
                        onChange={e=>setForm(f=>({...f,equipmentLevel:e.target.value as "Automated"|"Elite"}))}
                        className={mInput}>
                        <option value="Automated">Automated</option>
                        <option value="Elite">Elite</option>
                      </select>
                    </MField>
                  </div>

                  {/* Price per athlete */}
                  <MField label="Price Per Athlete (AED)" required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">AED</span>
                      <input type="number" min={0} value={form.pricePerAthlete}
                        onChange={e=>setForm(f=>({...f,pricePerAthlete:e.target.value}))}
                        className={`${mInput} pl-12`} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total estimate: <span className="text-foreground font-semibold">
                        AED {((parseFloat(form.pricePerAthlete)||0)*selectedReq.numAthletes).toLocaleString()}
                      </span> ({selectedReq.numAthletes} athletes)
                    </p>
                  </MField>

                  {/* Comments */}
                  <MField label="Additional Comments (optional)">
                    <textarea rows={3} value={form.comments} placeholder="Internal notes for this booking…"
                      onChange={e=>setForm(f=>({...f,comments:e.target.value}))}
                      className={`${mInput} resize-none`} />
                  </MField>
                </div>
              </ModalSection>

              {/* ── Section 3: Actions ── */}
              <ModalSection num={3} title="Actions">
                <div className="space-y-3">

                  {/* Confirm Booking */}
                  <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Confirm Booking</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Sends approved test day details, payment request (AED {((parseFloat(form.pricePerAthlete)||0)*selectedReq.numAthletes).toLocaleString()}),
                          and confirmed schedule to <strong className="text-foreground">coach + all {selectedReq.numAthletes} athletes</strong>.
                        </p>
                      </div>
                    </div>
                    <button onClick={handleConfirm}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition">
                      <Send className="w-4 h-4" /> Confirm &amp; Notify All
                    </button>
                  </div>

                  {/* Send Amendments */}
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Send Amendments to Coach</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Sends highlighted changes or declination reason only to <strong className="text-foreground">{selectedReq.requester}</strong>.
                        </p>
                      </div>
                    </div>
                    {!amendOpen ? (
                      <button onClick={()=>setAmendOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-yellow-500/40 text-yellow-400 text-sm font-semibold hover:bg-yellow-500/10 transition">
                        <Send className="w-4 h-4" /> Compose Amendment
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <textarea rows={4} value={amendNote} placeholder="Describe the amendments, requested changes, or declination reason…"
                          onChange={e=>setAmendNote(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-secondary border border-yellow-500/40 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/30 resize-none transition" />
                        <div className="flex gap-2">
                          <button onClick={()=>setAmendOpen(false)}
                            className="flex-1 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/70 transition">
                            Cancel
                          </button>
                          <button onClick={handleAmend} disabled={!amendNote.trim()}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:opacity-40">
                            Send to Coach
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ModalSection>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all
          ${toast.kind==="success" ? "bg-green-500/20 border-green-500/40 text-green-300" : "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"}`}>
          {toast.kind==="success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Send className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════
//  HELPERS & SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════
function emptyApprovalForm(r: TestDayRequest | null) {
  return {
    approvedFolder:  r?.groupFolder ?? "",
    approvedTests:   r ? [...r.selectedTests] : [],
    technicians:     "",
    equipmentLevel:  "Automated" as "Automated"|"Elite",
    pricePerAthlete: "350",
    comments:        "",
  };
}

function buildCalendar(year: number, month: number): ({ day:number; iso:string }|null)[] {
  const firstDow = new Date(year, month-1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: ({ day:number; iso:string }|null)[] = [];
  for (let i=0; i<firstDow; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) {
    const iso = `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    cells.push({ day:d, iso });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const mInput = "w-full px-3 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

function MField({ label, required, children }: { label:string; required?:boolean; children:React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
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

function InfoRow({ icon, label, value }: { icon:React.ReactNode; label:string; value:string }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function TSelect({ label, value, onChange, children }: { label:string; value:string; onChange:(v:string)=>void; children:React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className={`px-3 py-2 text-xs rounded-lg border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition cursor-pointer ${value&&value!=="All" ? "border-primary/60 text-primary" : "border-border"}`}>
        {children}
      </select>
    </div>
  );
}
