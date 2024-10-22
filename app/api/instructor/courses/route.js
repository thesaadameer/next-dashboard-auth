// api/instructor/course/route.js

import dbConnect from "@/lib/mongodb";
import Course from "@/models/course";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { programId } = await req.json(); // Expecting programId from the request body

    // Fetch courses related to the given program
    const courses = await Course.find({ program: programId }).populate(
      "program"
    );

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
