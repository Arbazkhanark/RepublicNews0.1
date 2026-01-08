"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Share,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: Author;
  opinionId: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

interface Opinion {
  _id: string;
  title: string;
  imageUrl?: string;
  content: string;
  topic: string;
  tags: string[];
  authorId: Author | string;
  status: "approved" | "pending" | "rejected" | "draft";
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export default function SingleOpinionPage() {
  const params = useParams();
  const router = useRouter();
  const opinionId = params.id as string;

  const [opinion, setOpinion] = useState<Opinion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userInteractions, setUserInteractions] = useState<{
    [opinionId: string]: "liked" | "disliked" | null;
  }>({});
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const fetchOpinion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public/opinion/${opinionId}/like`);

      if (!response.ok) {
        throw new Error("Failed to fetch opinion");
      }

      const data = await response.json();
      setOpinion(data.opinion);
    } catch (error) {
      console.error("Error fetching opinion:", error);
      toast.error("Failed to load opinion");
    } finally {
      setLoading(false);
    }
  }, [opinionId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/opinion/${opinionId}/comments`);

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [opinionId]);

  useEffect(() => {
    if (opinionId) {
      fetchOpinion();
      fetchComments();
      // Load user interactions and current user
      const savedInteractions = localStorage.getItem(
        "user-opinion-interactions"
      );
      const token = localStorage.getItem("admin-token");
      const userData = localStorage.getItem("user-data");

      if (savedInteractions) {
        setUserInteractions(JSON.parse(savedInteractions));
      }
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else if (token) {
        // Extract user data from token if available
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setCurrentUser({
            _id: payload.userId,
            name: payload.name,
            email: payload.email,
          });
        } catch (error) {
          console.error("Error parsing token:", error);
        }
      }
    }
  }, [opinionId, fetchOpinion, fetchComments]);

  const handleLike = async () => {
    if (!opinion) return;

    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error("Please login to like opinions");
        return;
      }

      const currentInteraction = userInteractions[opinion._id];

      // Optimistic update
      setOpinion((prev) => {
        if (!prev) return null;

        let newLikes = prev.likes;
        let newDislikes = prev.dislikes;
        let newLikedBy = [...prev.likedBy];
        let newDislikedBy = [...prev.dislikedBy];

        if (currentInteraction === "liked") {
          // Remove like
          newLikes = Math.max(0, prev.likes - 1);
          newLikedBy = newLikedBy.filter((id) => id !== currentUser?._id);
        } else if (currentInteraction === "disliked") {
          // Switch from dislike to like
          newDislikes = Math.max(0, prev.dislikes - 1);
          newLikes = prev.likes + 1;
          newDislikedBy = newDislikedBy.filter((id) => id !== currentUser?._id);
          newLikedBy.push(currentUser?._id);
        } else {
          // Add new like
          newLikes = prev.likes + 1;
          newLikedBy.push(currentUser?._id);
        }

        return {
          ...prev,
          likes: newLikes,
          dislikes: newDislikes,
          likedBy: newLikedBy,
          dislikedBy: newDislikedBy,
        };
      });

      // Update user interactions
      const newInteraction = currentInteraction === "liked" ? null : "liked";
      const newUserInteractions = {
        ...userInteractions,
        [opinion._id]: newInteraction,
      };
      setUserInteractions(newUserInteractions);
      localStorage.setItem(
        "user-opinion-interactions",
        JSON.stringify(newUserInteractions)
      );

      // API call - Using PATCH with type parameter
      const response = await fetch(`/api/public/opinion/${opinion._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: newInteraction === "liked" ? "like" : "remove",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const updatedOpinion = await response.json();
      setOpinion(updatedOpinion.opinion);
      toast.success(newInteraction === "liked" ? "Liked!" : "Like removed");
    } catch (error) {
      console.error("Error liking opinion:", error);
      toast.error("Failed to update reaction");
      fetchOpinion(); // Revert on error
    }
  };

  const handleDislike = async () => {
    if (!opinion) return;

    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error("Please login to dislike opinions");
        return;
      }

      const currentInteraction = userInteractions[opinion._id];

      // Optimistic update
      setOpinion((prev) => {
        if (!prev) return null;

        let newLikes = prev.likes;
        let newDislikes = prev.dislikes;
        let newLikedBy = [...prev.likedBy];
        let newDislikedBy = [...prev.dislikedBy];

        if (currentInteraction === "disliked") {
          // Remove dislike
          newDislikes = Math.max(0, prev.dislikes - 1);
          newDislikedBy = newDislikedBy.filter((id) => id !== currentUser?._id);
        } else if (currentInteraction === "liked") {
          // Switch from like to dislike
          newLikes = Math.max(0, prev.likes - 1);
          newDislikes = prev.dislikes + 1;
          newLikedBy = newLikedBy.filter((id) => id !== currentUser?._id);
          newDislikedBy.push(currentUser?._id);
        } else {
          // Add new dislike
          newDislikes = prev.dislikes + 1;
          newDislikedBy.push(currentUser?._id);
        }

        return {
          ...prev,
          likes: newLikes,
          dislikes: newDislikes,
          likedBy: newLikedBy,
          dislikedBy: newDislikedBy,
        };
      });

      // Update user interactions
      const newInteraction =
        currentInteraction === "disliked" ? null : "disliked";
      const newUserInteractions = {
        ...userInteractions,
        [opinion._id]: newInteraction,
      };
      setUserInteractions(newUserInteractions);
      localStorage.setItem(
        "user-opinion-interactions",
        JSON.stringify(newUserInteractions)
      );

      // API call - Using PATCH with type parameter
      const response = await fetch(`/api/public/opinion/${opinion._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: newInteraction === "disliked" ? "dislike" : "remove",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update dislike");
      }

      const updatedOpinion = await response.json();
      setOpinion(updatedOpinion.opinion);
      toast.success(
        newInteraction === "disliked" ? "Disliked!" : "Dislike removed"
      );
    } catch (error) {
      console.error("Error disliking opinion:", error);
      toast.error("Failed to update reaction");
      fetchOpinion(); // Revert on error
    }
  };

  const handleEdit = () => {
    if (!opinion) return;
    router.push(`/opinions/${opinion._id}/edit`);
  };

  const handleDelete = async () => {
    if (!opinion) return;

    if (!confirm("Are you sure you want to delete this opinion?")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error("Please login to delete opinions");
        return;
      }

      const response = await fetch(`/api/public/opinion/${opinion._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete opinion");
      }

      toast.success("Opinion deleted successfully");
      router.push("/opinions");
    } catch (error) {
      console.error("Error deleting opinion:", error);
      toast.error("Failed to delete opinion");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const token = localStorage.getItem("admin-token");

      if (!token) {
        toast.error("Please login to add comments");
        return;
      }

      const userId = currentUser?._id || "anonymous";
      const userName = currentUser?.name || "Anonymous User";

      // Optimistic update
      const tempComment: Comment = {
        _id: `temp-${Date.now()}`,
        content: newComment,
        author: {
          _id: userId,
          name: userName,
          email: currentUser?.email || "",
        },
        opinionId,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setComments((prev) => [tempComment, ...prev]);
      setNewComment("");

      // API call - Temporary implementation
      // TODO: Replace with actual comment API when available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, we'll just show success and remove temp comment
      setComments((prev) =>
        prev.filter((comment) => !comment._id.startsWith("temp-"))
      );

      // Add the comment to local state (temporary until API is ready)
      const newCommentObj: Comment = {
        _id: `comment-${Date.now()}`,
        content: newComment,
        author: {
          _id: userId,
          name: userName,
          email: currentUser?.email || "",
        },
        opinionId,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setComments((prev) => [newCommentObj, ...prev]);
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      // Remove temporary comment
      setComments((prev) =>
        prev.filter((comment) => !comment._id.startsWith("temp-"))
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const userId = currentUser?._id || "anonymous";

      // Optimistic update
      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id === commentId) {
            const isLiked = comment.likedBy.includes(userId);
            return {
              ...comment,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              likedBy: isLiked
                ? comment.likedBy.filter((id) => id !== userId)
                : [...comment.likedBy, userId],
            };
          }
          return comment;
        })
      );

      // TODO: Replace with actual comment like API when available
      toast.success("Comment liked!");
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment");
      fetchComments();
    }
  };

  // Check if current user is the author of the opinion
  const isAuthor =
    opinion &&
    currentUser &&
    (typeof opinion.authorId === "string"
      ? opinion.authorId === currentUser._id
      : opinion.authorId._id === currentUser._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading opinion...</p>
        </div>
      </div>
    );
  }

  if (!opinion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Opinion not found</h2>
          <Button asChild>
            <Link href="/opinions">Back to Opinions</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getAuthorName = () => {
    if (typeof opinion.authorId === "string") {
      return currentUser?.name || "Unknown Author";
    }
    return opinion.authorId.name;
  };

  const getAuthorAvatar = () => {
    if (typeof opinion.authorId === "string") {
      return currentUser?.profileImage;
    }
    return opinion.authorId.profileImage;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/opinions">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Opinions
          </Link>
        </Button>

        {/* Opinion Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary">{opinion.topic}</Badge>
                {isAuthor && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {opinion.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={getAuthorAvatar()} />
                    <AvatarFallback>{getAuthorName().charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{getAuthorName()}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getReadTime(opinion.content)} min read</span>
                </div>
                <span>•</span>
                <span>{new Date(opinion.createdAt).toLocaleDateString()}</span>
                {opinion.status !== "approved" && (
                  <>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className={
                        opinion.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : opinion.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {opinion.status}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Featured Image */}
            {opinion.imageUrl && (
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={opinion.imageUrl}
                  alt={opinion.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                {opinion.content}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {opinion.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Engagement Actions */}
            <div className="flex items-center gap-6 border-t pt-6">
              <button
                onClick={handleLike}
                disabled={!currentUser}
                className={`flex items-center gap-2 ${
                  userInteractions[opinion._id] === "liked"
                    ? "text-green-600"
                    : "text-muted-foreground hover:text-green-600"
                } transition-colors ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={!currentUser ? "Please login to like" : ""}
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">{opinion.likes}</span>
              </button>

              <button
                onClick={handleDislike}
                disabled={!currentUser}
                className={`flex items-center gap-2 ${
                  userInteractions[opinion._id] === "disliked"
                    ? "text-red-600"
                    : "text-muted-foreground hover:text-red-600"
                } transition-colors ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={!currentUser ? "Please login to dislike" : ""}
              >
                <ThumbsDown className="w-5 h-5" />
                <span className="font-medium">{opinion.dislikes}</span>
              </button>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{comments.length} comments</span>
              </div>

              <Button variant="ghost" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div id="comments">
          <h2 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {currentUser ? (
            <Card className="mb-6">
              <CardContent className="p-6">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="mb-4"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || commentLoading}
                  >
                    {commentLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Please login to add comments
                </p>
                <Button asChild>
                  <Link href="/login">Login to Comment</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card key={comment._id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={comment.author.profileImage} />
                        <AvatarFallback>
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">
                            {comment.author.name}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-foreground mb-3">
                          {comment.content}
                        </p>
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          disabled={!currentUser}
                          className={`flex items-center gap-1 text-sm ${
                            comment.likedBy.includes(currentUser?._id || "")
                              ? "text-green-600"
                              : "text-muted-foreground hover:text-green-600"
                          } transition-colors ${
                            !currentUser ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
