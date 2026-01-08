import mongoose, { Schema, type Document } from 'mongoose';
import { registerModel } from '../mongodb';

export interface INewsletterSubscriber extends Document {
  email: string;
  name?: string;
  isActive: boolean;
  subscriptionDate: Date;
  unsubscriptionDate?: Date;
  preferences: {
    categories: mongoose.Types.ObjectId[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  verificationToken?: string;
  isVerified: boolean;
  lastSent?: Date;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: { 
      type: String,
      trim: true,
      maxlength: 100
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    subscriptionDate: { 
      type: Date, 
      default: Date.now 
    },
    unsubscriptionDate: { 
      type: Date,
      default: null
    },
    preferences: {
      categories: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Category' 
      }],
      frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly'], 
        default: 'weekly' 
      }
    },
    verificationToken: { 
      type: String,
      default: null
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    lastSent: { 
      type: Date,
      default: null
    },
    source: { 
      type: String,
      default: 'website'
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes
// NewsletterSubscriberSchema.index({ email: 1 }, { unique: true });
NewsletterSubscriberSchema.index({ isActive: 1 });
NewsletterSubscriberSchema.index({ isVerified: 1 });
NewsletterSubscriberSchema.index({ 'preferences.frequency': 1 });
NewsletterSubscriberSchema.index({ subscriptionDate: -1 });
NewsletterSubscriberSchema.index({ lastSent: 1 });

// export const NewsletterSubscriber = registerModel<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);

export function getNewsletterSubscriberModel() {
  return registerModel<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);
}
