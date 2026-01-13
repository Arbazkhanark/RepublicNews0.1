import { getOpinionModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Fetch only approved opinions
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const Opinion = getOpinionModel();

    // ✅ Only fetch opinions with status = "approved"
    const opinions = await Opinion
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ opinions });
  } catch (error) {
    console.error("Error while fetching approved opinions:", error);
    return NextResponse.json(
      { error: "Failed to fetch approved opinions" },
      { status: 500 }
    );
  }
}
