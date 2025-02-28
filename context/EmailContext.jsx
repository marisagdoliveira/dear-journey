"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import the next-auth hook for session

// Create the EmailContext
const EmailContext = createContext();

// EmailProvider Component
export const EmailProvider = ({ children }) => {
  const { data: session, status } = useSession(); // Get session data
  const [email, setEmail] = useState(""); // State to store the email

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setEmail(session.user.email); // Set the email from the session
    }
  }, [session]); // Only run when the session changes

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

// Custom hook to use EmailContext
export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
