"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";



export default function Profile() {
    
    const [username, setUsername] = useState("");
    const router = useRouter();

    if (!router) {
        return null; // Handle cases where router is not available
    }
    
        // Fetch user data to confirm authentication
        useEffect(() => {
            const fetchUser = async () => {
                try {
                    const res = await fetch("/api/user", {
                        method: "GET",
                    });
    
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
    
                    const data = await res.json();
                    console.log(data);
                    if (!data.user.username) {
                        throw new Error("User not authenticated");
                    }
                    setUsername(data.user.username);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    router.replace("/"); // Redirect to login if not authenticated
                }
            };
    
            fetchUser();
        }, [router]);
    
    
    
    return (
        <div className="flex justify-center wrapper pb-10">
        <div className="flex items-center">
        <Navbar />
        </div>
        <div className="flex flex-col w-screen bg-transparent text-white align-start pt-20 pl-20" >
          <div className="flex flex-row">
            <div>
            <h1 className="darker-grotesque-main">It's good to see you, </h1>
          </div>
          <span className={`w-[80px] pr-16 darker-grotesque-main`} style={{ whiteSpace: "normal" }}>
            &nbsp;
            {username}!
          </span>
          </div>
          <p className="flex align-center darker-grotesque-main pr-6 text-lg">This is your personal space.</p>
        </div>
      </div>
    );
}