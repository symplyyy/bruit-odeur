import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { TopForm } from "@/components/admin/TopForm";
import { createTop } from "@/lib/actions/tops";
import { nextSundayClose } from "@/lib/utils";

export const metadata = { title: "Nouveau Top" };

export default function NewTopPage() {
  const now = new Date();
  const close = nextSundayClose(now);

  return (
    <>
      <MacToolbar
        title="Nouveau Top"
        subtitle="On crée l’événement d’abord, les sorties viennent juste après."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/top-semaine", label: "Top de la semaine" },
          { href: "#", label: "Nouveau" },
        ]}
      />
      <div className="pt-6 ui-fade-in">
        <TopForm
          action={createTop}
          submitLabel="Créer"
          initial={{
            openAt: now.toISOString(),
            closeAt: close.toISOString(),
          }}
        />
      </div>
    </>
  );
}
