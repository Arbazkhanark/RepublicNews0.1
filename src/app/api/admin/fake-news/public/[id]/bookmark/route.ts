// /app/api/admin/fake-news/[id]/bookmark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport from '@/lib/models/FakeNewsReport';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

interface BookmarkData {
  userId: string;
  action: 'add' | 'remove';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const body: BookmarkData = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'User ID is required',
        data: null,
      }, { status: 400 });
    }

    const updateQuery = action === 'add' 
      ? { $addToSet: { bookmarkedBy: userId } }
      : { $pull: { bookmarkedBy: userId } };

    const updatedReport = await FakeNewsReport.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    ).select('bookmarkedBy').lean();

    if (!updatedReport) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Report not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: action === 'add' ? 'Bookmark added' : 'Bookmark removed',
      data: {
        reportId: id,
        isBookmarked: action === 'add',
        totalBookmarks: updatedReport.bookmarkedBy?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error updating bookmark:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to update bookmark',
      data: null,
    }, { status: 500 });
  }
}