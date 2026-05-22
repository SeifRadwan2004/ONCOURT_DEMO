import { CoachLayout } from "@/components/CoachLayout";
import { useState } from "react";
import { CreditCard, AlertCircle, CheckCircle2, X } from "lucide-react";

type CoachTier = "Free" | "Plus" | "Premium";

interface CoachPlan {
  name: CoachTier;
  price: string;
  description: string;
  features: Record<string, string | boolean>;
  comingSoon: boolean;
}

const COACH_PLANS: CoachPlan[] = [
  {
    name: "Free",
    price: "Free",
    description: "Perfect for getting started",
    comingSoon: false,
    features: {
      "Test Battery": "Standard Battery",
      Equipment: "Automated",
      "Data Visualization": "Simple",
      "Filter & Comparisons": true,
      Benchmarking: false,
      "Priority Booking": false,
      "Training Logger (Coming Soon)": "Logger only",
      "Diet Logger (Coming Soon)": false,
      "AI Companion (Coming Soon)": false,
    },
  },
  {
    name: "Plus",
    price: "Coming Soon",
    description: "Enhanced features for growth",
    comingSoon: false,
    features: {
      "Test Battery": "Customized",
      Equipment: "Automated",
      "Data Visualization": "Detailed",
      "Filter & Comparisons": true,
      Benchmarking: "Standard",
      "Priority Booking": "Two weeks",
      "Training Logger (Coming Soon)": "Logger + Tracker",
      "Diet Logger (Coming Soon)": true,
      "AI Companion (Coming Soon)": "Limited",
    },
  },
  {
    name: "Premium",
    price: "Coming Soon",
    description: "All-in-one elite solution",
    comingSoon: true,
    features: {
      "Test Battery": "Pool of 250+ Tests",
      Equipment: "Elite",
      "Data Visualization": "Personalized",
      "Filter & Comparisons": true,
      Benchmarking: "Advanced",
      "Priority Booking": "Same week",
      "Training Logger (Coming Soon)": "Full tracker",
      "Diet Logger (Coming Soon)": true,
      "AI Companion (Coming Soon)": "Full access",
    },
  },
];

function FeatureItem({ name, value }: { name: string; value: string | boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
      <span className="text-gray-300 text-sm">{name}</span>
      <div className="flex items-center gap-2">
        {value === true ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : value === false ? (
          <X className="w-5 h-5 text-gray-500" />
        ) : (
          <span className="text-sm font-medium text-gray-300">{value}</span>
        )}
      </div>
    </div>
  );
}

export default function CoachSubscriptions() {
  const [currentPlan] = useState<CoachTier>("Free");
  const [renewalDate] = useState("2026-08-14");

  return (
    <CoachLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Subscription & Payments
          </h1>
          <p className="text-gray-400">Manage your coaching plan and billing</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Current Plan: <span className="text-blue-300">{currentPlan}</span>
              </h2>
              <p className="text-blue-200">
                Your plan renews on{" "}
                <span className="font-semibold">
                  {new Date(renewalDate).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <CreditCard className="w-8 h-8 text-blue-300" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Upgrade Plan
            </button>
            <button className="flex-1 px-6 py-3 border border-blue-400 hover:bg-blue-500/20 text-blue-300 font-semibold rounded-lg transition-colors">
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Plans Comparison */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COACH_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 transition-all ${
                  currentPlan === plan.name
                    ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500"
                    : "border-gray-700 bg-gray-800 hover:border-gray-600"
                }`}
              >
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {plan.comingSoon && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
                  <p className="text-2xl font-bold text-white">{plan.price}</p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                  {Object.entries(plan.features).map(([name, value]) => (
                    <FeatureItem key={name} name={name} value={value} />
                  ))}
                </div>

                {/* Action Button */}
                {currentPlan === plan.name ? (
                  <button
                    disabled
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg cursor-not-allowed opacity-50"
                  >
                    Current Plan
                  </button>
                ) : plan.comingSoon ? (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-700 text-gray-400 font-semibold rounded-lg cursor-not-allowed opacity-50"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-200">
              Need help choosing a plan? Contact our support team or schedule a demo to find the perfect fit for your coaching needs.
            </p>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
