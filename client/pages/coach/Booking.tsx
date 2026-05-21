import { CoachLayout } from "@/components/CoachLayout";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function CoachBooking() {
  return (
    <CoachLayout>
      <PlaceholderPage
        title="Test Day Booking"
        description="Schedule and manage test days for your athletes"
      />
    </CoachLayout>
  );
}
