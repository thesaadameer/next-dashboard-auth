import mongoose, { Schema, models } from "mongoose";
import User from "./user";
import Course from "./course";

const saleSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "pending", "expired"],
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.models.sale || mongoose.model("sale", saleSchema);
export default Sale;
