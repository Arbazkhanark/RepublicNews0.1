import ContactClient from "@/components/public/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Republic Mirror | Get in Touch with Our Editorial Team",
  description: "Contact Republic Mirror for news tips, press releases, partnerships, or general inquiries. Our editorial team is here to help with your questions and feedback.",
  keywords: "contact Republic Mirror, news tips, press release submission, media inquiry, editorial contact, Indian news contact, report news, journalist contact",
  authors: [{ name: "Republic Mirror Team" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/contact',
    languages: {
      'en-US': '/en/contact',
      'hi-IN': '/hi/contact',
    },
  },
  openGraph: {
    title: "Contact Republic Mirror - Reach Our Editorial Team",
    description: "Have a news tip or want to get in touch? Contact our team of journalists and editors today.",
    url: 'https://republicmirror.com/contact',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Republic Mirror',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Republic Mirror',
    description: 'Get in touch with our editorial team for news tips and inquiries.',
    images: ['https://republicmirror.com/twitter-contact.jpg'],
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

export default function ContactPage() {
  return <ContactClient />;
}