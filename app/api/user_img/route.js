import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { promises as fs } from 'fs';
import path from 'path';

// Updating user:
export async function PATCH(req) {
    try {
        const formData = await req.formData();
        const email = formData.get('email');
        const file = formData.get('img');

        if (!email || !file) {
            return NextResponse.json({ message: "Email and image are required." }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Determine the file name based on the user's email or username
        const fileName = `${email}.jpg`; // Alternatively, you could use `${user.username}.jpg`
        const filePath = path.join(process.cwd(), 'public/assets', fileName);

        // Check if a file already exists for the user and delete it if it does
        try {
            await fs.access(filePath); // Check if the file exists
            await fs.unlink(filePath); // Delete existing file
        } catch (error) {
            // If the file doesn't exist, do nothing
        }

        // Save the new image file to the directory
        const buffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));

        // Update the user's image path in the database
        user.img = fileName;
        await user.save();

        return NextResponse.json({ message: "User updated." }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ message: "An error occurred while updating the user." }, { status: 500 });
    }
}
