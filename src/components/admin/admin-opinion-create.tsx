"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Eye, Upload, Tag, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export default function NewOpinionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    content: "",
    topic: "",
    tags: [] as string[],
    status: "draft" as "draft" | "pending",
  });

  const [newTag, setNewTag] = useState("");

  // Fetch authors on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
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
      toast.error("Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async (status: "draft" | "pending" = "draft") => {
    try {
      setSaving(true);

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!formData.content.trim()) {
        toast.error("Content is required");
        return;
      }
      if (!formData.topic.trim()) {
        toast.error("Topic is required");
        return;
      }

      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error("Authentication token not found");
        router.push("/admin/login");
        return;
      }

      const requestBody = {
        title: formData.title,
        imageUrl: formData.imageUrl || undefined,
        content: formData.content,
        topic: formData.topic,
        tags: formData.tags,
        status: status,
      };

      const response = await fetch("/api/admin/opinions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      toast.success(
        `Opinion ${
          status === "draft" ? "saved as draft" : "submitted for approval"
        } successfully`
      );
      router.push("/admin/opinions");
    } catch (error) {
      console.error("Error creating opinion:", error);
      toast.error("Failed to create opinion");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/opinions")}
              className="transition-smooth"
              disabled={saving}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                New Article
              </h1>
              <p className="text-muted-foreground mt-1">
                Create a new opinion article
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              className="transition-smooth"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={() => handleSave("pending")}
              className="bg-primary hover:bg-primary/90 transition-smooth"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {saving ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter article title..."
                    className="mt-2"
                    disabled={saving}
                  />
                </div>

                <div>
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => handleInputChange("topic", e.target.value)}
                    placeholder="e.g., Environment, Technology, Politics"
                    className="mt-2"
                    disabled={saving}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    placeholder="Write your article content here..."
                    className="mt-2 min-h-[400px]"
                    disabled={saving}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "pending") =>
                      handleInputChange("status", value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Draft: Save privately | Pending: Submit for admin approval
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      handleInputChange("imageUrl", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="mt-2"
                    disabled={saving}
                  />
                </div>

                {formData.imageUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full transition-smooth"
                  disabled={saving}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  Note: Currently supports image URLs. File upload coming soon.
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={handleKeyPress}
                    disabled={saving}
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    disabled={saving}
                  >
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => !saving && removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                {formData.tags.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add tags to categorize your opinion
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Bottom Bar for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              className="flex-1 transition-smooth"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              {saving ? "Saving..." : "Draft"}
            </Button>
            <Button
              onClick={() => handleSave("pending")}
              className="flex-1 bg-primary hover:bg-primary/90 transition-smooth"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {saving ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
