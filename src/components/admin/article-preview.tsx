"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Facebook, Twitter, Linkedin } from "lucide-react";

interface ArticlePreviewProps {
  article: {
    title: string;
    titleHi: string;
    subtitle: string;
    subtitleHi: string;
    content: string;
    contentHi: string;
    featuredImage: string;
    mediaUrls: string[];
    sourcePersonName: string;
    sourcePersonSocial: Record<string, string>;
    layoutConfig: {
      showAuthor: boolean;
      showDate: boolean;
      showCategory: boolean;
      showSocialShare: boolean;
      imagePosition: string;
      textAlign: string;
    };
  };
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(
        /### (.*)/g,
        '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>'
      )
      .replace(
        /## (.*)/g,
        '<h2 class="text-2xl font-semibold mb-4 mt-8">$1</h2>'
      )
      .replace(/# (.*)/g, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(
        /> (.*)/g,
        '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>'
      )
      .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          {/* Article Header */}
          <div className="space-y-4 mb-8">
            {article.layoutConfig.showCategory && (
              <Badge className="mb-2">Technology</Badge>
            )}

            <h1 className="text-4xl font-bold text-foreground leading-tight">
              {article.title || "Article Title"}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-muted-foreground">
                {article.subtitle}
              </p>
            )}

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              {article.layoutConfig.showAuthor && (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?key=author" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </div>
              )}

              {article.layoutConfig.showDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div
              className={`mb-8 ${
                article.layoutConfig.imagePosition === "center"
                  ? "text-center"
                  : article.layoutConfig.imagePosition === "left"
                  ? "float-left mr-6 mb-4"
                  : article.layoutConfig.imagePosition === "right"
                  ? "float-right ml-6 mb-4"
                  : ""
              }`}
            >
              <img
                src={
                  article.featuredImage ||
                  "/placeholder.svg?height=400&width=800&query=news article featured image"
                }
                alt="Featured"
                className={`rounded-lg ${
                  article.layoutConfig.imagePosition === "left" ||
                  article.layoutConfig.imagePosition === "right"
                    ? "w-80"
                    : "w-full max-h-96 object-cover"
                }`}
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className={`prose prose-lg max-w-none mb-8 ${
              article.layoutConfig.textAlign === "center"
                ? "text-center"
                : article.layoutConfig.textAlign === "right"
                ? "text-right"
                : article.layoutConfig.textAlign === "justify"
                ? "text-justify"
                : "text-left"
            }`}
            dangerouslySetInnerHTML={{
              __html: formatContent(
                article.content || "Your article content will appear here..."
              ),
            }}
          />

          {/* Media Gallery */}
          {article.mediaUrls.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Media</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {article.mediaUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt={`Media ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Source Information */}
          {article.sourcePersonName && (
            <div className="border-t border-border pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">News Source</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{article.sourcePersonName}</p>
                  <p className="text-sm text-muted-foreground">
                    News Contributor
                  </p>
                </div>
                <div className="flex space-x-2">
                  {article.sourcePersonSocial.twitter && (
                    <Button variant="outline" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  )}
                  {article.sourcePersonSocial.facebook && (
                    <Button variant="outline" size="sm">
                      <Facebook className="h-4 w-4" />
                    </Button>
                  )}
                  {article.sourcePersonSocial.linkedin && (
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Share */}
          {article.layoutConfig.showSocialShare && (
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Share this article</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
