import { CoachLayout } from "@/components/CoachLayout";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function CoachDashboard() {
  return (
    <CoachLayout>
      <PlaceholderPage
        title="Dashboard"
        description="Coach performance and athlete insights"
      />
    </CoachLayout>
  );
}
