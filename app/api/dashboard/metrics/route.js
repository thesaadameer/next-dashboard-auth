import dbConnect from "@/lib/mongodb";
import Sale from "@/models/sale";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const totalRevenue = await Sale.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalStudents = await User.countDocuments({ role: "student" });

    return NextResponse.json({
      dailyRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      ytdRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0, // You can refine this for YTD logic
      totalCustomers: totalStudents,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching metrics." },
      { status: 500 }
    );
  }
}
