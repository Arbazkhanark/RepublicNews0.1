import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { getNewsletterSubscriberModel } from "@/lib/models";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const NewsletterSubscriber = getNewsletterSubscriberModel();
    const subscriber = await NewsletterSubscriber.findOne({ email: payload.email });

    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    if (subscriber.isVerified) {
      return NextResponse.json({ message: "Already verified" });
    }

    subscriber.isVerified = true;
    await subscriber.save();

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}