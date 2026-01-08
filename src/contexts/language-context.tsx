"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
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

    // Homepage
    todaysNews: "Today's News",
    latestNews: "Latest News",
    trendingNews: "Trending News",
    categories: "Categories",
    subscribeNewsletter: "Subscribe to Newsletter",
    newsletterDescription: "Get the latest news delivered to your inbox daily.",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",

    // Article
    byAuthor: "By",
    newsBy: "News by",
    minRead: "min read",
    views: "views",
    share: "Share:",
    aboutAuthor: "About the Author",
    newsContributor: "News Contributor",
    newsSource: "News Source",
    tags: "Tags:",

    // Footer
    reflectionOfTruth:
      "Reflection of Truth - Your trusted source for accurate and unbiased news coverage.",
    quickLinks: "Quick Links",
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    advertise: "Advertise",
    contactInfo: "Contact Info",
    allRightsReserved: "All rights reserved.",
    designedWith: "Designed with ❤️ for truth and transparency",

    // Common
    loading: "Loading...",
    readMore: "Read More",
    viewAll: "View All",
    featured: "Featured",
    breaking: "BREAKING",
    english: "English",
    hindi: "हिंदी",
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

    // Homepage
    todaysNews: "आज की खबरें",
    latestNews: "ताज़ा खबरें",
    trendingNews: "ट्रेंडिंग न्यूज़",
    categories: "श्रेणियां",
    subscribeNewsletter: "न्यूज़लेटर की सदस्यता लें",
    newsletterDescription: "रोज़ाना ताज़ा खबरें अपने ईमेल पर पाएं।",
    enterEmail: "अपना ईमेल दर्ज करें",
    subscribe: "सदस्यता लें",

    // Article
    byAuthor: "लेखक:",
    newsBy: "समाचार:",
    minRead: "मिनट पढ़ें",
    views: "बार देखा गया",
    share: "साझा करें:",
    aboutAuthor: "लेखक के बारे में",
    newsContributor: "समाचार योगदानकर्ता",
    newsSource: "समाचार स्रोत",
    tags: "टैग:",

    // Footer
    reflectionOfTruth:
      "सत्य का प्रतिबिंब - सटीक और निष्पक्ष समाचार कवरेज के लिए आपका विश्वसनीय स्रोत।",
    quickLinks: "त्वरित लिंक",
    aboutUs: "हमारे बारे में",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    advertise: "विज्ञापन दें",
    contactInfo: "संपर्क जानकारी",
    allRightsReserved: "सभी अधिकार सुरक्षित।",
    designedWith: "सत्य और पारदर्शिता के लिए ❤️ के साथ डिज़ाइन किया गया",

    // Common
    loading: "लोड हो रहा है...",
    readMore: "और पढ़ें",
    viewAll: "सभी देखें",
    featured: "फीचर्ड",
    breaking: "ब्रेकिंग",
    english: "English",
    hindi: "हिंदी",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
