import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/middleware';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport from '@/lib/models/FakeNewsReport';

interface Admin{
    userId: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      FakeNewsReport.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FakeNewsReport.countDocuments()
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching fake news reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(async (request: NextRequest,admin:Admin) => {
  try {

    await connectToDatabase();
    const data = await request.json();

    const report = new FakeNewsReport({
      ...data,
      createdBy: admin.userId,
      views: 0,
      shares: 0,
      helpfulVotes: 0
    });

    await report.save();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating fake news report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
});