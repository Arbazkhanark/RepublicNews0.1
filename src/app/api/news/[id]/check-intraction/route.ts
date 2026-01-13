// ============================================================
// FILE app/api/articles/[articleId]/check-interaction/route.ts
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getArticleModel } from '@/lib/models';
import { UserFromToken, withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (req: NextRequest, user: UserFromToken) => {
  try {
    const url = new URL(req.url);
    const articleId = url.pathname.split('/')[3];
    const userId = user.userId;

    const Article = getArticleModel();
    const article = await Article.findById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const hasLiked = article.likedBy.some(like => like.userId.toString() === userId);

    return NextResponse.json({
      success: true,
      data: {
        hasLiked,
        canShare: true
      }
    });
  } catch (error: any) {
    console.error('Error checking interaction:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check interaction', error: error.message },
      { status: 500 }
    );
  }
});