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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  Globe,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  ExternalLink,
  User,
  FileText,
  Shield,
  BarChart,
  TrendingUp,
  Users,
  Clock,
  Tag,
  Link as LinkIcon,
  Image,
  Video,
  File,
  Volume2,
  BookOpen,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import FakeNewsForm from "@/components/admin/fake-news-form";
import { CategoryOption, FakeNewsFormData, FakeNewsReport } from "@/lib/mock-data/fake-type";

interface EditFakeNewsPageProps {
  categories: CategoryOption[];
}

export default function EditFakeNewsPage({ categories }: EditFakeNewsPageProps) {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FakeNewsFormData | null>(null);
  const [originalReport, setOriginalReport] = useState<FakeNewsReport | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch report details
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem("admin-token");
        if (!token) {
          toast.error("Please login to edit report");
          router.push("/admin/login");
          return;
        }

        const response = await fetch(`/api/admin/fake-news/${reportId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
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
          const report = data.data;
          setOriginalReport(report);
          
          // Convert to form data
          const formData: FakeNewsFormData = {
            title: report.title || "",
            titleHi: report.titleHi || "",
            fakeClaim: report.fakeClaim || "",
            fakeClaimHi: report.fakeClaimHi || "",
            factCheck: report.factCheck || "",
            factCheckHi: report.factCheckHi || "",
            explanation: report.explanation || "",
            explanationHi: report.explanationHi || "",
            detailedAnalysis: report.detailedAnalysis || "",
            detailedAnalysisHi: report.detailedAnalysisHi || "",
            evidence: report.evidence?.map(e => ({
              type: e.type || "image",
              url: e.url || "",
              title: e.title || "",
              description: e.description || "",
              timestamp: e.timestamp || "",
            })) || [],
            category: report.category || "political",
            severity: report.severity || "medium",
            origin: report.origin || "",
            spreadPlatforms: report.spreadPlatforms || [],
            debunkedBy: report.debunkedBy?.map(d => ({
              name: d.name || "",
              logo: d.logo || "",
              expertise: d.expertise || "",
              verificationDate: d.verificationDate || "",
            })) || [],
            debunkedAt: report.debunkedAt ? new Date(report.debunkedAt).toISOString().split('T')[0] : "",
            verifiedSources: report.verifiedSources?.map(s => ({
              name: s.name || "",
              url: s.url || "",
              type: s.type || "government",
              credibilityScore: s.credibilityScore || 100,
            })) || [],
            tags: report.tags || [],
            timeline: report.timeline?.map(t => ({
              date: t.date || "",
              event: t.event || "",
              description: t.description || "",
            })) || [],
            visualComparison: report.visualComparison ? {
              original: report.visualComparison.original || "",
              manipulated: report.visualComparison.manipulated || "",
              analysis: report.visualComparison.analysis || "",
            } : {
              original: "",
              manipulated: "",
              analysis: "",
            },
            impact: report.impact ? {
              reach: report.impact.reach || 0,
              countries: report.impact.countries || [],
              platforms: report.impact.platforms || [],
              duration: report.impact.duration || "",
            } : {
              reach: 0,
              countries: [],
              platforms: [],
              duration: "",
            },
            preventionTips: report.preventionTips || [],
            factChecker: report.factChecker ? {
              name: report.factChecker.name || "",
              avatar: report.factChecker.avatar || "",
              expertise: report.factChecker.expertise || [],
              experience: report.factChecker.experience || "",
              verifiedChecks: report.factChecker.verifiedChecks || 0,
            } : {
              name: "",
              avatar: "",
              expertise: [],
              experience: "",
              verifiedChecks: 0,
            },
            status: report.status || "draft",
          };
          
          setFormData(formData);
        } else {
          throw new Error(data.message || "Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report for editing");
        router.push("/admin/fake-news");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId, router]);

  // Handle form change
  const handleFormChange = (data: FakeNewsFormData) => {
    setFormData(data);
    setFormErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData) return false;

    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) errors.title = "Title (English) is required";
    if (!formData.titleHi?.trim()) errors.titleHi = "Title (Hindi) is required";
    if (!formData.fakeClaim?.trim()) errors.fakeClaim = "Fake Claim (English) is required";
    if (!formData.fakeClaimHi?.trim()) errors.fakeClaimHi = "Fake Claim (Hindi) is required";
    if (!formData.factCheck?.trim()) errors.factCheck = "Fact Check (English) is required";
    if (!formData.factCheckHi?.trim()) errors.factCheckHi = "Fact Check (Hindi) is required";
    if (!formData.explanation?.trim()) errors.explanation = "Explanation (English) is required";
    if (!formData.explanationHi?.trim()) errors.explanationHi = "Explanation (Hindi) is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.severity) errors.severity = "Severity is required";
    if (!formData.origin?.trim()) errors.origin = "Origin is required";
    if (!formData.debunkedAt) errors.debunkedAt = "Debunked Date is required";

    // Validate evidence
    formData.evidence.forEach((evidence, index) => {
      if (!evidence.url?.trim()) errors[`evidence_${index}_url`] = `Evidence ${index + 1} URL is required`;
      if (!evidence.title?.trim()) errors[`evidence_${index}_title`] = `Evidence ${index + 1} Title is required`;
      if (!evidence.description?.trim()) errors[`evidence_${index}_description`] = `Evidence ${index + 1} Description is required`;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!formData || !originalReport) return;

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setSaving(true);
      
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/admin/fake-news/${originalReport._id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Failed to update: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || "Failed to update report");
      }

      toast.success("Report updated successfully");
      
      // Navigate to view page or stay on edit page
      const shouldNavigate = window.confirm("Report updated successfully! Would you like to view the updated report?");
      if (shouldNavigate) {
        router.push(`/admin/fake-news/${originalReport._id}`);
      } else {
        // Refresh the form with updated data
        const updatedReport = data.data;
        setOriginalReport(updatedReport);
        toast.info("You can continue editing. Changes have been saved.");
      }

    } catch (error) {
      console.error("Error updating report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update report");
    } finally {
      setSaving(false);
    }
  };

  // Handle discard changes
  const handleDiscard = () => {
    if (!originalReport) return;
    
    if (window.confirm("Are you sure you want to discard all changes?")) {
      // Reload the page to reset form
      window.location.reload();
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (!originalReport) return;
    router.push(`/admin/fake-news/${originalReport._id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="text-gray-600">Loading report for editing...</span>
        </div>
      </div>
    );
  }

  if (!formData || !originalReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Report not found</h2>
          <p className="text-gray-500 mt-2">The report you're trying to edit doesn't exist.</p>
          <Button onClick={() => router.push("/admin/fake-news")} className="mt-4">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <h1 className="text-2xl md:text-3xl font-bold">Edit Fake News Report</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">Editing: {originalReport.title}</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                ID: {originalReport._id.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={saving}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
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
                <p className="text-2xl font-bold">{originalReport.views?.toLocaleString() || 0}</p>
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
                <p className="text-2xl font-bold">{originalReport.shares?.toLocaleString() || 0}</p>
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
                <p className="text-sm font-medium text-gray-500">Helpful Votes</p>
                <p className="text-2xl font-bold">{originalReport.helpfulVotes?.toLocaleString() || 0}</p>
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
                  {originalReport.createdAt ? format(new Date(originalReport.createdAt), "MMM d, yyyy") : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Edit Report Details</CardTitle>
              <CardDescription>
                Update all the information for this fake news report
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Quick status update buttons
                  const newStatus = originalReport.status === "draft" ? "published" : "draft";
                  const token = localStorage.getItem("admin-token");
                  
                  fetch(`/api/admin/fake-news/${originalReport._id}`, {
                    method: "PATCH",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        toast.success(`Status changed to ${newStatus}`);
                        setFormData(prev => prev ? { ...prev, status: newStatus } : prev);
                      }
                    })
                    .catch(console.error);
                }}
              >
                {originalReport.status === "draft" ? "Publish" : "Unpublish"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(formErrors).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the following errors:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {Object.entries(formErrors).map(([field, message]) => (
                    <li key={field} className="text-sm">{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-6">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Sources
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Fake Claim</CardTitle>
                    <CardDescription>What's being debunked</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">English</p>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p>{originalReport.fakeClaim}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Hindi</p>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p>{originalReport.fakeClaimHi}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Fact Check</CardTitle>
                    <CardDescription>The truth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">English</p>
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <p>{originalReport.factCheck}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Hindi</p>
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <p>{originalReport.factCheckHi}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Explanations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Explanation (English)</p>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                      <p>{originalReport.explanation}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Explanation (Hindi)</p>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                      <p>{originalReport.explanationHi}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Main Form */}
          <div className="mt-6">
            <FakeNewsForm
              formData={formData}
              categories={categories}
              errors={formErrors}
              onChange={handleFormChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Side Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Duplicate report
                if (confirm("Duplicate this report as a new draft?")) {
                  const token = localStorage.getItem("admin-token");
                  const duplicateData = { ...formData, title: `${formData?.title} (Copy)` };
                  
                  fetch("/api/admin/fake-news", {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(duplicateData),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        toast.success("Report duplicated successfully");
                        router.push(`/admin/fake-news/edit/${data.data._id}`);
                      }
                    })
                    .catch(console.error);
                }
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Duplicate Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Export as PDF
                toast.info("PDF export functionality would be implemented here");
              }}
            >
              <File className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // Share preview link
                const previewUrl = `${window.location.origin}/fake-news/${originalReport._id}`;
                navigator.clipboard.writeText(previewUrl);
                toast.success("Preview link copied to clipboard");
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Copy Preview Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm text-gray-500">
                  {originalReport.createdAt ? format(new Date(originalReport.createdAt), "MMM d, yyyy") : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-gray-500">
                  {originalReport.updatedAt ? format(new Date(originalReport.updatedAt), "MMM d, yyyy") : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  originalReport.status === "published" 
                    ? "bg-green-100 text-green-800" 
                    : originalReport.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {originalReport.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Severity</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  originalReport.severity === "critical" 
                    ? "bg-red-100 text-red-800" 
                    : originalReport.severity === "high"
                    ? "bg-orange-100 text-orange-800"
                    : originalReport.severity === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {originalReport.severity}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                if (confirm("Are you sure you want to archive this report?")) {
                  const token = localStorage.getItem("admin-token");
                  
                  fetch(`/api/admin/fake-news/${originalReport._id}`, {
                    method: "PATCH",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "archived" }),
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        toast.success("Report archived successfully");
                        setFormData(prev => prev ? { ...prev, status: "archived" } : prev);
                      }
                    })
                    .catch(console.error);
                }
              }}
            >
              Archive Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
                  const token = localStorage.getItem("admin-token");
                  
                  fetch(`/api/admin/fake-news/${originalReport._id}`, {
                    method: "DELETE",
                    headers: {
                      "Authorization": `Bearer ${token}`,
                    },
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        toast.success("Report deleted successfully");
                        router.push("/admin/fake-news");
                      }
                    })
                    .catch(console.error);
                }
              }}
            >
              Delete Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Bar */}
      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 -mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {originalReport.updatedAt && (
              <span>Last saved: {format(new Date(originalReport.updatedAt), "MMM d, yyyy h:mm a")}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm("Discard all changes?")) {
                  router.push("/admin/fake-news");
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleDiscard}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}