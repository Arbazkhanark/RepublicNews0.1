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

// Check if IP/UserId combination already exists
const hasExistingView = (
  viewRecords: Array<{ ip: string; userId?: mongoose.Types.ObjectId }>,
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
): boolean => {
  return viewRecords.some((record) => {
    // Same IP check
    if (record.ip !== clientIP) return false;
    
    // UserId comparison
    if (userId) {
      // If current user is logged in, check if same userId exists
      return record.userId && record.userId.equals(userId);
    } else {
      // If current user is anonymous, check if record also has no userId
      return !record.userId;
    }
  });
};

// Find existing view record
const findExistingView = (
  viewRecords: Array<{ ip: string; userId?: mongoose.Types.ObjectId; _id?: any }>,
  clientIP: string,
  userId: mongoose.Types.ObjectId | null
): any => {
  return viewRecords.find((record) => {
    if (record.ip !== clientIP) return false;
    
    if (userId) {
      return record.userId && record.userId.equals(userId);
    } else {
      return !record.userId;
    }
  });
};

// POST: Record a view with NO DUPLICATES
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

    // Initialize arrays if undefined
    opinion.viewRecords ||= [];

    // Check if this IP/User combination already exists
    const existingView = findExistingView(opinion.viewRecords, clientIP, userId);
    
    if (existingView) {
      // Update timestamp but don't increment count
      existingView.timestamp = new Date();
      await opinion.save();
      
      return NextResponse.json({
        message: "View already exists, timestamp updated",
        views: opinion.views,
        viewId: existingView._id,
        alreadyExists: true,
        timestamp: new Date()
      });
    }

    // If not exists, create new view record
    const newViewRecord = {
      ip: clientIP,
      userId: userId || undefined,
      timestamp: new Date()
    };

    opinion.viewRecords.push(newViewRecord);
    opinion.views += 1; // Only increment count for new views
    
    await opinion.save();

    return NextResponse.json({
      message: "New view recorded successfully",
      views: opinion.views,
      viewId: opinion.viewRecords[opinion.viewRecords.length - 1]._id,
      timestamp: new Date(),
      isNewView: true
    });

  } catch (error) {
    console.error("View POST Error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

// PUT: Record view with time-based duplicate prevention
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

    // Initialize arrays if undefined
    opinion.viewRecords ||= [];

    // Find existing view record for this IP/User combination
    const existingView = findExistingView(opinion.viewRecords, clientIP, userId);
    
    if (existingView) {
      // Check if it's been more than 24 hours since last view
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const lastViewTime = new Date(existingView.timestamp);
      
      if (lastViewTime > twentyFourHoursAgo) {
        // Update timestamp but don't increment count
        existingView.timestamp = new Date();
        await opinion.save();
        
        return NextResponse.json({ 
          message: "View already counted today, timestamp updated",
          views: opinion.views,
          alreadyCounted: true,
          nextViewTime: new Date(lastViewTime.getTime() + 24 * 60 * 60 * 1000)
        });
      } else {
        // It's been more than 24 hours, update timestamp and increment count
        existingView.timestamp = new Date();
        opinion.views += 1;
        await opinion.save();
        
        return NextResponse.json({
          message: "View counted after 24-hour break",
          views: opinion.views,
          viewId: existingView._id,
          counted: true
        });
      }
    }

    // If no existing view, create new
    const newViewRecord = {
      ip: clientIP,
      userId: userId || undefined,
      timestamp: new Date()
    };

    opinion.viewRecords.push(newViewRecord);
    opinion.views += 1;
    
    await opinion.save();

    return NextResponse.json({
      message: "New view recorded successfully",
      views: opinion.views,
      viewId: opinion.viewRecords[opinion.viewRecords.length - 1]._id,
      isNewView: true
    });

  } catch (error) {
    console.error("View PUT Error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

// DELETE: Remove duplicate views (admin/cleanup function)
export async function DELETE(
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
    const opinion = await Opinion.findById(id);
    
    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    // Remove duplicate views based on IP/User combination
    const uniqueViews = new Map();
    const uniqueRecords = [];
    
    for (const record of opinion.viewRecords) {
      const key = `${record.ip}-${record.userId?.toString() || 'anonymous'}`;
      
      if (!uniqueViews.has(key)) {
        uniqueViews.set(key, true);
        uniqueRecords.push(record);
      }
    }

    // Update view count based on unique records
    const oldCount = opinion.views;
    const oldRecordsCount = opinion.viewRecords.length;
    opinion.viewRecords = uniqueRecords;
    opinion.views = uniqueRecords.length;
    
    await opinion.save();

    return NextResponse.json({
      message: "Duplicate views removed successfully",
      oldViewCount: oldCount,
      newViewCount: opinion.views,
      duplicatesRemoved: oldRecordsCount - uniqueRecords.length,
      remainingUniqueViews: uniqueRecords.length
    });

  } catch (error) {
    console.error("View DELETE Error:", error);
    return NextResponse.json({ error: "Failed to remove duplicates" }, { status: 500 });
  }
}

// GET: Get view statistics with unique view calculation
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
    const opinion = await Opinion.findById(id).select("views viewRecords");

    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    // Calculate unique views
    const uniqueViewsMap = new Map();
    const uniqueViewsByDay: Record<string, Set<string>> = {};
    
    opinion.viewRecords.forEach((record: any) => {
      const key = `${record.ip}-${record.userId?.toString() || 'anonymous'}`;
      uniqueViewsMap.set(key, true);
      
      // Group by day for unique daily views
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      if (!uniqueViewsByDay[date]) {
        uniqueViewsByDay[date] = new Set();
      }
      uniqueViewsByDay[date].add(key);
    });

    // Calculate daily views (including duplicates)
    const dailyViews = opinion.viewRecords.reduce((acc: Record<string, number>, record: any) => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Calculate unique daily views
    const uniqueDailyViews: Record<string, number> = {};
    Object.keys(uniqueViewsByDay).forEach(date => {
      uniqueDailyViews[date] = uniqueViewsByDay[date].size;
    });

    // Calculate today's views
    const today = new Date().toISOString().split('T')[0];
    const todayViews = opinion.viewRecords.filter((record: any) => 
      new Date(record.timestamp).toISOString().split('T')[0] === today
    );
    
    const todayUniqueViews = new Set(
      todayViews.map((record: any) => 
        `${record.ip}-${record.userId?.toString() || 'anonymous'}`
      )
    );

    // Get user's view history
    const userId = req.headers.get('x-user-id');
    let userViews = [];
    let userTotalViews = 0;
    
    if (userId) {
      userViews = opinion.viewRecords.filter((record: any) => 
        record.userId && record.userId.toString() === userId
      );
      userTotalViews = new Set(
        userViews.map((record: any) => record.ip)
      ).size;
    }

    return NextResponse.json({
      // Total statistics
      totalViews: opinion.views,
      uniqueViews: uniqueViewsMap.size,
      duplicateViews: opinion.viewRecords.length - uniqueViewsMap.size,
      
      // Today's statistics
      todayTotalViews: todayViews.length,
      todayUniqueViews: todayUniqueViews.size,
      
      // Daily breakdown
      dailyViews,
      uniqueDailyViews,
      
      // User-specific (if logged in)
      userViews: userViews.length,
      userUniqueViews: userTotalViews,
      
      // Recent activity
      recentViews: opinion.viewRecords
        .slice(-20)
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((record: any) => ({
          ip: record.ip,
          userId: record.userId,
          timestamp: record.timestamp,
          isLoggedIn: !!record.userId
        }))
    });

  } catch (error) {
    console.error("View GET Error:", error);
    return NextResponse.json({ error: "Failed to get view stats" }, { status: 500 });
  }
}

// PATCH: Cleanup existing duplicates (one-time fix)
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

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id);
    
    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    const { action } = await req.json();
    
    if (action === 'fixCount') {
      // Fix view count to match unique records
      const uniqueKeys = new Set();
      const uniqueRecords = [];
      
      opinion.viewRecords.forEach((record: any) => {
        const key = `${record.ip}-${record.userId?.toString() || 'anonymous'}`;
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          uniqueRecords.push(record);
        }
      });
      
      const oldCount = opinion.views;
      opinion.views = uniqueRecords.length;
      
      await opinion.save();
      
      return NextResponse.json({
        message: "View count fixed to match unique views",
        oldCount,
        newCount: opinion.views,
        uniqueViews: uniqueRecords.length
      });
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("View PATCH Error:", error);
    return NextResponse.json({ error: "Failed to cleanup views" }, { status: 500 });
  }
}