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

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            {/* <h3 className="text-xl font-bold mb-4">REPUBLIC MIRROR</h3> */}
            <Image src="/logo.svg" alt="Republic Mirror Logo" width={300} height={20} className="mx-auto mt-1" />
            <p className="text-gray-300 mb-4">
              Reflection of Truth - Your trusted source for accurate and
              unbiased news coverage.
            </p>

            <div className="flex space-x-4">
              {/* Whatsapp (Optional - if you add later) */}
              <Link
                href="https://www.whatsapp.com/channel/0029Vb7cri0XnlqW0P7K53R"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <MessageCircleReply className="w-5 h-5" />
              </Link>

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/republic.mirror?utm_source=qr&igsh=MTdvNmN0ZXk1aTBzcQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>

              {/* YouTube */}
              <Link
                href="https://www.youtube.com/@therepublicmirror"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Link>

              {/* Facebook (Optional - if you add later) */}
              <Link
                href="https://www.facebook.com/share/17oFjCf5eU/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>

              {/* Twitter (X) */}
              <Link
                href="https://x.com/MirrorRepu11808"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-300 hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/our-team"
                  className="text-gray-300 hover:text-white"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-gray-300 hover:text-white"
                >
                  Advertise
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/national"
                  className="text-gray-300 hover:text-white"
                >
                  National
                </Link>
              </li>
              <li>
                <Link
                  href="/category/international"
                  className="text-gray-300 hover:text-white"
                >
                  International
                </Link>
              </li>
              <li>
                <Link
                  href="/category/politics"
                  className="text-gray-300 hover:text-white"
                >
                  Politics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/economy"
                  className="text-gray-300 hover:text-white"
                >
                  Economy
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sports"
                  className="text-gray-300 hover:text-white"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-600" />
                <span className="text-gray-300">editor@republicmirror.com</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="text-gray-300">+91 96 5323 1654</span>
              </div> */}
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-red-600" />
                <span className="text-gray-300">New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} Republic Mirror. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm mt-2 md:mt-0">
              Designed with ❤️ for truth and transparency
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
