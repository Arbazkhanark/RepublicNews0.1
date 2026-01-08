import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
// import { NewsletterSubscriber } from "@/lib/models/index";
import { sendEmail } from "@/lib/utils/ses";
import { getNewsletterSubscriberModel } from "@/lib/models";

const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_URL = process.env.NEXTAUTH_URL!;

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email, name, language = "both" } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const NewsletterSubscriber = getNewsletterSubscriberModel();
    const existing = await NewsletterSubscriber.findOne({ email });

    // If subscriber already exists
    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json({ error: "Already subscribed and verified" }, { status: 409 });
      } else {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
        const verificationUrl = `${BASE_URL}/api/newsletter/verify?token=${token}`;

        await sendEmail({
          to: email,
          subject: "Verify your newsletter subscription",
          html: `
            <p>Hey ${name || ""},</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link will expire in 24 hours.</p>
          `,
          text: `Verify your email: ${verificationUrl}`,
        });

        return NextResponse.json({ message: "Verification email resent" });
      }
    }

    // Create new subscriber
    await NewsletterSubscriber.create({
      email,
      name,
      language,
      isActive: true,
      subscribedAt: new Date(),
      isVerified: false,
    });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
    const verificationUrl = `${BASE_URL}/api/newsletter/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your newsletter subscription",
      html: `
        <p>Hello ${name || ""},</p>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>Please confirm your subscription by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
      text: `Verify your email: ${verificationUrl}`,
    });

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
