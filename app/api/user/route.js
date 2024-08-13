import { NextResponse } from "next/server";
import User from "@/models/User"; // Import your User model
import { connectDB } from "@/lib/mongodb";

// Getting the user:

export async function GET(req) {
  try {
    await connectDB(); // Connect to MongoDB

    const getUser = await User.findOne({ _id: "6679d45c98cafb1fbc68a1e1" });

    if (!getUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user: getUser }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "An error occurred while finding the user." }, { status: 500 });
  }
}

// Updating user personal info:

export async function PATCH(req) {
  try {
    
    const { email, username, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }

    await user.save();

    return NextResponse.json({ message: "User updated." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while updating the user." }, { status: 500 });
  }
}

