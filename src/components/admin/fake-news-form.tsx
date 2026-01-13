"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, XCircle, AlertCircle } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor-fake-news";
import { CategoryOption, FakeNewsFormData } from "@/lib/mock-data/fake-type";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FakeNewsFormProps {
  formData: FakeNewsFormData;
  categories?: CategoryOption[];
  onChange: (data: FakeNewsFormData) => void;
  errors?: Record<string, string>;
}

const severityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const evidenceTypeOptions = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
  { value: "link", label: "Link" },
  { value: "audio", label: "Audio" },
];

const sourceTypeOptions = [
  { value: "government", label: "Government" },
  { value: "fact_checker", label: "Fact Checker" },
  { value: "media", label: "Media" },
  { value: "expert", label: "Expert" },
  { value: "academic", label: "Academic" },
];

const platformOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
  { value: "telegram", label: "Telegram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
];

const countryOptions = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
];

// Default categories if none are provided
const defaultCategories: CategoryOption[] = [
  { value: "political", label: "Political" },
  { value: "health", label: "Health" },
  { value: "technology", label: "Technology" },
  { value: "entertainment", label: "Entertainment" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

export default function FakeNewsForm({ 
  formData, 
  categories = defaultCategories, // Use default if categories not provided
  onChange, 
  errors = {} 
}: FakeNewsFormProps) {
  const [editorType] = useState<"rich" | "markdown">("rich");
  const [loading, setLoading] = useState(false);

  // Helper function to update nested state
  const updateFormData = (updates: Partial<FakeNewsFormData>) => {
    onChange({ ...formData, ...updates });
  };

  // Required fields check
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
  ];

  // Evidence field helpers
  const addEvidenceField = () => {
    updateFormData({
      evidence: [
        ...formData.evidence,
        {
          type: "image",
          url: "",
          title: "",
          description: "",
          timestamp: "",
        },
      ],
    });
  };

  const removeEvidenceField = (index: number) => {
    updateFormData({
      evidence: formData.evidence.filter((_, i) => i !== index),
    });
  };

  const updateEvidenceField = (
    index: number,
    field: keyof FakeNewsFormData["evidence"][0],
    value: string
  ) => {
    const newEvidence = [...formData.evidence];
    newEvidence[index] = { ...newEvidence[index], [field]: value };
    updateFormData({ evidence: newEvidence });
  };

  // Debunked By field helpers
  const addDebunkedByField = () => {
    updateFormData({
      debunkedBy: [
        ...formData.debunkedBy,
        {
          name: "",
          expertise: "",
          verificationDate: "",
        },
      ],
    });
  };

  const removeDebunkedByField = (index: number) => {
    updateFormData({
      debunkedBy: formData.debunkedBy.filter((_, i) => i !== index),
    });
  };

  const updateDebunkedByField = (
    index: number,
    field: keyof FakeNewsFormData["debunkedBy"][0],
    value: string
  ) => {
    const newDebunkedBy = [...formData.debunkedBy];
    newDebunkedBy[index] = { ...newDebunkedBy[index], [field]: value };
    updateFormData({ debunkedBy: newDebunkedBy });
  };

  // Verified Sources field helpers
  const addVerifiedSourceField = () => {
    updateFormData({
      verifiedSources: [
        ...formData.verifiedSources,
        {
          name: "",
          url: "",
          type: "government",
          credibilityScore: 100,
        },
      ],
    });
  };

  const removeVerifiedSourceField = (index: number) => {
    updateFormData({
      verifiedSources: formData.verifiedSources.filter((_, i) => i !== index),
    });
  };

  const updateVerifiedSourceField = (
    index: number,
    field: keyof FakeNewsFormData["verifiedSources"][0],
    value: string | number
  ) => {
    const newVerifiedSources = [...formData.verifiedSources];
    newVerifiedSources[index] = { ...newVerifiedSources[index], [field]: value };
    updateFormData({ verifiedSources: newVerifiedSources });
  };

  // Timeline field helpers
  const addTimelineField = () => {
    updateFormData({
      timeline: [
        ...formData.timeline,
        {
          date: "",
          event: "",
          description: "",
        },
      ],
    });
  };

  const removeTimelineField = (index: number) => {
    updateFormData({
      timeline: formData.timeline.filter((_, i) => i !== index),
    });
  };

  const updateTimelineField = (
    index: number,
    field: keyof FakeNewsFormData["timeline"][0],
    value: string
  ) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    updateFormData({ timeline: newTimeline });
  };

  // Spread Platforms handlers
  const handleSpreadPlatformsChange = (platform: string, checked: boolean) => {
    if (checked) {
      updateFormData({
        spreadPlatforms: [...formData.spreadPlatforms, platform]
      });
    } else {
      updateFormData({
        spreadPlatforms: formData.spreadPlatforms.filter(p => p !== platform)
      });
    }
  };

  // Impact Countries handlers
  const handleImpactCountriesChange = (country: string, checked: boolean) => {
    if (checked) {
      updateFormData({
        impact: { 
          ...formData.impact, 
          countries: [...formData.impact.countries, country] 
        }
      });
    } else {
      updateFormData({
        impact: { 
          ...formData.impact, 
          countries: formData.impact.countries.filter(c => c !== country) 
        }
      });
    }
  };

  // Impact Platforms handlers
  const handleImpactPlatformsChange = (platform: string, checked: boolean) => {
    if (checked) {
      updateFormData({
        impact: { 
          ...formData.impact, 
          platforms: [...formData.impact.platforms, platform] 
        }
      });
    } else {
      updateFormData({
        impact: { 
          ...formData.impact, 
          platforms: formData.impact.platforms.filter(p => p !== platform) 
        }
      });
    }
  };

  // Fact Checker Expertise handlers
  const handleFactCheckerExpertiseChange = (expertise: string) => {
    const expertiseArray = expertise.split(',').map(e => e.trim()).filter(e => e);
    updateFormData({
      factChecker: {
        ...formData.factChecker,
        expertise: expertiseArray
      }
    });
  };

  // Visual Comparison handlers
  const updateVisualComparisonField = (
    field: keyof FakeNewsFormData["visualComparison"],
    value: string
  ) => {
    updateFormData({
      visualComparison: {
        ...formData.visualComparison,
        [field]: value
      }
    });
  };

  // Show validation errors
  const hasErrors = Object.keys(errors).length > 0;

  // Check if categories is defined and is an array
  const safeCategories = Array.isArray(categories) ? categories : defaultCategories;

  return (
    <div className="space-y-4">
      {/* Validation Errors */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc list-inside mt-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                Title (English) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="Enter fake news title in English"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleHi" className="flex items-center">
                Title (Hindi) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="titleHi"
                value={formData.titleHi}
                onChange={(e) => updateFormData({ titleHi: e.target.value })}
                placeholder="Enter fake news title in Hindi"
                className={errors.titleHi ? "border-red-500" : ""}
              />
              {errors.titleHi && (
                <p className="text-sm text-red-500">{errors.titleHi}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center">
                Category <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateFormData({ category: value as any })}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {safeCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity" className="flex items-center">
                Severity <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => updateFormData({ severity: value as any })}
              >
                <SelectTrigger className={errors.severity ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((sev) => (
                    <SelectItem key={sev.value} value={sev.value}>
                      {sev.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && (
                <p className="text-sm text-red-500">{errors.severity}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fakeClaim" className="flex items-center">
              Fake Claim (English) <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="fakeClaim"
              value={formData.fakeClaim}
              onChange={(e) => updateFormData({ fakeClaim: e.target.value })}
              placeholder="Enter the fake claim that's circulating"
              rows={3}
              className={errors.fakeClaim ? "border-red-500" : ""}
            />
            {errors.fakeClaim && (
              <p className="text-sm text-red-500">{errors.fakeClaim}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fakeClaimHi" className="flex items-center">
              Fake Claim (Hindi) <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="fakeClaimHi"
              value={formData.fakeClaimHi}
              onChange={(e) => updateFormData({ fakeClaimHi: e.target.value })}
              placeholder="Enter the fake claim in Hindi"
              rows={3}
              className={errors.fakeClaimHi ? "border-red-500" : ""}
            />
            {errors.fakeClaimHi && (
              <p className="text-sm text-red-500">{errors.fakeClaimHi}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin" className="flex items-center">
              Origin <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) => updateFormData({ origin: e.target.value })}
              placeholder="Where did this originate? (e.g., Country, City, Platform)"
              className={errors.origin ? "border-red-500" : ""}
            />
            {errors.origin && (
              <p className="text-sm text-red-500">{errors.origin}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="debunkedAt" className="flex items-center">
              Debunked Date <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="debunkedAt"
              type="date"
              value={formData.debunkedAt}
              onChange={(e) => updateFormData({ debunkedAt: e.target.value })}
              className={errors.debunkedAt ? "border-red-500" : ""}
            />
            {errors.debunkedAt && (
              <p className="text-sm text-red-500">{errors.debunkedAt}</p>
            )}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="factCheck" className="flex items-center">
              Fact Check (English) <span className="text-red-500 ml-1">*</span>
            </Label>
            {editorType === "rich" ? (
              <RichTextEditor
                value={formData.factCheck}
                onChange={(value) => updateFormData({ factCheck: value })}
                className={errors.factCheck ? "border-red-500" : ""}
              />
            ) : (
              <Textarea
                id="factCheck"
                value={formData.factCheck}
                onChange={(e) => updateFormData({ factCheck: e.target.value })}
                placeholder="Enter the factual correction"
                rows={5}
                className={errors.factCheck ? "border-red-500" : ""}
              />
            )}
            {errors.factCheck && (
              <p className="text-sm text-red-500">{errors.factCheck}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="factCheckHi" className="flex items-center">
              Fact Check (Hindi) <span className="text-red-500 ml-1">*</span>
            </Label>
            {editorType === "rich" ? (
              <RichTextEditor
                value={formData.factCheckHi}
                onChange={(value) => updateFormData({ factCheckHi: value })}
                className={errors.factCheckHi ? "border-red-500" : ""}
              />
            ) : (
              <Textarea
                id="factCheckHi"
                value={formData.factCheckHi}
                onChange={(e) => updateFormData({ factCheckHi: e.target.value })}
                placeholder="Enter the factual correction in Hindi"
                rows={5}
                className={errors.factCheckHi ? "border-red-500" : ""}
              />
            )}
            {errors.factCheckHi && (
              <p className="text-sm text-red-500">{errors.factCheckHi}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation" className="flex items-center">
              Explanation (English) <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => updateFormData({ explanation: e.target.value })}
              placeholder="Explain why this is fake news"
              rows={3}
              className={errors.explanation ? "border-red-500" : ""}
            />
            {errors.explanation && (
              <p className="text-sm text-red-500">{errors.explanation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanationHi" className="flex items-center">
              Explanation (Hindi) <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="explanationHi"
              value={formData.explanationHi}
              onChange={(e) => updateFormData({ explanationHi: e.target.value })}
              placeholder="Explain why this is fake news in Hindi"
              rows={3}
              className={errors.explanationHi ? "border-red-500" : ""}
            />
            {errors.explanationHi && (
              <p className="text-sm text-red-500">{errors.explanationHi}</p>
            )}
          </div>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Evidence</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEvidenceField}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Evidence
            </Button>
          </div>
          
          {formData.evidence.map((evidence, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Evidence {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEvidenceField(index)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={evidence.type}
                    onValueChange={(value) =>
                      updateEvidenceField(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {evidenceTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>URL <span className="text-red-500">*</span></Label>
                  <Input
                    value={evidence.url}
                    onChange={(e) =>
                      updateEvidenceField(index, "url", e.target.value)
                    }
                    placeholder="Enter evidence URL"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Title <span className="text-red-500">*</span></Label>
                <Input
                  value={evidence.title}
                  onChange={(e) =>
                    updateEvidenceField(index, "title", e.target.value)
                  }
                  placeholder="Enter evidence title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description <span className="text-red-500">*</span></Label>
                <Textarea
                  value={evidence.description}
                  onChange={(e) =>
                    updateEvidenceField(index, "description", e.target.value)
                  }
                  placeholder="Describe this evidence"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Timestamp</Label>
                <Input
                  type="datetime-local"
                  value={evidence.timestamp}
                  onChange={(e) =>
                    updateEvidenceField(index, "timestamp", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          {/* Debunked By Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Debunked By</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDebunkedByField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Debunker
              </Button>
            </div>
            
            {formData.debunkedBy.map((debunker, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Debunker {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDebunkedByField(index)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Name <span className="text-red-500">*</span></Label>
                    <Input
                      value={debunker.name}
                      onChange={(e) =>
                        updateDebunkedByField(index, "name", e.target.value)
                      }
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={debunker.logo || ""}
                      onChange={(e) =>
                        updateDebunkedByField(index, "logo", e.target.value)
                      }
                      placeholder="Enter logo URL"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Expertise <span className="text-red-500">*</span></Label>
                  <Input
                    value={debunker.expertise}
                    onChange={(e) =>
                      updateDebunkedByField(index, "expertise", e.target.value)
                    }
                    placeholder="Enter expertise area"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Verification Date <span className="text-red-500">*</span></Label>
                  <Input
                    type="date"
                    value={debunker.verificationDate}
                    onChange={(e) =>
                      updateDebunkedByField(index, "verificationDate", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Verified Sources Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Verified Sources</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVerifiedSourceField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </div>
            
            {formData.verifiedSources.map((source, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Source {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVerifiedSourceField(index)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Name <span className="text-red-500">*</span></Label>
                    <Input
                      value={source.name}
                      onChange={(e) =>
                        updateVerifiedSourceField(index, "name", e.target.value)
                      }
                      placeholder="Enter source name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={source.type}
                      onValueChange={(value) =>
                        updateVerifiedSourceField(index, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypeOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>URL <span className="text-red-500">*</span></Label>
                  <Input
                    value={source.url}
                    onChange={(e) =>
                      updateVerifiedSourceField(index, "url", e.target.value)
                    }
                    placeholder="Enter source URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Credibility Score</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={source.credibilityScore}
                      onChange={(e) =>
                        updateVerifiedSourceField(index, "credibilityScore", parseInt(e.target.value))
                      }
                      placeholder="0-100"
                    />
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="detailedAnalysis">Detailed Analysis (English)</Label>
            <Textarea
              id="detailedAnalysis"
              value={formData.detailedAnalysis}
              onChange={(e) => updateFormData({ detailedAnalysis: e.target.value })}
              placeholder="Provide detailed analysis of the fake news"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailedAnalysisHi">Detailed Analysis (Hindi)</Label>
            <Textarea
              id="detailedAnalysisHi"
              value={formData.detailedAnalysisHi}
              onChange={(e) => updateFormData({ detailedAnalysisHi: e.target.value })}
              placeholder="Provide detailed analysis in Hindi"
              rows={6}
            />
          </div>

          {/* Visual Comparison */}
          <div className="space-y-4">
            <Label>Visual Comparison</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Original Image URL</Label>
                <Input
                  value={formData.visualComparison?.original || ""}
                  onChange={(e) =>
                    updateVisualComparisonField("original", e.target.value)
                  }
                  placeholder="Enter original image URL"
                />
              </div>
              <div className="space-y-2">
                <Label>Manipulated Image URL</Label>
                <Input
                  value={formData.visualComparison?.manipulated || ""}
                  onChange={(e) =>
                    updateVisualComparisonField("manipulated", e.target.value)
                  }
                  placeholder="Enter manipulated image URL"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Visual Analysis</Label>
              <Textarea
                value={formData.visualComparison?.analysis || ""}
                onChange={(e) =>
                  updateVisualComparisonField("analysis", e.target.value)
                }
                placeholder="Provide analysis of visual comparison"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="impact.reach">Estimated Reach</Label>
              <Input
                id="impact.reach"
                type="number"
                min="0"
                value={formData.impact.reach}
                onChange={(e) =>
                  updateFormData({
                    impact: { ...formData.impact, reach: parseInt(e.target.value) || 0 }
                  })
                }
                placeholder="Number of people reached"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact.duration">Duration of Spread</Label>
              <Input
                id="impact.duration"
                value={formData.impact.duration}
                onChange={(e) =>
                  updateFormData({
                    impact: { ...formData.impact, duration: e.target.value }
                  })
                }
                placeholder="e.g., 2 days, 1 week"
              />
            </div>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          {/* Spread Platforms */}
          <div className="space-y-2">
            <Label>Spread Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platformOptions.map((platform) => (
                <div key={platform.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`platform-${platform.value}`}
                    checked={formData.spreadPlatforms.includes(platform.value)}
                    onChange={(e) => handleSpreadPlatformsChange(platform.value, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`platform-${platform.value}`} className="text-sm">
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Countries */}
          <div className="space-y-2">
            <Label>Impact Countries</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {countryOptions.map((country) => (
                <div key={country.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`country-${country.value}`}
                    checked={formData.impact.countries.includes(country.value)}
                    onChange={(e) => handleImpactCountriesChange(country.value, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`country-${country.value}`} className="text-sm">
                    {country.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Platforms */}
          <div className="space-y-2">
            <Label>Impact Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platformOptions.map((platform) => (
                <div key={platform.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`impact-platform-${platform.value}`}
                    checked={formData.impact.platforms.includes(platform.value)}
                    onChange={(e) => handleImpactPlatformsChange(platform.value, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`impact-platform-${platform.value}`} className="text-sm">
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                updateFormData({
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                })
              }
              placeholder="e.g., politics, covid-19, election"
            />
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Timeline</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimelineField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Timeline Event
              </Button>
            </div>
            
            {formData.timeline.map((timeline, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Timeline Event {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimelineField(index)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Date <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      value={timeline.date}
                      onChange={(e) =>
                        updateTimelineField(index, "date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Event <span className="text-red-500">*</span></Label>
                    <Input
                      value={timeline.event}
                      onChange={(e) =>
                        updateTimelineField(index, "event", e.target.value)
                      }
                      placeholder="Event name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description <span className="text-red-500">*</span></Label>
                    <Input
                      value={timeline.description}
                      onChange={(e) =>
                        updateTimelineField(index, "description", e.target.value)
                      }
                      placeholder="Event description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prevention Tips */}
          <div className="space-y-2">
            <Label htmlFor="preventionTips">Prevention Tips (one per line)</Label>
            <Textarea
              id="preventionTips"
              value={formData.preventionTips.join("\n")}
              onChange={(e) =>
                updateFormData({
                  preventionTips: e.target.value.split("\n").filter(tip => tip.trim())
                })
              }
              placeholder="Enter prevention tips, one per line"
              rows={4}
            />
          </div>

          {/* Fact Checker */}
          <div className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium">Fact Checker Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.factChecker.name}
                  onChange={(e) =>
                    updateFormData({
                      factChecker: { ...formData.factChecker, name: e.target.value }
                    })
                  }
                  placeholder="Fact checker name"
                />
              </div>
              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input
                  value={formData.factChecker.avatar}
                  onChange={(e) =>
                    updateFormData({
                      factChecker: { ...formData.factChecker, avatar: e.target.value }
                    })
                  }
                  placeholder="Enter avatar URL"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expertise (comma separated)</Label>
              <Input
                value={formData.factChecker.expertise.join(", ")}
                onChange={(e) => handleFactCheckerExpertiseChange(e.target.value)}
                placeholder="e.g., Politics, Health, Technology"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input
                  value={formData.factChecker.experience}
                  onChange={(e) =>
                    updateFormData({
                      factChecker: { ...formData.factChecker, experience: e.target.value }
                    })
                  }
                  placeholder="e.g., 5 years in fact checking"
                />
              </div>
              <div className="space-y-2">
                <Label>Verified Checks</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.factChecker.verifiedChecks}
                  onChange={(e) =>
                    updateFormData({
                      factChecker: { 
                        ...formData.factChecker, 
                        verifiedChecks: parseInt(e.target.value) || 0 
                      }
                    })
                  }
                  placeholder="Number of verified checks"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateFormData({ status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {/* Required Fields Summary */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Required Fields Summary</h4>
        <ul className="text-sm space-y-1">
          {requiredFields.map((field) => (
            <li key={field.field} className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${
                formData[field.field as keyof FakeNewsFormData] ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {field.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}