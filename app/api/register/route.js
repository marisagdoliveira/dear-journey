import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// Creating the user:

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    await connectDB();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the hashed password
    await User.create({ username, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}

// Updating user library data:

export async function PATCH(req) {
  try {
    
    const { title, email, date, mainContent, smallNotes } = await req.json();
    console.log('Received PATCH request:', { title, email, date, mainContent, smallNotes });

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

   // Find the library entry to update or add:

    let libraryEntry = user.library.find(entry => entry.date.getTime() === entryDate.getTime());


    if (libraryEntry) {
      // Update existing library entry
      libraryEntry.title = title;
      libraryEntry.mainContent = mainContent;
      libraryEntry.smallNotes = smallNotes;
    } else {
      // Create new library entry if not found
      libraryEntry = {
        title,
        date: entryDate,
        mainContent,
        smallNotes
      };
      user.library.push(libraryEntry);
    }

    await user.save();

    return NextResponse.json({ message: "User library updated." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while updating user library." }, { status: 500 });
  }
}


