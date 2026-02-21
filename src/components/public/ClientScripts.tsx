"use client";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function ClientScripts() {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const handleAdSenseError = (e: any) => {
    console.error("AdSense script failed to load:", e);
    // You can add error tracking here if needed
  };

  return (
    <>
      {/* Google AdSense Script */}
      {adsenseClientId && (
        <Script
          id="adsbygoogle-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onError={handleAdSenseError}
        />
      )}
      
      {/* Google Analytics */}
      {gaId && <GoogleAnalytics gaId={gaId} />}
      
      {/* Structured Data for Organization */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "@id": "https://republicmirror.com/#organization",
            "name": "Republic Mirror",
            "url": "https://republicmirror.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://republicmirror.com/logo.svg",
              "width": 150,
              "height": 60,
            },
            "sameAs": [
              "https://www.facebook.com/share/17oFjCf5eU/",
              "https://x.com/MirrorRepu11808",
              "https://www.instagram.com/republic.mirror",
              "https://www.youtube.com/@therepublicmirror",
              "https://www.linkedin.com/company/republicmirror"
            ],
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-98765-43210",
                "contactType": "customer service",
                "email": "editor@republicmirror.com",
                "availableLanguage": ["English", "Hindi"]
              }
            ],
            "foundingDate": "2021",
            "description": "India's most trusted fact-checking and verified news platform.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "New Delhi",
              "addressCountry": "IN"
            }
          })
        }}
      />
      
      {/* Structured Data for Website */}
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://republicmirror.com/#website",
            "url": "https://republicmirror.com",
            "name": "Republic Mirror",
            "description": "Reflection of Truth - India's trusted news platform",
            "publisher": {
              "@id": "https://republicmirror.com/#organization"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://republicmirror.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "inLanguage": ["en", "hi"]
          })
        }}
      />
    </>
  );
}