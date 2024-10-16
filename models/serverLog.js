import mongoose, { Schema, models } from "mongoose";

const serverLogSchema = new Schema(
  {
    event: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ServerLog =
  mongoose.model.serverLog || mongoose.model("serverLog", serverLogSchema);
export default ServerLog;
