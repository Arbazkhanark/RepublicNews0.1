"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark,
  ChevronRight,
  Home,
  Newspaper,
  Globe,
  Briefcase,
  Zap,
  Megaphone,
  Tag,
  BarChart3,
  Target,
  PlayCircle,
  Youtube,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  PenSquare,
  Users,
  Search,
  Menu,
  Bell,
  User
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { HeroNewsCarousel } from "@/components/public/HeroNewsCaousel";
import { GoogleAdSense } from "@/components/public/google-adsense";
import { YouTubeVideosSection } from "@/components/public/youtube-videos-section";
import { YouTubeSidebar } from "@/components/public/youtube-sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsArticle {
  _id: string;
  title: string;
  titleHi?: string;
  subtitle?: string;
  excerpt: string;
  excerptHi?: string;
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

interface Opinion {
  _id: string;
  title: string;
  titleHi: string;
  content: string;
  contentHi: string;
  topic: string;
  tags: string[];
  authorId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    designation?: string;
  };
  status: "approved" | "pending" | "rejected" | "draft";
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  views: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [topOpinions, setTopOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchNews();
    fetchOpinions();
  }, [language]);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // HERO ARTICLES - Updated to include Hindi support
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

      // LATEST NEWS - Updated to include Hindi support
      const latestResponse = await fetch(
        `/api/news?page=1&limit=25&language=${language}&status=published`
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

      // TRENDING NEWS - Updated to include Hindi support
      const trendingResponse = await fetch(
        `/api/news?page=1&limit=10&language=${language}&status=published&sortBy=views&sortOrder=desc`
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

  const fetchOpinions = async () => {
    try {
      const response = await fetch(`/api/admin/opinions?status=approved&limit=3&sortBy=views&sortOrder=desc`);
      if (response.ok) {
        const data = await response.json();
        const approvedOpinions = data.opinions?.filter((op: Opinion) => op.status === 'approved') || [];
        setTopOpinions(approvedOpinions.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch opinions:", error);
    }
  };

  // Helper functions to get localized content for news
  const getNewsTitle = (article: NewsArticle) => {
    return language === 'hi' && article.titleHi ? article.titleHi : article.title;
  };

  const getNewsExcerpt = (article: NewsArticle) => {
    return language === 'hi' && article.excerptHi ? article.excerptHi : article.excerpt;
  };

  // Helper functions to get localized content for opinions
  const getOpinionTitle = (opinion: Opinion) => {
    return language === 'hi' && opinion.titleHi ? opinion.titleHi : opinion.title;
  };

  const getOpinionContent = (opinion: Opinion) => {
    return language === 'hi' && opinion.contentHi ? opinion.contentHi : opinion.content;
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
        alert(language === 'hi' ? "न्यूज़लेटर की सदस्यता सफलतापूर्वक ली गई!" : "Successfully subscribed to newsletter!");
      } else {
        alert(language === 'hi' ? "सदस्यता लेने में विफल। कृपया पुनः प्रयास करें।" : "Failed to subscribe. Please try again.");
      }
    } catch {
      alert(language === 'hi' ? "सदस्यता लेने में विफल। कृपया पुनः प्रयास करें।" : "Failed to subscribe. Please try again.");
    }
  };

  const navigateToOpinion = (opinionId: string) => {
    router.push(`/opinion/${opinionId}`);
  };

  const getReadTime = (content?: string) => {
    if (!content || typeof content !== 'string') {
      return language === 'hi' ? "1 मिनट पढ़ना" : "1 min read";
    }
    
    try {
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return language === 'hi' ? `${minutes} मिनट पढ़ना` : `${minutes} min read`;
    } catch (error) {
      return language === 'hi' ? "1 मिनट पढ़ना" : "1 min read";
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return language === 'hi' ? `${diffMins} मिनट पहले` : `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return language === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return language === 'hi' ? `${diffDays} दिन पहले` : `${diffDays} days ago`;
      }
    } catch (error) {
      return language === 'hi' ? "हाल ही में" : "Recently";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Language Indicator */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="rounded-full px-3">
              {language === 'hi' ? 'हिंदी' : 'English'} 
              <span className="ml-1 text-xs opacity-70">
                ({language === 'hi' ? 'हिंदी में पढ़ें' : 'Reading in English'})
              </span>
            </Badge>
            <span className="text-gray-600 text-xs">
              {language === 'hi' 
                ? 'हिंदी समाचार और राय देख रहे हैं'
                : 'Viewing news and opinions in English'
              }
            </span>
          </div>
        </div>
      </div>

      <main className="bg-gray-50">
        {/* ================= HERO CAROUSEL ================= */}
        <div className="bg-white">
          <HeroNewsCarousel articles={featuredNews} />
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Top Stories */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                  {language === 'hi' ? 'शीर्ष कहानियाँ' : 'Top Stories'}
                </h3>
                <div className="space-y-4">
                  {latestNews.slice(0, 5).map((article, index) => (
                    <Link 
                      key={article._id}
                      href={`/news/${article._id}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-gray-100 text-gray-700 rounded flex items-center justify-center text-sm font-bold group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                            {getNewsTitle(article)}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{article.category?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending Hashtags */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {language === 'hi' ? 'ट्रेंडिंग हैशटैग' : 'Trending Hashtags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {language === 'hi' 
                    ? ['#बजट2024', '#चुनाव2024', '#जलवायुपरिवर्तन', '#टेकन्यूज', '#खेलसमाचार'].map((tag) => (
                        <a 
                          key={tag}
                          href="#" 
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                        >
                          {tag}
                        </a>
                      ))
                    : ['#Budget2024', '#Election2024', '#ClimateChange', '#TechNews', '#SportsNews'].map((tag) => (
                        <a 
                          key={tag}
                          href="#" 
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                        >
                          {tag}
                        </a>
                      ))
                  }
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {language === 'hi' ? 'न्यूज़लेटर' : 'Newsletter'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'hi' 
                    ? 'प्रतिदिन की समाचार अपडेट अपने इनबॉक्स में प्राप्त करें।'
                    : 'Get daily news updates delivered to your inbox.'
                  }
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder={language === 'hi' ? "अपना ईमेल दर्ज करें" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {language === 'hi' ? 'सदस्यता लें' : 'Subscribe'}
                  </Button>
                </form>
              </div>
            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="lg:col-span-6">
              {/* TODAY'S TOP STORIES - PRIMARY FOCUS */}
              <div className="bg-white p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'hi' ? 'आज की शीर्ष कहानियाँ' : 'Today\'s Top Stories'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'नवीनतम और सबसे महत्वपूर्ण समाचार' : 'Latest and most important news'}
                    </p>
                  </div>
                  <Link href="/news" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    {language === 'hi' ? 'सभी देखें →' : 'View All →'}
                  </Link>
                </div>

                {/* Main Featured Story */}
                {latestNews.length > 0 && (
                  <div className="mb-8">
                    <Link href={`/news/${latestNews[0]._id}`} className="group block">
                      <div className="relative mb-4">
                        <div className="aspect-[16/9] bg-gray-200">
                          {latestNews[0]?.featuredImage ? (
                            <img
                              src={latestNews[0].featuredImage}
                              alt={getNewsTitle(latestNews[0])}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <Newspaper className="w-16 h-16 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5">
                            {language === 'hi' ? 'शीर्ष कहानी' : 'TOP STORY'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {latestNews[0]?.category && (
                            <span className="font-medium text-red-600">
                              {latestNews[0].category.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(latestNews[0]?.publishedAt || '')}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold group-hover:text-red-600 transition-colors">
                          {getNewsTitle(latestNews[0])}
                        </h3>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {getNewsExcerpt(latestNews[0])}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
                          <span className="font-medium">
                            {language === 'hi' ? 'द्वारा' : 'By'} {latestNews[0]?.author.name}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {latestNews[0]?.views} {language === 'hi' ? 'दृश्य' : 'views'}
                            </span>
                            <span>{latestNews[0]?.readingTime} {language === 'hi' ? 'मिनट पढ़ना' : 'min read'}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* 2-Column Grid for Other Top Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {latestNews.slice(1, 5).map((article) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block border-b pb-6"
                    >
                      <div className="flex gap-4">
                        <div className="w-32 h-24 flex-shrink-0">
                          <div className="w-full h-full bg-gray-200">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt={getNewsTitle(article)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                <Newspaper className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {article.category && (
                              <span className="text-xs font-medium text-red-600">
                                {article.category.name}
                              </span>
                            )}
                            {article.isBreaking && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 font-bold">
                                {language === 'hi' ? 'ब्रेकिंग' : 'BREAKING'}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                            {getNewsTitle(article)}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <span>{article.readingTime} {language === 'hi' ? 'मिनट पढ़ना' : 'min read'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* More Stories List */}
                <div className="space-y-4">
                  {latestNews.slice(5, 10).map((article) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                            {getNewsTitle(article)}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            {article.category && (
                              <span className="text-red-600">{article.category.name}</span>
                            )}
                            <span>{article.readingTime} {language === 'hi' ? 'मिनट पढ़ना' : 'min read'}</span>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                        <div className="w-20 h-14 flex-shrink-0 bg-gray-200">
                          {article.featuredImage && (
                            <img
                              src={article.featuredImage}
                              alt={getNewsTitle(article)}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* YouTube Videos Section */}
              <div className="mb-8">
                <YouTubeVideosSection />
              </div>

              {/* LATEST NEWS SECTION */}
              <div className="bg-white p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'hi' ? 'नवीनतम समाचार' : 'Latest News'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'सभी श्रेणियों से ताजा अपडेट' : 'Fresh updates from all categories'}
                    </p>
                  </div>
                  <Link href="/news" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    {language === 'hi' ? 'अधिक कहानियाँ →' : 'More Stories →'}
                  </Link>
                </div>

                <div className="space-y-6">
                  {latestNews.slice(11, 17).map((article) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block pb-6 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1">
                              {article.category?.name || (language === 'hi' ? 'सामान्य' : "General")}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(article.publishedAt).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold group-hover:text-red-600 transition-colors mb-3">
                            {getNewsTitle(article)}
                          </h4>
                          <p className="text-gray-700 leading-relaxed line-clamp-2 mb-4">
                            {getNewsExcerpt(article)}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">
                                {language === 'hi' ? 'द्वारा' : 'By'} {article.author.name}
                              </span>
                              <span>{article.readingTime} {language === 'hi' ? 'मिनट पढ़ना' : 'min read'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-40 h-28 flex-shrink-0">
                          <div className="w-full h-full bg-gray-200">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt={getNewsTitle(article)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                <Newspaper className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* INLINE AD */}
              <div className="mb-8">
                <GoogleAdSense
                  adSlot="0987654321"
                  adFormat="horizontal"
                  className="max-w-[728px] mx-auto"
                />
              </div>

              {/* TOP OPINIONS SECTION - Updated with Hindi support */}
              {topOpinions.length > 0 && (
                <div className="bg-white p-6 mb-8 border-t-4 border-red-600">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {language === 'hi' ? 'शीर्ष राय' : 'Top Opinions'}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {language === 'hi' 
                            ? 'वर्तमान मामलों पर विशेषज्ञों के विचार'
                            : 'Expert perspectives on current affairs'
                          }
                        </p>
                      </div>
                    </div>
                    <Link 
                      href="/opinions" 
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm"
                    >
                      {language === 'hi' ? 'सभी देखें' : 'View All'}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topOpinions.map((opinion, index) => (
                      <div 
                        key={opinion._id} 
                        className="border hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => navigateToOpinion(opinion._id)}
                      >
                        <div className="p-4">
                          {/* Opinion Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                                {language === 'hi' ? 'राय' : 'OPINION'}
                              </span>
                              {opinion.topic && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1">
                                  {opinion.topic}
                                </span>
                              )}
                            </div>
                            {index < 3 && (
                              <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1">
                                #{index + 1}
                              </div>
                            )}
                          </div>

                          {/* Title - Now shows Hindi title when language is Hindi */}
                          <h3 className="font-bold text-lg leading-tight mb-3 hover:text-red-600 transition-colors line-clamp-2">
                            {getOpinionTitle(opinion)}
                          </h3>

                          {/* Author Info */}
                          <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                              {/* {opinion.authorId.name.charAt(0)} */}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{opinion.authorId.name}</p>
                              <p className="text-xs text-gray-500">
                                {opinion.authorId.designation || (language === 'hi' ? 'स्तंभकार' : 'Columnist')}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {opinion.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {opinion.views}
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {getReadTime(getOpinionContent(opinion))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Language Information for Opinions */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Globe className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          {language === 'hi' ? 'राय भाषा सुविधा' : 'Opinion Language Feature'}
                        </h4>
                        <p className="text-sm text-blue-700">
                          {language === 'hi' 
                            ? 'ये राय हिंदी और अंग्रेजी दोनों भाषाओं में उपलब्ध हैं। राय पढ़ने के लिए क्लिक करें।'
                            : 'These opinions are available in both Hindi and English languages. Click to read the opinion.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="lg:col-span-3 space-y-6">
              {/* YouTube Sidebar */}
              <YouTubeSidebar />

              {/* Most Popular */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {language === 'hi' ? 'सबसे लोकप्रिय' : 'Most Popular'}
                </h3>
                <div className="space-y-4">
                  {trendingNews.slice(0, 8).map((article, index) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-gray-500 w-6 text-right">
                          {index + 1}.
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                            {getNewsTitle(article)}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                            <span>•</span>
                            <span>{article.category?.name}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                  {language === 'hi' ? 'श्रेणियाँ' : 'Categories'}
                </h3>
                <div className="space-y-2">
                  {[
                    { name: language === 'hi' ? "राष्ट्रीय" : "National", count: 234 },
                    { name: language === 'hi' ? "अंतर्राष्ट्रीय" : "International", count: 189 },
                    { name: language === 'hi' ? "राजनीति" : "Politics", count: 156 },
                    { name: language === 'hi' ? "व्यापार" : "Business", count: 142 },
                    { name: language === 'hi' ? "खेल" : "Sports", count: 128 },
                    { name: language === 'hi' ? "प्रौद्योगिकी" : "Technology", count: 115 },
                    { name: language === 'hi' ? "मनोरंजन" : "Entertainment", count: 98 },
                    { name: language === 'hi' ? "स्वास्थ्य" : "Health", count: 87 },
                    { name: language === 'hi' ? "राय" : "Opinions", count: 76, link: "/opinions" },
                  ].map((category) => (
                    <Link
                      key={category.name}
                      href={category.link || "#"}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-50 rounded transition-colors group"
                    >
                      <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Fact Check */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {language === 'hi' ? 'तथ्य जांच' : 'Fact Check'}
                </h3>
                <div className="space-y-3">
                  {language === 'hi' 
                    ? [
                        { title: "वायरल वीडियो दावे: डीपफेक विश्लेषण", status: "गलत" },
                        { title: "स्वास्थ्य गलत जानकारी चेतावनी", status: "भ्रामक" }
                      ].map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 border rounded">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium">{item.title}</h4>
                            <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                              {item.status}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-sm p-0 h-auto"
                          >
                            {language === 'hi' ? 'पूरी तथ्य जांच पढ़ें →' : 'Read Full Fact-Check →'}
                          </Button>
                        </div>
                      ))
                    : [
                        { title: "Viral Video Claims: Deepfake Analysis", status: "False" },
                        { title: "Health Misinformation Alert", status: "Misleading" }
                      ].map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 border rounded">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium">{item.title}</h4>
                            <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                              {item.status}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-sm p-0 h-auto"
                          >
                            Read Full Fact-Check →
                          </Button>
                        </div>
                      ))
                  }
                </div>
              </div>

              {/* Language Information Card */}
              <div className="bg-white border p-4 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {language === 'hi' ? 'भाषा' : 'Language'}
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {language === 'hi' 
                      ? 'यह पेज द्विभाषी समाचार प्रदान करता है। हेडर से भाषा बदलें।'
                      : 'This page provides bilingual news. Change language from header.'
                    }
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={language === 'en' ? "default" : "outline"}
                      className={language === 'en' ? "bg-red-600 text-white" : ""}
                    >
                      English
                    </Badge>
                    <Badge 
                      variant={language === 'hi' ? "default" : "outline"}
                      className={language === 'hi' ? "bg-red-600 text-white" : ""}
                    >
                      हिंदी
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Sticky Ad */}
              <div className="sticky top-24">
                <GoogleAdSense
                  adSlot="1122334455"
                  adFormat="vertical"
                  className="w-full"
                />
              </div>
            </aside>
          </div>
        </div>

        {/* ================= FOOTER TOP AD ================= */}
        <div className="bg-gray-50 border-t py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <GoogleAdSense
                adSlot="6677889900"
                adFormat="horizontal"
                className="max-w-[970px] w-full"
              />
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}