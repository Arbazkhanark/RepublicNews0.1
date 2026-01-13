import { getOpinionModel, getUserModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Interface for populated user data
interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar?: string;
  profilePic?: string;
}

// Interface for populated share records
interface PopulatedShareRecord {
  _id: mongoose.Types.ObjectId;
  platform: string;
  ip: string;
  userId?: PopulatedUser;
  timestamp: Date;
  completed: boolean;
}

// Interface for populated view records
interface PopulatedViewRecord {
  _id: mongoose.Types.ObjectId;
  ip: string;
  userId?: PopulatedUser;
  timestamp: Date;
}

// Interface for response
interface OpinionResponse {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  topic: string;
  tags: string[];
  authorId: PopulatedUser;
  status: "pending" | "approved" | "rejected";
  likes: number;
  dislikes: number;
  likedBy: PopulatedUser[];
  dislikedBy: PopulatedUser[];
  likedByIP: string[];
  dislikedByIP: string[];
  views: number;
  shares: number;
  shareRecords: PopulatedShareRecord[];
  viewRecords: PopulatedViewRecord[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

/**
 * ✅ GET SINGLE OPINION WITH DEEP POPULATION
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid opinion id" },
        { status: 400 }
      );
    }

    const Opinion = getOpinionModel();
    const User = getUserModel();

    // ✅ Find opinion with deep population
    const opinion = await Opinion.findById(id)
      .populate({
        path: "authorId",
        select: "name email avatar profilePic createdAt",
        model: User
      })
      .populate({
        path: "likedBy",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "dislikedBy",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "shareRecords.userId",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "viewRecords.userId",
        select: "name email avatar profilePic",
        model: User
      })
      .lean();

    if (!opinion) {
      return NextResponse.json(
        { error: "Opinion not found" },
        { status: 404 }
      );
    }

    // ✅ Format the response
    const formattedOpinion: OpinionResponse = {
      ...opinion,
      authorId: opinion.authorId as PopulatedUser,
      likedBy: (opinion.likedBy || []) as PopulatedUser[],
      dislikedBy: (opinion.dislikedBy || []) as PopulatedUser[],
      shareRecords: (opinion.shareRecords || []).map(record => ({
        ...record,
        userId: record.userId as PopulatedUser | undefined
      })) as PopulatedShareRecord[],
      viewRecords: (opinion.viewRecords || []).map(record => ({
        ...record,
        userId: record.userId as PopulatedUser | undefined
      })) as PopulatedViewRecord[],
    };

    // ✅ Calculate statistics
    const statistics = {
      totalLikes: opinion.likes,
      totalDislikes: opinion.dislikes,
      totalViews: opinion.views,
      totalShares: opinion.shares,
      uniqueViewers: new Set(opinion.viewRecords?.map((r: any) => 
        r.userId ? r.userId._id?.toString() : r.ip
      )).size,
      uniqueSharers: new Set(opinion.shareRecords?.filter((r: any) => r.completed)
        .map((r: any) => r.userId ? r.userId._id?.toString() : r.ip)
      ).size,
      platformWiseShares: (opinion.shareRecords || []).reduce((acc: Record<string, number>, record: any) => {
        if (record.completed) {
          acc[record.platform] = (acc[record.platform] || 0) + 1;
        }
        return acc;
      }, {}),
      recentLikes: (opinion.likedBy || []).slice(-5).map((user: any) => ({
        name: user.name,
        avatar: user.avatar || user.profilePic,
        id: user._id
      })),
      recentShares: (opinion.shareRecords || [])
        .filter((r: any) => r.completed)
        .slice(-5)
        .map((record: any) => ({
          platform: record.platform,
          user: record.userId ? {
            name: record.userId.name,
            avatar: record.userId.avatar || record.userId.profilePic
          } : null,
          timestamp: record.timestamp
        })),
      recentViews: (opinion.viewRecords || [])
        .slice(-5)
        .map((record: any) => ({
          user: record.userId ? {
            name: record.userId.name,
            avatar: record.userId.avatar || record.userId.profilePic
          } : null,
          timestamp: record.timestamp,
          ip: record.ip
        }))
    };

    return NextResponse.json({ 
      opinion: formattedOpinion,
      statistics
    });
  } catch (error) {
    console.error("Error fetching opinion:", error);
    return NextResponse.json(
      { error: "Failed to fetch opinion" },
      { status: 500 }
    );
  }
}

/**
 * ✅ UPDATE OPINION STATUS (ADMIN)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid opinion id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body; // approved | rejected

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const Opinion = getOpinionModel();
    const User = getUserModel();

    const updated = await Opinion.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({
        path: "authorId",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "likedBy",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "dislikedBy",
        select: "name email avatar profilePic",
        model: User
      })
      .lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Opinion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Opinion ${status} successfully`,
      opinion: updated,
    });
  } catch (error) {
    console.error("Error updating opinion:", error);
    return NextResponse.json(
      { error: "Failed to update opinion" },
      { status: 500 }
    );
  }
}

/**
 * ✅ DELETE OPINION (ADMIN)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid opinion id" },
        { status: 400 }
      );
    }

    const Opinion = getOpinionModel();
    const User = getUserModel();

    // First get the opinion with populated data
    const opinion = await Opinion.findById(id)
      .populate({
        path: "authorId",
        select: "name email",
        model: User
      })
      .lean();

    if (!opinion) {
      return NextResponse.json(
        { error: "Opinion not found" },
        { status: 404 }
      );
    }

    // Delete the opinion
    await Opinion.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Opinion deleted successfully",
      deletedOpinion: {
        id: opinion._id,
        title: opinion.title,
        author: opinion.authorId,
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.error("Error deleting opinion:", error);
    return NextResponse.json(
      { error: "Failed to delete opinion" },
      { status: 500 }
    );
  }
}

/**
 * ✅ GET ENHANCED OPINION DETAILS WITH USER-SPECIFIC INFO
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid opinion id" },
        { status: 400 }
      );
    }

    // Get user info from request (you can get from auth token)
    const authHeader = request.headers.get('authorization');
    let currentUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // You can decode JWT token here to get user ID
      // For now, we'll get from request body
      const body = await request.json();
      currentUserId = body.currentUserId;
    }

    const Opinion = getOpinionModel();
    const User = getUserModel();

    // Get opinion with deep population
    const opinion = await Opinion.findById(id)
      .populate({
        path: "authorId",
        select: "name email avatar profilePic bio followers following createdAt",
        model: User
      })
      .populate({
        path: "likedBy",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "dislikedBy",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "shareRecords.userId",
        select: "name email avatar profilePic",
        model: User
      })
      .populate({
        path: "viewRecords.userId",
        select: "name email avatar profilePic",
        model: User
      })
      .lean();

    if (!opinion) {
      return NextResponse.json(
        { error: "Opinion not found" },
        { status: 404 }
      );
    }

    // Check if current user has interacted
    let userInteraction = {
      hasLiked: false,
      hasDisliked: false,
      hasViewed: false,
      hasShared: false,
      userShares: []
    };

    if (currentUserId) {
      const userId = new mongoose.Types.ObjectId(currentUserId);
      
      userInteraction = {
        hasLiked: opinion.likedBy?.some((user: any) => 
          user._id.toString() === currentUserId
        ) || false,
        hasDisliked: opinion.dislikedBy?.some((user: any) => 
          user._id.toString() === currentUserId
        ) || false,
        hasViewed: opinion.viewRecords?.some((record: any) => 
          record.userId && record.userId._id.toString() === currentUserId
        ) || false,
        hasShared: opinion.shareRecords?.some((record: any) => 
          record.userId && record.userId._id.toString() === currentUserId && record.completed
        ) || false,
        userShares: opinion.shareRecords?.filter((record: any) => 
          record.userId && record.userId._id.toString() === currentUserId
        ) || []
      };
    }

    // Format response
    const response = {
      opinion: {
        ...opinion,
        authorDetails: opinion.authorId,
        likedByUsers: opinion.likedBy,
        dislikedByUsers: opinion.dislikedBy,
        shareRecords: opinion.shareRecords?.map((record: any) => ({
          ...record,
          userDetails: record.userId
        })),
        viewRecords: opinion.viewRecords?.map((record: any) => ({
          ...record,
          userDetails: record.userId
        }))
      },
      userInteraction,
      analytics: {
        engagementRate: ((opinion.likes + opinion.dislikes + opinion.shares) / opinion.views) * 100 || 0,
        likeDislikeRatio: opinion.dislikes > 0 ? (opinion.likes / opinion.dislikes) : opinion.likes,
        averageViewsPerDay: calculateAveragePerDay(opinion.createdAt, opinion.views),
        mostActivePlatform: getMostActivePlatform(opinion.shareRecords)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching enhanced opinion:", error);
    return NextResponse.json(
      { error: "Failed to fetch opinion details" },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateAveragePerDay(createdAt: Date, totalViews: number): number {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? totalViews / diffDays : totalViews;
}

function getMostActivePlatform(shareRecords: any[]): string {
  if (!shareRecords || shareRecords.length === 0) return 'none';
  
  const platformCounts: Record<string, number> = {};
  shareRecords.forEach(record => {
    if (record.completed) {
      platformCounts[record.platform] = (platformCounts[record.platform] || 0) + 1;
    }
  });
  
  return Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
}