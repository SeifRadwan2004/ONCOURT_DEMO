import { CoachLayout } from "@/components/CoachLayout";
import { useState, useMemo } from "react";
import {
  Calendar,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  Clock3,
  X,
  Eye,
} from "lucide-react";

interface Athlete {
  id: string;
  name: string;
  hasPaid: boolean;
}

interface ServiceConfirmation {
  id: string;
  requestId: string;
  groupName: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "declined" | "completed";
  athletes: Athlete[];
  paidCount: number;
  location: string;
  tests: string[];
}

const MOCK_CONFIRMATIONS: ServiceConfirmation[] = [
  {
    id: "sc01",
    requestId: "R001",
    groupName: "Al Ain Youth Academy",
    date: new Date(2026, 4, 28),
    time: "10:00",
    status: "confirmed",
    location: "Al Ain Sports Complex",
    tests: ["CMJ", "505 Agility Test", "Grip Strength"],
    paidCount: 8,
    athletes: [
      { id: "a01", name: "Khalid Rashid", hasPaid: true },
      { id: "a02", name: "Mohammed Ahmed", hasPaid: true },
      { id: "a03", name: "Saif Ali", hasPaid: false },
      { id: "a04", name: "Omar Hassan", hasPaid: true },
      { id: "a05", name: "Rashed Mansoor", hasPaid: true },
      { id: "a06", name: "Youssef Karim", hasPaid: false },
      { id: "a07", name: "Ali Hamad", hasPaid: true },
      { id: "a08", name: "Bilal Tariq", hasPaid: true },
      { id: "a09", name: "Hassan Zayed", hasPaid: true },
      { id: "a10", name: "Faris Ahmed", hasPaid: false },
      { id: "a11", name: "Majid Sultan", hasPaid: true },
      { id: "a12", name: "Hamad Ali", hasPaid: true },
      { id: "a13", name: "Nasser Rashid", hasPaid: false },
      { id: "a14", name: "Abdullah Hassan", hasPaid: true },
      { id: "a15", name: "Ahmed Mohammed", hasPaid: true },
    ],
  },
  {
    id: "sc02",
    requestId: "R002",
    groupName: "Dubai Sports Institute",
    date: new Date(2026, 5, 10),
    time: "14:00",
    status: "pending",
    location: "Dubai Sports Complex",
    tests: ["Yo-Yo Test L1", "Standing Broad Jump"],
    paidCount: 5,
    athletes: [
      { id: "b01", name: "Sara Al-Mansoori", hasPaid: true },
      { id: "b02", name: "Layla Ahmed", hasPaid: true },
      { id: "b03", name: "Noor Hassan", hasPaid: false },
      { id: "b04", name: "Hana Khalid", hasPaid: false },
      { id: "b05", name: "Maryam Ali", hasPaid: true },
      { id: "b06", name: "Fatima Rashid", hasPaid: false },
      { id: "b07", name: "Leila Mohammed", hasPaid: true },
      { id: "b08", name: "Amira Hassan", hasPaid: true },
      { id: "b09", name: "Dina Youssef", hasPaid: false },
      { id: "b10", name: "Zainab Ali", hasPaid: true },
    ],
  },
  {
    id: "sc03",
    requestId: "R003",
    groupName: "Abu Dhabi Football Club",
    date: new Date(2026, 4, 20),
    time: "09:00",
    status: "completed",
    location: "ADFC Training Ground",
    tests: ["30m Sprint", "CMJ", "505 Agility Test"],
    paidCount: 18,
    athletes: Array.from({ length: 18 }, (_, i) => ({
      id: `c${i + 1}`,
      name: `Player ${i + 1}`,
      hasPaid: true,
    })),
  },
  {
    id: "sc04",
    requestId: "R004",
    groupName: "Ajman Youth Team",
    date: new Date(2026, 5, 15),
    time: "16:00",
    status: "declined",
    location: "Ajman Stadium",
    tests: ["Anthropometric Battery", "Y-Balance Test"],
    paidCount: 0,
    athletes: Array.from({ length: 20 }, (_, i) => ({
      id: `d${i + 1}`,
      name: `Athlete ${i + 1}`,
      hasPaid: false,
    })),
  },
];

function fmtDate(d: Date) {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return d.toLocaleDateString("en-US", opts);
}

function StatusBadge({ status }: { status: ServiceConfirmation["status"] }) {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-500/15",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      icon: Clock3,
      label: "Pending",
    },
    confirmed: {
      bg: "bg-green-500/15",
      border: "border-green-500/30",
      text: "text-green-400",
      icon: CheckCircle2,
      label: "Confirmed",
    },
    declined: {
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      text: "text-red-400",
      icon: X,
      label: "Declined",
    },
    completed: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-400",
      icon: CheckCircle2,
      label: "Completed",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${config.bg} border ${config.border} ${config.text}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function InfoItem({
  icon,
  label,
  value,
  truncate,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
      <div className={truncate ? "min-w-0" : ""}>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-sm font-medium text-foreground ${truncate ? "truncate" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function CoachConfirmations() {
  const [paymentPopup, setPaymentPopup] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] =
    useState<ServiceConfirmation["status"] | "all">("all");

  const filteredConfirmations = useMemo(() => {
    if (selectedTab === "all") return MOCK_CONFIRMATIONS;
    return MOCK_CONFIRMATIONS.filter((c) => c.status === selectedTab);
  }, [selectedTab]);

  const stats = useMemo(() => {
    return {
      total: MOCK_CONFIRMATIONS.length,
      pending: MOCK_CONFIRMATIONS.filter((c) => c.status === "pending").length,
      confirmed: MOCK_CONFIRMATIONS.filter((c) => c.status === "confirmed")
        .length,
      declined: MOCK_CONFIRMATIONS.filter((c) => c.status === "declined").length,
      completed: MOCK_CONFIRMATIONS.filter((c) => c.status === "completed")
        .length,
    };
  }, []);

  return (
    <CoachLayout>
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground">
            Service Confirmations
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredConfirmations.length} service{
              filteredConfirmations.length !== 1 ? "s" : ""
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-border flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: `All (${stats.total})`, count: stats.total },
            {
              key: "pending",
              label: `Pending (${stats.pending})`,
              count: stats.pending,
            },
            {
              key: "confirmed",
              label: `Confirmed (${stats.confirmed})`,
              count: stats.confirmed,
            },
            {
              key: "declined",
              label: `Declined (${stats.declined})`,
              count: stats.declined,
            },
            {
              key: "completed",
              label: `Completed (${stats.completed})`,
              count: stats.completed,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setSelectedTab(
                  tab.key as ServiceConfirmation["status"] | "all"
                )
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-4">
            {filteredConfirmations.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">
                    No confirmations in this status
                  </p>
                </div>
              </div>
            ) : (
              filteredConfirmations.map((confirmation) => {
                const unpaid = confirmation.athletes.filter(
                  (a) => !a.hasPaid
                );
                const isPayOpen = paymentPopup === confirmation.id;
                const pricePerAthlete = 350;

                return (
                  <div
                    key={confirmation.id}
                    className="bg-card border border-border rounded-2xl overflow-visible"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            #{confirmation.requestId}
                          </span>
                        </div>
                        <div>
                          <h2 className="font-semibold text-foreground">
                            {confirmation.groupName}
                          </h2>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={confirmation.status} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info grid */}
                    <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InfoItem
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        label="Date"
                        value={`${fmtDate(confirmation.date)} · ${confirmation.time}`}
                      />
                      <InfoItem
                        icon={<MapPin className="w-3.5 h-3.5" />}
                        label="Location"
                        value={confirmation.location}
                      />
                      <InfoItem
                        icon={<Users className="w-3.5 h-3.5" />}
                        label="Athletes"
                        value={`${confirmation.athletes.length} registered`}
                      />
                      <InfoItem
                        icon={<Clock className="w-3.5 h-3.5" />}
                        label="Services"
                        value={confirmation.tests.join(", ")}
                        truncate
                      />
                    </div>

                    {/* Payment row */}
                    <div className="px-5 pb-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Payment:
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {confirmation.paidCount}/{confirmation.athletes.length}{" "}
                            athletes
                          </span>
                          <span className="text-sm text-muted-foreground">
                            · AED{" "}
                            {(confirmation.paidCount * pricePerAthlete).toLocaleString()}
                          </span>
                        </div>

                        {/* Payment progress bar */}
                        <div className="w-28 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500 transition-all"
                            style={{
                              width: `${
                                (confirmation.paidCount /
                                  confirmation.athletes.length) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {unpaid.length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setPaymentPopup(
                                isPayOpen ? null : confirmation.id
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {unpaid.length} unpaid
                            <ChevronRight
                              className={`w-3 h-3 transition-transform ${
                                isPayOpen ? "rotate-90" : ""
                              }`}
                            />
                          </button>

                          {isPayOpen && (
                            <div className="absolute right-0 bottom-9 z-30 w-56 bg-card border border-border rounded-xl shadow-2xl py-2">
                              <p className="px-3 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border mb-1">
                                Unpaid Athletes
                              </p>
                              {unpaid.map((a) => (
                                <div
                                  key={a.id}
                                  className="px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition"
                                >
                                  {a.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
