import Link from "next/link";
import { MacToolbar } from "@/components/admin/mac/Toolbar";
import { Card } from "@/components/admin/mac/primitives";
import { VotersLeaderboardChart } from "@/components/admin/charts/VotersLeaderboardChart";
import { VotesBreakdownChart } from "@/components/admin/charts/VotesBreakdownChart";
import { listTopVoters, getVotersStats } from "@/lib/admin-queries";
import { Users } from "lucide-react";

export const metadata = { title: "Votants" };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function avatarColor(name: string): string {
  const palette = [
    "#1f6feb",
    "#7c3aed",
    "#15803d",
    "#b45309",
    "#dc2626",
    "#0891b2",
    "#db2777",
    "#0a0a0a",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export default async function AdminVotersPage() {
  const [voters, stats] = await Promise.all([
    listTopVoters(100),
    getVotersStats(),
  ]);

  const activeVoters = voters.filter(
    (v) => v._count.topVotes + v._count.hotVotes > 0,
  ).length;
  const avgVotes =
    voters.length === 0
      ? 0
      : Math.round(
          voters.reduce(
            (a, v) => a + v._count.topVotes + v._count.hotVotes,
            0,
          ) / voters.length,
        );

  const topTotal = voters.reduce((a, v) => a + v._count.topVotes, 0);
  const hotTotal = voters.reduce((a, v) => a + v._count.hotVotes, 0);

  const leaderboard = [...voters]
    .sort(
      (a, b) =>
        b._count.topVotes + b._count.hotVotes -
        (a._count.topVotes + a._count.hotVotes),
    )
    .slice(0, 8)
    .map((v) => ({
      name: v.name,
      top: v._count.topVotes,
      hot: v._count.hotVotes,
    }))
    .filter((v) => v.top + v.hot > 0)
    .reverse();

  return (
    <>
      <MacToolbar
        title="Votants"
        subtitle="Communauté B&O’Z — pseudos et engagement."
        breadcrumbs={[
          { href: "/admin/dashboard", label: "Vue d’ensemble" },
          { href: "/admin/votants", label: "Votants" },
        ]}
      />

      <div className="pt-6 space-y-5 ui-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Cette semaine" value={stats.week} />
          <StatCard label="Actifs" value={activeVoters} />
          <StatCard label="Moyenne votes / votant" value={avgVotes} />
        </div>

        {topTotal + hotTotal > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-3">
            <Card className="p-5 overflow-hidden min-w-0">
              <p className="text-[12px] font-medium text-[color:var(--c-text-2)] mb-4">
                Répartition des votes
              </p>
              <VotesBreakdownChart
                data={[
                  { key: "top", name: "Top de la semaine", value: topTotal },
                  { key: "hot", name: "Hot Take", value: hotTotal },
                ]}
              />
            </Card>

            {leaderboard.length > 0 && (
              <Card className="p-5 overflow-hidden min-w-0">
                <p className="text-[12px] font-medium text-[color:var(--c-text-2)] mb-4">
                  Top contributeurs
                </p>
                <VotersLeaderboardChart data={leaderboard} />
              </Card>
            )}
          </div>
        )}

        {voters.length === 0 ? (
          <Card className="p-14 text-center">
            <Users
              size={28}
              strokeWidth={1.5}
              className="mx-auto text-[color:var(--c-text-4)]"
            />
            <p className="mt-3 text-[15px] font-semibold">Aucun votant</p>
            <p className="mt-1 text-[13px] text-[color:var(--c-text-3)]">
              Dès qu’un pseudo votera, il apparaîtra ici.
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[1fr_90px_90px_110px_120px] items-center px-5 h-9 bg-[color:var(--c-surface-2)] border-b border-[color:var(--c-border)] text-[11px] font-medium text-[color:var(--c-text-3)] uppercase tracking-[0.04em]">
              <span>Pseudo</span>
              <span className="text-right">Top</span>
              <span className="text-right">Hot</span>
              <span className="text-right">Total</span>
              <span className="text-right">Inscrit</span>
            </div>
            <ul>
              {voters.map((v, i) => (
                <li
                  key={v.id}
                  className={
                    i === 0
                      ? ""
                      : "border-t border-[color:var(--c-border)]"
                  }
                >
                  <Link
                    href={`/pseudo/${v.slug}`}
                    className="grid grid-cols-[1fr_90px_90px_110px_120px] items-center px-5 h-[56px] gap-4 hover:bg-[color:var(--c-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-semibold shrink-0"
                        style={{ background: avatarColor(v.name) }}
                      >
                        {initials(v.name) || "—"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium truncate">
                          {v.name}
                        </p>
                        <p className="text-[11px] text-[color:var(--c-text-3)] truncate">
                          @{v.slug}
                        </p>
                      </div>
                    </div>
                    <span className="text-right text-[13px] tabular-nums font-medium">
                      {v._count.topVotes}
                    </span>
                    <span className="text-right text-[13px] tabular-nums font-medium">
                      {v._count.hotVotes}
                    </span>
                    <span className="text-right text-[13px] tabular-nums font-semibold">
                      {v._count.topVotes + v._count.hotVotes}
                    </span>
                    <span className="text-right text-[12px] text-[color:var(--c-text-3)]">
                      {new Date(v.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <p className="text-[12px] font-medium text-[color:var(--c-text-2)]">
        {label}
      </p>
      <p className="mt-2 text-[24px] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </Card>
  );
}
