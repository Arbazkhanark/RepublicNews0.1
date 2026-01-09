import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport from '@/lib/models/FakeNewsReport';

/* ---------------- Types ---------------- */

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

/* ---------------- GET ALL PUBLISHED REPORTS ---------------- */

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };

    const [reports, total] = await Promise.all([
      FakeNewsReport.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      FakeNewsReport.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Published reports fetched successfully',
      data: {
        reports,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching fake news reports:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch reports',
      data: null,
    }, { status: 500 });
  }
}
