import { Metadata } from "next";
import { RegisterForm } from "@/components/public/auth/register-form";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

export const metadata: Metadata = {
  title: "Register - Republic Mirror | Create Your Free Account",
  description: "Create a free Republic Mirror account to save articles, comment on news, bookmark fact-checks, and personalize your news experience.",
  keywords: "register, sign up, create account, Republic Mirror account, free news account, reader registration",
  authors: [{ name: "Republic Mirror" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: "Register - Republic Mirror | Create Your Free Account",
    description: "Join Republic Mirror today. Create a free account to save articles, comment on news, and get personalized content.",
    url: 'https://republicmirror.com/register',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-register.jpg',
        width: 1200,
        height: 630,
        alt: 'Republic Mirror Registration',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Register - Republic Mirror',
    description: 'Create your free Republic Mirror account today.',
    images: ['https://republicmirror.com/twitter-register.jpg'],
    creator: '@republicmirror',
    site: '@republicmirror',
  },
  robots: {
    index: false, // Registration pages should not be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RegisterPage() {
  return (
    <div>
      <PublicHeader />
      <RegisterForm />
      <PublicFooter />
    </div>
  );
}