"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Clock,
  Eye,
  ThumbsUp,
  Send,
  AlertCircle,
  CheckCircle,
  Minus,
  Maximize2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import Image from "next/image";
import { GoogleAdSense } from "@/components/public/google-adsense";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface SourcePersonSocial {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  _id: string;
}

interface LayoutConfig {
  showAuthor: boolean;
  showDate: boolean;
  showCategory: boolean;
  showSocialShare: boolean;
  imagePosition: string;
  textAlign: string;
  _id: string;
}

interface Article {
  _id: string;
  title: string;
  titleHi: string;
  content: string;
  contentHi: string;
  excerpt: string;
  slug: string;
  slugHi: string;
  categories: Category[];
  author: Author;
  featuredImage: string;
  mediaUrls: string[];
  sourcePersonName: string;
  sourcePersonNameHi: string;
  sourcePersonSocial: SourcePersonSocial;
  layoutConfig: LayoutConfig;
  status: string;
  publishedAt: string;
  meta: {
    views: number;
    likes: number;
    shares: number;
  };
  tags: string[];
  isFeatured: boolean;
  isBreaking: boolean;
  allowComments: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  heroArticle: boolean;
}

interface RelatedArticle {
  _id: string;
  title: string;
  titleHi: string;
  excerpt: string;
  slug: string;
  categories: Category[];
  featuredImage: string;
  publishedAt: string;
  meta: {
    views: number;
    likes: number;
    shares: number;
  };
}

interface ArticlesResponse {
  success: boolean;
  message: string;
  data: {
    articles: RelatedArticle[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const ArticlePage = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [shares, setShares] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comment, setComment] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const articleId = params.id as string;

  // Check if user has already viewed this article in this session
  const hasViewedArticle = () => {
    if (typeof window === "undefined") return false;
    const viewedArticles = JSON.parse(sessionStorage.getItem("viewedArticles") || "[]");
    return viewedArticles.includes(articleId);
  };

  // Check if user has liked this article
  const checkIfLiked = () => {
    if (typeof window === "undefined") return false;
    const likedArticles = JSON.parse(sessionStorage.getItem("likedArticles") || "[]");
    return likedArticles.includes(articleId);
  };

  // Record article view once per session
  const recordView = async () => {
    if (!articleId || hasViewedArticle()) return;

    try {
      const response = await fetch(`/api/news/${articleId}/view/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Store in session storage to prevent duplicate views
          const viewedArticles = JSON.parse(sessionStorage.getItem("viewedArticles") || "[]");
          viewedArticles.push(articleId);
          sessionStorage.setItem("viewedArticles", JSON.stringify(viewedArticles));
          
          // Update view count
          setViews(data.data.views);
        }
      }
    } catch (error) {
      console.error("Failed to record view:", error);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${articleId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setArticle(data.data);
          setLikes(data.data.meta?.likes || 0);
          setViews(data.data.meta?.views || 0);
          setShares(data.data.meta?.shares || 0);
          
          // Check if user has already liked this article
          const liked = checkIfLiked();
          setIsLiked(liked);

          // Record view if not already viewed in this session
          await recordView();

          // Fetch related articles after main article is loaded
          await fetchRelatedArticles(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchRelatedArticles = async (currentArticle: Article) => {
    try {
      setRelatedLoading(true);

      const searchParams = new URLSearchParams({
        page: "1",
        limit: "3",
      });

      if (currentArticle.categories && currentArticle.categories.length > 0) {
        searchParams.append("category", currentArticle.categories[0]._id);
      }

      if (currentArticle.title) {
        searchParams.append(
          "search",
          currentArticle.title.split(" ").slice(0, 2).join(" ")
        );
      }

      const response = await fetch(`/api/news?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch related articles");
      }

      const data: ArticlesResponse = await response.json();

      if (data.success && data.data) {
        const filteredArticles = data.data.articles
          .filter((relatedArticle) => relatedArticle._id !== currentArticle._id)
          .slice(0, 3);

        setRelatedArticles(filteredArticles);
      }
    } catch (err) {
      console.error("Error fetching related articles:", err);
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = async () => {
    if (!article) return;

    const newLikedState = !isLiked;
    const currentLikedArticles = JSON.parse(sessionStorage.getItem("likedArticles") || "[]");

    try {
      if (newLikedState) {
        // Like the article
        const response = await fetch(`/api/news/${article._id}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsLiked(true);
            setLikes(data.data.likes);
            
            // Store in session storage
            if (!currentLikedArticles.includes(article._id)) {
              currentLikedArticles.push(article._id);
              sessionStorage.setItem("likedArticles", JSON.stringify(currentLikedArticles));
            }
            
            toast.success("Article liked successfully!");
          }
        }
      } else {
        // Unlike the article
        const response = await fetch(`/api/news/${article._id}/like`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsLiked(false);
            setLikes(data.data.likes || likes - 1);
            
            // Remove from session storage
            const updatedLikedArticles = currentLikedArticles.filter((id: string) => id !== article._id);
            sessionStorage.setItem("likedArticles", JSON.stringify(updatedLikedArticles));
            
            toast.success("Article unliked!");
          }
        }
      }
    } catch (error) {
      console.error("Failed to update like:", error);
      toast.error("Failed to update like status. Please try again.");
    }
  };

  const handleShare = async (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const text = article.title;

    try {
      // Record share in backend
      const shareResponse = await fetch(`/api/news/${article._id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform }),
      });

      if (shareResponse.ok) {
        const shareData = await shareResponse.json();
        if (shareData.success) {
          setShares(shareData.data.shares || shares + 1);
          toast.success(`Shared on ${platform}!`);
        }
      }

      // Open share dialog
      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              text
            )}&url=${encodeURIComponent(url)}`
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`
          );
          break;
        case "whatsapp":
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${text} ${url}`
            )}`
          );
          break;
        case "copy":
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
          break;
      }
    } catch (error) {
      console.error("Failed to share:", error);
      toast.error("Failed to record share. Please try again.");
    } finally {
      setShowShareMenu(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatContent = (content: string) => {
    if (!content) return "";
    
    let html = content;
    
    // 1. First handle images properly - they are stored as [IMAGE:url]
    html = html.replace(/\[IMAGE:(.*?)\]/g, (match, url) => {
      // Clean URL from any spaces
      const cleanUrl = url.trim();
      return `<div class="my-6 text-center">
                <div class="max-w-2xl mx-auto">
                  <img src="${cleanUrl}" alt="News Image" class="w-full h-auto rounded-lg shadow-md mx-auto" style="max-width: 600px; height: auto; max-height: 400px; object-fit: contain;"/>
                </div>
              </div>`;
    });
    
    // 2. Handle captions
    html = html.replace(/\[CAPTION:(.*?)\]/g, (match, caption) => {
      return `<p class="text-center text-sm text-gray-500 italic mt-2">${caption}</p>`;
    });
    
    // 3. Handle special templates from rich editor
    html = html.replace(/\[LEAD PARAGRAPH:(.*?)\]/g, (match, text) => {
      return `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p class="font-bold text-blue-700 mb-1">Lead Paragraph:</p>
                <p class="text-gray-800">${text}</p>
              </div>`;
    });
    
    html = html.replace(/\[KEY FACT:(.*?)\]/g, (match, text) => {
      return `<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
                <p class="font-bold text-yellow-700 mb-1">Key Fact:</p>
                <p class="text-gray-800">${text}</p>
              </div>`;
    });
    
    html = html.replace(/\[QUOTE:(.*?)\]/g, (match, text) => {
      return `<div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-4 italic">
                <p class="text-gray-700">"${text}"</p>
              </div>`;
    });
    
    html = html.replace(/\[IMPACT:(.*?)\]/g, (match, text) => {
      return `<div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                <p class="font-bold text-green-700 mb-1">Impact:</p>
                <p class="text-gray-800">${text}</p>
              </div>`;
    });
    
    html = html.replace(/\[WHAT'S NEXT:(.*?)\]/g, (match, text) => {
      return `<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
                <p class="font-bold text-purple-700 mb-1">What's Next:</p>
                <p class="text-gray-800">${text}</p>
              </div>`;
    });
    
    // 4. Convert markdown to HTML
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-gray-700">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^1\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">$1</blockquote>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>')
      .replace(/---/g, '<hr class="my-6 border-gray-300">');
    
    // 5. Handle paragraph breaks properly
    html = html.replace(/<br><br>/g, '</p><p class="mt-4">');
    
    return `<div class="article-content">${html}</div>`;
  };

  const handleRelatedArticleClick = (slug: string) => {
    window.location.href = `/article/${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="mt-2 text-muted-foreground">
            {error || "Article not found"}
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const mainCategory =
    article.categories && article.categories.length > 0
      ? article.categories[0]
      : {
          _id: "",
          name: "Uncategorized",
          slug: "uncategorized",
        };

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />
      <PublicHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <article className="space-y-6">
              {/* Article Header */}
              <header className="space-y-4">
                {article.layoutConfig?.showCategory && (
                  <Badge
                    variant="secondary"
                    className="text-white px-3 py-1 text-sm"
                    style={{ backgroundColor: "#3b82f6" }}
                  >
                    {mainCategory.name}
                  </Badge>
                )}

                <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
                  {article.title}
                </h1>

                {article.subtitle && (
                  <h2 className="text-xl text-gray-600 italic">
                    {article.subtitle}
                  </h2>
                )}

                <div className="flex items-center justify-between flex-wrap gap-4">
                  {article.layoutConfig?.showAuthor && article.author && (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={article.author.profileImage || ""} 
                          alt={article.author.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {article.author.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {article.author.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {article.layoutConfig?.showDate && (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(article.publishedAt)}</span>
                              <span>•</span>
                            </>
                          )}
                          <Eye className="h-4 w-4" />
                          <span>{views.toLocaleString()} views</span>
                          <span>•</span>
                          <Heart className="h-4 w-4" />
                          <span>{likes} likes</span>
                          <span>•</span>
                          <Share2 className="h-4 w-4" />
                          <span>{shares} shares</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Actions */}
                  {article.layoutConfig?.showSocialShare && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={`gap-2 ${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-600"}`}
                      >
                        <Heart
                          className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                        />
                        {likes}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={isBookmarked ? "text-primary hover:text-primary" : "text-gray-600"}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            isBookmarked ? "fill-current" : ""
                          }`}
                        />
                      </Button>

                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="gap-2 text-gray-600"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>

                        {showShareMenu && (
                          <Card className="absolute right-0 mt-2 w-48 z-10 shadow-lg">
                            <CardContent className="p-2">
                              <div className="space-y-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2 text-gray-700 hover:text-blue-500"
                                  onClick={() => handleShare("twitter")}
                                >
                                  <Twitter className="h-4 w-4" />
                                  Twitter
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2 text-gray-700 hover:text-blue-600"
                                  onClick={() => handleShare("facebook")}
                                >
                                  <Facebook className="h-4 w-4" />
                                  Facebook
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2 text-gray-700 hover:text-blue-700"
                                  onClick={() => handleShare("linkedin")}
                                >
                                  <Linkedin className="h-4 w-4" />
                                  LinkedIn
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2 text-gray-700 hover:text-green-500"
                                  onClick={() => handleShare("whatsapp")}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  WhatsApp
                                </Button>
                                <Separator />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2 text-gray-700"
                                  onClick={() => handleShare("copy")}
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Link
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </header>

              {/* Hero Image */}
              {article.featuredImage && (
                <div className="relative">
                  <div className="w-full overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-auto max-h-[500px] object-contain bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=600";
                      }}
                    />
                  </div>
                  
                  {article.excerpt && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 italic">{article.excerpt}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ Ad Space - Top (728x90) */}
              <div className="mt-6">
                <GoogleAdSense
                  adSlot="728x90_top_article"
                  adFormat="horizontal"
                  fullWidthResponsive={true}
                  className="w-full"
                />
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none text-gray-800"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  fontSize: '1.125rem',
                  lineHeight: '1.75'
                }}
                dangerouslySetInnerHTML={{
                  __html: formatContent(article.content),
                }}
              />

              {/* ✅ In-Content Ad (300x250) */}
              <div className="my-8 text-center">
                <GoogleAdSense
                  adSlot="300x250_incontent"
                  adFormat="rectangle"
                  fullWidthResponsive={false}
                  className="mx-auto"
                />
              </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {article.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 text-sm"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Source Information */}
              {article.sourcePersonName && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Source Information</h3>
                        <p className="text-gray-700">
                          Information provided by: <span className="font-medium">{article.sourcePersonName}</span>
                        </p>
                        {article.sourcePersonSocial && (
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            {article.sourcePersonSocial.twitter && (
                              <span>Twitter: {article.sourcePersonSocial.twitter}</span>
                            )}
                            {article.sourcePersonSocial.facebook && (
                              <span>Facebook: {article.sourcePersonSocial.facebook}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Separator className="my-8" />

              {/* ✅ Ad Space - Middle (728x90) */}
              <div className="my-6">
                <GoogleAdSense
                  adSlot="728x90_middle_article"
                  adFormat="horizontal"
                  fullWidthResponsive={true}
                  className="w-full"
                />
              </div>

              {/* Author Bio */}
              {article.layoutConfig?.showAuthor && article.author && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={article.author.profileImage || ""} 
                          alt={article.author.name}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {article.author.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          About {article.author.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Author at News Platform. Specializing in breaking news and in-depth analysis.
                        </p>
                        {article.author.socialLinks && (
                          <div className="flex items-center gap-3 mt-3">
                            {article.author.socialLinks.twitter && (
                              <a 
                                href={article.author.socialLinks.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-500"
                              >
                                <Twitter className="h-4 w-4" />
                              </a>
                            )}
                            {article.author.socialLinks.linkedin && (
                              <a 
                                href={article.author.socialLinks.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              {article.allowComments && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <MessageCircle className="h-5 w-5" />
                      Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Share your thoughts on this article..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        maxLength={500}
                        className="resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {comment.length}/500 characters
                        </p>
                        <Button size="sm" className="gap-2">
                          <Send className="h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Sample Comments */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">
                              John Doe
                            </span>
                            <span className="text-xs text-gray-500">
                              2 hours ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            Great article! This really highlights the importance
                            of staying ahead of technological trends.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs gap-1 text-gray-600"
                            >
                              <ThumbsUp className="h-3 w-3" />5
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ✅ Ad Space - Sidebar Top (300x250) */}
            <div>
              <GoogleAdSense
                adSlot="300x250_sidebar_top"
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>

            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : relatedArticles.length > 0 ? (
                  relatedArticles.map((relatedArticle) => {
                    const relatedCategory =
                      relatedArticle.categories &&
                      relatedArticle.categories.length > 0
                        ? relatedArticle.categories[0]
                        : {
                            _id: "",
                            name: "Uncategorized",
                            slug: "uncategorized",
                          };

                    return (
                      <div
                        key={relatedArticle._id}
                        className="group cursor-pointer"
                        onClick={() =>
                          handleRelatedArticleClick(relatedArticle.slug)
                        }
                      >
                        <div className="flex gap-3">
                          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                            <img
                              src={relatedArticle.featuredImage || "https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=600"}
                              alt={relatedArticle.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=600";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {relatedArticle.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5"
                                style={{
                                  borderColor: "#3b82f6",
                                  color: "#3b82f6",
                                }}
                              >
                                {relatedCategory.name}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(relatedArticle.publishedAt).split(",")[0]}
                              </span>
                              <Eye className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {relatedArticle.meta?.views?.toLocaleString() || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No related articles found
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ✅ Ad Space - Sidebar Middle (300x250) */}
            <div className="mt-6">
              <GoogleAdSense
                adSlot="300x250_sidebar_middle"
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>

            {/* ✅ Ad Space - Sidebar Bottom (300x100 or 300x250) */}
            <div className="mt-6">
              <GoogleAdSense
                adSlot="300x250_sidebar_bottom"
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default ArticlePage;