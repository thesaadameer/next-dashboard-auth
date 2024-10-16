import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";

export async function POST(req) {
  await dbConnect();

  try {
    // Destructure name, email, password, and role from the request body
    const { name, email, password, role } = await req.json();
    console.log("Received data:", { name, email, password, role }); // Add log to confirm data received

    // Validate the role; ensure only allowed roles are saved
    if (role && !["student", "instructor"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role specified." },
        { status: 400 }
      );
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided information
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("New user created:", newUser); // Log new user to check if role is being saved

    return NextResponse.json(
      { message: "User registered successfully.", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
