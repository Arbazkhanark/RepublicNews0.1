// Shared type definitions

export interface FakeNewsReport {
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
    type: "image" | "video" | "document" | "link" | "audio";
    url: string;
    title: string;
    description: string;
    timestamp?: string;
  }[];
  category:
    | "political"
    | "health"
    | "technology"
    | "entertainment"
    | "social"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  origin: string;
  spreadPlatforms: string[];
  debunkedBy: {
    name: string;
    logo?: string;
    expertise: string;
    verificationDate: string;
  }[];
  debunkedAt: string;
  views: number;
  shares: number;
  helpfulVotes: number;
  verifiedSources: {
    name: string;
    url: string;
    type: "government" | "fact_checker" | "media" | "expert" | "academic";
    credibilityScore: number;
  }[];
  tags: string[];
  relatedReports: string[];
  timeline: {
    date: string;
    event: string;
    description: string;
  }[];
  visualComparison?: {
    original: string;
    manipulated: string;
    analysis: string;
  };
  impact: {
    reach: number;
    countries: string[];
    platforms: string[];
    duration: string;
  };
  preventionTips: string[];
  factChecker: {
    name: string;
    avatar: string;
    expertise: string[];
    experience: string;
    verifiedChecks: number;
  };
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface FakeNewsFormData {
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
    type: "image" | "video" | "document" | "link" | "audio";
    url: string;
    title: string;
    description: string;
    timestamp?: string;
  }[];
  category:
    | "political"
    | "health"
    | "technology"
    | "entertainment"
    | "social"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  origin: string;
  spreadPlatforms: string[];
  debunkedBy: {
    name: string;
    logo?: string;
    expertise: string;
    verificationDate: string;
  }[];
  debunkedAt: string;
  verifiedSources: {
    name: string;
    url: string;
    type: "government" | "fact_checker" | "media" | "expert" | "academic";
    credibilityScore: number;
  }[];
  tags: string[];
  relatedReports: string[];
  timeline: {
    date: string;
    event: string;
    description: string;
  }[];
  impact: {
    reach: number;
    countries: string[];
    platforms: string[];
    duration: string;
  };
  preventionTips: string[];
  factChecker: {
    name: string;
    avatar: string;
    expertise: string[];
    experience: string;
    verifiedChecks: number;
  };
  status: "draft" | "published" | "archived";
}

export interface CategoryOption {
  value: string;
  label: string;
}