// import type { ObjectId } from "mongodb"

// export interface User {
//   _id?: ObjectId
//   name: string
//   email: string
//   password: string
//   role: "admin" | "writer" | "editor"
//   profileImage?: string
//   bio?: string
//   socialLinks?: {
//     twitter?: string
//     facebook?: string
//     instagram?: string
//     linkedin?: string
//   }
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// export interface UserSession {
//   _id?: ObjectId
//   userId: ObjectId
//   token: string
//   expiresAt: Date
//   createdAt: Date
// }





// import mongoose, { Schema, type Document } from "mongoose"

// export interface IUser extends Document {
//   name: string
//   email: string
//   password: string
//   role: "admin" | "writer" | "editor" | "user"
//   profileImage?: string
//   bio?: string
//   socialLinks?: {
//     twitter?: string
//     facebook?: string
//     instagram?: string
//     linkedin?: string
//   }
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// const UserSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["admin", "writer", "editor","user"], required: true },
//     profileImage: String,
//     bio: String,
//     socialLinks: {
//       twitter: String,
//       facebook: String,
//       instagram: String,
//       linkedin: String,
//     },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// )

// export const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema)
















// models/User.ts
import mongoose, { Schema, type Document } from 'mongoose';
import { registerModel } from '../mongodb';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'writer' | 'editor' | 'user';
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    role: { 
      type: String, 
      enum: ['admin', 'writer', 'editor', 'user'], 
      required: true,
      default: 'user'
    },
    profileImage: { 
      type: String,
      default: null
    },
    bio: { 
      type: String,
      maxlength: 500 
    },
    socialLinks: {
      twitter: { type: String, default: null },
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    lastLogin: { 
      type: Date,
      default: null
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes
// UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for profile URL
UserSchema.virtual('profileURL').get(function(this: IUser) {
  return this.profileImage ? `/uploads/profiles/${this.profileImage}` : '/images/default-avatar.png';
});

// Method to get public profile (without password)
UserSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// export const User = registerModel<IUser>('User', UserSchema);

export function getUserModel() {
  return registerModel<IUser>('User', UserSchema);
}
