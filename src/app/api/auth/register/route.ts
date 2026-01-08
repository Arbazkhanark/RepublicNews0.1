import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth/jwt"
import { connectToDatabase } from "@/lib/mongodb";
import { getUserModel } from "@/lib/models";
// import { connectToDatabase, User } from "@/lib/models/index"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    console.log(email, "Registering User...")
    console.log(role, "Role...")
    const User = getUserModel();
    const existingUser = await User.findOne({ email })
    console.log(existingUser, "Existing User...")
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role as "admin" | "writer" | "editor" | "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // const result = await usersCollection.insertOne(newUser)
    const result = await User.create(newUser)
    console.log("New user created with ID:", result)

    const token = signToken({
      userId: result._id!.toString(),
      email,
      role,
      name,
    })

    const response = NextResponse.json({
      message: "Registration successful",
      user: {
        id: result.insertedId,
        name,
        email,
        role,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.log("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
