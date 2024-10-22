// app/api/admin/course/[id]/route.js

import dbConnect from "@/lib/mongodb";
import Course from "@/models/course";
import Instructor from "@/models/instructor";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Extract course ID

    // Fetch the course first to check for instructor and name match
    const { instructor, name } = await req.json();

    // Find and delete the course
    const deletedCourse = await Course.findOneAndDelete({
      _id: id,
      instructors: instructor,
      name: name, // Match course name
    });

    if (!deletedCourse) {
      return NextResponse.json(
        { error: "Course not found or no match with instructor" },
        { status: 404 }
      );
    }

    // Remove the course reference from all related instructors
    await Instructor.updateMany(
      { courses: id }, // Find instructors with this course
      { $pull: { courses: id } } // Remove the course from their courses array
    );

    return NextResponse.json({
      message: "Course and instructor references deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

// Update Course (PUT request)
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Extract course ID from the request params
    const { name, description, price } = await req.json(); // Extract updated details from the request body

    // Find and update the course with the new details
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
      },
      { new: true } // Return the updated document
    ).populate({
      path: "instructors",
      populate: {
        path: "user", // Populate the instructor's user details
        model: "user", // This ensures the name, email, etc., are fetched
      },
    });

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Course updated successfully",
      course: updatedCourse, // Return the fully populated course
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
