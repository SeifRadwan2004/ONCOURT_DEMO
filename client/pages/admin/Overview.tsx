import { AdminLayout } from "@/components/AdminLayout";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function AdminOverview() {
  return (
    <AdminLayout>
      <PlaceholderPage
        title="Overview"
        description="System overview and key metrics"
      />
    </AdminLayout>
  );
}
