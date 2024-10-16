// Program Model
import mongoose, { Schema, models } from "mongoose";

const programSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Program =
  mongoose.model.program || mongoose.model("program", programSchema);
export default Program;
