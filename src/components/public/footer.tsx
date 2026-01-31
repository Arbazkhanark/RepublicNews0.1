"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircleReply,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context"; // Add this import

// Remove the FooterProps interface since we'll use context

export function PublicFooter() {
  const { language, t } = useLanguage(); // Use the language context
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Image 
              src="/logo.svg" 
              alt={language === "hi" ? "रिपब्लिक मिरर लोगो" : "Republic Mirror Logo"} 
              width={300} 
              height={20} 
              className="mx-auto mt-1" 
            />
            <p className="text-gray-300 mb-4">
              {language === "hi" 
                ? "सत्य का प्रतिबिंब - सटीक और निष्पक्ष समाचार कवरेज के लिए आपका विश्वसनीय स्रोत।"
                : "Reflection of Truth - Your trusted source for accurate and unbiased news coverage."}
            </p>

            <div className="flex space-x-4">
              {/* WhatsApp */}
              <Link
                href="https://www.whatsapp.com/channel/0029Vb7cri0XnlqW0P7K53R"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title={language === "hi" ? "व्हाट्सएप" : "WhatsApp"}
              >
                <MessageCircleReply className="w-5 h-5" />
              </Link>

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/republic.mirror?utm_source=qr&igsh=MTdvNmN0ZXk1aTBzcQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>

              {/* YouTube */}
              <Link
                href="https://www.youtube.com/channel/UCuNl5JS7Ye29A74qcosrkYw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </Link>

              {/* Facebook */}
              <Link
                href="https://www.facebook.com/share/17oFjCf5eU/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>

              {/* Twitter (X) */}
              <Link
                href="https://x.com/MirrorRepu11808"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === "hi" ? "त्वरित लिंक" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "हमारे बारे में" : "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  href="/our-team"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "हमारी टीम" : "Our Team"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "संपर्क करें" : "Contact"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-and-services" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "सेवा की शर्तें" : "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "विज्ञापन दें" : "Advertise"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === "hi" ? "श्रेणियाँ" : "Categories"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/national"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "राष्ट्रीय" : "National"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/international"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "अंतर्राष्ट्रीय" : "International"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/politics"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "राजनीति" : "Politics"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/economy"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "अर्थव्यवस्था" : "Economy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sports"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {language === "hi" ? "खेल" : "Sports"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === "hi" ? "संपर्क जानकारी" : "Contact Info"}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-gray-300">editor@republicmirror.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-gray-300">
                  {language === "hi" ? "नई दिल्ली, भारत" : "New Delhi, India"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} Republic Mirror.{" "}
              {language === "hi" ? "सभी अधिकार सुरक्षित।" : "All rights reserved."}
            </p>
            <p className="text-gray-300 text-sm mt-2 md:mt-0">
              {language === "hi" 
                ? "सत्य और पारदर्शिता के लिए ❤️ के साथ डिज़ाइन किया गया"
                : "Designed with ❤️ for truth and transparency"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}