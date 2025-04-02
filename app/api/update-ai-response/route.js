import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";


export async function PATCH(req) {
    try {
      const { email, date, aiResponse } = await req.json();
      console.log('Received PATCH request for AI response:', { email, date, aiResponse });
  
      await connectDB();
  
      if (!email || !date) {
        return NextResponse.json({ message: "User email and date are required." }, { status: 400 });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }
  
      // Convert date string to Date object
      const entryDate = new Date(date);
  
      // Find the library entry to update
      const libraryEntry = user.library.find(entry => entry.date.getTime() === entryDate.getTime());
  
      if (!libraryEntry) {
        return NextResponse.json({ message: "Library entry not found for this date." }, { status: 404 });
      }
  
      // Update the AI response
      libraryEntry.lastAIResponse = aiResponse;
  
      await user.save();
  
      return NextResponse.json({ message: "AI response updated successfully.", lastAIResponse: aiResponse }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating AI response:", error);
      return NextResponse.json({ message: "An error occurred while updating AI response." }, { status: 500 });
    }
  }
  