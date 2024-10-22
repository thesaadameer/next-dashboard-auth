import dbConnect from "@/lib/mongodb";
import Instructor from "@/models/instructor";
import Sale from "@/models/order";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  await dbConnect();

  try {
    // Get token from the request using next-auth
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

    // Find the instructor by user ID and populate courses
    let instructor = await Instructor.findOne({ user: userId }).populate(
      "courses"
    );

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Find all sales related to the instructor's courses
    const sales = await Sale.find({
      course: { $in: instructor.courses }, // Only find students in courses taught by this instructor
    })
      .populate({
        path: "student", // Student's user details
        model: "user",
      })
      .populate("course") // Populate the course details
      .exec();

    // Map through sales to build the data you need
    const enrolledStudents = sales.map((sale) => ({
      studentName: sale.student?.name || "Unknown Student",
      studentEmail: sale.student?.email || "Unknown Email",
      courseName: sale.course?.name || "Unknown Course",
      programName: sale.course?.program?.name || "N/A",
      paymentStatus: sale.status || "No Payment Info", // Default if status is missing
    }));

    return NextResponse.json(enrolledStudents);
  } catch (error) {
    console.error("Error fetching instructor's students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
