import FakeNewsClient from "@/components/public/fake-news";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake News Debunker - Republic Mirror | Fact-Check & Verify News",
  description: "India's most trusted fake news debunker. Fact-check viral claims, political misinformation, health rumors, and social media scams. Evidence-based verification by expert journalists.",
  keywords: "fake news debunker, fact check India, political misinformation, viral claim verification, news verification, rumor check, fake news detector, truth behind news, fact checking website",
  authors: [{ name: "Republic Mirror Fact-Check Team" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/fake-news',
    languages: {
      'en-US': '/en/fake-news',
      'hi-IN': '/hi/fake-news',
    },
  },
  openGraph: {
    title: "Fake News Debunker - Separate Truth from Fiction",
    description: "Expert fact-checking and verification of viral claims, political misinformation, and social media rumors.",
    url: 'https://republicmirror.com/fake-news',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-fake-news.jpg',
        width: 1200,
        height: 630,
        alt: 'Fake News Debunker - Republic Mirror',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fake News Debunker - Republic Mirror',
    description: 'Expert fact-checking and verification of viral claims and misinformation.',
    images: ['https://republicmirror.com/twitter-fake-news.jpg'],
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

export default function FakeNewsPage() {
  return <FakeNewsClient />;
}