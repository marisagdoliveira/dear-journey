import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcrypt";


// Getting the user:

export async function GET(req) {
  try {
    await connectDB(); // Connect to MongoDB

    const getUser = await User.findOne({ _id: "671bd8b3b9f90b65e92d30e1" });

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
    const { email, username, password, currentPassword } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Verify the current password matches the encription on the db:
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }

    // Check if a password change is requested - VERIFICAAAAAAR!!!!
    if (password) {

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Update other fields
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }

    await user.save();

    return NextResponse.json({ message: "User updated." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while updating the user." }, { status: 500 });
  }
}

