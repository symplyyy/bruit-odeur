import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ForceDark } from "@/components/theme/ForceDark";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <ForceDark />
      <TopBar />
      <main className="flex-1 w-full pb-24">{children}</main>
      <BottomNav />
    </AppShell>
  );
}
