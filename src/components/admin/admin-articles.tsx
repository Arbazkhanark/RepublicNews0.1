"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  parentCategoryName?: string | null;
}

interface Article {
  _id: string;
  title: string;
  titleHi?: string;
  content: string;
  contentHi?: string;
  excerpt?: string;
  excerptHi?: string;
  slug: string;
  category: string | Category; // Can be ID string or populated Category object
  author:
    | string
    | { _id: string; name: string; email?: string; avatar?: string };
  featuredImage?: string;
  featuredArticleImage?: string;
  mediaUrls: string[];
  cloudinaryImages: Array<{
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
    imagePosition: string;
    textAlign: string;
  };
  status: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  meta: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  allowComments: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    articles: Article[];
    pagination: Pagination;
  };
}

// Simple toast implementation
const useToast = () => {
  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
      variant === "destructive"
        ? "bg-red-100 text-red-800 border border-red-200"
        : "bg-green-100 text-green-800 border border-green-200"
    }`;
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm">${description}</div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  return {
    toast: showToast,
  };
};

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      const response = await fetch(`/api/news?${params.toString()}`);

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setArticles(data.data.articles);
        setPagination(data.data.pagination);
      } else {
        throw new Error("Failed to fetch articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast("Error", "Failed to load articles", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [
    searchTerm,
    statusFilter,
    categoryFilter,
    pagination.page,
    pagination.limit,
  ]);

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const response = await fetch(`/api/news/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (response.ok) {
        toast("Success", "Article deleted successfully");
        // Refresh the articles list
        fetchArticles();
      } else {
        throw new Error("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast("Error", "Failed to delete article", "destructive");
    }
  };

  const handlePreview = (article: Article) => {
    setSelectedArticle(article);
    setIsPreviewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const getDisplayTitle = (article: Article) => {
    return article.title || article.titleHi || "Untitled Article";
  };

  // Helper function to get category name safely
  const getCategoryName = (article: Article): string => {
    if (!article.category) return "Uncategorized";

    if (typeof article.category === "object" && article.category !== null) {
      return article.category.name || "Uncategorized";
    }

    return "Uncategorized";
  };

  // Helper function to get category display name with parent
  const getDisplayCategory = (article: Article): string => {
    const categoryName = getCategoryName(article);

    if (typeof article.category === "object" && article.category !== null) {
      const category = article.category as Category;
      if (category.parentCategoryName) {
        return `${category.parentCategoryName} > ${categoryName}`;
      }
    }

    return categoryName;
  };

  // Helper function to get author name safely
  const getAuthorName = (article: Article): string => {
    if (typeof article.author === "object" && article.author !== null) {
      return article.author.name || "Unknown Author";
    }

    return article.sourcePersonName || "Unknown Author";
  };

  // Helper function to get source person social links safely
  const getSocialLinks = (article: Article) => {
    return article.sourcePersonSocial || {};
  };

  // Extract unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(
      articles
        .map((article) => getCategoryName(article))
        .filter((category) => category !== "Uncategorized")
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground">Manage all your news articles</p>
        </div>
        <Button asChild>
          <Link
            href="/admin/articles/new"
            className="flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Article</span>
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({articles.length})</CardTitle>
          <CardDescription>
            A list of all articles in your news website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading articles...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No articles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    articles.map((article) => (
                      <TableRow key={article._id}>
                        <TableCell className="font-medium">
                          <div className="max-w-[300px] truncate">
                            {getDisplayTitle(article)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDisplayCategory(article)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getAuthorName(article)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(article.status)}>
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{article.meta?.views || 0}</TableCell>
                        <TableCell>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString()
                            : new Date(article.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(article)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/admin/articles/${article._id}/edit`}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(article._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} articles
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Article Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Article Preview</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Preview of the selected article
            </DialogDescription>
          </DialogHeader>

          {selectedArticle && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={getStatusBadge(selectedArticle.status)}>
                  {selectedArticle.status}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {selectedArticle.publishedAt
                    ? `Published: ${new Date(
                        selectedArticle.publishedAt
                      ).toLocaleDateString()}`
                    : `Created: ${new Date(
                        selectedArticle.createdAt
                      ).toLocaleDateString()}`}
                </div>
              </div>

              {selectedArticle.featuredImage && (
                <img
                  src={selectedArticle.featuredImage}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div>
                <h2 className="text-2xl font-bold">
                  {getDisplayTitle(selectedArticle)}
                </h2>
                {selectedArticle.excerpt && (
                  <p className="text-muted-foreground mt-2">
                    {selectedArticle.excerpt}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Content</h3>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>

              {selectedArticle.contentHi && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Content (Hindi)
                  </h3>
                  <div className="prose max-w-none whitespace-pre-wrap">
                    {selectedArticle.contentHi}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Article Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {getDisplayCategory(selectedArticle)}
                    </p>
                    <p>
                      <span className="font-medium">Author:</span>{" "}
                      {getAuthorName(selectedArticle)}
                    </p>
                    <p>
                      <span className="font-medium">Views:</span>{" "}
                      {selectedArticle.meta?.views || 0}
                    </p>
                    <p>
                      <span className="font-medium">Likes:</span>{" "}
                      {selectedArticle.meta?.likes || 0}
                    </p>
                    <p>
                      <span className="font-medium">Shares:</span>{" "}
                      {selectedArticle.meta?.shares || 0}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Social Media Links</h4>
                  <div className="space-y-1 text-sm">
                    {getSocialLinks(selectedArticle).twitter && (
                      <p>
                        <span className="font-medium">Twitter:</span>{" "}
                        {getSocialLinks(selectedArticle).twitter}
                      </p>
                    )}
                    {getSocialLinks(selectedArticle).facebook && (
                      <p>
                        <span className="font-medium">Facebook:</span>{" "}
                        {getSocialLinks(selectedArticle).facebook}
                      </p>
                    )}
                    {getSocialLinks(selectedArticle).instagram && (
                      <p>
                        <span className="font-medium">Instagram:</span>{" "}
                        {getSocialLinks(selectedArticle).instagram}
                      </p>
                    )}
                    {getSocialLinks(selectedArticle).linkedin && (
                      <p>
                        <span className="font-medium">LinkedIn:</span>{" "}
                        {getSocialLinks(selectedArticle).linkedin}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedArticle.mediaUrls &&
                selectedArticle.mediaUrls.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Media Files</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedArticle.mediaUrls.map((url, index) => (
                        <div key={index} className="border rounded-lg p-2">
                          <p className="text-xs truncate">{url}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedArticle.cloudinaryImages &&
                selectedArticle.cloudinaryImages.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Cloudinary Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedArticle.cloudinaryImages.map((img, index) => (
                        <div key={index} className="border rounded-lg p-2">
                          <img
                            src={img.url}
                            alt={`Cloudinary ${index + 1}`}
                            className="w-full h-20 object-cover rounded mb-1"
                          />
                          <p className="text-xs truncate">{img.publicId}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
