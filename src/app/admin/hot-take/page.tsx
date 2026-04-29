import Link from "next/link";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card, MacButton, Badge } from "@/components/admin/mac/primitives";
import { listAdminHotTakes } from "@/lib/admin-queries";
import { Flame, Plus } from "lucide-react";

export const metadata = { title: "Hot Takes" };

function StatusBadge({ status }: { status: "DRAFT" | "OPEN" | "CLOSED" }) {
  if (status === "OPEN")
    return (
      <Badge
        tone="success"
        icon={
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--c-success)] ui-pulse" />
        }
      >
        Publié
      </Badge>
    );
  if (status === "CLOSED") return <Badge tone="neutral">Clos</Badge>;
  return <Badge tone="warning">Brouillon</Badge>;
}

export default async function AdminHotTakeListPage() {
  const list = await listAdminHotTakes();
  const count = {
    OPEN: list.filter((h) => h.status === "OPEN").length,
    DRAFT: list.filter((h) => h.status === "DRAFT").length,
    CLOSED: list.filter((h) => h.status === "CLOSED").length,
  };
  const totalVotes = list.reduce((a, h) => a + h._count.votes, 0);

  return (
    <>
      <MacToolbar
        title="Hot Takes"
        subtitle="Rédige, programme et clôture les opinions tranchées."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/hot-take", label: "Hot Takes" },
        ]}
        actions={
          <Link href="/admin/hot-take/new">
            <MacButton
              variant="primary"
              icon={<Plus size={13} strokeWidth={1.75} />}
            >
              Nouveau
            </MacButton>
          </Link>
        }
      />

      <div className="pt-6 space-y-5 ui-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Summary label="Total" value={list.length} />
          <Summary label="Publiés" value={count.OPEN} dot="#15803d" />
          <Summary label="Brouillons" value={count.DRAFT} dot="#b45309" />
          <Summary label="Total votes" value={totalVotes} />
        </div>

        {list.length === 0 ? (
          <Card className="p-14 text-center">
            <Flame
              size={28}
              strokeWidth={1.5}
              className="mx-auto text-[color:var(--c-text-4)]"
            />
            <p className="mt-3 text-[15px] font-semibold">Aucun Hot Take</p>
            <p className="mt-1 text-[13px] text-[color:var(--c-text-3)]">
              Lance la conversation avec une phrase tranchée.
            </p>
            <div className="mt-5 inline-flex">
              <Link href="/admin/hot-take/new">
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
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[1fr_110px_110px_80px] items-center px-5 h-9 bg-[color:var(--c-surface-2)] border-b border-[color:var(--c-border)] text-[11px] font-medium text-[color:var(--c-text-3)] uppercase tracking-[0.04em]">
              <span>Affirmation</span>
              <span>Statut</span>
              <span>Publication</span>
              <span className="text-right">Votes</span>
            </div>
            <ul>
              {list.map((h, i) => (
                <li
                  key={h.id}
                  className={
                    i === 0
                      ? ""
                      : "border-t border-[color:var(--c-border)]"
                  }
                >
                  <Link
                    href={`/admin/hot-take/${h.id}`}
                    className="grid grid-cols-[1fr_110px_110px_80px] items-center px-5 h-[52px] gap-4 hover:bg-[color:var(--c-hover)] transition-colors"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      {h.optionALabel && h.optionBLabel ? (
                        <span className="shrink-0 inline-flex items-center gap-1 px-1.5 h-[18px] text-[10px] font-semibold uppercase tracking-[0.05em] bg-[color:var(--c-danger)]/10 text-[color:var(--c-danger)] border border-[color:var(--c-danger)]/30 rounded-sm">
                          Versus
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 px-1.5 h-[18px] text-[10px] font-semibold uppercase tracking-[0.05em] bg-[color:var(--c-surface-3)] text-[color:var(--c-text-3)] border border-[color:var(--c-border)] rounded-sm">
                          Chaud/Froid
                        </span>
                      )}
                      <p className="text-[13px] truncate">« {h.statement} »</p>
                    </div>
                    <StatusBadge status={h.status} />
                    <span className="text-[12px] text-[color:var(--c-text-3)]">
                      {new Date(h.publishAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                    <span className="text-right text-[14px] font-medium tabular-nums">
                      {h._count.votes}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}

function Summary({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[12px] font-medium text-[color:var(--c-text-2)]">
        {dot && (
          <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
        )}
        {label}
      </div>
      <p className="mt-2 text-[24px] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </Card>
  );
}
