// app/api/dashboard/daily-revenue/route.js

import dbConnect from "@/lib/mongodb";
import Sale from "@/models/order";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Get revenue grouped by date for the last 7 days
    const revenueData = await Sale.aggregate([
      {
        $match: {
          status: "paid",
          purchaseDate: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json(revenueData);
  } catch (error) {
    console.error("Error fetching daily revenue data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching daily revenue data." },
      { status: 500 }
    );
  }
}
