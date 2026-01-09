"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Star,
  BookmarkCheck,
  BookmarkX,
  Newspaper,
  Menu,
  X,
  Clock,
  Globe,
  Mic,
  Tv,
  Copy,
  Facebook,
  Twitter,
  MessageSquare,
  Linkedin,
  Send,
  Mail,
  ThumbsDown,
  Loader2,
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
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { GoogleAdSense } from "@/components/public/google-adsense";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  unhelpfulVotes: number;
  voters?: Array<{
    userId: string;
    voteType: "helpful" | "unhelpful";
    votedAt: string;
  }>;
  status: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  hasVoted?: "helpful" | "unhelpful" | null;
  isBookmarked?: boolean;
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

// Interface for bookmarked item stored in localStorage
interface BookmarkedItem {
  id: string;
  title: string;
  titleHi: string;
  factCheck: string;
  factCheckHi: string;
  category: string;
  severity: string;
  debunkedAt: string;
  bookmarkedAt: string;
}

const FakeNewsPage = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [fakeNewsData, setFakeNewsData] = useState<FakeNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "bookmarked">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReportForShare, setSelectedReportForShare] = useState<FakeNewsItem | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [clearBookmarksDialog, setClearBookmarksDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  
  // News images for background
  const newsBackgrounds = [
    "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
  ];

  const currentBackground = newsBackgrounds[Math.floor(Math.random() * newsBackgrounds.length)];

  // Quick news ticker items
  const newsTickerItems = [
    { id: 1, text: "Breaking: New AI-generated deepfake videos detected spreading on social media platforms" },
    { id: 2, text: "Fact Check: Viral claim about free electricity scheme found to be completely false" },
    { id: 3, text: "Alert: New misinformation campaign targeting health sector identified" },
    { id: 4, text: "Update: Government releases new guidelines for identifying fake news" },
    { id: 5, text: "Report: 67% increase in political misinformation during election season" },
  ];

  // Top news categories
  const topCategories = [
    { name: "Politics", count: 45, icon: Users, color: "bg-red-100 text-red-800" },
    { name: "Health", count: 32, icon: Verified, color: "bg-green-100 text-green-800" },
    { name: "Technology", count: 28, icon: TrendingUp, color: "bg-blue-100 text-blue-800" },
    { name: "Entertainment", count: 21, icon: Video, color: "bg-purple-100 text-purple-800" },
    { name: "Social Media", count: 19, icon: MessageCircle, color: "bg-pink-100 text-pink-800" },
  ];

  // Initialize user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem("fakeNewsUserId");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("fakeNewsUserId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Initialize bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("fakeNewsBookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedItems(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error("Error parsing bookmarks from localStorage:", error);
        localStorage.removeItem("fakeNewsBookmarks");
      }
    }
  }, []);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && activeTab === "all") {
          loadMoreData();
        }
      },
      { threshold: 0.1 }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [hasMore, loadingMore, activeTab]);

  // API Functions with graceful error handling
  const recordView = async (reportId: string) => {
    const key = `viewed-${reportId}`;
    
    // Check if already viewed in this session
    if (sessionStorage.getItem(key)) {
      return;
    }
    
    // Mark as viewed for this session
    sessionStorage.setItem(key, '1');
    
    try {
      const response = await fetch(`/api/admin/fake-news/public/${reportId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        console.warn('Failed to record view:', response.status);
        return;
      }
      
      const data = await response.json();
      if (!data.success) {
        console.warn('Failed to record view:', data.message);
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const recordShare = async (reportId: string, platform: string = 'other') => {
    try {
      const response = await fetch(`/api/admin/fake-news/public/${reportId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          platform,
          userId: userId,
          shareMethod: 'web'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setFakeNewsData(prev => prev.map(item => 
          item._id === reportId 
            ? { 
                ...item, 
                shares: data.data.totalShares,
                shareStats: data.data.platformShares
              }
            : item
        ));
        
        toast.success(language === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Successfully shared!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error recording share:', error);
      // Fallback: Update local state
      setFakeNewsData(prev => prev.map(item => 
        item._id === reportId 
          ? { ...item, shares: item.shares + 1 }
          : item
      ));
      toast.success(language === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Successfully shared!");
    }
  };

  const handleVote = async (reportId: string, voteType: 'helpful' | 'unhelpful') => {
    try {
      const response = await fetch(`/api/admin/fake-news/public/${reportId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType,
          userId: userId,
        }),
      });

      const result = await response.json();

      // Handle duplicate vote
      if (response.status === 409) {
        toast.error(language === "hi" 
          ? "आप पहले ही इस रिपोर्ट पर वोट दे चुके हैं।" 
          : "You have already voted on this report."
        );
        return;
      }

      // Handle other API errors
      if (!response.ok) {
        toast.error(language === "hi" 
          ? "त्रुटि: " + (result.message || "कुछ गलत हुआ।") 
          : "Error: " + (result.message || "Something went wrong.")
        );
        return;
      }

      // Success
      toast.success(language === "hi" 
        ? "वोट सबमिट किया गया ✅" 
        : "Vote Submitted ✅"
      );

      // Update UI state
      setFakeNewsData(prev => prev.map(item => 
        item._id === reportId 
          ? { 
              ...item, 
              helpfulVotes: result.data.helpfulVotes || item.helpfulVotes,
              unhelpfulVotes: result.data.unhelpfulVotes || item.unhelpfulVotes,
              hasVoted: voteType
            }
          : item
      ));

    } catch (err) {
      console.error("Vote error:", err);
      toast.error(language === "hi" 
        ? "नेटवर्क त्रुटि - कृपया बाद में पुनः प्रयास करें" 
        : "Network Error - Please try again later"
      );
    }
  };

  // Initial load function
  const fetchFakeNews = useCallback(async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await fetch(
        `/api/admin/fake-news/public?page=${page}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        // Update each item with bookmark status
        const reportsWithBookmark = data.data.reports.map(report => ({
          ...report,
          isBookmarked: isBookmarked(report._id)
        }));
        
        if (page === 1) {
          setFakeNewsData(reportsWithBookmark);
        } else {
          setFakeNewsData(prev => [...prev, ...reportsWithBookmark]);
        }
        
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
        setHasMore(data.data.pagination.page < data.data.pagination.pages);
        
        // Record view for each new report
        reportsWithBookmark.forEach(report => {
          recordView(report._id);
        });
        
        if (page === 1) {
          toast.success(language === "hi" 
            ? `${data.data.reports.length} रिपोर्ट्स लोड की गईं` 
            : `Loaded ${data.data.reports.length} reports`
          );
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching fake news:', error);
      toast.error(language === "hi" 
        ? "डेटा लोड करने में त्रुटि - कृपया बाद में पुनः प्रयास करें" 
        : "Error loading data - Please try again later"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [bookmarkedItems, language]);

  // Load more data function
  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await fetch(
        `/api/admin/fake-news/public?page=${nextPage}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        const reportsWithBookmark = data.data.reports.map(report => ({
          ...report,
          isBookmarked: isBookmarked(report._id)
        }));
        
        setFakeNewsData(prev => [...prev, ...reportsWithBookmark]);
        setPagination(data.data.pagination);
        setCurrentPage(nextPage);
        setHasMore(nextPage < data.data.pagination.pages);
        
        // Record view for new reports
        reportsWithBookmark.forEach(report => {
          recordView(report._id);
        });
        
        toast.success(language === "hi" 
          ? `${data.data.reports.length} और रिपोर्ट्स लोड की गईं` 
          : `Loaded ${data.data.reports.length} more reports`
        );
      }
    } catch (error) {
      console.error('Error loading more data:', error);
      toast.error(language === "hi" 
        ? "और डेटा लोड करने में त्रुटि" 
        : "Error loading more data"
      );
    } finally {
      setLoadingMore(false);
    }
  };

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
        unhelpfulVotes: 0,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "Fake Cure for COVID-19 Circulating",
        titleHi: "COVID-19 के लिए नकली इलाज प्रचलित",
        fakeClaim: "Drinking hot water with turmeric cures COVID-19",
        fakeClaimHi: "हल्दी के साथ गर्म पानी पीने से COVID-19 ठीक हो जाता है",
        factCheck: "Misleading - No Scientific Evidence",
        factCheckHi: "गलतफहमी - कोई वैज्ञानिक प्रमाण नहीं",
        explanation: "While turmeric has anti-inflammatory properties, there is no scientific evidence that it cures COVID-19. WHO and ICMR have issued warnings against such misinformation.",
        explanationHi: "हालांकि हल्दी में सूजन-रोधी गुण होते हैं, लेकिन कोई वैज्ञानिक प्रमाण नहीं है कि यह COVID-19 को ठीक करती है। WHO और ICMR ने इस तरह की गलत जानकारी के खिलाफ चेतावनी जारी की है।",
        evidence: [
          { type: "document", url: "#", title: "WHO Advisory" },
          { type: "link", url: "#", title: "ICMR Official Statement" },
          { type: "document", url: "#", title: "Medical Research Paper" },
        ],
        category: "health",
        severity: "medium",
        origin: "WhatsApp Forwards",
        debunkedBy: [{ name: "WHO" }, { name: "ICMR" }, { name: "FactChecker.in" }],
        debunkedAt: "2024-01-10T00:00:00.000Z",
        verifiedSources: [
          { name: "World Health Organization", url: "#", type: "government" },
          { name: "ICMR", url: "#", type: "government" },
          { name: "Johns Hopkins Medicine", url: "#", type: "expert" },
        ],
        tags: ["Health", "COVID-19", "Misinformation", "WhatsApp"],
        relatedReports: [],
        views: 18700,
        shares: 450,
        helpfulVotes: 0,
        unhelpfulVotes: 0,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  // Initial load
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

  // Check if an item is bookmarked
  const isBookmarked = (id: string) => {
    return bookmarkedItems.some(item => item.id === id);
  };

  // Toggle bookmark with toast
  const toggleBookmark = (item: FakeNewsItem) => {
    const isAlreadyBookmarked = isBookmarked(item._id);
    let newBookmarks: BookmarkedItem[];

    if (isAlreadyBookmarked) {
      // Remove bookmark
      newBookmarks = bookmarkedItems.filter(bookmark => bookmark.id !== item._id);
      toast.success(language === "hi" 
        ? "बुकमार्क हटाया गया!" 
        : "Bookmark removed!"
      );
    } else {
      // Add bookmark
      const bookmark: BookmarkedItem = {
        id: item._id,
        title: item.title,
        titleHi: item.titleHi,
        factCheck: item.factCheck,
        factCheckHi: item.factCheckHi,
        category: item.category,
        severity: item.severity,
        debunkedAt: item.debunkedAt,
        bookmarkedAt: new Date().toISOString(),
      };
      newBookmarks = [...bookmarkedItems, bookmark];
      toast.success(language === "hi" 
        ? "बुकमार्क जोड़ा गया!" 
        : "Bookmark added!"
      );
    }

    // Update state
    setBookmarkedItems(newBookmarks);

    // Save to localStorage
    localStorage.setItem("fakeNewsBookmarks", JSON.stringify(newBookmarks));

    // Update the isBookmarked status in fakeNewsData
    setFakeNewsData(prev => prev.map(newsItem => 
      newsItem._id === item._id 
        ? { ...newsItem, isBookmarked: !isAlreadyBookmarked }
        : newsItem
    ));
  };

  // Remove bookmark with toast
  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarkedItems.filter(bookmark => bookmark.id !== id);
    setBookmarkedItems(newBookmarks);
    localStorage.setItem("fakeNewsBookmarks", JSON.stringify(newBookmarks));
    toast.success(language === "hi" 
      ? "बुकमार्क हटाया गया!" 
      : "Bookmark removed!"
    );
  };

  // Clear all bookmarks with dialog confirmation
  const clearAllBookmarks = () => {
    setBookmarkedItems([]);
    localStorage.removeItem("fakeNewsBookmarks");
    toast.success(language === "hi" 
      ? "सभी बुकमार्क हटाए गए!" 
      : "All bookmarks cleared!"
    );
    setClearBookmarksDialog(false);
  };

  // Open share modal
  const openShareModal = (item: FakeNewsItem) => {
    setSelectedReportForShare(item);
    setShowShareModal(true);
  };

  // Close share modal
  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedReportForShare(null);
    setCopySuccess(false);
  };

  // Copy link to clipboard
  const copyLinkToClipboard = async () => {
    if (!selectedReportForShare) return;
    
    const shareUrl = `${window.location.origin}/fake-news/${selectedReportForShare._id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      toast.success(language === "hi" 
        ? "लिंक कॉपी किया गया!" 
        : "Link copied!"
      );
      
      // Record share
      await recordShare(selectedReportForShare._id, 'other');
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(language === "hi" 
        ? "लिंक कॉपी करने में त्रुटि!" 
        : "Error copying link!"
      );
    }
  };

  // Share on specific platform
  const shareOnPlatform = async (platform: string) => {
    if (!selectedReportForShare) return;
    
    const shareUrl = `${window.location.origin}/fake-news/${selectedReportForShare._id}`;
    const shareText = language === "hi"
      ? `${selectedReportForShare.titleHi}\n\n❌ झूठा दावा: ${selectedReportForShare.fakeClaimHi}\n✅ सत्यापित तथ्य: ${selectedReportForShare.factCheckHi}`
      : `${selectedReportForShare.title}\n\n❌ False Claim: ${selectedReportForShare.fakeClaim}\n✅ Verified Fact: ${selectedReportForShare.factCheck}`;
    
    // Record the share via API
    await recordShare(selectedReportForShare._id, platform);
    
    let shareWindowUrl = "";
    
    switch (platform) {
      case "whatsapp":
        shareWindowUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      case "facebook":
        shareWindowUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareWindowUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        shareWindowUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "telegram":
        shareWindowUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      default:
        shareWindowUrl = shareUrl;
    }
    
    // Open sharing window
    window.open(shareWindowUrl, '_blank', 'width=600,height=400');
    
    // Close modal after a delay
    setTimeout(() => {
      closeShareModal();
    }, 1000);
  };

  // Share via native share API
  const shareViaNative = async () => {
    if (!selectedReportForShare) return;
    
    const shareUrl = `${window.location.origin}/fake-news/${selectedReportForShare._id}`;
    const shareText = language === "hi"
      ? `${selectedReportForShare.titleHi}\n\n❌ झूठा दावा: ${selectedReportForShare.fakeClaimHi}\n✅ सत्यापित तथ्य: ${selectedReportForShare.factCheckHi}`
      : `${selectedReportForShare.title}\n\n❌ False Claim: ${selectedReportForShare.fakeClaim}\n✅ Verified Fact: ${selectedReportForShare.factCheck}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "hi" ? "तथ्य-जाँच रिपोर्ट" : "Fact-Check Report",
          text: shareText,
          url: shareUrl,
        });
        await recordShare(selectedReportForShare._id, 'other');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error(language === "hi" 
          ? "साझा करने में त्रुटि" 
          : "Error sharing"
        );
      }
    } else {
      // Fallback to copy link
      copyLinkToClipboard();
    }
    
    closeShareModal();
  };

  // Filter data based on active tab and category
  const filteredData = (activeTab === "bookmarked" ? bookmarkedItems : fakeNewsData).filter((item) => {
    // For bookmarked items, we need to filter differently
    if (activeTab === "bookmarked") {
      const bookmark = item as BookmarkedItem;
      if (activeCategory !== "all" && bookmark.category !== activeCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.titleHi.toLowerCase().includes(query)
        );
      }
      return true;
    } else {
      const newsItem = item as FakeNewsItem;
      if (activeCategory !== "all" && newsItem.category !== activeCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          newsItem.title.toLowerCase().includes(query) ||
          newsItem.fakeClaim.toLowerCase().includes(query) ||
          newsItem.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    }
  });

  // Handle page change for manual pagination
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

  // Render bookmarked items
  const renderBookmarkedItem = (bookmark: BookmarkedItem) => {
    return (
      <Card key={bookmark.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={severityColors[bookmark.severity as keyof typeof severityColors]}>
                  {severityLabels[bookmark.severity as keyof typeof severityLabels]}
                </Badge>
                <Badge variant="outline">
                  {bookmark.category.charAt(0).toUpperCase() + bookmark.category.slice(1)}
                </Badge>
                <Badge variant="secondary" className="ml-auto">
                  <BookmarkCheck className="h-3 w-3 mr-1" />
                  {language === "hi" ? "बुकमार्क किया गया" : "Bookmarked"}
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {language === "hi" ? bookmark.titleHi : bookmark.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Debunked on{" "}
                  {new Date(bookmark.debunkedAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="text-xs">
                  {language === "hi" ? "बुकमार्क किया गया:" : "Bookmarked:"}{" "}
                  {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBookmark(bookmark.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title={language === "hi" ? "बुकमार्क हटाएं" : "Remove bookmark"}
              >
                <BookmarkX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Fact Check */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">
                  {language === "hi" ? "सत्यापित तथ्य" : "Verified Fact"}
                </h3>
                <p className="text-green-700">
                  {language === "hi" ? bookmark.factCheckHi : bookmark.factCheck}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 flex justify-end">
          <Link href={`/fake-news/${bookmark.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              {language === "hi" ? "पूरी रिपोर्ट देखें" : "View Full Report"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  // Share Modal Component
  const ShareModal = () => {
    if (!showShareModal || !selectedReportForShare) return null;

    const shareUrl = `${window.location.origin}/fake-news/${selectedReportForShare._id}`;
    const shareText = language === "hi"
      ? `${selectedReportForShare.titleHi}\n\n❌ झूठा दावा: ${selectedReportForShare.fakeClaimHi}\n✅ सत्यापित तथ्य: ${selectedReportForShare.factCheckHi}`
      : `${selectedReportForShare.title}\n\n❌ False Claim: ${selectedReportForShare.fakeClaim}\n✅ Verified Fact: ${selectedReportForShare.factCheck}`;

    return (
      <Dialog open={showShareModal} onOpenChange={closeShareModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "hi" ? "रिपोर्ट साझा करें" : "Share Report"}
            </DialogTitle>
            <DialogDescription>
              {language === "hi" 
                ? "इस तथ्य-जाँच रिपोर्ट को दूसरों के साथ साझा करें" 
                : "Share this fact-check report with others"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Copy Link Section */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "hi" ? "लिंक कॉपी करें" : "Copy Link"}
              </label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="flex-1"
                />
                <Button
                  onClick={copyLinkToClipboard}
                  variant={copySuccess ? "default" : "outline"}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copySuccess 
                    ? (language === "hi" ? "कॉपी किया" : "Copied") 
                    : (language === "hi" ? "कॉपी करें" : "Copy")}
                </Button>
              </div>
            </div>

            {/* Social Media Platforms */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                {language === "hi" ? "सोशल मीडिया पर साझा करें" : "Share on Social Media"}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {/* WhatsApp */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                  onClick={() => shareOnPlatform("whatsapp")}
                  title="WhatsApp"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>

                {/* Facebook */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
                  onClick={() => shareOnPlatform("facebook")}
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Button>

                {/* Twitter */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 border-sky-200"
                  onClick={() => shareOnPlatform("twitter")}
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Button>

                {/* LinkedIn */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border-blue-300"
                  onClick={() => shareOnPlatform("linkedin")}
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>

                {/* Telegram */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 border-blue-200"
                  onClick={() => shareOnPlatform("telegram")}
                  title="Telegram"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Other Options */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                {language === "hi" ? "अन्य विकल्प" : "Other Options"}
              </label>
              <div className="space-y-2">
                {navigator.share && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={shareViaNative}
                  >
                    <Share2 className="h-4 w-4" />
                    {language === "hi" 
                      ? "डिवाइस शेयर विकल्प का उपयोग करें" 
                      : "Use device share options"}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    window.open(`mailto:?subject=${encodeURIComponent(selectedReportForShare.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank');
                    recordShare(selectedReportForShare._id, 'other');
                    closeShareModal();
                  }}
                >
                  <Mail className="h-4 w-4" />
                  {language === "hi" ? "ईमेल के द्वारा भेजें" : "Share via Email"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={closeShareModal}
              variant="outline"
            >
              {language === "hi" ? "बंद करें" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Professional Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          {/* Top Bar with Breaking News Ticker */}
          <div className="hidden md:flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></div>
                <span>BREAKING NEWS</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                  {newsTickerItems.map((item) => (
                    <span key={item.id} className="mx-8">
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <Clock className="h-4 w-4 inline mr-1" />
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex gap-2">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="h-8 px-3 text-xs"
                >
                  EN
                </Button>
                <Button
                  variant={language === "hi" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("hi")}
                  className="h-8 px-3 text-xs"
                >
                  हिंदी
                </Button>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    <span className="text-red-600">FACT</span>CHECK
                    <span className="text-blue-600">INDIA</span>
                  </h1>
                  <p className="text-xs text-gray-600">Truth Above Everything</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/fake-news" className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">
                Fake News Debunker
              </Link>
              <Link href="/fact-check" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Fact Check
              </Link>
              <Link href="/reports" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Reports
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search fact checks..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  Home
                </Link>
                <Link href="/fake-news" className="text-red-600 font-semibold py-2">
                  Fake News Debunker
                </Link>
                <Link href="/fact-check" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  Fact Check
                </Link>
                <Link href="/reports" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  Reports
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  About Us
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  Contact
                </Link>
                <div className="pt-4 border-t">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search fact checks..."
                      className="pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative text-white py-16 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={currentBackground}
            alt="News Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/70"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <AlertTriangle className="h-16 w-16" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                    {language === "hi" ? "फेक न्यूज डिबंकर" : "Fake News Debunker"}
                  </span>
                </h1>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  {language === "hi"
                    ? "सत्य को झूठ से अलग करें। हमारे विशेषज्ञों द्वारा प्रमाण-आधारित तथ्य-जाँच और गहन विश्लेषण।"
                    : "Separating truth from fiction. Evidence-based fact-checking and in-depth analysis by our experts."}
                </p>
              </div>
            </div>

            {/* Featured Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold">{pagination.total}+</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "तथ्य-जाँचे गए" : "Claims Fact-Checked"}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold">98.7%</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "सटीकता दर" : "Accuracy Rate"}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "मॉनिटरिंग" : "Monitoring"}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-80">
                  {language === "hi" ? "विशेषज्ञ" : "Experts"}
                </div>
              </div>
            </div>

            {/* Quick Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={
                    language === "hi"
                      ? "फेक न्यूज या दावा खोजें..."
                      : "Search fake news or claims..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70"
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {language === "hi" ? "खोजें" : "Search"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                {language === "hi" ? "शीर्ष श्रेणियाँ:" : "Top Categories:"}
              </span>
              {topCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant="ghost"
                    size="sm"
                    className={`whitespace-nowrap ${category.color} hover:opacity-90`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tabs for All vs Bookmarked */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "hi" ? "देखें" : "View"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setActiveTab("all")}
                  >
                    {language === "hi" ? "सभी रिपोर्ट्स" : "All Reports"}
                    <Badge variant="secondary" className="ml-2">
                      {pagination.total}
                    </Badge>
                  </Button>
                  <Button
                    variant={activeTab === "bookmarked" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setActiveTab("bookmarked")}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    {language === "hi" ? "बुकमार्क" : "Bookmarks"}
                    <Badge variant="secondary" className="ml-2">
                      {bookmarkedItems.length}
                    </Badge>
                  </Button>
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

            {/* Bookmark Management (only shown in bookmarks tab) */}
            {activeTab === "bookmarked" && bookmarkedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === "hi" ? "बुकमार्क प्रबंधन" : "Bookmark Management"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {language === "hi" ? "कुल बुकमार्क:" : "Total bookmarks:"}
                      </span>
                      <span className="font-semibold">{bookmarkedItems.length}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setClearBookmarksDialog(true)}
                    >
                      <BookmarkX className="h-4 w-4 mr-2" />
                      {language === "hi" ? "सभी बुकमार्क हटाएं" : "Clear All Bookmarks"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  {activeTab === "all" 
                    ? (language === "hi" ? "हालिया फेक न्यूज" : "Recent Fake News")
                    : (language === "hi" ? "आपके बुकमार्क" : "Your Bookmarks")}
                </h2>
                <p className="text-gray-600">
                  {activeTab === "all" 
                    ? `${filteredData.length} items found (${pagination.total} total)`
                    : `${filteredData.length} ${language === "hi" ? "बुकमार्क मिले" : "bookmarks found"}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <Globe className="h-4 w-4 inline mr-1" />
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
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

            {/* Fake News List or Bookmarks */}
            {loading && activeTab === "all" ? (
              renderSkeletons()
            ) : activeTab === "bookmarked" && bookmarkedItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {language === "hi" ? "कोई बुकमार्क नहीं" : "No Bookmarks Yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "hi"
                      ? "आपने अभी तक कोई रिपोर्ट बुकमार्क नहीं की है। रिपोर्ट देखने के लिए नीचे दिए गए बटन पर क्लिक करें।"
                      : "You haven't bookmarked any reports yet. Click the button below to view reports."}
                  </p>
                  <Button onClick={() => setActiveTab("all")}>
                    {language === "hi" ? "सभी रिपोर्ट्स देखें" : "View All Reports"}
                  </Button>
                </CardContent>
              </Card>
            ) : filteredData.length > 0 ? (
              <>
                <div className="space-y-6">
                  {activeTab === "all" 
                    ? filteredData.map((item, index) => {
                        const newsItem = item as FakeNewsItem;
                        const isLastItem = index === filteredData.length - 1;
                        return (
                          <div 
                            key={newsItem._id} 
                            ref={isLastItem ? lastItemRef : null}
                          >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={severityColors[newsItem.severity]}>
                                        {severityLabels[newsItem.severity]}
                                      </Badge>
                                      <Badge variant="outline">
                                        {newsItem.category.charAt(0).toUpperCase() +
                                          newsItem.category.slice(1)}
                                      </Badge>
                                      <span className="text-xs text-gray-500 ml-auto">
                                        <Clock className="h-3 w-3 inline mr-1" />
                                        {new Date(newsItem.debunkedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <CardTitle className="text-xl hover:text-red-600 transition-colors">
                                      {language === "hi" ? newsItem.titleHi : newsItem.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                      <Eye className="h-4 w-4" />
                                      <span>{newsItem.views.toLocaleString()} views</span>
                                      <span>•</span>
                                      <Share2 className="h-4 w-4" />
                                      <span>{newsItem.shares} shares</span>
                                      <span>•</span>
                                      <ThumbsUp className="h-4 w-4" />
                                      <span>{newsItem.helpfulVotes} helpful</span>
                                    </CardDescription>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleBookmark(newsItem)}
                                      className={
                                        newsItem.isBookmarked
                                          ? "text-yellow-500 hover:text-yellow-600"
                                          : ""
                                      }
                                      title={newsItem.isBookmarked 
                                        ? (language === "hi" ? "बुकमार्क हटाएं" : "Remove bookmark")
                                        : (language === "hi" ? "बुकमार्क जोड़ें" : "Add bookmark")}
                                    >
                                      <Bookmark
                                        className={`h-4 w-4 ${
                                          newsItem.isBookmarked
                                            ? "fill-current"
                                            : ""
                                        }`}
                                      />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openShareModal(newsItem)}
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
                                          ? newsItem.fakeClaimHi
                                          : newsItem.fakeClaim}
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
                                          ? newsItem.factCheckHi
                                          : newsItem.factCheck}
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
                                      ? newsItem.explanationHi
                                      : newsItem.explanation}
                                  </p>
                                </div>

                                {/* Evidence */}
                                {newsItem.evidence && newsItem.evidence.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-3">
                                      {language === "hi" ? "सबूत" : "Evidence"}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {newsItem.evidence.map((evidence, idx) => (
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
                                {newsItem.verifiedSources && newsItem.verifiedSources.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-3">
                                      {language === "hi"
                                        ? "प्रामाणिक स्रोत"
                                        : "Verified Sources"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {newsItem.verifiedSources.map((source, idx) => (
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
                                {newsItem.tags && newsItem.tags.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      {language === "hi" ? "टैग" : "Tags"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {newsItem.tags.map((tag, idx) => (
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
                                      {newsItem.debunkedBy.map((org, idx) => (
                                        <span key={org._id || idx} className="text-sm text-gray-600">
                                          {org.name}
                                          {idx < newsItem.debunkedBy.length - 1 ? ", " : ""}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                      {language === "hi" ? "उत्पत्ति" : "Origin"}
                                    </div>
                                    <div className="text-sm font-medium">
                                      {newsItem.origin}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="bg-gray-50 flex justify-between">
                                <div className="flex items-center gap-4">
                                  <Button 
                                    variant={newsItem.hasVoted === "helpful" ? "default" : "ghost"}
                                    size="sm" 
                                    className="gap-2"
                                    onClick={() => handleVote(newsItem._id, "helpful")}
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                    {newsItem.helpfulVotes} {language === "hi" ? "सहायक" : "Helpful"}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="gap-2"
                                    onClick={() => openShareModal(newsItem)}
                                  >
                                    <Share2 className="h-4 w-4" />
                                    {newsItem.shares} {language === "hi" ? "शेयर" : "Shares"}
                                  </Button>
                                </div>
                                <Link href={`/fake-news/${newsItem._id}`}>
                                  <Button variant="outline" size="sm" className="gap-2">
                                    {language === "hi"
                                      ? "पूरी रिपोर्ट देखें"
                                      : "View Full Report"}
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </CardFooter>
                            </Card>
                          </div>
                        );
                      })
                    : filteredData.map((item) => renderBookmarkedItem(item as BookmarkedItem))}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div className="flex justify-center items-center mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {language === "hi" ? "और रिपोर्ट्स लोड हो रही हैं..." : "Loading more reports..."}
                    </span>
                  </div>
                )}

                {/* Manual pagination as fallback */}
                {activeTab === "all" && pagination.pages > 1 && !loadingMore && (
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
                    
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {pagination.pages}
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

        {/* Featured Media Partners */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {language === "hi" ? "हमारे सहयोगी" : "Our Partners"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "BBC", icon: Tv, color: "bg-red-100 text-red-600" },
              { name: "Reuters", icon: Globe, color: "bg-blue-100 text-blue-600" },
              { name: "AP News", icon: Newspaper, color: "bg-green-100 text-green-600" },
              { name: "AFP", icon: Mic, color: "bg-purple-100 text-purple-600" },
              { name: "PTI", icon: FileText, color: "bg-orange-100 text-orange-600" },
            ].map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${partner.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">{partner.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Share Modal */}
      <ShareModal />

      {/* Clear Bookmarks Dialog */}
      <AlertDialog open={clearBookmarksDialog} onOpenChange={setClearBookmarksDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "hi" 
                ? "सभी बुकमार्क हटाएं?" 
                : "Clear all bookmarks?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "hi"
                ? "क्या आप वाकई सभी बुकमार्क हटाना चाहते हैं? इस क्रिया को पूर्ववत नहीं किया जा सकता।"
                : "Are you sure you want to clear all bookmarks? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "hi" ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllBookmarks}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === "hi" ? "हाँ, हटाएं" : "Yes, clear all"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PublicFooter />
    </div>
  );
};

export default FakeNewsPage;