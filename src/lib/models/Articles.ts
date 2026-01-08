// // models/Article.ts
// import mongoose, { Schema, type Document } from 'mongoose';
// import { registerModel } from '../mongodb';
// import { getUserModel } from "@/lib/models/User";


// export interface IArticle extends Document {
//   title: string;
//   slug: string;
//   content: string;
//   excerpt?: string;
//   featuredImage?: string;
//   author: mongoose.Types.ObjectId;
//   categories: mongoose.Types.ObjectId[];
//   tags: string[];
//   status: 'draft' | 'published' | 'archived';
//   publishedAt?: Date | null;
//   meta: {
//     views: number;
//     likes: number;
//     shares: number;
//   };
//   seoTitle?: string;
//   seoDescription?: string;
//   isFeatured: boolean;
//   isBreaking: boolean;
//   allowComments: boolean;
//   createdBy: mongoose.Types.ObjectId;
//   updatedBy: mongoose.Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ArticleSchema = new Schema<IArticle>(
//   {
//     title: { 
//       type: String, 
//       required: true,
//       trim: true,
//       maxlength: 200
//     },
//     slug: { 
//       type: String, 
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true
//     },
//     content: { 
//       type: String, 
//       required: true 
//     },
//     excerpt: { 
//       type: String,
//       maxlength: 300 
//     },
//     featuredImage: { 
//       type: String,
//       default: null
//     },
//     author: { 
//       type: Schema.Types.ObjectId, 
//       ref: 'User',
//       required: true 
//     },
//     categories: [{ 
//       type: Schema.Types.ObjectId, 
//       ref: 'Category',
//       required: true 
//     }],
//     tags: [{ 
//       type: String,
//       trim: true,
//       lowercase: true
//     }],
//     status: { 
//       type: String, 
//       enum: ['draft', 'published', 'archived'], 
//       default: 'draft' 
//     },
//     publishedAt: { 
//       type: Date,
//       default: null
//     },
//     meta: {
//       views: { type: Number, default: 0 },
//       likes: { type: Number, default: 0 },
//       shares: { type: Number, default: 0 }
//     },
//     seoTitle: { 
//       type: String,
//       maxlength: 200 
//     },
//     seoDescription: { 
//       type: String,
//       maxlength: 300 
//     },
//     isFeatured: { 
//       type: Boolean, 
//       default: false 
//     },
//     isBreaking: { 
//       type: Boolean, 
//       default: false 
//     },
//     allowComments: { 
//       type: Boolean, 
//       default: true 
//     },
//     createdBy: { 
//       type: Schema.Types.ObjectId, 
//       ref: 'User',
//       required: true 
//     },
//     updatedBy: { 
//       type: Schema.Types.ObjectId, 
//       ref: 'User',
//       required: true 
//     },
//   },
//   { 
//     timestamps: true 
//   }
// );

// // Indexes
// // ArticleSchema.index({ slug: 1 }, { unique: true });
// ArticleSchema.index({ author: 1 });
// ArticleSchema.index({ categories: 1 });
// ArticleSchema.index({ status: 1 });
// ArticleSchema.index({ publishedAt: -1 });
// ArticleSchema.index({ isFeatured: 1 });
// ArticleSchema.index({ isBreaking: 1 });
// ArticleSchema.index({ 'meta.views': -1 });
// ArticleSchema.index({ 'meta.likes': -1 });
// ArticleSchema.index({ tags: 1 });
// ArticleSchema.index({ createdAt: -1 });

// // Virtual for reading time
// ArticleSchema.virtual('readingTime').get(function(this: IArticle) {
//   const wordsPerMinute = 200;
//   const wordCount = this.content.split(/\s+/).length;
//   return Math.ceil(wordCount / wordsPerMinute);
// });

// // Virtual for featured image URL
// ArticleSchema.virtual('featuredImageURL').get(function(this: IArticle) {
//   return this.featuredImage ? `/uploads/articles/${this.featuredImage}` : '/images/default-article.jpg';
// });

// // Pre-save middleware
// ArticleSchema.pre('save', function(next) {
//   if (this.isModified('title')) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-zA-Z0-9 ]/g, '')
//       .replace(/\s+/g, '-');
//   }

//   if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
//     this.publishedAt = new Date();
//   }

//   // Auto-generate excerpt from content if not provided
//   if (!this.excerpt && this.content) {
//     this.excerpt = this.content.substring(0, 150) + '...';
//   }

//   next();
// });

// // export const Article = registerModel<IArticle>('Article', ArticleSchema);

// export function getArticleModel() {
//   return registerModel<IArticle>('Article', ArticleSchema);
// }


















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
  // categories?: mongoose.Types.ObjectId[];
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

  // System
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
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
    // categories: [{ 
    //   type: Schema.Types.ObjectId, 
    //   ref: 'Category'
    // }],
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

    // System
    allowComments: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
    // strictPopulate: false 
  }
);

// Indexes
// ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ title: 'text', subtitle: 'text', content: 'text', titleHi: 'text', contentHi: 'text' });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ category: 1 });
// ArticleSchema.index({ categories: 1 });
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

// Virtuals
ArticleSchema.virtual('readingTime').get(function (this: IArticle) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

ArticleSchema.virtual('readingTimeHi').get(function (this: IArticle) {
  const wordsPerMinute = 150; // Hindi reading is slightly slower
  const wordCount = this.contentHi.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

ArticleSchema.virtual('featuredImageURL').get(function (this: IArticle) {
  if (this.featuredImage) {
    return this.featuredImage;
  }

  // Check cloudinary images for featured image
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

  // Check cloudinary images for featured article image
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
  // Generate slug from English title
  if (this.isModified('title') && !this.isModified('slug')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    this.slug = `${baseSlug}-${timestamp}`;
  }

  // Handle publishedAt
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Auto-generate excerpt if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
  }

  if (!this.excerptHi && this.contentHi) {
    this.excerptHi = this.contentHi.substring(0, 150) + (this.contentHi.length > 150 ? '...' : '');
  }

  // Auto-generate SEO fields if not provided
  if (!this.seoTitle && this.title) {
    this.seoTitle = this.title.substring(0, 60);
  }

  if (!this.seoDescription && this.excerpt) {
    this.seoDescription = this.excerpt.substring(0, 160);
  }

  // Handle scheduled articles
  if (this.scheduledAt && new Date(this.scheduledAt) > new Date()) {
    this.status = 'scheduled';
  }

  // Ensure categories array includes main category
  // if (this.category && (!this.categories || this.categories.length === 0)) {
  //   this.categories = [this.category];
  // } 
  // else if (this.category && this.categories && !this.categories.includes(this.category)) {
  //   this.categories.push(this.category);
  // }

  // Update updatedBy (you'll need to set this from your auth middleware)
  next();
});

// Post-save middleware for cleanup
ArticleSchema.post('save', function (doc: IArticle) {
  // You can add any post-save logic here
  console.log(`Article saved: ${doc.title}`);
});

// Static methods
// ArticleSchema.statics.findBySlug = function(slug: string) {
//   return this.findOne({ slug }).populate('author category categories createdBy updatedBy');
// };

// ArticleSchema.statics.findPublished = function() {
//   return this.find({ status: 'published' })
//     .populate('author category categories')
//     .sort({ publishedAt: -1 });
// };

ArticleSchema.statics.findFeatured = function () {
  return this.find({
    status: 'published',
    isFeatured: true
  })
    .populate('author category categories')
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

// Instance methods
ArticleSchema.methods.incrementView = async function () {
  this.meta.views += 1;
  return this.save();
};

ArticleSchema.methods.incrementLike = async function () {
  this.meta.likes += 1;
  return this.save();
};

ArticleSchema.methods.incrementShare = async function () {
  this.meta.shares += 1;
  return this.save();
};

ArticleSchema.methods.addComment = async function () {
  this.meta.comments += 1;
  return this.save();
};

export function getArticleModel() {
  return registerModel<IArticle>('Article', ArticleSchema);
}


