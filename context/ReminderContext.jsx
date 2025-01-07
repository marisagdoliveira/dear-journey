"use client";

import React from 'react';

const ReminderContext = React.createContext();

export const ReminderProvider = ({ children }) => {
  const fetchTheReminder = async () => {
    console.log("Fetching reminders...");
  };

  return (
    <ReminderContext.Provider value={fetchTheReminder}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminder = () => {
    const context = React.useContext(ReminderContext);
    if (!context) {
      throw new Error("useReminder must be used within a ReminderProvider");
    }
    return context;
  };