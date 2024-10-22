import dbConnect from "@/lib/mongodb";
import Program from "@/models/program";
import { NextResponse } from "next/server";

// DELETE request to remove a program
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const deletedProgram = await Program.findByIdAndDelete(id);
    if (!deletedProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
