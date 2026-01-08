import { type NextRequest, NextResponse } from "next/server"
// import { News } from "@/lib/models/Articles"
import { connectToDatabase } from "@/lib/mongodb";
import { getArticleModel } from "@/lib/models";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const allNews = findNews({ status: "published" })
    await connectToDatabase();
    const { id } = await params; // Await the params
    const News = getArticleModel();
    const allNews = await News.find({ status: "published" }).lean()
    const newsArray = Array.isArray(allNews) ? allNews : [allNews]
    const article = newsArray.find((news) => news && news._id == id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Format response to match expected structure from aggregation
    const formattedArticle = {
      _id: article._id,
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      gallery: article.gallery,
      videos: article.videos,
      contributorName: article.contributorName,
      contributorSocialLinks: article.contributorSocialLinks,
      publishedAt: article.publishedAt,
      views: article.views,
      likes: article.likes,
      readingTime: article.readingTime,
      isBreaking: article.isBreaking,
      isFeatured: article.isFeatured,
      language: article.language,
      tags: article.tags,
      category: {
        name: article.category?.name,
        slug: article.category?.slug,
      },
      author: {
        name: article.author?.name,
        profileImage: article.author?.profileImage,
        bio: article.author?.bio,
      },
    }

    return NextResponse.json({ article: formattedArticle })
  } catch (error) {
    console.error("Get article error:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}