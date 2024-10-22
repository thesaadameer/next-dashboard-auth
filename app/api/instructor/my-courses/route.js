// api/instructor/my-courses/route.js

import dbConnect from "@/lib/mongodb";
import Instructor from "@/models/instructor";
import Course from "@/models/course";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = token.sub; // Extract the user ID from the token

    // Check if the user exists and has the instructor role
    const user = await User.findById(userId);
    if (!user || user.role !== "instructor") {
      return NextResponse.json(
        { error: "User is not an instructor" },
        { status: 403 }
      );
    }

    let instructor = await Instructor.findOne({ user: userId }).populate(
      "courses"
    );
    if (!instructor) {
      instructor = new Instructor({ user: userId, courses: [] });
      await instructor.save();
    }

    return NextResponse.json({ courses: instructor.courses || [] });
  } catch (error) {
    console.error("Error fetching instructor's courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor's courses" },
      { status: 500 }
    );
  }
}
