import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Search, Plus, X, ChevronUp, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Program = "Talent Detection" | "Athlete Development" | "Professional Practice";
type Tier    = "Starter" | "Standard" | "Elite";
type Status  = "Trial" | "Active" | "Expired";

interface AthleteRecord {
  id: string;
  name: string;
  email: string;
  contact: string;
  sport: string;
  program: Program;
  tier: Tier;
  renewalDate: string;
  status: Status;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ATHLETES: AthleteRecord[] = [
  { id:"p01", name:"Ahmed Al-Rashid",    email:"ahmed.r@gmail.com",       contact:"+971 50 111 2233", sport:"Football",        program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-08-01", status:"Active"  },
  { id:"p02", name:"Fatima Al-Blooshi",  email:"fatima.b@gmail.com",       contact:"+971 55 223 3445", sport:"Sprint Running",  program:"Athlete Development",    tier:"Standard", renewalDate:"2026-09-15", status:"Active"  },
  { id:"p03", name:"Omar Al-Shamsi",     email:"omar.shamsi@outlook.com",  contact:"+971 52 334 4556", sport:"Basketball",      program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-06-10", status:"Trial"   },
  { id:"p04", name:"Noura Al-Nuaimi",    email:"noura.n@gmail.com",        contact:"+971 56 445 5667", sport:"Tennis",          program:"Athlete Development",    tier:"Elite",    renewalDate:"2026-11-22", status:"Active"  },
  { id:"p05", name:"Khalid Hassan",      email:"k.hassan@icloud.com",      contact:"+971 54 556 6778", sport:"Swimming",        program:"Professional Practice",  tier:"Elite",    renewalDate:"2026-07-30", status:"Active"  },
  { id:"p06", name:"Mariam Al-Kaabi",    email:"mariam.k@gmail.com",       contact:"+971 50 667 7889", sport:"Gymnastics",      program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-05-01", status:"Expired" },
  { id:"p07", name:"Saif Al-Mazrouei",   email:"saif.m@gmail.com",         contact:"+971 55 778 8990", sport:"Football",        program:"Athlete Development",    tier:"Standard", renewalDate:"2026-10-18", status:"Active"  },
  { id:"p08", name:"Reem Al-Suwaidi",    email:"reem.s@outlook.com",       contact:"+971 52 889 9001", sport:"Volleyball",      program:"Talent Detection",       tier:"Standard", renewalDate:"2026-08-25", status:"Active"  },
  { id:"p09", name:"Tariq Al-Ketbi",     email:"tariq.k@gmail.com",        contact:"+971 56 990 0112", sport:"Handball",        program:"Professional Practice",  tier:"Standard", renewalDate:"2026-09-05", status:"Trial"   },
  { id:"p10", name:"Shaikha Al-Marri",   email:"shaikha.m@icloud.com",     contact:"+971 54 001 1223", sport:"Sprint Running",  program:"Athlete Development",    tier:"Elite",    renewalDate:"2026-12-01", status:"Active"  },
  { id:"p11", name:"Jaber Al-Falasi",    email:"jaber.f@gmail.com",        contact:"+971 50 112 2334", sport:"Basketball",      program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-06-20", status:"Trial"   },
  { id:"p12", name:"Hessa Al-Zaabi",     email:"hessa.z@gmail.com",        contact:"+971 55 223 3446", sport:"Swimming",        program:"Athlete Development",    tier:"Standard", renewalDate:"2026-07-14", status:"Active"  },
  { id:"p13", name:"Rashid Al-Ahbabi",   email:"rashid.a@outlook.com",     contact:"+971 52 334 4557", sport:"Football",        program:"Professional Practice",  tier:"Elite",    renewalDate:"2026-10-30", status:"Active"  },
  { id:"p14", name:"Dana Al-Muhairi",    email:"dana.m@gmail.com",         contact:"+971 56 445 5668", sport:"Tennis",          program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-05-15", status:"Expired" },
  { id:"p15", name:"Hamad Al-Hassani",   email:"hamad.h@icloud.com",       contact:"+971 54 556 6779", sport:"Weightlifting",   program:"Athlete Development",    tier:"Standard", renewalDate:"2026-09-28", status:"Active"  },
  { id:"p16", name:"Latifa Al-Rashidi",  email:"latifa.r@gmail.com",       contact:"+971 50 667 7890", sport:"Gymnastics",      program:"Professional Practice",  tier:"Elite",    renewalDate:"2026-11-11", status:"Active"  },
  { id:"p17", name:"Yousuf Al-Blooshi",  email:"yousuf.b@gmail.com",       contact:"+971 55 778 8991", sport:"Boxing",          program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-07-07", status:"Trial"   },
  { id:"p18", name:"Aisha Al-Shamsi",    email:"aisha.sh@outlook.com",     contact:"+971 52 889 9002", sport:"Distance Running",program:"Athlete Development",    tier:"Elite",    renewalDate:"2026-12-15", status:"Active"  },
  { id:"p19", name:"Obaid Al-Mansoori",  email:"obaid.m@gmail.com",        contact:"+971 56 990 0113", sport:"Handball",        program:"Professional Practice",  tier:"Standard", renewalDate:"2026-08-08", status:"Expired" },
  { id:"p20", name:"Sara Al-Nuaimi",     email:"sara.n@icloud.com",        contact:"+971 54 001 1224", sport:"Volleyball",      program:"Talent Detection",       tier:"Starter",  renewalDate:"2026-10-10", status:"Active"  },
];

const PROGRAMS: Program[] = ["Talent Detection", "Athlete Development", "Professional Practice"];
const TIERS: Tier[]        = ["Starter", "Standard", "Elite"];
const STATUSES: Status[]   = ["Trial", "Active", "Expired"];
const SPORTS = [
  "Football","Sprint Running","Distance Running","Basketball","Tennis","Swimming",
  "Volleyball","Handball","Gymnastics","Weightlifting","Boxing","Wrestling",
  "BJJ","Judo","Karate","Taekwondo","Cycling","Triathlon","Other",
];

const PROGRAM_BADGE: Record<Program, string> = {
  "Talent Detection":      "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  "Athlete Development":   "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  "Professional Practice": "bg-purple-500/15 text-purple-400 border border-purple-500/30",
};

const TIER_BADGE: Record<Tier, string> = {
  Starter:  "bg-secondary text-secondary-foreground",
  Standard: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  Elite:    "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

const STATUS_BADGE: Record<Status, string> = {
  Trial:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Active:  "bg-green-500/15 text-green-400 border border-green-500/30",
  Expired: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const EMPTY_FORM = {
  name:        "",
  email:       "",
  contact:     "",
  sport:       "",
  program:     "" as Program | "",
  tier:        "" as Tier | "",
  renewalDate: "",
  status:      "" as Status | "",
};

type SortKey = keyof Omit<AthleteRecord, "id">;

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

export default function AdminAthletes() {
  const [records,      setRecords]      = useState<AthleteRecord[]>(MOCK_ATHLETES);
  const [search,       setSearch]       = useState("");
  const [progFilter,   setProgFilter]   = useState<Program | "All">("All");
  const [tierFilter,   setTierFilter]   = useState<Tier | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [form,         setForm]         = useState({ ...EMPTY_FORM });
  const [errors,       setErrors]       = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const [sortKey,      setSortKey]      = useState<SortKey>("name");
  const [sortDir,      setSortDir]      = useState<"asc" | "desc">("asc");

  // ─── Filtering & sorting ───────────────────────────────────────────────────
  const filtered = records
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.sport.toLowerCase().includes(q) ||
        r.contact.toLowerCase().includes(q);
      const matchProg   = progFilter   === "All" || r.program === progFilter;
      const matchTier   = tierFilter   === "All" || r.tier    === tierFilter;
      const matchStatus = statusFilter === "All" || r.status  === statusFilter;
      return matchSearch && matchProg && matchTier && matchStatus;
    })
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function openModal()  { setForm({ ...EMPTY_FORM }); setErrors({}); setModalOpen(true); }
  function closeModal() { setModalOpen(false); }

  function validate() {
    const e: Partial<Record<keyof typeof EMPTY_FORM, string>> = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.email.trim())   e.email   = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.contact.trim()) e.contact = "Required";
    if (!form.sport)          e.sport   = "Required";
    if (!form.program)        e.program = "Required";
    if (!form.tier)           e.tier    = "Required";
    if (!form.renewalDate)    e.renewalDate = "Required";
    if (!form.status)         e.status  = "Required";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setRecords((prev) => [...prev, {
      id:          `p${Date.now()}`,
      name:        form.name.trim(),
      email:       form.email.trim(),
      contact:     form.contact.trim(),
      sport:       form.sport,
      program:     form.program as Program,
      tier:        form.tier as Tier,
      renewalDate: form.renewalDate,
      status:      form.status as Status,
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
    ["name",        "Parent / Athlete Name"],
    ["email",       "Email"],
    ["contact",     "Contact Number"],
    ["sport",       "Sport"],
    ["program",     "Program"],
    ["tier",        "Subscription Tier"],
    ["renewalDate", "Renewal Date"],
    ["status",      "Status"],
  ];

  // ─── Summary counts ────────────────────────────────────────────────────────
  const activeCount  = filtered.filter(r => r.status === "Active").length;
  const trialCount   = filtered.filter(r => r.status === "Trial").length;
  const expiredCount = filtered.filter(r => r.status === "Expired").length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground">Athletes &amp; Parents</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage individual athlete and parent subscriptions
            </p>
          </div>
          <button onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add New Member
          </button>
        </div>

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:"Total",    value: filtered.length,  cls:"text-foreground" },
            { label:"Active",   value: activeCount,       cls:"text-green-400"  },
            { label:"Trial",    value: trialCount,        cls:"text-yellow-400" },
            { label:"Expired",  value: expiredCount,      cls:"text-red-400"    },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="Search by name, email, sport…"
              value={search} onChange={(ev) => setSearch(ev.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          {/* Program filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", ...PROGRAMS] as const).map((p) => (
              <button key={p} onClick={() => setProgFilter(p as Program | "All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  progFilter === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}>
                {p === "All" ? "All Programs" : p}
              </button>
            ))}
          </div>

          {/* Tier filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", ...TIERS] as const).map((t) => (
              <button key={t} onClick={() => setTierFilter(t as Tier | "All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  tierFilter === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}>
                {t === "All" ? "All Tiers" : t}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s as Status | "All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
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
                  <tr><td colSpan={COL_DEFS.length} className="px-4 py-10 text-center text-muted-foreground text-sm">No members match your search or filters.</td></tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.contact}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.sport}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${PROGRAM_BADGE[r.program]}`}>{r.program}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${TIER_BADGE[r.tier]}`}>{r.tier}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(r.renewalDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/40 border-t border-border">
                    <td colSpan={COL_DEFS.length} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                      {filtered.length} {filtered.length === 1 ? "member" : "members"}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* ── Add New Member Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(ev) => ev.target === ev.currentTarget && closeModal()}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">Add New Member</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              <Field label="Parent / Athlete Name" error={errors.name}>
                <input type="text" placeholder="e.g. Ahmed Al-Rashid" value={form.name}
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
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────
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
