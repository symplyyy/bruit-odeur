import Link from "next/link";

export function Colophon() {
  return (
    <footer className="hidden md:block border-t-2 border-ink bg-ink text-paper mt-12">
      <div className="mx-auto max-w-7xl px-10 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-brand-red">
            B&amp;O&apos;Z Group
          </p>
          <h2 className="font-display uppercase text-6xl leading-[0.88] tracking-[-0.02em] mt-3">
            Le Bruit
            <br />
            &amp; l&apos;Odeur
          </h2>
          <p className="mt-5 text-sm text-paper/60 max-w-md">
            Fanzine d&apos;opinion et de débat sur le rap français.
            Deux jeux par semaine, des votes publics, pas d&apos;algorithme caché.
          </p>
        </div>

        <div className="col-span-3">
          <p className="text-[10px] uppercase tracking-[0.35em] text-paper/40 mb-4 rule-under border-paper/30">
            Rubriques
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/hot-take" className="hover:text-brand-red">
                Hot Take — opinion tranchée
              </Link>
            </li>
            <li>
              <Link href="/top-semaine" className="hover:text-brand-red">
                Top de la semaine
              </Link>
            </li>
            <li>
              <Link href="/archives" className="hover:text-brand-red">
                Archives
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-paper/40 mb-4 rule-under border-paper/30">
            Règles de la maison
          </p>
          <ul className="space-y-1.5 text-xs text-paper/60">
            <li>— Un pseudo, pas de compte, pas d&apos;email.</li>
            <li>— Un vote par Top, un vote par Hot Take.</li>
            <li>— Les votes sont publics. Pas d&apos;anonymat.</li>
            <li>— Reveal du podium : dimanche 23:59.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/20">
        <div className="mx-auto max-w-7xl px-10 py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-paper/40">
          <span>© {new Date().getFullYear()} — Le Bruit &amp; l&apos;Odeur</span>
          <span>Imprimé sur le web · Paris</span>
        </div>
      </div>
    </footer>
  );
}
