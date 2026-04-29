export function Footer() {
  return (
    <div className="px-4 py-4 border-t border-brand-white/5 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-brand-white/30">
      <span>© B&O&apos;Z GROUP</span>
      <span className="font-display text-brand-white/50 tracking-tight">
        LBL — {new Date().getFullYear()}
      </span>
    </div>
  );
}
