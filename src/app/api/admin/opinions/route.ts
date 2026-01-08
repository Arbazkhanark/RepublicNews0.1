import { getOpinionModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type OpinionQuery = {
  status?: string;
};

// Add admin auth wrapper
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: OpinionQuery = {};
    if (status) query.status = status;

    const Opinion = getOpinionModel();
    const opinions = await Opinion.find(query).sort({ createdAt: -1 }).limit(100);
    
    return NextResponse.json({ opinions });
  } catch (error) {
    console.error("Errors in server issue....", error);
    return NextResponse.json({ error: "Failed to fetch opinions" }, { status: 500 });
  }
}
