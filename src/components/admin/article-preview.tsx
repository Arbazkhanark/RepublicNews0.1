"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, User, Share2 } from "lucide-react";

interface ArticlePreviewProps {
  article: {
    title: string;
    titleHi?: string;
    subtitle?: string;
    subtitleHi?: string;
    content: string;
    contentHi?: string;
    excerpt?: string;
    excerptHi?: string;
    featuredImage?: string;
    categoryId?: string;
    status?: string;
    publishedAt?: string;
    author?: string;
    layoutConfig?: {
      showAuthor: boolean;
      showDate: boolean;
      showCategory: boolean;
      showSocialShare: boolean;
    };
  };
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  // Function to convert markdown and custom HTML to display HTML
  const convertContentToHTML = (content: string) => {
    if (!content) return "";

    // Replace custom image containers with proper HTML
    let html = content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Underline (HTML)
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      // Headings
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^1\. (.*$)/gm, '<li class="ml-4">$1</li>')
      // Blockquotes
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic">$1</blockquote>'
      )
      // Links
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
      )
      // Line breaks
      .replace(/\n/g, "<br>");

    return html;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Article Preview</span>
          <Badge
            variant={article.status === "published" ? "default" : "secondary"}
          >
            {article.status || "draft"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Article Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{article.title}</h1>
          {article.subtitle && (
            <h2 className="text-xl text-gray-600">{article.subtitle}</h2>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {article.layoutConfig?.showDate && article.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {article.layoutConfig?.showAuthor && article.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}
            {article.layoutConfig?.showSocialShare && (
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg italic text-gray-700">{article.excerpt}</p>
          </div>
        )}

        {/* Content with Images */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: convertContentToHTML(article.content),
            }}
          />
        </div>

        {/* Hindi Content */}
        {article.contentHi && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">हिंदी संस्करण</h2>
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: convertContentToHTML(article.contentHi),
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
