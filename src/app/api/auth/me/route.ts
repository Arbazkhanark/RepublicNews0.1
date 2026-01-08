import { type NextRequest, NextResponse } from "next/server";
import { UserFromToken, withAuth } from "@/lib/auth/middleware";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserModel } from "@/lib/models";

export const GET = withAuth(async (req: NextRequest, user: UserFromToken) => {
  try {
    await connectToDatabase();
    const User = getUserModel();

    const userData = await User.findById(user.userId).lean();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (Array.isArray(userData)) {
      return NextResponse.json({ error: "Unexpected array returned for user" }, { status: 500 });
    }

    const { password: _omit, ...userWithoutPassword } = userData as Record<string, unknown>;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});



