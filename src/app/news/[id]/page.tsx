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
} from "lucide-react";
import { useParams } from "next/navigation";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import Image from "next/image";
import { GoogleAdSense } from "@/components/public/google-adsense";
// import { GoogleAdSense } from '@/components/google-adsense'; // Import your GoogleAdSense component

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
  categories: Category[]; // Updated from categoryId to categories (array)
  author: Author; // Updated from authorId to author
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
        } else {
          throw new Error("Invalid response format");
        }

        // Fetch related articles after main article is loaded
        if (data.data) {
          await fetchRelatedArticles(data.data);
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

      // Build query parameters for related articles
      const searchParams = new URLSearchParams({
        page: "1",
        limit: "3",
      });

      // Use first category for related articles
      if (currentArticle.categories && currentArticle.categories.length > 0) {
        searchParams.append("category", currentArticle.categories[0]._id);
      }

      // Optional: Add search term if you want to search by title/content
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
        // Filter out the current article and limit to 3 articles
        const filteredArticles = data.data.articles
          .filter((relatedArticle) => relatedArticle._id !== currentArticle._id)
          .slice(0, 3);

        setRelatedArticles(filteredArticles);
      }
    } catch (err) {
      console.error("Error fetching related articles:", err);
      // You can set a fallback or leave related articles empty
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
    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await fetch(`/api/news/${article._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ liked: newLikedState }),
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikes((prev) => (newLikedState ? prev - 1 : prev + 1));
      console.error("Failed to update like:", error);
    }
  };

  const handleShare = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const text = article.title;

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
      case "copy":
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
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
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  };

  const handleRelatedArticleClick = (slug: string) => {
    // Navigate to the related article
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

  // Get first category for display
  const mainCategory =
    article.categories && article.categories.length > 0
      ? article.categories[0]
      : {
          _id: "",
          name: "Uncategorized",
          slug: "uncategorized",
          color: "#6b7280",
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
                    className="text-primary-foreground"
                    style={{ backgroundColor: "#3b82f6" }} // Default blue color
                  >
                    {mainCategory.name}
                  </Badge>
                )}

                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                  {article.title}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  {article.layoutConfig?.showAuthor && article.author && (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={article.author.profileImage || ""} />
                        <AvatarFallback>
                          {article.author.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {article.author.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                        className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
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
                        className={isBookmarked ? "text-primary" : ""}
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
                          className="gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>

                        {showShareMenu && (
                          <Card className="absolute right-0 mt-2 w-48 z-10">
                            <CardContent className="p-2">
                              <div className="space-y-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2"
                                  onClick={() => handleShare("twitter")}
                                >
                                  <Twitter className="h-4 w-4" />
                                  Twitter
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2"
                                  onClick={() => handleShare("facebook")}
                                >
                                  <Facebook className="h-4 w-4" />
                                  Facebook
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2"
                                  onClick={() => handleShare("linkedin")}
                                >
                                  <Linkedin className="h-4 w-4" />
                                  LinkedIn
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2"
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
              <div className="relative">
                <Image
                  width={100}
                  height={100}
                  src={
                    article.featuredImage ||
                    "https://images.pexels.com/photos/1679618/pexels-photo-1679618.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt={article.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg"
                />

                {/* ✅ Ad Space - Top (728x90) */}
                <div className="mt-6">
                  <GoogleAdSense
                    adSlot="728x90_top_article" // अपना actual ad slot ID डालें
                    adFormat="horizontal"
                    fullWidthResponsive={true}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{
                  __html: formatContent(article.content),
                }}
              />

              {/* ✅ In-Content Ad (300x250) - Content ke बीच में */}
              <div className="my-8 text-center">
                <GoogleAdSense
                  adSlot="300x250_incontent" // अपना actual ad slot ID डालें
                  adFormat="rectangle"
                  fullWidthResponsive={false}
                  className="mx-auto"
                />
              </div>

              {/* Source Information */}
              {article.sourcePersonName && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Source Information</h3>
                    <p className="text-muted-foreground">
                      Information provided by: {article.sourcePersonName}
                    </p>
                    {article.sourcePersonSocial?.facebook && (
                      <p className="text-sm mt-1">
                        Facebook: {article.sourcePersonSocial.facebook}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* ✅ Ad Space - Middle (728x90) */}
              <div className="my-6">
                <GoogleAdSense
                  adSlot="728x90_middle_article" // अपना actual ad slot ID डालें
                  adFormat="horizontal"
                  fullWidthResponsive={true}
                  className="w-full"
                />
              </div>

              {/* Author Bio */}
              {article.layoutConfig?.showAuthor && article.author && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={article.author.profileImage || ""} />
                        <AvatarFallback>
                          {article.author.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          About {article.author.name}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Author at News Platform
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
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
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            John Doe
                          </span>
                          <span className="text-xs text-muted-foreground">
                            2 hours ago
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">
                          Great article! This really highlights the importance
                          of staying ahead of technological trends.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />5
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ✅ Ad Space - Sidebar Top (300x250) */}
            <div>
              <GoogleAdSense
                adSlot="300x250_sidebar_top" // अपना actual ad slot ID डालें
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>

            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
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
                          <Image
                            width={80}
                            height={80}
                            src={relatedArticle.featuredImage}
                            alt={relatedArticle.title}
                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {relatedArticle.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                  borderColor: "#3b82f6",
                                  color: "#3b82f6",
                                }}
                              >
                                {relatedCategory.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {
                                  formatDate(relatedArticle.publishedAt).split(
                                    ","
                                  )[0]
                                }
                              </span>
                              <Eye className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {relatedArticle.meta?.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No related articles found
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ✅ Ad Space - Sidebar Middle (300x250) */}
            <div className="mt-6">
              <GoogleAdSense
                adSlot="300x250_sidebar_middle" // अपना actual ad slot ID डालें
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>

            {/* ✅ Ad Space - Sidebar Bottom (300x100 or 300x250) */}
            <div className="mt-6">
              <GoogleAdSense
                adSlot="300x250_sidebar_bottom" // अपना actual ad slot ID डालें
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
