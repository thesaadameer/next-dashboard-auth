import dbConnect from "@/lib/mongodb";
import Instructor from "@/models/instructor";
import Course from "@/models/course";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      console.error("No token found, user not authenticated");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { courseId } = await req.json();
    const userId = token.sub; // Extract the user ID from the token

    console.log("User ID:", userId); // Log the user ID
    console.log("Course ID:", courseId); // Log the course ID

    // Check if the courseId is valid
    if (!courseId) {
      console.error("No course ID provided");
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if the user is an instructor
    const user = await User.findById(userId);
    if (!user || user.role !== "instructor") {
      console.error("User is not an instructor or not found");
      return NextResponse.json(
        { error: "User is not an instructor" },
        { status: 403 }
      );
    }

    // Check if the instructor exists
    let instructor = await Instructor.findOne({ user: userId });
    if (!instructor) {
      console.log("Instructor not found, creating a new one");
      instructor = new Instructor({ user: userId, courses: [] });
      await instructor.save();
    }

    // Check if the course is already added
    if (instructor.courses.includes(courseId)) {
      console.error("Course already added to instructor");
      return NextResponse.json(
        { error: "Course already added" },
        { status: 400 }
      );
    }

    // Add the course to the instructor's courses list
    instructor.courses.push(courseId);
    await instructor.save();

    console.log("Course added successfully to instructor");
    return NextResponse.json({ message: "Course added successfully" });
  } catch (error) {
    console.error("Error adding course:", error); // Log the error
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}
