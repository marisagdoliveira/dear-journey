"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import Close from "../../public/assets/Close.svg"
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays, startOfToday, isSameDay } from "date-fns";


import { IoChevronDownCircleOutline } from "react-icons/io5";

import Link from "next/link";
import { getSession } from "next-auth/react";
import SearchBarMini from "../components/SearchBarMini";
import Popup from "../components/Popup";
import { motion } from "framer-motion";


export default function Welcome() {
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [email, setEmail] = useState("");
  const [journalEntries, setJournalEntries] = useState([]); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    explanation: "",
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false); // state for submission success

  const [showSecondParagraph, setShowSecondParagraph] = useState(false);




  const [navbarIsOpen, setNavbarIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showPopupFromNotific, setShowPopupFromNotific] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  const [title1, setTitle1] = useState("");
  const [showSmallNotesCalendar, setShowSmallNotesCalendar] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [showAdditionalTitles, setShowAdditionalTitles] = useState(false); 
  const [userLibrary, setUserLibrary] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  const [count, setCount] = useState(1);
  




  const fetchTheReminder = () => {
    
    fetchUser();
  };

  const router = useRouter(); // router for redirection

  // Fetch user data
  const fetchUser = async () => {
    try {
      const session = await getSession();
      console.log(session)
      if (!session) router.push("/");
      const res = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`, {
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
      setFormData({
        username: data.user.username,
        email: data.user.email,
        description: "",
        explanation: "",
      });
      setUserLibrary(data.user.library);
      setNotifications(data.user.notifications);
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.replace("/"); // Redirect to login if not authenticated
    }
  };

  useEffect(() => {
    fetchUser(); // Call fetchUser inside useEffect
  }, []);

  const handlePicChange = (newPicUrl) => {
    setUserPic(newPicUrl);
  };



  const handleClosePopup = () => {
    setShowPopupFromNotific(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount < 5 ? prevCount + 1 : 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);



  const saveEntry = async (title, date, mainContent, smallNotes) => {
    console.log('Before saving2:', { title, email, date, mainContent, smallNotes });
    const formattedSmallNotes = smallNotes.map(note => typeof note === 'string' ? { content: note } : note);
    try {
      const response = await fetch('/api/register', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title:title, email, date:date, mainContent, smallNotes: formattedSmallNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry.');
      }

      const savedEntry = await response.json();

      console.log('Saved entry:', savedEntry);

      fetchUser();
    } catch (error) {
      console.error('Error saving journal entry: ', error);
    }
  };
    const handleEntryChange = (date, title, mainContent, smallNotes) => {
      const existingEntry = journalEntries.find(entry => new Date(entry.date).toISOString() === date.toISOString());
      if (existingEntry) {
        existingEntry.title = title;
        existingEntry.mainContent = mainContent;
        existingEntry.smallNotes = smallNotes; // Ensure this line correctly updates smallNotes
        saveEntry(title, date, mainContent, smallNotes);
      } else {
        const newEntry = { date, title, mainContent, smallNotes };
        setJournalEntries([...journalEntries, newEntry]);
        saveEntry(title, date, mainContent, smallNotes);
      }
      // setReminderTitle(title);
    };
  
    useEffect(() => {
      fetchTheReminder()
    }, [router]);
    

    useEffect(() => {
    setTimeout(() => {
      setShowSecondParagraph(true);
    }, 2000); // Second <p> appears after 2 seconds
  }, []);
  
  const textWelcome = "Welcome to Dear Journey,"; // The text to "type"



  return (
    <div className="flex flex-col wrapper pb-10 w-[100vw] pr-3 text-white no-resize">
      {/* ------------------------------------ Header Section -------------------------------------------------------------------- */}
      <div className="fixed top-10 left-3 w-[440px] h-[100px]" style={{ zIndex: 1000 }}>
        <div className="flex items-center ml-10">
          {/* Logo */}
          <Link href="./welcome">
            <img
              src="../../assets/Logo.svg"
              className="w-32 h-32 cursor-pointer"
              alt="Logo"
            />
          </Link>
        </div>
      </div>
  
      {/* ------------------------------------ Navbar Section ------------------------------------------------------------------------ */}
      <div className="fixed top-[240px] w-[440px]" style={{ zIndex: 1000 }}>
        <Navbar setNavbarIsOpen={setNavbarIsOpen} />
        <div className="absolute text-black top-[-58px] left-[50px] w-[200px]" style={{ zIndex: "1000" }}>
            <SearchBarMini setIsOpen={setIsOpen} session_email={email} setShowAdditionalTitles={setShowAdditionalTitles} userLibrary={userLibrary} 
            setShowPopup={setShowPopupFromNotific} setTitle1={setTitle1} setNoteDate={setNoteDate} setShowSmallNotesCalendar={setShowSmallNotesCalendar} setNoteContent={setNoteContent}
            />
        </div>
      </div>
  
      {/* User Picture */}
      <div className="fixed top-11 right-16 w-[120px] h-[120px] z-[10000000] sm:absolute sm:top-11 sm:right-1 sm:-translate-x-1/2">
        <UserPic
          user={{ img: userPic, email: email, username: username }} 
          onPicChange={handlePicChange}
        />
      </div>
  
      {/* Main Content */}
      <div className="overflow-y-auto sm:overflow-y-auto  overflow-x-hidden scroll-container">
        <div className="flex flex-col pl-80 mt-52 sm:pl-80 sm:mt-20 md:pl-[280px] lg:pl-[280px] ">
        {/* Typing Animation for h1 */}
        <motion.h1
          className="text-3xl"
          style={{ fontFamily: "Vogue, sans-serif", whiteSpace: "nowrap" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 5 }}
        >
          {textWelcome.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }} // Creates a typing effect
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* First paragraph - fades in and stays */}
        <motion.div
          className="w-full flex mt-5 justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
        >
          <p
            className="w-full sm:w-[700px] text-md text-left pr-10"
            style={{ fontFamily: "Darker Grotesque", fontWeight: "500" }}
          >
            Discover a unique journaling experience designed with your mental health in mind. Our app offers innovative features to help you effortlessly track and reflect on your thoughts and experiences over time.
          </p>
        </motion.div>

        {/* Second paragraph - appears after a delay */}
        <motion.div
          className="w-full mt-5 flex justify-end"
          initial={{ opacity: 0 }}
          animate={showSecondParagraph ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 1.3 }}
        >
          <p
            className="w-full sm:w-[700px] text-md text-right pr-10"
            style={{ fontFamily: "Darker Grotesque", fontWeight: "500" }}
          >
            With Dear Journey, you'll gain insights into your emotional well-being, make mindful observations, and enjoy a smoother, more intuitive journaling process. Start your journey towards greater self-awareness and mental clarity today!
          </p>
        </motion.div>

        <div className="flex pl-14 pr-3 text-2xl w-[100%] ">
            <p className="text-[#6464D3]" style={{ fontFamily: 'Darker Grotesque', fontWeight: '550' }}>Dear Journey offers you ...</p></div>
            <div className="flex flex-row flex-wrap gap-7 items-end w-fit pl-20 ">
            
                <div className="w-[40%] h-[45vh] min-w-[350px]  border border-white/45 -ml-10 rounded-3xl flex justify-center mt-5 items-end">
                </div>
                <div className="w-[50%] min-w-[350px] text-lg pr-10" style={{ fontFamily: "Darker Grotesque", fontWeight: "500" }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex flex-row">
                        <div className="w-[40px] mr-5 relative">
                          <span
                            className={`text-3xl absolute top-3 fadedCountWelcome ${
                              count === num ? "fadeIn" : "fadeOut"
                            }`}
                            style={{ fontFamily: "Vogue", fontWeight: "700" }}
                          >
                            {num}.
                          </span>
                        </div>
                        <p className={`mb-2 mr-5 transition-all duration-500 ${count === num ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" : "text-[#ebebeb] opacity-90"}`}>

                          <span className={`text-[#6464D3] ${count === num ? "opacity-100" : " opacity-90"}`} style={{ fontWeight: "600" }}>
                            {num === 1 && "Seamless Access: "}
                            {num === 2 && "Effortless Entries: "}
                            {num === 3 && "Insightful Notes: "}
                            {num === 4 && "Custom Notifications: "}
                            {num === 5 && "AI-Driven Guidance: "}
                          </span>
                          {num === 1 && "register your account to access your journal from anywhere, anytime. Your reflections are always within reach."}
                          {num === 2 && "write daily entries and edit them whenever you like. Capture your thoughts and experiences as they come."}
                          {num === 3 && "add comments to your entries to highlight key insights and track your personal growth over time."}
                          {num === 4 && "set up personalized notifications to remind you to revisit and revise specific topics whenever you choose."}
                          {num === 5 && "receive thoughtful advice from our AI bot expert. Navigate your thoughts and feelings with a proactive, hands-on approach."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </div>


          {showPopupFromNotific && (
            
            <div className="fixed inset-0" style={{ zIndex: 1000000 }}>  {/* zIndex em tailwind só vai até 100 - acima de 100 tem de ser no style */}
              <div className="overlay_blur"></div>
              <div className="popup border border-white/45 z-40 ">
                <div className="popup-content flex flex-col justify-center items-center relative">
                  <div className="flex w-full justify-end items-end">
                    <button className="close-button self-end pr-2 top-5 absolute" onClick={() => handleClosePopup()}>
                      <Close />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer"><Calenleft /></p>
                     <Popup
                      noteDate={noteDate}
                      showPopupFromNotific={showPopupFromNotific}
                      
                      onSave={handleEntryChange}
                      setTitle1={setTitle1}
                      fetchUser={fetchUser}
                      showSmallNotesCalendar={showSmallNotesCalendar}
                      setShowSmallNotesCalendar={setShowSmallNotesCalendar}
                      fetchTheReminder={fetchTheReminder}
                    />
                  <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
              </div>
          </div>
        </div>
      </div>
       )}
      </div>
      </div>

  );
}
