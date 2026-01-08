import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getOpinionModel } from "@/lib/models";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";
import { z } from "zod";

// ✅ Zod schema for validating updates
const EditOpinionSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
  topic: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

const handleEdit = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
  user: UserFromToken
) => {
  try {
    await connectToDatabase();

    const { id } = await context.params; // Await the params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid opinion ID" }, { status: 400 });
    }

    const Opinion = getOpinionModel();
    const opinion = await Opinion.findById(id);

    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    const isOwner = opinion.authorId.toString() === user.userId;
    const isAdmin = user.role === "admin" || user.role === "editor";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to edit this opinion" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = EditOpinionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updates = parsed.data;

    Object.assign(opinion, updates);
    opinion.updatedAt = new Date();

    const updatedOpinion = await opinion.save();

    return NextResponse.json({
      message: "Opinion updated successfully",
      opinion: updatedOpinion,
    });
  } catch (err) {
    console.error("Edit Opinion Error:", err);
    return NextResponse.json({ error: "Failed to update opinion" }, { status: 500 });
  }
};

// ✅ PATCH method with auth - Updated for Next.js 14+
export const PATCH = (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
  withAuth((req, user) => handleEdit(req, context, user))(req);