// import Article, { News } from "@/lib/models/index"
import { getArticleModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
// import { findNews } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url)
    console.log(request.url, "REQUESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured") === "true"
    const trending = searchParams.get("trending") === "true"
    const language = searchParams.get("language")

    console.log(searchParams, "SEARCHPARAMSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    // let news = findNews({ status: "published" })
    const Article = getArticleModel();
    let news = await Article.find({ status: "published" }).lean()
    console.log(news, "NEWSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

    // Apply filters
    if (category) {
      news = news.filter((item) => item.category.slug === category)
    }
    if (featured) {
      news = news.filter((item) => item.isFeatured === true)
    }
    if (language) {
      news = news.filter((item) => item.language === language)
    }

    // Sort
    if (trending) {
      news.sort((a, b) => b.views - a.views || new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    } else {
      news.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    }

    // Pagination
    const total = news.length
    const skip = (page - 1) * limit
    const paginatedNews = news.slice(skip, skip + limit)

    // Format response to match expected structure
    const formattedNews = paginatedNews.map((item) => ({
      _id: item._id,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      featuredImage: item.featuredImage,
      contributorName: item.contributorName,
      publishedAt: item.publishedAt,
      views: item.views,
      readingTime: item.readingTime,
      isBreaking: item.isBreaking,
      isFeatured: item.isFeatured,
      language: item.language,
      category: {
        name: item.category.name,
        slug: item.category.slug,
      },
      author: {
        name: item.author.name,
      },
    }))

    return NextResponse.json({
      news: formattedNews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get public news error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
