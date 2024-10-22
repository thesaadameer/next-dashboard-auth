
// app/api/userExists/route.js

import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect(); // Establish a connection to MongoDB

  try {
    // Parse the request to get the user's email
    const { email } = await req.json();

    // Search for the user by email and select only the "_id" field
    const user = await User.findOne({ email }).select("_id");

    // Log the user for debugging purposes
    console.log("user: ", user);

    // Respond with the found user
    return NextResponse.json({ user });
  } catch (error) {
    // Log any errors and respond with a failure message
    console.error("Error while searching for user:", error);
    return NextResponse.json(
      { message: "An error occurred while searching for the user." },
      { status: 500 }
    );
  }
}
