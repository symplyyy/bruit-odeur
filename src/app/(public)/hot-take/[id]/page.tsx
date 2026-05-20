import { notFound } from "next/navigation";
import { HotTakeCard } from "@/components/games/HotTake/HotTakeCard";
import { getHotTakeById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HotTakeByIdPage({
  params,
}: PageProps<"/hot-take/[id]">) {
  const { id } = await params;
  const hot = await getHotTakeById(id);
  if (!hot) notFound();

  return (
    <HotTakeCard
      hotTakeId={hot.id}
      statement={hot.statement}
      backgroundUrl={hot.backgroundUrl}
      initialFire={hot.fire}
      initialFroid={hot.froid}
      optionALabel={hot.optionALabel}
      optionBLabel={hot.optionBLabel}
    />
  );
}
