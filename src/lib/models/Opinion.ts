import mongoose, { Schema, Document } from "mongoose";
import { registerModel } from "../mongodb";

// Interface for sharing tracking
export interface IShareRecord {
  platform: string;
  ip: string;
  userId?: mongoose.Types.ObjectId;
  timestamp: Date;
  completed: boolean; // Whether share was actually completed
}

export interface IViewRecord {
  ip: string;
  userId?: mongoose.Types.ObjectId;
  timestamp: Date;
}

export interface IOpinionResponse extends Omit<IOpinion, 'toObject'> {
  userVote?: 'like' | 'dislike' | 'none';
}

export interface IOpinion extends Document {
  title: string;
  titleHi: string; // Hindi title
  content: string;
  contentHi: string; // Hindi content
  imageUrl?: string;
  topic: string;
  tags?: string[];
  authorId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  
  // Voting
  likes: number;
  dislikes: number;
  likedBy: mongoose.Types.ObjectId[];
  dislikedBy: mongoose.Types.ObjectId[];
  likedByIP: string[];
  dislikedByIP: string[];
  
  // Sharing
  shares: number;
  shareRecords: IShareRecord[];
  
  // Views
  views: number;
  viewRecords: IViewRecord[];
  
  createdAt: Date;
  updatedAt: Date;
}

const ShareRecordSchema = new Schema<IShareRecord>({
  platform: { 
    type: String, 
    required: true,
    enum: ['facebook', 'twitter', 'whatsapp', 'linkedin', 'telegram', 'email', 'other', 'copy']
  },
  ip: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

const ViewRecordSchema = new Schema<IViewRecord>({
  ip: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  timestamp: { type: Date, default: Date.now }
});

const OpinionSchema = new Schema<IOpinion>(
  {
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
    content: { 
      type: String, 
      required: true 
    },
    contentHi: { 
      type: String, 
      required: true 
    },
    imageUrl: { type: String },
    topic: { 
      type: String, 
      required: true,
      trim: true 
    },
    tags: [{ 
      type: String,
      trim: true,
      lowercase: true 
    }],
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    
    // Voting fields
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likedByIP: [{ 
      type: String,
      trim: true 
    }],
    dislikedByIP: [{ 
      type: String,
      trim: true 
    }],
    
    // Sharing fields
    shares: { type: Number, default: 0 },
    shareRecords: [ShareRecordSchema],
    
    // View fields
    views: { type: Number, default: 0 },
    viewRecords: [ViewRecordSchema],
  },
  { timestamps: true }
);

// Text index for Hindi and English search
OpinionSchema.index({ 
  title: 'text', 
  content: 'text',
  titleHi: 'text',
  contentHi: 'text'
});

// Compound indexes for faster lookups
OpinionSchema.index({ "shareRecords.ip": 1, "shareRecords.userId": 1, "shareRecords.platform": 1 });
OpinionSchema.index({ "viewRecords.ip": 1, "viewRecords.userId": 1 });
OpinionSchema.index({ "viewRecords.ip": 1, timestamp: -1 });

// Pre-save middleware to ensure Hindi fields are always present
// OpinionSchema.pre('save', function(next) {
//   // If titleHi is not provided, copy from title
//   if (!this.titleHi || this.titleHi.trim() === '') {
//     this.titleHi = this.title;
//   }
  
//   // If contentHi is not provided, copy from content
//   if (!this.contentHi || this.contentHi.trim() === '') {
//     this.contentHi = this.content;
//   }
  
//   next();
// });

export function getOpinionModel() {
  return registerModel<IOpinion>("Opinion", OpinionSchema);
}