import { AthleteLayout } from "@/components/AthleteLayout";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

interface TestDayConfirmation {
  id: string;
  requestId: string;
  entityName: string;
  date: Date;
  time: string;
  location: string;
  tests: string[];
  status: "confirmed" | "pending" | "completed";
  price: number;
  isPaid: boolean;
}

const MOCK_CONFIRMATIONS: TestDayConfirmation[] = [
  {
    id: "c1",
    requestId: "R001",
    entityName: "Zayed FC Academy",
    date: new Date(2026, 4, 28),
    time: "10:00",
    location: "Al Ain Sports Complex",
    tests: ["CMJ", "505 Agility Test", "Grip Strength"],
    status: "confirmed",
    price: 350,
    isPaid: false,
  },
  {
    id: "c2",
    requestId: "R002",
    entityName: "Dubai Sports Institute",
    date: new Date(2026, 5, 10),
    time: "14:00",
    location: "Dubai Sports Complex",
    tests: ["Yo-Yo Test L1", "Standing Broad Jump"],
    status: "confirmed",
    price: 350,
    isPaid: true,
  },
  {
    id: "c3",
    requestId: "R003",
    entityName: "Abu Dhabi Football Club",
    date: new Date(2026, 4, 20),
    time: "09:00",
    location: "ADFC Training Ground",
    tests: ["30m Sprint", "CMJ", "505 Agility Test"],
    status: "completed",
    price: 350,
    isPaid: true,
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

function StatusBadge({ status }: { status: TestDayConfirmation["status"] }) {
  const statusConfig = {
    confirmed: {
      bg: "bg-green-500/15",
      border: "border-green-500/30",
      text: "text-green-400",
      label: "Confirmed",
    },
    pending: {
      bg: "bg-yellow-500/15",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      label: "Pending",
    },
    completed: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/30",
      text: "text-blue-400",
      label: "Completed",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${config.bg} border ${config.border} ${config.text}`}
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function AthleteConfirmations() {
  const [paymentPopup, setPaymentPopup] = useState<string | null>(null);

  const handlePayment = (confirmationId: string) => {
    alert(`Redirecting to payment for confirmation ${confirmationId}...`);
    setPaymentPopup(null);
  };

  return (
    <AthleteLayout>
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground">
            Confirmed Test Days
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_CONFIRMATIONS.length} confirmed session{MOCK_CONFIRMATIONS.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-4 max-w-4xl">
            {MOCK_CONFIRMATIONS.map((confirmation) => (
              <div
                key={confirmation.id}
                className="bg-card border border-border rounded-2xl overflow-visible"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">
                        #{confirmation.requestId}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {confirmation.entityName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
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
                    icon={<Clock className="w-3.5 h-3.5" />}
                    label="Services"
                    value={confirmation.tests.join(", ")}
                  />
                  <InfoItem
                    icon={<Users className="w-3.5 h-3.5" />}
                    label="Price"
                    value={`AED ${confirmation.price}`}
                  />
                </div>

                {/* Payment section */}
                <div className="px-5 pb-4 flex items-center justify-between flex-wrap gap-3">
                  {confirmation.isPaid ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        Payment Complete
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground">Payment needed:</span>
                        <span className="text-sm font-semibold text-foreground ml-1">
                          AED {confirmation.price}
                        </span>
                      </div>
                    </div>
                  )}

                  {!confirmation.isPaid && (
                    <button
                      onClick={() => handlePayment(confirmation.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold rounded-xl transition shadow-lg shadow-primary/20"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
}
