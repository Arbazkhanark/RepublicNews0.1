"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { HeroNewsCarousel } from "@/components/public/HeroNewsCaousel";
import { NewsCard } from "@/components/public/news-card";
import { GoogleAdSense } from "@/components/public/google-adsense";
// import GoogleAdSense from "@/components/public/google-adsense"

interface NewsArticle {
  _id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  featuredImage?: string;
  category?: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
  contributorName?: string;
  publishedAt: string;
  views: number;
  readingTime: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  language: "en" | "hi";
  heroArticle?: boolean;
}

export default function HomePage() {
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchNews();
  }, [language]);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // HERO ARTICLES
      const featuredResponse = await fetch(
        `/api/news?page=1&limit=10&language=${language}`
      );
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();

        const heroArticles = featuredData.data.articles
          .filter((article: NewsArticle) => article.heroArticle)
          .sort(
            (a: NewsArticle, b: NewsArticle) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          );

        const articlesToUse =
          heroArticles.length > 0
            ? heroArticles
            : featuredData.data.articles
                .sort(
                  (a: NewsArticle, b: NewsArticle) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
                )
                .slice(0, 3);

        setFeaturedNews(articlesToUse.slice(0, 3));
      }

      // LATEST NEWS
      const latestResponse = await fetch(
        `/api/news?page=1&limit=8&language=${language}&status=published`
      );
      if (latestResponse.ok) {
        const latestData = await latestResponse.json();
        const sortedNews = latestData.data.articles.sort(
          (a: NewsArticle, b: NewsArticle) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        setLatestNews(sortedNews);
      }

      // TRENDING NEWS
      const trendingResponse = await fetch(
        `/api/news?page=1&limit=5&language=${language}&status=published&sortBy=views&sortOrder=desc`
      );
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        setTrendingNews(trendingData.data.articles);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: "both" }),
      });

      if (response.ok) {
        setEmail("");
        alert("Successfully subscribed to newsletter!");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch {
      alert("Failed to subscribe. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main>
        {/* ================= HERO ================= */}
        <HeroNewsCarousel articles={featuredNews} />

        {/* ================= HERO BOTTOM AD ================= */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <GoogleAdSense
              adSlot="1234567890"
              adFormat="horizontal"
              className="max-w-[728px] w-full"
            />
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* ================= LEFT CONTENT ================= */}
            <div>
              {/* Today's News */}
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("todaysNews")}
                  </h2>
                  <div className="flex-1 h-px bg-red-600 ml-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestNews.slice(0, 4).map((article) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>
              </section>

              {/* ===== Inline Ad (Native feel) ===== */}
              <div className="my-10 flex justify-center">
                <GoogleAdSense
                  adSlot="0987654321"
                  adFormat="rectangle"
                  className="max-w-[336px] w-full"
                />
              </div>

              {/* Latest News */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("latestNews")}
                  </h2>
                  <div className="flex-1 h-px bg-gray-300 ml-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestNews.slice(4).map((article) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>
              </section>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="space-y-8">
              {/* Sticky Sidebar Ad */}
              <div className="sticky top-24">
                <GoogleAdSense
                  adSlot="1122334455"
                  adFormat="vertical"
                  className="w-full"
                />
              </div>

              {/* Newsletter */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">
                    {t("subscribeNewsletter")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm mb-4">
                    {t("newsletterDescription")}
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder={t("enterEmail")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {t("subscribe")}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Trending News */}
              {trendingNews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      {t("trendingNews")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trendingNews.map((article, index) => (
                        <div
                          key={article._id}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm line-clamp-2 hover:text-red-600 cursor-pointer">
                              {article.title}
                            </h4>
                            <div className="text-xs text-gray-500 mt-1">
                              {article.views} views
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("categories")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "National",
                      "International",
                      "Politics",
                      "Economy",
                      "Sports",
                      "Technology",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.floor(Math.random() * 50) + 10}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>

        {/* ================= MOBILE BOTTOM AD ================= */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-40">
          <GoogleAdSense adSlot="6677889900" adFormat="horizontal" />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
