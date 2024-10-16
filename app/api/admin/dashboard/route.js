// app/api/admin/dashboard/route.js
import dbConnect from "@/lib/mongodb";
import Sale from "@/models/sale";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Fetch daily and YTD revenue
    const dailyRevenue = await Sale.aggregate([
      {
        $match: {
          purchaseDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const ytdRevenue = await Sale.aggregate([
      {
        $match: {
          purchaseDate: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
          },
          status: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const customersCount = await User.countDocuments({ role: "student" });

    const recentOrders = await Sale.find({ status: "paid" })
      .sort({ purchaseDate: -1 })
      .limit(5)
      .populate("student")
      .populate("course");

    return NextResponse.json({
      dailyRevenue: dailyRevenue[0]?.total || 0,
      ytdRevenue: ytdRevenue[0]?.total || 0,
      customers: customersCount,
      recentOrders,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
