import { HomeHub } from "@/components/home/HomeHub";
import {
  getOpenHotTake,
  getOpenTop,
  getWeeklyLeaderboard,
} from "@/lib/queries";

export default async function HomePage() {
  const [hotTake, top, leaderboard] = await Promise.all([
    getOpenHotTake(),
    getOpenTop(),
    getWeeklyLeaderboard(),
  ]);

  return (
    <HomeHub
      hotTake={
        hotTake
          ? {
              id: hotTake.id,
              statement: hotTake.statement,
              backgroundUrl: hotTake.backgroundUrl,
              totalVotes: hotTake.fire + hotTake.froid,
              optionALabel: hotTake.optionALabel,
              optionBLabel: hotTake.optionBLabel,
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
