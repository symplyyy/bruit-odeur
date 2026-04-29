import { db } from "@/lib/db";

/**
 * Retourne le début (lundi 00:00) et la fin (dimanche 23:59:59.999)
 * de la semaine courante dans le fuseau local du serveur.
 */
export function getCurrentWeekRange(now: Date = new Date()): {
  start: Date;
  end: Date;
} {
  const day = now.getDay(); // 0 = dimanche, 1 = lundi, …
  const daysFromMonday = (day + 6) % 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  end.setMilliseconds(-1);
  return { start, end };
}

export type WeeklyLeaderboardEntry = {
  id: string;
  name: string;
  slug: string;
  votes: number;
  topVotes: number;
  hotVotes: number;
};

export type WeeklyLeaderboard = {
  endOfWeek: string;
  total: number;
  entries: WeeklyLeaderboardEntry[];
};

/**
 * Top votants de la semaine courante (lundi → dimanche inclus).
 * Agrège les votes Top + Hot Take, garde les 10 premiers actifs.
 */
export async function getWeeklyLeaderboard(): Promise<WeeklyLeaderboard> {
  try {
    const { start, end } = getCurrentWeekRange();

    const [topAgg, hotAgg] = await Promise.all([
      db.topVote.groupBy({
        by: ["pseudoId"],
        where: { createdAt: { gte: start, lte: end } },
        _count: { _all: true },
      }),
      db.hotTakeVote.groupBy({
        by: ["pseudoId"],
        where: { createdAt: { gte: start, lte: end } },
        _count: { _all: true },
      }),
    ]);

    const tally = new Map<string, { top: number; hot: number }>();
    for (const row of topAgg) {
      tally.set(row.pseudoId, {
        top: row._count._all,
        hot: 0,
      });
    }
    for (const row of hotAgg) {
      const prev = tally.get(row.pseudoId) ?? { top: 0, hot: 0 };
      tally.set(row.pseudoId, { top: prev.top, hot: row._count._all });
    }

    const ranked = [...tally.entries()]
      .map(([pseudoId, { top, hot }]) => ({
        pseudoId,
        topVotes: top,
        hotVotes: hot,
        votes: top + hot,
      }))
      .filter((r) => r.votes > 0)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);

    if (ranked.length === 0) {
      return { endOfWeek: end.toISOString(), total: 0, entries: [] };
    }

    const pseudos = await db.pseudo.findMany({
      where: { id: { in: ranked.map((r) => r.pseudoId) } },
      select: { id: true, name: true, slug: true },
    });
    const byId = new Map(pseudos.map((p) => [p.id, p]));

    const entries: WeeklyLeaderboardEntry[] = ranked
      .map((r) => {
        const p = byId.get(r.pseudoId);
        if (!p) return null;
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          votes: r.votes,
          topVotes: r.topVotes,
          hotVotes: r.hotVotes,
        };
      })
      .filter((e): e is WeeklyLeaderboardEntry => e !== null);

    const total = entries.reduce((a, e) => a + e.votes, 0);
    return { endOfWeek: end.toISOString(), total, entries };
  } catch {
    const { end } = getCurrentWeekRange();
    return { endOfWeek: end.toISOString(), total: 0, entries: [] };
  }
}

export type OpenHotTake = {
  id: string;
  statement: string;
  backgroundUrl: string | null;
  closeAt: Date | null;
  fire: number;
  froid: number;
  optionALabel: string | null;
  optionBLabel: string | null;
};

export type OpenTop = {
  id: string;
  title: string;
  weekNumber: number;
  year: number;
  closeAt: Date;
  totalVotes: number;
  sorties: {
    id: string;
    artiste: string;
    titre: string;
    pochetteUrl: string;
    embedUrl: string | null;
    category: string;
    order: number;
    votes: number;
  }[];
};

export async function getOpenHotTake(): Promise<OpenHotTake | null> {
  try {
    const hot = await db.hotTake.findFirst({
      where: { status: "OPEN" },
      orderBy: { publishAt: "desc" },
      include: { votes: true },
    });
    if (!hot) return null;
    return {
      id: hot.id,
      statement: hot.statement,
      backgroundUrl: hot.backgroundUrl,
      closeAt: hot.closeAt,
      fire: hot.votes.filter((v) => v.side === "FIRE").length,
      froid: hot.votes.filter((v) => v.side === "FROID").length,
      optionALabel: hot.optionALabel,
      optionBLabel: hot.optionBLabel,
    };
  } catch {
    return null;
  }
}

export async function getOpenTop(): Promise<OpenTop | null> {
  try {
    const top = await db.top.findFirst({
      where: { status: "OPEN" },
      orderBy: { openAt: "desc" },
      include: {
        sorties: {
          orderBy: { order: "asc" },
          include: { _count: { select: { votes: true } } },
        },
        _count: { select: { votes: true } },
      },
    });
    if (!top) return null;
    return {
      id: top.id,
      title: top.title,
      weekNumber: top.weekNumber,
      year: top.year,
      closeAt: top.closeAt,
      totalVotes: top._count.votes,
      sorties: top.sorties.map((s) => ({
        id: s.id,
        artiste: s.artiste,
        titre: s.titre,
        pochetteUrl: s.pochetteUrl,
        embedUrl: s.embedUrl,
        category: s.category,
        order: s.order,
        votes: s._count.votes,
      })),
    };
  } catch {
    return null;
  }
}

export async function getArchivedHotTakes() {
  try {
    const list = await db.hotTake.findMany({
      where: { status: "CLOSED" },
      orderBy: { publishAt: "desc" },
      include: { _count: { select: { votes: true } }, votes: true },
      take: 30,
    });
    return list.map((h) => {
      const fire = h.votes.filter((v) => v.side === "FIRE").length;
      const total = h.votes.length || 1;
      return {
        id: h.id,
        statement: h.statement,
        publishAt: h.publishAt,
        total: h.votes.length,
        firePct: Math.round((fire / total) * 100),
        optionALabel: h.optionALabel,
        optionBLabel: h.optionBLabel,
      };
    });
  } catch {
    return [];
  }
}

export async function getArchivedTops() {
  try {
    const list = await db.top.findMany({
      where: { status: "CLOSED" },
      orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
      take: 30,
      include: {
        sorties: {
          include: { _count: { select: { votes: true } } },
        },
      },
    });
    return list.map((t) => {
      const winner = [...t.sorties].sort(
        (a, b) => b._count.votes - a._count.votes,
      )[0];
      const total = t.sorties.reduce((n, s) => n + s._count.votes, 0);
      return {
        id: t.id,
        title: t.title,
        weekNumber: t.weekNumber,
        year: t.year,
        total,
        winner: winner
          ? { artiste: winner.artiste, titre: winner.titre, pochetteUrl: winner.pochetteUrl }
          : null,
      };
    });
  } catch {
    return [];
  }
}

export async function getPseudoProfile(slug: string) {
  try {
    const pseudo = await db.pseudo.findUnique({
      where: { slug },
      include: {
        _count: { select: { topVotes: true, hotVotes: true } },
        topVotes: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            top: { select: { id: true, title: true, weekNumber: true, year: true } },
            sortie: {
              select: { id: true, artiste: true, titre: true, pochetteUrl: true },
            },
          },
        },
        hotVotes: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            hotTake: {
              select: {
                id: true,
                statement: true,
                optionALabel: true,
                optionBLabel: true,
              },
            },
          },
        },
      },
    });
    if (!pseudo) return null;
    return {
      id: pseudo.id,
      name: pseudo.name,
      slug: pseudo.slug,
      createdAt: pseudo.createdAt,
      topVotes: pseudo._count.topVotes,
      hotVotes: pseudo._count.hotVotes,
      topHistory: pseudo.topVotes.map((v) => ({
        id: v.id,
        createdAt: v.createdAt,
        top: v.top,
        sortie: v.sortie,
      })),
      hotHistory: pseudo.hotVotes.map((v) => ({
        id: v.id,
        createdAt: v.createdAt,
        side: v.side,
        hotTake: v.hotTake,
      })),
    };
  } catch {
    return null;
  }
}
