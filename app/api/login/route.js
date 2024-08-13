// app/api/login/route.js

import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("Request body:", { email, password });
    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Password does not match");
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Set a session cookie upon successful login
    const response = NextResponse.json({ message: "User logged in.", user: { id: user._id, username: user.username, email: user.email } });
    //response.cookies.set('session', 'some-session-value', { httpOnly: true, maxAge: 60 * 60 * 24 }); // Example session cookie
    return response;
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while logging in." }, { status: 500 });
  }
}


