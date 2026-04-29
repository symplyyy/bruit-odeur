"use client";

import { useState } from "react";
import { TopPodiumStudio } from "./TopPodiumStudio";
import { TopVoteStudio } from "./TopVoteStudio";
import { Trophy, Link2 } from "lucide-react";

type PodiumSortie = {
  id: string;
  artiste: string;
  titre: string;
  pochetteUrl: string;
  category: string;
  votes: number;
};

type Props = {
  podium: {
    id: string;
    title: string;
    weekNumber: number;
    year: number;
    closeAt: Date | string;
    totalVotes: number;
    sorties: PodiumSortie[];
  };
};

type Tab = "vote" | "podium";

export function StoriesStudio({ podium }: Props) {
  const [tab, setTab] = useState<Tab>("vote");

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 ui-surface rounded-[10px] w-fit">
        <TabButton
          active={tab === "vote"}
          onClick={() => setTab("vote")}
          icon={<Link2 size={13} strokeWidth={1.75} />}
          label="Vote"
        />
        <TabButton
          active={tab === "podium"}
          onClick={() => setTab("podium")}
          icon={<Trophy size={13} strokeWidth={1.75} />}
          label="Podium"
        />
      </div>

      {tab === "vote" ? (
        <TopVoteStudio
          top={{
            id: podium.id,
            title: podium.title,
            weekNumber: podium.weekNumber,
            year: podium.year,
            closeAt: podium.closeAt,
            sorties: podium.sorties.map((s) => ({
              id: s.id,
              artiste: s.artiste,
              titre: s.titre,
            })),
          }}
        />
      ) : (
        <TopPodiumStudio
          top={{
            id: podium.id,
            title: podium.title,
            weekNumber: podium.weekNumber,
            year: podium.year,
            totalVotes: podium.totalVotes,
            sorties: podium.sorties,
          }}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium uppercase tracking-[0.05em] transition-colors rounded-[6px] ${
        active
          ? "bg-brand-red text-white"
          : "text-[color:var(--c-text-3)] hover:text-[color:var(--c-text-1)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
