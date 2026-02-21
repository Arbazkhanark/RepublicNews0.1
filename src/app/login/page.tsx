// import { LoginForm } from "@/components/public/auth/login-form";
// import { PublicHeader } from "@/components/public/header";

// export default function LoginPage() {
//   return (
//     <div>
//       {/* // <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"> */}
//       <PublicHeader />
//       {/* <div className="mt-20">
//       </div> */}
//       <LoginForm />
//     </div>
//   );
// }







import { Metadata } from "next";
import { LoginForm } from "@/components/public/auth/login-form";
import { PublicHeader } from "@/components/public/header";

export const metadata: Metadata = {
  title: "Login - Republic Mirror | Access Your Account",
  description: "Login to your Republic Mirror account to access personalized news, save articles, and engage with our content.",
  keywords: "login, sign in, Republic Mirror account, news login, reader account, member access",
  authors: [{ name: "Republic Mirror" }],
  creator: "Republic Mirror",
  publisher: "Republic Mirror",
  metadataBase: new URL('https://republicmirror.com'),
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: "Login - Republic Mirror",
    description: "Access your Republic Mirror account for personalized news experience.",
    url: 'https://republicmirror.com/login',
    siteName: 'Republic Mirror',
    images: [
      {
        url: 'https://republicmirror.com/og-login.jpg',
        width: 1200,
        height: 630,
        alt: 'Republic Mirror Login',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login - Republic Mirror',
    description: 'Access your Republic Mirror account.',
    images: ['https://republicmirror.com/twitter-login.jpg'],
    creator: '@republicmirror',
    site: '@republicmirror',
  },
  robots: {
    index: false, // Login pages should not be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LoginPage() {
  return <>
  <PublicHeader/>
  <LoginForm />
  </>;
}