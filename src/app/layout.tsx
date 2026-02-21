// import type React from "react";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { Suspense } from "react";
// import { LanguageProvider } from "@/contexts/language-context";
// import "./globals.css";
// import { Toaster } from "sonner";
// import Script from "next/script";
// //  import { GoogleAdSenseScript } from "@/components/public/google-adsense"

// // Load Inter font from Google
// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// export const metadata: Metadata = {
//   title: "Republic Mirror - Reflection of Truth",
//   description: "Your trusted source for news and information",
//   generator: "Republic Mirror",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Optional: Add any analytics or ads scripts here */}
//         {/* <GoogleAdSenseScript /> */}
//       </head>
//       <Script
//         async
//         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
//         crossOrigin="anonymous"
//         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
//         strategy="afterInteractive"
//       />
//       <body className={`font-sans ${inter.variable}`}>
//         <LanguageProvider>
//           <Toaster position="top-right" />
//           <Suspense fallback={null}>{children}</Suspense>
//         </LanguageProvider>
//       </body>
//     </html>
//   );
// }












// import type React from "react";
// import type { Metadata } from "next";
// import { Inter,Noto_Sans_Devanagari } from "next/font/google";
// import { Suspense } from "react";
// import { LanguageProvider } from "@/contexts/language-context";
// import "./globals.css";
// import { Toaster } from "sonner";
// import Script from "next/script";
// import { GoogleAnalytics } from "@next/third-parties/google";


// // Load Inter font from Google with proper optimization
// const inter = Inter({ 
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
//   preload: true,
// });

// // Noto Sans Devanagari - हिंदी के लिए
// const notoSansDevanagari = Noto_Sans_Devanagari({
//   subsets: ["latin"], // Note: 'devanagari' नहीं, बल्कि 'latin' ही इस्तेमाल करें
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-noto-sans-devanagari",
//   display: "swap",
//   preload: false, // या true कर सकते हैं अगर जरूरत हो
// });

// export const metadata: Metadata = {
//   metadataBase: new URL('https://republicmirror.com'),
//   title: {
//     default: "Republic Mirror - Reflection of Truth | India's Trusted News Platform",
//     template: "%s | Republic Mirror",
//   },
//   description: "Republic Mirror is India's most trusted fact-checking and verified news platform. Get accurate news, fake news debunking, political analysis, and unbiased journalism.",
//   keywords: "Republic Mirror, Indian news, fact check India, fake news debunker, verified news, unbiased journalism, political news India, breaking news, truth behind news, media platform",
//   authors: [{ name: "Republic Mirror Team", url: "https://republicmirror.com/about-us" }],
//   creator: "Republic Mirror",
//   publisher: "Republic Mirror",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   alternates: {
//     canonical: 'https://republicmirror.com',
//     languages: {
//       'en-US': 'https://republicmirror.com/en',
//       'hi-IN': 'https://republicmirror.com/hi',
//     },
//   },
//   openGraph: {
//     title: "Republic Mirror - Reflection of Truth",
//     description: "India's most trusted fact-checking and verified news platform. Get accurate news and unbiased journalism.",
//     url: 'https://republicmirror.com',
//     siteName: 'Republic Mirror',
//     images: [
//       {
//         url: 'https://republicmirror.com/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'Republic Mirror - Reflection of Truth',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Republic Mirror - Reflection of Truth',
//     description: 'India\'s most trusted fact-checking platform.',
//     images: ['https://republicmirror.com/twitter-image.jpg'],
//     creator: '@republicmirror',
//     site: '@republicmirror',
//   },
//   robots: {
//     index: true,
//     follow: true,
//     nocache: false,
//     googleBot: {
//       index: true,
//       follow: true,
//       noimageindex: false,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
//   icons: {
//     icon: [
//       { url: '/favicon.ico', sizes: 'any' },
//       { url: '/icon.svg', type: 'image/svg+xml' },
//       { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
//       { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
//     ],
//     apple: [
//       { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
//     ],
//     other: [
//       {
//         rel: 'mask-icon',
//         url: '/safari-pinned-tab.svg',
//         color: '#dc2626',
//       },
//     ],
//   },
//   manifest: '/site.webmanifest',
//   verification: {
//     google: 'google-site-verification-code', // Add your actual Google Search Console verification code
//     yandex: 'yandex-verification-code', // Optional
//     other: {
//       'facebook-domain-verification': ['facebook-verification-code'], // Optional for Facebook
//     },
//   },
//   category: 'news',
//   classification: 'News Media',
//   other: {
//     'og:image:width': '1200',
//     'og:image:height': '630',
//     'og:image:type': 'image/jpeg',
//     'twitter:label1': 'Written by',
//     'twitter:data1': 'Republic Mirror Team',
//     'twitter:label2': 'Est. reading time',
//     'twitter:data2': '5 minutes',
//   },
// };

// export const viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 5,
//   userScalable: true,
//   themeColor: '#dc2626',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Get AdSense client ID from environment variable
//   const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

//   return (
//     <html lang="en" dir="ltr" className={inter.variable}>
//       <head>
//         {/* Preconnect to essential domains */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
//         <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
//         <link rel="preconnect" href="https://www.googletagmanager.com" />
        
//         {/* DNS Prefetch for faster resolution */}
//         <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
//         <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
//         <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
//         {/* Preload critical assets */}
//         <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        
//         {/* Canonical URL */}
//         <link rel="canonical" href="https://republicmirror.com" />
        
//         {/* Alternate language versions */}
//         <link rel="alternate" href="https://republicmirror.com/en" hrefLang="en" />
//         <link rel="alternate" href="https://republicmirror.com/hi" hrefLang="hi" />
//         <link rel="alternate" href="https://republicmirror.com" hrefLang="x-default" />
        
//         {/* RSS Feed */}
//         <link rel="alternate" type="application/rss+xml" title="Republic Mirror RSS Feed" href="https://republicmirror.com/rss.xml" />
        
//         {/* Sitemap */}
//         <link rel="sitemap" type="application/xml" title="Sitemap" href="https://republicmirror.com/sitemap.xml" />
        
//         {/* Favicon for all platforms */}
//         <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
//         <link rel="icon" type="image/svg+xml" href="/icon.svg" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//         <link rel="manifest" href="/site.webmanifest" />
        
//         {/* Microsoft Tiles */}
//         <meta name="msapplication-TileColor" content="#dc2626" />
//         <meta name="msapplication-config" content="/browserconfig.xml" />
        
//         {/* Theme Color for browsers */}
//         <meta name="theme-color" content="#dc2626" media="(prefers-color-scheme: light)" />
//         <meta name="theme-color" content="#991b1b" media="(prefers-color-scheme: dark)" />
//       </head>
      
//       {/* Google AdSense Script - Properly configured */}
//       {adsenseClientId && (
//         <Script
//           id="adsbygoogle-init"
//           async
//           src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
//           crossOrigin="anonymous"
//           strategy="afterInteractive"
//           onError={(e) => {
//             console.error("AdSense script failed to load:", e);
//             // Fallback or error tracking
//           }}
//         />
//       )}
      
//       {/* Google Analytics (optional but recommended) */}
//       {process.env.NEXT_PUBLIC_GA_ID && (
//         <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
//       )}
      
//       {/* Structured Data for Organization */}
//       <Script
//         id="organization-structured-data"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "NewsMediaOrganization",
//             "@id": "https://republicmirror.com/#organization",
//             "name": "Republic Mirror",
//             "url": "https://republicmirror.com",
//             "logo": {
//               "@type": "ImageObject",
//               "url": "https://republicmirror.com/logo.svg",
//               "width": 150,
//               "height": 60,
//             },
//             "sameAs": [
//               "https://www.facebook.com/share/17oFjCf5eU/",
//               "https://x.com/MirrorRepu11808",
//               "https://www.instagram.com/republic.mirror",
//               "https://www.youtube.com/@therepublicmirror",
//               "https://www.linkedin.com/company/republicmirror"
//             ],
//             "contactPoint": [
//               {
//                 "@type": "ContactPoint",
//                 "telephone": "+91-98765-43210",
//                 "contactType": "customer service",
//                 "email": "editor@republicmirror.com",
//                 "availableLanguage": ["English", "Hindi"]
//               }
//             ],
//             "foundingDate": "2021",
//             "description": "India's most trusted fact-checking and verified news platform.",
//             "address": {
//               "@type": "PostalAddress",
//               "addressLocality": "New Delhi",
//               "addressCountry": "IN"
//             }
//           })
//         }}
//       />
      
//       {/* Structured Data for Website */}
//       <Script
//         id="website-structured-data"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "WebSite",
//             "@id": "https://republicmirror.com/#website",
//             "url": "https://republicmirror.com",
//             "name": "Republic Mirror",
//             "description": "Reflection of Truth - India's trusted news platform",
//             "publisher": {
//               "@id": "https://republicmirror.com/#organization"
//             },
//             "potentialAction": {
//               "@type": "SearchAction",
//               "target": {
//                 "@type": "EntryPoint",
//                 "urlTemplate": "https://republicmirror.com/search?q={search_term_string}"
//               },
//               "query-input": "required name=search_term_string"
//             },
//             "inLanguage": ["en", "hi"]
//           })
//         }}
//       />
      
//       {/* Breadcrumb structured data (will be populated by pages) */}
      
//       <body className={`font-sans antialiased min-h-screen flex flex-col bg-white`}>
//         <LanguageProvider>
//           {/* Toast notifications */}
//           <Toaster 
//             position="top-right" 
//             richColors 
//             closeButton
//             toastOptions={{
//               duration: 5000,
//               className: "text-sm",
//             }}
//           />
          
//           {/* Suspense for better loading performance */}
//           <Suspense fallback={
//             <div className="min-h-screen flex items-center justify-center">
//               <div className="animate-pulse text-red-600">Loading Republic Mirror...</div>
//             </div>
//           }>
//             {children}
//           </Suspense>
//         </LanguageProvider>
        
//         {/* Skip to main content link for accessibility */}
//         <a 
//           href="#main-content" 
//           className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-md"
//         >
//           Skip to main content
//         </a>
//       </body>
//     </html>
//   );
// }














import type React from "react";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { Suspense } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

// Load Inter font for English
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
});

// Load Noto Sans Devanagari for Hindi
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://republicmirror.com'),
  title: {
    default: "Republic Mirror - Reflection of Truth | India's Trusted News Platform",
    template: "%s | Republic Mirror",
  },
  description: "Republic Mirror is India's most trusted fact-checking and verified news platform. Get accurate news, fake news debunking, political analysis, and unbiased journalism.",
  keywords: "Republic Mirror, Indian news, fact check India, fake news debunker, verified news, unbiased journalism, political news India, breaking news, truth behind news, media platform",
  authors: [{ name: "Republic Mirror Team", url: "https://republicmirror.com/about-us" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://republicmirror.com',
    languages: {
      'en-US': 'https://republicmirror.com/en',
      'hi-IN': 'https://republicmirror.com/hi',
    },
  },
  openGraph: {
    title: "Republic Mirror - Reflection of Truth",
    description: "India's most trusted fact-checking and verified news platform. Get accurate news and unbiased journalism.",
    url: 'https://republicmirror.com',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Republic Mirror - Reflection of Truth',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Republic Mirror - Reflection of Truth',
    description: 'India\'s most trusted fact-checking platform.',
    images: ['https://republicmirror.com/twitter-image.jpg'],
    creator: '@republicmirror',
    site: '@republicmirror',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#dc2626',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'facebook-domain-verification': ['facebook-verification-code'],
    },
  },
  category: 'news',
  classification: 'News Media',
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'twitter:label1': 'Written by',
    'twitter:data1': 'Republic Mirror Team',
    'twitter:label2': 'Est. reading time',
    'twitter:data2': '5 minutes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#dc2626',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get AdSense client ID from environment variable
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html 
      lang="en" 
      dir="ltr" 
      className={`${inter.variable} ${notoSansDevanagari.variable}`}
    >
      <head>
        {/* Preconnect to essential domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS Prefetch for faster resolution */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://republicmirror.com" />
        
        {/* Alternate language versions */}
        <link rel="alternate" href="https://republicmirror.com/en" hrefLang="en" />
        <link rel="alternate" href="https://republicmirror.com/hi" hrefLang="hi" />
        <link rel="alternate" href="https://republicmirror.com" hrefLang="x-default" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Republic Mirror RSS Feed" href="https://republicmirror.com/rss.xml" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="https://republicmirror.com/sitemap.xml" />
        
        {/* Favicon for all platforms */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Theme Color for browsers */}
        <meta name="theme-color" content="#dc2626" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#991b1b" media="(prefers-color-scheme: dark)" />
      </head>
      
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white">
        <LanguageProvider>
          {/* Toast notifications */}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 5000,
              className: "text-sm",
            }}
          />
          
          {/* Suspense for better loading performance */}
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-pulse text-red-600">Loading Republic Mirror...</div>
            </div>
          }>
            {children}
          </Suspense>
        </LanguageProvider>
        
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
      </body>
      
      {/* Google AdSense Script - Properly configured */}
      {adsenseClientId && (
        <Script
          id="adsbygoogle-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onError={(e) => {
            console.error("AdSense script failed to load:", e);
          }}
        />
      )}
      
      {/* Google Analytics (optional but recommended) */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      
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
    </html>
  );
}