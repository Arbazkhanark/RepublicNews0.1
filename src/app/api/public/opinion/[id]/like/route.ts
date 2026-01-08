import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getOpinionModel, getUserModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";

// PATCH: Like or Dislike an opinion
const handlePatch = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
  user: UserFromToken
) => {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    console.log(user, "User in opinion like/dislike");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const { type } = await req.json();
    if (!["like", "dislike"].includes(type)) {
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id);
    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(user.userId);

    // Initialize likedBy/dislikedBy if undefined
    opinion.likedBy ||= [];
    opinion.dislikedBy ||= [];

    const alreadyLiked = opinion.likedBy.some((uid) => uid.equals(userId));
    const alreadyDisliked = opinion.dislikedBy.some((uid) => uid.equals(userId));

    if (type === "like") {
      if (alreadyLiked) {
        opinion.likes = Math.max(opinion.likes - 1, 0);
        opinion.likedBy = opinion.likedBy.filter((uid) => !uid.equals(userId));
      } else {
        opinion.likes += 1;
        opinion.likedBy.push(userId);
        if (alreadyDisliked) {
          opinion.dislikes = Math.max(opinion.dislikes - 1, 0);
          opinion.dislikedBy = opinion.dislikedBy.filter((uid) => !uid.equals(userId));
        }
      }
    } else if (type === "dislike") {
      if (alreadyDisliked) {
        opinion.dislikes = Math.max(opinion.dislikes - 1, 0);
        opinion.dislikedBy = opinion.dislikedBy.filter((uid) => !uid.equals(userId));
      } else {
        opinion.dislikes += 1;
        opinion.dislikedBy.push(userId);
        if (alreadyLiked) {
          opinion.likes = Math.max(opinion.likes - 1, 0);
          opinion.likedBy = opinion.likedBy.filter((uid) => !uid.equals(userId));
        }
      }
    }

    await opinion.save();

    return NextResponse.json({ message: `${type} registered`, opinion });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update opinion" }, { status: 500 });
  }
};

// ✅ Export PATCH with user - Updated for Next.js 14+
export const PATCH = (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
  withAuth((req, user) => handlePatch(req, context, user))(req);

// ✅ GET - Updated for Next.js 14+
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params; // Await the params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    getUserModel();
    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id).populate("authorId", "name email");

    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    return NextResponse.json({ opinion });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch opinion" }, { status: 500 });
  }
}

// ✅ DELETE - Updated for Next.js 14+
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params; // Await the params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const Opinion = getOpinionModel();
    const deleted = await Opinion.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Opinion soft-deleted successfully",
      opinion: deleted,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete opinion" }, { status: 500 });
  }
}