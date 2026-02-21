import { Metadata } from "next";
import ArticleClient from "./ArticleClient";

// Generate metadata dynamically based on article data
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  // ✅ Await the params Promise first
  const { id } = await params;
  
  try {
    // Fetch article data for metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      const article = data.data;
      const title = article.title || "Article";
      const description = article.excerpt || article.content?.substring(0, 160) || "Read latest news on Republic Mirror";
      const images = article.featuredImage ? [article.featuredImage] : [];
      
      return {
        title: `${title} - Republic Mirror`,
        description: description,
        keywords: article.tags?.join(", ") || "news, article, Republic Mirror",
        authors: article.author ? [{ name: article.author.name }] : [{ name: "Republic Mirror" }],
        creator: article.author?.name || "Republic Mirror",
        publisher: "Republic Mirror",
        metadataBase: new URL('https://republicmirror.com'),
        alternates: {
          canonical: `/news/${id}`,
          languages: {
            'en-US': `/en/news/${id}`,
            'hi-IN': `/hi/news/${id}`,
          },
        },
        openGraph: {
          title: title,
          description: description,
          url: `https://republicmirror.com/news/${id}`,
          siteName: 'Republic Mirror',
          images: images.length > 0 ? images : [{
            url: 'https://republicmirror.com/og-default.jpg',
            width: 1200,
            height: 630,
            alt: title,
          }],
          locale: 'en_US',
          type: 'article',
          publishedTime: article.publishedAt,
          authors: article.author ? [article.author.name] : undefined,
          tags: article.tags,
        },
        twitter: {
          card: 'summary_large_image',
          title: title,
          description: description,
          images: images.length > 0 ? images : ['https://republicmirror.com/twitter-default.jpg'],
          creator: '@republicmirror',
          site: '@republicmirror',
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  // Fallback metadata
  return {
    title: "Article - Republic Mirror",
    description: "Read latest news and articles on Republic Mirror",
  };
}

export default async function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Await params here too
  const { id } = await params;
  return <ArticleClient params={{ id }} />;
}