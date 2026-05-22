import { AthleteLayout } from "@/components/AthleteLayout";
import { useState } from "react";
import { CreditCard, AlertCircle, CheckCircle2, X } from "lucide-react";

type AthleteTier = "Starter" | "Standard" | "Pro";

interface AthletePlan {
  name: AthleteTier;
  price: string;
  annualPrice?: string;
  description: string;
  features: Record<string, string | boolean>;
  comingSoon: boolean;
}

const ATHLETE_PLANS: AthletePlan[] = [
  {
    name: "Starter",
    price: "400 EGP",
    annualPrice: "4,800 EGP",
    description: "Get started with performance tracking",
    comingSoon: false,
    features: {
      "Test Day Access": "350 EGP per visit",
      "Measurements & Tracking": "Free",
      "Equipment Stack": "Automated",
      "Performance Review Report": "Foundational Summary",
      "Review Session": "Upon request",
      "Training Logger (Coming Soon)": false,
      "Diet Logger (Coming Soon)": false,
      "AI Companion (Coming Soon)": false,
    },
  },
  {
    name: "Standard",
    price: "800 EGP",
    annualPrice: "9,600 EGP",
    description: "Most popular - comprehensive tracking",
    comingSoon: false,
    features: {
      "Test Day Access": "1 Free visit + paid",
      "Measurements & Tracking": "Free",
      "Equipment Stack": "Automated",
      "Performance Review Report": "Advanced Scientific Report",
      "Review Session": "Quarterly",
      "Training Logger (Coming Soon)": true,
      "Diet Logger (Coming Soon)": true,
      "AI Companion (Coming Soon)": "Limited",
    },
  },
  {
    name: "Pro",
    price: "TBD",
    description: "Elite training and performance management",
    comingSoon: true,
    features: {
      "Test Day Access": "2 Free visits per month",
      "Measurements & Tracking": "Free",
      "Equipment Stack": "Elite",
      "Performance Review Report": "Personalized High-Performance Report",
      "Review Session": "Monthly",
      "Training Logger (Coming Soon)": true,
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

export default function AthleteSubscriptions() {
  const [currentPlan] = useState<AthleteTier>("Starter");
  const [renewalDate] = useState("2026-08-14");

  return (
    <AthleteLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Subscription & Payments
          </h1>
          <p className="text-gray-400">Manage your performance tracking plan</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-700 rounded-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Current Plan: <span className="text-purple-300">{currentPlan}</span>
              </h2>
              <p className="text-purple-200">
                Your plan renews on{" "}
                <span className="font-semibold">
                  {new Date(renewalDate).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <CreditCard className="w-8 h-8 text-purple-300" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
              Upgrade Plan
            </button>
            <button className="flex-1 px-6 py-3 border border-purple-400 hover:bg-purple-500/20 text-purple-300 font-semibold rounded-lg transition-colors">
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Plans Comparison */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ATHLETE_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 transition-all ${
                  currentPlan === plan.name
                    ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500"
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
                  <div>
                    <p className="text-3xl font-bold text-white">{plan.price}</p>
                    {plan.annualPrice && (
                      <p className="text-xs text-gray-400">
                        or {plan.annualPrice}/year
                      </p>
                    )}
                  </div>
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
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg cursor-not-allowed opacity-50"
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
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                    Upgrade to {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-200">
              Track your athletic performance with confidence. Choose the plan that matches your goals and unlock personalized insights.
            </p>
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
}
