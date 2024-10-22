import dbConnect from "@/lib/mongodb";
import Program from "@/models/program";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, description } = await req.json();

    // Check for duplicate program name
    const existingProgram = await Program.findOne({ name });
    if (existingProgram) {
      return NextResponse.json(
        { error: "Program with this name already exists." },
        { status: 400 }
      );
    }

    const program = new Program({ name, description });
    await program.save();
    return NextResponse.json({ message: "Program added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add program" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    const programs = await Program.find();
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
