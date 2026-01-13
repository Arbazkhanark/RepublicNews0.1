// ============================================================
// FILE app/api/articles/[articleId]/analytics/detailed/route.ts
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getArticleModel } from '@/lib/models';
import { UserFromToken, withAdminAuth } from '@/lib/auth/middleware';

export const GET = withAdminAuth(async (req: NextRequest, user: UserFromToken) => {
  try {
    const url = new URL(req.url);
    const articleId = url.pathname.split('/')[3];

    const Article = getArticleModel();
    const article = await Article.findById(articleId)
      .populate('viewedBy.userId', 'name email')
      .populate('likedBy.userId', 'name email')
      .populate('sharedBy.userId', 'name email');

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const sharesByPlatform = article.sharedBy.reduce((acc: any, share) => {
      const platform = share.platform || 'other';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        meta: article.meta,
        viewDetails: {
          count: article.viewedBy.length,
          recentViews: article.viewedBy.slice(-10).reverse()
        },
        likeDetails: {
          count: article.likedBy.length,
          recentLikes: article.likedBy.slice(-10).reverse()
        },
        shareDetails: {
          count: article.sharedBy.length,
          byPlatform: sharesByPlatform,
          recentShares: article.sharedBy.slice(-10).reverse()
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching detailed analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch detailed analytics', error: error.message },
      { status: 500 }
    );
  }
});