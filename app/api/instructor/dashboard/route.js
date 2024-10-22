// app/api/instructor/dashboard/route.js
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/order";
import Course from "@/models/course";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Fetch instructor's course sales data
    const courses = await Course.find().select("_id");
    const courseIds = courses.map((course) => course._id);

    const dailyRevenue = await Sale.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          purchaseDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const ytdRevenue = await Sale.aggregate([
      {
        $match: {
          course: { $in: courseIds },
          purchaseDate: { $gte: new Date(new Date().getFullYear(), 0, 1) },
          status: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const recentOrders = await Sale.find({
      course: { $in: courseIds },
      status: "paid",
    })
      .sort({ purchaseDate: -1 })
      .limit(5)
      .populate("student")
      .populate("course");

    return NextResponse.json({
      dailyRevenue: dailyRevenue[0]?.total || 0,
      ytdRevenue: ytdRevenue[0]?.total || 0,
      recentOrders,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
