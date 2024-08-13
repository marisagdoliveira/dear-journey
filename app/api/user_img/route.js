import { NextResponse } from "next/server";
import User from "@/models/User"; // Import your User model
import { connectDB } from "@/lib/mongodb";



// Updating user picture:

export async function PATCH(req) {
    try {
      
      const { email, img } = await req.json();
      await connectDB();
  
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }
      if (img) {
        user.img = img;
      }
  
      await user.save();
  
      return NextResponse.json({ message: "User updated." }, { status: 200 });
    } catch (error) {
      console.log("Error: ", error);
      return NextResponse.json({ message: "An error occurred while updating the user." }, { status: 500 });
    }
  }
  