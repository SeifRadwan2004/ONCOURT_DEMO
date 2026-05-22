import { AthleteLayout } from "@/components/AthleteLayout";
import { CreditCard } from "lucide-react";

export default function AthleteSubscriptions() {
  return (
    <AthleteLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Subscriptions & Payments
          </h1>
          <p className="text-gray-400">
            Manage your subscription and payment methods
          </p>
        </div>

        {/* Placeholder Section */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg p-12 text-center border border-purple-600">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-purple-300" />
          <h2 className="text-2xl font-bold text-white mb-3">
            Subscriptions & Payments
          </h2>
          <p className="text-purple-200">
            This page is under development. Here you'll be able to manage your
            subscriptions, view billing history, and update payment methods.
          </p>
        </div>
      </div>
    </AthleteLayout>
  );
}
