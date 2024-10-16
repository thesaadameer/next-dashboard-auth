// app/api/admin/instructors/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Fetch all users with the role of 'instructor'
    const instructors = await User.find({ role: "instructor" }).select(
      "name email courses"
    );

    return NextResponse.json(instructors);
  } catch (err) {
    console.error("Error fetching instructors:", err);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}
