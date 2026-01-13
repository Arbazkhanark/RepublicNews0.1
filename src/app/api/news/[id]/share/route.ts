// ============================================================
// FILE  app/api/articles/[articleId]/share/route.ts
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getArticleModel } from '@/lib/models';
import { UserFromToken, withAuth } from '@/lib/auth/middleware';

const VALID_PLATFORMS = ['facebook', 'twitter', 'whatsapp', 'linkedin', 'email', 'telegram', 'reddit', 'other'];

export const POST = (async (req: NextRequest, user: UserFromToken) => {
  try {
    const url = new URL(req.url);
    const articleId = url.pathname.split('/')[3];
    const { platform } = await req.json();
    const userId = user.userId;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || '';

    if (!platform) {
      return NextResponse.json(
        { success: false, message: 'Platform is required' },
        { status: 400 }
      );
    }

    if (!VALID_PLATFORMS.includes(platform.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid platform. Valid platforms are: ${VALID_PLATFORMS.join(', ')}`
        },
        { status: 400 }
      );
    }

    const Article = getArticleModel();
    const article = await Article.findById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const result = await article.incrementShare(userId, platform, ipAddress);

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        data: {
          shares: result.article.meta.shares,
          platform: platform.toLowerCase()
        }
      },
      { status: result.success ? 200 : 400 }
    );
  } catch (error: any) {
    console.error('Error tracking share:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track share', error: error.message },
      { status: 500 }
    );
  }
});