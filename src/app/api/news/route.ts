import { type NextRequest, NextResponse } from "next/server";
import { withAdminAuth, withAuth } from "@/lib/auth/middleware";
import slugify from "slugify";
import { connectToDatabase } from "@/lib/mongodb";
import { getArticleModel, getCategoryModel, getUserModel } from "@/lib/models";
import mongoose from "mongoose";
import { generateSlug } from "@/lib/utils/article-utils";

/**
 * Utility: Standard Response
 */
const response = (
  success: boolean,
  data: unknown = null,
  message: string = "",
  status: number = 200
) => {
  return NextResponse.json({ success, message, data }, { status });
};

interface QueryFilters {
  categoryId?: string;
  status?: string;
  titleHi?: { $exists: boolean; $ne: string };
  title?: { $exists: boolean; $ne: string };
  $or?: Array<{
    [key: string]: { $regex: string; $options: string };
  }>;
}

/**
 * GET: Fetch all articles with filters, search, pagination
 */
export const GET = async (request: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 50); // cap limit
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const language = searchParams.get("language");
    const search = searchParams.get("search");

    // Build query
    const query: QueryFilters = {};
    if (category) query.categoryId = category;
    if (status) query.status = status;

    // ✅ Language filtering (based on titleHi or title fields)
    if (language === "hi") {
      query.titleHi = { $exists: true, $ne: "" };
    } else if (language === "en") {
      query.title = { $exists: true, $ne: "" };
    }

    // 🔍 Search logic
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { titleHi: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { contentHi: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    getCategoryModel();
    const Article = getArticleModel();
    const articles = await Article.find(query)
      .populate("category")
      .sort({ createdAt: -1 }) // Optional: Latest first
      .skip(skip)
      .limit(limit);


    const total = await Article.countDocuments(query);

    return response(true, {
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /articles error:", error);
    return response(false, null, "Failed to fetch articles", 500);
  }
};

interface ArticleData {
  title?: string;
  titleHi?: string;
  content?: string;
  contentHi?: string;
  category: string;
  status?: string;
  excerpt?: string;
  featuredImage?: string;
  mediaUrls?: string[];
  sourcePersonName?: string;
  sourcePersonNameHi?: string;
  sourcePersonSocial?: string;
  layoutConfig?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  scheduledAt?: string;
}

interface User {
  userId: string;
}

/**
 * POST: Create a new article
 */
export const POST = withAdminAuth(async (req: NextRequest, user: User) => {
  try {
    await connectToDatabase();
    const data: ArticleData = await req.json();

    const {
      title,
      titleHi,
      content,
      contentHi,
      category,
      status = "draft",
      excerpt,
      featuredImage,
      mediaUrls,
      sourcePersonName,
      sourcePersonNameHi,
      sourcePersonSocial,
      layoutConfig,
      seoTitle,
      seoDescription,
      seoKeywords,
      scheduledAt,
    } = data;

    // Validation
    if ((!title && !titleHi) || (!content && !contentHi) || !category) {
      return response(
        false,
        null,
        "At least one title, one content, and category are required.",
        400
      );
    }

    // Generate slug(s)
    const slug = title
      ? slugify(title, { lower: true, strict: true })
      : undefined;
    const slugHi = titleHi
      ? slugify(titleHi, { lower: true, strict: true, locale: "hi" })
      : undefined;

    // Check for duplicate slug
    const Article = getArticleModel();
    if (status === "published" && slug) {
      const existing = await Article.findOne({ slug });
      if (existing) {
        return response(
          false,
          null,
          `An article with the title "${title}" already exists.`,
          409
        );
      }
    }

    // Calculate reading time
    const words = `${content || ""} ${contentHi || ""}`.trim().split(/\s+/);
    const readingTime = words.length > 1 ? Math.ceil(words.length / 200) : 1;

    // Create new article
    const article = new Article({
      title,
      titleHi,
      slug,
      slugHi,
      content,
      contentHi,
      excerpt:
        excerpt || (content ? content.substring(0, 200) + "..." : undefined),
      featuredImage,
      mediaUrls: mediaUrls || [],
      sourcePersonName,
      sourcePersonNameHi,
      sourcePersonSocial,
      layoutConfig,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      seoKeywords: seoKeywords || [],
      category: category,
      author: user.userId,
      createdBy: user.userId,
      updatedBy: user.userId,
      status,
      publishedAt: status === "published" ? new Date() : null,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      readingTime,
    });

    console.log("Saving article:", article);

    await article.save();

    return response(
      true,
      { articleId: article._id, status: article.status },
      status === "published"
        ? "Article published successfully"
        : "Draft saved successfully",
      201
    );
  } catch (err: unknown) {
    console.log("POST /articles error:", err);

    // Duplicate key handling
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: unknown }).code === 11000
    ) {
      const errorObj = err as { keyValue?: Record<string, unknown> };
      const duplicateField = errorObj.keyValue
        ? Object.keys(errorObj.keyValue)[0]
        : "field";
      return response(
        false,
        null,
        `Duplicate value for ${duplicateField}. Please choose a different one.`,
        409
      );
    }

    return response(false, null, "Failed to save article", 500);
  }
});