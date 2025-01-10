import React from 'react';
import { NextResponse } from 'next/server';
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";


const MonthGraph = () => {


    const [email, setEmail] = useState(''); // Stores user email
    const [journalEntries, setJournalEntries] = useState([]); // Stores all journal entries
    const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0)); // Stores monthly entry counts
    
    useEffect(() => {
      fetchUserAndJournalEntries();
    }, []);
  
    const fetchUserAndJournalEntries = async () => {
      try {

        const session = await getSession();
        console.log("Session:", session);
    
        if (!session || !session.user?.email) {
          console.error("User not authenticated");
          return; // Exit if no session
        }

        const response = await fetch(`/api/user?email=${session.user.email}`, { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setEmail(data.user.email);
          setJournalEntries(data.user.library); // Assuming `library` contains all journal entries
          
          // Calculate monthly journaling counts
          const counts = Array(12).fill(0);
          data.user.library.forEach(entry => {
            const month = new Date(entry.date).getMonth();
            counts[month] += 1;
          });
          setMonthlyCounts(counts);
          console.log(counts);
        } else {
          throw new Error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }

      return (
        <div className="p-4">

            
          <h1 className="text-xl font-bold">User's Journaling Activity</h1>
          <p className="text-gray-700">Email: {email}</p>
          <div className="flex justify-between items-end h-72 p-4 border border-gray-300">
            {monthlyCounts.map((count, index) => {
              const heightPercentage = count > 0 ? Math.min((count / 31) * 100, 100) : 1; // Use 1% if count is 0
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-purple-600 w-6 flex items-end justify-center transition-all duration-300"
                    style={{ height: `${heightPercentage}%`, minHeight: '1px' }} // Ensure at least 1px height
                  >
                    <span className="text-white text-xs">{count}</span>
                  </div>
                  <span className="text-gray-600 text-sm">{new Date(0, index).toLocaleString('default', { month: 'long' })}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }}

export default MonthGraph
