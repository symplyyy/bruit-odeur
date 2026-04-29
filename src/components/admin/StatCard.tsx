type Props = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
};

export function StatCard({ label, value, hint, accent }: Props) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border border-black/10 bg-black text-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
          : "rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
      }
    >
      <p className="text-[10px] uppercase tracking-[0.22em] opacity-65">
        {label}
      </p>
      <p
        className={`font-display text-5xl mt-2 leading-none ${accent ? "text-white" : "text-black"}`}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-[11px] opacity-70">{hint}</p>
      )}
    </div>
  );
}
