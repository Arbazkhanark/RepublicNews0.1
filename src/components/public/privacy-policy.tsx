"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import Script from "next/script";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Globe, 
  Mail,
  Cookie,
  ShieldCheck,
  Database,
  Users,
  Scale,
  Bell,
  Download,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";

export default function PrivacyPolicyClient() {
  const { language, t } = useLanguage();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": language === "hi" ? "गोपनीयता नीति - रिपब्लिक मिरर" : "Privacy Policy - Republic Mirror",
    "description": language === "hi" 
      ? "रिपब्लिक मिरर की गोपनीयता नीति। जानें कि हम आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।"
      : "Republic Mirror's privacy policy. Learn how we collect, use, and protect your personal information.",
    "url": "https://republicmirror.com/privacy",
    "mainEntity": {
      "@type": "WebPage",
      "name": "Privacy Policy",
      "description": "Information about data collection, usage, and protection",
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
        id="privacy-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-red-50 to-gray-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Shield className="w-4 h-4" />
                    {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {language === "hi" 
                      ? "आपकी गोपनीयता हमारी प्राथमिकता है" 
                      : "Your Privacy is Our Priority"}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {language === "hi"
                      ? "जानिए हम आपकी व्यक्तिगत जानकारी का उपयोग, संग्रह और संरक्षण कैसे करते हैं।"
                      : "Learn how we collect, use, and protect your personal information."}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                      <Lock className="w-8 h-8 text-red-600 mb-2" />
                      <span className="text-sm font-medium">SSL</span>
                      <span className="text-xs text-gray-600">Encryption</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="text-sm font-medium">
                        {language === "hi" ? "ट्रैकिंग" : "Tracking"}
                      </span>
                      <span className="text-xs text-gray-600">Transparent</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                      <FileText className="w-8 h-8 text-green-600 mb-2" />
                      <span className="text-sm font-medium">GDPR</span>
                      <span className="text-xs text-gray-600">Compliant</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                      <UserCheck className="w-8 h-8 text-purple-600 mb-2" />
                      <span className="text-sm font-medium">
                        {language === "hi" ? "सहमति" : "Consent"}
                      </span>
                      <span className="text-xs text-gray-600">Required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Last Updated */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {language === "hi" ? "अंतिम अपडेट:" : "Last Updated:"}
                  </span>{" "}
                  {new Date().toLocaleDateString(
                    language === "hi" ? "hi-IN" : "en-IN",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </p>
              </div>

              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-red-600" />
                  {language === "hi" ? "परिचय" : "Introduction"}
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    {language === "hi"
                      ? "Republic Mirror ('हम', 'हमारा', 'हमें') का मानना है कि आपकी गोपनीयता बेहद महत्वपूर्ण है। यह गोपनीयता नीति बताती है कि हम आपकी व्यक्तिगत जानकारी कैसे एकत्र करते हैं, उपयोग करते हैं, साझा करते हैं और संरक्षित करते हैं जब आप हमारी वेबसाइट https://republicmirror.com (वेबसाइट) का उपयोग करते हैं।"
                      : "Republic Mirror ('we', 'our', 'us') believes that your privacy is extremely important. This Privacy Policy describes how we collect, use, share, and protect your personal information when you use our website https://republicmirror.com (the 'Website')."}
                  </p>
                  <p>
                    {language === "hi"
                      ? "इस गोपनीयता नीति को पढ़कर, आप हमारी जानकारी एकत्र करने और उपयोग करने की प्रथाओं को समझ सकते हैं। यदि आप हमारी गोपनीयता नीति से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट का उपयोग न करें।"
                      : "By reading this Privacy Policy, you can understand our information collection and use practices. If you do not agree with our Privacy Policy, please do not use our Website."}
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "हम कौन सी जानकारी एकत्र करते हैं" 
                    : "Information We Collect"}
                </h2>
                <div className="space-y-4 text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {language === "hi" ? "व्यक्तिगत जानकारी" : "Personal Information"}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      {language === "hi"
                        ? "नाम और ईमेल पता (जब आप न्यूज़लेटर के लिए साइन अप करते हैं)"
                        : "Name and email address (when you sign up for our newsletter)"}
                    </li>
                    <li>
                      {language === "hi"
                        ? "टिप्पणी और फीडबैक (जब आप हमारे लेखों पर टिप्पणी करते हैं)"
                        : "Comments and feedback (when you comment on our articles)"}
                    </li>
                    <li>
                      {language === "hi"
                        ? "संपर्क जानकारी (जब आप हमसे संपर्क करते हैं)"
                        : "Contact information (when you contact us)"}
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mt-6">
                    {language === "hi" 
                      ? "स्वचालित रूप से एकत्र जानकारी" 
                      : "Automatically Collected Information"}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      {language === "hi"
                        ? "आईपी एड्रेस और ब्राउज़र प्रकार"
                        : "IP address and browser type"}
                    </li>
                    <li>
                      {language === "hi"
                        ? "डिवाइस जानकारी और ऑपरेटिंग सिस्टम"
                        : "Device information and operating system"}
                    </li>
                    <li>
                      {language === "hi"
                        ? "पृष्ठ विचार, समय और तारीख"
                        : "Page views, time and date"}
                    </li>
                    <li>
                      {language === "hi"
                        ? "रेफरल URL और खोज इंजन"
                        : "Referral URLs and search engines"}
                    </li>
                  </ul>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "हम आपकी जानकारी का उपयोग कैसे करते हैं" 
                    : "How We Use Your Information"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {language === "hi" ? "वेबसाइट सुधार" : "Website Improvement"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "hi"
                        ? "हमारी वेबसाइट की सामग्री और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए"
                        : "To improve our website content and user experience"}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {language === "hi" ? "संचार" : "Communication"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "hi"
                        ? "न्यूज़लेटर और महत्वपूर्ण अपडेट भेजने के लिए"
                        : "To send newsletters and important updates"}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {language === "hi" ? "सुरक्षा" : "Security"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "hi"
                        ? "धोखाधड़ी और अनधिकृत पहुंच को रोकने के लिए"
                        : "To prevent fraud and unauthorized access"}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {language === "hi" ? "वैधानिक आवश्यकताएं" : "Legal Requirements"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "hi"
                        ? "कानूनी दायित्वों का पालन करने के लिए"
                        : "To comply with legal obligations"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Cookie className="w-6 h-6 text-red-600" />
                  {language === "hi" ? "कुकीज़" : "Cookies"}
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 mb-4">
                    {language === "hi"
                      ? "हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। कुकीज़ छोटी टेक्स्ट फाइलें होती हैं जो आपके डिवाइस पर संग्रहीत की जाती हैं।"
                      : "We use cookies to enhance your experience. Cookies are small text files stored on your device."}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 text-red-800 rounded-full p-2">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "अनिवार्य कुकीज़" : "Essential Cookies"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === "hi"
                            ? "वेबसाइट के मूल कार्यों के लिए आवश्यक"
                            : "Required for basic website functions"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "विश्लेषण कुकीज़" : "Analytics Cookies"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === "hi"
                            ? "ट्रैफ़िक और उपयोग पैटर्न को समझने में मदद करती हैं"
                            : "Help understand traffic and usage patterns"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-800 rounded-full p-2">
                        <span className="text-xs font-bold">✗</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {language === "hi" ? "तृतीय-पक्ष कुकीज़" : "Third-Party Cookies"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === "hi"
                            ? "विज्ञापन और सोशल मीडिया प्लेटफॉर्म द्वारा उपयोग की जाती हैं"
                            : "Used by advertising and social media platforms"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    {language === "hi"
                      ? "आप अपने ब्राउज़र सेटिंग्स के माध्यम से कुकीज़ को नियंत्रित या हटा सकते हैं।"
                      : "You can control or delete cookies through your browser settings."}
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "डेटा सुरक्षा" 
                    : "Data Security"}
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    {language === "hi"
                      ? "हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित सुरक्षा उपाय लागू करते हैं। हालाँकि, कृपया ध्यान दें कि इंटरनेट पर कोई भी डेटा ट्रांसमिशन पूरी तरह से सुरक्षित नहीं है।"
                      : "We implement reasonable security measures to protect your personal information. However, please note that no data transmission over the internet is completely secure."}
                  </p>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {language === "hi" 
                        ? "सुरक्षा उपाय" 
                        : "Security Measures"}
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>
                        {language === "hi"
                          ? "एन्क्रिप्टेड डेटा ट्रांसमिशन (SSL/TLS)"
                          : "Encrypted data transmission (SSL/TLS)"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "सुरक्षित सर्वर और फ़ायरवॉल"
                          : "Secure servers and firewalls"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "नियमित सुरक्षा ऑडिट"
                          : "Regular security audits"}
                      </li>
                      <li>
                        {language === "hi"
                          ? "कर्मचारी गोपनीयता प्रशिक्षण"
                          : "Employee privacy training"}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Third-Party Services */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "तृतीय-पक्ष सेवाएं" 
                    : "Third-Party Services"}
                </h2>
                <p className="text-gray-700 mb-4">
                  {language === "hi"
                    ? "हम Google Analytics जैसी तृतीय-पक्ष सेवाओं का उपयोग कर सकते हैं, जिनकी अपनी गोपनीयता नीतियाँ होती हैं। हम आपको उनकी गोपनीयता प्रथाओं की समीक्षा करने की सलाह देते हैं।"
                    : "We may use third-party services like Google Analytics, which have their own privacy policies. We recommend you review their privacy practices."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-sm font-semibold text-gray-700">Google</div>
                    <div className="text-xs text-gray-500">Analytics</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-sm font-semibold text-gray-700">Cloudflare</div>
                    <div className="text-xs text-gray-500">Security</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-sm font-semibold text-gray-700">Vercel</div>
                    <div className="text-xs text-gray-500">Hosting</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-sm font-semibold text-gray-700">Mailchimp</div>
                    <div className="text-xs text-gray-500">Newsletter</div>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "आपके अधिकार" 
                    : "Your Rights"}
                </h2>
                <div className="space-y-4">
                  <div className="bg-white border-l-4 border-red-600 pl-4 py-3">
                    <h3 className="font-semibold text-gray-800">
                      {language === "hi" 
                        ? "पहुंच का अधिकार" 
                        : "Right to Access"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "hi"
                        ? "आप हमारे पास मौजूद अपनी व्यक्तिगत जानकारी का अनुरोध कर सकते हैं।"
                        : "You can request access to your personal information we hold."}
                    </p>
                  </div>
                  <div className="bg-white border-l-4 border-blue-600 pl-4 py-3">
                    <h3 className="font-semibold text-gray-800">
                      {language === "hi" 
                        ? "सुधार का अधिकार" 
                        : "Right to Correction"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "hi"
                        ? "आप गलत या अधूरी जानकारी को सुधारने का अनुरोध कर सकते हैं।"
                        : "You can request correction of inaccurate or incomplete information."}
                    </p>
                  </div>
                  <div className="bg-white border-l-4 border-green-600 pl-4 py-3">
                    <h3 className="font-semibold text-gray-800">
                      {language === "hi" 
                        ? "हटाने का अधिकार" 
                        : "Right to Deletion"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "hi"
                        ? "आप अपनी व्यक्तिगत जानकारी को हटाने का अनुरोध कर सकते हैं।"
                        : "You can request deletion of your personal information."}
                    </p>
                  </div>
                  <div className="bg-white border-l-4 border-purple-600 pl-4 py-3">
                    <h3 className="font-semibold text-gray-800">
                      {language === "hi" 
                        ? "आपत्ति का अधिकार" 
                        : "Right to Object"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === "hi"
                        ? "आप डेटा प्रोसेसिंग के खिलाफ आपत्ति कर सकते हैं।"
                        : "You can object to data processing."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "संपर्क जानकारी" 
                    : "Contact Information"}
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 mb-4">
                    {language === "hi"
                      ? "यदि आपके पास गोपनीयता नीति के बारे में कोई प्रश्न या चिंता है, तो कृपया हमसे संपर्क करें:"
                      : "If you have any questions or concerns about this Privacy Policy, please contact us:"}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-red-600" />
                      <span className="text-gray-800">editor@republicmirror.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-red-600 font-bold">@</span>
                      </div>
                      <Link href="/contact" className="text-red-600 hover:text-red-700 font-medium">
                        {language === "hi" 
                          ? "हमारी संपर्क पृष्ठ पर जाएं" 
                          : "Visit our contact page"}
                      </Link>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    {language === "hi"
                      ? "हम आपकी चिंताओं का जवाब देने के लिए 7-10 व्यावसायिक दिनों के भीतर प्रयास करेंगे।"
                      : "We will try to respond to your concerns within 7-10 business days."}
                  </p>
                </div>
              </section>

              {/* Policy Updates */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === "hi" 
                    ? "नीति अपडेट" 
                    : "Policy Updates"}
                </h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                  <p className="text-gray-700">
                    {language === "hi"
                      ? "हम इस गोपनीयता नीति को समय-समय पर अपडेट कर सकते हैं। सभी अपडेट इस पृष्ठ पर पोस्ट किए जाएंगे। नीति में महत्वपूर्ण बदलावों के मामले में, हम आपको ईमेल के माध्यम से सूचित करेंगे।"
                      : "We may update this Privacy Policy periodically. All updates will be posted on this page. In case of significant changes to the policy, we will notify you via email."}
                  </p>
                  <div className="mt-4 p-4 bg-white rounded border border-yellow-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">
                        {language === "hi" ? "सुझाव:" : "Tip:"}
                      </span>{" "}
                      {language === "hi"
                        ? "इस पृष्ठ को बुकमार्क करना न भूलें और समय-समय पर इसकी समीक्षा करें।"
                        : "Don't forget to bookmark this page and review it periodically."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Navigation Links */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-gray-200">
                <Link 
                  href="/terms-and-services" 
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                >
                  ← {language === "hi" ? "सेवा की शर्तें देखें" : "View Terms of Service"}
                </Link>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-2"
                >
                  {language === "hi" ? "होमपेज पर वापस जाएं" : "Return to Homepage"} →
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <PublicFooter />
      </div>
    </>
  );
}
