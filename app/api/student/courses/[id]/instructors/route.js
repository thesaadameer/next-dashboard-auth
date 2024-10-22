// /api/student/courses/[id]/instructors/route.js

import dbConnect from "@/lib/mongodb";
import Course from "@/models/course";
import Instructor from "@/models/instructor";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params; // Course ID

  try {
    // Fetch the course by ID and populate the instructors
    const course = await Course.findById(id).populate({
      path: "instructors",
      populate: {
        path: "user",
        select: "name", // Only return instructor's name
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Return the instructors for this course
    return NextResponse.json(course.instructors);
  } catch (error) {
    console.error("Error fetching instructors for course:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}
