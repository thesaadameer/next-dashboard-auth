
//This is for instructor dropdown


import dbConnect from "@/lib/mongodb";
import Instructor from "@/models/instructor";
import User from "@/models/user";
import { NextResponse } from "next/server";

// Get All Instructors
export async function GET() {
  await dbConnect();

  try {
    // Populate 'user' field to access the instructor's name
    const instructors = await User.find({ role: "instructor" }); // Ensure user is populated
    return NextResponse.json(instructors); // Return populated instructors data
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}
