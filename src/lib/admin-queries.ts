import { db } from "@/lib/db";

export type DailyPoint = { date: string; top: number; hot: number; total: number };

export async function getAdminDashboard() {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [topVotesWeek, hotVotesWeek, pseudos, openTop, hotTakes] = await Promise.all([
      db.topVote.count({ where: { createdAt: { gte: weekAgo } } }),
      db.hotTakeVote.count({ where: { createdAt: { gte: weekAgo } } }),
      db.pseudo.count(),
      db.top.findFirst({
        where: { status: "OPEN" },
        include: { _count: { select: { votes: true, sorties: true } } },
      }),
      db.hotTake.findMany({
        orderBy: { publishAt: "desc" },
        take: 6,
        include: { _count: { select: { votes: true } } },
      }),
    ]);

    const topHotTake = hotTakes.reduce(
      (best, h) => (h._count.votes > (best?._count.votes ?? -1) ? h : best),
      null as (typeof hotTakes)[number] | null,
    );

    // --- Série temporelle sur 14 jours ---
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);
    const [topRaw, hotRaw] = await Promise.all([
      db.topVote.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      db.hotTakeVote.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
    ]);
    const bucket = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.toISOString().slice(0, 10);
    };
    const topByDay = new Map<string, number>();
    const hotByDay = new Map<string, number>();
    topRaw.forEach((r) => {
      const k = bucket(r.createdAt);
      topByDay.set(k, (topByDay.get(k) ?? 0) + 1);
    });
    hotRaw.forEach((r) => {
      const k = bucket(r.createdAt);
      hotByDay.set(k, (hotByDay.get(k) ?? 0) + 1);
    });
    const series: DailyPoint[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const k = d.toISOString().slice(0, 10);
      const t = topByDay.get(k) ?? 0;
      const h = hotByDay.get(k) ?? 0;
      series.push({ date: k, top: t, hot: h, total: t + h });
    }

    return {
      votesWeek: topVotesWeek + hotVotesWeek,
      series,
      pseudosCount: pseudos,
      openTop: openTop
        ? {
            id: openTop.id,
            title: openTop.title,
            weekNumber: openTop.weekNumber,
            year: openTop.year,
            votes: openTop._count.votes,
            sorties: openTop._count.sorties,
          }
        : null,
      topHotTake: topHotTake
        ? {
            id: topHotTake.id,
            statement: topHotTake.statement,
            votes: topHotTake._count.votes,
          }
        : null,
      recentHotTakes: hotTakes.map((h) => ({
        id: h.id,
        statement: h.statement,
        status: h.status,
        publishAt: h.publishAt,
        votes: h._count.votes,
      })),
    };
  } catch {
    return {
      votesWeek: 0,
      pseudosCount: 0,
      series: [] as DailyPoint[],
      openTop: null,
      topHotTake: null,
      recentHotTakes: [] as {
        id: string;
        statement: string;
        status: "DRAFT" | "OPEN" | "CLOSED";
        publishAt: Date;
        votes: number;
      }[],
    };
  }
}

export async function listTopVoters(limit = 50) {
  try {
    const list = await db.pseudo.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { topVotes: true, hotVotes: true } },
      },
    });
    return list;
  } catch {
    return [];
  }
}

export async function getVotersStats() {
  try {
    const [total, weekAgo] = await Promise.all([
      db.pseudo.count(),
      db.pseudo.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 86400_000) } },
      }),
    ]);
    return { total, week: weekAgo };
  } catch {
    return { total: 0, week: 0 };
  }
}

export async function listAdminHotTakes() {
  try {
    return await db.hotTake.findMany({
      orderBy: [{ status: "asc" }, { publishAt: "desc" }],
      include: { _count: { select: { votes: true } } },
    });
  } catch {
    return [];
  }
}

export async function getAdminHotTake(id: string) {
  try {
    return await db.hotTake.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function listAdminTops() {
  try {
    return await db.top.findMany({
      orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
      include: {
        _count: { select: { votes: true, sorties: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function getAdminTop(id: string) {
  try {
    return await db.top.findUnique({
      where: { id },
      include: { sorties: { orderBy: { order: "asc" } } },
    });
  } catch {
    return null;
  }
}

/** Liste les votes d'un Top (pseudo + sortie). */
export async function listTopVotes(topId: string) {
  try {
    const votes = await db.topVote.findMany({
      where: { topId },
      orderBy: { createdAt: "desc" },
      include: {
        pseudo: { select: { id: true, name: true, slug: true } },
        sortie: { select: { id: true, artiste: true, titre: true, pochetteUrl: true } },
      },
    });
    return votes.map((v) => ({
      id: v.id,
      createdAt: v.createdAt,
      pseudo: v.pseudo,
      sortie: v.sortie,
    }));
  } catch {
    return [];
  }
}

/** Liste les votes d'un Hot Take (pseudo + side). */
export async function listHotTakeVotes(hotTakeId: string) {
  try {
    const votes = await db.hotTakeVote.findMany({
      where: { hotTakeId },
      orderBy: { createdAt: "desc" },
      include: {
        pseudo: { select: { id: true, name: true, slug: true } },
      },
    });
    return votes.map((v) => ({
      id: v.id,
      createdAt: v.createdAt,
      side: v.side,
      pseudo: v.pseudo,
    }));
  } catch {
    return [];
  }
}

/** Données pour la story Hot Take (question ou résultats). */
export async function getHotTakeForStory(id: string) {
  try {
    const hot = await db.hotTake.findUnique({
      where: { id },
      include: {
        _count: { select: { votes: true } },
        votes: { select: { side: true } },
      },
    });
    if (!hot) return null;
    const fire = hot.votes.filter((v) => v.side === "FIRE").length;
    const froid = hot.votes.filter((v) => v.side === "FROID").length;
    return {
      id: hot.id,
      statement: hot.statement,
      backgroundUrl: hot.backgroundUrl,
      status: hot.status,
      publishAt: hot.publishAt,
      closeAt: hot.closeAt,
      fire,
      froid,
      total: hot._count.votes,
      optionALabel: hot.optionALabel,
      optionBLabel: hot.optionBLabel,
    };
  } catch {
    return null;
  }
}

/** Podium calculé côté serveur pour la story. */
export async function getTopPodium(id: string) {
  try {
    const top = await db.top.findUnique({
      where: { id },
      include: {
        sorties: {
          include: { _count: { select: { votes: true } } },
        },
      },
    });
    if (!top) return null;
    const ranked = [...top.sorties]
      .map((s) => ({
        id: s.id,
        artiste: s.artiste,
        titre: s.titre,
        pochetteUrl: s.pochetteUrl,
        category: s.category,
        votes: s._count.votes,
      }))
      .sort((a, b) => b.votes - a.votes);
    const total = ranked.reduce((n, s) => n + s.votes, 0);
    return {
      id: top.id,
      title: top.title,
      weekNumber: top.weekNumber,
      year: top.year,
      status: top.status,
      closeAt: top.closeAt,
      totalVotes: total,
      sorties: ranked,
    };
  } catch {
    return null;
  }
}
