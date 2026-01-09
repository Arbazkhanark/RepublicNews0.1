import mongoose from 'mongoose';

const EvidenceSchema = new mongoose.Schema({
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

const DebunkedBySchema = new mongoose.Schema({
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

const VerifiedSourceSchema = new mongoose.Schema({
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

const TimelineSchema = new mongoose.Schema({
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

const VisualComparisonSchema = new mongoose.Schema({
  original: String,
  manipulated: String,
  analysis: String
});

const ImpactSchema = new mongoose.Schema({
  reach: {
    type: Number,
    default: 0
  },
  countries: [String],
  platforms: [String],
  duration: String
});

const FactCheckerSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  expertise: [String],
  experience: String,
  verifiedChecks: {
    type: Number,
    default: 0
  }
});

const FakeNewsReportSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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

  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },

  // Status and Metadata
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.models.FakeNewsReport || mongoose.model('FakeNewsReport', FakeNewsReportSchema);