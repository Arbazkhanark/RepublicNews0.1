// src/app/api/news/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getArticleModel } from '@/lib/models';
import { UserFromToken, withAuth } from '@/lib/auth/middleware';

async function handleLike(req: NextRequest, user: UserFromToken, articleId: string) {
  try {
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

    const result = await article.incrementLike(userId, ipAddress);

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        data: {
          likes: result.article.meta.likes,
          isLiked: result.success
        }
      },
      { status: result.success ? 200 : 400 }
    );
  } catch (error: any) {
    console.error('Error liking article:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to like article',
        error: error.message
      },
      { status: 500 }
    );
  }
}

async function handleUnlike(req: NextRequest, user: UserFromToken, articleId: string) {
  try {
    const userId = user.userId;

    const Article = getArticleModel();
    const article = await Article.findById(articleId);

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }

    const result = await article.removeLike(userId);

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        data: {
          likes: result.article.meta.likes,
          isLiked: false
        }
      },
      { status: result.success ? 200 : 400 }
    );
  } catch (error: any) {
    console.error('Error unliking article:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to unlike article',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export const POST = (async (req: NextRequest, user: UserFromToken) => {
  const url = new URL(req.url);
  const articleId = url.pathname.split('/')[3]; // Extract articleId from URL
  return handleLike(req, user, articleId);
});

// export const DELETE = withAuth(async (req: NextRequest, user: UserFromToken) => {
//   const url = new URL(req.url);
//   const articleId = url.pathname.split('/')[3]; // Extract articleId from URL
//   return handleUnlike(req, user, articleId);
// });


export const DELETE = (async (req: NextRequest, user: UserFromToken) => {
  const url = new URL(req.url);
  const articleId = url.pathname.split('/')[3]; // Extract articleId from URL
  return handleUnlike(req, user, articleId);
});