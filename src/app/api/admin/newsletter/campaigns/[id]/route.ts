import { withAdminAuth } from "@/lib/auth/middleware";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { sendEmail } from "@/lib/utils/ses";
import { getNewsletterCampaignModel, getNewsletterSubscriberModel } from "@/lib/models";

// -----------------------------------------
// ✅ PATCH Schema (only editable fields)
// -----------------------------------------
const PatchCampaignSchema = z.object({
  subject: z.string().optional(),
  content: z.string().optional(),
  htmlContent: z.string().optional(),
  language: z.enum(["en", "hi", "both"]).optional(),
  status: z.enum(["draft", "scheduled", "sent"]).optional(),
  scheduledAt: z.union([z.string().datetime(), z.date()]).optional(),
  recipients: z.number().int().nonnegative().optional(),
  opens: z.number().int().nonnegative().optional(),
  clicks: z.number().int().nonnegative().optional(),
});

// -----------------------------------------
// ✅ ID Validation Helper
// -----------------------------------------
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// -----------------------------------------
// ✅ GET /campaigns/:id
// -----------------------------------------
export const GET = withAdminAuth(async (request: NextRequest) => {
  const url = request.nextUrl || new URL(request.url);
  const id = url.pathname.split("/").pop() || "";
  console.log(id, "Campaign ID for GET");

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const NewsletterCampaign = getNewsletterCampaignModel();
    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json({ campaign });
  } catch (err) {
    console.error("GET /campaigns/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
});

// -----------------------------------------
// ✅ PATCH /campaigns/:id
// -----------------------------------------
export const PATCH = withAdminAuth(async (req: NextRequest) => {
  const url = req.nextUrl || new URL(req.url);
  const id = url.pathname.split("/").pop() || "";
  console.log(id, "Campaign ID for PATCH");

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = PatchCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updateData = parsed.data;
    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }

    const NewsletterCampaign = getNewsletterCampaignModel();
    const updatedCampaign = await NewsletterCampaign.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign: updatedCampaign });
  } catch (err) {
    console.error("PATCH /campaigns/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
});

// -----------------------------------------
// ✅ DELETE /campaigns/:id
// -----------------------------------------
export const DELETE = withAdminAuth(async (req: NextRequest) => {
  const url = req.nextUrl || new URL(req.url);
  const id = url.pathname.split("/").pop() || "";
  console.log(id, "Campaign ID for DELETE");

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const NewsletterCampaign = getNewsletterCampaignModel();
    const deletedCampaign = await NewsletterCampaign.findByIdAndDelete(id);
    if (!deletedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("DELETE /campaigns/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
});

// -----------------------------------------
// ✅ POST /campaigns/:id — Trigger send
// -----------------------------------------
export const POST = withAdminAuth(async (request: NextRequest) => {
  const url = request.nextUrl || new URL(request.url);
  const id = url.pathname.split("/").pop() || "";
  console.log(id, "Campaign ID for POST");

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const NewsletterCampaign = getNewsletterCampaignModel();
    const NewsletterSubscriber = getNewsletterSubscriberModel();

    // Find the campaign
    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Get all active subscribers
    const subscribers = await NewsletterSubscriber.find({ isActive: true });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers found" }, { status: 400 });
    }

    console.log(`Sending campaign "${campaign.subject}" to ${subscribers.length} subscribers...`);

    // Type assertion for campaign to access htmlContent property
    const campaignData = campaign as unknown as {
      htmlContent?: string;
      subject: string;
      content: string
    };

    // Send email to each subscriber
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        await sendEmail({
          to: subscriber.email,
          subject: campaign.subject,
          html: campaignData.htmlContent || campaign.content,
          text: campaign.content
        });

        console.log(`Email sent to ${subscriber.email}`);
        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);

    // Count successful and failed sends
    const successfulSends = results.filter(result => result.success).length;
    const failedSends = results.filter(result => !result.success).length;

    // Update campaign with send statistics
    await NewsletterCampaign.findByIdAndUpdate(
      id,
      {
        status: "sent",
        recipients: subscribers.length,
        sentAt: new Date(),
      },
      { new: true }
    );

    console.log(`Campaign "${campaign.subject}" sent. Successful: ${successfulSends}, Failed: ${failedSends}`);

    return NextResponse.json({
      result: {
        success: true,
        total: subscribers.length,
        successful: successfulSends,
        failed: failedSends
      },
      message: `Campaign "${campaign.subject}" sent to ${successfulSends} subscribers. ${failedSends} failed.`,
    });
  } catch (err) {
    console.error("POST /campaigns/:id (send) error:", err);
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 });
  }
});