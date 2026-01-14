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
  Newspaper,
  Search,
  Menu,
  X,
  Mic,
  Tv,
  Filter,
  ChevronRight as ChevronRightIcon,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
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
import Marquee from "react-fast-marquee";

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

// Helper function to extract text from markdown/HTML
const extractTextFromMarkdown = (text: string) => {
  if (!text) return "";
  // Remove HTML tags
  let plainText = text.replace(/<[^>]*>/g, ' ');
  // Remove markdown formatting
  plainText = plainText.replace(/#+|\*+|\n+/g, ' ');
  // Collapse multiple spaces
  plainText = plainText.replace(/\s+/g, ' ').trim();
  return plainText;
};

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // News ticker items for header
  const newsTickerItems = [
    { id: 1, text: "Breaking: New AI-generated deepfake videos detected spreading on social media platforms" },
    { id: 2, text: "Fact Check: Viral claim about free electricity scheme found to be completely false" },
    { id: 3, text: "Alert: New misinformation campaign targeting health sector identified" },
    { id: 4, text: "Update: Government releases new guidelines for identifying fake news" },
    { id: 5, text: "Report: 67% increase in political misinformation during election season" },
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
      ? `${report.titleHi}\n\n❌ झूठा दावा: ${extractTextFromMarkdown(report.fakeClaimHi).substring(0, 200)}...\n✅ सत्यापित तथ्य: ${extractTextFromMarkdown(report.factCheckHi).substring(0, 200)}...`
      : `${report.title}\n\n❌ False Claim: ${extractTextFromMarkdown(report.fakeClaim).substring(0, 200)}...\n✅ Verified Fact: ${extractTextFromMarkdown(report.factCheck).substring(0, 200)}...`;
    
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
      ? `${report.titleHi}\n\n❌ झूठा दावा: ${extractTextFromMarkdown(report.fakeClaimHi).substring(0, 200)}...\n✅ सत्यापित तथ्य: ${extractTextFromMarkdown(report.factCheckHi).substring(0, 200)}...`
      : `${report.title}\n\n❌ False Claim: ${extractTextFromMarkdown(report.fakeClaim).substring(0, 200)}...\n✅ Verified Fact: ${extractTextFromMarkdown(report.factCheck).substring(0, 200)}...`;
    
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

  // Function to render markdown text with all formatting
  const renderMarkdownText = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements = [];
    
    let inList = false;
    let listItems = [];
    let listIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Skip empty lines but add space
      if (line.trim() === '') {
        if (inList && listItems.length > 0) {
          elements.push(
            <ul key={`list-${i}`} className="list-disc pl-5 mb-3">
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
          listIndex = 0;
        }
        elements.push(<br key={`br-${i}`} />);
        continue;
      }
      
      // Handle headings
      if (line.startsWith('#🔍')) {
        const headingText = line.replace('#🔍', '').trim();
        elements.push(
          <h1 key={i} className="text-2xl md:text-3xl font-bold mb-4 mt-6 text-gray-900">
            {headingText}
          </h1>
        );
        continue;
      }
      
      if (line.startsWith('## ')) {
        const headingText = line.replace('## ', '').trim();
        elements.push(
          <h2 key={i} className="text-xl md:text-2xl font-bold mb-3 mt-5 text-gray-800">
            {headingText}
          </h2>
        );
        continue;
      }
      
      if (line.startsWith('### ')) {
        const headingText = line.replace('### ', '').trim();
        elements.push(
          <h3 key={i} className="text-lg md:text-xl font-semibold mb-2 mt-4 text-gray-700">
            {headingText}
          </h3>
        );
        continue;
      }
      
      // Handle special colored headings with emojis
      if (line.includes('**❌') || line.includes('**✅') || line.includes('**⚠')) {
        const isRed = line.includes('**❌');
        const isGreen = line.includes('**✅');
        const isOrange = line.includes('**⚠');
        
        let headingText = line.replace(/\*\*/g, '').trim();
        
        elements.push(
          <h3 key={i} className={`text-lg font-bold mb-3 mt-4 ${isRed ? 'text-red-700' : isGreen ? 'text-green-700' : 'text-orange-700'}`}>
            {headingText}
          </h3>
        );
        continue;
      }
      
      // Handle list items
      if (line.trim().startsWith('- ') || /^\d+\.\s/.test(line.trim())) {
        inList = true;
        let listContent = line.trim().replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
        
        // Process bold and italic within list items
        const processedContent = processBoldAndItalic(listContent);
        listItems.push(<li key={`li-${listIndex++}`} className="mb-1">{processedContent}</li>);
        continue;
      }
      
      // If we were in a list and now we're not, render the list
      if (inList && !line.trim().startsWith('- ') && !/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <ul key={`list-${i}`} className="list-disc pl-5 mb-3">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
        listIndex = 0;
      }
      
      // Process regular text with bold and italic
      const processedLine = processBoldAndItalic(line);
      elements.push(<p key={i} className="mb-3 whitespace-pre-wrap">{processedLine}</p>);
    }
    
    // If we ended with a list, render it
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="list-end" className="list-disc pl-5 mb-3">
          {listItems}
        </ul>
      );
    }
    
    return <div className="prose max-w-none">{elements}</div>;
  };

  // Helper function to process bold and italic text
  const processBoldAndItalic = (text: string) => {
    // First process bold text
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    const processedParts = parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** from bold text
        const boldText = part.slice(2, -2);
        
        // Check if bold text contains italic markers
        if (boldText.includes('*') && !boldText.startsWith('*') && !boldText.endsWith('*')) {
          const italicParts = boldText.split(/(\*[^*]+\*)/g);
          return (
            <strong key={index} className="font-bold">
              {italicParts.map((italicPart, idx) => {
                if (italicPart.startsWith('*') && italicPart.endsWith('*')) {
                  const italicText = italicPart.slice(1, -1);
                  return <em key={idx} className="italic">{italicText}</em>;
                }
                return italicPart;
              })}
            </strong>
          );
        }
        
        return <strong key={index} className="font-bold">{boldText}</strong>;
      }
      
      // Process italic text that's not inside bold
      if (part.includes('*') && !part.includes('**')) {
        const italicParts = part.split(/(\*[^*]+\*)/g);
        return italicParts.map((italicPart, idx) => {
          if (italicPart.startsWith('*') && italicPart.endsWith('*')) {
            const italicText = italicPart.slice(1, -1);
            return <em key={`${index}-${idx}`} className="italic">{italicText}</em>;
          }
          return italicPart;
        });
      }
      
      return part;
    });
    
    return processedParts;
  };

  // Function to render HTML content with images
  const renderHTMLContent = (content: string) => {
    if (!content) return null;
    
    // Check if content contains HTML or images
    if (content.includes('<') || content.includes('image-container')) {
      // Split by lines to process each line separately
      const lines = content.split('\n');
      const elements = [];
      
      let inHtmlBlock = false;
      let htmlBuffer = [];
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Check if line contains HTML
        if (line.includes('<')) {
          inHtmlBlock = true;
          htmlBuffer.push(line);
          
          // Check if this is the end of HTML block
          if (line.includes('</div>') || line.includes('</img>') || line.includes('</p>')) {
            inHtmlBlock = false;
            const htmlContent = htmlBuffer.join('\n');
            htmlBuffer = [];
            
            // Parse HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Check for images
            const images = doc.querySelectorAll('img');
            if (images.length > 0) {
              images.forEach((img, imgIndex) => {
                const src = img.getAttribute('src');
                const alt = img.getAttribute('alt') || 'Fact check image';
                if (src) {
                  elements.push(
                    <div key={`img-${i}-${imgIndex}`} className="my-6 text-center">
                      <div className="relative h-64 w-full max-w-2xl mx-auto rounded-lg overflow-hidden">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-contain"
                          unoptimized={src.includes('http')}
                        />
                      </div>
                      {alt && alt !== 'huih' && alt !== 'prof...' && (
                        <p className="text-sm text-gray-600 mt-2">{alt}</p>
                      )}
                    </div>
                  );
                }
              });
            }
            
            // Check for other HTML content
            const textContent = doc.body.textContent?.trim();
            if (textContent && textContent.length > 0) {
              elements.push(<p key={`html-text-${i}`} className="mb-3">{textContent}</p>);
            }
          }
          continue;
        }
        
        // If not in HTML block, process as markdown
        if (!inHtmlBlock) {
          const processedLine = renderMarkdownText(line);
          if (processedLine) {
            elements.push(<div key={`line-${i}`}>{processedLine}</div>);
          }
        }
      }
      
      // If we ended in an HTML block, process it
      if (inHtmlBlock && htmlBuffer.length > 0) {
        const htmlContent = htmlBuffer.join('\n');
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        const images = doc.querySelectorAll('img');
        if (images.length > 0) {
          images.forEach((img, imgIndex) => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || 'Fact check image';
            if (src) {
              elements.push(
                <div key={`img-end-${imgIndex}`} className="my-6 text-center">
                  <div className="relative h-64 w-full max-w-2xl mx-auto rounded-lg overflow-hidden">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-contain"
                      unoptimized={src.includes('http')}
                    />
                  </div>
                  {alt && alt !== 'huih' && alt !== 'prof...' && (
                    <p className="text-sm text-gray-600 mt-2">{alt}</p>
                  )}
                </div>
              );
            }
          });
        }
      }
      
      return <div className="prose max-w-none">{elements}</div>;
    }
    
    // If no HTML, render as markdown text
    return renderMarkdownText(content);
  };

  // Function to render fact check content
  const renderFactCheckContent = (content: string) => {
    if (!content) return null;
    
    // Check if content contains images
    if (content.includes('<img') || content.includes('image-container')) {
      return renderHTMLContent(content);
    }
    
    // Otherwise render as markdown
    return renderMarkdownText(content);
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

  // Professional Header Component
  const ProfessionalHeader = () => {
    return (
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
                <Marquee className="w-full">
                  <div className="">
                    {newsTickerItems.map((item) => (
                      <span key={item.id} className="mx-8">
                        {item.text}
                      </span>
                    ))}
                  </div>
                </Marquee>
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
                    <span className="text-red-600">FACT</span>OR
                    <span className="text-blue-600">FAKE</span>
                  </h1>
                  <p className="text-xs text-gray-600">Truth Above Everything</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {language === "hi" ? "होम" : "Home"}
              </Link>
              <Link href="/fake-news" className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">
                {language === "hi" ? "फेक न्यूज डिबंकर" : "Fake News Debunker"}
              </Link>
              <Link href="/fact-check" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {language === "hi" ? "तथ्य जाँच" : "Fact Check"}
              </Link>
              <Link href="/reports" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {language === "hi" ? "रिपोर्ट्स" : "Reports"}
              </Link>
              <Link href="/about-us" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {language === "hi" ? "हमारे बारे में" : "About Us"}
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {language === "hi" ? "संपर्क" : "Contact"}
              </Link>
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={language === "hi" ? "तथ्य जाँच खोजें..." : "Search fact checks..."}
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
                  {language === "hi" ? "होम" : "Home"}
                </Link>
                <Link href="/fake-news" className="text-red-600 font-semibold py-2">
                  {language === "hi" ? "फेक न्यूज डिबंकर" : "Fake News Debunker"}
                </Link>
                <Link href="/fact-check" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  {language === "hi" ? "तथ्य जाँच" : "Fact Check"}
                </Link>
                <Link href="/reports" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  {language === "hi" ? "रिपोर्ट्स" : "Reports"}
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  {language === "hi" ? "हमारे बारे में" : "About Us"}
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium py-2">
                  {language === "hi" ? "संपर्क" : "Contact"}
                </Link>
                <div className="pt-4 border-t">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={language === "hi" ? "तथ्य जाँच खोजें..." : "Search fact checks..."}
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
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader />
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
        <ProfessionalHeader />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />

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
                        {language === "hi" 
                          ? report.category === "political" ? "राजनीति" 
                            : report.category === "health" ? "स्वास्थ्य"
                            : report.category === "technology" ? "टेक्नोलॉजी"
                            : report.category === "entertainment" ? "मनोरंजन"
                            : report.category === "social" ? "सामाजिक"
                            : "अन्य"
                          : report.category.charAt(0).toUpperCase() + report.category.slice(1)}
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
                    <div className="text-red-900">
                      {renderMarkdownText(
                        language === "hi" ? report.fakeClaimHi : report.fakeClaim
                      )}
                    </div>
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
                    <div className="text-green-900">
                      {renderFactCheckContent(
                        language === "hi" ? report.factCheckHi : report.factCheck
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h3 className="font-bold text-lg text-blue-800 mb-3">
                    {language === "hi" ? "त्वरित सारांश" : "Quick Summary"}
                  </h3>
                  <div className="text-blue-900">
                    {renderMarkdownText(
                      language === "hi" ? report.explanationHi : report.explanation
                    )}
                  </div>
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
                          {report.preventionTips.map((tip, index) => (
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
                                  src={report.visualComparison.original}
                                  alt="Original"
                                  fill
                                  className="object-cover"
                                  unoptimized={report.visualComparison.original.includes('http')}
                                />
                              </div>
                              <p className="font-medium text-green-700">
                                {language === "hi"
                                  ? "मूल वीडियो/छवि"
                                  : "Original Video/Image"}
                              </p>
                            </div>
                          )}
                          {report.visualComparison.manipulated && (
                            <div className="text-center">
                              <div className="relative h-48 w-full mb-2 rounded-lg overflow-hidden">
                                <Image
                                  src={report.visualComparison.manipulated}
                                  alt="Manipulated"
                                  fill
                                  className="object-cover"
                                  unoptimized={report.visualComparison.manipulated.includes('http')}
                                />
                              </div>
                              <p className="font-medium text-red-700">
                                {language === "hi"
                                  ? "हेरफेर वाला वीडियो/छवि"
                                  : "Manipulated Video/Image"}
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
                              {/* Show image preview for image evidence */}
                              {item.type === "image" && item.url && (
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                  <Image
                                    src={item.url}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={item.url.includes('http')}
                                  />
                                </div>
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
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  {language === "hi"
                                    ? "सबूत देखें"
                                    : "View Evidence"}
                                </a>
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
                        {renderHTMLContent(
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
                                        {language === "hi" ? "विश्वसनीयता:" : "Credibility:"} {source.credibilityScore}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" asChild>
                                <a href={source.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
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
                                    <span className="text-sm capitalize">{platform}</span>
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
                                className="gap-2 capitalize"
                              >
                                {platform === "whatsapp" && (
                                  <MessageCircle className="h-4 w-4" />
                                )}
                                {platform === "facebook" && (
                                  <Facebook className="h-4 w-4" />
                                )}
                                {platform === "twitter" && (
                                  <Twitter className="h-4 w-4" />
                                )}
                                {platform === "youtube" && (
                                  <Video className="h-4 w-4" />
                                )}
                                {platform === "instagram" && (
                                  <div className="h-4 w-4">IG</div>
                                )}
                                {platform === "tiktok" && (
                                  <div className="h-4 w-4">TT</div>
                                )}
                                {platform === "linkedin" && (
                                  <Linkedin className="h-4 w-4" />
                                )}
                                {platform === "telegram" && (
                                  <Send className="h-4 w-4" />
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
                        {report.hasVoted === "helpful" ? (language === "hi" ? "वोट के लिए धन्यवाद!" : "Thanks for voting!") : (language === "hi" ? "सहायक" : "Helpful")}
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
                      {language === "hi" ? "मध्यम जोखिम" : "Medium Risk"}
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
                      src={report.factChecker.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                    />
                    <AvatarFallback>FC</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{report.factChecker.name}</h3>
                  {report.factChecker.experience && (
                    <p className="text-sm text-gray-600 mb-3">
                      {report.factChecker.experience} {language === "hi" ? "अनुभव" : "experience"}
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