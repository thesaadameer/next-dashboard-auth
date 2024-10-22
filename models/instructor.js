import mongoose, { Schema, models } from "mongoose";
import User from "./user";

const instructorSchema = new Schema(
  {
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
  models.instructor || mongoose.model("instructor", instructorSchema);
export default Instructor;
