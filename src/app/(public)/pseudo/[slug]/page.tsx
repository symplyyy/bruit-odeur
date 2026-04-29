import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/ui/Spotlight";
import { getPseudoProfile } from "@/lib/queries";
import { slugify } from "@/lib/utils";

export default async function PseudoPage(props: PageProps<"/pseudo/[slug]">) {
  const raw = await props.params;
  const slug = slugify(decodeURIComponent(raw.slug));
  const data = await getPseudoProfile(slug);
  if (!data) notFound();

  const totalVotes = data.topVotes + data.hotVotes;

  return (
    <section className="relative overflow-hidden">
      <Spotlight className="-top-60 -right-40" size={1000} />
      <Spotlight variant="red-soft" className="-bottom-60 -left-40" size={800} />

      <div className="relative mx-auto max-w-4xl px-5 md:px-10 pt-12 md:pt-20 pb-20">
        <Badge tone="red" size="lg">
          Profil
        </Badge>
        <h1 className="font-display uppercase text-[52px] md:text-[112px] mt-5 leading-[0.86] tracking-[-0.04em] text-chalk break-all">
          @{data.name}
        </h1>
        <p className="mt-5 eyebrow text-fade">
          Inscrit le{" "}
          {new Date(data.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <div className="mt-12 grid grid-cols-3 gap-3 md:gap-4">
          <Stat label="Top" value={data.topVotes} />
          <Stat label="Hot Take" value={data.hotVotes} />
          <Stat label="Total" value={totalVotes} accent />
        </div>

        {/* ---------- Historique des votes ---------- */}
        <div className="mt-14">
          <p className="font-display uppercase text-2xl text-chalk hairline-b pb-3 mb-5 tracking-[-0.01em]">
            Ses votes
          </p>

          {data.topHistory.length === 0 && data.hotHistory.length === 0 ? (
            <div className="hairline border-dashed p-8 text-center">
              <p className="eyebrow text-dim">Pas encore de vote</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.topHistory.length > 0 && (
                <div>
                  <p className="eyebrow text-fade mb-3">Top de la semaine</p>
                  <ul className="space-y-2">
                    {data.topHistory.map((v) => (
                      <li
                        key={v.id}
                        className="relative hairline bg-chalk/5 flex items-center gap-3 p-3"
                      >
                        <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-smoke">
                          {v.sortie.pochetteUrl ? (
                            <Image
                              src={v.sortie.pochetteUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="eyebrow text-dim truncate">
                            {v.top.title}
                          </p>
                          <p className="font-display uppercase text-base text-chalk leading-tight truncate tracking-[-0.01em]">
                            {v.sortie.titre}
                          </p>
                          <p className="text-xs text-fade truncate">
                            {v.sortie.artiste}
                          </p>
                        </div>
                        <span className="chip chip-red chip-sm shrink-0">
                          Voté
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.hotHistory.length > 0 && (
                <div>
                  <p className="eyebrow text-fade mb-3">Hot Take</p>
                  <ul className="space-y-2">
                    {data.hotHistory.map((v) => {
                      const isVersus = !!(
                        v.hotTake.optionALabel && v.hotTake.optionBLabel
                      );
                      const label =
                        v.side === "FIRE"
                          ? (v.hotTake.optionALabel ?? "Chaud")
                          : (v.hotTake.optionBLabel ?? "Froid");
                      return (
                        <li
                          key={v.id}
                          className="relative hairline bg-chalk/5 flex items-center gap-3 p-3"
                        >
                          <span
                            className={`chip chip-sm shrink-0 max-w-[8rem] truncate ${
                              v.side === "FIRE" ? "chip-red" : "chip-blue"
                            }`}
                            title={label}
                          >
                            {label.toUpperCase()}
                          </span>
                          <p className="font-display uppercase text-chalk text-sm md:text-base leading-snug line-clamp-2 flex-1 tracking-[-0.01em]">
                            {isVersus && (
                              <span className="text-dim text-[10px] mr-2 align-middle">
                                VS
                              </span>
                            )}
                            « {v.hotTake.statement.toUpperCase()} »
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 eyebrow text-fade hover:text-chalk transition-colors"
        >
          <span className="text-sm leading-none">←</span>
          Accueil
        </Link>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-4 md:p-5 ${
        accent
          ? "bg-brand-red text-white"
          : "hairline bg-chalk/5 text-chalk"
      }`}
    >
      <p className="eyebrow opacity-70">{label}</p>
      <p className="font-display text-4xl md:text-5xl mt-2 leading-none tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}
