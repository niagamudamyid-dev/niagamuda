/* eslint-env node */
/* global process */

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!globalThis.mongoose) {
  globalThis.mongoose = { conn: null };
}

export async function connectDB() {
  if (globalThis.mongoose.conn) return globalThis.mongoose.conn;

  globalThis.mongoose.conn = await mongoose.connect(MONGO_URI);
  return globalThis.mongoose.conn;
}