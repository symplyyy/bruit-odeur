import { redirect } from "next/navigation";
import { adminLogout, requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/mac/Sidebar";
import "./admin.css";

export const metadata = { title: "Back-office" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  async function logout() {
    "use server";
    await adminLogout();
    redirect("/login");
  }

  return (
    <div className="app-shell relative min-h-dvh flex">
      <AdminSidebar logoutAction={logout} />
      <main className="relative flex-1 min-w-0">
        <div className="px-4 md:px-8 lg:px-10 pb-20">{children}</div>
      </main>
    </div>
  );
}
