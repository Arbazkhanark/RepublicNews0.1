"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Save,
  Loader2,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface Opinion {
  _id: string;
  title: string;
  titleHi: string;
  imageUrl?: string;
  content: string;
  contentHi: string;
  topic: string;
  tags: string[];
  authorId: Author | string;
  status: "pending" | "approved" | "rejected" | "draft";
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: string;
  updatedAt: string;
  excerpt?: string;
  readTime?: number;
}

interface ApiResponse {
  message: string;
  article?: Opinion;
  opinion?: Opinion;
  opinions?: Opinion[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Helper function to render markdown content
const renderContent = (content: string) => {
  if (!content) return "";
  
  let displayContent = content
    .replace(/\[LEAD PARAGRAPH:(.*?)\]/g, '')
    .replace(/\[KEY FACT:(.*?)\]/g, '')
    .replace(/\[QUOTE:(.*?)\]/g, '')
    .replace(/\[IMPACT:(.*?)\]/g, '')
    .replace(/\[WHAT'S NEXT:(.*?)\]/g, '')
    .replace(/\[IMAGE:(.*?)\]/g, '📷 [Image] ')
    .replace(/\[CAPTION:(.*?)\]/g, '');
  
  displayContent = displayContent
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\^\^(.*?)\^\^/g, '$1')
    .replace(/^# (.*$)/gm, '$1')
    .replace(/^## (.*$)/gm, '$1')
    .replace(/^### (.*$)/gm, '$1')
    .replace(/^- (.*$)/gm, '• $1')
    .replace(/^1\. (.*$)/gm, '1. $1')
    .replace(/> (.*$)/gm, '"$1"')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```([\s\S]*?)```/g, '')
    .replace(/---/g, '---');
  
  return displayContent;
};

// Helper function to extract clean excerpt
const getCleanExcerpt = (content: string, length: number = 150) => {
  const cleanedContent = renderContent(content);
  if (cleanedContent.length <= length) return cleanedContent;
  return cleanedContent.substring(0, length) + '...';
};

export default function OpinionsAdminPage() {
  const router = useRouter();
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "draft"
  >("all");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    titleHi: "",
    imageUrl: "",
    content: "",
    contentHi: "",
    topic: "",
    tags: [] as string[],
    status: "draft" as "draft" | "pending",
  });
  const [newTag, setNewTag] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch opinions on component mount
  useEffect(() => {
    fetchOpinions();
    fetchAuthors();
  }, [filter, pagination.page]);

  const fetchOpinions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin-token");
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter !== "all" && { status: filter }),
        lang: language,
      });

      const response = await fetch(`/api/public/opinion?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch opinions");
      }

      const data: ApiResponse = await response.json();
      setOpinions(data.opinions || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching opinions:", error);
      toast.error("Failed to load opinions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/authors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthors(data.authors || []);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  // Modal handlers
  const handleCreateOpen = () => {
    // setFormData({
    //   title: "",
    //   titleHi: "",
    //   imageUrl: "",
    //   content: "",
    //   contentHi: "",
    //   topic: "",
    //   tags: [],
    //   status: "draft",
    // });
    // setNewTag("");
    // setCreateModalOpen(true);

    router.push("/admin/opinions/new");
  };

  const handleEditOpen = (opinion: Opinion) => {
    setSelectedOpinion(opinion);
    setFormData({
      title: opinion.title,
      titleHi: opinion.titleHi || opinion.title,
      imageUrl: opinion.imageUrl || "",
      content: opinion.content,
      contentHi: opinion.contentHi || opinion.content,
      topic: opinion.topic,
      tags: opinion.tags || [],
      status: opinion.status === "draft" ? "draft" : "pending",
    });
    setNewTag("");
    setEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedOpinion(null);
  };

  // Form handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setFormLoading(true);
      const token = localStorage.getItem("admin-token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const url = editModalOpen
        ? `/api/public/opinion/${selectedOpinion?._id}/edit`
        : "/api/public/opinion";

      const method = editModalOpen ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ApiResponse = await response.json();

      if (editModalOpen) {
        setOpinions((prev) =>
          prev.map((opinion) =>
            opinion._id === selectedOpinion?._id ? data.opinion! : opinion
          )
        );
        toast.success("Opinion updated successfully");
      } else {
        setOpinions((prev) => [data.article!, ...prev]);
        toast.success("Opinion created successfully");
      }

      handleCloseModals();
      fetchOpinions(); // Refresh the list
    } catch (error) {
      console.error(
        `Error ${editModalOpen ? "updating" : "creating"} opinion:`,
        error
      );
      toast.error(`Failed to ${editModalOpen ? "update" : "create"} opinion`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Language-specific content getter
  const getContentByLanguage = (opinion: Opinion) => {
    if (language === "hi") {
      return {
        title: opinion.titleHi || opinion.title,
        content: opinion.contentHi || opinion.content,
      };
    }
    return {
      title: opinion.title,
      content: opinion.content,
    };
  };

  const filteredOpinions = opinions.filter((opinion) =>
    filter === "all" ? true : opinion.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "draft":
        return <Edit className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async (
    opinionId: string,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/public/opinion/${opinionId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data: ApiResponse = await response.json();

      setOpinions((prev) =>
        prev.map((opinion) =>
          opinion._id === opinionId ? data.opinion! : opinion
        )
      );

      toast.success(`Opinion ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (opinionId: string) => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/admin/opinions/${opinionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete opinion");
      }

      setOpinions((prev) =>
        prev.filter((opinion) => opinion._id !== opinionId)
      );
      setDeleteModalOpen(false);
      toast.success("Opinion deleted successfully");
    } catch (error) {
      console.error("Error deleting opinion:", error);
      toast.error("Failed to delete opinion");
    }
  };

  const getAuthorName = (authorId: Author | string): string => {
    if (typeof authorId === "string") {
      const author = authors.find((a) => a._id === authorId);
      return author?.name || "Unknown Author";
    }
    return authorId.name;
  };

  // Function to extract preview image from content
  const extractPreviewImage = (content: string): string | null => {
    const imageMatch = content.match(/\[IMAGE:(.*?)\]/);
    return imageMatch ? imageMatch[1] : null;
  };

  const stats = {
    total: opinions.length,
    approved: opinions.filter((o) => o.status === "approved").length,
    pending: opinions.filter((o) => o.status === "pending").length,
    rejected: opinions.filter((o) => o.status === "rejected").length,
    drafts: opinions.filter((o) => o.status === "draft").length,
    authors: authors.length,
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="mt-4 text-muted-foreground">Loading opinions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Opinion Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your opinion articles and authors
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
                className="flex items-center gap-2"
              >
                <Globe className="w-3 h-3" />
                EN
              </Button>
              <Button
                variant={language === "hi" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("hi")}
                className="flex items-center gap-2"
              >
                <Languages className="w-3 h-3" />
                HI
              </Button>
            </div>
            <Button
              onClick={handleCreateOpen}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.drafts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.authors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "approved", "pending", "rejected", "draft"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(status);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="capitalize"
              >
                {status}
              </Button>
            )
          )}
        </div>

        {/* Articles List */}
        <div className="space-y-4 mb-8">
          {filteredOpinions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No opinions found
                </h3>
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "No opinions have been created yet."
                    : `No ${filter} opinions found.`}
                </p>
                <Button onClick={handleCreateOpen} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Opinion
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOpinions.map((opinion) => {
              const content = getContentByLanguage(opinion);
              const previewImage = opinion.imageUrl || extractPreviewImage(opinion.content);
              const cleanExcerpt = getCleanExcerpt(content.content, 200);
              
              return (
                <Card
                  key={opinion._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {previewImage && (
                        <div className="w-full lg:w-48 h-32 flex-shrink-0">
                          <img
                            src={previewImage}
                            alt={content.title}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <h3 className="text-xl font-semibold line-clamp-2">
                            {content.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(opinion.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(opinion.status)}
                                {opinion.status}
                              </span>
                            </Badge>
                          </div>
                        </div>

                        {/* Clean excerpt display */}
                        <p className="text-muted-foreground line-clamp-2">
                          {cleanExcerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {getAuthorName(opinion.authorId)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(opinion.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="text-primary font-medium">{opinion.topic}</span>
                          <span>•</span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {opinion.likes}
                            </span>
                            <span className="text-red-600 flex items-center gap-1">
                              <ThumbsDown className="w-3 h-3" />
                              {opinion.dislikes}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {opinion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {opinion.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          {/* Status Management Buttons */}
                          {opinion.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(opinion._id, "approved")
                                }
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(opinion._id, "rejected")
                                }
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {opinion.status === "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(opinion._id, "pending")
                              }
                              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Set Pending
                            </Button>
                          )}

                          {opinion.status === "rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(opinion._id, "pending")
                              }
                              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Set Pending
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOpen(opinion)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOpinion(opinion);
                              setDeleteModalOpen(true);
                            }}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={createModalOpen || editModalOpen} onOpenChange={handleCloseModals}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editModalOpen ? "Edit Opinion" : "Create New Opinion"}
            </DialogTitle>
            <DialogDescription>
              {editModalOpen 
                ? "Update your opinion article in both English and Hindi" 
                : "Create a new opinion article in both English and Hindi"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="hindi">हिंदी</TabsTrigger>
              </TabsList>

              <TabsContent value="english" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter article title in English..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your article content in English..."
                      rows={10}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Featured Image URL (optional)</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hindi" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titleHi">शीर्षक *</Label>
                    <Input
                      id="titleHi"
                      value={formData.titleHi}
                      onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
                      placeholder="अंग्रेजी में शीर्षक दर्ज करें..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to auto-translate from English
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="contentHi">सामग्री *</Label>
                    <Textarea
                      id="contentHi"
                      value={formData.contentHi}
                      onChange={(e) => setFormData({ ...formData, contentHi: e.target.value })}
                      placeholder="अपनी लेख सामग्री हिंदी में लिखें..."
                      rows={10}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to auto-translate from English
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Common Fields */}
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Environment, Technology, Politics"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "pending") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Submit for Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModals}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : editModalOpen ? (
                  "Update Opinion"
                ) : (
                  "Create Opinion"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Opinion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this opinion? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedOpinion && handleDelete(selectedOpinion._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}