"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Share2,
  Bookmark,
  AlertTriangle,
  Search,
  Calendar,
  Eye,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Filter,
  ChevronRight,
  ExternalLink,
  Verified,
  Users,
  BarChart,
  FileText,
  Video,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
// import { Progress } from "@/components/ui/progress"
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { GoogleAdSense } from "@/components/public/google-adsense";

interface Evidence {
  type: string;
  url: string;
  title: string;
  description?: string;
  timestamp?: string;
  _id?: string;
}

interface DebunkedBy {
  name: string;
  logo?: string;
  expertise?: string;
  verificationDate?: string;
  _id?: string;
}

interface VerifiedSource {
  name: string;
  url: string;
  type: string;
  credibilityScore?: number;
  _id?: string;
}

interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  _id?: string;
}

interface VisualComparison {
  original?: string;
  manipulated?: string;
  analysis?: string;
  _id?: string;
}

interface Impact {
  reach: number;
  countries: string[];
  platforms: string[];
  duration: string;
  _id?: string;
}

interface FactChecker {
  name: string;
  avatar?: string;
  expertise: string[];
  experience?: string;
  verifiedChecks: number;
  _id?: string;
}

interface FakeNewsItem {
  _id: string;
  title: string;
  titleHi: string;
  fakeClaim: string;
  fakeClaimHi: string;
  factCheck: string;
  factCheckHi: string;
  explanation: string;
  explanationHi: string;
  detailedAnalysis?: string;
  detailedAnalysisHi?: string;
  evidence: Evidence[];
  category: "political" | "health" | "technology" | "entertainment" | "social" | "other";
  severity: "low" | "medium" | "high" | "critical";
  origin: string;
  spreadPlatforms?: string[];
  debunkedBy: DebunkedBy[];
  debunkedAt: string;
  verifiedSources: VerifiedSource[];
  tags: string[];
  relatedReports?: string[];
  timeline?: TimelineEvent[];
  visualComparison?: VisualComparison;
  impact?: Impact;
  preventionTips?: string[];
  factChecker?: FactChecker;
  views: number;
  shares: number;
  helpfulVotes: number;
  status: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    reports: FakeNewsItem[];
    pagination: Pagination;
  };
}

const FakeNewsPage = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [fakeNewsData, setFakeNewsData] = useState<FakeNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch fake news data from API
  const fetchFakeNews = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/admin/fake-news/public?page=${page}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setFakeNewsData(data.data.reports);
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
      } else {
        console.error('API Error:', data.message);
        // Fallback to sample data if API fails
        setFakeNewsData(getSampleFakeNews());
        setPagination({
          total: 3,
          page: 1,
          limit: 5,
          pages: 1,
        });
      }
    } catch (error) {
      console.error('Error fetching fake news:', error);
      // Fallback to sample data
      setFakeNewsData(getSampleFakeNews());
      setPagination({
        total: 3,
        page: 1,
        limit: 5,
        pages: 1,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Sample data fallback
  const getSampleFakeNews = (): FakeNewsItem[] => {
    return [
      {
        _id: "1",
        title: "AI Generated Video of PM Modi Goes Viral",
        titleHi: "पीएम मोदी का AI जनरेटेड वीडियो वायरल",
        fakeClaim: "PM Modi announced free electricity for all Indians",
        fakeClaimHi: "पीएम मोदी ने सभी भारतीयों के लिए मुफ्त बिजली की घोषणा की",
        factCheck: "Completely False - AI Generated Deepfake",
        factCheckHi: "पूरी तरह से झूठ - AI जनरेटेड डीपफेक",
        explanation: "The viral video is a deepfake created using AI technology. The PMO has confirmed that no such announcement was made. The video uses manipulated audio and visuals.",
        explanationHi: "वायरल वीडियो AI तकनीक का उपयोग करके बनाया गया एक डीपफेक है। पीएमओ ने पुष्टि की है कि ऐसी कोई घोषणा नहीं की गई थी। वीडियो में हेरफेर किए गए ऑडियो और विजुअल का उपयोग किया गया है।",
        evidence: [
          { type: "video", url: "#", title: "Original Video Analysis" },
          { type: "document", url: "#", title: "PMO Official Statement" },
          { type: "image", url: "#", title: "Forensic Analysis Report" },
        ],
        category: "political",
        severity: "high",
        origin: "Social Media (WhatsApp, Facebook)",
        debunkedBy: [{ name: "AltNews" }, { name: "Factly" }, { name: "BBC Reality Check" }],
        debunkedAt: "2024-01-15T00:00:00.000Z",
        verifiedSources: [
          { name: "PIB Fact Check", url: "#", type: "government" },
          { name: "Alt News", url: "#", type: "fact_checker" },
          { name: "India Today Fact Check", url: "#", type: "media" },
        ],
        tags: ["Deepfake", "AI", "Political", "Viral Video"],
        relatedReports: [],
        views: 24500,
        shares: 890,
        helpfulVotes: 0,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  useEffect(() => {
    fetchFakeNews(1);
  }, [fetchFakeNews]);

  const categories = [
    { id: "all", label: "All", count: pagination.total, icon: Filter },
    { id: "political", label: "Political", count: 0, icon: Users },
    { id: "health", label: "Health", count: 0, icon: Verified },
    { id: "technology", label: "Technology", count: 0, icon: TrendingUp },
    { id: "social", label: "Social", count: 0, icon: MessageCircle },
    { id: "entertainment", label: "Entertainment", count: 0, icon: Video },
  ];

  const severityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };

  const severityLabels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical Risk",
  };

  const toggleBookmark = (id: string) => {
    if (bookmarkedItems.includes(id)) {
      setBookmarkedItems(bookmarkedItems.filter((itemId) => itemId !== id));
    } else {
      setBookmarkedItems([...bookmarkedItems, id]);
    }
  };

  const handleShare = (item: FakeNewsItem) => {
    const shareText =
      language === "hi"
        ? `${item.titleHi} - सत्यापित तथ्य`
        : `${item.title} - Verified Facts`;
    const url = window.location.href + `?id=${item._id}`;

    if (navigator.share) {
      navigator.share({
        title: language === "hi" ? "तथ्य-जाँच रिपोर्ट" : "Fact-Check Report",
        text: shareText,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${url}`);
      alert(language === "hi" ? "लिंक कॉपी किया गया!" : "Link copied!");
    }
  };

  const filteredData = fakeNewsData.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory)
      return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.fakeClaim.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchFakeNews(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">
                {language === "hi" ? "फेक न्यूज डिबंकर" : "Fake News Debunker"}
              </h1>
            </div>
            <p className="text-xl opacity-90 mb-8">
              {language === "hi"
                ? "सत्य को झूठ से अलग करें। विश्वसनीय तथ्य-जाँच और सबूत-आधारित विश्लेषण।"
                : "Separating truth from fiction. Reliable fact-checking and evidence-based analysis."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">{pagination.total}+</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "तथ्य-जाँचे गए" : "Claims Fact-Checked"}
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "सटीकता दर" : "Accuracy Rate"}
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "मॉनिटरिंग" : "Monitoring"}
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "विशेषज्ञ" : "Experts"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "hi" ? "खोजें" : "Search"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={
                      language === "hi"
                        ? "फेक न्यूज खोजें..."
                        : "Search fake news..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "hi" ? "श्रेणियाँ" : "Categories"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Button
                        key={cat.id}
                        variant={
                          activeCategory === cat.id ? "default" : "ghost"
                        }
                        className="w-full justify-start"
                        onClick={() => setActiveCategory(cat.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="flex-1 text-left">{cat.label}</span>
                        <Badge variant="secondary">{cat.count}</Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* How to Verify */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "hi" ? "कैसे जांचें?" : "How to Verify?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    {language === "hi"
                      ? "स्रोत की प्रामाणिकता जांचें"
                      : "Check source authenticity"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    {language === "hi"
                      ? "आधिकारिक बयान देखें"
                      : "Look for official statements"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    {language === "hi"
                      ? "विशेषज्ञों से सलाह लें"
                      : "Consult with experts"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    {language === "hi"
                      ? "शब्दों की पड़ताल करें"
                      : "Verify word-by-word"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Ad Space */}
            <div className="hidden lg:block">
              <GoogleAdSense
                adSlot="300x250_fake_news_sidebar"
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {language === "hi" ? "हालिया फेक न्यूज" : "Recent Fake News"}
                </h2>
                <p className="text-gray-600">
                  {language === "hi"
                    ? `${filteredData.length} आइटम मिले (${pagination.total} total)`
                    : `${filteredData.length} items found (${pagination.total} total)`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                >
                  English
                </Button>
                <Button
                  variant={language === "hi" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("hi")}
                >
                  हिंदी
                </Button>
              </div>
            </div>

            {/* Ad - Top */}
            <div className="mb-6">
              <GoogleAdSense
                adSlot="728x90_fake_news_top"
                adFormat="horizontal"
                fullWidthResponsive={true}
                className="w-full"
              />
            </div>

            {/* Fake News List */}
            {loading ? (
              renderSkeletons()
            ) : filteredData.length > 0 ? (
              <>
                <div className="space-y-6">
                  {filteredData.map((item) => (
                    <Card key={item._id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={severityColors[item.severity]}>
                                {severityLabels[item.severity]}
                              </Badge>
                              <Badge variant="outline">
                                {item.category.charAt(0).toUpperCase() +
                                  item.category.slice(1)}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl">
                              {language === "hi" ? item.titleHi : item.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Debunked on{" "}
                                {new Date(item.debunkedAt).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <Eye className="h-4 w-4" />
                              <span>{item.views.toLocaleString()} views</span>
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookmark(item._id)}
                              className={
                                bookmarkedItems.includes(item._id)
                                  ? "text-yellow-500"
                                  : ""
                              }
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  bookmarkedItems.includes(item._id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(item)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Fake Claim */}
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-red-800 mb-1">
                                {language === "hi" ? "झूठा दावा" : "False Claim"}
                              </h3>
                              <p className="text-red-700">
                                {language === "hi"
                                  ? item.fakeClaimHi
                                  : item.fakeClaim}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Fact Check */}
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-green-800 mb-1">
                                {language === "hi"
                                  ? "सत्यापित तथ्य"
                                  : "Verified Fact"}
                              </h3>
                              <p className="text-green-700">
                                {language === "hi"
                                  ? item.factCheckHi
                                  : item.factCheck}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div>
                          <h3 className="font-semibold mb-2">
                            {language === "hi"
                              ? "विस्तृत व्याख्या"
                              : "Detailed Explanation"}
                          </h3>
                          <p className="text-gray-700">
                            {language === "hi"
                              ? item.explanationHi
                              : item.explanation}
                          </p>
                        </div>

                        {/* Evidence */}
                        {item.evidence && item.evidence.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3">
                              {language === "hi" ? "सबूत" : "Evidence"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.evidence.map((evidence, idx) => (
                                <Button
                                  key={evidence._id || idx}
                                  variant="outline"
                                  className="justify-start h-auto py-3"
                                  asChild
                                >
                                  <Link href={evidence.url} target="_blank">
                                    <div className="text-left">
                                      <div className="font-medium">
                                        {evidence.title}
                                      </div>
                                      <div className="text-xs text-gray-500 capitalize">
                                        {evidence.type}
                                      </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 ml-auto" />
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verified Sources */}
                        {item.verifiedSources && item.verifiedSources.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3">
                              {language === "hi"
                                ? "प्रामाणिक स्रोत"
                                : "Verified Sources"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {item.verifiedSources.map((source, idx) => (
                                <Badge
                                  key={source._id || idx}
                                  variant="outline"
                                  className="gap-1"
                                >
                                  <Verified className="h-3 w-3" />
                                  {source.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">
                              {language === "hi" ? "टैग" : "Tags"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Debunked By */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              {language === "hi"
                                ? "डिबंक किया गया"
                                : "Debunked By"}
                            </h4>
                            <div className="flex items-center gap-2">
                              {item.debunkedBy.map((org, idx) => (
                                <span key={org._id || idx} className="text-sm text-gray-600">
                                  {org.name}
                                  {idx < item.debunkedBy.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {language === "hi" ? "उत्पत्ति" : "Origin"}
                            </div>
                            <div className="text-sm font-medium">
                              {item.origin}
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-gray-50 flex justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            {item.helpfulVotes} {language === "hi" ? "सहायक" : "Helpful"}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            {item.shares} {language === "hi" ? "शेयर" : "Shares"}
                          </Button>
                        </div>
                        <Link href={`/fake-news/${item._id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            {language === "hi"
                              ? "पूरी रिपोर्ट देखें"
                              : "View Full Report"}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-2">Previous</span>
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-10 h-10 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {pagination.pages > 5 && currentPage < pagination.pages - 2 && (
                        <>
                          <span className="mx-1">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.pages)}
                            className="w-10 h-10 p-0"
                          >
                            {pagination.pages}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                    >
                      <span className="mr-2">Next</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {language === "hi"
                      ? "कोई परिणाम नहीं मिला"
                      : "No Results Found"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "hi"
                      ? "खोजे गए शब्दों से मेल खाने वाली कोई फेक न्यूज नहीं मिली।"
                      : "No fake news found matching your search terms."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ad - Bottom */}
            <div className="mt-6">
              <GoogleAdSense
                adSlot="728x90_fake_news_bottom"
                adFormat="horizontal"
                fullWidthResponsive={true}
                className="w-full"
              />
            </div>

            {/* Submit Section */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  {language === "hi"
                    ? "फेक न्यूज रिपोर्ट करें"
                    : "Report Fake News"}
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  {language === "hi"
                    ? "क्या आपको कोई संदिग्ध जानकारी मिली है? हमारी टीम उसकी तथ्य-जाँच करेगी।"
                    : "Found something suspicious? Our team will fact-check it for you."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="gap-2">
                    <FileText className="h-5 w-5" />
                    {language === "hi"
                      ? "ऑनलाइन रिपोर्ट करें"
                      : "Report Online"}
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Video className="h-5 w-5" />
                    {language === "hi"
                      ? "वीडियो गाइड देखें"
                      : "Watch Video Guide"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How We Work Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === "hi" ? "हम कैसे काम करते हैं" : "How We Work"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">
                  {language === "hi" ? "पहचान" : "Identification"}
                </h3>
                <p className="text-gray-600">
                  {language === "hi"
                    ? "सोशल मीडिया, व्हाट्सएप फॉरवर्ड्स और अन्य प्लेटफॉर्म से संभावित फेक न्यूज की पहचान करना।"
                    : "Identifying potential fake news from social media, WhatsApp forwards, and other platforms."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">
                  {language === "hi" ? "विश्लेषण" : "Analysis"}
                </h3>
                <p className="text-gray-600">
                  {language === "hi"
                    ? "विज़ुअल, ऑडियो और टेक्स्ट का फोरेंसिक विश्लेषण, स्रोत सत्यापन और तथ्य जांच।"
                    : "Forensic analysis of visuals, audio and text, source verification and fact-checking."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Verified className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">
                  {language === "hi" ? "सत्यापन" : "Verification"}
                </h3>
                <p className="text-gray-600">
                  {language === "hi"
                    ? "विशेषज्ञों और आधिकारिक स्रोतों से सत्यापन और सबूतों के साथ रिपोर्ट प्रकाशित करना।"
                    : "Verification with experts and official sources, publishing reports with evidence."}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default FakeNewsPage;