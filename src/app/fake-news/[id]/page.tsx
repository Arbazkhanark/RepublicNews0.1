"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  AlertTriangle,
  Calendar,
  Eye,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
  Copy,
  ExternalLink,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Send,
  Loader2,
  Facebook,
  Twitter,
  MessageSquare,
  Linkedin,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { GoogleAdSense } from "@/components/public/google-adsense";
import { ChevronRight } from "lucide-react";
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
import { Input } from "@/components/ui/input";

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

interface FakeNewsReport {
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
  status: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  hasVoted?: "helpful" | "unhelpful" | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: FakeNewsReport;
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

const FakeNewsReportPage = () => {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [report, setReport] = useState<FakeNewsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem("fakeNewsUserId");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("fakeNewsUserId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("fakeNewsBookmarks");
    if (savedBookmarks) {
      try {
        const bookmarks: BookmarkedItem[] = JSON.parse(savedBookmarks);
        const isCurrentlyBookmarked = bookmarks.some(bookmark => bookmark.id === reportId);
        setIsBookmarked(isCurrentlyBookmarked);
      } catch (error) {
        console.error("Error parsing bookmarks from localStorage:", error);
      }
    }
  }, [reportId]);

  // Fetch report data from API
  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/fake-news/${reportId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setReport(data.data);
        
        // Check if this report is already bookmarked
        const savedBookmarks = localStorage.getItem("fakeNewsBookmarks");
        if (savedBookmarks) {
          try {
            const bookmarks: BookmarkedItem[] = JSON.parse(savedBookmarks);
            const isCurrentlyBookmarked = bookmarks.some(bookmark => bookmark.id === data.data._id);
            setIsBookmarked(isCurrentlyBookmarked);
          } catch (error) {
            console.error("Error checking bookmark status:", error);
          }
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error(language === "hi" 
        ? "रिपोर्ट लोड करने में त्रुटि" 
        : "Error loading report"
      );
      // Fallback to sample data if API fails
      setReport(getSampleReport());
    } finally {
      setLoading(false);
    }
  };

  // Record view function with session storage check
  const recordView = async () => {
    if (!reportId) return;
    
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

  // Share function
  const recordShare = async (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'email' | 'other' = 'other') => {
    if (!reportId) return;
    
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
        setReport(prev => prev ? {
          ...prev,
          shares: data.data.totalShares,
        } : null);
        
        toast.success(language === "hi" 
          ? "सफलतापूर्वक साझा किया गया!" 
          : "Successfully shared!"
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error recording share:', error);
      // Fallback: Update local state
      setReport(prev => prev ? { ...prev, shares: prev.shares + 1 } : null);
      toast.success(language === "hi" 
        ? "सफलतापूर्वक साझा किया गया!" 
        : "Successfully shared!"
      );
    }
  };

  // Vote function
  const handleVote = async (voteType: 'helpful') => {
    if (!reportId || isVoting) return;
    
    setIsVoting(true);
    try {
      const response = await fetch(`/api/admin/fake-news/public/${reportId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType,
          userId,
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
      setReport(prev => prev ? {
        ...prev,
        helpfulVotes: result.data.helpfulVotes || prev.helpfulVotes,
        hasVoted: voteType
      } : null);

    } catch (err) {
      console.error("Vote error:", err);
      toast.error(language === "hi" 
        ? "नेटवर्क त्रुटि - कृपया बाद में पुनः प्रयास करें" 
        : "Network Error - Please try again later"
      );
    } finally {
      setIsVoting(false);
    }
  };

  // Fetch report and record view on component mount
  useEffect(() => {
    if (reportId) {
      fetchReport();
      recordView();
    }
  }, [reportId]);

  // Sample data fallback
  const getSampleReport = (): FakeNewsReport => {
    return {
      _id: "1",
      title: "AI Generated Video of PM Modi Announces Free Electricity",
      titleHi: "पीएम मोदी का AI जनरेटेड वीडियो मुफ्त बिजली की घोषणा करता है",
      fakeClaim:
        "PM Modi in a video announced free electricity for all Indian households starting from next month",
      fakeClaimHi:
        "पीएम मोदी ने एक वीडियो में अगले महीने से सभी भारतीय घरों के लिए मुफ्त बिजली की घोषणा की",
      factCheck: "Completely False - AI Generated Deepfake Video",
      factCheckHi: "पूरी तरह से झूठ - AI जनरेटेड डीपफेक वीडियो",
      explanation:
        "The viral video is a sophisticated deepfake created using advanced AI technology. The audio and visuals have been manipulated to make it appear as if PM Modi is making this announcement.",
      explanationHi:
        "वायरल वीडियो उन्नत AI तकनीक का उपयोग करके बनाया गया एक परिष्कृत डीपफेक है। ऑडियो और विजुअल में हेरफेर किया गया है ताकि ऐसा प्रतीत हो कि पीएम मोदी यह घोषणा कर रहे हैं।",
      detailedAnalysis: `
## Technical Analysis

### 1. Audio Analysis
- Voice modulation pattern doesn't match PM Modi's speech patterns
- Background noise levels inconsistent with official recordings
- Speech cadence shows AI generation artifacts

### 2. Visual Analysis
- Lip-sync accuracy: 78% (authentic videos: 95%+)
- Eye blinking pattern inconsistent
- Lighting shadows don't match the alleged location

### 3. Metadata Analysis
- Video file created on: 2024-01-10
- Original source not traceable
- Editing software traces found

## Why This is False

1. **No Official Announcement**: PMO has not issued any such announcement
2. **Financial Impossibility**: Free electricity for all households would cost approx. ₹2.8 lakh crore monthly
3. **Policy Inconsistency**: No such policy discussed in Parliament
4. **Timing Mismatch**: Video claims announcement was made on weekend, but PM was at official event
`,
      detailedAnalysisHi: `
## तकनीकी विश्लेषण

### 1. ऑडियो विश्लेषण
- आवाज मॉड्यूलेशन पैटर्न पीएम मोदी के भाषण पैटर्न से मेल नहीं खाता
- पृष्ठभूमि शोर का स्तर आधिकारिक रिकॉर्डिंग्स के साथ असंगत
- भाषण का ताल AI जनरेशन आर्टिफैक्ट्स दिखाता है

### 2. विजुअल विश्लेषण
- होंठ-सिंक सटीकता: 78% (प्रामाणिक वीडियो: 95%+)
- आंख झपकने का पैटर्न असंगत
- प्रकाश छाया कथित स्थान से मेल नहीं खाती

### 3. मेटाडेटा विश्लेषण
- वीडियो फ़ाइल बनाई गई: 2024-01-10
- मूल स्रोत का पता नहीं लगाया जा सका
- संपादन सॉफ्टवेयर के निशान मिले

## यह क्यों झूठ है

1. **कोई आधिकारिक घोषणा नहीं**: पीएमओ ने ऐसी कोई घोषणा जारी नहीं की है
2. **वित्तीय असंभवता**: सभी घरों के लिए मुफ्त बिजली की लागत लगभग ₹2.8 लाख करोड़ मासिक होगी
3. **नीति असंगति**: संसद में ऐसी कोई नीति चर्चा नहीं हुई
4. **समय बेमेल**: वीडियो में दावा है कि घोषणा सप्ताहांत में की गई थी, लेकिन पीएम आधिकारिक कार्यक्रम में थे
`,
      evidence: [
        {
          type: "video",
          url: "#",
          title: "Original Viral Video",
          description: "The complete fake video that went viral",
          timestamp: "2:45",
        },
        {
          type: "video",
          url: "#",
          title: "Forensic Analysis Report",
          description: "Detailed technical analysis by digital forensics team",
          timestamp: "15:30",
        },
        {
          type: "document",
          url: "#",
          title: "PMO Official Denial",
          description: "Official statement from Prime Minister's Office",
          timestamp: undefined,
        },
        {
          type: "image",
          url: "#",
          title: "Audio Waveform Comparison",
          description: "Comparison between authentic and fake audio",
          timestamp: undefined,
        },
        {
          type: "link",
          url: "#",
          title: "AI Detection Tool Results",
          description: "Results from AI detection software showing manipulation",
          timestamp: undefined,
        },
      ],
      category: "political",
      severity: "high",
      origin: "Unknown Telegram Channel",
      spreadPlatforms: ["WhatsApp", "Facebook", "Twitter", "YouTube", "Telegram"],
      debunkedBy: [
        {
          name: "Alt News",
          expertise: "Digital Forensics",
          verificationDate: "2024-01-12",
        },
        {
          name: "Factly",
          expertise: "Policy Analysis",
          verificationDate: "2024-01-13",
        },
        {
          name: "BBC Reality Check",
          expertise: "International Fact Checking",
          verificationDate: "2024-01-14",
        },
      ],
      debunkedAt: "2024-01-15",
      views: 32450,
      shares: 1280,
      helpfulVotes: 2450,
      unhelpfulVotes: 0,
      verifiedSources: [
        {
          name: "Prime Minister's Office (PMO)",
          url: "#",
          type: "government",
          credibilityScore: 100,
        },
        {
          name: "Ministry of Power",
          url: "#",
          type: "government",
          credibilityScore: 100,
        },
        {
          name: "Stanford Internet Observatory",
          url: "#",
          type: "academic",
          credibilityScore: 95,
        },
        {
          name: "Reuters Fact Check",
          url: "#",
          type: "media",
          credibilityScore: 98,
        },
      ],
      tags: [
        "Deepfake",
        "AI",
        "Political Manipulation",
        "Viral Video",
        "Electricity",
        "Government Policy",
      ],
      relatedReports: [],
      timeline: [
        {
          date: "2024-01-10",
          event: "Video Created",
          description: "Deepfake video created using AI tools",
        },
        {
          date: "2024-01-11",
          event: "First Appearance",
          description: "First spotted on Telegram channel",
        },
        {
          date: "2024-01-12",
          event: "Went Viral",
          description: "Shared 50,000+ times on WhatsApp",
        },
        {
          date: "2024-01-13",
          event: "Fact Check Initiated",
          description: "Our team started investigation",
        },
        {
          date: "2024-01-14",
          event: "Technical Analysis Complete",
          description: "Digital forensics confirmed manipulation",
        },
        {
          date: "2024-01-15",
          event: "Report Published",
          description: "Full debunking report published",
        },
      ],
      visualComparison: {
        original: "https://placehold.co/600x400/3b82f6/ffffff?text=Original+Video",
        manipulated: "https://placehold.co/600x400/ef4444/ffffff?text=Manipulated+Video",
        analysis: "Lip-sync mismatch: 22%, Audio frequency anomalies detected",
      },
      impact: {
        reach: 2500000,
        countries: ["India", "USA", "UK", "UAE", "Canada"],
        platforms: [
          "WhatsApp (65%)",
          "Facebook (20%)",
          "Twitter (10%)",
          "YouTube (5%)",
        ],
        duration: "5 days",
      },
      preventionTips: [
        "Verify with official government sources",
        "Check for multiple reliable sources",
        "Use reverse image search",
        "Look for metadata inconsistencies",
        "Consult fact-checking organizations",
        "Be skeptical of too-good-to-be-true offers",
      ],
      factChecker: {
        name: "Dr. Arjun Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        expertise: ["Digital Forensics", "AI Detection", "Media Analysis"],
        experience: "8 years",
        verifiedChecks: 1247,
      },
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

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

  // Toggle bookmark function with API and localStorage
  const toggleBookmark = async () => {
    if (!report) return;

    const savedBookmarks = localStorage.getItem("fakeNewsBookmarks");
    let bookmarks: BookmarkedItem[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    const isCurrentlyBookmarked = bookmarks.some(bookmark => bookmark.id === report._id);

    if (isCurrentlyBookmarked) {
      // Remove bookmark
      bookmarks = bookmarks.filter(bookmark => bookmark.id !== report._id);
      setIsBookmarked(false);
      toast.success(language === "hi" 
        ? "बुकमार्क हटाया गया!" 
        : "Bookmark removed!"
      );
    } else {
      // Add bookmark
      const newBookmark: BookmarkedItem = {
        id: report._id,
        title: report.title,
        titleHi: report.titleHi,
        factCheck: report.factCheck,
        factCheckHi: report.factCheckHi,
        category: report.category,
        severity: report.severity,
        debunkedAt: report.debunkedAt,
        bookmarkedAt: new Date().toISOString(),
      };
      bookmarks.push(newBookmark);
      setIsBookmarked(true);
      toast.success(language === "hi" 
        ? "बुकमार्क जोड़ा गया!" 
        : "Bookmark added!"
      );
    }

    // Save to localStorage
    localStorage.setItem("fakeNewsBookmarks", JSON.stringify(bookmarks));
  };

  const copyLinkToClipboard = async () => {
    if (!report) return;
    
    const shareUrl = `${window.location.origin}/fake-news/${report._id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      toast.success(language === "hi" 
        ? "लिंक कॉपी किया गया!" 
        : "Link copied!"
      );
      
      // Record share
      await recordShare('other');
      
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success(language === "hi" 
        ? "लिंक कॉपी किया गया!" 
        : "Link copied!"
      );
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error(language === "hi" 
        ? "लिंक कॉपी करने में त्रुटि!" 
        : "Error copying link!"
      );
    }
  };

  // Share on specific platform
  const shareOnPlatform = async (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'email') => {
    if (!report) return;
    
    const shareUrl = `${window.location.origin}/fake-news/${report._id}`;
    const shareText = language === "hi"
      ? `${report.titleHi}\n\n❌ झूठा दावा: ${report.fakeClaimHi}\n✅ सत्यापित तथ्य: ${report.factCheckHi}`
      : `${report.title}\n\n❌ False Claim: ${report.fakeClaim}\n✅ Verified Fact: ${report.factCheck}`;
    
    // Record the share via API
    await recordShare(platform);
    
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
      case "email":
        shareWindowUrl = `mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      default:
        shareWindowUrl = shareUrl;
    }
    
    // Open sharing window
    if (platform === 'email') {
      window.location.href = shareWindowUrl;
    } else {
      window.open(shareWindowUrl, '_blank', 'width=600,height=400');
    }
    
    // Close modal after a delay
    setTimeout(() => {
      setShowShareModal(false);
    }, 1000);
  };

  // Share via native share API
  const shareViaNative = async () => {
    if (!report) return;
    
    const shareUrl = `${window.location.origin}/fake-news/${report._id}`;
    const shareText = language === "hi"
      ? `${report.titleHi}\n\n❌ झूठा दावा: ${report.fakeClaimHi}\n✅ सत्यापित तथ्य: ${report.factCheckHi}`
      : `${report.title}\n\n❌ False Claim: ${report.fakeClaim}\n✅ Verified Fact: ${report.factCheck}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "hi" ? "तथ्य-जाँच रिपोर्ट" : "Fact-Check Report",
          text: shareText,
          url: shareUrl,
        });
        await recordShare('other');
      } catch (error) {
        console.error('Error sharing:', error);
        // If user cancels share, don't show error
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error(language === "hi" 
            ? "साझा करने में त्रुटि" 
            : "Error sharing"
          );
        }
      }
    } else {
      // Fallback to copy link
      copyLinkToClipboard();
    }
    
    setShowShareModal(false);
  };

  // Share Modal Component
  const ShareModal = () => {
    if (!report) return null;

    const shareUrl = `${window.location.origin}/fake-news/${report._id}`;

    return (
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
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
                  onClick={() => shareOnPlatform("email")}
                >
                  <Mail className="h-4 w-4" />
                  {language === "hi" ? "ईमेल के द्वारा भेजें" : "Share via Email"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowShareModal(false)}
              variant="outline"
            >
              {language === "hi" ? "बंद करें" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {language === "hi" ? "रिपोर्ट नहीं मिली" : "Report Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === "hi"
              ? "यह तथ्य-जाँच रिपोर्ट उपलब्ध नहीं है।"
              : "This fact-check report is not available."}
          </p>
          <Button onClick={() => router.push("/fake-news")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "hi" ? "सभी रिपोर्ट्स देखें" : "View All Reports"}
          </Button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // Helper function to render markdown content
  const renderMarkdown = (content: string) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.replace('- ', '').replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-red-600">
            {language === "hi" ? "होम" : "Home"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/fake-news" className="hover:text-red-600">
            {language === "hi" ? "फेक न्यूज डिबंकर" : "Fake News Debunker"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">
            {language === "hi" ? "तथ्य-जाँच रिपोर्ट" : "Fact-Check Report"}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Report Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={severityColors[report.severity]}>
                        {severityLabels[report.severity]}
                      </Badge>
                      <Badge variant="outline">
                        {report.category.charAt(0).toUpperCase() +
                          report.category.slice(1)}
                      </Badge>
                      {isBookmarked && (
                        <Badge variant="secondary" className="ml-2">
                          <BookmarkCheck className="h-3 w-3 mr-1" />
                          {language === "hi" ? "बुकमार्क किया गया" : "Bookmarked"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">
                      {language === "hi" ? report.titleHi : report.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.debunkedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {report.views.toLocaleString()}{" "}
                        {language === "hi" ? "दृश्य" : "views"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {report.shares} {language === "hi" ? "शेयर" : "shares"}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleBookmark}
                      className={isBookmarked ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50" : ""}
                      title={isBookmarked 
                        ? (language === "hi" ? "बुकमार्क हटाएं" : "Remove bookmark") 
                        : (language === "hi" ? "बुकमार्क जोड़ें" : "Add bookmark")}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 fill-current" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowShareModal(true)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      {copiedLink ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Fake Claim vs Fact Check */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fake Claim */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-red-800">
                          {language === "hi" ? "झूठा दावा" : "False Claim"}
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {language === "hi"
                            ? "यह दावा गलत है"
                            : "This claim is false"}
                        </p>
                      </div>
                    </div>
                    <p className="text-red-900 font-medium">
                      {language === "hi"
                        ? report.fakeClaimHi
                        : report.fakeClaim}
                    </p>
                  </div>

                  {/* Fact Check */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-green-800">
                          {language === "hi"
                            ? "सत्यापित तथ्य"
                            : "Verified Fact"}
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          {language === "hi"
                            ? "यह तथ्य सही है"
                            : "This fact is correct"}
                        </p>
                      </div>
                    </div>
                    <p className="text-green-900 font-medium">
                      {language === "hi"
                        ? report.factCheckHi
                        : report.factCheck}
                    </p>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h3 className="font-bold text-lg text-blue-800 mb-3">
                    {language === "hi" ? "त्वरित सारांश" : "Quick Summary"}
                  </h3>
                  <p className="text-blue-900">
                    {language === "hi"
                      ? report.explanationHi
                      : report.explanation}
                  </p>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="overview">
                      {language === "hi" ? "अवलोकन" : "Overview"}
                    </TabsTrigger>
                    <TabsTrigger value="evidence">
                      {language === "hi" ? "सबूत" : "Evidence"}
                    </TabsTrigger>
                    <TabsTrigger value="analysis">
                      {language === "hi" ? "विश्लेषण" : "Analysis"}
                    </TabsTrigger>
                    <TabsTrigger value="impact">
                      {language === "hi" ? "प्रभाव" : "Impact"}
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 pt-4">
                    {/* Prevention Tips */}
                    {report.preventionTips && report.preventionTips.length > 0 && (
                      <div>
                        <h3 className="font-bold text-xl mb-3">
                          {language === "hi" ? "मुख्य बिंदु" : "Key Points"}
                        </h3>
                        <ul className="space-y-2">
                          {report.preventionTips.slice(0, 5).map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Timeline */}
                    {report.timeline && report.timeline.length > 0 && (
                      <div>
                        <h3 className="font-bold text-xl mb-3">
                          {language === "hi" ? "समयरेखा" : "Timeline"}
                        </h3>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-6 pl-10">
                            {report.timeline.map((item, index) => (
                              <div key={item._id || index} className="relative">
                                <div className="absolute -left-10 top-1 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                </div>
                                <div className="bg-white border rounded-lg p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <span className="font-semibold">
                                      {item.event}
                                    </span>
                                    <Badge variant="outline">
                                      {new Date(item.date).toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "numeric",
                                          month: "short",
                                        }
                                      )}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visual Comparison */}
                    {report.visualComparison && (
                      <div>
                        <h3 className="font-bold text-xl mb-3">
                          {language === "hi"
                            ? "विजुअल तुलना"
                            : "Visual Comparison"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {report.visualComparison.original && (
                            <div className="text-center">
                              <div className="relative h-48 w-full mb-2 rounded-lg overflow-hidden">
                                <Image
                                  src={'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg'}
                                  alt="Original"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <p className="font-medium text-green-700">
                                {language === "hi"
                                  ? "मूल वीडियो"
                                  : "Original Video"}
                              </p>
                            </div>
                          )}
                          {report.visualComparison.manipulated && (
                            <div className="text-center">
                              <div className="relative h-48 w-full mb-2 rounded-lg overflow-hidden">
                                <Image
                                  src={'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg'}
                                  alt="Manipulated"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <p className="font-medium text-red-700">
                                {language === "hi"
                                  ? "हेरफेर वाला वीडियो"
                                  : "Manipulated Video"}
                              </p>
                            </div>
                          )}
                        </div>
                        {report.visualComparison.analysis && (
                          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm">
                              <span className="font-semibold">
                                {language === "hi" ? "विश्लेषण:" : "Analysis:"}
                              </span>{" "}
                              {report.visualComparison.analysis}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {/* Evidence Tab */}
                  <TabsContent value="evidence" className="space-y-6 pt-4">
                    {report.evidence && report.evidence.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.evidence.map((item, index) => (
                          <Card key={item._id || index}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                {item.type === "video" && (
                                  <Video className="h-5 w-5 text-red-600" />
                                )}
                                {item.type === "image" && (
                                  <ImageIcon className="h-5 w-5 text-blue-600" />
                                )}
                                {item.type === "document" && (
                                  <FileText className="h-5 w-5 text-green-600" />
                                )}
                                {item.type === "link" && (
                                  <LinkIcon className="h-5 w-5 text-purple-600" />
                                )}
                                {item.type === "audio" && (
                                  <FileText className="h-5 w-5 text-orange-600" />
                                )}
                                <CardTitle className="text-base">
                                  {item.title}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {item.description}
                                </p>
                              )}
                              {item.timestamp && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  Timestamp: {item.timestamp}
                                </div>
                              )}
                            </CardContent>
                            <CardFooter>
                              <Button size="sm" className="w-full gap-2" asChild>
                                <Link href={item.url} target="_blank">
                                  <ExternalLink className="h-4 w-4" />
                                  {language === "hi"
                                    ? "सबूत देखें"
                                    : "View Evidence"}
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {language === "hi"
                            ? "कोई सबूत उपलब्ध नहीं है"
                            : "No evidence available"}
                        </p>
                      </div>
                    )}

                    {/* Download Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === "hi"
                            ? "रिपोर्ट डाउनलोड करें"
                            : "Download Report"}
                        </CardTitle>
                        <CardDescription>
                          {language === "hi"
                            ? "पूरी तथ्य-जाँच रिपोर्ट PDF फॉर्मेट में डाउनलोड करें"
                            : "Download complete fact-check report in PDF format"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            {language === "hi"
                              ? "पूरी रिपोर्ट (PDF)"
                              : "Full Report (PDF)"}
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            {language === "hi"
                              ? "सारांश (DOCX)"
                              : "Summary (DOCX)"}
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <ImageIcon className="h-4 w-4" />
                            {language === "hi"
                              ? "इमेज फैक्ट-चेक"
                              : "Image Fact-Check"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Analysis Tab */}
                  <TabsContent value="analysis" className="space-y-6 pt-4">
                    {/* Detailed Analysis */}
                    {(report.detailedAnalysis || report.detailedAnalysisHi) && (
                      <div className="prose max-w-none">
                        {renderMarkdown(
                          language === "hi" 
                            ? report.detailedAnalysisHi || report.detailedAnalysis || ""
                            : report.detailedAnalysis || report.detailedAnalysisHi || ""
                        )}
                      </div>
                    )}

                    {/* Verified Sources */}
                    {report.verifiedSources && report.verifiedSources.length > 0 && (
                      <div>
                        <h3 className="font-bold text-xl mb-4">
                          {language === "hi"
                            ? "प्रामाणिक स्रोत"
                            : "Verified Sources"}
                        </h3>
                        <div className="space-y-3">
                          {report.verifiedSources.map((source, index) => (
                            <div
                              key={source._id || index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium">{source.name}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {source.type}
                                    </Badge>
                                    {source.credibilityScore && (
                                      <span>
                                        Credibility: {source.credibilityScore}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={source.url} target="_blank">
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Impact Tab */}
                  <TabsContent value="impact" className="space-y-6 pt-4">
                    {/* Reach Statistics */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === "hi"
                            ? "पहुंच और प्रभाव"
                            : "Reach & Impact"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {report.impact && (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-700">
                                  {report.impact.reach.toLocaleString()}
                                </div>
                                <div className="text-sm text-blue-600">
                                  {language === "hi"
                                    ? "लोगों तक पहुंच"
                                    : "People Reached"}
                                </div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-700">
                                  {report.impact.countries.length}
                                </div>
                                <div className="text-sm text-green-600">
                                  {language === "hi" ? "देश" : "Countries"}
                                </div>
                              </div>
                              <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-700">
                                  {report.impact.duration}
                                </div>
                                <div className="text-sm text-orange-600">
                                  {language === "hi"
                                    ? "वायरल अवधि"
                                    : "Viral Duration"}
                                </div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-700">
                                  {report.impact.platforms.length}
                                </div>
                                <div className="text-sm text-purple-600">
                                  {language === "hi" ? "प्लेटफॉर्म" : "Platforms"}
                                </div>
                              </div>
                            </div>

                            {/* Platforms Distribution */}
                            <div>
                              <h4 className="font-semibold mb-2">
                                {language === "hi"
                                  ? "प्लेटफॉर्म वितरण"
                                  : "Platform Distribution"}
                              </h4>
                              <div className="space-y-2">
                                {report.impact.platforms.map((platform, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between"
                                  >
                                    <span className="text-sm">{platform}</span>
                                    <div className="w-48 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-red-600 h-2 rounded-full"
                                        style={{
                                          width: platform.includes("(") 
                                            ? `${parseInt(platform.split("(")[1])}%`
                                            : "30%"
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Countries */}
                            <div>
                              <h4 className="font-semibold mb-2">
                                {language === "hi"
                                  ? "प्रभावित देश"
                                  : "Affected Countries"}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {report.impact.countries.map((country, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="gap-1"
                                  >
                                    <Globe className="h-3 w-3" />
                                    {country}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Spread Platforms */}
                    {report.spreadPlatforms && report.spreadPlatforms.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {language === "hi"
                              ? "फैलाव के माध्यम"
                              : "Spread Through"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-3">
                            {report.spreadPlatforms.map((platform, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="gap-2"
                              >
                                {platform === "WhatsApp" && (
                                  <MessageCircle className="h-4 w-4" />
                                )}
                                {platform === "Facebook" && (
                                  <div className="h-4 w-4">f</div>
                                )}
                                {platform === "Twitter" && (
                                  <div className="h-4 w-4">𝕏</div>
                                )}
                                {platform === "YouTube" && (
                                  <Video className="h-4 w-4" />
                                )}
                                {platform === "Telegram" && (
                                  <Send className="h-4 w-4" />
                                )}
                                {platform === "whatsapp" && (
                                  <MessageCircle className="h-4 w-4" />
                                )}
                                {platform === "twitter" && (
                                  <div className="h-4 w-4">𝕏</div>
                                )}
                                {platform === "instagram" && (
                                  <div className="h-4 w-4">IG</div>
                                )}
                                {platform === "youtube" && (
                                  <Video className="h-4 w-4" />
                                )}
                                {platform === "telegram" && (
                                  <Send className="h-4 w-4" />
                                )}
                                {platform === "tiktok" && (
                                  <div className="h-4 w-4">TT</div>
                                )}
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Ad - Middle */}
                <div className="my-6">
                  <GoogleAdSense
                    adSlot="728x90_report_middle"
                    adFormat="horizontal"
                    fullWidthResponsive={true}
                    className="w-full"
                  />
                </div>

                {/* Helpful Section */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2">
                        {language === "hi"
                          ? "क्या यह तथ्य-जाँच मददगार थी?"
                          : "Was this fact-check helpful?"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {language === "hi"
                          ? "अपना वोट दें और दूसरों को सच्चाई जानने में मदद करें"
                          : "Cast your vote and help others know the truth"}
                      </p>
                      <Button
                        variant={report.hasVoted === "helpful" ? "default" : "outline"}
                        className="gap-2"
                        onClick={() => handleVote("helpful")}
                        disabled={isVoting || report.hasVoted === "helpful"}
                      >
                        {isVoting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsUp className="h-4 w-4" />
                        )}
                        {report.hasVoted === "helpful" ? "Thanks for voting!" : "Helpful"}
                        <Badge variant="secondary" className="ml-2">
                          {report.helpfulVotes + (report.hasVoted === "helpful" ? 0 : (isVoting ? 1 : 0))}
                        </Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Related Reports (Placeholder - You might want to fetch related reports separately) */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === "hi" ? "संबंधित रिपोर्ट्स" : "Related Reports"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Placeholder for related reports */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-2">
                      Medium Risk
                    </Badge>
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {language === "hi" ? "अन्य फेक न्यूज रिपोर्ट" : "Other Fake News Report"}
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/fake-news">
                        {language === "hi" ? "रिपोर्ट देखें" : "View Report"}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fact Checker Profile */}
            {report.factChecker && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "hi" ? "तथ्य-जाँचकर्ता" : "Fact Checker"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage 
                      src={report.factChecker.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=FactChecker"} 
                    />
                    <AvatarFallback>FC</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{report.factChecker.name}</h3>
                  {report.factChecker.experience && (
                    <p className="text-sm text-gray-600 mb-3">
                      {report.factChecker.experience} experience
                    </p>
                  )}
                  {report.factChecker.expertise && report.factChecker.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {report.factChecker.expertise.map((exp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="bg-gray-100 rounded-lg p-3 mb-3">
                    <div className="text-2xl font-bold text-red-600">
                      {report.factChecker.verifiedChecks}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === "hi" ? "सत्यापित जाँच" : "Verified Checks"}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    {language === "hi" ? "संपर्क करें" : "Contact"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Debunked By */}
            {report.debunkedBy && report.debunkedBy.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "hi" ? "डिबंक किया गया" : "Debunked By"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {report.debunkedBy.map((org, index) => (
                    <div
                      key={org._id || index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          {org.expertise && (
                            <p className="text-xs text-gray-500">{org.expertise}</p>
                          )}
                        </div>
                      </div>
                      {org.verificationDate && (
                        <Badge variant="outline" className="text-xs">
                          {new Date(org.verificationDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Bookmark Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "hi" ? "बुकमार्क स्थिति" : "Bookmark Status"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
                    isBookmarked ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isBookmarked ? (
                      <BookmarkCheck className="h-8 w-8 fill-current" />
                    ) : (
                      <Bookmark className="h-8 w-8" />
                    )}
                  </div>
                  <h3 className="font-semibold">
                    {isBookmarked 
                      ? (language === "hi" ? "बुकमार्क किया गया है" : "Bookmarked")
                      : (language === "hi" ? "बुकमार्क नहीं किया गया" : "Not Bookmarked")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isBookmarked
                      ? (language === "hi" 
                          ? "यह रिपोर्ट आपके बुकमार्क में सहेजी गई है।" 
                          : "This report is saved in your bookmarks.")
                      : (language === "hi"
                          ? "इस रिपोर्ट को बुकमार्क करने के लिए बटन पर क्लिक करें।"
                          : "Click the button to bookmark this report.")}
                  </p>
                  <Button
                    variant={isBookmarked ? "destructive" : "default"}
                    className="w-full gap-2"
                    onClick={toggleBookmark}
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkX className="h-4 w-4" />
                        {language === "hi" ? "बुकमार्क हटाएं" : "Remove Bookmark"}
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        {language === "hi" ? "बुकमार्क जोड़ें" : "Add Bookmark"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/fake-news?tab=bookmarked">
                      {language === "hi" ? "सभी बुकमार्क देखें" : "View All Bookmarks"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Tools */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "hi" ? "रिपोर्ट टूल्स" : "Report Tools"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open(`/report/${report._id}`, '_blank')}
                >
                  <Smartphone className="h-4 w-4" />
                  {language === "hi" ? "ऐप पर रिपोर्ट करें" : "Report on App"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={async () => {
                    await shareOnPlatform("email");
                  }}
                >
                  <Mail className="h-4 w-4" />
                  {language === "hi" ? "ईमेल रिपोर्ट" : "Email Report"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    toast.info(language === "hi" 
                      ? "डाउनलोड शुरू हो रहा है..." 
                      : "Download starting..."
                    );
                  }}
                >
                  <Download className="h-4 w-4" />
                  {language === "hi" ? "सबूत डाउनलोड" : "Download Evidence"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={copyToClipboard}
                >
                  <LinkIcon className="h-4 w-4" />
                  {language === "hi" ? "शॉर्ट लिंक" : "Short Link"}
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{language === "hi" ? "टैग" : "Tags"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-300"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ad Space */}
            <div className="space-y-4">
              <GoogleAdSense
                adSlot="300x250_report_sidebar_top"
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
              <GoogleAdSense
                adSlot="300x250_report_sidebar_bottom"
                adFormat="rectangle"
                fullWidthResponsive={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal />

      <PublicFooter />
    </div>
  );
};

export default FakeNewsReportPage;