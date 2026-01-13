// app/api/articles/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { getArticleModel } from '@/lib/models';

// GET all comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const articleId = params.id;
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approvedOnly') !== 'false';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';
    
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid article ID' },
        { status: 400 }
      );
    }
    
    const Article = getArticleModel();
    const article = await Article.findById(articleId)
      .select('comments')
      .lean();
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Filter comments
    let comments = article.comments.commentList;
    
    if (approvedOnly) {
      comments = comments.filter((comment: any) => comment.isApproved && !comment.isSpam);
    }
    
    // Sort comments
    if (sort === 'newest') {
      comments.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === 'oldest') {
      comments.sort((a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sort === 'likes') {
      comments.sort((a: any, b: any) => b.likes - a.likes);
    }
    
    // Pagination
    const total = comments.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: {
        comments: paginatedComments,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch comments',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const articleId = params.id;
    const commentData = await request.json();
    
    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid article ID' },
        { status: 400 }
      );
    }
    
    const { userId, userName, content } = commentData;
    
    if (!userId || !userName || !content) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'userId, userName, and content are required' 
        },
        { status: 400 }
      );
    }
    
    if (content.trim().length < 3) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Comment must be at least 3 characters long' 
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
    
    // Check if article allows comments
    if (!article.allowComments) {
      return NextResponse.json(
        { success: false, message: 'Comments are disabled for this article' },
        { status: 403 }
      );
    }
    
    // Add comment
    await article.addComment({
      ...commentData,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    });
    
    // Fetch updated article
    const updatedArticle = await Article.findById(articleId)
      .select('comments')
      .lean();
    
    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully. It will be visible after approval.',
      data: {
        comments: {
          total: updatedArticle?.comments?.total || 0,
          pending: updatedArticle?.comments?.pending || 0,
          approved: updatedArticle?.comments?.approved || 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add comment',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}




















// // app/api/articles/[articleId]/comments/[commentId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getArticleModel } from '@/models/article';
// import mongoose from 'mongoose';
// import { connectToDatabase } from '@/lib/mongodb';

// // GET specific comment
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { articleId: string; commentId: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const { articleId, commentId } = params;
    
//     if (!mongoose.Types.ObjectId.isValid(articleId) || !mongoose.Types.ObjectId.isValid(commentId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid IDs' },
//         { status: 400 }
//       );
//     }
    
//     const Article = getArticleModel();
//     const article = await Article.findById(articleId)
//       .select('comments')
//       .lean();
    
//     if (!article) {
//       return NextResponse.json(
//         { success: false, message: 'Article not found' },
//         { status: 404 }
//       );
//     }
    
//     const comment = article.comments.commentList.find(
//       (c: any) => c._id.toString() === commentId
//     );
    
//     if (!comment) {
//       return NextResponse.json(
//         { success: false, message: 'Comment not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: { comment }
//     });
    
//   } catch (error) {
//     console.error('Error fetching comment:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to fetch comment',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }

// // PUT to update comment (approve, mark as spam, like)
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { articleId: string; commentId: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const { articleId, commentId } = params;
//     const { action, userId } = await request.json();
    
//     if (!mongoose.Types.ObjectId.isValid(articleId) || !mongoose.Types.ObjectId.isValid(commentId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid IDs' },
//         { status: 400 }
//       );
//     }
    
//     if (!action) {
//       return NextResponse.json(
//         { success: false, message: 'Action is required' },
//         { status: 400 }
//       );
//     }
    
//     const Article = getArticleModel();
//     const article = await Article.findById(articleId);
    
//     if (!article) {
//       return NextResponse.json(
//         { success: false, message: 'Article not found' },
//         { status: 404 }
//       );
//     }
    
//     let message = '';
    
//     switch (action) {
//       case 'approve':
//         await article.approveComment(commentId);
//         message = 'Comment approved successfully';
//         break;
        
//       case 'spam':
//         await article.markCommentAsSpam(commentId);
//         message = 'Comment marked as spam';
//         break;
        
//       case 'like':
//         // Find and update comment likes
//         const comment = article.comments.commentList.find(
//           (c: any) => c._id.toString() === commentId
//         );
//         if (comment) {
//           comment.likes += 1;
//           await article.save();
//           message = 'Comment liked';
//         }
//         break;
        
//       default:
//         return NextResponse.json(
//           { success: false, message: 'Invalid action' },
//           { status: 400 }
//         );
//     }
    
//     const updatedArticle = await Article.findById(articleId)
//       .select('comments')
//       .lean();
    
//     return NextResponse.json({
//       success: true,
//       message,
//       data: {
//         comments: updatedArticle?.comments
//       }
//     });
    
//   } catch (error) {
//     console.error('Error updating comment:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to update comment',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE comment
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { articleId: string; commentId: string } }
// ) {
//   try {
//     await connectToDatabase();
    
//     const { articleId, commentId } = params;
    
//     if (!mongoose.Types.ObjectId.isValid(articleId) || !mongoose.Types.ObjectId.isValid(commentId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid IDs' },
//         { status: 400 }
//       );
//     }
    
//     const Article = getArticleModel();
//     const article = await Article.findById(articleId);
    
//     if (!article) {
//       return NextResponse.json(
//         { success: false, message: 'Article not found' },
//         { status: 404 }
//       );
//     }
    
//     // Find comment
//     const commentIndex = article.comments.commentList.findIndex(
//       (c: any) => c._id.toString() === commentId
//     );
    
//     if (commentIndex === -1) {
//       return NextResponse.json(
//         { success: false, message: 'Comment not found' },
//         { status: 404 }
//       );
//     }
    
//     const comment = article.comments.commentList[commentIndex];
    
//     // Update counts
//     article.comments.total -= 1;
    
//     if (comment.isApproved) {
//       article.comments.approved -= 1;
//     } else if (comment.isSpam) {
//       article.comments.spam -= 1;
//     } else {
//       article.comments.pending -= 1;
//     }
    
//     // Remove comment
//     article.comments.commentList.splice(commentIndex, 1);
//     await article.save();
    
//     return NextResponse.json({
//       success: true,
//       message: 'Comment deleted successfully'
//     });
    
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to delete comment',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }