import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getOpinionModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { UserFromToken, withAdminAuth, withAuth } from "@/lib/auth/middleware";

const handleStatusUpdate = async (
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

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admins only." }, { status: 403 });
    }

    const { status } = await req.json();

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const Opinion = getOpinionModel();
    const updatedOpinion = await Opinion.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOpinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Opinion status updated to '${status}'`,
      opinion: updatedOpinion,
    });
  } catch (error) {
    console.error("Status Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update opinion status" },
      { status: 500 }
    );
  }
};

export const PUT = (req: NextRequest, context: { params: Promise<{ id: string }> }) =>
  withAdminAuth((req, user) => handleStatusUpdate(req, context, user))(req);