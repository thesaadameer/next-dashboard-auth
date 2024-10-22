import dbConnect from "@/lib/mongodb";
import Order from "@/models/order";
import Course from "@/models/course";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { role } = token;
    const userId = token.sub;
    let orders = [];

    if (role === "student") {
      orders = await Order.find({ student_id: userId }).populate("course_id");
    } else if (role === "instructor") {
      const courses = await Course.find({ instructors: userId }).select("_id");
      const courseIds = courses.map((course) => course._id);
      orders = await Order.find({ course_id: { $in: courseIds } })
        .populate("course_id")
        .populate("student_id");
    } else if (role === "admin") {
      orders = await Order.find().populate("course_id").populate("student_id");

      const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
      return NextResponse.json({ orders, totalAmount });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { actionType, courseId } = await req.json();
    const userId = token.sub;
    const role = token.role;

    // Branching based on role and actionType
    if (role === "student") {
      // Student buying a course
      if (actionType === "buyCourse") {
        const course = await Course.findById(courseId);
        if (!course) {
          return NextResponse.json(
            { error: "Course not found" },
            { status: 404 }
          );
        }

        const newOrder = new Order({
          course_id: course._id,
          student_id: userId,
          amount: course.price,
          status: "PAID", // Assuming paid status for now
        });

        await newOrder.save();

        return NextResponse.json({
          message: "Course purchased successfully",
          order: newOrder,
        });
      }
    } else if (role === "instructor") {
      // Instructor performing an action
      if (actionType === "someInstructorAction") {
        // logic here for later
      }
    } else if (role === "admin") {
      // Admin performing an action
      if (actionType === "someAdminAction") {
        // logic here for later
      }
    }

    return NextResponse.json(
      { error: "Invalid action or role" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
