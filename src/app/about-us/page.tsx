import AboutUsClient from "@/components/public/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Republic Mirror | Truth Behind News | Reflection of Truth",
  description: "Republic Mirror is a fact-checking and verified news platform committed to unbiased journalism. Meet our team of expert journalists dedicated to fighting misinformation.",
  keywords: "Republic Mirror about, fact-checking India, verified news, unbiased journalism, truth behind news, Indian media, fact check team, Owais Siddiqui, Waseem Ahmed",
  authors: [{ name: "Republic Mirror Team" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/about-us',
    languages: {
      'en-US': '/en/about-us',
      'hi-IN': '/hi/about-us',
    },
  },
  openGraph: {
    title: "Republic Mirror - Reflection of Truth",
    description: "India's most trusted fact-checking and verified news platform. Meet our team of expert journalists.",
    url: 'https://republicmirror.com/about-us',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Republic Mirror Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Republic Mirror - Reflection of Truth',
    description: 'India\'s most trusted fact-checking platform. Meet our team.',
    images: ['https://republicmirror.com/twitter-image.jpg'],
    creator: '@republicmirror',
    site: '@republicmirror',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Add your actual verification code
  },
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}