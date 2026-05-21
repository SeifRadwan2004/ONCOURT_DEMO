import { AdminLayout } from "@/components/AdminLayout";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function AdminLibrary() {
  return (
    <AdminLayout>
      <PlaceholderPage
        title="Test Library"
        description="Manage assessment tests and protocols"
      />
    </AdminLayout>
  );
}
