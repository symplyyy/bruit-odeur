import Link from "next/link";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card, MacButton, Badge } from "@/components/admin/mac/primitives";
import { listAdminTops } from "@/lib/admin-queries";
import { Trophy, Plus, ArrowUpRight } from "lucide-react";

export const metadata = { title: "Top de la semaine" };

function StatusBadge({ status }: { status: "DRAFT" | "OPEN" | "CLOSED" }) {
  if (status === "OPEN")
    return (
      <Badge
        tone="success"
        icon={
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--c-success)] ui-pulse" />
        }
      >
        En cours
      </Badge>
    );
  if (status === "CLOSED") return <Badge tone="neutral">Archivé</Badge>;
  return <Badge tone="warning">Brouillon</Badge>;
}

export default async function AdminTopListPage() {
  const list = await listAdminTops();

  return (
    <>
      <MacToolbar
        title="Top de la semaine"
        subtitle="Crée un Top chaque lundi, ajoute 4 à 8 sorties, clôture le dimanche à 23h59."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/top-semaine", label: "Top de la semaine" },
        ]}
        actions={
          <Link href="/admin/top-semaine/new">
            <MacButton
              variant="primary"
              icon={<Plus size={13} strokeWidth={1.75} />}
            >
              Nouveau Top
            </MacButton>
          </Link>
        }
      />

      <div className="pt-6 ui-fade-in">
        {list.length === 0 ? (
          <Card className="p-14 text-center">
            <Trophy
              size={28}
              strokeWidth={1.5}
              className="mx-auto text-[color:var(--c-text-4)]"
            />
            <p className="mt-3 text-[15px] font-semibold">Aucun Top</p>
            <p className="mt-1 text-[13px] text-[color:var(--c-text-3)]">
              Lance le premier pour démarrer le rendez-vous hebdomadaire.
            </p>
            <div className="mt-5 inline-flex">
              <Link href="/admin/top-semaine/new">
                <MacButton
                  variant="primary"
                  icon={<Plus size={13} strokeWidth={1.75} />}
                >
                  Créer
                </MacButton>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {list.map((t) => (
              <Link
                key={t.id}
                href={`/admin/top-semaine/${t.id}`}
                className="group"
              >
                <Card className="p-5 transition-all hover:shadow-[var(--s-3)] hover:border-[color:var(--c-border-strong)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[26px] font-semibold tracking-tight leading-none tabular-nums">
                          S{t.weekNumber}
                        </span>
                        <span className="text-[12px] text-[color:var(--c-text-3)]">
                          {t.year}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-[13px] font-medium mt-3 line-clamp-2 min-h-[36px]">
                    {t.title}
                  </p>
                  <div className="mt-4 flex items-center gap-5 text-[12px] text-[color:var(--c-text-2)]">
                    <span>
                      <span className="font-semibold tabular-nums text-[color:var(--c-text)]">
                        {t._count.sorties}
                      </span>{" "}
                      sorties
                    </span>
                    <span className="w-px h-3 bg-[color:var(--c-border)]" />
                    <span>
                      <span className="font-semibold tabular-nums text-[color:var(--c-text)]">
                        {t._count.votes}
                      </span>{" "}
                      votes
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[color:var(--c-border)] flex items-center justify-end gap-1 text-[12px] text-[color:var(--c-text-3)] group-hover:text-[color:var(--c-text)]">
                    Ouvrir
                    <ArrowUpRight size={12} strokeWidth={1.75} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
