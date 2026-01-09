import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport from '@/lib/models/FakeNewsReport';
import mongoose from 'mongoose';

/* ---------------- TYPES ---------------- */

interface ViewData {
  userId?: string;
  userIp?: string;
}

interface ViewerDocument {
  userId?: string;
  userIp?: string;
  userAgent?: string;
  viewedAt: Date;
}

interface FakeNewsReportDocument extends mongoose.Document {
  views: number;
  viewers: ViewerDocument[];
}

/* ---------------- UTILS ---------------- */

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

/* ======================================================
   POST → RECORD VIEW (WITH 24-HOUR DUPLICATE PROTECTION)
   ====================================================== */

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Report ID is required' 
        },
        { status: 400 }
      );
    }

    const body: ViewData = await request.json();
    const userIp = body.userIp || getClientIp(request);
    const userId = body.userId;
    
    // Check if report exists
    const report = await FakeNewsReport.findById(id).lean();
    
    if (!report) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Report not found' 
        },
        { status: 404 }
      );
    }

    // Get current time and 24 hours ago
    const now = new Date();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get existing viewers from report
    const existingViewers = report.viewers || [];
    console.log('Existing viewers:', existingViewers);
    
    // Check if user has viewed this report in the last 24 hours
    let hasViewedInLast24Hours = false;
    let viewerIndex = -1;

    // Find existing viewer by userId or userIp
    for (let i = 0; i < existingViewers.length; i++) {
      const viewer = existingViewers[i] as any;
      
      // Get the actual viewedAt value (it could be Date object or mongoose schema object)
      let lastViewedDate: Date;
      
      if (viewer.viewedAt instanceof Date) {
        lastViewedDate = viewer.viewedAt;
      } else if (viewer.viewedAt && viewer.viewedAt.$date) {
        // MongoDB Extended JSON format
        lastViewedDate = new Date(viewer.viewedAt.$date);
      } else if (typeof viewer.viewedAt === 'string') {
        lastViewedDate = new Date(viewer.viewedAt);
      } else if (viewer.viewedAt && viewer.viewedAt._bsontype === 'Timestamp') {
        // MongoDB Timestamp
        lastViewedDate = new Date(viewer.viewedAt.getHighBits() * 1000);
      } else {
        // Default to now if can't parse
        lastViewedDate = new Date();
      }

      // Match by userId (if both have userId)
      if (userId && viewer.userId === userId) {
        viewerIndex = i;
        hasViewedInLast24Hours = lastViewedDate > twentyFourHoursAgo;
        break;
      }
      
      // Match by IP (if no userId or userId doesn't match)
      if (viewer.userIp === userIp) {
        viewerIndex = i;
        hasViewedInLast24Hours = lastViewedDate > twentyFourHoursAgo;
        break;
      }
    }

    let isNewView = false;
    let updateOperation: any;

    // If user has NOT viewed in last 24 hours OR this is first view
    if (!hasViewedInLast24Hours) {
      isNewView = true;
      
      if (viewerIndex !== -1) {
        // Update existing viewer's timestamp and increment views
        updateOperation = {
          $inc: { views: 1 },
          $set: {
            [`viewers.${viewerIndex}.viewedAt`]: now,
            [`viewers.${viewerIndex}.userIp`]: userIp,
            ...(userId && { [`viewers.${viewerIndex}.userId`]: userId }),
          }
        };
      } else {
        // Add new viewer and increment views
        updateOperation = {
          $inc: { views: 1 },
          $push: {
            viewers: {
              userId: userId || undefined,
              userIp: userIp,
              userAgent: request.headers.get('user-agent') || 'unknown',
              viewedAt: now,
            }
          }
        };
      }
    } else {
      // User has viewed in last 24 hours - just update timestamp, NO view increment
      if (viewerIndex !== -1) {
        updateOperation = {
          $set: {
            [`viewers.${viewerIndex}.viewedAt`]: now,
            [`viewers.${viewerIndex}.userIp`]: userIp,
            ...(userId && { [`viewers.${viewerIndex}.userId`]: userId }),
          }
        };
      } else {
        // This shouldn't happen, but just in case
        updateOperation = {
          $push: {
            viewers: {
              userId: userId || undefined,
              userIp: userIp,
              userAgent: request.headers.get('user-agent') || 'unknown',
              viewedAt: now,
            }
          }
        };
      }
    }

    // Apply the update
    const updatedReport = await FakeNewsReport.findByIdAndUpdate(
      id,
      updateOperation,
      { new: true }
    ).select('views viewers').lean();

    return NextResponse.json({
      success: true,
      message: isNewView ? 'View counted successfully' : 'View refreshed (already viewed within 24 hours)',
      data: {
        reportId: id,
        views: updatedReport?.views || report.views || 0,
        isNewView,
        lastViewedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('View API error:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to record view',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/* ======================================================
   GET → VIEW STATISTICS
   ====================================================== */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Report ID is required' 
        },
        { status: 400 }
      );
    }

    const report = await FakeNewsReport.findById(id)
      .select('views viewers')
      .lean();

    if (!report) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Report not found' 
        },
        { status: 404 }
      );
    }

    const viewers = report.viewers || [];
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Helper function to parse date from viewer object
    const parseViewerDate = (viewer: any): Date => {
      if (!viewer.viewedAt) return new Date(0);
      
      if (viewer.viewedAt instanceof Date) {
        return viewer.viewedAt;
      } else if (viewer.viewedAt.$date) {
        return new Date(viewer.viewedAt.$date);
      } else if (typeof viewer.viewedAt === 'string') {
        return new Date(viewer.viewedAt);
      } else if (viewer.viewedAt && viewer.viewedAt._bsontype === 'Timestamp') {
        return new Date(viewer.viewedAt.getHighBits() * 1000);
      } else {
        return new Date();
      }
    };

    // Calculate statistics
    const totalViews = report.views || 0;
    
    // Get unique viewers based on userId or userIp
    const uniqueViewerIds = new Set<string>();
    viewers.forEach((viewer: any) => {
      const id = viewer.userId || viewer.userIp;
      if (id) uniqueViewerIds.add(id);
    });
    
    const uniqueViewers = uniqueViewerIds.size;
    
    const last7DaysViews = viewers.filter((viewer: any) => {
      const viewedAt = parseViewerDate(viewer);
      return viewedAt > last7Days;
    }).length;
    
    const last30DaysViews = viewers.filter((viewer: any) => {
      const viewedAt = parseViewerDate(viewer);
      return viewedAt > last30Days;
    }).length;

    // Get recent views
    const recentViews = viewers
      .map((viewer: any) => ({
        userId: viewer.userId || 'anonymous',
        userIp: viewer.userIp || 'unknown',
        viewedAt: parseViewerDate(viewer).toISOString(),
        userAgent: viewer.userAgent || 'unknown',
      }))
      .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        reportId: id,
        totalViews,
        uniqueViewers,
        last7DaysViews,
        last30DaysViews,
        recentViews,
      },
    });
  } catch (error) {
    console.error('View stats error:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch view statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}















