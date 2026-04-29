import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { getArchivedHotTakes, getArchivedTops } from "@/lib/queries";

export const metadata = { title: "Archives" };

export default async function ArchivesPage() {
  const [hotTakes, tops] = await Promise.all([
    getArchivedHotTakes(),
    getArchivedTops(),
  ]);

  return (
    <section className="relative overflow-hidden">
      <Spotlight className="-top-40 -left-20" size={900} variant="red-soft" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-10 pt-10 md:pt-16 pb-20">
        <header className="hairline-b pb-8">
          <Badge size="lg">Archives</Badge>
          <h1 className="font-display uppercase text-[48px] md:text-[96px] mt-5 leading-[0.86] tracking-[-0.035em] text-chalk">
            Les jeux <span className="text-brand-red">d&apos;avant</span>
          </h1>
          <p className="mt-4 text-mist max-w-[56ch]">
            Les votes clos de la communauté. Les verdicts, les podiums, les
            consensus et les désaccords.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div>
            <SectionTitle label="Top de la semaine" href="/top-semaine/archives" />
            <ArchiveGroup
              emptyLabel="Pas encore de top clôturé"
              items={tops.map((t) => ({
                id: t.id,
                href: `/top-semaine/archives`,
                title: t.title,
                meta: `${t.year} · ${t.total} votes`,
                accent: t.winner ? `${t.winner.artiste} — ${t.winner.titre}` : "—",
                pochette: t.winner?.pochetteUrl,
              }))}
            />
          </div>

          <div>
            <SectionTitle label="Hot Takes" href="/hot-take/archives" />
            <ArchiveGroup
              emptyLabel="Pas encore de hot take archivé"
              items={hotTakes.map((h) => ({
                id: h.id,
                href: `/hot-take/archives`,
                title: `« ${h.statement.toUpperCase()} »`,
                meta: `${new Date(h.publishAt).toLocaleDateString("fr-FR")} · ${h.total} votes`,
                accent: `${h.firePct}% / ${100 - h.firePct}%`,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ label, href }: { label: string; href: string }) {
  return (
    <div className="hairline-b pb-3 mb-5 flex items-end justify-between">
      <p className="font-display uppercase text-2xl text-chalk tracking-[-0.02em]">
        {label}
      </p>
      <Link
        href={href}
        className="eyebrow text-fade hover:text-chalk transition-colors inline-flex items-center gap-2"
      >
        Tout voir
        <span className="text-sm leading-none text-brand-red">→</span>
      </Link>
    </div>
  );
}

type Item = {
  id: string;
  href: string;
  title: string;
  meta: string;
  accent: string;
  pochette?: string;
};

function ArchiveGroup({
  items,
  emptyLabel,
}: {
  items: Item[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="hairline border-dashed p-8 text-center">
        <p className="eyebrow text-dim">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <li key={it.id}>
          <Link
            href={it.href}
            className="group flex items-center gap-4 hairline bg-chalk/5 hover:bg-chalk/10 hover:border-chalk/20 p-3 md:p-4 transition-colors"
          >
            {it.pochette ? (
              <div
                className="w-14 h-14 hairline bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${it.pochette})` }}
              />
            ) : (
              <div className="w-14 h-14 hairline bg-chalk/10 shrink-0 flex items-center justify-center">
                <span className="font-display text-brand-red">«</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-display uppercase text-base text-chalk leading-tight line-clamp-1 tracking-[-0.01em]">
                {it.title}
              </p>
              <p className="eyebrow text-dim mt-1">{it.meta}</p>
            </div>
            <p className="eyebrow text-brand-red whitespace-nowrap hidden sm:block">
              {it.accent}
            </p>
            <span className="text-base leading-none text-fade group-hover:text-chalk group-hover:translate-x-1 transition-all hidden sm:inline">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
