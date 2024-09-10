"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import Link from 'next/link';
import OriginalBinder2 from "../../public/assets/OriginalBinder2.svg"
import { TbBell } from "react-icons/tb";
import TbBell2 from "../../public/assets/TbBell2.svg"




export default function Homepage() {
  const [reminderTitle, setReminderTitle] = useState("");  // New state for the reminder title

  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reminderTitleToday, setReminderTitleToday] = useState(false);

  const router = useRouter();

// Fetch user data to confirm authentication - BEFORE USERPIC LOGIC:
useEffect(() => {
  fetchTheReminder()
}, [router]);

const fetchTheReminder = () => {
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
      setUserPic(data.user.img || null);
      setEmail(data.user.email);
      setNotifications(data.user.notifications);

      console.log("Notifications received: ", data.user.notifications);

      if (data.user.notifications.length > 0) {
        const today = new Date();

        // Helper function to check if two dates are the same day
        const isSameDay = (date1, date2) => {
          return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
          );
        };

        let reminderTitle = "";

        // Loop through all notifications
        for (const notification of data.user.notifications) {
          const noticeDate = new Date(notification.noticeDate);
          console.log("Checking Notification: ", notification);

          if (isSameDay(today, noticeDate)) {
            const correspondingEntry = data.user.library.find(entry =>
              isSameDay(new Date(entry.date), new Date(notification.noteDate))
            );

            if (correspondingEntry) {
              reminderTitle = correspondingEntry.title || new Date(notification.noteDate).toLocaleDateString(); // atualizado
              // depois de existir notifiação no frontend:
              setIsOpen(true); // comentar esta linha p toggle manual
              setReminderTitleToday(true);
              console.log("Reminder title set to: ", reminderTitle);
              break; // Exit the loop once we find a match for today
            } else {
              console.log("No corresponding entry found for notification:", notification);
              setReminderTitleToday(false)
            }
          }
        }

        if (!reminderTitle) {
          console.log("No notification for today.");
        }

        setReminderTitle(reminderTitle);
        console.log("Final reminder title: ", reminderTitle);
      } else {
        console.log("No notifications available.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.replace("/"); // Redirect to login if not authenticated
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
};



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


  return (
    <div className="flex items-center justify-center wrapper pb-10">
    <div>
      {/* Outer Container with Fixed Position */}
      <div className="fixed top-10 left-3 w-[440px] h-[100px]" style={{ zIndex: "1000" }}>
        <div className="flex items-center font-semibold text-[#5c62da] ml-10">
          {/* Logo and Binder Container */}
          <Link href="./welcome">
            <img
              src="../../assets/Logo.svg"
              className="w-28 h-28 cursor-pointer"
            />
          </Link>
          {reminderTitleToday && (
          <div className="relative overflow-hidden -ml-[10.1px] mt-4 w-[calc(100%-7rem)] h-[100px]" style={{ zIndex: 900 }}>
            <div
              className={`absolute top-0 h-full transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "translate-x-[calc(-100%+15px)]"
              }`} style={{ zIndex: 900 }} // Lower z-index to avoid overlapping the button
            >
              <OriginalBinder2 className="h-full cursor-pointer"
               onClick={toggleBinder} />
                <div className='absolute top-4 left-2 flex items-center justify-center'>
                 <div className='w-12 h-12 bg-[#675E99]/60 rounded-xl flex items-center justify-center'>
                   <TbBell className='notification-bell text-white cursor-none' size={34}  />
                 </div>
               </div>
              <div className="absolute top-2 left-16 text-white" style={{ fontSize: 26, fontFamily: "Darker Grotesque",
               fontWeight: 500 }}>Reminder:</div>
              <span className="absolute top-[13px] left-[166px] underline  decoration-1 underline-offset-2"style={{ fontSize: 21, fontFamily: "Darker Grotesque",
               fontWeight: 500 }}>{reminderTitle}</span>
              <div className="absolute top-10 left-16" style={{ fontSize: 18, fontFamily: "Darker Grotesque",
               fontWeight: 500 }}>Check out this entry today!</div>
            </div>
          </div>
          )}
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
    <Calendar setReminderTitle={setReminderTitle}  fetchTheReminder={fetchTheReminder} />
  </div>
  );
}
