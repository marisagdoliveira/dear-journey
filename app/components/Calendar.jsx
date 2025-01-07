import { useState, useEffect } from "react";
import { useCapitalizeFirstLetter } from '../hooks/useCapitalizeFirstLetter';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays, startOfToday, isSameDay } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import Popup from "./Popup";
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import Close from "../../public/assets/Close.svg"
import PlusIcon from "../../public/assets/PlusIcon.svg"
import CalendarContainerOriginal from "../../public/assets/CalendarContainerOriginal.svg"
import TodayCalendarContainerPurp from "../../public/assets/TodayCalendarContainerPurp.svg"

export default function Calendar({ setReminderTitle, handleReminderSave, fetchTheReminder, showPopupReminder, setShowPopupReminder, showPopupReminderDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState([]);
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showSmallNotesCalendar, setShowSmallNotesCalendar] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  
  
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

  const fetchUserAndJournalEntries = async () => {
    try {
      const response = await fetch(`/api/user`);
      if (response.ok) {
        const data = await response.json();
        setEmail(data.user.email);
        setJournalEntries(data.user.library);
        console.log('Journal entries:', journalEntries);


      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
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
     <div className="flex flex-col items-center w-full p-4 pt-36"> {/* <------------------ LINHA ALTERADA, ATUALIZAR NO ORIGINAL!!!!--------*/ }
       <div className="flex justify-between w-full max-w-xl mb-7">
         <button className="text-white darker-grotesque-main" onClick={prevMonth}> <Calenleft /> </button>
         <h2 className="text-white/20 text-5xl font-semibold tracking-widest" style={{ fontFamily: 'Darker Grotesque', WebkitTextStroke: '0.9px white' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
         <button className="text-white darker-grotesque-main" onClick={nextMonth}> <Calenright /> </button>
       </div>
   
       {/* Container for calendar and overlay */}
       <div className={`relative flex flex-wrap max-w-[1100px] justify-center items-center gap-2 ${showPopup ? 'blurred' : ''}`} style={{ fontFamily: 'Darker Grotesque' }}>
        {daysInMonth.map((day, index) => {
        const entry = getDateEntry(day);
        const isToday = isSameDay(day, today); // Check if the day is today
    
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
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] text-center text-[#fefefe] overflow-hidden text-ellipsis whitespace-nowrap z-20 cursor-pointer" onClick={() => { setShowPopup(true); setNoteDate(day); }} style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
              {entry.title}
           </div>
             : 
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] text-center text-[#fefefe] overflow-hidden text-ellipsis whitespace-nowrap z-20" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>

             </div>
              }
             {/* Small notes indicator (bottom-right) */}
             <div onClick={() => openPopupWithSmallNotes(day)} className="absolute bottom-6 left-4 w-5 h-5 bg-[#ccc4ff90] border-[#ffffffdf]/60 border-[1.5px] text-[#6464D3] rounded-full flex justify-center items-center text-xs cursor-pointer z-20" style={{ fontWeight: 700 }}>
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
   </div>
  
      {showPopup && (
        <div className="fixed inset-0" style={{ zIndex: 1000000 }}>  {/* zIndex em tailwind só vai até 100 - acima de 100 tem de ser no style */}
          <div className="overlay_blur"></div>
          <div className="popup border border-white/45 z-40 ">
            <div className="popup-content flex flex-col justify-center items-center relative">
              <div className="flex w-full justify-end items-end">
                <button className="close-button self-end pr-2 top-5 absolute" onClick={() => closePopup()}>
                  <Close />
                </button>
              </div>
              <div className="flex items-center">
                <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer"><Calenleft /></p>
                <Popup fetchTheReminder={fetchTheReminder} showPopup={showPopup} setShowPopup={setShowPopup} setTitle1={setTitle} getDateEntry={getDateEntry} email={email} noteDate={noteDate} onSave={handleEntryChange} showSmallNotesCalendar={showSmallNotesCalendar} setShowSmallNotesCalendar={setShowSmallNotesCalendar} fetchUser={fetchUserAndJournalEntries} onReminderSave={handleReminderSave} setShowPopupReminder={setShowPopupReminder} />
                <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

