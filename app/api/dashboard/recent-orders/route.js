import dbConnect from "@/lib/mongodb";
import Sale from "@/models/sale";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const recentOrders = await Sale.find({ status: "paid" })
      .populate("student", "name email")
      .sort({ purchaseDate: -1 })
      .limit(5);

    return NextResponse.json(recentOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching recent orders." },
      { status: 500 }
    );
  }
}
