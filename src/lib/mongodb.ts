// src/lib/mongodb.ts
import mongoose from 'mongoose';

// const MONGODB_URI =
  // process.env.MONGODB_URI || 'mongodb+srv://wasimahmedcom_db_user:6FTpgCaNaNKp5sHD@cluster0.iu5ulnr.mongodb.net/republicmirror';


const MONGODB_URI = 'mongodb+srv://arbaazkhanark23_db_user:6APCjmKsqQ5YeU3X@cluster0.uqvoox7.mongodb.net/republicmirror';
// const MONGODB_URI ='mongodb+srv://wasimahmedcom_db_user:6FTpgCaNaNKp5sHD@cluster0.iu5ulnr.mongodb.net/republicmirror';

if (!MONGODB_URI) {
  throw new Error(
    '❌ Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Type for global mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// SAFE WAY: Check if global exists (for Edge Runtime compatibility)
const getGlobal = (): any => {
  if (typeof global !== 'undefined') {
    return global;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  return {};
};

const g = getGlobal();

// Initialize cache safely
const cached: MongooseCache = g.mongooseCache || {
  conn: null,
  promise: null,
};

if (!g.mongooseCache) {
  g.mongooseCache = cached;
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
      console.log('✅ MongoDB connected successfully',MONGODB_URI);

      mongooseInstance.connection.on('connected', () => {
        console.log('✅ Mongoose connected to MongoDB',MONGODB_URI);
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

// 🧠 Prevent duplicate model registration
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
