"use client";

import { useState } from "react";
import { ArrowLeft, Save, Tag, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function NewOpinionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    content: "",
    topic: "",
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

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

      const userId = localStorage.getItem("user-id") || "anonymous";
      const userName = localStorage.getItem("user-name") || "Anonymous User";

      const requestBody = {
        title: formData.title,
        imageUrl: formData.imageUrl || undefined,
        content: formData.content,
        topic: formData.topic,
        tags: formData.tags,
        authorId: userId,
        authorName: userName,
        status: "pending", // User submissions need approval
      };

      const response = await fetch("/api/public/opinion", {
        method: "POST",
        headers: {
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
        "Opinion submitted successfully! It will be published after admin approval."
      );
      router.push("/opinions");
    } catch (error) {
      console.error("Error creating opinion:", error);
      toast.error("Failed to create opinion");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/opinion">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Share Your Opinion
            </h1>
            <p className="text-muted-foreground mt-1">
              Write and share your perspective with the community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Opinion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="What's your opinion about?"
                      className="mt-2"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="topic">Topic *</Label>
                    <Input
                      id="topic"
                      value={formData.topic}
                      onChange={(e) =>
                        handleInputChange("topic", e.target.value)
                      }
                      placeholder="e.g., Environment, Technology, Politics"
                      className="mt-2"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Your Thoughts *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      placeholder="Share your perspective in detail..."
                      className="mt-2 min-h-[400px]"
                      disabled={loading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <Card>
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
                      disabled={loading}
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
                    className="w-full"
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
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
                      disabled={loading}
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      disabled={loading}
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
                        onClick={() => !loading && removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  {formData.tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add tags to help others find your opinion
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• Be respectful and constructive</p>
                  <p>• Share original thoughts and perspectives</p>
                  <p>• Use appropriate language</p>
                  <p>• All opinions are reviewed before publishing</p>
                  <p>• Engage respectfully with other members</p>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
