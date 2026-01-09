import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FakeNewsReport from '@/lib/models/FakeNewsReport';


interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

/* ---------------- GET SINGLE REPORT BY ID ---------------- */

export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const { id } = params;

    // Increment views when someone accesses the report
    const report = await FakeNewsReport.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!report) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Report not found',
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Report fetched successfully',
      data: report,
    });
  } catch (error) {
    console.error('Error fetching fake news report:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to fetch report',
      data: null,
    }, { status: 500 });
  }
}


/* ---------------- GET SHARE STATISTICS ---------------- */

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const { id } = params;

//     const report = await FakeNewsReport.findById(id)
//       .select('shares shareStats sharingHistory')
//       .lean();

//     if (!report) {
//       return NextResponse.json<ApiResponse>({
//         success: false,
//         message: 'Report not found',
//         data: null,
//       }, { status: 404 });
//     }

//     return NextResponse.json<ApiResponse>({
//       success: true,
//       message: 'Share statistics fetched successfully',
//       data: {
//         reportId: id,
//         totalShares: report.shares,
//         platformShares: report.shareStats,
//         sharingHistory: report.sharingHistory || [],
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching share statistics:', error);

//     return NextResponse.json<ApiResponse>({
//       success: false,
//       message: 'Failed to fetch share statistics',
//       data: null,
//     }, { status: 500 });
//   }
// }