import TermsOfServiceClient from "@/components/public/terms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Republic Mirror | User Agreement & Legal Terms",
  description: "Read Republic Mirror's terms of service. Understand your rights and responsibilities when using our website, including content usage, user conduct, and legal disclaimers.",
  keywords: "terms of service, user agreement, legal terms, terms and conditions, Republic Mirror terms, website terms, acceptable use policy, disclaimer",
  authors: [{ name: "Republic Mirror Legal Team" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/terms',
    languages: {
      'en-US': '/en/terms',
      'hi-IN': '/hi/terms',
    },
  },
  openGraph: {
    title: "Terms of Service - Republic Mirror | User Agreement",
    description: "Review the terms and conditions governing your use of Republic Mirror website and services.",
    url: 'https://republicmirror.com/terms',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-terms.jpg',
        width: 1200,
        height: 630,
        alt: 'Republic Mirror Terms of Service',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - Republic Mirror',
    description: 'Review the terms and conditions for using Republic Mirror.',
    images: ['https://republicmirror.com/twitter-terms.jpg'],
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

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}