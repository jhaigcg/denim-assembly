import { clsx } from "@/lib/clsx";

/**
 * Seven of thirteen styles have no photography yet (client to supply). Those
 * render this tile — white bed, the style code, and a faint drop hint.
 */
export function PlaceholderTile({
  code,
  hint,
  className,
}: {
  code: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "absolute inset-0 bg-white flex flex-col items-center justify-center gap-2 text-center px-4",
        "bg-[repeating-linear-gradient(135deg,#FFF_0_14px,#FBFAF7_14px_28px)]",
        className,
      )}
    >
      <span className="font-mono text-[13px] tracking-[0.18em] text-ink/70">
        {code}
      </span>
      <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-txt-4">
        {hint}
      </span>
    </div>
  );
}
