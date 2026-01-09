import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript Interfaces
export interface IEvidence {
  type: 'image' | 'video' | 'document' | 'link' | 'audio';
  url: string;
  title: string;
  description: string;
  timestamp?: string;
}

export interface IDebunkedBy {
  name: string;
  logo?: string;
  expertise: string;
  verificationDate: string;
}

export interface IVerifiedSource {
  name: string;
  url: string;
  type: 'government' | 'fact_checker' | 'media' | 'expert' | 'academic';
  credibilityScore: number;
}

export interface ITimeline {
  date: string;
  event: string;
  description: string;
}

export interface IVisualComparison {
  original?: string;
  manipulated?: string;
  analysis?: string;
}

export interface IImpact {
  reach?: number;
  countries?: string[];
  platforms?: string[];
  duration?: string;
}

export interface IFactChecker {
  name?: string;
  avatar?: string;
  expertise?: string[];
  experience?: string;
  verifiedChecks?: number;
}

export interface ISharingHistory {
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'other';
  sharedAt: Date;
  userId?: string;
  method: 'direct' | 'app' | 'web';
}

export interface IVoter {
  userId: string;
  voteType: 'helpful' | 'unhelpful';
  votedAt: Date;
}

export interface IShareStats {
  whatsapp: number;
  facebook: number;
  twitter: number;
  linkedin: number;
  telegram: number;
  other: number;
}

export interface IFakeNewsReport extends Document {
  // Basic Information
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

  // Evidence
  evidence: IEvidence[];

  // Categorization
  category: 'political' | 'health' | 'technology' | 'entertainment' | 'social' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';

  // Origin and Spread
  origin: string;
  spreadPlatforms: string[];
  debunkedBy: IDebunkedBy[];
  debunkedAt: Date;

  // Verification Sources
  verifiedSources: IVerifiedSource[];

  // Tags and Relations
  tags: string[];
  relatedReports: mongoose.Types.ObjectId[];

  // Timeline and Analysis
  timeline: ITimeline[];
  visualComparison?: IVisualComparison;

  // Impact Metrics
  impact?: IImpact;
  preventionTips: string[];

  // Fact Checker Information
  factChecker?: IFactChecker;

  // Engagement Metrics
  views: number;
  viewers: [{
    userId: String,
    userIp: String,
    userAgent: String,
    viewedAt: {
      type: Date,
      default: Date
    }
  }];
  shares: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  shareStats: IShareStats;
  sharingHistory: ISharingHistory[];
  voters: IVoter[];
  bookmarkedBy: mongoose.Types.ObjectId[];

  // Status and Metadata
  status: 'draft' | 'published' | 'archived';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schemas
const EvidenceSchema = new Schema<IEvidence>({
  type: {
    type: String,
    enum: ['image', 'video', 'document', 'link', 'audio'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: String
});

const DebunkedBySchema = new Schema<IDebunkedBy>({
  name: {
    type: String,
    required: true
  },
  logo: String,
  expertise: {
    type: String,
    required: true
  },
  verificationDate: {
    type: String,
    required: true
  }
});

const VerifiedSourceSchema = new Schema<IVerifiedSource>({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['government', 'fact_checker', 'media', 'expert', 'academic'],
    required: true
  },
  credibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  }
});

const TimelineSchema = new Schema<ITimeline>({
  date: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const VisualComparisonSchema = new Schema<IVisualComparison>({
  original: String,
  manipulated: String,
  analysis: String
});

const ImpactSchema = new Schema<IImpact>({
  reach: {
    type: Number,
    default: 0
  },
  countries: [String],
  platforms: [String],
  duration: String
});

const FactCheckerSchema = new Schema<IFactChecker>({
  name: String,
  avatar: String,
  expertise: [String],
  experience: String,
  verifiedChecks: {
    type: Number,
    default: 0
  }
});

const FakeNewsReportSchema = new Schema<IFakeNewsReport>({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleHi: {
    type: String,
    required: true,
    trim: true
  },
  fakeClaim: {
    type: String,
    required: true,
    trim: true
  },
  fakeClaimHi: {
    type: String,
    required: true,
    trim: true
  },
  factCheck: {
    type: String,
    required: true,
    trim: true
  },
  factCheckHi: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  explanationHi: {
    type: String,
    required: true,
    trim: true
  },
  detailedAnalysis: {
    type: String,
    default: ''
  },
  detailedAnalysisHi: {
    type: String,
    default: ''
  },

  // Evidence
  evidence: [EvidenceSchema],

  // Categorization
  category: {
    type: String,
    enum: ['political', 'health', 'technology', 'entertainment', 'social', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },

  // Origin and Spread
  origin: {
    type: String,
    required: true
  },
  spreadPlatforms: [String],
  debunkedBy: [DebunkedBySchema],
  debunkedAt: {
    type: Date,
    required: true
  },

  // Verification Sources
  verifiedSources: [VerifiedSourceSchema],

  // Tags and Relations
  tags: [String],
  relatedReports: [{
    type: Schema.Types.ObjectId,
    ref: 'FakeNewsReport'
  }],

  // Timeline and Analysis
  timeline: [TimelineSchema],
  visualComparison: VisualComparisonSchema,

  // Impact Metrics
  impact: ImpactSchema,
  preventionTips: [String],

  // Fact Checker Information
  factChecker: FactCheckerSchema,

  viewers: {
    type: [{
      userId: String,
      userIp: String,
      userAgent: String,
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  },

  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  
  // NEW: Additional engagement tracking fields
  shares: {
    type: Number,
    default: 0
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  unhelpfulVotes: { // NEW: Added for negative feedback tracking
    type: Number,
    default: 0
  },
  
  // NEW: Track sharing by platform
  shareStats: {
    whatsapp: { type: Number, default: 0 },
    facebook: { type: Number, default: 0 },
    twitter: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    telegram: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  
  // NEW: Detailed sharing history
  sharingHistory: [{
    platform: {
      type: String,
      enum: ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'other']
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    userId: String,
    method: {
      type: String,
      enum: ['direct', 'app', 'web'],
      default: 'web'
    }
  }],
  
  // NEW: Track user votes to prevent duplicates
  voters: [{
    userId: String,
    voteType: {
      type: String,
      enum: ['helpful', 'unhelpful']
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // NEW: Track bookmarks on server
  bookmarkedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Status and Metadata
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
FakeNewsReportSchema.index({ title: 'text', fakeClaim: 'text', tags: 'text' });
FakeNewsReportSchema.index({ category: 1, severity: 1, status: 1 });
FakeNewsReportSchema.index({ createdAt: -1 });
FakeNewsReportSchema.index({ views: -1 });
// NEW: Index for engagement metrics
FakeNewsReportSchema.index({ helpfulVotes: -1, shares: -1 });
FakeNewsReportSchema.index({ 'voters.userId': 1 });

// Create and export the model
const FakeNewsReport: Model<IFakeNewsReport> = 
  mongoose.models.FakeNewsReport || mongoose.model<IFakeNewsReport>('FakeNewsReport', FakeNewsReportSchema);

export default FakeNewsReport;