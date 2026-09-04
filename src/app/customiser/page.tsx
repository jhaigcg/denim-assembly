import type { Metadata } from "next";
import { Customiser } from "@/components/Customiser";

export const metadata: Metadata = {
  title: "Customiser",
  description:
    "Configure a denim specification — base style, denim quality, wash, hardware, trim and size run — with live per-piece and order-total pricing.",
};

export default function Page() {
  return <Customiser />;
}
