
// app/api/admin/students/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Fetch all users with the role of 'student'
    const students = await User.find({ role: "student" }).select(
      "name email courses"
    );

    return NextResponse.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
