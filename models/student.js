import mongoose, { Schema, models } from "mongoose";
import User from "./user";
import Sale from "./sale";

const studentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    enrollments: [
      {
        type: Schema.Types.ObjectId,
        ref: "sale",
      },
    ],
  },
  { timestamps: true }
);

const Student =
  mongoose.models.student || mongoose.model("student", studentSchema);
export default Student;
