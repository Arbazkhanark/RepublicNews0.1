"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { PublicHeader } from "./header";
import { PublicFooter } from "./footer";
import { GoogleAdSense, GoogleAdSenseScript } from "./google-adsense";

// Language translations - EXACT same as your original
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


// Main Contact Page Component - EXACT same as your original + Ads
export default function ContactClient() {
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
    <>
      {/* AdSense Script */}
      <GoogleAdSenseScript />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Republic Mirror",
            "description": "Get in touch with Republic Mirror's editorial team for news tips, press releases, and inquiries.",
            "url": "https://republicmirror.com/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "Republic Mirror",
              "url": "https://republicmirror.com",
              "logo": "https://republicmirror.com/logo.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-98765-43210",
                "contactType": "customer service",
                "email": "editor@republicmirror.com",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://www.facebook.com/share/17oFjCf5eU/",
                "https://x.com/MirrorRepu11808",
                "https://www.instagram.com/republic.mirror",
                "https://www.youtube.com/@therepublicmirror"
              ]
            }
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        
        {/* Ad Unit - Top Banner - NEW */}
        <div className="container mx-auto px-4 mt-4">
          <GoogleAdSense 
            adSlot="4567890123" 
            adFormat="horizontal"
            className="w-full"
          />
        </div>
        
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
            {/* Contact Form - EXACT same as your original */}
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

            {/* Contact Information - EXACT same as your original */}
            <div className="space-y-8">
              {/* Ad Unit - Sidebar - NEW */}
              <div className="mb-8">
                <GoogleAdSense 
                  adSlot="5678901234" 
                  adFormat="rectangle"
                  className="w-full"
                />
              </div>

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

        {/* Ad Unit - Bottom Banner - NEW */}
        <div className="container mx-auto px-4 mb-8">
          <GoogleAdSense 
            adSlot="6789012345" 
            adFormat="horizontal"
            className="w-full"
          />
        </div>

        <PublicFooter />
      </div>
    </>
  );
}