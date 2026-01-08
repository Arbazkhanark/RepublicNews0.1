import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getOpinionModel, getUserModel } from "@/lib/models";
import { z } from "zod";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";
import { get } from "http";

// Zod validation schema
const OpinionArticleSchema = z.object({
  title: z.string().min(5),
  imageUrl: z.string().url().optional(),
  content: z.string().min(20),
  topic: z.string(),
  tags: z.array(z.string()).optional(),
  // authorId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  //   message: "Invalid authorId",
  // }),
});

// POST handler: Create a new opinion article
// POST handler
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
      ...data,
      authorId: new mongoose.Types.ObjectId(user.userId),
      status: "pending", // New articles are pending review
    }

    console.log(savedData, "Saved data for opinion article");
    const newOpinionArticle = await OpinionArticle.create(savedData);

    return NextResponse.json(
      { message: "Opinion article submitted", article: newOpinionArticle },
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


// GET handler: Fetch opinion articles
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    const authorId = searchParams.get("authorId");

    type Query = {
      topic?: string;
      authorId?: mongoose.Types.ObjectId;
    };

    const query: Query = {};

    if (topic) query.topic = topic;
    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
      query.authorId = new mongoose.Types.ObjectId(authorId);
    }

    getUserModel();
    const Opinion = getOpinionModel();
    const opinions = await Opinion.find(query).populate("authorId").sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ opinions });
  } catch (err) {
    console.error("OpinionArticle GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch opinions" },
      { status: 500 }
    );
  }
}
