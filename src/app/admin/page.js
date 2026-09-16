import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard & Diagnostics — SaveFromPro",
  description:
    "System analytics, database inspection, error diagnostic logs, active user monitoring, and blog management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-200">
      <AdminDashboard />
    </div>
  );
}
