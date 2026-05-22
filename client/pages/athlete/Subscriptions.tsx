import { AthleteLayout } from "@/components/AthleteLayout";

export default function AthleteSubscriptions() {
  return (
    <AthleteLayout>
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground">
            Subscriptions & Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your subscription plan and payment methods
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">💳</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Subscriptions & Payments</h2>
            <p className="text-muted-foreground text-lg max-w-md">
              View your subscription details, manage payment methods, and track your billing history
            </p>
            <div className="mt-8 inline-block px-6 py-3 bg-secondary rounded-lg">
              <p className="text-sm text-secondary-foreground">
                Coming soon. Access your subscription management tools here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
}
