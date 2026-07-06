import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardNavbar />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}