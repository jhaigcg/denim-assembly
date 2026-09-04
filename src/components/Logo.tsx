import { clsx } from "@/lib/clsx";

type Variant = "header" | "sheet" | "footer";

const TILE: Record<Variant, string> = {
  header: "w-7 h-7 bg-paper text-ink text-[14.5px]",
  sheet: "w-[52px] h-[52px] bg-ink text-paper text-[24px]",
  footer: "w-[52px] h-[52px] border border-paper text-paper text-[24px]",
};

const WORDMARK: Record<Variant, string> = {
  header: "text-[15.5px]",
  sheet: "text-[22px]",
  footer: "text-[23px]",
};

const GAP: Record<Variant, string> = {
  header: "gap-[9px]",
  sheet: "gap-[13px]",
  footer: "gap-[13px]",
};

/**
 * Approved logo direction "1b — Monogram Tile": a square DA tile followed by the
 * two-line wordmark (DENIM 400 over ASSEMBLY 600). Specs per placement come from
 * the handoff brand section.
 */
export function Logo({
  variant = "header",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center", GAP[variant], className)}>
      <div
        className={clsx(
          "grid place-items-center shrink-0 font-semibold tracking-[-0.05em] leading-none",
          TILE[variant],
        )}
      >
        DA
      </div>
      <div
        className={clsx(
          "leading-[1.05] tracking-[0.07em] whitespace-nowrap",
          WORDMARK[variant],
        )}
      >
        <span className="font-normal">DENIM</span>
        <br />
        <span className="font-semibold">ASSEMBLY</span>
      </div>
    </div>
  );
}
