import type { Metadata } from "next";
import { Summary } from "@/components/Summary";

export const metadata: Metadata = {
  title: "Specification summary",
  description:
    "The commercial specification document — base style, options, size run, indicative pricing and terms. Save as PDF or submit to the factory.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Summary />;
}
