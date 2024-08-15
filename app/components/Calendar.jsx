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
  const [showAddNoteInput, setShowAddNoteInput] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  const [title, setTitle] = useState("");

  


  useEffect(() => {
    fetchUserAndJournalEntries();
  }, [currentMonth]);

  const fetchUserAndJournalEntries = async () => {
    try {
      const response = await fetch(`/api/user`);
      if (response.ok) {
        const data = await response.json();
        setEmail(data.user.email);
        setJournalEntries(data.user.library);
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const saveEntry = async (title, date, mainContent, smallNotes) => {
    try {
      const response = await fetch('/api/register', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title:title, email, date:date, mainContent, smallNotes }),
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
      existingEntry.smallNotes = smallNotes;
      saveEntry(title, date,  mainContent, smallNotes);
    } else {
      const newEntry = { date, title, mainContent, smallNotes };
      setJournalEntries([...journalEntries, newEntry]);
      saveEntry(title, date,  mainContent, smallNotes);
    }
  };
  



  const handleRemoveNote = (date, noteIndex) => {
    const entry = getDateEntry(date);
    if (entry.smallNotes.length > noteIndex) {
      const newNotes = entry.smallNotes.filter((_, i) => i !== noteIndex);
      handleEntryChange(date, entry.mainContent, newNotes);
    }
  };

  const getDateEntry = (date) => {
    return journalEntries.find(entry => new Date(entry.date).toISOString() === date.toISOString()) || { mainContent: '', smallNotes: [] };
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleAddNote = () => {
    setShowAddNoteInput(true);
  };

  const handleNoteInputChange = (e) => {
    setNewNoteContent(e.target.value);
  };

  const handleConfirmAddNote = (day) => {
    const entry = getDateEntry(day);
    const newNotes = [...entry.smallNotes, { content: newNoteContent }];
    handleEntryChange(day, entry.mainContent, entry.smallNotes);
    setNewNoteContent('');
    setShowAddNoteInput(false);
  };

  const cancelAddNote = () => {
    setNewNoteContent('');
    setShowAddNoteInput(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex justify-between w-full max-w-xl mb-7">
        <button className="text-white darker-grotesque-main" onClick={prevMonth}> <Calenleft /> </button>
        <h2 className="text-white/20 text-5xl font-semibold tracking-widest" style={{ fontFamily: 'Darker Grotesque', WebkitTextStroke: '0.9px white' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button className="text-white darker-grotesque-main" onClick={nextMonth}> <Calenright /> </button>
      </div>
      {showAddNoteInput && (
        <div className="mb-4 w-full max-w-xl">
          <textarea
            value={newNoteContent}
            onChange={handleNoteInputChange}
            rows={2}
            className="w-full p-2 mb-2 rounded-3xl bg-transparent text-[#6464D3] placeholder-white/50 resize-none"
            placeholder="Add your small note..."
          />
          <div className="flex justify-end">
            <button className="text-white mr-2" onClick={() => handleConfirmAddNote()}>
              Add Note
            </button>
            <button className="text-red-500" onClick={cancelAddNote}>
              Cancel
            </button>
          </div>
        </div>
      )}
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
        <div className="popup border border-white/45">
          <div className="popup-content flex flex-col justify-center items-center relative">
            <div className="flex w-full justify-end items-end">
              <button className="close-button self-end pr-2 top-5 absolute" onClick={() => setShowPopup(false)}>
                <Close />
              </button>
            </div>
            <div className="flex items-center">
              <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer"><Calenleft /></p>
              <Popup setTitle1={setTitle}  getDateEntry={getDateEntry} email={email} noteDate={noteDate} onSave={handleEntryChange} />
              <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}

