import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import Popup from "./Popup";
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import Close from "../../public/assets/Close.svg"
import { IoCloseCircleOutline } from "react-icons/io5";


export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState([]);
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [noteDate, setNoteDate] = useState("");



  


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
  };
  
  



 

  const getDateEntry = (date) => {
    return journalEntries.find(entry => new Date(entry.date).toISOString() === date.toISOString()) || { mainContent: '', smallNotes: [] };
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex justify-between w-full max-w-xl mb-7">
        <button className="text-white darker-grotesque-main" onClick={prevMonth}> <Calenleft /> </button>
        <h2 className="text-white/20 text-5xl font-semibold tracking-widest" style={{ fontFamily: 'Darker Grotesque', WebkitTextStroke: '0.9px white' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button className="text-white darker-grotesque-main" onClick={nextMonth}> <Calenright /> </button>
      </div>
      
      <div className="flex flex-wrap max-w-[900px]  max-h-[40%]  justify-center gap-4">
        {daysInMonth.map((day, index) => {
          const entry = getDateEntry(day);
          return (
            
            <div key={index} className="flex flex-col w-24 h-24 p-2 rounded-3xl bg-transparent border border-white/33">
              <div>
                <span className="flex p-0.5 text-md text-white justify-end">{format(day, 'd')}</span>
              </div>
              <div className="max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap">{getDateEntry(day).title}</div>
              <button
                className="text-white mt-auto"
                // onClick={() => setShowAddNoteInput(true)}
                onClick={() => { setShowPopup(true); setNoteDate(day); }}
              >
                <IoIosAddCircle className="text-white text-2xl text-[#dcd6ff]" />
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
              <button className="close-button self-end pr-2 top-5 absolute" onClick={() => setShowPopup(false)}>
                <Close />
              </button>
            </div>
            <div className="flex items-center">
              <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer"><Calenleft /></p>
              <Popup showPopup={showPopup} setTitle1={setTitle}  getDateEntry={getDateEntry} email={email} noteDate={noteDate} onSave={handleEntryChange} />
              <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
            </div>
          </div>
        </div>
        </div>
        )}
    </div>
  );
}

