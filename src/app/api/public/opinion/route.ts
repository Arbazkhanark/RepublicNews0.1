import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getOpinionModel, getUserModel } from "@/lib/models";
import { z } from "zod";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";

// Zod validation schema with Hindi fields
const OpinionArticleSchema = z.object({
  title: z.string().min(5).max(200),
  titleHi: z.string().min(5).max(200), // Hindi title optional
  content: z.string().min(20),
  contentHi: z.string().min(20), // Hindi content optional
  imageUrl: z.string().url().optional(),
  topic: z.string().min(1).max(100),
  tags: z.array(z.string()).optional(),
});

// POST handler: Create a new opinion article
export const POST = withAuth(async (req: NextRequest, user: UserFromToken) => {
  try {
    await connectToDatabase();

    console.log(user, "User in opinion article post");

    const body = await req.json();
    const parsed = OpinionArticleSchema.safeParse(body);

    console.log(parsed, "Parsed opinion article data");

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    getUserModel();
    const OpinionArticle = getOpinionModel();

    const savedData = {
      title: data.title,
      titleHi: data.titleHi , // Use provided Hindi title or default to English
      content: data.content,
      contentHi: data.contentHi, // Use provided Hindi content or default to English
      imageUrl: data.imageUrl,
      topic: data.topic,
      tags: data.tags || [],
      authorId: new mongoose.Types.ObjectId(user.userId),
      status: "pending", // New articles are pending review
    };

    console.log(savedData, "Saved data for opinion article");
    const newOpinionArticle = await OpinionArticle.create(savedData);


    console.log(newOpinionArticle, "Newly created opinion article");

    return NextResponse.json(
      { 
        message: "Opinion article submitted successfully", 
        article: newOpinionArticle 
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("OpinionArticle POST error:", err);
    return NextResponse.json(
      { error: "Failed to submit opinion article" },
      { status: 500 }
    );
  }
});

// GET handler: Fetch opinion articles with language support
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    const authorId = searchParams.get("authorId");
    const status = searchParams.get("status");
    const language = searchParams.get("lang") || "en"; // Default to English
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search");

    type Query = {
      topic?: string;
      authorId?: mongoose.Types.ObjectId;
      status?: string;
      $or?: Array<{
        title?: { $regex: string; $options: string };
        content?: { $regex: string; $options: string };
        titleHi?: { $regex: string; $options: string };
        contentHi?: { $regex: string; $options: string };
      }>;
    };

    const query: Query = {};

    if (topic) query.topic = topic;
    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
      query.authorId = new mongoose.Types.ObjectId(authorId);
    }
    if (status) query.status = status;
    
    // Search across both English and Hindi fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { titleHi: { $regex: search, $options: "i" } },
        { contentHi: { $regex: search, $options: "i" } }
      ];
    }

    getUserModel();
    const Opinion = getOpinionModel();
    
    // Get total count for pagination
    const total = await Opinion.countDocuments(query);
    
    // Fetch opinions with pagination
    const opinions = await Opinion.find(query)
      .populate({
        path: "authorId",
        select: "name username profilePicture email"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform data based on language preference
    const transformedOpinions = opinions.map(opinion => {
      const opinionObj = opinion.toObject();
      
      if (language === "hi") {
        // Return Hindi content if requested
        return {
          ...opinionObj,
          title: opinionObj.titleHi || opinionObj.title,
          content: opinionObj.contentHi || opinionObj.content,
          author: opinionObj.authorId
        };
      }
      
      // Return English content by default
      return {
        ...opinionObj,
        title: opinionObj.title,
        content: opinionObj.content,
        author: opinionObj.authorId
      };
    });

    return NextResponse.json({ 
      opinions: transformedOpinions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("OpinionArticle GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch opinions" },
      { status: 500 }
    );
  }
}