import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// New PATCH route for small notes
export async function PATCH(req) {
    try {
      const { email, date, smallNotes } = await req.json();
      console.log('Received PATCH request for small notes:', { email, date, smallNotes });
  
      await connectDB();
  
      if (!email || !date) {
        return NextResponse.json({ message: "User and date are required." }, { status: 400 });
      }
  
      // Check if user exists:
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }
  
      // Convert date string to Date object:
      const entryDate = new Date(date);
  
      // Find the library entry to update:
      const libraryEntry = user.library.find(entry => entry.date.getTime() === entryDate.getTime());
  
      if (libraryEntry) {
        // Update small notes only
        libraryEntry.smallNotes = smallNotes;
      } else {
        // If the entry doesn't exist, handle accordingly (e.g., return an error or create a new entry)
        return NextResponse.json({ message: "Entry not found." }, { status: 404 });
      }
  
      await user.save();
  
      return NextResponse.json({ message: "Small notes updated successfully." }, { status: 200 });
    } catch (error) {
      console.log("Error: ", error);
      return NextResponse.json({ message: "An error occurred while updating small notes." }, { status: 500 });
    }
  }
  