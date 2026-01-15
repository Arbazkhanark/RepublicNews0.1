import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getOpinionModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";

// Helper function to get client IP
const getClientIP = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : req.ip || "unknown";
  return ip;
};

// Helper function to create share record
const createShareRecord = async (
  opinionId: string,
  platform: string,
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
) => {
  const Opinion = getOpinionModel();
  const opinion = await Opinion.findById(opinionId);
  
  if (!opinion) {
    throw new Error("Opinion not found");
  }

  // Create a new share record
  const shareRecord = {
    platform,
    ip: clientIP,
    userId: userId || undefined,
    timestamp: new Date(),
    completed: false
  };

  opinion.shareRecords.push(shareRecord);
  await opinion.save();

  return {
    opinion,
    shareRecord: opinion.shareRecords[opinion.shareRecords.length - 1]
  };
};

// POST: Start a share (initial share attempt) - USER CAN SHARE MULTIPLE TIMES
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const { platform, instantCount = false } = await req.json();
    
    if (!platform || !['facebook', 'twitter', 'whatsapp', 'linkedin', 'telegram', 'email', 'other', 'copy'].includes(platform)) {
      return NextResponse.json({ error: "Valid platform required" }, { status: 400 });
    }

    // Try to get user from token (optional)
    let user: UserFromToken | null = null;
    try {
      const authResult = await withAuth((req: NextRequest, authUser: UserFromToken) => {
        return { user: authUser };
      })(req);
      user = authResult?.user || null;
    } catch {
      user = null;
    }

    const clientIP = getClientIP(req);
    const userId = user?.userId ? new mongoose.Types.ObjectId(user.userId) : null;

    // Check for special platforms that should count instantly
    const instantCountPlatforms = ['copy']; // Copy link/platforms that we can verify instantly
    
    if (instantCountPlatforms.includes(platform) || instantCount) {
      // For platforms like "copy link", count immediately
      const Opinion = getOpinionModel();
      const opinion = await Opinion.findById(id);
      
      if (!opinion) {
        return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
      }

      // Create and immediately complete the share
      const shareRecord = {
        platform,
        ip: clientIP,
        userId: userId || undefined,
        timestamp: new Date(),
        completed: true
      };

      opinion.shareRecords.push(shareRecord);
      opinion.shares += 1;
      await opinion.save();

      return NextResponse.json({
        message: "Share counted immediately",
        platform,
        shares: opinion.shares,
        instantCount: true
      });
    }

    // For other platforms, create pending share record
    const result = await createShareRecord(id, platform, clientIP, userId);

    // Generate share URL based on platform
    const opinion = result.opinion;
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}&text=${encodeURIComponent(opinion.title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${opinion.title} - https://yourapp.com/opinions/${id}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}&text=${encodeURIComponent(opinion.title)}`,
      email: `mailto:?subject=${encodeURIComponent(opinion.title)}&body=${encodeURIComponent(`Check out this opinion: https://yourapp.com/opinions/${id}`)}`,
      other: `https://yourapp.com/opinions/${id}`,
      copy: `https://yourapp.com/opinions/${id}`
    };

    return NextResponse.json({
      message: "Share initiated",
      shareUrl: shareUrls[platform],
      platform,
      shareId: result.shareRecord._id,
      requiresConfirmation: true, // Tell frontend to confirm after actual share
      currentShares: opinion.shares
    });

  } catch (error: any) {
    console.error("Share POST Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to initiate share" 
    }, { status: 500 });
  }
}

// PUT: Confirm share was completed - USER CAN CONFIRM MULTIPLE SHARES
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const { shareId } = await req.json();
    if (!shareId) {
      return NextResponse.json({ error: "Share ID required" }, { status: 400 });
    }

    // Try to get user from token (optional)
    let user: UserFromToken | null = null;
    try {
      const authResult = await withAuth((req: NextRequest, authUser: UserFromToken) => {
        return { user: authUser };
      })(req);
      user = authResult?.user || null;
    } catch {
      user = null;
    }

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    const clientIP = getClientIP(req);
    const userId = user?.userId ? new mongoose.Types.ObjectId(user.userId) : null;

    // Find the share record
    const shareRecord = opinion.shareRecords.find((record: any) => 
      record._id.toString() === shareId
    );

    if (!shareRecord) {
      return NextResponse.json({ error: "Share record not found" }, { status: 404 });
    }

    // Verify ownership (IP and optionally userId)
    const isOwner = shareRecord.ip === clientIP && 
      ((userId && shareRecord.userId && shareRecord.userId.equals(userId)) || 
       (!userId && !shareRecord.userId));

    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized to confirm this share" }, { status: 403 });
    }

    // If already completed, return success
    if (shareRecord.completed) {
      return NextResponse.json({ 
        message: "Share already confirmed",
        shares: opinion.shares,
        alreadyConfirmed: true
      });
    }

    // Mark as completed and increment share count
    shareRecord.completed = true;
    opinion.shares += 1;
    
    await opinion.save();

    return NextResponse.json({
      message: "Share confirmed successfully",
      shares: opinion.shares,
      platform: shareRecord.platform
    });

  } catch (error) {
    console.error("Share PUT Error:", error);
    return NextResponse.json({ error: "Failed to confirm share" }, { status: 500 });
  }
}

// PATCH: Quick share without confirmation (for platforms we can track)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const { platform } = await req.json();
    
    if (!platform || !['facebook', 'twitter', 'whatsapp', 'linkedin', 'telegram', 'email', 'other', 'copy'].includes(platform)) {
      return NextResponse.json({ error: "Valid platform required" }, { status: 400 });
    }

    // Try to get user from token (optional)
    let user: UserFromToken | null = null;
    try {
      const authResult = await withAuth((req: NextRequest, authUser: UserFromToken) => {
        return { user: authUser };
      })(req);
      user = authResult?.user || null;
    } catch {
      user = null;
    }

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    const clientIP = getClientIP(req);
    const userId = user?.userId ? new mongoose.Types.ObjectId(user.userId) : null;

    // Create and immediately complete the share
    const shareRecord = {
      platform,
      ip: clientIP,
      userId: userId || undefined,
      timestamp: new Date(),
      completed: true
    };

    opinion.shareRecords.push(shareRecord);
    opinion.shares += 1;
    await opinion.save();

    // Generate share URL if needed
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}&text=${encodeURIComponent(opinion.title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${opinion.title} - https://yourapp.com/opinions/${id}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(`https://yourapp.com/opinions/${id}`)}&text=${encodeURIComponent(opinion.title)}`,
      email: `mailto:?subject=${encodeURIComponent(opinion.title)}&body=${encodeURIComponent(`Check out this opinion: https://yourapp.com/opinions/${id}`)}`,
      other: `https://yourapp.com/opinions/${id}`,
      copy: `https://yourapp.com/opinions/${id}`
    };

    return NextResponse.json({
      message: "Share counted successfully",
      shares: opinion.shares,
      platform,
      shareUrl: shareUrls[platform],
      instantCount: true
    });

  } catch (error) {
    console.error("Share PATCH Error:", error);
    return NextResponse.json({ error: "Failed to count share" }, { status: 500 });
  }
}

// GET: Get share statistics
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id).select("shares shareRecords");

    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    // Calculate platform-wise shares
    const platformStats: Record<string, number> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayShares = opinion.shareRecords.filter((record: any) => {
      return record.completed && new Date(record.timestamp) >= today;
    }).length;

    opinion.shareRecords.forEach((record: any) => {
      if (record.completed) {
        platformStats[record.platform] = (platformStats[record.platform] || 0) + 1;
      }
    });

    // Get user's share history (if logged in)
    const userId = req.headers.get('x-user-id'); // Assuming you pass user ID in headers
    let userShares = [];
    
    if (userId) {
      userShares = opinion.shareRecords.filter((record: any) => 
        record.userId && record.userId.toString() === userId
      );
    }

    return NextResponse.json({
      totalShares: opinion.shares,
      todayShares,
      platformStats,
      userShares: userShares.length,
      shareRecords: opinion.shareRecords.slice(-20).reverse() // Last 20 shares
    });

  } catch (error) {
    console.error("Share GET Error:", error);
    return NextResponse.json({ error: "Failed to get share stats" }, { status: 500 });
  }
}