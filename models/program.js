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

const Program = models.program || mongoose.model("program", programSchema);
export default Program;
