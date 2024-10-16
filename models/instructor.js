import mongoose, { Schema, models } from "mongoose";
import User from "./user";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    programs: [
      {
        type: Schema.Types.ObjectId,
        ref: "program",
      },
    ],
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
  },
  { timestamps: true }
);

const Instructor =
  mongoose.models.instructor || mongoose.model("instructor", instructorSchema);
export default Instructor;
