import type { Metadata } from "next";
import { Summary } from "@/components/Summary";

export const metadata: Metadata = {
  title: "Specification summary",
  description:
    "The specification document — base style, options and size run — ready to save as PDF or submit to the factory for a formal quotation.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Summary />;
}
