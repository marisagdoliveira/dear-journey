import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// New POST route for supportTicket:


export async function POST(req) {
  try {
    // Extract the support ticket data from the request body
    const { username, email, description, explanation } = await req.json();
    console.log('Received POST request to create support ticket:', { username, email, description, explanation });

    // Connect to the database
    await connectDB();

    // Validate the input data
    if (!username || !email || !description || !explanation) {
      return NextResponse.json(
        { message: "Username, email, description, and explanation are required." },
        { status: 400 }
      );
    }

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Add the new support ticket to the user's support array
    user.support.push({
      username,
      email,
      description,
      explanation
    });

    // Save the user with the updated support tickets
    await user.save();

    // Return a success response
    return NextResponse.json({ message: "Support ticket created successfully." }, { status: 201 });
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "An error occurred while creating the support ticket." },
      { status: 500 }
    );
  }
}

  