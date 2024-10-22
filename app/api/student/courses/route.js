// api/course/route.js

import dbConnect from "@/lib/mongodb";
import Order from "@/models/order";
import Course from "@/models/course";
import Program from "@/models/program";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const studentId = token.sub; // Get the logged-in student's ID

    // Fetch orders related to the student
    const orders = await Order.find({ student_id: studentId })
      .populate({
        path: "course_id",
        populate: [
          { path: "program", model: "program" }, // Populate the course's program
          { path: "instructors", populate: { path: "user", model: "user" } }, // Populate the instructors' user details
        ],
      })
      .exec();

    // Map the orders to send relevant data
    const purchasedCourses = orders.map((order) => ({
      courseId: order.course_id._id, // course ID for frontend comparison
      courseName: order.course_id.name,
      programName: order.course_id.program.name,
      amount: order.amount,
      status: order.status,
      instructors: order.course_id.instructors.map(
        (instructor) => instructor.user.name
      ),
    }));

    return NextResponse.json(purchasedCourses);
  } catch (error) {
    console.error("Error fetching student's purchased courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchased courses" },
      { status: 500 }
    );
  }
}
