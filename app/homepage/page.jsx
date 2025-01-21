"use client";
import { getSession } from "next-auth/react"; // Import getSession for server-side session handling
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar"; // Import the SearchBar
import UserPic from "../components/UserPic";
import Link from 'next/link';
import OriginalBinder2 from "../../public/assets/OriginalBinder2.svg"
import ScrollRight from "../../public/assets/ScrollRight.svg"
import { TbBell } from "react-icons/tb";
import TbBell2 from "../../public/assets/TbBell2.svg"
import FirstArrow from "../../public/assets/FirstArrow.svg"
import SecondArrow from "../../public/assets/SecondArrow.svg"




export default function Homepage() {
  const [reminderTitle, setReminderTitle] = useState("");  // New state for the reminder title
  const [additionalReminderTitlesToday, setAdditionalReminderTitlesToday] = useState([]); // State for additional reminder titles

  const [userLibrary, setUserLibrary] = useState(null);
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reminderTitleToday, setReminderTitleToday] = useState(false);
  const [showAdditionalTitles, setShowAdditionalTitles] = useState(false); // New state for showing additional titles
  const [showPopupReminder, setShowPopupReminder] = useState(false);
  const [showPopupReminderDate, setShowPopupReminderDate] = useState("");
  const [additionalTitlesDates, setAdditionalTitlesDates] = useState([]);
  const [reminderTitleDate, setReminderTitleDate] = useState([]);
  const [navbarIsOpen, setNavbarIsOpen] = useState(false);

  
  

  const router = useRouter();

 

  
  // Fetch user data to confirm authentication - BEFORE USERPIC LOGIC:
  useEffect(() => {
    fetchTheReminder()
  }, [router]);
  


  const fetchTheReminder = () => {
    const fetchUser = async () => {
      try {

      const session = await getSession();
      console.log("Session:", session);
    
      if (!session || !session.user?.email) {
        console.error("User not authenticated");
        router.replace("/");
        return; // Exit if no session
      }

    
      
        
      const res = await fetch(`/api/user?email=${session.user.email}`, { method: "GET" });

        if (!res.ok) throw new Error("Network response was not ok");
  
        const data = await res.json();
        if (!data.user.username) throw new Error("User not authenticated");
  
        setUsername(data.user.username);
        setUserPic(data.user.img || null);
        setEmail(data.user.email);
        setNotifications(data.user.notifications);
        console.log("AQUI AS NOTIFI!!!!", data.user.notifications)
        setUserLibrary(data.user.library);
  
        if (data.user.notifications.length > 0) {
          const today = new Date();
          const isSameDay = (date1, date2) =>
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
  
          let reminderTitle = "";
          let additionalTitles = [];
          let popupDateSet = false;
          const newAdditionalTitlesDates = []; // Temporary array to accumulate dates
  
          for (const notification of data.user.notifications) {
            const noticeDate = new Date(notification.noticeDate);
  
            if (isSameDay(today, noticeDate)) {
              const correspondingEntry = data.user.library.find(entry =>
                isSameDay(new Date(entry.date), new Date(notification.noteDate))
              );
  
              if (correspondingEntry) {
                // Push the `noteDate` to the array for today's notifications
                newAdditionalTitlesDates.push(notification.noteDate);
  
                if (!popupDateSet) {
                  setShowPopupReminderDate(notification.noteDate);
                  popupDateSet = true;
                }
  
                if (reminderTitle === "") {
                  reminderTitle = correspondingEntry.title || new Date(notification.noteDate).toLocaleDateString();
                  setReminderTitleDate(notification.noteDate)
                  setReminderTitleToday(true);
                } else {
                  additionalTitles.push(correspondingEntry.title || new Date(notification.noteDate).toLocaleDateString());
                }
  
                setIsOpen(true);
              } else {
                setReminderTitleToday(false);
              }
            }
          }
  
          if (!reminderTitle) console.log("No notification for today.");
  
          const MAX_TITLE_LENGTH = 10;
          const truncatedTitle = reminderTitle.length > MAX_TITLE_LENGTH
            ? reminderTitle.substring(0, MAX_TITLE_LENGTH) + '...'
            : reminderTitle;
  
          setReminderTitle(truncatedTitle);
          console.log("REMINDER TITLE", reminderTitle)
  
          const truncatedAdditionalTitles = additionalTitles.map(title =>
            title.length > MAX_TITLE_LENGTH ? title.substring(0, MAX_TITLE_LENGTH) + '...' : title
          );
  
          setAdditionalReminderTitlesToday(truncatedAdditionalTitles);
          setAdditionalTitlesDates(newAdditionalTitlesDates); // Set all dates at once
  
        } else {
          console.log("No notifications available.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  };
  
  useEffect(() => { // --------------- NEW!!!! -----------------------------------------------------------
    if (!isOpen) {
      setShowAdditionalTitles(false); // Automatically close additional titles when binder is closed
    }
  }, [isOpen]);
  

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

 //if (loading) {
 //  return <div>Loading...</div>; <----------------- This was making the black loading screen!! DO NOT INCLUDE -------------
 //}


  return (
    <div className="flex items-center justify-center wrapper pb-10">
  <div>
    {/* SearchBar at Top Center */}
    <div className="absolute text-black top-[41px] left-[600px] " style={{ zIndex: "1000" }}>
      <SearchBar setIsOpen={setIsOpen}  setShowAdditionalTitles={setShowAdditionalTitles} userLibrary={userLibrary} />
    </div>

    {/* Outer Container with Fixed Position */}
    <div className="fixed top-10 left-3 w-[440px] h-[100px]" style={{ zIndex: "0" }}>
      <div className="flex items-center font-semibold text-[#5c62da] ml-10">
        {/* Logo and Binder Container */}
        <Link href="./welcome">
          <img
            src="../../assets/Logo.svg"
            className="w-28 h-28 cursor-pointer"
          />
        </Link>
        {reminderTitleToday && (
          <div className="relative overflow-hidden -ml-[10.1px] mt-4 w-[calc(100%-7rem)] h-[100px]" style={{ zIndex: 800 }}>
            <div
              className={`absolute top-0 h-full transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "translate-x-[calc(-100%+15px)]"
              }`} style={{ zIndex: 900 }}
            >
              <OriginalBinder2 className="h-full cursor-pointer"
                onClick={toggleBinder} />
              <div className="absolute top-4 left-2 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#675E99]/60 rounded-xl flex items-center justify-center">
                  <TbBell className="notification-bell text-white cursor-none" size={34} />
                </div>
              </div>
              <div className="absolute top-3 left-16 text-white" style={{
                fontSize: 22, fontFamily: "Darker Grotesque", fontWeight: 500 }}>
                Reminder:
              </div>
              <div className="absolute top-[12px] left-[150px] flex items-center">
                <span
                  className="underline decoration-1 underline-offset-2 cursor-pointer"
                  style={{ fontSize: 22, fontFamily: "Darker Grotesque", fontWeight: 500 }}
                  onClick={async () => {
                    await fetchTheReminder();
                    setShowPopupReminderDate(reminderTitleDate);
                    setShowPopupReminder(true);
                    setShowAdditionalTitles(false);
                
                  }}
                >
                  {reminderTitle}
                </span>
                {additionalReminderTitlesToday.length > 0 && (
                  <p
                    className="absolute top-12 left-[99px] bg-[#938ef8] w-6 h-6 pr-0.5 pb-1 rounded-full shadow-sm shadow-[#4c4963] flex justify-center items-center text-xs text-[#fff] cursor-pointer"
                    onClick={() => setShowAdditionalTitles(!showAdditionalTitles)}
                    style={{ fontSize: 16, fontFamily: "Darker Grotesque", fontWeight: 700, }}
                  >
                    +{additionalReminderTitlesToday.length}
                  </p>
                )}
              </div>
              <div className="absolute top-10 left-16" style={{
                fontSize: 18, fontFamily: "Darker Grotesque", fontWeight: 500 }}>
                Check out this entry today!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    {/* Mini popup for additional titles -----------------------------------------------------------------------------  */}
    {showAdditionalTitles && (
      <div className="max-w-[160px] absolute top-[138px] left-[225px]  scroll-container-notific overflow-auto">
        <div className="flex flex-row pt-1.5 gap-1 w-fit justify-end pb-1" style={{ zIndex: 100000, fontFamily: "Darker Grotesque", whiteSpace: "nowrap" }}>
        {additionalReminderTitlesToday.map((title, index) => (
          <div key={index} className="flex-shrink-0 text-sm justify-center items-center bg-[#938ef8] shadow-md shadow-[#4c496345] text-white p-1.5 mb-1 rounded-xl cursor-pointer"
          style={{ fontWeight: 550 }}
          onClick={() => {
            setShowPopupReminder(true);
            setShowAdditionalTitles(false);

          
            
            setShowPopupReminderDate(additionalTitlesDates[index+1]);
            console.log("THIIIIIISSSS ----------> ", additionalTitlesDates)
          }}>
            {title}
          </div>
        ))}</div>

      </div>
    )}
     {additionalReminderTitlesToday.length > 3 && showAdditionalTitles && (
      <div className="arrow-container absolute top-[263px] right-[33px]" style={{ zIndex: 1000000000 }}>
      <div className="moving-arrow-wrapper">
        <svg width="8" height="19" viewBox="0 0 31 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.93257 59C1.44232 59 0.940603 58.802 0.564362 58.4175C-0.188121 57.6486 -0.188121 56.3905 0.564362 55.6216L26.3198 29.3049L0.9406 3.37259C0.188118 2.60371 0.188118 1.34554 0.9406 0.57666C1.69308 -0.192222 2.92442 -0.192222 3.6769 0.57666L30.4356 27.9069C31.1881 28.6758 31.1881 29.934 30.4356 30.7028L3.31207 58.4175C2.92442 58.8136 2.43422 59 1.93257 59Z" fill="white"/>
        </svg>
      </div>
      <div className="moving-arrow-fixed-wrapper">
        <svg width="8" height="19" viewBox="0 0 31 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.93257 59C1.44232 59 0.940603 58.802 0.564362 58.4175C-0.188121 57.6486 -0.188121 56.3905 0.564362 55.6216L26.3198 29.3049L0.9406 3.37259C0.188118 2.60371 0.188118 1.34554 0.9406 0.57666C1.69308 -0.192222 2.92442 -0.192222 3.6769 0.57666L30.4356 27.9069C31.1881 28.6758 31.1881 29.934 30.4356 30.7028L3.31207 58.4175C2.92442 58.8136 2.43422 59 1.93257 59Z" fill="white"/>
        </svg>
      </div>
    </div>
    )}
       

    {/* User Picture */}
    <div className="fixed top-12 right-16 w-[100px] h-[100px] z-[1000000000000000000]">
      <UserPic
        user={{ img: userPic, email: email, username: username }}
        onPicChange={handlePicChange}
      />
    </div>
  </div>

  {/* Navbar */}
  <div className="mt-24" style={{ zIndex: "100000000000" }}>
    <Navbar setNavbarIsOpen={setNavbarIsOpen} fetchTheReminder={fetchTheReminder} />
  </div>

  {/* Calendar */}
  <Calendar
    className="pt-10"
    
    setShowAdditionalTitles={setShowAdditionalTitles}
    setReminderTitle={setReminderTitle}
    fetchTheReminder={fetchTheReminder}
    showPopupReminder={showPopupReminder}
    setShowPopupReminder={setShowPopupReminder}
    showPopupReminderDate={showPopupReminderDate}
  />
</div>
  );
}