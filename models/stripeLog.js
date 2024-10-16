import mongoose, { Schema, models } from "mongoose";
import User from "./user";

const stripeLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    amount: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const StripeLog =
  mongoose.model.stripeLog || mongoose.model("stripeLog", stripeLogSchema);
export default StripeLog;
