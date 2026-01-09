"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Eye,
  Calendar,
  Globe,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  User,
  FileText,
  Shield,
  BarChart,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Tag,
  Link as LinkIcon,
  Image,
  Video,
  File,
  Volume2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface FakeNewsDetail {
  _id: string;
  title: string;
  titleHi: string;
  fakeClaim: string;
  fakeClaimHi: string;
  factCheck: string;
  factCheckHi: string;
  explanation: string;
  explanationHi: string;
  detailedAnalysis: string;
  detailedAnalysisHi: string;
  evidence: {
    type: string;
    url: string;
    title: string;
    description: string;
    timestamp: string;
    _id: string;
  }[];
  category: string;
  severity: string;
  origin: string;
  spreadPlatforms: string[];
  debunkedBy: {
    name: string;
    logo: string;
    expertise: string;
    verificationDate: string;
    _id: string;
  }[];
  debunkedAt: string;
  verifiedSources: {
    name: string;
    url: string;
    type: string;
    credibilityScore: number;
    _id: string;
  }[];
  tags: string[];
  timeline: {
    date: string;
    event: string;
    description: string;
    _id: string;
  }[];
  visualComparison: {
    original: string;
    manipulated: string;
    analysis: string;
    _id: string;
  };
  impact: {
    reach: number;
    countries: string[];
    platforms: string[];
    duration: string;
    _id: string;
  };
  preventionTips: string[];
  factChecker: {
    name: string;
    avatar: string;
    expertise: string[];
    experience: string;
    verifiedChecks: number;
    _id: string;
  };
  views: number;
  shares: number;
  helpfulVotes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const severityOptions = [
  {
    value: "low",
    label: "Low",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "medium",
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "high",
    label: "High",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    value: "critical",
    label: "Critical",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

const statusOptions = [
  {
    value: "draft",
    label: "Draft",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    value: "published",
    label: "Published",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "archived",
    label: "Archived",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
];

const evidenceIcons = {
  image: Image,
  video: Video,
  document: File,
  link: LinkIcon,
  audio: Volume2,
};

export default function FakeNewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [report, setReport] = useState<FakeNewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const reportId = params.id as string;

  // Fetch report details
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("admin-token");
        if (!token) {
          toast.error("Please login to view report details");
          router.push("/admin/login");
          return;
        }

        const response = await fetch(`/api/admin/fake-news/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("admin-token");
            router.push("/admin/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setReport(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report details");
        router.push("/admin/fake-news");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId, router]);

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    const option = severityOptions.find((s) => s.value === severity);
    return (
      <Badge className={`${option?.color} border`}>
        {option?.label || severity}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((s) => s.value === status);
    return (
      <Badge className={`${option?.color} border`}>
        {option?.label || status}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch {
      return dateString;
    }
  };

  // Get evidence icon
  const getEvidenceIcon = (type: string) => {
    const Icon = evidenceIcons[type as keyof typeof evidenceIcons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="text-gray-600">Loading report details...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Report not found
          </h2>
          <p className="text-gray-500 mt-2">
            The report you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/admin/fake-news")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/fake-news")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Report Details</h1>
            <p className="text-muted-foreground">
              Complete overview of the fake news report
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getSeverityBadge(report.severity)}
          {getStatusBadge(report.status)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Views</p>
                <p className="text-2xl font-bold">
                  {report.views.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Shares</p>
                <p className="text-2xl font-bold">
                  {report.shares.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Helpful Votes
                </p>
                <p className="text-2xl font-bold">
                  {report.helpfulVotes.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-lg font-semibold">
                  {formatDate(report.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Impact
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Title (English)
                  </p>
                  <p className="text-lg font-semibold">{report.title}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Title (Hindi)
                  </p>
                  <p className="text-lg font-semibold">{report.titleHi}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <Badge variant="outline" className="text-sm">
                    {report.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Origin</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{report.origin}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Fake Claim</p>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 mb-1">English</p>
                        <p>{report.fakeClaim}</p>
                        <p className="font-medium text-red-700 mt-3 mb-1">
                          Hindi
                        </p>
                        <p>{report.fakeClaimHi}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Fact Check</p>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-700 mb-1">
                          English
                        </p>
                        <p>{report.factCheck}</p>
                        <p className="font-medium text-green-700 mt-3 mb-1">
                          Hindi
                        </p>
                        <p>{report.factCheckHi}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.timeline.map((item, index) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      {index < report.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">
                        {item.event}
                      </h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Explanation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        English
                      </p>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p>{report.explanation}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Hindi</p>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p>{report.explanationHi}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Detailed Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">
                        English
                      </p>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p>{report.detailedAnalysis}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Hindi</p>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p>{report.detailedAnalysisHi}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>
                Supporting evidence for the fact check
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.evidence.map((item) => (
                  <Card key={item._id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getEvidenceIcon(item.type)}
                          <span className="font-medium capitalize">
                            {item.type}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {item.timestamp
                            ? formatDate(item.timestamp)
                            : "No timestamp"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      {item.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.url, "_blank")}
                          className="w-full"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Evidence
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {report.visualComparison && (
            <Card>
              <CardHeader>
                <CardTitle>Visual Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">
                      Original
                    </p>
                    {report.visualComparison.original ? (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                        <p className="ml-2">Image available at URL</p>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">
                      Manipulated
                    </p>
                    {report.visualComparison.manipulated ? (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                        <p className="ml-2">Image available at URL</p>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                  </div>
                </div>
                {report.visualComparison.analysis && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">
                      Analysis
                    </p>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p>{report.visualComparison.analysis}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Estimated Reach
                  </p>
                  <p className="text-3xl font-bold">
                    {report.impact.reach.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">people</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-lg font-semibold">
                      {report.impact.duration}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Countries Affected
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {report.impact.countries.map((country) => (
                      <Badge key={country} variant="outline">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Platforms Where It Spread
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.impact.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prevention Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.preventionTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debunked By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.debunkedBy.map((debunker) => (
                  <Card key={debunker._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {debunker.logo ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {/* In production, use next/image */}
                            <img
                              src={debunker.logo}
                              alt={debunker.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">
                            {debunker.name}
                          </h4>
                          <p className="text-gray-600 mb-2">
                            {debunker.expertise}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Verified on {debunker.verificationDate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verified Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.verifiedSources.map((source) => (
                  <div
                    key={source._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <LinkIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{source.name}</h4>
                        <p className="text-sm text-gray-600">{source.url}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{source.type}</Badge>
                          <div className="flex items-center gap-1">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${source.credibilityScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {source.credibilityScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(source.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spread Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Platforms Where Initially Spread
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.spreadPlatforms.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fact Checker Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                {report.factChecker.avatar ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={report.factChecker.avatar}
                      alt={report.factChecker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    {report.factChecker.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {report.factChecker.experience}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Expertise
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {report.factChecker.expertise.map((exp, index) => (
                          <Badge key={index} variant="outline">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Verified Checks
                      </p>
                      <p className="text-2xl font-bold">
                        {report.factChecker.verifiedChecks.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Last updated: {formatDate(report.updatedAt)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Navigate to edit page or open edit modal
              router.push(`/admin/fake-news/edit/${report._id}`);
            }}
          >
            Edit Report
          </Button>
          <Button
            variant="default"
            onClick={() => {
              // Share or publish action
              toast.info("Share functionality would be implemented here");
            }}
          >
            Share Report
          </Button>
        </div>
      </div>
    </div>
  );
}
