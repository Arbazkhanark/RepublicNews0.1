import PrivacyPolicyClient from "@/components/public/privacy-policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Republic Mirror | Your Data Protection & Privacy Rights",
  description: "Read Republic Mirror's comprehensive privacy policy. Learn how we collect, use, protect your personal information, and your rights regarding data privacy.",
  keywords: "privacy policy, data protection, GDPR, privacy rights, cookie policy, Republic Mirror privacy, information security, data collection",
  authors: [{ name: "Republic Mirror Legal Team" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/privacy',
    languages: {
      'en-US': '/en/privacy',
      'hi-IN': '/hi/privacy',
    },
  },
  openGraph: {
    title: "Privacy Policy - Republic Mirror | Your Data Protection Rights",
    description: "Understand how Republic Mirror protects your privacy and handles your personal information.",
    url: 'https://republicmirror.com/privacy',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-privacy.jpg',
        width: 1200,
        height: 630,
        alt: 'Republic Mirror Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Republic Mirror',
    description: 'Learn about your privacy rights and how we protect your data.',
    images: ['https://republicmirror.com/twitter-privacy.jpg'],
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

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}