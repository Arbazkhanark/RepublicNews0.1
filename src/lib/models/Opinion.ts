import mongoose, { Schema, Document } from "mongoose";
import { registerModel } from "../mongodb";

export interface IOpinion extends Document {
  title: string;
  imageUrl?: string;
  content: string;
  topic: string;
  tags?: string[];
  authorId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  likes: number;
  dislikes: number;
  likedBy: mongoose.Types.ObjectId[];
  dislikedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OpinionSchema = new Schema<IOpinion>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String },
    content: { type: String, required: true },
    topic: { type: String, required: true },
    tags: [{ type: String }],
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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },

    // ✅ New fields to track who liked/disliked
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
  },
  { timestamps: true }
);

export function getOpinionModel() {
  return registerModel<IOpinion>("Opinion", OpinionSchema);
}
