import { UserFromToken, withAdminAuth } from "@/lib/auth/middleware"
import { getCategoryModel } from "@/lib/models"
import { connectToDatabase } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import slugify from "slugify"


export const PUT = withAdminAuth(async (req: NextRequest, _user: UserFromToken) => {
  try {
    await connectToDatabase()
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop()
    const updates = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 })
    }


    const Category = getCategoryModel()

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true })
      const duplicate = await Category.findOne({ slug: updates.slug, _id: { $ne: id } })
      if (duplicate) {
        return NextResponse.json({ error: "Another category with this name already exists." }, { status: 409 })
      }
    }

    updates.updatedAt = new Date()

    const updated = await Category.findByIdAndUpdate(id, updates, { new: true })

    console.log(updated,"Updated find here")

    if (!updated) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "✅ Category updated successfully.", category: updated })
  } catch (error) {
    console.error("❌ Update category error:", error)
    return NextResponse.json({ error: "Failed to update category. Please try again." }, { status: 500 })
  }
})



