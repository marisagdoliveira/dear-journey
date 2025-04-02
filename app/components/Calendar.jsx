import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import { useCapitalizeFirstLetter } from '../hooks/useCapitalizeFirstLetter';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays, startOfToday, isSameDay } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import Popup from "./Popup";
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import Close from "../../public/assets/Close.svg"
import PlusIcon from "../../public/assets/PlusIcon.svg"
import MiniBell from "../../public/assets/MiniBell.svg"




import CalendarContainerOriginal from "../../public/assets/CalendarContainerOriginal.svg"
import TodayCalendarContainerPurp from "../../public/assets/TodayCalendarContainerPurp.svg"
import { useReminder } from "@/context/ReminderContext";
import { motion } from "framer-motion";



export default function Calendar({  setShowAdditionalTitles, setUserLibrary, noteDate, setNoteDate, showSmallNotesCalendar, setShowSmallNotesCalendar, setReminderTitle,setShowPopup,showPopup, title1, noteContent, handleReminderSave, showPopupReminder, setShowPopupReminder, showPopupReminderDate, session_email}) {

 
  //const { data: session, status } = getSession(); // Valid usage of hook inside a component
  //console.log("calendar props: ", {  noteContent, title1 });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState([]);
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  
  
  
  const [notifications, setNotifications] = useState([])

    const [aiOutput, setAiOutput] = useState(false);
  

  



  const fetchTheReminder = useReminder();
 
  
  
  useCapitalizeFirstLetter(); 


  const closePopup = () => {
    setShowPopup(false)
    setShowSmallNotesCalendar(false)
    fetchUserAndJournalEntries()
  }
  const openPopupWithSmallNotes = (date) => {
    setShowPopup(true); setNoteDate(date);
    setShowSmallNotesCalendar(true)
  }


  

  useEffect(() => {
    fetchUserAndJournalEntries();
  }, [currentMonth, title]);
  
  useEffect(() => {
    if (showPopupReminder) {
      setNoteDate(new Date(showPopupReminderDate));
      setShowPopup(true);
      setShowPopupReminder(false);
    };
  });

  // const fetchUserAndJournalEntries = async () => {
  //   const fetchUser = async () => {
  //     if (status === "loading") return; // Skip if loading
  //     const { session: session } = getSession(); // Get session data from NextAuth
      
  //     if (!session) {
  //       console.log("User not authenticated");
  //       return; // Exit if no session (user not authenticated)
  //     }

  //     const email = session.user.email;
  //     console.log("Email from session:", email);  // Log the email to confirm it's being retrieved


  
  //     try {

  //       // Ensure email is passed correctly in the URL

      
        
  //       const res = await fetch(`/api/user?email=${session.user.email}`, { method: "GET" });

  
  //       if (res.ok) {
  //         const data = await res.json();
  
  //         // Store the user data (email and journal entries)
  //         setEmail(data.user.email);
  //         setJournalEntries(data.user.library);
  
  //         console.log("Journal entries:", data.user.library);
  //       } else {
  //         throw new Error("Failed to fetch user data.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data: ", error);
  //     }
  //   };
  
  //   // Call the fetchUser function to trigger the data fetching
  //   fetchUser();
  // };

  const fetchUserAndJournalEntries = async () => {
    try {
      const session = await getSession();
      console.log("Session:", session);
  
      if (!session || !session.user?.email) {
        console.error("User not authenticated");
        return; // Exit if no session
      }
  
      const email = session.user.email;
      console.log("Email from session:", email);
  
      const res = await fetch(`/api/user?email=${session.user.email}`, { method: "GET" });
  
      if (!res.ok) {
        const error = await res.text(); // Capture error message
        console.error("API Error:", error);
        throw new Error("Failed to fetch user data.");
      }
  
      const data = await res.json();
  
      // Set the user email and journal entries
      setEmail(data.user.email);
      setJournalEntries(data.user.library);
      setNotifications(data.user.notifications);
      setUserLibrary(data.user.library);
      console.log("Notifications:", notifications);
      console.log("Notifications:", data.user.notifications);
  
      console.log("Journal entries:", data.user.library);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

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

      fetchUserAndJournalEntries();
    } catch (error) {
      console.error('Error saving journal entry: ', error);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  //const handleEntryChange = (date, mainContent, smallNotes) => {
  //  const existingEntry = journalEntries.find(entry => new Date(entry.date).toISOString() === date.toISOString());
  //  if (existingEntry) {
  //    existingEntry.mainContent = mainContent;
  //    existingEntry.smallNotes = smallNotes;
  //    saveEntry(date, mainContent, smallNotes);
  //  } else {
  //    const newEntry = { date, mainContent, smallNotes };
  //    setJournalEntries([...journalEntries, newEntry]);
  //    saveEntry(date, mainContent, smallNotes);
  //  }
  //};

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



 

  const getDateEntry = (date) => {
    return journalEntries.find(entry => new Date(entry.date).toISOString() === date.toISOString()) || { mainContent: '', smallNotes: [] };
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });


  // function to highlight todays's day on calendar vs the other days:
  const today = startOfToday(); // Get today's date 



  return (
     <div className="flex flex-col items-center w-full  p-4 pt-36"> {/* <------------------ LINHA ALTERADA, ATUALIZAR NO ORIGINAL!!!!--------*/ }
       <motion.div
         
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 2, ease: "easeInOut" }}
       
        className="flex justify-between w-full  max-w-xl mb-7">
         <motion.button whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }} className="text-white darker-grotesque-main" onClick={prevMonth}> <Calenleft /> </motion.button>
         <motion.h2
          key={currentMonth}
          initial={{ y: 0, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.4, ease: "easeIn" }}
          className="text-white/20 text-5xl font-semibold tracking-widest" style={{ fontFamily: 'Darker Grotesque', WebkitTextStroke: '0.9px white' }}>{format(currentMonth, 'MMMM yyyy')}</motion.h2>
         <motion.button whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }} className="text-white darker-grotesque-main" onClick={nextMonth}> <Calenright /> </motion.button>
       </motion.div>
   
       {/* Container for calendar and overlay */}
       <motion.div
        
        initial={{ y: 100, opacity: 1 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeInOut" }}
       
        className={`relative flex flex-wrap  max-w-[1100px] min-w-[1100px] justify-center items-center gap-2 ${showPopup ? 'blurred' : ''}`} style={{ fontFamily: 'Darker Grotesque' }}>
        {daysInMonth.map((day, index) => {
        const entry = getDateEntry(day);
        const isToday = isSameDay(day, today); // Check if the day is today
        const isNotificationDate = notifications.some(
          (notification) => new Date(notification.noticeDate).toDateString() === day.toDateString()
        ); // Check if the day has notifications
    
         return (
           <div key={index} className="relative w-32 h-32 flex items-center justify-center"> {/* Increased size of the container */}
             {/* Conditional rendering of CalendarContainer or TodayCalendarContainer */}
             {isToday ? (
               <TodayCalendarContainerPurp className="pulsingToday absolute  w-full h-full z-10 pointer-events-none" style={{ transform: 'scale(1.05)'
            
              }} />
             ) : (
               <CalendarContainerOriginal className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
             )}

             {/* Date (top-right) */}
             <span className="absolute top-5 right-5 text-md text-white z-20" style={{ fontFamily: 'Darker Grotesque', fontSize: 20, fontWeight: 700 }}>
               {format(day, 'd')}
             </span>

             {/* Title (centered, truncates if too long) */}
            
             {entry.title? 
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] text-center text-[#fefefe] overflow-hidden text-ellipsis whitespace-nowrap z-20 cursor-pointer" title="Entry" onClick={() => { setShowPopup(true); setNoteDate(day); setShowAdditionalTitles(false); }} style={{ top: 'calc(50% - 2px)', fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
              {entry.title}
           </div>
             : 
             <div className="absolute w-28 h-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] text-center text-[#fefefe] overflow-hidden text-ellipsis whitespace-nowrap z-20 cursor-pointer" onClick={() => { setShowPopup(true); setNoteDate(day); setShowAdditionalTitles(false); }} style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>

             </div>
              }
            {/* Notification bell (if any) */}
            {isNotificationDate && (
              <p className="fa fa-bell notification-bell absolute top-[85px] right-[17px] text-[#6769b1] text-[20px] z-30 pointer-events-none" style={{ strokeWidth: 10 }}
                >
                  <MiniBell /> 
              </p>
            )}

             {/* Small notes indicator (bottom-right) */}
             <div onClick={() => { openPopupWithSmallNotes(day); setShowAdditionalTitles(false); }} className="absolute bottom-6 left-4 w-5 h-5 bg-[#ccc4ff90] border-[#ffffffdf]/60 border-[1.5px] text-[#6464D3] rounded-full flex justify-center items-center text-xs cursor-pointer z-20" title="Notes" style={{ fontWeight: 700 }}>
               {entry.smallNotes.length}
             </div>

             {/* Plus icon (top-left) */}
             <button className="absolute top-6 left-4 text-white text-2xl z-20" onClick={() => { setShowPopup(true); setNoteDate(day); }}>
               <PlusIcon className="text-white text-2xl text-[#dcd6ff]" />
             </button>
           </div>
         );
      }
    )}
   </motion.div>
  
      {showPopup && (
        <div className="fixed inset-0" style={{ zIndex: 10000000 }}>  {/* zIndex em tailwind só vai até 100 - acima de 100 tem de ser no style */}
          <div className="overlay_blur"></div>
          <div className="popup border border-white/45 z-40 ">
            <div className="popup-content flex flex-col justify-center items-center relative">
              <div className="flex w-full justify-end items-end">
                <motion.button whileTap={{ scale: 0.9 }}  className="close-button self-end pr-2 top-5 absolute transform transition-transform duration-150 hover:scale-105" onClick={() => closePopup()}>
                  <Close />
                </motion.button>
              </div>
              <div className="flex items-center">
                <motion.p
                  whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => {setNoteDate(subDays(noteDate, 1)); 
                  
                  }} className="pr-4 cursor-pointer "><Calenleft /></motion.p>
                <Popup aiOutput={aiOutput} setAiOutput={setAiOutput} setShowAdditionalTitles={setShowAdditionalTitles} email={email} noteContent={noteContent} title1={title1}  fetchTheReminder={fetchTheReminder} showPopup={showPopup} setShowPopup={setShowPopup} setTitle1={setTitle} getDateEntry={getDateEntry} session_email={email} noteDate={noteDate} onSave={handleEntryChange} showSmallNotesCalendar={showSmallNotesCalendar} setShowSmallNotesCalendar={setShowSmallNotesCalendar} fetchUser={fetchUserAndJournalEntries} onReminderSave={handleReminderSave} setShowPopupReminder={setShowPopupReminder} />
                <motion.p whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300 }} onClick={() => {setNoteDate(addDays(noteDate, 1)); 
                  
                  }} className="pl-4 cursor-pointer "><Calenright /></motion.p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

