import mongoose, { Schema, type Document } from 'mongoose';
import { registerModel } from '../mongodb';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: 'general' | 'complaint' | 'suggestion' | 'partnership' | 'other';
  status: 'new' | 'read' | 'replied' | 'closed';
  ipAddress?: string;
  userAgent?: string;
  repliedAt?: Date;
  repliedBy?: mongoose.Types.ObjectId;
  replyMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000
    },
    category: {
      type: String,
      enum: ['general', 'complaint', 'suggestion', 'partnership', 'other'],
      default: 'general'
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new'
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    repliedAt: {
      type: Date,
      default: null
    },
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    replyMessage: {
      type: String,
      maxlength: 5000,
      default: null
    },
  },
  {
    timestamps: true
  }
);

// Indexes
ContactMessageSchema.index({ status: 1 });
ContactMessageSchema.index({ category: 1 });
ContactMessageSchema.index({ email: 1 });
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ repliedAt: -1 });

// Pre-save middleware
ContactMessageSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'replied' && !this.repliedAt) {
    this.repliedAt = new Date();
  }
  next();
});

// export const ContactMessage = registerModel<IContactMessage>('ContactMessage', ContactMessageSchema);

export function getContactMessageModel() {
  return registerModel<IContactMessage>('ContactMessage', ContactMessageSchema);
}