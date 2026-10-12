"use client";

import { useEffect, useRef } from "react";

/** The video opens on a dark title card; park the idle preview on a real shot, then restart from 0 on first play. */
const PREVIEW_FRAME_S = 9;

export function FactoryVideo({ ariaLabel }: { ariaLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const started = useRef(false);

  // Metadata can load before hydration attaches onLoadedMetadata, so cover both orders.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const park = () => {
      if (!started.current) v.currentTime = PREVIEW_FRAME_S;
    };
    if (v.readyState >= 1) park();
    else v.addEventListener("loadedmetadata", park, { once: true });
    return () => v.removeEventListener("loadedmetadata", park);
  }, []);

  return (
    <video
      ref={ref}
      className="w-full aspect-video bg-black border border-[rgba(246,246,244,0.18)]"
      src="/assets/video/factory.mp4"
      controls
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
      onPlay={(e) => {
        if (!started.current) {
          started.current = true;
          e.currentTarget.currentTime = 0;
        }
      }}
    />
  );
}
