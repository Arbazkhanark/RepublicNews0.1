// "use client";

// import type React from "react";
// import { useState } from "react";
// import { toast } from "sonner";

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     subject: "",
//     message: "",
//     messageType: "general",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/public/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         console.error("❌ Error:", errorData);
//         toast.error(errorData.error || "Failed to send message");
//       } else {
//         const data = await res.json();
//         console.log("✅ Success:", data);
//         toast.success("Message sent successfully! We'll get back to you soon.");
//         setFormData({
//           fullName: "",
//           email: "",
//           subject: "",
//           message: "",
//           messageType: "general",
//         });
//       }
//     } catch (err: unknown) {
//       console.error("❌ Request failed:", err);
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again later.";
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ✅ Sonner toaster */}
//       <div id="sonner-toaster">
//         {/* keep Toaster only once globally in your app layout.tsx */}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Contact Form */}
//           <div className="bg-white rounded-lg shadow-sm p-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               Send us a Message
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label
//                     htmlFor="fullName"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     id="fullName"
//                     name="fullName"
//                     required
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     placeholder="Your full name"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     placeholder="your.email@example.com"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="messageType"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Message Type
//                 </label>
//                 <select
//                   id="messageType"
//                   name="messageType"
//                   value={formData.messageType}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 >
//                   <option value="general">General Inquiry</option>
//                   <option value="news-tip">News Tip</option>
//                   <option value="press-release">Press Release</option>
//                   <option value="partnership">Partnership</option>
//                   <option value="complaint">Complaint</option>
//                   <option value="technical">Technical Issue</option>
//                 </select>
//               </div>

//               <div>
//                 <label
//                   htmlFor="subject"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Subject *
//                 </label>
//                 <input
//                   type="text"
//                   id="subject"
//                   name="subject"
//                   required
//                   value={formData.subject}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   placeholder="Brief subject of your message"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="message"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Message *
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   required
//                   rows={6}
//                   value={formData.message}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
//                   placeholder="Please provide details about your inquiry..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isSubmitting ? "Sending..." : "Send Message"}
//               </button>
//             </form>
//           </div>

//           {/* Right side panel remains same */}
//           {/* Contact Information */}
//           <div className="space-y-8">
//             {/* Office Information */}
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">
//                 📍 Our Office
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <span className="text-red-600 mt-1">🏢</span>
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       Republic Mirror Headquarters
//                     </p>
//                     <p className="text-gray-600">
//                       {/* 123 Press Street, Media District */}
//                       {/* <br /> */}
//                       New Delhi, India
//                     </p>
//                   </div>
//                 </div>
//                 {/* <div className="flex items-center gap-3">
//                   <span className="text-red-600">📞</span>
//                   <div>
//                     <p className="font-medium text-gray-900">Phone</p>
//                     <p className="text-gray-600">+91 96 5323 1654</p>
//                     <p className="text-gray-600">+91 87 0004 1771</p>
//                   </div>
//                 </div> */}
//                 <div className="flex items-center gap-3">
//                   <span className="text-red-600">📧</span>
//                   <div>
//                     <p className="font-medium text-gray-900">Email</p>
//                     <p className="text-gray-600">editor@republicmirror.com</p>
//                   </div>
//                 </div>
//                 {/* <div className="flex items-center gap-3">
//                   <span className="text-red-600">🕒</span>
//                   <div>
//                     <p className="font-medium text-gray-900">Business Hours</p>
//                     <p className="text-gray-600">
//                       Monday - Friday: 9:00 AM - 6:00 PM
//                       <br />
//                       Saturday: 10:00 AM - 4:00 PM
//                     </p>
//                   </div>
//                 </div> */}
//               </div>
//             </div>

//             {/* Editorial Team */}
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">
//                 ✍️ Editorial Team
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <p className="font-medium text-gray-900">
//                     News Tips & Story Ideas
//                   </p>
//                   <p className="text-gray-600">editor@republicmirror.com</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Press Releases</p>
//                   <p className="text-gray-600">editor@republicmirror.com</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Letters to Editor</p>
//                   <p className="text-gray-600">editor@republicmirror.com</p>
//                 </div>
//               </div>
//             </div>

//             {/* Social Media */}
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">
//                 🌐 Follow Us
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <a
//                   href="https://www.facebook.com/share/17oFjCf5eU/"
//                   className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <span className="text-blue-600">📘</span>
//                   <span className="font-medium">Facebook</span>
//                 </a>
//                 <a
//                   href="https://x.com/MirrorRepu11808"
//                   className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <span className="text-blue-400">🐦</span>
//                   <span className="font-medium">Twitter</span>
//                 </a>
//                 <a
//                   href="https://www.instagram.com/republic.mirror?utm_source=qr&igsh=MTdvNmN0ZXk1aTBzcQ"
//                   className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <span className="text-pink-600">📷</span>
//                   <span className="font-medium">Instagram</span>
//                 </a>
//                 <a
//                   href="https://www.youtube.com/@therepublicmirror"
//                   className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <span className="text-red-600">📺</span>
//                   <span className="font-medium">YouTube</span>
//                 </a>
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">
//                 🔗 Quick Links
//               </h3>
//               <div className="space-y-2">
//                 <a
//                   href="/about"
//                   className="block text-red-600 hover:text-red-700 font-medium"
//                 >
//                   About Republic Mirror
//                 </a>
//                 <a
//                   href="/careers"
//                   className="block text-red-600 hover:text-red-700 font-medium"
//                 >
//                   Career Opportunities
//                 </a>
//                 <a
//                   href="/advertise"
//                   className="block text-red-600 hover:text-red-700 font-medium"
//                 >
//                   Advertise with Us
//                 </a>
//                 <a
//                   href="/privacy"
//                   className="block text-red-600 hover:text-red-700 font-medium"
//                 >
//                   Privacy Policy
//                 </a>
//                 <a
//                   href="/terms"
//                   className="block text-red-600 hover:text-red-700 font-medium"
//                 >
//                   Terms of Service
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  X,
  Globe,
  ChevronDown,
  CloudSun,
  Wind,
  TrendingUp,
  TrendingDown,
  Newspaper,
} from "lucide-react";
import Image from "next/image";

// Language Context (if you don't have it, add this)
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    home: "HOME",
    national: "NATIONAL",
    international: "INTERNATIONAL",
    politics: "POLITICS",
    economy: "ECONOMY",
    sports: "SPORTS",
    opinion: "OPINION",
    contact: "CONTACT",
    breakingNews: "Breaking News:",
    searchPlaceholder: "Search news...",
    fakeNews: "FAKE NEWS",
    videos: "VIDEOS",
    english: "English",
    hindi: "हिंदी",

    // Contact Page
    contactUs: "Contact Us",
    sendMessage: "Send us a Message",
    fullName: "Full Name *",
    emailAddress: "Email Address *",
    messageType: "Message Type",
    subject: "Subject *",
    message: "Message *",
    generalInquiry: "General Inquiry",
    newsTip: "News Tip",
    pressRelease: "Press Release",
    partnership: "Partnership",
    complaint: "Complaint",
    technicalIssue: "Technical Issue",
    yourFullName: "Your full name",
    yourEmail: "your.email@example.com",
    subjectPlaceholder: "Brief subject of your message",
    messagePlaceholder: "Please provide details about your inquiry...",
    sending: "Sending...",
    send: "Send Message",
    ourOffice: "📍 Our Office",
    editorialTeam: "✍️ Editorial Team",
    followUs: "🌐 Follow Us",
    quickLinks: "🔗 Quick Links",

    // Office Info
    officeName: "Republic Mirror Headquarters",
    officeLocation: "New Delhi, India",
    phone: "Phone",
    email: "Email",
    businessHours: "Business Hours",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM",

    // Editorial Team
    newsTips: "News Tips & Story Ideas",
    pressReleases: "Press Releases",
    lettersToEditor: "Letters to Editor",
    contactEmail: "editor@republicmirror.com",

    // Social Media
    facebook: "Facebook",
    twitter: "Twitter",
    instagram: "Instagram",
    youtube: "YouTube",

    // Quick Links
    aboutUs: "About Republic Mirror",
    careers: "Career Opportunities",
    advertise: "Advertise with Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",

    // Footer
    reflectionOfTruth: "Reflection of Truth - Your trusted source for accurate and unbiased news coverage.",
    allRightsReserved: "All rights reserved.",
    designedWith: "Designed with ❤️ for truth and transparency",
  },
  hi: {
    // Header
    home: "होम",
    national: "राष्ट्रीय",
    international: "अंतर्राष्ट्रीय",
    politics: "राजनीति",
    economy: "अर्थव्यवस्था",
    sports: "खेल",
    opinion: "राय",
    contact: "संपर्क",
    breakingNews: "ब्रेकिंग न्यूज़:",
    searchPlaceholder: "समाचार खोजें...",
    fakeNews: "जाली खबरें",
    videos: "वीडियो",
    english: "English",
    hindi: "हिंदी",

    // Contact Page
    contactUs: "संपर्क करें",
    sendMessage: "हमें संदेश भेजें",
    fullName: "पूरा नाम *",
    emailAddress: "ईमेल पता *",
    messageType: "संदेश प्रकार",
    subject: "विषय *",
    message: "संदेश *",
    generalInquiry: "सामान्य पूछताछ",
    newsTip: "समाचार सुझाव",
    pressRelease: "प्रेस विज्ञप्ति",
    partnership: "साझेदारी",
    complaint: "शिकायत",
    technicalIssue: "तकनीकी समस्या",
    yourFullName: "आपका पूरा नाम",
    yourEmail: "आपका.ईमेल@उदाहरण.com",
    subjectPlaceholder: "आपके संदेश का संक्षिप्त विषय",
    messagePlaceholder: "कृपया अपनी पूछताछ के बारे में विवरण प्रदान करें...",
    sending: "भेजा जा रहा है...",
    send: "संदेश भेजें",
    ourOffice: "📍 हमारा कार्यालय",
    editorialTeam: "✍️ संपादकीय टीम",
    followUs: "🌐 हमें फॉलो करें",
    quickLinks: "🔗 त्वरित लिंक",

    // Office Info
    officeName: "रिपब्लिक मिरर मुख्यालय",
    officeLocation: "नई दिल्ली, भारत",
    phone: "फोन",
    email: "ईमेल",
    businessHours: "कार्य समय",
    hours: "सोमवार - शुक्रवार: सुबह 9:00 - शाम 6:00\nशनिवार: सुबह 10:00 - शाम 4:00",

    // Editorial Team
    newsTips: "समाचार सुझाव और कहानी विचार",
    pressReleases: "प्रेस विज्ञप्तियाँ",
    lettersToEditor: "संपादक को पत्र",
    contactEmail: "editor@republicmirror.com",

    // Social Media
    facebook: "फेसबुक",
    twitter: "ट्विटर",
    instagram: "इंस्टाग्राम",
    youtube: "यूट्यूब",

    // Quick Links
    aboutUs: "रिपब्लिक मिरर के बारे में",
    careers: "कैरियर के अवसर",
    advertise: "हमारे साथ विज्ञापन करें",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",

    // Footer
    reflectionOfTruth: "सत्य का प्रतिबिंब - सटीक और निष्पक्ष समाचार कवरेज के लिए आपका विश्वसनीय स्रोत।",
    allRightsReserved: "सभी अधिकार सुरक्षित।",
    designedWith: "सत्य और पारदर्शिता के लिए ❤️ के साथ डिज़ाइन किया गया",
  },
};

// Mock data for header
const mockData = {
  news: []
};

// Header Component
function PublicHeader({ language, setLanguage }: { language: string; setLanguage: (lang: string) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const t = (key: string) => translations[language as keyof typeof translations][key as keyof typeof translations.en] || key;

  const navigationItems = [
    { href: "/", label: t("home") },
    {
      href: "/category/national",
      label: t("national"),
      hasDropdown: true,
      subcategories: [
        { href: "/category/politics", label: t("politics") },
        { href: "/category/economy", label: t("economy") },
      ],
    },
    {
      href: "/category/international",
      label: t("international"),
      hasDropdown: true,
    },
    {
      href: "/fake-news",
      label: t("fakeNews"),
    },
    {
      href: "/opinion",
      label: t("opinion"),
    },
    {
      href: "https://www.youtube.com/@therepublicmirror",
      label: t("videos"),
      isExternal: true,
    },
    { href: "/contact", label: t("contact") },
  ];

  const getCategoryCount = () => 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-red-600 text-white h-8 flex items-center overflow-hidden">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between text-xs">
            {/* Left: Breaking News */}
            <div className="flex items-center gap-3 min-w-0 m-4">
              <span className="bg-white/20 px-2 py-0.5 rounded font-semibold tracking-wide">
                {language === "hi" ? "ब्रेकिंग" : "BREAKING"}
              </span>

              <div className="overflow-hidden whitespace-nowrap">
                <div className="animate-marquee flex gap-6">
                  <span>
                    {language === "hi"
                      ? "बजट चर्चा के लिए संसद सत्र का विस्तार"
                      : "Parliament Session Extended for Budget Discussion"}
                  </span>
                  <span>
                    {language === "hi"
                      ? "सेंसेक्स 75,000 के पार"
                      : "Sensex crosses 75,000 mark"}
                  </span>
                  <span>
                    {language === "hi"
                      ? "उत्तर भारत के लिए भारी बारिश का अलर्ट"
                      : "Heavy Rainfall Alert for North India"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Date (Desktop only) */}
            <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
              <span>
                {new Date().toLocaleDateString(
                  language === "hi" ? "hi-IN" : "en-IN",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.svg"
                alt="Republic Mirror Tagline"
                width={150}
                height={20}
                className="mx-auto mt-1"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() =>
                  item.hasDropdown && setHoveredCategory(item.href)
                }
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {item.isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 px-1 relative group"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 px-1 relative group"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}

                {item.hasDropdown && hoveredCategory === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fadeInDown">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {item.label}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getCategoryCount()}{" "}
                        {language === "hi" ? "लेख" : "articles"}
                      </p>
                    </div>
                    {item.subcategories?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <span>{subItem.label}</span>
                        <span className="text-xs text-gray-400">
                          {getCategoryCount()}
                        </span>
                      </Link>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link
                        href={item.href}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        {language === "hi"
                          ? `सभी ${item.label} देखें →`
                          : `View All ${item.label} →`}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search, Language, and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
                >
                  <Globe className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">
                    {language === "en" ? "EN" : "हि"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-fadeInDown">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={`transition-colors duration-200 ${
                    language === "en" ? "bg-red-50" : ""
                  }`}
                >
                  {t("english")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("hi")}
                  className={`transition-colors duration-200 ${
                    language === "hi" ? "bg-red-50" : ""
                  }`}
                >
                  {t("hindi")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative animate-slideDown">
            <Input
              placeholder={t("searchPlaceholder")}
              className="w-full pr-10 focus:ring-2 focus:ring-red-500 transition-all duration-300"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-slideDown">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item, index) =>
                item.isExternal ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 hover:pl-2"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <span className="text-xs text-gray-400">
                          {getCategoryCount()}{" "}
                          {language === "hi" ? "लेख" : "articles"}
                        </span>
                      )}
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-300 py-2 hover:pl-2"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <span className="text-xs text-gray-400">
                          {getCategoryCount()}{" "}
                          {language === "hi" ? "लेख" : "articles"}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}

// Footer Component
function PublicFooter({ language }: { language: string }) {
  const t = (key: string) => translations[language as keyof typeof translations][key as keyof typeof translations.en] || key;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-red-400">REPUBLIC</span>
                  <span className="text-white"> MIRROR</span>
                </h2>
                <p className="text-sm text-gray-400">Truth Above Everything</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              {t("reflectionOfTruth")}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/17oFjCf5eU/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/MirrorRepu11808" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/republic.mirror?utm_source=qr&igsh=MTdvNmN0ZXk1aTBzcQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@therepublicmirror" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-gray-400 hover:text-white transition-colors">
                  {t("advertise")}
                </Link>
              </li>
              <li>
                <Link href="/fake-news" className="text-gray-400 hover:text-white transition-colors">
                  {t("fakeNews")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>editor@republicmirror.com</span>
              </li>
              <li className="mt-4">
                <p className="text-sm">
                  {language === "hi" 
                    ? "नई दिल्ली, भारत"
                    : "New Delhi, India"
                  }
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Republic Mirror. {t("allRightsReserved")}</p>
          <p className="mt-2 text-sm">{t("designedWith")}</p>
        </div>
      </div>
    </footer>
  );
}

// Main Contact Page Component
export default function ContactPage() {
  const [language, setLanguage] = useState<string>("en");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    messageType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "en" || savedLanguage === "hi") {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => translations[language as keyof typeof translations][key as keyof typeof translations.en] || key;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Error:", errorData);
        toast.error(errorData.error || (language === "hi" ? "संदेश भेजने में विफल" : "Failed to send message"));
      } else {
        const data = await res.json();
        console.log("✅ Success:", data);
        toast.success(language === "hi" 
          ? "संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।"
          : "Message sent successfully! We'll get back to you soon."
        );
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
          messageType: "general",
        });
      }
    } catch (err: unknown) {
      console.error("❌ Request failed:", err);
      const errorMessage = language === "hi"
        ? "कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।"
        : "Something went wrong. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <PublicHeader language={language} setLanguage={handleSetLanguage} /> */}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
          {t("contactUs")}
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {language === "hi" 
            ? "हमसे संपर्क करें - हम आपकी प्रतिक्रिया और सुझावों का स्वागत करते हैं"
            : "Get in touch with us - We welcome your feedback and suggestions"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("sendMessage")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={t("yourFullName")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("emailAddress")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={t("yourEmail")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="messageType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("messageType")}
                </label>
                <select
                  id="messageType"
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="general">{t("generalInquiry")}</option>
                  <option value="news-tip">{t("newsTip")}</option>
                  <option value="press-release">{t("pressRelease")}</option>
                  <option value="partnership">{t("partnership")}</option>
                  <option value="complaint">{t("complaint")}</option>
                  <option value="technical">{t("technicalIssue")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={t("subjectPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder={t("messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t("sending") : t("send")}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Information */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("ourOffice")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">🏢</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {t("officeName")}
                    </p>
                    <p className="text-gray-600">
                      {t("officeLocation")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600">📧</span>
                  <div>
                    <p className="font-medium text-gray-900">{t("email")}</p>
                    <p className="text-gray-600">{t("contactEmail")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600">🕒</span>
                  <div>
                    <p className="font-medium text-gray-900">{t("businessHours")}</p>
                    <p className="text-gray-600 whitespace-pre-line">
                      {t("hours")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Team */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("editorialTeam")}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {t("newsTips")}
                  </p>
                  <p className="text-gray-600">{t("contactEmail")}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {t("pressReleases")}
                  </p>
                  <p className="text-gray-600">{t("contactEmail")}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {t("lettersToEditor")}
                  </p>
                  <p className="text-gray-600">{t("contactEmail")}</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("followUs")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.facebook.com/share/17oFjCf5eU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-blue-600">📘</span>
                  <span className="font-medium">{t("facebook")}</span>
                </a>
                <a
                  href="https://x.com/MirrorRepu11808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-blue-400">🐦</span>
                  <span className="font-medium">{t("twitter")}</span>
                </a>
                <a
                  href="https://www.instagram.com/republic.mirror?utm_source=qr&igsh=MTdvNmN0ZXk1aTBzcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-pink-600">📷</span>
                  <span className="font-medium">{t("instagram")}</span>
                </a>
                <a
                  href="https://www.youtube.com/@therepublicmirror"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-red-600">📺</span>
                  <span className="font-medium">{t("youtube")}</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("quickLinks")}
              </h3>
              <div className="space-y-2">
                <Link
                  href="/about"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  {t("aboutUs")}
                </Link>
                <Link
                  href="/careers"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  {t("careers")}
                </Link>
                <Link
                  href="/advertise"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  {t("advertise")}
                </Link>
                <Link
                  href="/privacy"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  {t("privacy")}
                </Link>
                <Link
                  href="/terms"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  {t("terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}