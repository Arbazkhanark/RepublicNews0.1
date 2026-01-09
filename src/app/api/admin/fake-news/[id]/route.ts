import { withAdminAuth, type UserFromToken } from '@/lib/auth/middleware';
import FakeNewsReport from '@/lib/models/FakeNewsReport';
import { connectToDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

/* ---------------- Types ---------------- */

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

/* ---------------------------------------------------
   NOTE:
   Next.js App Router doesn't natively support passing
   { params } into custom middleware wrappers.
   So we extract ID from URL instead.
---------------------------------------------------- */

function getIdFromRequest(req: NextRequest) {
  const url = new URL(req.url);
  return url.pathname.split('/').pop(); // last segment = id
}

/* ---------------- GET REPORT ---------------- */

export const GET = (
  async (request: NextRequest, user: UserFromToken) => {
    try {
      await connectToDatabase();

      const id = getIdFromRequest(request);
      if (!id) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Invalid report id',
          data: null,
        }, { status: 400 });
      }

      const report = await FakeNewsReport.findById(id).lean();

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
      console.error('GET FakeNewsReport error:', error);

      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to fetch report',
        data: null,
      }, { status: 500 });
    }
  }
);

/* ---------------- UPDATE REPORT ---------------- */

export const PATCH = withAdminAuth(
  async (request: NextRequest, user: UserFromToken) => {
    try {
      await connectToDatabase();

      const id = getIdFromRequest(request);
      if (!id) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Invalid report id',
          data: null,
        }, { status: 400 });
      }

      const payload = await request.json();

      const report = await FakeNewsReport.findByIdAndUpdate(
        id,
        {
          ...payload,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!report) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Report not found',
          data: null,
        }, { status: 404 });
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Report updated successfully',
        data: report,
      });
    } catch (error) {
      console.error('PATCH FakeNewsReport error:', error);

      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to update report',
        data: null,
      }, { status: 500 });
    }
  }
);

/* ---------------- DELETE REPORT ---------------- */

export const DELETE = withAdminAuth(
  async (request: NextRequest, user: UserFromToken) => {
    try {
      await connectToDatabase();

      const id = getIdFromRequest(request);
      if (!id) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Invalid report id',
          data: null,
        }, { status: 400 });
      }

      const report = await FakeNewsReport.findByIdAndDelete(id);

      if (!report) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: 'Report not found',
          data: null,
        }, { status: 404 });
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Report deleted successfully',
        data: null,
      });
    } catch (error) {
      console.error('DELETE FakeNewsReport error:', error);

      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Failed to delete report',
        data: null,
      }, { status: 500 });
    }
  }
);
