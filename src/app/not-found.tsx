import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-sheet mx-auto px-6 py-24 text-center">
      <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-indigo mb-6">
        404
      </div>
      <h1 className="font-serif font-normal text-[clamp(32px,6vw,64px)] leading-[0.95] tracking-[-0.02em]">
        This page was never cut.
      </h1>
      <Link
        href="/"
        className="inline-block mt-10 bg-ink text-paper px-[26px] py-4 font-sans text-[14px] font-medium rounded hover:bg-indigo hover:text-paper transition-colors"
      >
        Back to the showroom
      </Link>
    </div>
  );
}
