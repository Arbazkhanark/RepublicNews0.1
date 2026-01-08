import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth, withAuth } from "@/lib/auth/middleware";
// import { connectToDatabase, NewsletterSubscriber } from "@/lib/models/index";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getNewsletterSubscriberModel } from "@/lib/models";

// -----------------------------
// ✅ Zod Schema for POST
// -----------------------------
const SubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  language: z.enum(["en", "hi", "both"]),
  isActive: z.boolean().default(true),
  subscribedAt: z.string().datetime().optional(),
  isVerified: z.boolean().default(false),
  verificationToken: z.string().optional(),
});

// -----------------------------
// ✅ GET /subscribers
// -----------------------------
export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const NewsletterSubscriber= getNewsletterSubscriberModel();
    const subscribers = await NewsletterSubscriber.find()
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await NewsletterSubscriber.countDocuments();

    return NextResponse.json({
      subscribers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
});

// -----------------------------
// ✅ POST /subscribers
// -----------------------------
export const POST = withAuth(async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = SubscriberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const NewsletterSubscriber= getNewsletterSubscriberModel();
    // 🔍 Check for duplicate email
    const existing = await NewsletterSubscriber.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json(
        { error: "Subscriber with this email already exists." },
        { status: 409 }
      );
    }

    // 🕒 Ensure subscribedAt is a Date object
    const subscriber = await NewsletterSubscriber.create({
      ...data,
      subscribedAt: data.subscribedAt
        ? new Date(data.subscribedAt)
        : new Date(),
    });

    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    console.error("POST /subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to create subscriber" },
      { status: 500 }
    );
  }
});
