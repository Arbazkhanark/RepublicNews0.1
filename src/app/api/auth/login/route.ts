import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { findUser } from "@/lib/mock-data"
import { signToken } from "@/lib/auth/jwt"
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    let user = null

    if (role) {
      // Admin/editor login: role is required and must match
      user = await findUser({ email, role, isActive: true })
    } else {
      // No role provided — assume "user" trying to login
      // Prevent login if the email belongs to admin/editor
      const isNonUser = await findUser({ email, isActive: true, role: { $ne: "user" } })
      console.log(isNonUser, "Is Non-User (admin/editor) trying to login as user?");
      if (isNonUser) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Now find user with role "user"
      user = await findUser({ email, isActive: true, role: "user" })
    }
    console.log(user, "User Login...")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: token,
      },
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
