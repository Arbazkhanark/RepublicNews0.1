import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport from '@/lib/models/FakeNewsReport';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

interface VoteData {
  voteType: 'helpful' | 'unhelpful';
  userId: string; // 🔐 required
}

interface VoteResponseData {
  reportId: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
  totalVotes: number;
}

/* ---------------- POST VOTE ---------------- */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ Promise type
) {
  try {
    await connectToDatabase();

    // ✅ unwrap params correctly
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid report id',
        data: null,
      }, { status: 400 });
    }

    const body: VoteData = await request.json();
    const { voteType, userId } = body;

    // ✅ user must be logged in
    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Login required to vote',
        data: null,
      }, { status: 401 });
    }

    if (!['helpful', 'unhelpful'].includes(voteType)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid vote type',
        data: null,
      }, { status: 400 });
    }

    // ✅ fetch report
    const existingReport = await FakeNewsReport.findById(id).select('voters');

    if (!existingReport) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Report not found',
        data: null,
      }, { status: 404 });
    }

    // ✅ HARD duplicate prevention
    const alreadyVoted = existingReport.voters?.some(
      voter => voter.userId === userId
    );

    if (alreadyVoted) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'You already voted on this report',
        data: null,
      }, { status: 409 });
    }

    // ✅ Safe atomic update
    const updateQuery = {
      $addToSet: {
        voters: {
          userId,
          voteType,
          votedAt: new Date(),
        },
      },
      $inc: {
        [`${voteType}Votes`]: 1,
      },
    };

    const updatedReport = await FakeNewsReport.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    )
      .select('helpfulVotes unhelpfulVotes')
      .lean();

    if (!updatedReport) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to update vote',
        data: null,
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<VoteResponseData>>({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        reportId: id,
        helpfulVotes: updatedReport.helpfulVotes || 0,
        unhelpfulVotes: updatedReport.unhelpfulVotes || 0,
        totalVotes:
          (updatedReport.helpfulVotes || 0) +
          (updatedReport.unhelpfulVotes || 0),
      },
    });

  } catch (error) {
    console.error('Error recording vote:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to record vote',
      data: null,
    }, { status: 500 });
  }
}

/* ---------------- GET VOTE STATS ---------------- */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ Promise
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const report = await FakeNewsReport.findById(id)
      .select('helpfulVotes unhelpfulVotes')
      .lean();

    if (!report) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Report not found',
        data: null,
      }, { status: 404 });
    }

    const helpfulVotes = report.helpfulVotes || 0;
    const unhelpfulVotes = report.unhelpfulVotes || 0;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Vote statistics fetched successfully',
      data: {
        reportId: id,
        helpfulVotes,
        unhelpfulVotes,
        totalVotes: helpfulVotes + unhelpfulVotes,
      },
    });

  } catch (error) {
    console.error('Error fetching vote statistics:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch vote statistics',
      data: null,
    }, { status: 500 });
  }
}
