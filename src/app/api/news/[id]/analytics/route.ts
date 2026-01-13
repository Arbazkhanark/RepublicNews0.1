// ============================================================
// FILE 4: app/api/articles/[articleId]/analytics/route.ts
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

    const hasViewed = article.viewedBy.some(view => view.userId.toString() === userId);
    const hasLiked = article.likedBy.some(like => like.userId.toString() === userId);
    const userShares = article.sharedBy
      .filter(share => share.userId.toString() === userId)
      .map(share => ({
        platform: share.platform,
        timestamp: share.timestamp
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalViews: article.meta.views,
        totalLikes: article.meta.likes,
        totalShares: article.meta.shares,
        totalComments: article.meta.comments,
        userInteractions: {
          hasViewed,
          hasLiked,
          shares: userShares
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics', error: error.message },
      { status: 500 }
    );
  }
});