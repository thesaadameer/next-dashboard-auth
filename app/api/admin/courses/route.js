// app/api/admin/courses/route.js

import dbConnect from "@/lib/mongodb";
import Course from "@/models/course";
import Instructor from "@/models/instructor";
import User from "@/models/user";
import { NextResponse } from "next/server";

// Add Course
export async function POST(req) {
  await dbConnect();

  try {
    const { name, description, price, program, instructorIds } =
      await req.json();

    // Check for duplicate course name for each instructor
    const existingCourse = await Course.findOne({
      name,
      instructors: { $in: instructorIds },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          error:
            "Course with this name already exists for one or more of the selected instructors.",
        },
        { status: 400 }
      );
    }

    // Process each instructor in the instructorIds array
    const instructorReferences = [];
    for (const instructorId of instructorIds) {
      const user = await User.findById(instructorId);
      if (!user) {
        return NextResponse.json(
          { error: `Instructor with ID ${instructorId} not found.` },
          { status: 404 }
        );
      }

      let instructor = await Instructor.findOne({ user: instructorId });
      if (!instructor) {
        instructor = new Instructor({
          user: instructorId,
          programs: [program],
          courses: [], // Empty initially, will assign the course below
        });
        await instructor.save();
      }

      // Add the instructor's ID to the list for the course
      instructorReferences.push(instructor._id);
    }

    // Now create the course and assign all instructors to it
    const course = new Course({
      name,
      description,
      price,
      program,
      instructors: instructorReferences, // Link all selected instructors to the course
    });

    await course.save();

    // Populate the newly created course with instructor details
    const populatedCourse = await Course.findById(course._id)
      .populate("program")
      .populate({
        path: "instructors",
        populate: {
          path: "user",
          model: "user", // Ensuring the instructor's user details are populated
        },
      });

    return NextResponse.json({
      message: "Course added successfully",
      course: populatedCourse,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}

// Get All Courses
export async function GET() {
  await dbConnect();

  try {
    const courses = await Course.find()
      .populate("program")
      .populate({
        path: "instructors",
        populate: {
          path: "user",
        },
      })
      .exec();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
