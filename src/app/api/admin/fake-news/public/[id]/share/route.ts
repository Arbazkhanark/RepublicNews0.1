import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport, { IFakeNewsReport } from '@/lib/models/FakeNewsReport';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

interface ShareData {
  platform?: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'other';
  userId?: string;
  shareMethod?: 'direct' | 'app' | 'web';
}

type ShareStatsProjection = Pick<
  IFakeNewsReport,
  'shares' | 'shareStats' | 'sharingHistory'
>;

/* ---------------- POST SHARE ---------------- */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ Promise type
) {
  try {
    await connectToDatabase();

    // ✅ unwrap params
    const { id } = await params;

    console.log("Share route hit for report ID:", id);

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Invalid report id",
        data: null,
      }, { status: 400 });
    }

    const body: ShareData = await request.json();
    const { platform = 'other', userId, shareMethod = 'web' } = body;

    const validPlatforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'other'];
    const sharePlatform = validPlatforms.includes(platform) ? platform : 'other';

    const updateObject: any = {
      $inc: {
        shares: 1,
        [`shareStats.${sharePlatform}`]: 1,
      },
      $push: {
        sharingHistory: {
          platform: sharePlatform,
          sharedAt: new Date(),
          userId: userId || null,
          method: shareMethod,
        },
      },
    };

    const updatedReport = await FakeNewsReport.findByIdAndUpdate(
      id,
      updateObject,
      { new: true }
    )
      .select('shares shareStats')
      .lean();

    if (!updatedReport) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Report not found',
        data: null,
      }, { status: 404 });
    }

    const typedReport = updatedReport as unknown as ShareStatsProjection;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Share recorded successfully',
      data: {
        reportId: id,
        totalShares: typedReport.shares,
        platformShares: typedReport.shareStats,
      },
    });

  } catch (error) {
    console.error('Error recording share:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to record share',
      data: null,
    }, { status: 500 });
  }
}

/* ---------------- GET SHARE STATS ---------------- */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ Promise type
) {
  try {
    await connectToDatabase();

    // ✅ unwrap params
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Invalid report id",
        data: null,
      }, { status: 400 });
    }

    const report = await FakeNewsReport.findById(id)
      .select('shares shareStats sharingHistory')
      .lean();

    if (!report) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Report not found',
        data: null,
      }, { status: 404 });
    }

    const typedReport = report as unknown as ShareStatsProjection;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Share statistics fetched successfully',
      data: {
        reportId: id,
        totalShares: typedReport.shares,
        platformShares: typedReport.shareStats,
        sharingHistory: typedReport.sharingHistory || [],
      },
    });

  } catch (error) {
    console.error('Error fetching share statistics:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch share statistics',
      data: null,
    }, { status: 500 });
  }
}
