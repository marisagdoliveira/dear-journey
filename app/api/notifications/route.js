// app/api/notifications/route.js

import User from "@/models/User";
import Notification from "@/models/Notifications";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// app/api/notifications/route.js



export async function POST(req) {
  try {
    const { email, noteDate, noticeDate } = await req.json();
    console.log('Received POST request to create notification:', { email, noteDate, noticeDate });

    await connectDB();

    if (!email || !noteDate || !noticeDate) {
      return NextResponse.json({ message: "Email, noteDate, and noticeDate are required." }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if a notification with the same noteDate and noticeDate already exists
    const existingNotification = user.notifications.find(notification =>
      notification.noteDate.getTime() === new Date(noteDate).getTime() &&
      notification.noticeDate.getTime() === new Date(noticeDate).getTime()
    );
    
    if (existingNotification) {
      return NextResponse.json({ message: "Notification already exists for this entry and date." }, { status: 400 });
    }

    const newNotification = {
      noteDate: new Date(noteDate),
      noticeDate: new Date(noticeDate)
    };

    user.notifications.push(newNotification);
    await user.save();

    return NextResponse.json({ message: "Notification created successfully." }, { status: 201 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while creating the notification." }, { status: 500 });
  }
}




