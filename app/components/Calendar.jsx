import { useState, useEffect } from "react";
import { useCapitalizeFirstLetter } from '../hooks/useCapitalizeFirstLetter';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import Popup from "./Popup";
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import Close from "../../public/assets/Close.svg"
import PlusIcon from "../../public/assets/PlusIcon.svg"

export default function Calendar({ setReminderTitle, handleReminderSave, fetchTheReminder }) {
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
  
  //useEffect(() => {
  //  fetchUserAndJournalEntries();
  //}, [title]);

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

  

  return (
    <div className="flex flex-col items-center w-full p-4 pt-28">
      <div className="flex justify-between w-full max-w-xl mb-7">
        <button className="text-white darker-grotesque-main" onClick={prevMonth}> <Calenleft /> </button>
        <h2 className="text-white/20 text-5xl font-semibold tracking-widest" style={{ fontFamily: 'Darker Grotesque', WebkitTextStroke: '0.9px white' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button className="text-white darker-grotesque-main" onClick={nextMonth}> <Calenright /> </button>
      </div>
      
      <div className="flex flex-wrap max-w-[1100px] max-h-[40%] justify-center items-center gap-4 " style={{fontFamily: 'Darker Grotesque', }}>
        {daysInMonth.map((day, index) => {
          const entry = getDateEntry(day);
          return (
            
            <div key={index} className="relative flex flex-col w-28 h-28 p-2 rounded-[35px] bg-[#dacdff24] border border-white/33" >
              <div>
                <span className="flex p-0.5 text-md text-white justify-end pr-1" style={{ fontFamily: 'Darker Grotesque', fontSize: 20, fontWeight: 700 }}>{format(day, 'd')}</span>
              </div>
              <div className="max-w-[20ch] overflow-hidden text-ellipsis text-[#6464D3] text-[#fefefe] whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>{getDateEntry(day).title}</div>
              <div onClick={() => openPopupWithSmallNotes(day)} className="absolute border-[1.5px] w-5 h-5 bottom-3 right-3.5 text-[#6464D3] border-[#ffffffdf] bg-[#ccc4ff90] rounded-full flex justify-center align-center text-xs cursor-pointer" style={{ fontWeight: 700 }}>{ getDateEntry(day).smallNotes.length }</div>
              <button
                className="text-white mt-auto"
                // onClick={() => setShowAddNoteInput(true)}
                onClick={() => { setShowPopup(true); setNoteDate(day); }}
              >
                <PlusIcon className="absolute top-3 left-4 text-white text-2xl text-[#dcd6ff]" />
              </button>
            </div>
          );
        })}
      </div>
      {showPopup && (
        <div>
          <div className="overlay_blur"></div>
        <div className="popup border border-white/45">
          <div className="popup-content flex flex-col justify-center items-center relative">
            <div className="flex w-full justify-end items-end">
              <button className="close-button self-end pr-2 top-5 absolute" onClick={() => closePopup()}>
                <Close />
              </button>
            </div>
            <div className="flex items-center">
              <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer" ><Calenleft /></p>
              <Popup fetchTheReminder={fetchTheReminder} showPopup={showPopup} setTitle1={setTitle}  getDateEntry={getDateEntry} email={email} noteDate={noteDate} onSave={handleEntryChange} showSmallNotesCalendar={showSmallNotesCalendar} setShowSmallNotesCalendar={setShowSmallNotesCalendar} fetchUser={fetchUserAndJournalEntries} onReminderSave={handleReminderSave}/>
              <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
            </div>
          </div>
        </div>
        </div>
        )}
    </div>
  );
}

