import { type NextRequest, NextResponse } from "next/server"
// import { getNewsCollection } from "@/lib/database/collections"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb";
import { getArticleModel } from "@/lib/models";

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params to get the id
    const { id } = await params;
    
    // const newsCollection = await getNewsCollection()
    const Article = getArticleModel();

    await Article.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } })

    return NextResponse.json({ message: "Like count updated" })
  } catch (error) {
    console.error("Update like count error:", error)
    return NextResponse.json({ error: "Failed to update like count" }, { status: 500 })
  }
}