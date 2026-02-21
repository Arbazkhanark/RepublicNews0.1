// "use client"

// import { useEffect } from "react"

// declare global {
//   interface Window {
//     adsbygoogle?: { push: (params: object) => void }[];
//   }
// }

// interface GoogleAdSenseProps {
//   adSlot: string
//   adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
//   fullWidthResponsive?: boolean
//   className?: string
// }

// export function GoogleAdSense({
//   adSlot,
//   adFormat = "auto",
//   fullWidthResponsive = true,
//   className = "",
// }: GoogleAdSenseProps) {
//   useEffect(() => {
//     try {
//       if (typeof window !== "undefined" && window.adsbygoogle) {
//         window.adsbygoogle.push({})
//       }
//     } catch (error) {
//       console.error("AdSense error:", error)
//     }
//   }, [])

//   return (
//     <div className={`adsense-container ${className}`}>
//       <ins
//         className="adsbygoogle"
//         style={{ display: "block" }}
//         data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
//         data-ad-slot={adSlot}
//         data-ad-format={adFormat}
//         data-full-width-responsive={fullWidthResponsive.toString()}
//       />
//     </div>
//   )
// }

// // AdSense script component for layout
// export function GoogleAdSenseScript() {
//   if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
//     return null
//   }

//   return (
//     <script
//       async
//       src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
//       crossOrigin="anonymous"
//     />
//   )
// }

"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: { push: (params: object) => void }[];
  }
}

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
  className?: string;
}

/**
 * Shows Placeholder Box in Development
 * Shows Real Ads in Production
 */
export function GoogleAdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: GoogleAdSenseProps) {
  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (!isDev) {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          (window.adsbygoogle as any).push({});
        }
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [isDev]);

  // ===============================
  // ✅ DEVELOPMENT PLACEHOLDER UI
  // ===============================
  if (isDev) {
    return (
      <div
        className={`flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-md ${className}`}
        style={{
          minHeight:
            adFormat === "horizontal"
              ? 90
              : adFormat === "rectangle"
              ? 280
              : adFormat === "vertical"
              ? 600
              : 120,
        }}
      >
        <div className="text-center space-y-1">
          <div className="font-semibold">Ad Placeholder</div>
          <div className="text-xs opacity-70">Slot: {adSlot}</div>
          <div className="text-xs capitalize opacity-70">
            Format: {adFormat}
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // ✅ PRODUCTION REAL ADS
  // ===============================
  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// ===============================
// AdSense Script Loader
// ===============================
export function GoogleAdSenseScript() {
  // if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
