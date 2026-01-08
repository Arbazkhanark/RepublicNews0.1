import mongoose, { Schema, type Document } from 'mongoose';
import { registerModel } from '../mongodb';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    slug: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: { 
      type: String,
      maxlength: 500 
    },
    parentCategory: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category',
      default: null
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
    seoTitle: { 
      type: String,
      maxlength: 200 
    },
    seoDescription: { 
      type: String,
      maxlength: 300 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes
// CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ name: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ featured: 1 });
CategorySchema.index({ createdAt: -1 });

// Virtual for article count
CategorySchema.virtual('articleCount', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'categories',
  count: true
});

// Pre-save middleware to generate slug
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// export const Category = registerModel<ICategory>('Category', CategorySchema);

export function getCategoryModel() {
  return registerModel<ICategory>('Category', CategorySchema);
}