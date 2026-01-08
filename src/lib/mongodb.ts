// import { MongoClient, type Db } from "mongodb"

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

// const uri = process.env.MONGODB_URI
// const options = {}

// let client: MongoClient
// let clientPromise: Promise<MongoClient>

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   const globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>
//   }

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri, options)
//     globalWithMongo._mongoClientPromise = client.connect()
//   }
//   clientPromise = globalWithMongo._mongoClientPromise
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri, options)
//   clientPromise = client.connect()
// }

// export default clientPromise

// export async function getDatabase(): Promise<Db> {
//   const client = await clientPromise
//   return client.db("republicmirror")
// }

// export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
//   const client = await clientPromise
//   const db = client.db("republicmirror")
//   return { client, db }
// }








// import mongoose from "mongoose"

// const MONGODB_URI = process.env.MONGODB_URI as string

// if (!MONGODB_URI) {
//   throw new Error("Missing MONGODB_URI in environment")
// }

// export async function connectToDatabase() {
//   if (mongoose.connection.readyState >= 1) return; // Already connected

//   try {
//     await mongoose.connect(MONGODB_URI)
//     console.log("✅ Connected to MongoDB")
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err)
//     throw err
//   }
// }











// // lib/mongoose.ts

// import mongoose from "mongoose"

// const MONGODB_URI = process.env.MONGODB_URI as string || "mongodb+srv://arbaazkhanark23_db_user:6APCjmKsqQ5YeU3X@cluster0.uqvoox7.mongodb.net/republicmirror"

// if (!MONGODB_URI) {
//   throw new Error("❌ Missing MONGODB_URI in environment")
// }

// // Optional: log connection events (for production debugging)
// mongoose.connection?.on("connected", () => {
//   console.log("✅ MongoDB connected")
// })
// mongoose.connection?.on("disconnected", () => {
//   console.log("⚠️ MongoDB disconnected")
// })
// mongoose.connection?.on("error", (err) => {
//   console.error("❌ MongoDB error:", err)
// })

// export async function connectToDatabase() {
//   if (mongoose.connection.readyState >= 1) return

//   try {
//     console.log(MONGODB_URI,"MongoDB URL---------")
//     await mongoose.connect(MONGODB_URI)
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err)
//     throw err
//   }
// }

















// // lib/mongoose.ts
// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI as string || 'mongodb+srv://arbaazkhanark23_db_user:6APCjmKsqQ5YeU3X@cluster0.uqvoox7.mongodb.net/republicmirror';

// console.log(MONGODB_URI, "MongoDB URI-----AA RHA H BRO ----");

// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   );
// }

// interface MongooseCache {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// }

// declare global {
//   var mongoose: MongooseCache | undefined;
// }

// const cached: MongooseCache = global.mongoose || {
//   conn: null,
//   promise: null,
// };

// if (!global.mongoose) {
//   global.mongoose = cached;
// }

// async function connectToDatabase(): Promise<typeof mongoose> {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     console.log('🔗 Connecting to MongoDB...');
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log('✅ MongoDB connected successfully');
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     console.error('❌ MongoDB connection error:', e);
//     throw e;
//   }

//   return cached.conn;
// }

// // Connection events
// mongoose.connection.on('connected', () => {
//   console.log('✅ Mongoose connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('❌ Mongoose connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️ Mongoose disconnected from MongoDB');
// });

// // Model registry to prevent duplicate model registration
// const modelRegistry = new Set<string>();

// export function registerModel<T extends mongoose.Document>(
//   modelName: string, 
//   schema: mongoose.Schema<T>
// ): mongoose.Model<T> {
//   if (modelRegistry.has(modelName)) {
//     return mongoose.model<T>(modelName);
//   }
  
//   if (mongoose.models[modelName]) {
//     modelRegistry.add(modelName);
//     return mongoose.model<T>(modelName);
//   }
  
//   modelRegistry.add(modelName);
//   return mongoose.model<T>(modelName, schema);
// }

// export default mongoose;
// export { connectToDatabase };


















// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://arbaazkhanark23_db_user:6APCjmKsqQ5YeU3X@cluster0.uqvoox7.mongodb.net/republicmirror';

if (!MONGODB_URI) {
  throw new Error(
    '❌ Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Type for global mongoose cache (for hot reload in dev)
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Prevent TypeScript error on global
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Use existing cache or create new one
const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// 🔌 Connect to MongoDB
async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔗 Connecting to MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB connected successfully');

      // ✅ Add event listeners safely after connection
      mongooseInstance.connection.on('connected', () => {
        console.log('✅ Mongoose connected to MongoDB');
      });

      mongooseInstance.connection.on('error', (err) => {
        console.error('❌ Mongoose connection error:', err);
      });

      mongooseInstance.connection.on('disconnected', () => {
        console.log('⚠️ Mongoose disconnected from MongoDB');
      });

      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }

  return cached.conn;
}

// 🧠 Prevent duplicate model registration in development (hot reload fix)
const modelRegistry = new Set<string>();

export function registerModel<T extends mongoose.Document>(
  modelName: string,
  schema: mongoose.Schema<T>
): mongoose.Model<T> {
  if (modelRegistry.has(modelName)) {
    return mongoose.model<T>(modelName);
  }

  if (mongoose.models[modelName]) {
    modelRegistry.add(modelName);
    return mongoose.model<T>(modelName);
  }

  modelRegistry.add(modelName);
  return mongoose.model<T>(modelName, schema);
}

export { connectToDatabase };
