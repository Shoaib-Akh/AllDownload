import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Dashboard — SaveFromPro",
  description: "Analytics, Database, and Management Dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-200">
      <AdminDashboard />
    </div>
  );
}
