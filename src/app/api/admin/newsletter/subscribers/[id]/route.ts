import { withAdminAuth } from "@/lib/auth/middleware";
// import { connectToDatabase, NewsletterSubscriber } from "@/lib/models/index";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getNewsletterSubscriberModel } from "@/lib/models";

// -----------------------------
// ✅ Zod Schema for PATCH
// -----------------------------
const PatchSubscriberSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  language: z.enum(["en", "hi", "both"]).optional(),
  isActive: z.boolean().optional(),
  subscribedAt: z.union([z.string().datetime(), z.date()]).optional(),
  unsubscribedAt: z.union([z.string().datetime(), z.date()]).nullable().optional(),
  verificationToken: z.string().optional(),
  isVerified: z.boolean().optional(),
});

// -----------------------------
// ✅ ObjectId Validation Helper
// -----------------------------
const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

// -----------------------------
// ✅ PATCH /subscribers/:id
// -----------------------------
export const PATCH = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const url = request.nextUrl || new URL(request.url)
    const id = url.pathname.split("/").pop() || ""
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid subscriber ID" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const body = await request.json();
      const parsed = PatchSubscriberSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid input", details: parsed.error.format() },
          { status: 400 }
        );
      }

      const updateData = parsed.data;

      // Handle date fields
      if (updateData.subscribedAt) {
        updateData.subscribedAt = new Date(updateData.subscribedAt);
      }

      if (updateData.unsubscribedAt) {
        updateData.unsubscribedAt = new Date(updateData.unsubscribedAt);
      }

      const NewsletterSubscriber = getNewsletterSubscriberModel();
      const updated = await NewsletterSubscriber.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
      }

      return NextResponse.json({ subscriber: updated });
    } catch (err) {
      console.error("PATCH /subscribers/:id error:", err);
      return NextResponse.json(
        { error: "Failed to update subscriber" },
        { status: 500 }
      );
    }
  }
);

// -----------------------------
// ✅ DELETE /subscribers/:id
// -----------------------------
export const DELETE = withAdminAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const url = request.nextUrl || new URL(request.url)
    const id = url.pathname.split("/").pop() || ""
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid subscriber ID" }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const NewsletterSubscriber = getNewsletterSubscriberModel();
      const deleted = await NewsletterSubscriber.findByIdAndDelete(id);

      if (!deleted) {
        return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Subscriber deleted successfully" });
    } catch (err) {
      console.error("DELETE /subscribers/:id error:", err);
      return NextResponse.json(
        { error: "Failed to delete subscriber" },
        { status: 500 }
      );
    }
  }
);
