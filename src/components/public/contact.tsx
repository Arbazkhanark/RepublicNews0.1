"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    messageType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        toast.error(errorData.error || "Failed to send message");
      } else {
        const data = await res.json();
        console.log("✅ Success:", data);
        toast.success("Message sent successfully! We'll get back to you soon.");
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
      const errorMessage =
        err instanceof Error
          ? err.message
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
      {/* ✅ Sonner toaster */}
      <div id="sonner-toaster">
        {/* keep Toaster only once globally in your app layout.tsx */}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="messageType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message Type
                </label>
                <select
                  id="messageType"
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="news-tip">News Tip</option>
                  <option value="press-release">Press Release</option>
                  <option value="partnership">Partnership</option>
                  <option value="complaint">Complaint</option>
                  <option value="technical">Technical Issue</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief subject of your message"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Right side panel remains same */}
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Information */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                📍 Our Office
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">🏢</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Republic Mirror Headquarters
                    </p>
                    <p className="text-gray-600">
                      {/* 123 Press Street, Media District */}
                      {/* <br /> */}
                      New Delhi, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600">📞</span>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 96 5323 1654</p>
                    <p className="text-gray-600">+91 87 0004 1771</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600">📧</span>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">editor@republicmirror.com</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-3">
                  <span className="text-red-600">🕒</span>
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Editorial Team */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                ✍️ Editorial Team
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">
                    News Tips & Story Ideas
                  </p>
                  <p className="text-gray-600">editor@republicmirror.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Press Releases</p>
                  <p className="text-gray-600">editor@republicmirror.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Letters to Editor</p>
                  <p className="text-gray-600">editor@republicmirror.com</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                🌐 Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.facebook.com/share/17oFjCf5eU/"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-blue-600">📘</span>
                  <span className="font-medium">Facebook</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-blue-400">🐦</span>
                  <span className="font-medium">Twitter</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-pink-600">📷</span>
                  <span className="font-medium">Instagram</span>
                </a>
                <a
                  href="https://youtube.com/@thehashtagnews?si=AGIW8yPpmU4suPUw"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-red-600">📺</span>
                  <span className="font-medium">YouTube</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                🔗 Quick Links
              </h3>
              <div className="space-y-2">
                <a
                  href="/about"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  About Republic Mirror
                </a>
                <a
                  href="/careers"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  Career Opportunities
                </a>
                <a
                  href="/advertise"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  Advertise with Us
                </a>
                <a
                  href="/privacy"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="block text-red-600 hover:text-red-700 font-medium"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
