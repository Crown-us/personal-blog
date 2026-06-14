"use client";

import React, { useEffect } from "react";

interface AdSenseProps {
  adClient: string; // ca-pub-XXXXXXXXXXXXXXXX
  adSlot: string;   // 1234567890
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

export default function AdSense({
  adClient,
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" }
}: AdSenseProps) {
  useEffect(() => {
    // Only execute on client side and prevent crashes if script is blocked by an ad-blocker
    try {
      const adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.warn("AdSense warning (likely blocked by AdBlocker):", err);
    }
  }, [adSlot]);

  return (
    <div className="adsense-container my-6 overflow-hidden flex justify-center w-full min-h-[100px] bg-secondary/10 rounded-xl border border-border/40 items-center">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
