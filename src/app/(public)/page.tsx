import { HomeHub } from "@/components/home/HomeHub";
import {
  getOpenHotTakes,
  getOpenTop,
  getWeeklyLeaderboard,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hotTakes, top, leaderboard] = await Promise.all([
    getOpenHotTakes(),
    getOpenTop(),
    getWeeklyLeaderboard(),
  ]);

  const hotTake = hotTakes[0] ?? null;

  return (
    <HomeHub
      hotTake={
        hotTake
          ? {
              id: hotTake.id,
              statement: hotTake.statement,
              backgroundUrl: hotTake.backgroundUrl,
              totalVotes: hotTakes.reduce(
                (sum, h) => sum + h.fire + h.froid,
                0,
              ),
              optionALabel: hotTake.optionALabel,
              optionBLabel: hotTake.optionBLabel,
              openCount: hotTakes.length,
            }
          : null
      }
      top={
        top
          ? {
              id: top.id,
              title: top.title,
              closeAt: top.closeAt.toISOString(),
              totalVotes: top.totalVotes,
              previews: top.sorties.map((s) => ({ pochetteUrl: s.pochetteUrl })),
            }
          : null
      }
      leaderboard={leaderboard}
    />
  );
}
