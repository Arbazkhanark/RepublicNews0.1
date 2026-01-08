import { withAdminAuth } from "@/lib/auth/middleware";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getNewsletterCampaignModel } from "@/lib/models";
// import { NewsletterCampaign } from "@/lib/models/index";

// -----------------------------
// ✅ Zod Schema for Validation
// -----------------------------
const CampaignSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  htmlContent: z.string().min(1, "HTML content is required"),
  language: z.enum(["en", "hi", "both"]),
  status: z.enum(["draft", "scheduled", "sent"]),
  scheduledAt: z.string().datetime().optional(),
  recipients: z.number().int().nonnegative().default(0),
  opens: z.number().int().nonnegative().default(0),
  clicks: z.number().int().nonnegative().default(0),
  createdBy: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for createdBy"
  }),
});


// -------------------------------------
// ✅ GET Campaigns with Pagination
// -------------------------------------
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const NewsletterCampaign = getNewsletterCampaignModel();
    const campaigns = await NewsletterCampaign.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await NewsletterCampaign.countDocuments();

    return NextResponse.json({
      campaigns,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /campaigns error:", err);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
});


// -------------------------------------
// ✅ POST Create New Campaign
// -------------------------------------
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = CampaignSchema.safeParse(body);
    console.log(parsed, "Parsed..........")

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const NewsletterCampaign = getNewsletterCampaignModel();

    const campaign = await NewsletterCampaign.create({
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      createdBy: new mongoose.Types.ObjectId(data.createdBy),
      createdAt: new Date(),
    });

    console.log("Created campaign:", campaign);

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error("POST /campaigns error:", err);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
});
