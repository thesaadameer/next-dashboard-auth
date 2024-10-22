import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    student_id: {
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
      enum: ["PAID", "UNPAID", "FAILED"],
      default: "UNPAID",
      required: true,
    },
    craeted_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
