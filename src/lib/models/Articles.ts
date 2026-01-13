import mongoose, { Schema, type Document } from 'mongoose';
import { registerModel } from '../mongodb';

export interface ISourcePersonSocial {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ILayoutConfig {
  showAuthor: boolean;
  showDate: boolean;
  showCategory: boolean;
  showSocialShare: boolean;
  imagePosition: 'top' | 'left' | 'right' | 'center';
  textAlign: 'left' | 'center' | 'right' | 'justify';
}

export interface ICloudinaryImage {
  url: string;
  publicId: string;
  isFeaturedImage?: boolean;
  isFeaturedArticleImage?: boolean;
  uploadedAt: Date;
}

// NEW: Interface for tracking user interactions
export interface IUserInteraction {
  userId: mongoose.Types.ObjectId;
  ipAddress?: string;
  timestamp: Date;
  platform?: string; // 'facebook', 'twitter', 'whatsapp', 'linkedin', etc.
}

export interface IArticle extends Document {
  // Basic Information
  title: string;
  titleHi: string;
  slug: string;
  subtitle?: string;
  subtitleHi?: string;
  content: string;
  contentHi: string;
  excerpt?: string;
  excerptHi?: string;

  // Images
  featuredImage?: string;
  featuredArticleImage?: string;
  mediaUrls: string[];
  cloudinaryImages: ICloudinaryImage[];

  // Categorization
  category: mongoose.Types.ObjectId;
  tags: string[];

  // Source Information
  sourcePersonName?: string;
  sourcePersonNameHi?: string;
  sourcePersonSocial?: ISourcePersonSocial;

  // Layout & Display
  layoutConfig: ILayoutConfig;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  isBreaking: boolean;
  isFeatured: boolean;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];

  // Scheduling
  scheduledAt?: Date | null;
  publishedAt?: Date | null;

  // Author Information
  author: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;

  // Analytics
  meta: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };

  // NEW: Tracking arrays for duplicate prevention
  viewedBy: IUserInteraction[];
  likedBy: IUserInteraction[];
  sharedBy: IUserInteraction[];

  // System
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  incrementView: (userId: string, ipAddress?: string) => Promise<IArticle>;
  incrementLike: (userId: string, ipAddress?: string) => Promise<{ success: boolean; message: string; article: IArticle }>;
  incrementShare: (userId: string, platform: string, ipAddress?: string) => Promise<{ success: boolean; message: string; article: IArticle }>;
  addComment: () => Promise<IArticle>;
  removeLike: (userId: string) => Promise<{ success: boolean; message: string; article: IArticle }>;
}

const SourcePersonSocialSchema = new Schema<ISourcePersonSocial>({
  twitter: { type: String, trim: true },
  facebook: { type: String, trim: true },
  instagram: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  youtube: { type: String, trim: true }
}, { _id: false });

const LayoutConfigSchema = new Schema<ILayoutConfig>({
  showAuthor: { type: Boolean, default: true },
  showDate: { type: Boolean, default: true },
  showCategory: { type: Boolean, default: true },
  showSocialShare: { type: Boolean, default: true },
  imagePosition: {
    type: String,
    enum: ['top', 'left', 'right', 'center'],
    default: 'top'
  },
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right', 'justify'],
    default: 'left'
  }
}, { _id: false });

const CloudinaryImageSchema = new Schema<ICloudinaryImage>({
  url: {
    type: String,
    required: true,
    trim: true
  },
  publicId: {
    type: String,
    required: true,
    trim: true
  },
  isFeaturedImage: {
    type: Boolean,
    default: false
  },
  isFeaturedArticleImage: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// NEW: Schema for tracking user interactions
const UserInteractionSchema = new Schema<IUserInteraction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  platform: {
    type: String,
    trim: true,
    lowercase: true
  }
}, { _id: false });

const ArticleSchema = new Schema<IArticle>(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    titleHi: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 300
    },
    subtitleHi: {
      type: String,
      trim: true,
      maxlength: 300
    },
    content: {
      type: String,
      required: true
    },
    contentHi: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      maxlength: 500
    },
    excerptHi: {
      type: String,
      maxlength: 500
    },

    // Images
    featuredImage: {
      type: String,
      default: null,
      trim: true
    },
    featuredArticleImage: {
      type: String,
      default: null,
      trim: true
    },
    mediaUrls: [{
      type: String,
      trim: true
    }],
    cloudinaryImages: [CloudinaryImageSchema],

    // Categorization
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],

    // Source Information
    sourcePersonName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    sourcePersonNameHi: {
      type: String,
      trim: true,
      maxlength: 100
    },
    sourcePersonSocial: {
      type: SourcePersonSocialSchema,
      default: () => ({})
    },

    // Layout & Display
    layoutConfig: {
      type: LayoutConfigSchema,
      default: () => ({
        showAuthor: true,
        showDate: true,
        showCategory: true,
        showSocialShare: true,
        imagePosition: 'top',
        textAlign: 'left'
      })
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft'
    },
    isBreaking: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },

    // SEO
    seoTitle: {
      type: String,
      maxlength: 200
    },
    seoDescription: {
      type: String,
      maxlength: 300
    },
    seoKeywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],

    // Scheduling
    scheduledAt: {
      type: Date,
      default: null
    },
    publishedAt: {
      type: Date,
      default: null
    },

    // Author Information
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Analytics
    meta: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      comments: { type: Number, default: 0 }
    },

    // NEW: Tracking arrays for duplicate prevention
    viewedBy: {
      type: [UserInteractionSchema],
      default: []
    },
    likedBy: {
      type: [UserInteractionSchema],
      default: []
    },
    sharedBy: {
      type: [UserInteractionSchema],
      default: []
    },

    // System
    allowComments: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ArticleSchema.index({ title: 'text', subtitle: 'text', content: 'text', titleHi: 'text', contentHi: 'text' });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ isBreaking: 1 });
ArticleSchema.index({ isFeatured: 1 });
ArticleSchema.index({ 'meta.views': -1 });
ArticleSchema.index({ 'meta.likes': -1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ seoKeywords: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ scheduledAt: -1 });
ArticleSchema.index({ 'cloudinaryImages.publicId': 1 });
// NEW: Indexes for tracking
ArticleSchema.index({ 'viewedBy.userId': 1 });
ArticleSchema.index({ 'likedBy.userId': 1 });
ArticleSchema.index({ 'sharedBy.userId': 1 });

// Virtuals
ArticleSchema.virtual('readingTime').get(function (this: IArticle) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

ArticleSchema.virtual('readingTimeHi').get(function (this: IArticle) {
  const wordsPerMinute = 150;
  const wordCount = this.contentHi.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

ArticleSchema.virtual('featuredImageURL').get(function (this: IArticle) {
  if (this.featuredImage) {
    return this.featuredImage;
  }

  const cloudinaryFeatured = this.cloudinaryImages.find(img => img.isFeaturedImage);
  if (cloudinaryFeatured) {
    return cloudinaryFeatured.url;
  }

  return '/images/default-article.jpg';
});

ArticleSchema.virtual('featuredArticleImageURL').get(function (this: IArticle) {
  if (this.featuredArticleImage) {
    return this.featuredArticleImage;
  }

  const cloudinaryFeaturedArticle = this.cloudinaryImages.find(img => img.isFeaturedArticleImage);
  if (cloudinaryFeaturedArticle) {
    return cloudinaryFeaturedArticle.url;
  }

  return this.featuredArticleImage;
});

ArticleSchema.virtual('optimizedImages').get(function (this: IArticle) {
  return this.cloudinaryImages.map(img => ({
    ...img,
    thumbnail: img.url.replace('/upload/', '/upload/w_300,h_200,c_fill/'),
    medium: img.url.replace('/upload/', '/upload/w_800,h_600,c_fill/'),
    large: img.url.replace('/upload/', '/upload/w_1200,h_800,c_fill/')
  }));
});

// Pre-save middleware
ArticleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    const timestamp = Date.now().toString().slice(-6);
    this.slug = `${baseSlug}-${timestamp}`;
  }

  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
  }

  if (!this.excerptHi && this.contentHi) {
    this.excerptHi = this.contentHi.substring(0, 150) + (this.contentHi.length > 150 ? '...' : '');
  }

  if (!this.seoTitle && this.title) {
    this.seoTitle = this.title.substring(0, 60);
  }

  if (!this.seoDescription && this.excerpt) {
    this.seoDescription = this.excerpt.substring(0, 160);
  }

  if (this.scheduledAt && new Date(this.scheduledAt) > new Date()) {
    this.status = 'scheduled';
  }

  next();
});

// Post-save middleware
ArticleSchema.post('save', function (doc: IArticle) {
  console.log(`Article saved: ${doc.title}`);
});

// Static methods
ArticleSchema.statics.findFeatured = function () {
  return this.find({
    status: 'published',
    isFeatured: true
  })
    .populate('author category')
    .sort({ publishedAt: -1 });
};

ArticleSchema.statics.findBreaking = function () {
  return this.find({
    status: 'published',
    isBreaking: true
  })
    .populate('author category')
    .sort({ publishedAt: -1 })
    .limit(5);
};

// Instance methods with duplicate prevention
ArticleSchema.methods.incrementView = async function (userId: string, ipAddress?: string) {
  // Check if user has already viewed (within last 24 hours for views)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const alreadyViewed = this.viewedBy.some((view: IUserInteraction) => 
    view.userId.toString() === userId && 
    new Date(view.timestamp) > oneDayAgo
  );

  if (!alreadyViewed) {
    this.viewedBy.push({
      userId: new mongoose.Types.ObjectId(userId),
      ipAddress,
      timestamp: new Date()
    });
    this.meta.views += 1;
  }

  return this.save();
};

ArticleSchema.methods.incrementLike = async function (userId: string, ipAddress?: string) {
  // Check if user has already liked
  const alreadyLiked = this.likedBy.some((like: IUserInteraction) => 
    like.userId.toString() === userId
  );

  if (alreadyLiked) {
    return {
      success: false,
      message: 'You have already liked this article',
      article: this
    };
  }

  this.likedBy.push({
    userId: new mongoose.Types.ObjectId(userId),
    ipAddress,
    timestamp: new Date()
  });
  this.meta.likes += 1;

  await this.save();

  return {
    success: true,
    message: 'Article liked successfully',
    article: this
  };
};

ArticleSchema.methods.removeLike = async function (userId: string) {
  const likeIndex = this.likedBy.findIndex((like: IUserInteraction) => 
    like.userId.toString() === userId
  );

  if (likeIndex === -1) {
    return {
      success: false,
      message: 'You have not liked this article',
      article: this
    };
  }

  this.likedBy.splice(likeIndex, 1);
  this.meta.likes = Math.max(0, this.meta.likes - 1);

  await this.save();

  return {
    success: true,
    message: 'Like removed successfully',
    article: this
  };
};

ArticleSchema.methods.incrementShare = async function (userId: string, platform: string, ipAddress?: string) {
  // Check if user has already shared on this platform (within last hour to prevent spam)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const alreadyShared = this.sharedBy.some((share: IUserInteraction) => 
    share.userId.toString() === userId && 
    share.platform === platform.toLowerCase() &&
    new Date(share.timestamp) > oneHourAgo
  );

  if (alreadyShared) {
    return {
      success: false,
      message: `You have already shared this article on ${platform} recently`,
      article: this
    };
  }

  this.sharedBy.push({
    userId: new mongoose.Types.ObjectId(userId),
    ipAddress,
    timestamp: new Date(),
    platform: platform.toLowerCase()
  });
  this.meta.shares += 1;

  await this.save();

  return {
    success: true,
    message: 'Article shared successfully',
    article: this
  };
};

ArticleSchema.methods.addComment = async function () {
  this.meta.comments += 1;
  return this.save();
};

export function getArticleModel() {
  return registerModel<IArticle>('Article', ArticleSchema);
}