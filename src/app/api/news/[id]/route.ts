import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth, withAuth } from "@/lib/auth/middleware";
import slugify from "slugify";
import { connectToDatabase } from "@/lib/mongodb";
import { getArticleModel, getCategoryModel, getUserModel, IArticle } from "@/lib/models";
import mongoose from "mongoose";

// Define proper types for response data
interface ResponseData {
  success: boolean;
  message: string;
  data: IArticle | null;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  data: null;
}

// Type for request body with optional meta updates
interface UpdateArticleBody {
  title?: string;
  titleHi?: string;
  content?: string;
  contentHi?: string;
  excerpt?: string;
  excerptHi?: string;
  status?: 'draft' | 'published' | 'archived';
  category?: mongoose.Types.ObjectId | string; // SINGULAR category
  featuredImage?: string;
  featuredArticleImage?: string;
  mediaUrls?: string[];
  cloudinaryImages?: Array<{
    url: string;
    publicId: string;
    isFeaturedImage?: boolean;
    isFeaturedArticleImage?: boolean;
  }>;
  sourcePersonName?: string;
  sourcePersonNameHi?: string;
  sourcePersonSocial?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  layoutConfig?: {
    showAuthor: boolean;
    showDate: boolean;
    showCategory: boolean;
    showSocialShare: boolean;
    imagePosition: 'top' | 'left' | 'right' | 'center';
    textAlign: 'left' | 'center' | 'right' | 'justify';
  };
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  scheduledAt?: string | Date;
  tags?: string[];
  isFeatured?: boolean;
  isBreaking?: boolean;
  allowComments?: boolean;
  meta?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

// Utility: Standard Response
const response = (
  success: boolean,
  data: IArticle | null = null,
  message: string = "",
  status: number = 200
): NextResponse<ResponseData | ErrorResponse> => {
  return NextResponse.json({ success, message, data }, { status });
};

// GET handler (no auth middleware, so params can stay as is)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResponseData | ErrorResponse>> {
  try {
    await connectToDatabase();

    const { id } = await params;

    getUserModel();
    getCategoryModel();
    const Article = getArticleModel();

    // FIXED: Use 'category' (singular) instead of 'categories'
    const article: IArticle | null = await Article.findById(id)
      .populate("author", "name email avatar")
      .populate("category", "name slug color icon"); // SINGULAR category

    if (!article) {
      return response(false, null, "Article not found", 404);
    }

    return response(true, article, "Article fetched successfully");
  } catch (error: unknown) {
    console.error("Get article error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch article";
    return response(false, null, errorMessage, 500);
  }
}

// PATCH handler wrapped in withAdminAuth
export const PATCH = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectToDatabase();

    // Extract ID from URL path (assuming URL like /api/articles/:id)
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return response(false, null, "ID parameter missing", 400);
    }

    const body: UpdateArticleBody = await req.json();

    const Article = getArticleModel();
    const article = await Article.findById(id);

    if (!article) {
      return response(false, null, "Article not found", 404);
    }

    const {
      title,
      titleHi,
      content,
      contentHi,
      excerpt,
      excerptHi,
      status,
      category,
      featuredImage,
      featuredArticleImage,
      mediaUrls,
      cloudinaryImages,
      sourcePersonName,
      sourcePersonNameHi,
      sourcePersonSocial,
      layoutConfig,
      seoTitle,
      seoDescription,
      seoKeywords,
      scheduledAt,
      tags,
      isFeatured,
      isBreaking,
      allowComments,
      meta,
    } = body;

    // Update slug if title changes
    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      const exists = await Article.findOne({ slug, _id: { $ne: id } });
      if (exists) {
        return response(false, null, "Another article with this title already exists", 409);
      }
      article.slug = slug;
      article.title = title;
    }

    // Update fields
    if (titleHi !== undefined) article.titleHi = titleHi;
    if (content !== undefined) article.content = content;
    if (contentHi !== undefined) article.contentHi = contentHi;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (excerptHi !== undefined) article.excerptHi = excerptHi;
    if (status !== undefined) article.status = status;

    // SINGULAR category - handle both ObjectId and string
    if (category !== undefined) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        article.category = new mongoose.Types.ObjectId(category);
      } else {
        article.category = category as any; // Fallback if string
      }
    }

    if (featuredImage !== undefined) article.featuredImage = featuredImage;
    if (featuredArticleImage !== undefined) article.featuredArticleImage = featuredArticleImage;
    if (mediaUrls !== undefined) article.mediaUrls = mediaUrls;
    if (cloudinaryImages !== undefined) article.cloudinaryImages = cloudinaryImages;
    if (sourcePersonName !== undefined) article.sourcePersonName = sourcePersonName;
    if (sourcePersonNameHi !== undefined) article.sourcePersonNameHi = sourcePersonNameHi;
    if (sourcePersonSocial !== undefined) article.sourcePersonSocial = sourcePersonSocial;
    if (layoutConfig !== undefined) article.layoutConfig = layoutConfig;
    if (seoTitle !== undefined) article.seoTitle = seoTitle;
    if (seoDescription !== undefined) article.seoDescription = seoDescription;
    if (seoKeywords !== undefined) article.seoKeywords = seoKeywords;
    if (scheduledAt !== undefined) {
      article.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    }
    if (tags !== undefined) article.tags = tags;
    if (isFeatured !== undefined) article.isFeatured = isFeatured;
    if (isBreaking !== undefined) article.isBreaking = isBreaking;
    if (allowComments !== undefined) article.allowComments = allowComments;

    // Update meta
    if (meta) {
      if (meta.views !== undefined) article.meta.views = meta.views;
      if (meta.likes !== undefined) article.meta.likes = meta.likes;
      if (meta.shares !== undefined) article.meta.shares = meta.shares;
      if (meta.comments !== undefined) article.meta.comments = meta.comments;
    }

    // Handle publishedAt based on status
    if (status === "published" && !article.publishedAt) {
      article.publishedAt = new Date();
    } else if (status === "draft") {
      article.publishedAt = null;
    }

    // Auto-generate excerpt if not provided and content is updated
    if ((content !== undefined || contentHi !== undefined) && !excerpt) {
      const contentToUse = content || contentHi || "";
      article.excerpt = contentToUse.substring(0, 150) + (contentToUse.length > 150 ? "..." : "");
    }

    // Auto-generate Hindi excerpt if not provided
    if (contentHi !== undefined && !excerptHi) {
      article.excerptHi = contentHi.substring(0, 150) + (contentHi.length > 150 ? "..." : "");
    }

    // Auto-generate SEO fields
    if (!article.seoTitle && article.title) {
      article.seoTitle = article.title.substring(0, 60);
    }

    if (!article.seoDescription && article.excerpt) {
      article.seoDescription = article.excerpt.substring(0, 160);
    }

    // Save the article
    await article.save();

    // Get updated article with populated references
    const updatedArticle = await Article.findById(id)
      .populate("author", "name email avatar")
      .populate("category", "name slug color icon"); // SINGULAR category

    return response(true, updatedArticle, "Article updated successfully", 200);
  } catch (error: unknown) {
    console.error("PATCH /articles/:id error:", error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);
      return response(false, null, `Validation failed: ${errors.join(', ')}`, 400);
    }

    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return response(false, null, "Duplicate slug or title", 409);
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to update article";
    return response(false, null, errorMessage, 500);
  }
});

// DELETE handler wrapped in withAuth
export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return response(false, null, "ID parameter missing", 400);
    }

    const Article = getArticleModel();
    const article = await Article.findById(id);

    if (!article) {
      return response(false, null, "Article not found", 404);
    }

    // Optional: Delete associated Cloudinary images if needed
    if (article.cloudinaryImages && article.cloudinaryImages.length > 0) {
      console.log(`Note: Article has ${article.cloudinaryImages.length} Cloudinary images that may need manual cleanup`);
    }

    await Article.findByIdAndDelete(id);

    return response(true, null, "Article deleted successfully", 200);
  } catch (error: unknown) {
    console.error("DELETE /articles/:id error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete article";
    return response(false, null, errorMessage, 500);
  }
});