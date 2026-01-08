// import jwt from "jsonwebtoken"

// const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

// export interface JWTPayload {
//   userId: string
//   email: string
//   role: string
//   name: string
// }

// export function signToken(payload: JWTPayload): string {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
// }

// export function verifyToken(token: string): JWTPayload | null {
//   try {
//     return jwt.verify(token, JWT_SECRET) as JWTPayload
//   } catch (error) {
//     return null
//   }
// }

// export function getTokenFromRequest(request: Request): string | null {
//   const authHeader = request.headers.get("authorization")
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     return authHeader.substring(7)
//   }
//   return null
// }









// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// export interface JWTPayload {
//   userId: string;
//   email: string;
//   role: "admin" | "editor" | "user"; // ✅ Narrowed here
//   name: string;
// }

// export function verifyToken(token: string): JWTPayload | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       userId: string;
//       email: string;
//       role: string; // still loose here
//       name: string;
//     };

//     // ✅ Explicitly narrow the role before returning
//     if (!["admin", "editor", "user"].includes(decoded.role)) {
//       return null;
//     }

//     return {
//       userId: decoded.userId,
//       email: decoded.email,
//       name: decoded.name,
//       role: decoded.role as "admin" | "editor" | "user",
//     };
//   } catch (error) {
//     return null;
//   }
// }









import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "admin" | "editor" | "user";
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
      name: string;
    };

    if (!["admin", "editor", "user"].includes(decoded.role)) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role as "admin" | "editor" | "user",
    };
  } catch (error) {
    return null;
  }
}