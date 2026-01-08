// import { type NextRequest, NextResponse } from "next/server"
// import { verifyToken } from "./jwt"
// import { IUser } from "../models"

// export function withAuth(handler: (req: NextRequest, user: IUser) => Promise<NextResponse>) {
//   return async (req: NextRequest) => {
//     try {
//       const token = req.cookies.get("auth-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "")
      
//       if (!token) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//       }

//       const user = verifyToken(token)
//       if (!user) {
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//       }

//       return handler(req, user)
//     } catch (error) {
//       return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
//     }
//   }
// }

// export function withAdminAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
//   return withAuth(async (req: NextRequest, user: any) => {
//     if (user.role !== "admin" && user.role !== "editor") {
//       return NextResponse.json({ error: "Admin access required" }, { status: 403 })
//     }
//     return handler(req, user)
//   })
// }














import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export type UserFromToken = {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "user"; // Make it strict if you can
};


export function withAuth(handler: (req: NextRequest, user: UserFromToken) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token =
        req.cookies.get("auth-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

        console.log(req.headers.get("authorization"), req.cookies.get("auth-token")?.value,"Auth Header");

        console.log("Auth Token:", token);
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = verifyToken(token); // ✅ this is a JWTPayload

      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      return handler(req, user); // ✅ Type matches
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  };
}



export function withAdminAuth(handler: (req: NextRequest, user: UserFromToken) => Promise<NextResponse>) {
  return withAuth(async (req: NextRequest, user: UserFromToken) => {
    if (user.role !== "admin" && user.role !== "editor") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return handler(req, user);
  });
}






