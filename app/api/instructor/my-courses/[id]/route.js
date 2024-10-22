// api/instructor/my-courses/[id]/route.js

import dbConnect from "@/lib/mongodb";
import Instructor from "@/models/instructor";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = token.sub;
    const { id: courseId } = params;

    // Find the instructor associated with the user
    const instructor = await Instructor.findOne({ user: userId });
    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Remove the course from the instructor's course list
    instructor.courses = instructor.courses.filter(
      (course) => course.toString() !== courseId
    );

    await instructor.save();

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
