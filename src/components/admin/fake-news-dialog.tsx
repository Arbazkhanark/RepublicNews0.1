"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CategoryOption, FakeNewsFormData, FakeNewsReport } from "@/lib/mock-data/fake-type";
import FakeNewsForm from "./fake-news-form";

interface FakeNewsDialogProps {
  open: boolean;
  editingReport: FakeNewsReport | null;
  categories: CategoryOption[];
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: (report: FakeNewsReport, isNew: boolean) => void;
}

export default function FakeNewsDialog({
  open,
  editingReport,
  categories,
  onOpenChange,
  onSubmitSuccess,
}: FakeNewsDialogProps) {
  const [formData, setFormData] = useState<FakeNewsFormData>({
    title: "",
    titleHi: "",
    fakeClaim: "",
    fakeClaimHi: "",
    factCheck: "",
    factCheckHi: "",
    explanation: "",
    explanationHi: "",
    detailedAnalysis: "",
    detailedAnalysisHi: "",
    evidence: [
      {
        type: "image",
        url: "",
        title: "",
        description: "",
        timestamp: "",
      },
    ],
    category: "political",
    severity: "medium",
    origin: "",
    spreadPlatforms: [],
    debunkedBy: [
      {
        name: "",
        expertise: "",
        verificationDate: "",
      },
    ],
    debunkedAt: new Date().toISOString().split("T")[0],
    verifiedSources: [
      {
        name: "",
        url: "",
        type: "government",
        credibilityScore: 100,
      },
    ],
    tags: [],
    relatedReports: [],
    timeline: [
      {
        date: "",
        event: "",
        description: "",
      },
    ],
    impact: {
      reach: 0,
      countries: [],
      platforms: [],
      duration: "",
    },
    visualComparison: {
      original: "",
      manipulated: "",
      analysis: "",
    },
    preventionTips: [],
    factChecker: {
      name: "",
      avatar: "",
      expertise: [],
      experience: "",
      verifiedChecks: 0,
    },
    status: "draft",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when editing report changes
  useEffect(() => {
    if (editingReport) {
      setFormData({
        title: editingReport.title || "",
        titleHi: editingReport.titleHi || "",
        fakeClaim: editingReport.fakeClaim || "",
        fakeClaimHi: editingReport.fakeClaimHi || "",
        factCheck: editingReport.factCheck || "",
        factCheckHi: editingReport.factCheckHi || "",
        explanation: editingReport.explanation || "",
        explanationHi: editingReport.explanationHi || "",
        detailedAnalysis: editingReport.detailedAnalysis || "",
        detailedAnalysisHi: editingReport.detailedAnalysisHi || "",
        evidence: editingReport.evidence || [],
        category: editingReport.category || "political",
        severity: editingReport.severity || "medium",
        origin: editingReport.origin || "",
        spreadPlatforms: editingReport.spreadPlatforms || [],
        debunkedBy: editingReport.debunkedBy || [],
        debunkedAt: editingReport.debunkedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        verifiedSources: editingReport.verifiedSources || [],
        tags: editingReport.tags || [],
        relatedReports: editingReport.relatedReports || [],
        timeline: editingReport.timeline || [],
        impact: editingReport.impact || {
          reach: 0,
          countries: [],
          platforms: [],
          duration: "",
        },
        visualComparison: editingReport.visualComparison || {
          original: "",
          manipulated: "",
          analysis: "",
        },
        preventionTips: editingReport.preventionTips || [],
        factChecker: editingReport.factChecker || {
          name: "",
          avatar: "",
          expertise: [],
          experience: "",
          verifiedChecks: 0,
        },
        status: editingReport.status || "draft",
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [editingReport]);

  const API_BASE_URL = "/api/admin/fake-news";

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("admin-token") || "";
    }
    return "";
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      titleHi: "",
      fakeClaim: "",
      fakeClaimHi: "",
      factCheck: "",
      factCheckHi: "",
      explanation: "",
      explanationHi: "",
      detailedAnalysis: "",
      detailedAnalysisHi: "",
      evidence: [
        {
          type: "image",
          url: "",
          title: "",
          description: "",
          timestamp: "",
        },
      ],
      category: "political",
      severity: "medium",
      origin: "",
      spreadPlatforms: [],
      debunkedBy: [
        {
          name: "",
          expertise: "",
          verificationDate: "",
        },
      ],
      debunkedAt: new Date().toISOString().split("T")[0],
      verifiedSources: [
        {
          name: "",
          url: "",
          type: "government",
          credibilityScore: 100,
        },
      ],
      tags: [],
      relatedReports: [],
      timeline: [
        {
          date: "",
          event: "",
          description: "",
        },
      ],
      impact: {
        reach: 0,
        countries: [],
        platforms: [],
        duration: "",
      },
      visualComparison: {
        original: "",
        manipulated: "",
        analysis: "",
      },
      preventionTips: [],
      factChecker: {
        name: "",
        avatar: "",
        expertise: [],
        experience: "",
        verifiedChecks: 0,
      },
      status: "draft",
    });
    setErrors({});
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      { field: 'title', label: 'Title (English)' },
      { field: 'titleHi', label: 'Title (Hindi)' },
      { field: 'fakeClaim', label: 'Fake Claim (English)' },
      { field: 'fakeClaimHi', label: 'Fake Claim (Hindi)' },
      { field: 'factCheck', label: 'Fact Check (English)' },
      { field: 'factCheckHi', label: 'Fact Check (Hindi)' },
      { field: 'explanation', label: 'Explanation (English)' },
      { field: 'explanationHi', label: 'Explanation (Hindi)' },
      { field: 'category', label: 'Category' },
      { field: 'severity', label: 'Severity' },
      { field: 'origin', label: 'Origin' },
      { field: 'debunkedAt', label: 'Debunked Date' },
    ];

    requiredFields.forEach(({ field, label }) => {
      const value = formData[field as keyof FakeNewsFormData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Validate evidence fields
    formData.evidence.forEach((evidence, index) => {
      if (!evidence.url.trim()) {
        newErrors[`evidence_${index}_url`] = `Evidence ${index + 1} URL is required`;
      }
      if (!evidence.title.trim()) {
        newErrors[`evidence_${index}_title`] = `Evidence ${index + 1} Title is required`;
      }
      if (!evidence.description.trim()) {
        newErrors[`evidence_${index}_description`] = `Evidence ${index + 1} Description is required`;
      }
    });

    // Validate debunkedBy fields
    formData.debunkedBy.forEach((debunker, index) => {
      if (!debunker.name.trim()) {
        newErrors[`debunkedBy_${index}_name`] = `Debunker ${index + 1} Name is required`;
      }
      if (!debunker.expertise.trim()) {
        newErrors[`debunkedBy_${index}_expertise`] = `Debunker ${index + 1} Expertise is required`;
      }
      if (!debunker.verificationDate.trim()) {
        newErrors[`debunkedBy_${index}_verificationDate`] = `Debunker ${index + 1} Verification Date is required`;
      }
    });

    // Validate verifiedSources fields
    formData.verifiedSources.forEach((source, index) => {
      if (!source.name.trim()) {
        newErrors[`verifiedSources_${index}_name`] = `Source ${index + 1} Name is required`;
      }
      if (!source.url.trim()) {
        newErrors[`verifiedSources_${index}_url`] = `Source ${index + 1} URL is required`;
      }
    });

    // Validate timeline fields
    formData.timeline.forEach((timeline, index) => {
      if (!timeline.date.trim()) {
        newErrors[`timeline_${index}_date`] = `Timeline ${index + 1} Date is required`;
      }
      if (!timeline.event.trim()) {
        newErrors[`timeline_${index}_event`] = `Timeline ${index + 1} Event is required`;
      }
      if (!timeline.description.trim()) {
        newErrors[`timeline_${index}_description`] = `Timeline ${index + 1} Description is required`;
      }
    });

    // Validate impact.reach is a positive number
    if (formData.impact.reach < 0) {
      newErrors['impact.reach'] = 'Estimated reach must be a positive number';
    }

    // Validate factChecker.verifiedChecks is a positive number
    if (formData.factChecker.verifiedChecks < 0) {
      newErrors['factChecker.verifiedChecks'] = 'Verified checks must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const url = editingReport ? `${API_BASE_URL}/${editingReport._id}` : API_BASE_URL;
      const method = editingReport ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("admin-token");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success) {
        toast.success(editingReport ? "Report updated successfully" : "Fake news report created successfully");
        onSubmitSuccess(result.report, !editingReport);
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(result.error || editingReport ? "Failed to update report" : "Failed to create report");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingReport ? "Edit Report" : "Create Fake News Report"}
          </DialogTitle>
          <DialogDescription>
            {editingReport
              ? "Edit the fake news report details"
              : "Create a new fake news debunking report"}
          </DialogDescription>
        </DialogHeader>

        <FakeNewsForm
          formData={formData}
          categories={categories}
          onChange={setFormData}
          errors={errors}
        />

        <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {editingReport ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {editingReport ? "Update Report" : "Create Report"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}