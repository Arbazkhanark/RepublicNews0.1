import mongoose from "mongoose";
import { getOpinionModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("article");

    if (!articleId) {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }

    const Opinion = getOpinionModel();

    const aggregation = await Opinion.aggregate([
      { $match: { article: new mongoose.Types.ObjectId(articleId), isActive: true } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    return NextResponse.json({ summary: aggregation });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
