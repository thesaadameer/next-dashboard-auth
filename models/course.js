// Course Model
import mongoose, { Schema, model, models } from "mongoose";

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: "program",
      required: true,
    },
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "instructor",
      },
    ],
  },
  { timestamps: true }
);

const Course = models.course || mongoose.model("course", courseSchema);
export default Course;
