import { withAdminAuth } from "@/lib/auth/middleware";
import { NextResponse, NextRequest } from "next/server";
import { int, z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getNewsletterCampaignModel } from "@/lib/models";

// -----------------------------
// ✅ Flexible Zod Schema with Backward Compatibility
// -----------------------------
const CampaignSchema = z.object({
  // Title can be optional for backward compatibility, but we'll set default
  title: z.string().optional().default("Untitled Campaign"),
  subject: z.string().min(1, "Subject is required").max(150),
  content: z.string().min(1, "Content is required"),
  
  // Flexible recipients handling
  recipients: z.union([
    z.object({
      allSubscribers: z.boolean().default(false),
      categories: z.array(z.string()).default([]),
      specificEmails: z.array(z.string().email()).default([])
    }),
    z.number().transform((num) => ({
      allSubscribers: false,
      categories: [],
      specificEmails: [],
      _legacyCount: num
    }))
  ]).optional().default({
    allSubscribers: false,
    categories: [],
    specificEmails: []
  }),
  
  // Optional fields
  htmlContent: z.string().optional(),
  template: z.string().optional().default("default"),
  language: z.enum(["en", "hi", "both"]).optional().default("en"),
  status: z.enum(["draft", "scheduled", "sending", "sent", "cancelled"]).default("draft"),
  scheduledFor: z.string().datetime().optional().nullable(),
  opens: z.number().optional().default(0),
  clicks: z.number().optional().default(0),
});

type CampaignInput = z.infer<typeof CampaignSchema>;

interface User {
  userId: string;
}

// -------------------------------------
// ✅ POST Create New Campaign
// -------------------------------------
export const POST = withAdminAuth(async (req: NextRequest, user: User) => {
  try {
    await connectToDatabase();

    // Get user from auth context
    const userId = user?.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Parse and validate input
    const parsed = CampaignSchema.safeParse(body);
    
    if (!parsed.success) {
      console.error("Validation errors:", parsed.error);
      
      // Type-safe error mapping using ZodError.flatten()
      const flatErrors = parsed.error.flatten();
      const errorDetails = Object.entries(flatErrors.fieldErrors).map(([field, messages]) => ({
        path: field,
        message: messages?.join(', ') || 'Validation error'
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid input", 
          details: errorDetails
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    console.log("Validated data:", JSON.stringify(data, null, 2));

    const NewsletterCampaign = getNewsletterCampaignModel();

    // Generate title if not provided
    let campaignTitle = data.title || "Untitled Campaign";
    if (campaignTitle === "Untitled Campaign") {
      // Use subject as title or generate one
      campaignTitle = data.subject.length > 50 
        ? data.subject.substring(0, 47) + "..."
        : data.subject;
    }

    // Extract recipients data safely
    const recipientsData = data.recipients || { allSubscribers: false, categories: [], specificEmails: [] };
    
    // Create campaign with all required fields
    const campaignData = {
      // Required fields
      title: campaignTitle,
      subject: data.subject,
      content: data.content,
      
      // Optional fields with defaults
      htmlContent: data.htmlContent || data.content,
      template: data.template || "default",
      language: data.language || "en",
      status: data.status || "draft",
      
      // Date fields
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      
      // Recipients - handle both formats safely
      recipients: {
        allSubscribers: recipientsData.allSubscribers || false,
        categories: Array.isArray(recipientsData.categories) 
          ? recipientsData.categories 
          : [],
        specificEmails: Array.isArray(recipientsData.specificEmails) 
          ? recipientsData.specificEmails 
          : []
      },
      
      // Statistics
      statistics: {
        totalRecipients: 0,
        delivered: 0,
        opened: data.opens || 0,
        clicked: data.clicks || 0,
        bounced: 0,
        unsubscribed: 0
      },
      
      // User info
      createdBy: new mongoose.Types.ObjectId(user.userId),
    };

    console.log("Creating campaign with data:", JSON.stringify(campaignData, null, 2));

    const campaign = await NewsletterCampaign.create(campaignData);
    console.log("Created campaign:", campaign._id);

    return NextResponse.json({ 
      success: true, 
      message: "Campaign created successfully",
      campaign: {
        id: campaign._id,
        title: campaign.title,
        subject: campaign.subject,
        status: campaign.status
      }
    }, { status: 201 });
    
  } catch (err: any) {
    console.error("POST /campaigns error:", err);
    
    // More detailed error logging
    if (err.name === 'ValidationError') {
      console.error("Mongoose validation errors:", JSON.stringify(err.errors, null, 2));
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create campaign",
        message: err.message,
        details: err.errors || {}
      },
      { status: 500 }
    );
  }
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
      .populate('createdBy', 'name email')
      .lean();

    const total = await NewsletterCampaign.countDocuments();

    return NextResponse.json({
      success: true,
      campaigns,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("GET /campaigns error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
});