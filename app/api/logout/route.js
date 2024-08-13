// app/api/logout/route.js

import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ message: "Logged out successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ message: "Error during logout." }, { status: 500 });
  }
}

