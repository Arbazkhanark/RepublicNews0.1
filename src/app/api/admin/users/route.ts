import { withAdminAuth } from "@/lib/auth/middleware";
import { getUserModel } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
// import { connectToDatabase, User } from "@/lib/models/index";
import { NextRequest, NextResponse } from "next/server";
// import { Logger } from "@/lib/logger"; // Assuming you use a logger library

export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    // Query users with pagination support (if applicable)
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const User = getUserModel();
    const users = await User.find()
      .skip((page - 1) * Number(limit)) // Pagination
      .limit(Number(limit)) // Pagination limit
      .select("-password"); // Exclude password

    // Handle case when no users are found
    if (users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    // Log the error with a proper logging library
    // Logger.error("Failed to fetch users", { error });
    console.error("Failed to fetch users", error);

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
});
