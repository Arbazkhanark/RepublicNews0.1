import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getOpinionModel, getUserModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";

// Helper function to get client IP
export const getClientIP = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : req.ip || "unknown";
  return ip;
};

// Helper to check if IP has voted (with or without userId)
const hasIPVoted = (
  ipArray: Array<{ ip: string; userId?: mongoose.Types.ObjectId }>,
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
): boolean => {
  if (userId) {
    // Check if this IP with same userId has voted
    return ipArray.some(
      (vote) => vote.ip === clientIP && vote.userId && vote.userId.equals(userId)
    );
  } else {
    // Check if this IP (without userId) has voted
    return ipArray.some(
      (vote) => vote.ip === clientIP && !vote.userId
    );
  }
};

// Helper to get user's vote type
const getUserVoteType = (
  opinion: any,
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
): 'like' | 'dislike' | 'none' => {
  // First check logged-in user
  if (userId) {
    const isLiked = opinion.likedBy.some(
      (uid: mongoose.Types.ObjectId) => uid.equals(userId)
    );
    const isDisliked = opinion.dislikedBy.some(
      (uid: mongoose.Types.ObjectId) => uid.equals(userId)
    );
    
    if (isLiked) return 'like';
    if (isDisliked) return 'dislike';
  }
  
  // Then check IP votes
  const ipLiked = hasIPVoted(opinion.likedByIP || [], clientIP, userId);
  const ipDisliked = hasIPVoted(opinion.dislikedByIP || [], clientIP, userId);
  
  if (ipLiked) return 'like';
  if (ipDisliked) return 'dislike';
  
  return 'none';
};

// Remove vote from all possible combinations
const removeAllVotes = (
  opinion: any,
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
) => {
  if (userId) {
    // Remove from logged-in arrays
    opinion.likedBy = opinion.likedBy.filter(
      (uid: mongoose.Types.ObjectId) => !uid.equals(userId)
    );
    opinion.dislikedBy = opinion.dislikedBy.filter(
      (uid: mongoose.Types.ObjectId) => !uid.equals(userId)
    );
    
        // opinion.likedByIP.push(`ip:${clientIP},userId:${userId ? userId.toString() : 'anonymous'}`);
    opinion.likedByIP = (opinion.likedByIP || []).filter((ip)=> ip !== `ip:${clientIP},userId:${userId.toString()}`);
    opinion.dislikedByIP = (opinion.dislikedByIP || []).filter((ip)=> ip !== `ip:${clientIP},userId:${userId.toString()}`);
  } else {
    // Remove from IP arrays without userId
    opinion.likedByIP = (opinion.likedByIP || []).filter((ip)=> ip !== `ip:${clientIP},userId:anonymous`);
    opinion.dislikedByIP = (opinion.dislikedByIP || []).filter((ip)=> ip !== `ip:${clientIP},userId:anonymous`);
  }
};

// Add vote with IP tracking
const addVoteWithIP = (
  opinion: any,
  type: 'like' | 'dislike',
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
) => {
  // First remove any existing votes
  removeAllVotes(opinion, clientIP, userId);
  
  // Add to appropriate arrays
  if (type === 'like') {
    opinion.likes += 1;
    if (userId) {
      opinion.likedBy.push(userId);
    }
    // Always save IP with optional userId
    opinion.likedByIP.push(`ip:${clientIP},userId:${userId ? userId.toString() : 'anonymous'}`);
  } else {
    opinion.dislikes += 1;
    if (userId) {
      opinion.dislikedBy.push(userId);
    }
    // Always save IP with optional userId
    opinion.dislikedByIP.push(`ip:${clientIP},userId:${userId ? userId.toString() : 'anonymous'}`);
  }
};

// PATCH: Like or Dislike an opinion
const handlePatch = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
  user: UserFromToken | null
) => {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const { type } = await req.json();
    if (!["like", "dislike"].includes(type)) {
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    const clientIP = getClientIP(req);
    const userId = user?.userId ? new mongoose.Types.ObjectId(user.userId) : null;

    // Initialize arrays if undefined
    opinion.likedBy ||= [];
    opinion.dislikedBy ||= [];
    opinion.likedByIP ||= [];
    opinion.dislikedByIP ||= [];

    // Check current vote status
    const currentVote = getUserVoteType(opinion, clientIP, userId);
    
    if (currentVote === type) {
      // Remove vote if already voted for same type
      if (type === 'like') {
        opinion.likes = Math.max(opinion.likes - 1, 0);
      } else {
        opinion.dislikes = Math.max(opinion.dislikes - 1, 0);
      }
      removeAllVotes(opinion, clientIP, userId);
    } else {
      // Add new vote (automatically removes opposite if exists)
      addVoteWithIP(opinion, type, clientIP, userId);
    }

    await opinion.save();

    return NextResponse.json({ 
      message: currentVote === type ? `${type} removed` : `${type} registered`,
      opinion,
      userType: userId ? 'loggedIn' : 'anonymous',
      clientIP,
      userId: userId?.toString()
    });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update opinion" }, { status: 500 });
  }
};

// ✅ Export PATCH without requiring auth
export const PATCH = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  try {
    // Try to get user from token
    let user: UserFromToken | null = null;
    try {
      const authResult = await withAuth((req: NextRequest, authUser: UserFromToken) => {
        return { user: authUser };
      })(req);
      user = authResult?.user || null;
    } catch {
      user = null;
    }
    
    return handlePatch(req, context, user);
  } catch (error) {
    console.error("PATCH Auth Error:", error);
    return handlePatch(req, context, null);
  }
};

// ✅ GET - Updated for Next.js 14+
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    getUserModel();
    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id).populate("authorId", "name email");

    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    // Get client IP to check their vote status
    const clientIP = getClientIP(req);
    
    // Convert to plain object
    const opinionObj = opinion.toObject();
    
    // Check vote status
    const voteType = getUserVoteType(opinion, clientIP, null);
    
    // Add userVote to response object
    const responseObj = {
      ...opinionObj,
      userVote: voteType
    };

    return NextResponse.json({ 
      opinion: responseObj, 
      clientIP,
      userVote: voteType 
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch opinion" }, { status: 500 });
  }
}

// ✅ DELETE - Updated for Next.js 14+
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // DELETE requires authentication
    return await withAuth(async (req: NextRequest, user: UserFromToken) => {
      await connectToDatabase();
      const { id } = await context.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
      }

      const Opinion = getOpinionModel();
      const deleted = await Opinion.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Opinion deleted successfully",
        opinion: deleted,
      });
    })(req);
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete opinion" }, { status: 500 });
  }
}