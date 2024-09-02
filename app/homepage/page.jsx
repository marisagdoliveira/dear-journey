"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import Link from 'next/link';
import OriginalBinder2 from "../../public/assets/OriginalBinder2.svg"
import { TbBell } from "react-icons/tb";




export default function Homepage() {
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);


  const router = useRouter();

  // Fetch user data to confirm authentication - BEFORE USERPIC LOGIC:
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
        console.log(data)
        if (!data.user.username) { // ---------------> this is the way to access userinfo -> "data.user.whatever"
          throw new Error("User not authenticated");
        }
        setUsername(data.user.username);// ---------------> this is the way to access userinfo -> data.user.x
        setUserPic(data.user.img || null); // -----------> set state userPic
        setEmail(data.user.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);


  useEffect(() => {
    let shakeInterval; // Declare shakeInterval in the scope of useEffect
  
    // Function to start and stop the shake animation
    const startShaking = () => {
      if (notificationsOpen) {
        const bell = document.querySelector('.notification-bell');
        
        // Check if bell is not null before accessing its style
        if (bell) {
          // Start the shake animation
          bell.style.animationPlayState = 'running';
  
          // Stop the shake animation after 3 seconds
          setTimeout(() => {
            if (bell) { // Check again before applying style
              bell.style.animationPlayState = 'paused';
            }
          }, 3000); // 3000 ms = 3 seconds
        }
      }
    };
  
    // Start the first shake after 20 seconds
    const shakeTimeout = setTimeout(() => {
      startShaking();
      // Repeat the shaking every 18 seconds (15 seconds pause + 3 seconds shaking)
      shakeInterval = setInterval(startShaking, 18000);
    }, 1000); // 20000 ms = 20 seconds
  
    return () => {
      clearTimeout(shakeTimeout); // Clear timeout on cleanup
      clearInterval(shakeInterval); // Clear interval on cleanup
    };
  }, [notificationsOpen]); // Depend on showPopup to re-run if it changes

  const handlePicChange = (newPicUrl) => {
    setUserPic(newPicUrl);
  };

  const toggleBinder = () => {
    setIsOpen(!isOpen);
    setNotificationsOpen(!notificationsOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleOpenNotification = () => {
    setNotificationsOpen(true);
  };


  return (
    <div className="flex items-center justify-center wrapper pb-10">
      <div>
        {/* Outer Container with Fixed Position */}
        <div className="fixed top-10 left-3 w-[700px] h-[100px]" style={{ zIndex: "1000" }}>
          <div className="flex items-center font-semibold text-[#5c62da] ml-10">
            {/* Logo and Binder Container */}
            <Link href="./welcome">
              <img
                src="../../assets/Logo.svg"
                className="w-28 h-28 cursor-pointer"
              />
            </Link>
            <div className="relative overflow-hidden -ml-2.5 mt-4 w-[calc(100%-7rem)] h-[100px]" style={{ zIndex: 900 }}>
              <div
                className={`absolute top-0 h-full transition-transform duration-300 ease-in-out ${
                  isOpen ? "translate-x-0" : "translate-x-[calc(-100%+15px)]"
                }`} style={{ zIndex: 900 }} // Lower z-index to avoid overlapping the button
              >
                <OriginalBinder2 className="h-full cursor-pointer"
                 onClick={toggleBinder} />
                  <div className='absolute top-4 left-2 flex items-center justify-center'>
                   <div className='w-12 h-12 bg-[#675E99]/60 rounded-xl flex items-center justify-center'>
                     <TbBell className='notification-bell text-white' size={32}  />
                   </div>
                 </div>
                <div className="absolute top-2 left-16 text-white" style={{ fontSize: 26, fontFamily: "Darker Grotesque", fontWeight: 500 }}>Reminder:</div>
                <span>{getDateEntry(day).title}</span>
                <div className="absolute top-9 left-16" style={{ fontSize: 20, fontFamily: "Darker Grotesque", fontWeight: 500 }}>Check out this entry today!</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Picture */}
        <div className="fixed top-12 right-16 w-[100px] h-[100px] z-50">
          <UserPic
            user={{ img: userPic, email: email, username: username }}
            onPicChange={handlePicChange}
          />
        </div>
      </div>

      {/* Navbar */}
      <div className="mt-14" style={{ zIndex: "1000" }}>
        <Navbar />
      </div>

      {/* Calendar */}
      <Calendar />
    </div>
  );
}
