import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { HotTakeForm } from "@/components/admin/HotTakeForm";
import { createHotTake } from "@/lib/actions/hot-takes";

export const metadata = { title: "Nouveau Hot Take" };

export default function NewHotTakePage() {
  return (
    <>
      <MacToolbar
        title="Nouveau Hot Take"
        subtitle="Une phrase tranchée, un visuel, une fenêtre de publication."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/hot-take", label: "Hot Takes" },
          { href: "#", label: "Nouveau" },
        ]}
      />
      <div className="pt-6 ui-fade-in">
        <HotTakeForm action={createHotTake} submitLabel="Publier" />
      </div>
    </>
  );
}
