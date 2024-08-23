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

    // Find the library entry to update or create:
    let libraryEntry = user.library.find(entry => entry.date.getTime() === entryDate.getTime());

    if (libraryEntry) {
      // Update small notes only
      libraryEntry.smallNotes = smallNotes;
    } else {
      // Create new library entry with only small notes
      libraryEntry = {
        date: entryDate,
        smallNotes,
        title: '', // Set other fields as empty or default values
        mainContent: ''
      };
      user.library.push(libraryEntry);
    }

    await user.save();

    return NextResponse.json({ message: "Small notes updated successfully." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while updating small notes." }, { status: 500 });
  }
}


  
// New DELETE route for small notes
export async function DELETE(req) {
  try {
    const { email, date, noteIndex } = await req.json();
    console.log('Received DELETE request for small notes:', { email, date, noteIndex });

    await connectDB();

    if (!email || !date || noteIndex === undefined) {
      return NextResponse.json({ message: "User, date, and note index are required." }, { status: 400 });
    }

    // Check if user exists:
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Convert date string to Date object:
    const entryDate = new Date(date);

    // Find the library entry:
    const libraryEntry = user.library.find(entry => entry.date.getTime() === entryDate.getTime());

    if (!libraryEntry) {
      return NextResponse.json({ message: "Library entry not found for the given date." }, { status: 404 });
    }

    // Check if the noteIndex is valid
    if (noteIndex < 0 || noteIndex >= libraryEntry.smallNotes.length) {
      return NextResponse.json({ message: "Invalid note index." }, { status: 400 });
    }

    // Remove the small note at the specified index
    libraryEntry.smallNotes.splice(noteIndex, 1);

    await user.save();

    return NextResponse.json({ message: "Small note deleted successfully." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while deleting the small note." }, { status: 500 });
  }
}