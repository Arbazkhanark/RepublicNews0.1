import { getOpinionModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await params; // Await the params

  const { status } = await request.json(); // "approved" or "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const Opinion = getOpinionModel();
  const updated = await Opinion.findByIdAndUpdate(id, { status }, { new: true });

  if (!updated) {
    return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
  }

  return NextResponse.json({ message: `Opinion ${status}`, opinion: updated });
}