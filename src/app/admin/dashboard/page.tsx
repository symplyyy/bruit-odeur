import Link from "next/link";
import { redirect } from "next/navigation";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import {
  Card,
  MacButton,
  Sparkline,
  Badge,
} from "@/components/admin/mac/primitives";
import { EngagementChart } from "@/components/admin/charts/EngagementChart";
import { getAdminDashboard, getVotersStats } from "@/lib/admin-queries";
import { adminLogout } from "@/lib/auth";
import {
  Plus,
  Flame,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  LogOut,
} from "lucide-react";

export const metadata = { title: "Vue d’ensemble" };

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

export default async function AdminDashboardPage() {
  const [data, voters] = await Promise.all([
    getAdminDashboard(),
    getVotersStats(),
  ]);

  async function logout() {
    "use server";
    await adminLogout();
    redirect("/login");
  }

  const totalSeries = data.series.map((p) => p.total);
  const topSeries = data.series.map((p) => p.top);
  const hotSeries = data.series.map((p) => p.hot);

  return (
    <>
      <MacToolbar
        title="Vue d’ensemble"
        subtitle="Activité, contenus et engagement sur les 14 derniers jours."
        actions={
          <>
            <Link href="/admin/top-semaine/new">
              <MacButton icon={<Plus size={13} strokeWidth={1.75} />}>
                Top
              </MacButton>
            </Link>
            <Link href="/admin/hot-take/new">
              <MacButton
                variant="primary"
                icon={<Plus size={13} strokeWidth={1.75} />}
              >
                Nouveau Hot Take
              </MacButton>
            </Link>
            <form action={logout}>
              <MacButton
                type="submit"
                icon={<LogOut size={13} strokeWidth={1.75} />}
              >
                Déconnexion
              </MacButton>
            </form>
          </>
        }
      />

      <div className="pt-6 space-y-6 ui-fade-in relative">
        {/* Row: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Kpi
            label="Votes · 7 jours"
            value={data.votesWeek}
            series={totalSeries}
            delta={computeDelta(totalSeries)}
          />
          <Kpi
            label="Votants uniques"
            value={voters.total}
            hint={`${voters.week > 0 ? "+" : ""}${voters.week} cette semaine`}
          />
          <Kpi
            label="Votes Top · 14 j"
            value={topSeries.reduce((a, b) => a + b, 0)}
            series={topSeries}
          />
          <Kpi
            label="Votes Hot · 14 j"
            value={hotSeries.reduce((a, b) => a + b, 0)}
            series={hotSeries}
          />
        </div>

        {/* Row: Current top + chart */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-3">
          {/* Current Top */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy
                  size={14}
                  strokeWidth={1.75}
                  className="text-[color:var(--c-text-3)]"
                />
                <p className="text-[12px] font-medium text-[color:var(--c-text-2)]">
                  Top en cours
                </p>
              </div>
              {data.openTop ? (
                <StatusBadge status="OPEN" />
              ) : (
                <Badge tone="neutral">Aucun</Badge>
              )}
            </div>

            {data.openTop ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-[36px] font-semibold tracking-tight leading-none">
                    S{data.openTop.weekNumber}
                  </span>
                  <span className="text-[13px] text-[color:var(--c-text-3)]">
                    {data.openTop.year}
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-medium truncate">
                  {data.openTop.title}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <MiniStat label="Sorties" value={data.openTop.sorties} />
                  <MiniStat label="Votes" value={data.openTop.votes} />
                </div>
                <Link
                  href={`/admin/top-semaine/${data.openTop.id}`}
                  className="mt-5 block"
                >
                  <MacButton className="w-full">
                    Gérer ce Top
                    <ArrowUpRight size={13} strokeWidth={1.75} />
                  </MacButton>
                </Link>
              </>
            ) : (
              <EmptyState
                title="Aucun Top ouvert"
                hint="Lance le Top hebdomadaire pour ouvrir les votes."
                cta={
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
            )}
          </Card>

          {/* Chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-medium text-[color:var(--c-text-2)]">
                Engagement · 14 jours
              </p>
            </div>
            <EngagementChart data={data.series} />
          </Card>
        </div>

        {/* Row: Recent hot takes */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 h-[46px] border-b border-[color:var(--c-border)]">
            <div className="flex items-center gap-2">
              <Flame
                size={14}
                strokeWidth={1.75}
                className="text-[color:var(--c-text-3)]"
              />
              <p className="text-[12px] font-medium text-[color:var(--c-text-2)]">
                Hot Takes récents
              </p>
            </div>
            <Link
              href="/admin/hot-take"
              className="text-[12px] text-[color:var(--c-text-2)] hover:text-[color:var(--c-text)] inline-flex items-center gap-1"
            >
              Tout voir
              <ArrowUpRight size={12} strokeWidth={1.75} />
            </Link>
          </div>
          {data.recentHotTakes.length === 0 ? (
            <div className="p-10">
              <EmptyState
                title="Aucun Hot Take"
                hint="Rédige une phrase tranchée pour démarrer."
                cta={
                  <Link href="/admin/hot-take/new">
                    <MacButton
                      variant="primary"
                      icon={<Plus size={13} strokeWidth={1.75} />}
                    >
                      Créer
                    </MacButton>
                  </Link>
                }
              />
            </div>
          ) : (
            <ul>
              {data.recentHotTakes.map((h, i) => (
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
                    className="grid grid-cols-[1fr_auto_auto_60px] items-center gap-4 px-5 h-[52px] hover:bg-[color:var(--c-hover)] transition-colors"
                  >
                    <p className="text-[13px] truncate">« {h.statement} »</p>
                    <StatusBadge status={h.status} />
                    <span className="text-[12px] text-[color:var(--c-text-3)]">
                      {new Date(h.publishAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span className="text-right font-medium tabular-nums">
                      {h.votes}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

/* ---------- locaux ---------- */

function Kpi({
  label,
  value,
  series,
  delta,
  hint,
}: {
  label: string;
  value: number | string;
  series?: number[];
  delta?: { value: number; up: boolean } | null;
  hint?: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-[12px] font-medium text-[color:var(--c-text-2)]">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-[30px] font-semibold tracking-tight leading-none tabular-nums">
          {value}
        </p>
        {series && series.some((v) => v > 0) && (
          <Sparkline
            values={series}
            color="var(--c-text)"
            width={84}
            height={28}
          />
        )}
      </div>
      <div className="mt-2 min-h-[16px] flex items-center gap-2 text-[11.5px]">
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              delta.up
                ? "text-[color:var(--c-success)]"
                : "text-[color:var(--c-danger)]"
            }`}
          >
            {delta.up ? (
              <TrendingUp size={11} strokeWidth={2} />
            ) : (
              <TrendingDown size={11} strokeWidth={2} />
            )}
            {Math.abs(delta.value)}%
          </span>
        )}
        {hint && (
          <span className="text-[color:var(--c-text-3)]">{hint}</span>
        )}
      </div>
    </Card>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[8px] bg-[color:var(--c-surface-2)] px-3 py-2.5">
      <p className="text-[11px] font-medium text-[color:var(--c-text-3)]">
        {label}
      </p>
      <p className="mt-0.5 text-[18px] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  hint,
  cta,
}: {
  title: string;
  hint: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="rounded-[10px] border border-dashed border-[color:var(--c-border-strong)] p-6 text-center">
      <p className="text-[14px] font-semibold">{title}</p>
      <p className="text-[12px] text-[color:var(--c-text-3)] mt-1">{hint}</p>
      <div className="mt-4 inline-flex">{cta}</div>
    </div>
  );
}

function computeDelta(series: number[]) {
  if (series.length < 14) return null;
  const prev7 = series.slice(0, 7).reduce((a, b) => a + b, 0);
  const last7 = series.slice(7).reduce((a, b) => a + b, 0);
  if (prev7 === 0) return last7 > 0 ? { value: 100, up: true } : null;
  const diff = ((last7 - prev7) / prev7) * 100;
  return { value: Math.round(Math.abs(diff)), up: diff >= 0 };
}
