import React, { useState, useEffect } from 'react';
import SmallPopupIcon from "../../public/assets/SmallNoteIcon.svg";
import AddIconSmall from "../../public/assets/AddIconSmall.svg";
import BackIcon from "../../public/assets/BackIcon.svg";
import SmallNotesPopup from './SmallNotesPopup';
import { GoTrash } from "react-icons/go";



const Popup = ({ noteDate, onSave, setTitle1 }) => {
  const [title, setTitle] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [smallNotes, setSmallNotes] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [smallPopupOpen, setSmallPopupOpen] = useState(false);
  const [updatedNotes, setUpdatedNotes] = useState([]);




  
  useEffect(() => {
    // Fetch user data and journal entries when the component mounts
    const fetchUserAndJournalEntries = async () => {
      try {
        const response = await fetch(`/api/user`);
        if (response.ok) {
          const data = await response.json();
          setEmail(data.user.email);
          setJournalEntries(data.user.library);
          console.log('Journal entries:', data.user.library);
          
          // Automatically update the small notes for the current date
          const entry = data.user.library.find(entry => new Date(entry.date).toISOString() === noteDate.toISOString());
          if (entry) {
            setTitle(entry.title || '');
            setMainContent(entry.mainContent || '');
            setSmallNotes(entry.smallNotes || []);
            setTitle1(entry.title || "");
          } else {
            setTitle('');
            setMainContent('');
            setSmallNotes([]);
            setTitle1("");
          }
        } else {
          throw new Error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserAndJournalEntries();
  }, [noteDate, setTitle1]);

  

  const saveEntry = async () => {
    console.log('Before saving:', { title, email, mainContent, smallNotes });

    const date = noteDate.toISOString();
    try {
        setIsSaving(true);

        // Ensure smallNotes are always passed as the correct current state
        const notesToSave = updatedNotes.length > 0 ? updatedNotes : smallNotes;

        const formattedSmallNotes = notesToSave.map(note => typeof note === 'string' ? { content: note } : note);
        console.log('Saving entry:', { title, email, date, mainContent, smallNotes: formattedSmallNotes });

        const response = await fetch('/api/register', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                email,
                date,
                mainContent,
                smallNotes: formattedSmallNotes
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save entry.');
        }

        const result = await response.json();
        console.log('Saved entry:', result);

        // Update state with the current saved data
        setSmallNotes(formattedSmallNotes);
        onSave(noteDate, title, mainContent, formattedSmallNotes);

        setSaveMessage('Entry saved successfully.');
    } catch (error) {
        console.error('Error saving journal entry:', error);
        setSaveMessage('Failed to save entry. Please try again.');
    } finally {
        setIsSaving(false);
    }
};


  const handleOpenPopup = () => {
    setSmallPopupOpen(true);
  };


  const deleteEntry = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          date: noteDate.toISOString(),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete entry.');
      }
  
      const result = await response.json();
      console.log('Deleted entry:', result);
  
      // Notify parent component about the deletion
      if (onSave) {
        onSave(noteDate, '', '', []);
      }
  
      // Clear the current state
      setTitle('');
      setMainContent('');
      setSmallNotes([]);
      setTitle1("");
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };
  

  return (
    <div className='popup-content bg-[#2c2251b2] w-[100vh] h-[90vh] p-10 relative'>
      {smallPopupOpen && (
        <div className='absolute cursor-pointer top-5' style={{ left: "-7.5%",  top: "15px", zIndex: 100000 }}>
          <BackIcon onClick={() => setSmallPopupOpen(false)} className="size-10"/>
        </div>
      )}

      <div className='flex justify-between mb-4'>
        <div className='pl-2 text-xl'>{new Date(noteDate).toLocaleDateString('pt-PT')}</div>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='bg-transparent focus:outline-none text-xl'
        />
      </div>
      {!smallPopupOpen && (
        <div>
          <textarea
            value={mainContent}
            onChange={(e) => setMainContent(e.target.value)}
            placeholder='Write your journal entry here...'
            className='w-full h-[40vh] mt-5 bg-transparent p-2 focus:outline-none rounded-lg scroll-container'
          /><div className='flex flex-row items-center space-x-4 '>
          <button
            onClick={saveEntry}
            className='flex mt-4 text-3xl bg-[#8585f26f] w-[80px] h-[41px] border border-white/55 p-2 rounded-2xl hover:shadow-[#8274d0] shadow-md justify-center items-center darker-grotesque-main transition-shadow duration-300'
            style={{ fontWeight: 500 }}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <GoTrash className="h-14 pt-5 size-9 text-white/30 hover:text-white transition-colors duration-300"
          onClick={deleteEntry} />
          </div>
          {saveMessage && <div className='mt-4 text-white'>{saveMessage}</div>}
          <div className='flex items-center'>
            <div className='mt-5 max-w-[60%] max-h-[120px] gap-6 min-h-32 h-fit flex flex-wrap items-center overflow-y-auto overflow-x-hidden mr-6 scroll-container'>
              {smallNotes.map((note, index) => (
                <div key={index} className='relative cursor-pointer'>
                  <p className="absolute left-5 top-5">{index + 1}</p>
                  <SmallPopupIcon className="size-24" onClick={handleOpenPopup} />
                </div>
              ))}
            </div>
            <AddIconSmall className="cursor-pointer" onClick={handleOpenPopup} />
          </div>
        </div>
      )}
      {smallPopupOpen && (
        <SmallNotesPopup
          smallNotes={smallNotes}
          email={email}
          noteDate={noteDate}
          setSmallNotes={setSmallNotes}
          setUpdatedNotes={setUpdatedNotes}
          saveEntry={saveEntry}
        />
      )}
    </div>
  );
};

export default Popup;


