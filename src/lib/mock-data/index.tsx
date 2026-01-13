import { getUserModel } from "../models/index";
import { connectToDatabase } from "../mongodb";

// =====================
// MOCK DATA
// =====================

export const mockData = {
  articles: [],
  users: [],
  categories: [],
  opinions: [],
  subscribers: [],
  campaigns: [],
};

// =====================
// MOCK FUNCTION HELPERS
// =====================

interface UserQuery {
  email?: string;
  isActive?: boolean;
}

export async function findUser(query: UserQuery) {
  await connectToDatabase();
  if (query.email) {
    const User = getUserModel();
    const user = await User.findOne({ email: query.email });
    console.log("Mock user found:", user);
    return user;
  }
  return null;
}
