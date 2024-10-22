// /api/student/programs/[id]/courses/route.js

import dbConnect from "@/lib/mongodb";
import Course from "@/models/course";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params; // Program ID

  try {
    // Fetch all courses that belong to the given program ID
    const courses = await Course.find({ program: id });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses for program:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
