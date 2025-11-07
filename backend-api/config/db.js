import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // mongoose 7 ya ignora esos flags, se mantienen solo si quieres
    });
    console.log('✅ MongoDB connected (backend-api)');
  } catch (err) {
    console.error('Mongo connection error (backend-api):', err);
    process.exit(1);
  }
}
