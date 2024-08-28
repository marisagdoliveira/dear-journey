import User from "@/models/User";
import Notification from "@/models/Notifications";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";


// Delete a notification

export async function DELETE(req) {
  try {
    const { email, noteDate, noticeDate } = await req.json();
    console.log('Received DELETE request for notification:', { email, noteDate, noticeDate });

    await connectDB();

    if (!email || !noteDate || !noticeDate) {
      return NextResponse.json({ message: "Email, noteDate, and noticeDate are required." }, { status: 400 });
    }

    // Check if user exists:
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Convert noteDate and noticeDate strings to Date objects:
    const noteDateObj = new Date(noteDate);
    const noticeDateObj = new Date(noticeDate);

    // Find the notification to delete:
    const notificationIndex = user.notifications.findIndex(notification =>
      notification.noteDate.getTime() === noteDateObj.getTime() &&
      notification.noticeDate.getTime() === noticeDateObj.getTime()
    );

    if (notificationIndex === -1) {
      return NextResponse.json({ message: "Notification not found." }, { status: 404 });
    }

    // Remove the notification
    user.notifications.splice(notificationIndex, 1);

    await user.save();

    return NextResponse.json({ message: "Notification deleted successfully." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "An error occurred while deleting the notification." }, { status: 500 });
  }
  }
  