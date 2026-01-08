"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import { GoogleAdSense } from "./google-adsense"; // या जहाँ आपका GoogleAdSense component है

export interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  views: number;
}

interface HeroNewsCarouselProps {
  articles: NewsArticle[];
}

export const HeroNewsCarousel: React.FC<HeroNewsCarouselProps> = ({
  articles,
}) => {
  if (!articles.length) return null;

  return (
    <>
      {/* ================= HERO + RIGHT AD ================= */}
      <section className="mb-6">
        <div className="max-w-[1200px] mx-auto px-3 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* ===== HERO ===== */}
          <div className="min-w-0">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 4500 }}
              slidesPerView={1}
              className="rounded-md overflow-hidden"
            >
              {articles.slice(0, 5).map((article) => (
                <SwiperSlide key={article._id}>
                  <div className="relative h-[340px] sm:h-[420px] w-full">
                    <Image
                      src={article.featuredImage || "/default-hero.jpg"}
                      alt={article.title}
                      fill
                      priority
                      className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white space-y-2">
                      <span className="inline-block bg-red-600 text-[11px] font-semibold px-2 py-0.5 uppercase">
                        Top News
                      </span>

                      <h2 className="text-lg sm:text-2xl font-bold leading-snug max-w-3xl">
                        {article.title}
                      </h2>

                      <p className="hidden sm:block text-sm text-gray-200 max-w-2xl line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="text-[11px] text-gray-300 flex gap-3">
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </span>
                        <span>•</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ===== RIGHT SIDE AD ===== */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 h-[420px]">
              {/* ✅ Development में placeholder, Production में real ad */}
              <GoogleAdSense
                adSlot="1234567890" // अपना actual ad slot ID डालें
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="h-full"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* ================= BOTTOM AD ================= */}
      <div className="max-w-[1200px] mx-auto px-3 mb-10">
        {/* ✅ Development में placeholder, Production में real ad */}
        <GoogleAdSense
          adSlot="0987654321" // अपना actual ad slot ID डालें
          adFormat="horizontal"
          fullWidthResponsive={true}
          className="w-full"
        />
      </div>
    </>
  );
};
