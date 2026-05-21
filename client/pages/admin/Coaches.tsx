import { AdminLayout } from "@/components/AdminLayout";
import { useState } from "react";
import { Search, Plus, X, ChevronUp, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "Standard" | "Plus" | "Premium";
type Status = "Trial" | "Active" | "Expired";

interface Entity {
  id: string;
  repName: string;
  email: string;
  contact: string;
  sport: string;
  entityName: string;
  numAthletes: number;
  plan: Plan;
  renewalDate: string;
  status: Status;
  revenue: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ENTITIES: Entity[] = [
  {
    id: "e1",
    repName: "James Hartley",
    email: "j.hartley@zayedfc.ae",
    contact: "+971 50 123 4567",
    sport: "Football",
    entityName: "Zayed FC Academy",
    numAthletes: 48,
    plan: "Premium",
    renewalDate: "2026-08-14",
    status: "Active",
    revenue: 14400,
  },
  {
    id: "e2",
    repName: "Sara Al Marzouqi",
    email: "sara.m@desertrunners.ae",
    contact: "+971 55 987 6543",
    sport: "Athletics",
    entityName: "Desert Runners Club",
    numAthletes: 22,
    plan: "Standard",
    renewalDate: "2026-06-01",
    status: "Trial",
    revenue: 0,
  },
  {
    id: "e3",
    repName: "Tom Gallagher",
    email: "tgallagher@emiratesswim.ae",
    contact: "+971 52 441 2200",
    sport: "Swimming",
    entityName: "Emirates Swim Team",
    numAthletes: 35,
    plan: "Plus",
    renewalDate: "2026-05-10",
    status: "Expired",
    revenue: 5400,
  },
  {
    id: "e4",
    repName: "Noura Al Rashidi",
    email: "noura@abudhabibball.ae",
    contact: "+971 56 330 8819",
    sport: "Basketball",
    entityName: "Abu Dhabi Ballers",
    numAthletes: 18,
    plan: "Standard",
    renewalDate: "2026-09-22",
    status: "Active",
    revenue: 2880,
  },
  {
    id: "e5",
    repName: "Khalid Mansoor",
    email: "k.mansoor@falcon-tennis.ae",
    contact: "+971 54 771 0034",
    sport: "Tennis",
    entityName: "Falcon Tennis Academy",
    numAthletes: 61,
    plan: "Premium",
    renewalDate: "2026-11-30",
    status: "Active",
    revenue: 21600,
  },
];

const PLANS: Plan[] = ["Standard", "Plus", "Premium"];
const STATUSES: Status[] = ["Trial", "Active", "Expired"];
const SPORTS = ["Football", "Athletics", "Swimming", "Basketball", "Tennis", "Rugby", "Cycling", "Other"];

const PLAN_BADGE: Record<Plan, string> = {
  Standard: "bg-secondary text-secondary-foreground",
  Plus: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Premium: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
};

const STATUS_BADGE: Record<Status, string> = {
  Trial: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Active: "bg-green-500/15 text-green-400 border border-green-500/30",
  Expired: "bg-red-500/15 text-red-400 border border-red-500/30",
};

// ─── Empty form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  repName: "",
  email: "",
  contact: "",
  sport: "",
  entityName: "",
  numAthletes: "",
  plan: "" as Plan | "",
  renewalDate: "",
  status: "" as Status | "",
  revenue: "",
};

type SortKey = keyof Omit<Entity, "id">;

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

function fmtRevenue(n: number) {
  return n === 0 ? "—" : `AED ${n.toLocaleString()}`;
}

export default function AdminCoaches() {
  const [entities, setEntities] = useState<Entity[]>(MOCK_ENTITIES);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<Plan | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const [sortKey, setSortKey] = useState<SortKey>("entityName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ─── Filtering & sorting ───────────────────────────────────────────────────
  const filtered = entities
    .filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.repName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.entityName.toLowerCase().includes(q) ||
        e.sport.toLowerCase().includes(q);
      const matchPlan = planFilter === "All" || e.plan === planFilter;
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
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

  const totalRevenue = filtered.reduce((s, e) => s + e.revenue, 0);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ─── Modal helpers ─────────────────────────────────────────────────────────
  function openModal() {
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function validate() {
    const e: Partial<Record<keyof typeof EMPTY_FORM, string>> = {};
    if (!form.repName.trim()) e.repName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.contact.trim()) e.contact = "Required";
    if (!form.sport) e.sport = "Required";
    if (!form.entityName.trim()) e.entityName = "Required";
    if (!form.numAthletes) e.numAthletes = "Required";
    else if (isNaN(Number(form.numAthletes)) || Number(form.numAthletes) < 1)
      e.numAthletes = "Must be a positive number";
    if (!form.plan) e.plan = "Required";
    if (!form.renewalDate) e.renewalDate = "Required";
    if (!form.status) e.status = "Required";
    if (form.revenue !== "" && isNaN(Number(form.revenue)))
      e.revenue = "Must be a number";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const newEntity: Entity = {
      id: `e${Date.now()}`,
      repName: form.repName.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      sport: form.sport,
      entityName: form.entityName.trim(),
      numAthletes: Number(form.numAthletes),
      plan: form.plan as Plan,
      renewalDate: form.renewalDate,
      status: form.status as Status,
      revenue: form.revenue === "" ? 0 : Number(form.revenue),
    };
    setEntities((prev) => [...prev, newEntity]);
    closeModal();
  }

  function setField<K extends keyof typeof EMPTY_FORM>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // ─── Sort icon helper ──────────────────────────────────────────────────────
  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronUp className="w-3 h-3 opacity-20 inline ml-1" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 opacity-70 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 opacity-70 inline ml-1" />
    );
  }

  const COL_DEFS: [SortKey, string][] = [
    ["repName", "Rep Name"],
    ["email", "Email"],
    ["contact", "Contact Number"],
    ["sport", "Sport"],
    ["entityName", "Entity Name"],
    ["numAthletes", "Athletes"],
    ["plan", "Plan"],
    ["status", "Status"],
    ["renewalDate", "Renewal Date"],
    ["revenue", "Total Revenue"],
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground">Coaches &amp; Clubs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage registered coaching entities and their subscription plans
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Entity
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, entity, email or sport…"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Plan filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", ...PLANS] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlanFilter(p as Plan | "All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  planFilter === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["All", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as Status | "All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
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
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-foreground transition"
                    >
                      {label}
                      <SortIcon col={key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COL_DEFS.length}
                      className="px-4 py-10 text-center text-muted-foreground text-sm"
                    >
                      No entities match your search or filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((e, i) => (
                    <tr
                      key={e.id}
                      className={`border-b border-border last:border-0 hover:bg-muted/30 transition ${
                        i % 2 === 0 ? "" : "bg-muted/10"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {e.repName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{e.email}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {e.contact}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{e.sport}</td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {e.entityName}
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">{e.numAthletes}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_BADGE[e.plan]}`}>
                          {e.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[e.status]}`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {fmtDate(e.renewalDate)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {fmtRevenue(e.revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {/* ── Revenue footer ── */}
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/40 border-t border-border">
                    <td colSpan={9} className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                      Total ({filtered.length} {filtered.length === 1 ? "entity" : "entities"})
                    </td>
                    <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
                      AED {totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          Add New Entity Modal
      ══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(ev) => ev.target === ev.currentTarget && closeModal()}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">Add New Entity</h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              <Field label="Rep Name" error={errors.repName}>
                <input
                  type="text"
                  placeholder="e.g. James Hartley"
                  value={form.repName}
                  onChange={(ev) => setField("repName", ev.target.value)}
                  className={inputCls(!!errors.repName)}
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  placeholder="coach@example.com"
                  value={form.email}
                  onChange={(ev) => setField("email", ev.target.value)}
                  className={inputCls(!!errors.email)}
                />
              </Field>

              <Field label="Contact Number" error={errors.contact}>
                <input
                  type="text"
                  placeholder="+971 50 000 0000"
                  value={form.contact}
                  onChange={(ev) => setField("contact", ev.target.value)}
                  className={inputCls(!!errors.contact)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Sport" error={errors.sport}>
                  <select
                    value={form.sport}
                    onChange={(ev) => setField("sport", ev.target.value)}
                    className={inputCls(!!errors.sport)}
                  >
                    <option value="">Select sport…</option>
                    {SPORTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Subscription Plan" error={errors.plan}>
                  <select
                    value={form.plan}
                    onChange={(ev) => setField("plan", ev.target.value)}
                    className={inputCls(!!errors.plan)}
                  >
                    <option value="">Select plan…</option>
                    {PLANS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Entity Name" error={errors.entityName}>
                <input
                  type="text"
                  placeholder="e.g. Zayed FC Academy"
                  value={form.entityName}
                  onChange={(ev) => setField("entityName", ev.target.value)}
                  className={inputCls(!!errors.entityName)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Number of Athletes" error={errors.numAthletes}>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 40"
                    value={form.numAthletes}
                    onChange={(ev) => setField("numAthletes", ev.target.value)}
                    className={inputCls(!!errors.numAthletes)}
                  />
                </Field>

                <Field label="Total Revenue (AED)" error={errors.revenue}>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 5400"
                    value={form.revenue}
                    onChange={(ev) => setField("revenue", ev.target.value)}
                    className={inputCls(!!errors.revenue)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Status" error={errors.status}>
                  <select
                    value={form.status}
                    onChange={(ev) => setField("status", ev.target.value)}
                    className={inputCls(!!errors.status)}
                  >
                    <option value="">Select status…</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Renewal Date" error={errors.renewalDate}>
                  <input
                    type="date"
                    value={form.renewalDate}
                    onChange={(ev) => setField("renewalDate", ev.target.value)}
                    className={inputCls(!!errors.renewalDate)}
                  />
                </Field>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/70 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  Add Entity
                </button>
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
  return `w-full px-3 py-2 text-sm bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
    hasError ? "border-red-500/60" : "border-border"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
