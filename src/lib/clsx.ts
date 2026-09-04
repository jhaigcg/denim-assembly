/** Tiny classNames joiner — no dependency needed for what this app does. */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
