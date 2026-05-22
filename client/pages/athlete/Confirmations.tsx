import { AthleteLayout } from "@/components/AthleteLayout";
import { useState, useMemo } from "react";
import {
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  Clock3,
  X,
  Eye,
} from "lucide-react";

interface TestDay {
  id: string;
  requestId: string;
  programName: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "declined" | "completed";
  location: string;
  tests: string[];
  isPaid: boolean;
}

const MOCK_TEST_DAYS: TestDay[] = [
  {
    id: "td01",
    requestId: "R001",
    programName: "Talent Detection Program",
    date: new Date(2026, 4, 28),
    time: "10:00",
    status: "confirmed",
    location: "Al Ain Sports Complex",
    tests: ["CMJ", "505 Agility Test", "Grip Strength"],
    isPaid: false,
  },
  {
    id: "td03",
    requestId: "R003",
    programName: "Professional Practice Program",
    date: new Date(2026, 4, 20),
    time: "09:00",
    status: "completed",
    location: "ADFC Training Ground",
    tests: ["30m Sprint", "CMJ", "505 Agility Test"],
    isPaid: false,
  },
];

function StatusBadge({
  status,
}: {
  status: "pending" | "confirmed" | "declined" | "completed";
}) {
  const configs = {
    pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: Clock3 },
    confirmed: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      icon: CheckCircle2,
    },
    declined: { bg: "bg-red-500/20", text: "text-red-400", icon: X },
    completed: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      icon: CheckCircle2,
    },
  };
  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.text}`} />
      <span className={`text-sm font-medium ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

export default function AthleteConfirmations() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDays = useMemo(() => {
    return MOCK_TEST_DAYS.filter(
      (day) =>
        day.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        day.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handlePayment = (testDayId: string) => {
    console.log("Payment initiated for test day:", testDayId);
    // TODO: Redirect to payment page
  };

  return (
    <AthleteLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Test Days & Confirmations
          </h1>
          <p className="text-gray-400">
            View your scheduled test days and complete payments
          </p>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search by program or location…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Test Days Cards */}
        <div className="space-y-4">
          {filteredDays.map((day) => (
            <div
              key={day.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
            >
              {/* Card Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === day.id ? null : day.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">
                        {day.programName}
                      </h3>
                      <StatusBadge status={day.status} />
                      {!day.isPaid && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">
                          Not Paid
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {day.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {day.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {day.location}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    {expandedId === day.id ? "−" : "+"}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === day.id && (
                <div className="border-t border-gray-700 p-4 bg-gray-900/50 space-y-4">
                  {/* Tests */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Tests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {day.tests.map((test) => (
                        <span
                          key={test}
                          className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="border-t border-gray-700 pt-4">
                    {day.isPaid ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Payment Completed</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-gray-300">
                          Payment required to confirm your participation
                        </div>
                        <button
                          onClick={() => handlePayment(day.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          Proceed to Payment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredDays.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No test days found</p>
            </div>
          )}
        </div>
      </div>
    </AthleteLayout>
  );
}
