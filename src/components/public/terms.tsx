"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import Script from "next/script";
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Ban,
  AlertCircle,
  BookOpen,
  Users,
  Globe,
  Mail,
  Calendar,
  Gavel,
  UserCheck,
  XCircle,
  HelpCircle,
  Info
} from "lucide-react";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

export default function TermsOfServiceClient() {
  const { language } = useLanguage();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": language === "hi" ? "सेवा की शर्तें - रिपब्लिक मिरर" : "Terms of Service - Republic Mirror",
    "description": language === "hi" 
      ? "रिपब्लिक मिरर की सेवा शर्तें। जानें कि हमारी वेबसाइट का उपयोग करते समय आपके अधिकार और जिम्मेदारियां क्या हैं।"
      : "Republic Mirror's terms of service. Learn about your rights and responsibilities when using our website.",
    "url": "https://republicmirror.com/terms",
    "mainEntity": {
      "@type": "WebPage",
      "name": "Terms of Service",
      "description": "Legal terms and conditions for website usage",
      "publisher": {
        "@type": "Organization",
        "name": "Republic Mirror",
        "logo": {
          "@type": "ImageObject",
          "url": "https://republicmirror.com/logo.svg"
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0]
    }
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="terms-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-12">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Scale className="w-4 h-4" />
                  {language === "hi" ? "सेवा की शर्तें" : "Terms of Service"}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "Republic Mirror सेवा शर्तें" 
                    : "Republic Mirror Terms of Service"}
                </h1>
                
                <p className="text-lg text-gray-600 mb-8">
                  {language === "hi"
                    ? "हमारी वेबसाइट का उपयोग करने से पहले कृपया इन शर्तों को ध्यान से पढ़ें।"
                    : "Please read these terms carefully before using our website."}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {language === "hi" ? "अंतिम अपडेट" : "Last Updated"}:{" "}
                    {new Date().toLocaleDateString(
                      language === "hi" ? "hi-IN" : "en-IN",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {language === "hi" ? "सभी उपयोगकर्ताओं के लिए" : "For All Users"}
                  </div>
                  <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === "hi" ? "वैश्विक कवरेज" : "Global Coverage"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Important Notice */}
              <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "hi" ? "महत्वपूर्ण सूचना" : "Important Notice"}
                    </h3>
                    <p className="text-gray-700">
                      {language === "hi"
                        ? "इन सेवा शर्तों को पढ़कर और हमारी वेबसाइट का उपयोग करके, आप इन शर्तों से बंधने के लिए सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।"
                        : "By reading these terms and using our website, you agree to be bound by these terms. If you do not agree, please do not use our website."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {language === "hi" ? "अनुक्रम" : "Table of Contents"}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { id: "acceptance", label: language === "hi" ? "सेवा की स्वीकृति" : "Acceptance of Terms" },
                    { id: "eligibility", label: language === "hi" ? "पात्रता" : "Eligibility" },
                    { id: "content", label: language === "hi" ? "सामग्री नीति" : "Content Policy" },
                    { id: "user-conduct", label: language === "hi" ? "उपयोगकर्ता आचरण" : "User Conduct" },
                    { id: "intellectual", label: language === "hi" ? "बौद्धिक संपदा" : "Intellectual Property" },
                    { id: "limitation", label: language === "hi" ? "दायित्व सीमा" : "Limitation of Liability" },
                    { id: "termination", label: language === "hi" ? "सेवा समाप्ति" : "Termination" },
                    { id: "changes", label: language === "hi" ? "परिवर्तन" : "Changes to Terms" },
                  ].map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:bg-white p-2 rounded transition-colors"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-medium">
                        {index + 1}
                      </span>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* 1. Acceptance of Terms */}
              <section id="acceptance" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 text-red-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" 
                      ? "सेवा की स्वीकृति" 
                      : "Acceptance of Terms"}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    {language === "hi"
                      ? "ये सेवा शर्तें ('शर्तें') Republic Mirror ('हम', 'हमारा', 'हमें') और उपयोगकर्ता ('आप') के बीच एक कानूनी समझौता हैं। इन शर्तों द्वारा हमारी वेबसाइट https://republicmirror.com ('वेबसाइट') और संबंधित सेवाओं ('सेवाएं') तक आपकी पहुंच और उपयोग शासित होता है।"
                      : "These Terms of Service ('Terms') constitute a legal agreement between Republic Mirror ('we', 'our', 'us') and the user ('you'). These Terms govern your access to and use of our website https://republicmirror.com ('Website') and related services ('Services')."}
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium mb-2">
                      {language === "hi" ? "महत्वपूर्ण:" : "Important:"}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>
                        {language === "hi"
                          ? "वेबसाइट का उपयोग करके, आप इन शर्तों से बंधने के लिए सहमत होते हैं"
                          : "By using the Website, you agree to be bound by these Terms"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें"
                          : "If you do not agree to these Terms, please do not use the Website"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "आपका सतत उपयोग नवीनीकृत शर्तों की स्वीकृति का संकेत देता है"
                          : "Your continued use indicates acceptance of updated Terms"}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. Eligibility */}
              <section id="eligibility" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "पात्रता" : "Eligibility"}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    {language === "hi"
                      ? "हमारी वेबसाइट का उपयोग करने के लिए, आपको निम्नलिखित आवश्यकताओं को पूरा करना होगा:"
                      : "To use our Website, you must meet the following requirements:"}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">
                          {language === "hi" ? "आयु आवश्यकता" : "Age Requirement"}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {language === "hi"
                          ? "आपकी आयु कम से कम 13 वर्ष होनी चाहिए। 13 वर्ष से कम आयु के उपयोगकर्ताओं को अभिभावकीय सहमति की आवश्यकता होती है।"
                          : "You must be at least 13 years old. Users under 13 require parental consent."}
                      </p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">
                          {language === "hi" ? "कानूनी क्षमता" : "Legal Capacity"}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {language === "hi"
                          ? "आपके पास कानूनी रूप से बाध्यकारी समझौतों में प्रवेश करने की क्षमता होनी चाहिए।"
                          : "You must have the legal capacity to enter binding agreements."}
                      </p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">
                          {language === "hi" ? "जिम्मेदार उपयोग" : "Responsible Use"}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {language === "hi"
                          ? "आपको सभी लागू कानूनों और विनियमों का पालन करना चाहिए।"
                          : "You must comply with all applicable laws and regulations."}
                      </p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-800">
                          {language === "hi" ? "सत्य जानकारी" : "Truthful Information"}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {language === "hi"
                          ? "आपको सटीक और सत्य जानकारी प्रदान करनी चाहिए।"
                          : "You must provide accurate and truthful information."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Content Policy */}
              <section id="content" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "सामग्री नीति" : "Content Policy"}
                  </h2>
                </div>
                
                <div className="space-y-6 text-gray-700">
                  <p>
                    {language === "hi"
                      ? "Republic Mirror निम्नलिखित सामग्री प्रकाशित करता है:"
                      : "Republic Mirror publishes the following content:"}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "समाचार लेख" : "News Articles"}
                        </h4>
                        <p className="text-gray-600">
                          {language === "hi"
                            ? "वर्तमान घटनाओं, राजनीति, अर्थव्यवस्था और अन्य विषयों पर तथ्य-आधारित रिपोर्टिंग"
                            : "Fact-based reporting on current events, politics, economy, and other topics"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "संपादकीय" : "Editorials"}
                        </h4>
                        <p className="text-gray-600">
                          {language === "hi"
                            ? "विशेषज्ञ राय और विश्लेषण जो स्पष्ट रूप से लेबल किए गए हैं"
                            : "Expert opinions and analysis that are clearly labeled"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-full mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "मल्टीमीडिया सामग्री" : "Multimedia Content"}
                        </h4>
                        <p className="text-gray-600">
                          {language === "hi"
                            ? "तस्वीरें, वीडियो और इंफोग्राफिक्स जो समाचार कहानियों के पूरक हैं"
                            : "Photos, videos, and infographics that supplement news stories"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">
                          {language === "hi" ? "अस्वीकरण" : "Disclaimer"}
                        </h4>
                        <p className="text-red-700">
                          {language === "hi"
                            ? "हमारी सामग्री सूचनात्मक उद्देश्यों के लिए है। हम सटीकता के लिए प्रयास करते हैं, लेकिन कोई गारंटी नहीं देते हैं। व्यक्तिगत विवेक का प्रयोग करें और पेशेवर सलाह लें जहां आवश्यक हो।"
                            : "Our content is for informational purposes. We strive for accuracy but provide no guarantees. Use personal discretion and seek professional advice where necessary."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. User Conduct */}
              <section id="user-conduct" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 text-purple-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    4
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "उपयोगकर्ता आचरण" : "User Conduct"}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700">
                    {language === "hi"
                      ? "आप सहमत हैं कि आप निम्नलिखित में संलग्न नहीं होंगे:"
                      : "You agree not to engage in the following:"}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Ban className="w-4 h-4 text-red-600" />
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "अवैध गतिविधियाँ" : "Illegal Activities"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "hi"
                          ? "किसी भी अवैध गतिविधि में संलग्न होना"
                          : "Engaging in any illegal activities"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Ban className="w-4 h-4 text-red-600" />
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "हानिकारक सामग्री" : "Harmful Content"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "hi"
                          ? "हानिकारक या द्वेषपूर्ण सामग्री पोस्ट करना"
                          : "Posting harmful or malicious content"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Ban className="w-4 h-4 text-red-600" />
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "स्पैमिंग" : "Spamming"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "hi"
                          ? "स्पैम या अनचाही सामग्री भेजना"
                          : "Sending spam or unsolicited content"}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Ban className="w-4 h-4 text-red-600" />
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "सेवा में बाधा" : "Service Disruption"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "hi"
                          ? "हमारी सेवाओं में बाधा डालना"
                          : "Disrupting our services"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      {language === "hi" ? "स्वीकार्य टिप्पणियाँ" : "Acceptable Comments"}
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>
                        {language === "hi"
                          ? "विषय से संबंधित और रचनात्मक"
                          : "Relevant and constructive"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "सम्मानजनक भाषा का उपयोग"
                          : "Use respectful language"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "तथ्य-आधारित चर्चा"
                          : "Fact-based discussion"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "व्यक्तिगत हमलों से बचें"
                          : "Avoid personal attacks"}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 5. Intellectual Property */}
              <section id="intellectual" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-yellow-100 text-yellow-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    5
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "बौद्धिक संपदा" : "Intellectual Property"}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {language === "hi" ? "कॉपीराइट नोटिस" : "Copyright Notice"}
                    </h3>
                    <p className="mb-3">
                      {language === "hi"
                        ? "Republic Mirror और उसके लाइसेंसकर्ताओं के पास वेबसाइट पर सभी सामग्री का बौद्धिक संपदा अधिकार है।"
                        : "Republic Mirror and its licensors own all intellectual property rights to content on the Website."}
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "अनुमति सहित" : "Allowed With Permission"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "hi" ? "व्यक्तिगत उपयोग" : "Personal Use"}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "सीमित उपयोग" : "Limited Use"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "hi" ? "गैर-वाणिज्यिक" : "Non-Commercial"}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "निषिद्ध" : "Prohibited"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "hi" ? "वाणिज्यिक पुनर्वितरण" : "Commercial Redistribution"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {language === "hi" ? "उचित उपयोग" : "Fair Use Policy"}
                    </h4>
                    <p className="text-blue-700">
                      {language === "hi"
                        ? "आप समीक्षा, समाचार रिपोर्टिंग, शिक्षा या शोध के लिए सीमित सामग्री का उपयोग कर सकते हैं, बशर्ते कि आप उचित श्रेय दें।"
                        : "You may use limited content for review, news reporting, education, or research, provided you give proper credit."}
                    </p>
                  </div>
                </div>
              </section>

              {/* 6. Limitation of Liability */}
              <section id="limitation" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 text-red-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    6
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "दायित्व सीमा" : "Limitation of Liability"}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <p className="mb-3">
                      {language === "hi"
                        ? "कानून द्वारा अनुमत अधिकतम सीमा तक, Republic Mirror या उसके अधिकारियों, निदेशकों, कर्मचारियों या एजेंटों की किसी भी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी या दंडात्मक क्षति के लिए कोई दायित्व नहीं होगा।"
                        : "To the maximum extent permitted by law, Republic Mirror shall not be liable for any indirect, incidental, special, consequential, or punitive damages."}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-white rounded border">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "शामिल नहीं" : "Not Included"}
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>{language === "hi" ? "डेटा हानि" : "Data Loss"}</li>
                          <li>{language === "hi" ? "लाभ हानि" : "Loss of Profits"}</li>
                          <li>{language === "hi" ? "व्यवसाय व्यवधान" : "Business Interruption"}</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {language === "hi" ? "सीमाएँ" : "Limitations"}
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>{language === "hi" ? "डेटा सटीकता" : "Data Accuracy"}</li>
                          <li>{language === "hi" ? "सेवा उपलब्धता" : "Service Availability"}</li>
                          <li>{language === "hi" ? "तीसरे पक्ष के लिंक" : "Third-Party Links"}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Termination */}
              <section id="termination" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gray-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    7
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "सेवा समाप्ति" : "Termination"}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p>
                      {language === "hi"
                        ? "हम किसी भी समय, किसी भी कारण से या बिना किसी कारण के, बिना किसी सूचना के, आपकी पहुंच को निलंबित या समाप्त कर सकते हैं।"
                        : "We may suspend or terminate your access at any time, for any reason or no reason, without notice."}
                    </p>
                    
                    <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {language === "hi" ? "समाप्ति के कारण" : "Grounds for Termination"}
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>
                          {language === "hi"
                            ? "इन शर्तों का उल्लंघन"
                            : "Violation of these Terms"}
                        </li>
                        <li>
                          {language === "hi"
                            ? "अवैध गतिविधि"
                            : "Illegal activity"}
                        </li>
                        <li>
                          {language === "hi"
                            ? "प्रणाली दुरुपयोग"
                            : "System abuse"}
                        </li>
                        <li>
                          {language === "hi"
                            ? "कानूनी आवश्यकता"
                            : "Legal requirement"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. Changes to Terms */}
              <section id="changes" className="mb-12 scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    8
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "hi" ? "परिवर्तन" : "Changes to Terms"}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-white p-5 rounded-lg border border-indigo-200 shadow-sm">
                    <p className="mb-3">
                      {language === "hi"
                        ? "हम इन शर्तों को किसी भी समय अपडेट करने का अधिकार सुरक्षित रखते हैं। सभी परिवर्तन इस पृष्ठ पर पोस्ट किए जाएंगे।"
                        : "We reserve the right to update these Terms at any time. All changes will be posted on this page."}
                    </p>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {language === "hi" ? "सूचना विधि" : "Notification Method"}
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-indigo-50 rounded-lg">
                          <div className="font-semibold text-indigo-800">1</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {language === "hi" ? "वेबसाइट पोस्टिंग" : "Website Posting"}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded-lg">
                          <div className="font-semibold text-indigo-800">2</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {language === "hi" ? "ईमेल नोटिस" : "Email Notice"}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded-lg">
                          <div className="font-semibold text-indigo-800">3</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {language === "hi" ? "अपडेट की तारीख" : "Update Date"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">
                          {language === "hi" ? "आपकी जिम्मेदारी" : "Your Responsibility"}
                        </h4>
                        <p className="text-green-700">
                          {language === "hi"
                            ? "यह आपकी जिम्मेदारी है कि समय-समय पर इस पृष्ठ की समीक्षा करें। इस पृष्ठ का निरंतर उपयोग नवीनीकृत शर्तों की स्वीकृति का संकेत देता है।"
                            : "It is your responsibility to review this page periodically. Continued use of this page indicates acceptance of updated Terms."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact and Footer Links */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {language === "hi" ? "प्रश्न या चिंताएँ?" : "Questions or Concerns?"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === "hi"
                        ? "यदि आपके पास इन सेवा शर्तों के बारे में कोई प्रश्न है, तो कृपया हमसे संपर्क करें:"
                        : "If you have any questions about these Terms of Service, please contact us:"}
                    </p>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <span>editor@republicmirror.com</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/privacy-policy" 
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      ← {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
                    </Link>
                    <Link 
                      href="/" 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {language === "hi" ? "होमपेज पर वापस जाएं" : "Return to Homepage"} →
                    </Link>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-500">
                    {language === "hi"
                      ? "© 2024 Republic Mirror. सभी अधिकार सुरक्षित। यह दस्तावेज़ कानूनी जानकारी प्रदान करता है और इसका उपयोग कानूनी सलाह के रूप में नहीं किया जाना चाहिए।"
                      : "© 2024 Republic Mirror. All rights reserved. This document provides legal information and should not be used as legal advice."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <PublicFooter />
      </div>
    </>
  );
}