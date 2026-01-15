import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getOpinionModel } from "@/lib/models";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";
import { z } from "zod";

// ✅ Zod schema for validating updates with Hindi fields
const EditOpinionSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  titleHi: z.string().min(5).max(200).optional(),
  content: z.string().min(20).optional(),
  contentHi: z.string().min(20).optional(),
  topic: z.string().optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
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
    
    // Only allow status change for admins/editors
    const body = await req.json();
    const parsed = EditOpinionSchema.safeParse(body);


    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updates = parsed.data;

    // If user is not admin/editor, remove status field from updates
    if (!isAdmin && updates.status && updates.status !== opinion.status) {
      delete updates.status;
    }

    // If user is not owner and not admin, they cannot edit
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized to edit this opinion" }, 
        { status: 403 }
      );
    }

    // Handle Hindi fields - if provided, use them, otherwise keep existing
    if (updates.title && !updates.titleHi) {
      // If English title is updated but Hindi title is not provided,
      // keep the existing Hindi title or use English title
      updates.titleHi = opinion.titleHi || updates.title;
    }
    
    if (updates.content && !updates.contentHi) {
      // If English content is updated but Hindi content is not provided,
      // keep the existing Hindi content or use English content
      updates.contentHi = opinion.contentHi || updates.content;
    }

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
export const PUT = (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
  withAuth((req, user) => handleEdit(req, context, user))(req);