// ============================================================
// FILE  app/api/articles/[articleId]/view/route.ts
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getArticleModel } from '@/lib/models';
import { UserFromToken, withAuth } from '@/lib/auth/middleware';


export const POST = (async (req: NextRequest, user: UserFromToken) => {
  try {
    const url = new URL(req.url);
    console.log("URL:", url);
    const articleId = url.pathname.split('/')[3];
    const userId = user.userId;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || '';

    const Article = getArticleModel();
    const article = await Article.findById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    await article.incrementView(userId, ipAddress);

    return NextResponse.json({
      success: true,
      message: 'View recorded successfully',
      data: { views: article.meta.views }
    });
  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track view', error: error.message },
      { status: 500 }
    );
  }
});