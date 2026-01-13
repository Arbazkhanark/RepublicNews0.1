"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Tag, ThumbsUp, ThumbsDown, Share2, Bookmark, Search, ChevronRight, Menu, X, Home, TrendingUp, Newspaper, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { GoogleAdSense } from "./google-adsense";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Opinion {
  _id: string;
  title: string;
  titleHi: string;
  content: string;
  contentHi: string;
  topic: string;
  tags: string[];
  authorId: string | { _id: string; name: string; email: string; profileImage?: string };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  views: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export default function NewsHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [filteredOpinions, setFilteredOpinions] = useState<Opinion[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter opinions when search or topic changes
  useEffect(() => {
    let filtered = opinions.filter(opinion => opinion.status === 'approved');
    
    if (topicFilter !== "all") {
      filtered = filtered.filter(opinion => opinion.topic === topicFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(opinion =>
        opinion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cleanContentForPreview(opinion.content, 500).toLowerCase().includes(searchTerm.toLowerCase()) ||
        opinion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredOpinions(filtered);
  }, [opinions, searchTerm, topicFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch opinions
      const opinionsResponse = await fetch("/api/admin/opinions");
      if (opinionsResponse.ok) {
        const opinionsData = await opinionsResponse.json();
        const approvedOpinions = opinionsData.opinions?.filter((o: Opinion) => o.status === 'approved') || [];
        setOpinions(opinionsData.opinions || []);
        setFilteredOpinions(approvedOpinions);
      }

      // Fetch authors
      const authorsResponse = await fetch("/api/authors");
      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json();
        setAuthors(authorsData.authors || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load news articles");
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get time since publication
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  // Function to extract topics from opinions
  const getUniqueTopics = () => {
    const topics = opinions
      .filter(opinion => opinion.status === 'approved')
      .map(opinion => opinion.topic)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return ["all", ...topics];
  };

  // Function to get author details
  const getAuthor = (authorId: string | { _id: string; name: string; email: string; profileImage?: string }) => {
    if (typeof authorId === 'object') {
      return authorId;
    }
    return authors.find(author => author._id === authorId);
  };

  // Function to extract first image from content
  const extractFirstImage = (content: string) => {
    const imgRegex = /\[IMAGE:(.+?)\]/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  };

  // Function to handle like
  const handleLike = async (opinionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/opinions/${opinionId}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success("Liked!");
        fetchData();
      }
    } catch (error) {
      console.error("Error liking:", error);
      toast.error("Failed to like");
    }
  };

  // Function to handle dislike
  const handleDislike = async (opinionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/opinions/${opinionId}/dislike`, {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success("Disliked!");
        fetchData();
      }
    } catch (error) {
      console.error("Error disliking:", error);
      toast.error("Failed to dislike");
    }
  };

  // Function to share article
  const handleShare = async (opinion: Opinion, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: opinion.title,
          text: cleanContentForPreview(opinion.content, 100),
          url: `${window.location.origin}/opinion/${opinion._id}`,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/opinion/${opinion._id}`);
      toast.success("Link copied to clipboard!");
    }
  };

  // Function to navigate to single opinion page
  const navigateToOpinion = (opinionId: string) => {
    router.push(`/opinion/${opinionId}`);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="border-b py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="py-8">
            {/* Featured News Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* News Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <header className="border-b">
        <div className="container mx-auto px-4">

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/">
                      <Home className="h-5 w-5 mr-2" />
                      Home
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => setTopicFilter("all")}>
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Trending
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/opinions">
                      <Newspaper className="h-5 w-5 mr-2" />
                      All Opinions
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="hidden md:block border-t">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" className="rounded-none hover:bg-gray-100 hover:text-red-600 px-4 py-2" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" className="rounded-none hover:bg-gray-100 hover:text-red-600 px-4 py-2" onClick={() => setTopicFilter("all")}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </Button>
                <Button variant="ghost" className="rounded-none hover:bg-gray-100 hover:text-red-600 px-4 py-2" asChild>
                  <Link href="/opinions">
                    <Newspaper className="h-4 w-4 mr-2" />
                    All Opinions
                  </Link>
                </Button>
                {getUniqueTopics().slice(1, 6).map((topic) => (
                  <Button
                    key={topic}
                    variant="ghost"
                    className={`rounded-none hover:bg-gray-100 hover:text-red-600 px-4 py-2 ${
                      topicFilter === topic ? 'text-red-600 font-semibold' : ''
                    }`}
                    onClick={() => setTopicFilter(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <Clock className="inline h-4 w-4 mr-1" />
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* First Ad */}
        {/* <div className="my-6 flex justify-center">
          <GoogleAdSense
            adSlot="0987654321"
            adFormat="leaderboard"
            className="max-w-[728px] w-full h-[90px]"
          />
        </div> */}

        {/* Featured Story */}
        {filteredOpinions.length > 0 && (
          <div className="mb-8 border-b pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Featured Story */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <Badge className="bg-red-600 text-white rounded-none mb-2 px-3 py-1">FEATURED</Badge>
                  <Badge className="bg-gray-800 text-white rounded-none mb-2 ml-2 px-3 py-1">
                    {filteredOpinions[0].topic}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900">
                  {filteredOpinions[0].title}
                </h1>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <span className="text-sm">
                    By {typeof filteredOpinions[0].authorId === 'object' ? filteredOpinions[0].authorId.name : getAuthor(filteredOpinions[0].authorId)?.name || "Staff Reporter"}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{formatDate(filteredOpinions[0].createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{getTimeSince(filteredOpinions[0].createdAt)}</span>
                </div>

                {/* Ad within featured article content */}
                <div className="my-6 flex justify-center">
                  <GoogleAdSense
                    adSlot="0987654321"
                    adFormat="rectangle"
                    className="max-w-[300px] w-full h-[250px]"
                  />
                </div>

                {/* Extract and display first image */}
                {(() => {
                  const firstImage = extractFirstImage(filteredOpinions[0].content);
                  if (firstImage) {
                    return (
                      <div className="mb-6">
                        <img
                          src={firstImage}
                          alt={filteredOpinions[0].title}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {typeof filteredOpinions[0].authorId === 'object' ? filteredOpinions[0].authorId.name : getAuthor(filteredOpinions[0].authorId)?.name || "Photo"} / NewsDaily
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="prose max-w-none mb-6">
                  <div className="text-lg leading-relaxed text-gray-700" dangerouslySetInnerHTML={{
                    __html: formatPreviewContent(cleanContentForPreview(filteredOpinions[0].content, 400))
                  }} />
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-none px-6"
                    onClick={() => navigateToOpinion(filteredOpinions[0]._id)}
                  >
                    Read Full Story
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleLike(filteredOpinions[0]._id, e)}
                      className="flex items-center gap-1 text-gray-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{filteredOpinions[0].likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDislike(filteredOpinions[0]._id, e)}
                      className="flex items-center gap-1 text-gray-600"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{filteredOpinions[0].dislikes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShare(filteredOpinions[0], e)}
                      className="text-gray-600"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Top Stories Sidebar */}
              <div className="border-l pl-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b text-gray-900">TOP STORIES</h2>
                <div className="space-y-6">
                  {filteredOpinions.slice(1, 5).map((opinion, index) => (
                    <div 
                      key={opinion._id} 
                      className="border-b pb-4 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => navigateToOpinion(opinion._id)}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl font-bold text-gray-300 mr-3">{index + 1}</span>
                        <div>
                          <Badge className="bg-gray-100 text-gray-800 rounded-none text-xs mb-1 px-2">
                            {opinion.topic}
                          </Badge>
                          <h3 className="font-bold text-gray-900 mb-1 hover:text-red-600">
                            {opinion.title}
                          </h3>
                          <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{
                            __html: formatPreviewContent(cleanContentForPreview(opinion.content, 80))
                          }} />
                          <div className="flex items-center text-xs text-gray-500 mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeSince(opinion.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar Ad */}
                <div className="my-8">
                  <GoogleAdSense
                    adSlot="0987654321"
                    adFormat="rectangle"
                    className="w-full h-[250px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ad between sections */}
        <div className="my-8 flex justify-center">
          <GoogleAdSense
            adSlot="0987654321"
            adFormat="banner"
            className="max-w-[468px] w-full h-[60px]"
          />
        </div>

        {/* Latest News Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className="text-2xl font-bold text-gray-900">LATEST NEWS</h2>
            <div className="flex gap-2">
              {getUniqueTopics().slice(1, 6).map((topic) => (
                <Button
                  key={topic}
                  variant="ghost"
                  className={`rounded-none px-3 py-1 text-sm ${
                    topicFilter === topic 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setTopicFilter(topic)}
                >
                  {topic}
                </Button>
              ))}
              <Button
                variant="ghost"
                className={`rounded-none px-3 py-1 text-sm ${
                  topicFilter === "all" 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setTopicFilter("all")}
              >
                All
              </Button>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredOpinions.slice(1).map((opinion, index) => {
              const author = typeof opinion.authorId === 'object' ? opinion.authorId : getAuthor(opinion.authorId);
              const imageFromContent = extractFirstImage(opinion.content);
              
              // Insert ad after 4th article
              if (index === 3) {
                return (
                  <>
                    {/* Article */}
                    <div 
                      key={opinion._id} 
                      className="border group hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigateToOpinion(opinion._id)}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        {imageFromContent ? (
                          <img
                            src={imageFromContent}
                            alt={opinion.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                            <Newspaper className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-600 text-white rounded-none text-xs px-2">
                            {opinion.topic}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight hover:text-red-600">
                          {opinion.title}
                        </h3>
                        
                        <div className="text-gray-600 text-sm mb-3 line-clamp-3" dangerouslySetInnerHTML={{
                          __html: formatPreviewContent(cleanContentForPreview(opinion.content, 120))
                        }} />

                        {/* Author and Date */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            {author?.profileImage ? (
                              <img
                                src={author.profileImage}
                                alt={author.name}
                                className="h-5 w-5 rounded-full mr-2"
                              />
                            ) : (
                              <div className="h-5 w-5 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                <span className="text-xs">{author?.name?.charAt(0) || "A"}</span>
                              </div>
                            )}
                            <span>{author?.name || "Staff Reporter"}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeSince(opinion.createdAt)}
                          </div>
                        </div>

                        {/* Tags */}
                        {opinion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {opinion.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="rounded-none text-xs px-2 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t pt-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleLike(opinion._id, e)}
                              className="flex items-center gap-1 text-gray-600 hover:text-red-600 p-1"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-xs">{opinion.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDislike(opinion._id, e)}
                              className="flex items-center gap-1 text-gray-600 hover:text-red-600 p-1"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span className="text-xs">{opinion.dislikes}</span>
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleShare(opinion, e)}
                              className="text-gray-600 hover:text-red-600 p-1"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600 p-1">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ad after 4th article */}
                    <div className="md:col-span-2 lg:col-span-4 flex justify-center my-6">
                      <GoogleAdSense
                        adSlot="0987654321"
                        adFormat="leaderboard"
                        className="max-w-[728px] w-full h-[90px]"
                      />
                    </div>
                  </>
                );
              }

              return (
                <div 
                  key={opinion._id} 
                  className="border group hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToOpinion(opinion._id)}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    {imageFromContent ? (
                      <img
                        src={imageFromContent}
                        alt={opinion.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-600 text-white rounded-none text-xs px-2">
                        {opinion.topic}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight hover:text-red-600">
                      {opinion.title}
                    </h3>
                    
                    <div className="text-gray-600 text-sm mb-3 line-clamp-3" dangerouslySetInnerHTML={{
                      __html: formatPreviewContent(cleanContentForPreview(opinion.content, 120))
                    }} />

                    {/* Author and Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        {author?.profileImage ? (
                          <img
                            src={author.profileImage}
                            alt={author.name}
                            className="h-5 w-5 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-5 w-5 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs">{author?.name?.charAt(0) || "A"}</span>
                          </div>
                        )}
                        <span>{author?.name || "Staff Reporter"}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeSince(opinion.createdAt)}
                      </div>
                    </div>

                    {/* Tags */}
                    {opinion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {opinion.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="rounded-none text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t pt-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleLike(opinion._id, e)}
                          className="flex items-center gap-1 text-gray-600 hover:text-red-600 p-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xs">{opinion.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDislike(opinion._id, e)}
                          className="flex items-center gap-1 text-gray-600 hover:text-red-600 p-1"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span className="text-xs">{opinion.dislikes}</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleShare(opinion, e)}
                          className="text-gray-600 hover:text-red-600 p-1"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600 p-1">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ad at the end of news grid */}
          {filteredOpinions.length > 4 && (
            <div className="my-10 flex justify-center">
              <GoogleAdSense
                adSlot="0987654321"
                adFormat="rectangle"
                className="max-w-[336px] w-full h-[280px]"
              />
            </div>
          )}

          {/* No Results */}
          {filteredOpinions.length === 0 && (
            <div className="text-center py-12 border">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Newspaper className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || topicFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "No approved articles available yet"}
              </p>
              {(searchTerm || topicFilter !== "all") && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setTopicFilter("all");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-none"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Ad before Editor's Picks */}
        <div className="my-8 flex justify-center">
          <GoogleAdSense
            adSlot="0987654321"
            adFormat="banner"
            className="max-w-[468px] w-full h-[60px]"
          />
        </div>

        {/* Editor's Picks Section */}
        {filteredOpinions.length > 5 && (
          <div className="mb-8 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b text-gray-900">EDITOR'S PICKS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredOpinions.slice(1, 4).map((opinion) => (
                <div 
                  key={opinion._id} 
                  className="bg-white p-4 border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigateToOpinion(opinion._id)}
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-red-600 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">EP</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 hover:text-red-600">
                        {opinion.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By {typeof opinion.authorId === 'object' ? opinion.authorId.name : getAuthor(opinion.authorId)?.name || "Editorial Team"}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-700 mb-3" dangerouslySetInnerHTML={{
                    __html: formatPreviewContent(cleanContentForPreview(opinion.content, 150))
                  }} />
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 p-0">
                    Read More →
                  </Button>
                </div>
              ))}
            </div>

            {/* Ad in Editor's Picks section */}
            <div className="my-8 flex justify-center">
              <GoogleAdSense
                adSlot="0987654321"
                adFormat="rectangle"
                className="max-w-[300px] w-full h-[250px]"
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">
                NEWS<span className="text-red-500">DAILY</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted source for the latest news, analysis, and opinion pieces from around the world.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 rounded-none">
                  About Us
                </Button>
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 rounded-none">
                  Contact
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">QUICK LINKS</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/opinions" className="hover:text-white">All Opinions</Link></li>
                <li><a href="#" className="hover:text-white">Politics</a></li>
                <li><a href="#" className="hover:text-white">Business</a></li>
              </ul>
            </div>

            {/* Topics */}
            <div>
              <h4 className="font-bold mb-4">TOPICS</h4>
              <div className="flex flex-wrap gap-2">
                {getUniqueTopics().slice(1, 7).map((topic) => (
                  <Badge key={topic} variant="secondary" className="bg-gray-800 text-gray-300 rounded-none">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-4">NEWSLETTER</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for daily updates.
              </p>
              <div className="flex">
                <Input 
                  placeholder="Your email" 
                  className="rounded-none border-gray-700 bg-gray-800 text-white"
                />
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          {/* Ad before footer bottom */}
          <div className="my-6 flex justify-center">
            <GoogleAdSense
              adSlot="0987654321"
              adFormat="rectangle"
              className="max-w-[728px] w-full h-[90px]"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} NewsDaily. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
              <a href="#" className="hover:text-white">Careers</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full h-12 w-12 shadow-lg">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 w-12 shadow-lg">
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Helper function to clean content for preview
function cleanContentForPreview(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // First, remove all markdown images and special templates
  let cleaned = content
    .replace(/\[IMAGE:(.+?)\]/g, '')
    .replace(/\[CAPTION:(.+?)\]/g, '')
    .replace(/\[([A-Z\s'_-]+):(.+?)\]/g, '')
    .replace(/\n/g, ' ')
    .trim();
  
  // Truncate to max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength) + '...';
  }
  
  return cleaned;
}

// Helper function to format preview content with basic HTML formatting
function formatPreviewContent(content: string): string {
  if (!content) return '';
  
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
}