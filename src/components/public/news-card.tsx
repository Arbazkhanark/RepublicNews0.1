"use client";

import type React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Heart, Share2, Bookmark } from "lucide-react";
import { useState } from "react";

interface NewsCardProps {
  article: {
    _id: string;
    title: string;
    titleHi?: string;
    subtitle?: string;
    subtitleHi?: string;
    excerpt: string;
    excerptHi?: string;
    featuredImage?: string;
    featuredArticleImage?: string;
    mediaUrls?: string[];
    cloudinaryImages?: Array<{
      url: string;
      publicId: string;
      isFeaturedImage?: boolean;
      isFeaturedArticleImage?: boolean;
    }>;
    category?:
      | {
          _id: string;
          name: string;
          slug: string;
          color?: string;
          icon?: string;
        }
      | string
      | null;
    tags?: string[];
    author?:
      | string
      | {
          _id: string;
          name: string;
          email?: string;
          avatar?: string;
        };
    createdBy?: string;
    updatedBy?: string;
    publishedAt: string;
    createdAt?: string;
    updatedAt?: string;
    meta?: {
      views: number;
      likes: number;
      shares: number;
      comments: number;
    };
    readingTime?: number;
    readingTimeHi?: number;
    isBreaking?: boolean;
    isFeatured?: boolean;
    status?: string;
    layoutConfig?: {
      showAuthor: boolean;
      showDate: boolean;
      showCategory: boolean;
      showSocialShare: boolean;
      imagePosition: string;
      textAlign: string;
    };
    language?: "en" | "hi";
  };
  variant?: "featured" | "standard" | "compact";
}

export function NewsCard({ article, variant = "standard" }: NewsCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to get category name
  const getCategoryName = () => {
    if (article.category) {
      if (typeof article.category === "object" && article.category !== null) {
        return article.category.name || "Uncategorized";
      }
    }
    return "Uncategorized";
  };

  // Helper function to get category color
  const getCategoryColor = () => {
    if (
      article.category &&
      typeof article.category === "object" &&
      article.category !== null &&
      article.category.color
    ) {
      return article.category.color;
    }
    return "#3B82F6"; // Default blue color
  };

  // Helper function to get author name
  const getAuthorName = () => {
    if (article.author) {
      if (typeof article.author === "object" && article.author !== null) {
        return article.author.name || "Admin";
      }
    }
    return "Admin";
  };

  // Get views count
  const getViews = () => {
    return article.meta?.views || 0;
  };

  // Get reading time
  const getReadingTime = () => {
    if (article.readingTime) {
      return article.readingTime;
    }
    // Calculate from content if not available
    const content = article.excerpt || "";
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  // Get image URL - FIXED with priority order
  const getImageUrl = () => {
    // Priority 1: featuredImage (if exists and is not empty)
    if (article.featuredImage && article.featuredImage.trim() !== "") {
      return article.featuredImage;
    }

    // Priority 2: featuredArticleImage (if exists and is not empty)
    if (
      article.featuredArticleImage &&
      article.featuredArticleImage.trim() !== ""
    ) {
      return article.featuredArticleImage;
    }

    // Priority 3: cloudinaryImages with isFeaturedImage flag
    if (article.cloudinaryImages && article.cloudinaryImages.length > 0) {
      // Try to find featured image first
      const featuredImage = article.cloudinaryImages.find(
        (img) => img.isFeaturedImage
      );
      if (
        featuredImage &&
        featuredImage.url &&
        featuredImage.url.trim() !== ""
      ) {
        return featuredImage.url;
      }

      // Try to find featured article image
      const featuredArticleImage = article.cloudinaryImages.find(
        (img) => img.isFeaturedArticleImage
      );
      if (
        featuredArticleImage &&
        featuredArticleImage.url &&
        featuredArticleImage.url.trim() !== ""
      ) {
        return featuredArticleImage.url;
      }

      // Return first valid image
      const firstValidImage = article.cloudinaryImages.find(
        (img) => img.url && img.url.trim() !== ""
      );
      if (firstValidImage) {
        return firstValidImage.url;
      }
    }

    // Priority 4: mediaUrls (if exists and has valid URLs)
    if (article.mediaUrls && article.mediaUrls.length > 0) {
      // Find first valid image URL
      const validImageUrl = article.mediaUrls.find(
        (url) =>
          url &&
          url.trim() !== "" &&
          (url.endsWith(".jpg") ||
            url.endsWith(".jpeg") ||
            url.endsWith(".png") ||
            url.endsWith(".gif") ||
            url.endsWith(".webp") ||
            url.endsWith(".svg"))
      );
      if (validImageUrl) {
        return validImageUrl;
      }

      // If no image extension found, return first valid URL anyway
      const firstValidUrl = article.mediaUrls.find(
        (url) => url && url.trim() !== ""
      );
      if (firstValidUrl) {
        return firstValidUrl;
      }
    }

    // Priority 5: Default fallback images based on category
    const categoryName = getCategoryName().toLowerCase();
    const fallbackImages = {
      election: "/images/default-election.jpg",
      fashion: "/images/default-fashion.jpg",
      national: "/images/default-national.jpg",
      politics: "/images/default-politics.jpg",
      technology: "/images/default-technology.jpg",
      health: "/images/default-health.jpg",
      business: "/images/default-business.jpg",
      sports: "/images/default-sports.jpg",
      entertainment: "/images/default-entertainment.jpg",
    };

    const defaultImage =
      fallbackImages[categoryName as keyof typeof fallbackImages] ||
      "/images/default-article.jpg";

    return defaultImage;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: implement share logic
  };

  // ✨ Compact Variant
  if (variant === "compact") {
    const imageUrl = getImageUrl();

    return (
      <Link href={`/news/${article._id}`} className="group block">
        <div className="flex gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]">
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {imageUrl && !imageUrl.startsWith("/images/default") ? (
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  // Fallback to default image if URL fails
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-article.jpg";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                <span className="text-red-600 font-bold text-lg">
                  {article.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>
                {formatDate(
                  article.publishedAt ||
                    article.createdAt ||
                    new Date().toISOString()
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {getViews()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ✨ Featured Variant
  if (variant === "featured") {
    const categoryName = getCategoryName();
    const categoryColor = getCategoryColor();
    const imageUrl = getImageUrl();

    return (
      <Link href={`/news/${article._id}`} className="group block">
        <div
          className="relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-64 md:h-80 overflow-hidden">
            {imageUrl && !imageUrl.startsWith("/images/default") ? (
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-article.jpg";
                  target.className =
                    "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800">
                <div className="text-center text-white p-8">
                  <span className="text-6xl font-bold mb-4 block">
                    {article.title.charAt(0).toUpperCase()}
                  </span>
                  <h2 className="text-2xl font-bold">{article.title}</h2>
                </div>
              </div>
            )}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 ${
                isHovered ? "from-black/80" : ""
              }`}
            />
            {article.isBreaking && (
              <Badge className="absolute top-4 left-4 bg-red-600 text-white animate-pulse shadow-lg">
                🚨 BREAKING
              </Badge>
            )}
            <div
              className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
            >
              <button
                onClick={handleBookmark}
                className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <Badge
                variant="secondary"
                className="mb-2 animate-fadeInUp"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryName}
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2 animate-fadeInUp">
                {article.title}
              </h2>
              {article.subtitle && (
                <p className="text-gray-200 text-sm line-clamp-2 animate-fadeInUp">
                  {article.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ✨ Standard Variant (default)
  const categoryName = getCategoryName();
  const categoryColor = getCategoryColor();
  const authorName = getAuthorName();
  const views = getViews();
  const readingTime = getReadingTime();
  const imageUrl = getImageUrl();

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/news/${article._id}`} className="block">
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.02]">
          <div className="relative h-48 overflow-hidden">
            {imageUrl && !imageUrl.startsWith("/images/default") ? (
              <img
                src={imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-article.jpg";
                  target.className =
                    "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                <div className="text-center p-4">
                  <span className="text-4xl font-bold text-red-600 mb-2 block">
                    {article.title.charAt(0).toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            )}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
            {article.isBreaking && (
              <Badge className="absolute top-3 left-3 bg-red-600 text-white animate-pulse shadow-lg">
                🚨 BREAKING
              </Badge>
            )}
            <div
              className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              <button
                onClick={handleLike}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              </button>
              <button
                onClick={handleBookmark}
                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked
                      ? "text-blue-500 fill-current"
                      : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                style={{
                  borderColor: categoryColor,
                  color: categoryColor,
                }}
              >
                {categoryName}
              </Badge>
              {article.isFeatured && (
                <Badge variant="secondary" className="animate-shimmer">
                  ⭐ Featured
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
              {article.title}
            </h3>
            {article.subtitle && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {article.subtitle}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
              <span>By {authorName}</span>
              <span>•</span>
              <span>
                {formatDate(
                  article.publishedAt ||
                    article.createdAt ||
                    new Date().toISOString()
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {views}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Add CSS styles for animations
const styles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}
.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200px 100%;
  animation: shimmer 2s infinite;
}
`;
