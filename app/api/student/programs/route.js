// /api/student/programs/route.js

import dbConnect from "@/lib/mongodb";
import Program from "@/models/program";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    // Fetch all programs
    const programs = await Program.find({});
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
