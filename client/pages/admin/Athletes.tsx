import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Search, Plus, X, ChevronUp, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Program = "Talent Detection" | "Athlete Development" | "Professional Practice";
type SubscriptionTier = "Starter" | "Standard" | "Elite";
type Status = "Trial" | "Active" | "Expired";

interface Athlete {
  id: string;
  name: string;
  email: string;
  contact: string;
  sport: string;
  entityName: string;
  program: Program;
  tier: SubscriptionTier;
  renewalDate: string;
  status: Status;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ATHLETES: Athlete[] = [
  {
    id: "a1",
    name: "Ahmed Al-Mazrouei",
    email: "ahmed.mazrouei@example.ae",
    contact: "+971 50 123 4567",
    sport: "Football",
    entityName: "Zayed FC Academy",
    program: "Athlete Development",
    tier: "Elite",
    renewalDate: "2026-08-14",
    status: "Active",
  },
  {
    id: "a2",
    name: "Fatima Al-Naqbi",
    email: "fatima.naqbi@example.ae",
    contact: "+971 55 987 6543",
    sport: "Athletics",
    entityName: "Desert Runners Club",
    program: "Talent Detection",
    tier: "Starter",
    renewalDate: "2026-06-01",
    status: "Trial",
  },
  {
    id: "a3",
    name: "Mohammed Youssef",
    email: "m.youssef@example.ae",
    contact: "+971 52 441 2200",
    sport: "Swimming",
    entityName: "Emirates Swim Team",
    program: "Professional Practice",
    tier: "Standard",
    renewalDate: "2026-05-10",
    status: "Expired",
  },
  {
    id: "a4",
    name: "Noor Al-Rashidi",
    email: "noor@example.ae",
    contact: "+971 56 330 8819",
    sport: "Basketball",
    entityName: "Abu Dhabi Ballers",
    program: "Athlete Development",
    tier: "Standard",
    renewalDate: "2026-09-22",
    status: "Active",
  },
  {
    id: "a5",
    name: "Khalid Al-Mansoori",
    email: "khalid.mansoori@example.ae",
    contact: "+971 54 771 0034",
    sport: "Tennis",
    entityName: "Falcon Tennis Academy",
    program: "Professional Practice",
    tier: "Elite",
    renewalDate: "2026-11-30",
    status: "Active",
  },
  {
    id: "a6",
    name: "Layla Al-Dosari",
    email: "layla.dosari@example.ae",
    contact: "+971 55 234 5678",
    sport: "Volleyball",
    entityName: "Emirates Volleyball Club",
    program: "Talent Detection",
    tier: "Standard",
    renewalDate: "2026-07-15",
    status: "Active",
  },
  {
    id: "a7",
    name: "Omar Hassan",
    email: "omar.hassan@example.ae",
    contact: "+971 50 555 8888",
    sport: "Football",
    entityName: "Sharjah Youth Academy",
    program: "Athlete Development",
    tier: "Starter",
    renewalDate: "2026-04-20",
    status: "Expired",
  },
  {
    id: "a8",
    name: "Maryam Al-Zaabi",
    email: "maryam.zaabi@example.ae",
    contact: "+971 56 777 9999",
    sport: "Gymnastics",
    entityName: "Dubai Gymnastics Club",
    program: "Professional Practice",
    tier: "Elite",
    renewalDate: "2026-10-05",
    status: "Active",
  },
];

const PROGRAMS: Program[] = ["Talent Detection", "Athlete Development", "Professional Practice"];
const TIERS: SubscriptionTier[] = ["Starter", "Standard", "Elite"];
const STATUSES: Status[] = ["Trial", "Active", "Expired"];
const SPORTS = ["Football", "Athletics", "Swimming", "Basketball", "Tennis", "Rugby", "Cycling", "Volleyball", "Gymnastics", "Other"];

const TIER_BADGE: Record<SubscriptionTier, string> = {
  Starter: "bg-secondary text-secondary-foreground",
  Standard: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Elite: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
};

const STATUS_BADGE: Record<Status, string> = {
  Trial: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Active: "bg-green-500/15 text-green-400 border border-green-500/30",
  Expired: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const PROGRAM_BADGE: Record<Program, string> = {
  "Talent Detection": "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  "Athlete Development": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Professional Practice": "bg-teal-500/15 text-teal-400 border border-teal-500/30",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  contact: "",
  sport: "",
  entityName: "",
  program: "" as Program | "",
  tier: "" as SubscriptionTier | "",
  renewalDate: "",
  status: "" as Status | "",
};

type SortKey = keyof Omit<Athlete, "id">;

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

export default function AdminAthletes() {
  const [athletes, setAthletes] = useState<Athlete[]>(MOCK_ATHLETES);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState<Program | "All">("All");
  const [tierFilter, setTierFilter] = useState<SubscriptionTier | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sportFilter, setSportFilter] = useState<string>("All");
  const [entityFilter, setEntityFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Get unique values for entity filter
  const uniqueEntities = Array.from(new Set(athletes.map(a => a.entityName))).sort();

  const filtered = athletes
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q);
      const matchProgram = programFilter === "All" || a.program === programFilter;
      const matchTier = tierFilter === "All" || a.tier === tierFilter;
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchSport = sportFilter === "All" || a.sport === sportFilter;
      const matchEntity = entityFilter === "All" || a.entityName === entityFilter;
      return matchSearch && matchProgram && matchTier && matchStatus && matchSport && matchEntity;
    })
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function openModal() { setForm({ ...EMPTY_FORM }); setErrors({}); setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  function validate() {
    const e: Partial<Record<keyof typeof EMPTY_FORM, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.contact.trim()) e.contact = "Required";
    if (!form.sport) e.sport = "Required";
    if (!form.entityName.trim()) e.entityName = "Required";
    if (!form.program) e.program = "Required";
    if (!form.tier) e.tier = "Required";
    if (!form.renewalDate) e.renewalDate = "Required";
    if (!form.status) e.status = "Required";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setAthletes((prev) => [...prev, {
      id: `a${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      sport: form.sport,
      entityName: form.entityName.trim(),
      program: form.program as Program,
      tier: form.tier as SubscriptionTier,
      renewalDate: form.renewalDate,
      status: form.status as Status,
    }]);
    closeModal();
  }

  function setField<K extends keyof typeof EMPTY_FORM>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20 inline ml-1" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 opacity-70 inline ml-1" />
      : <ChevronDown className="w-3 h-3 opacity-70 inline ml-1" />;
  }

  const COL_DEFS: [SortKey, string][] = [
    ["name",        "Name"],
    ["email",       "Email"],
    ["contact",     "Contact Number"],
    ["sport",       "Sport"],
    ["entityName",  "Entity"],
    ["program",     "Program"],
    ["tier",        "Subscription Tier"],
    ["renewalDate", "Renewal Date"],
    ["status",      "Status"],
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground">Athletes &amp; Parents</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage registered athletes and their subscription details
            </p>
          </div>
          <button onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add New Athlete
          </button>
        </div>

        {/* Toolbar */}
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="Search by name, email or sport…"
              value={search} onChange={(ev) => setSearch(ev.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Program filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["All", ...PROGRAMS] as const).map((p) => (
                <button key={p} onClick={() => setProgramFilter(p as Program | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${programFilter === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
                  {p === "All" ? "All Programs" : p}
                </button>
              ))}
            </div>

            {/* Tier filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["All", ...TIERS] as const).map((t) => (
                <button key={t} onClick={() => setTierFilter(t as SubscriptionTier | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${tierFilter === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["All", ...STATUSES] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s as Status | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Additional filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Sport filter */}
            <select value={sportFilter} onChange={(ev) => setSportFilter(ev.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
              <option value="All">All Sports</option>
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Entity filter */}
            <select value={entityFilter} onChange={(ev) => setEntityFilter(ev.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
              <option value="All">All Entities</option>
              {uniqueEntities.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {COL_DEFS.map(([key, label]) => (
                    <th key={key} onClick={() => handleSort(key)}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-foreground transition">
                      {label}<SortIcon col={key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={COL_DEFS.length} className="px-4 py-10 text-center text-muted-foreground text-sm">No athletes match your search or filters.</td></tr>
                ) : (
                  filtered.map((a, i) => (
                    <tr key={a.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{a.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.contact}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.sport}</td>
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">{a.entityName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${PROGRAM_BADGE[a.program]}`}>{a.program}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${TIER_BADGE[a.tier]}`}>{a.tier}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(a.renewalDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[a.status]}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/40 border-t border-border">
                    <td colSpan={COL_DEFS.length} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                      {filtered.length} {filtered.length === 1 ? "athlete" : "athletes"}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(ev) => ev.target === ev.currentTarget && closeModal()}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">Add New Athlete</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <Field label="Name" error={errors.name}>
                <input type="text" placeholder="e.g. Ahmed Al-Mazrouei" value={form.name}
                  onChange={(ev) => setField("name", ev.target.value)} className={inputCls(!!errors.name)} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" placeholder="athlete@example.com" value={form.email}
                  onChange={(ev) => setField("email", ev.target.value)} className={inputCls(!!errors.email)} />
              </Field>
              <Field label="Contact Number" error={errors.contact}>
                <input type="text" placeholder="+971 50 000 0000" value={form.contact}
                  onChange={(ev) => setField("contact", ev.target.value)} className={inputCls(!!errors.contact)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sport" error={errors.sport}>
                  <select value={form.sport} onChange={(ev) => setField("sport", ev.target.value)} className={inputCls(!!errors.sport)}>
                    <option value="">Select sport…</option>
                    {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Program" error={errors.program}>
                  <select value={form.program} onChange={(ev) => setField("program", ev.target.value)} className={inputCls(!!errors.program)}>
                    <option value="">Select program…</option>
                    {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Entity Name" error={errors.entityName}>
                <input type="text" placeholder="e.g. Zayed FC Academy" value={form.entityName}
                  onChange={(ev) => setField("entityName", ev.target.value)} className={inputCls(!!errors.entityName)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Subscription Tier" error={errors.tier}>
                  <select value={form.tier} onChange={(ev) => setField("tier", ev.target.value)} className={inputCls(!!errors.tier)}>
                    <option value="">Select tier…</option>
                    {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Status" error={errors.status}>
                  <select value={form.status} onChange={(ev) => setField("status", ev.target.value)} className={inputCls(!!errors.status)}>
                    <option value="">Select status…</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Renewal Date" error={errors.renewalDate}>
                <input type="date" value={form.renewalDate}
                  onChange={(ev) => setField("renewalDate", ev.target.value)} className={inputCls(!!errors.renewalDate)} />
              </Field>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/70 transition">Cancel</button>
                <button type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition">Add Athlete</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-3 py-2 text-sm bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${hasError ? "border-red-500/60" : "border-border"}`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
