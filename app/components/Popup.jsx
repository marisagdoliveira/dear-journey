import React, { useState, useEffect } from 'react';
import SmallPopupIcon from "../../public/assets/SmallNoteIcon.svg";
import AddIconSmall from "../../public/assets/AddIconSmall.svg";
import BackIcon from "../../public/assets/BackIcon.svg";
import SmallNotesPopup from './SmallNotesPopup';

const Popup = ({ email, noteDate, onSave, getDateEntry, setTitle1 }) => {
  const [title, setTitle] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [smallNotes, setSmallNotes] = useState(getDateEntry(new Date(noteDate)).smallNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [smallPopupOpen, setSmallPopupOpen] = useState(false);
  const [updatedNotes, setUpdatedNotes] = useState([])

  useEffect(() => {
    const entry = getDateEntry(new Date(noteDate));
    setTitle(entry.title || '');
    setMainContent(entry.mainContent || '');
    setSmallNotes(entry.smallNotes || []);
    setTitle1(entry.title || "");
  }, [noteDate, getDateEntry]);

  useEffect(() => {
    console.log("Updated smallNotes in Popup:", smallNotes);
    console.log("Updated smallNotes in Popup:", updatedNotes);
    
  }, [smallNotes]);

  const saveEntry = async () => {
    console.log('Before saving:', { title, email, mainContent, smallNotes });

    const date = noteDate.toISOString();
    try {
      setIsSaving(true);
      const formattedSmallNotes = updatedNotes.map(note => typeof note === 'string' ? { content: note } : note);
      console.log('Saving entry:', { title, email, date, mainContent, smallNotes });
      const response = await fetch('/api/register', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, email, date, mainContent, smallNotes: formattedSmallNotes }),
      });
      if (!response.ok) {
        throw new Error('Failed to save entry.');
      }
      const result = await response.json();
      console.log('Saved entry:', result);
      setSmallNotes(updatedNotes)
      onSave( noteDate, title, mainContent, updatedNotes)
      setSaveMessage('Entry saved successfully.');
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setSaveMessage('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='popup-content bg-[#2c2251b2] w-[100vh] h-[90vh] p-10 relative'>
      {smallPopupOpen && (
        <div className='absolute cursor-pointer' style={{ left: "-115px", top: "15px" }}>
          <BackIcon onClick={() => setSmallPopupOpen(false)} />
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
          />
          <button
            onClick={saveEntry}
            className='flex mt-4 text-3xl bg-[#8585f26f] w-[80px] h-[41px] border border-white/55 p-2 rounded-2xl hover:box-shadow-white justify-center items-center darker-grotesque-main'
            style={{ fontWeight: 500 }}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          {saveMessage && <div className='mt-4 text-white'>{saveMessage}</div>}
          <div className='flex items-center'>
          <div className='mt-5 max-w-[60%] max-h-[120px] gap-6 min-h-32 h-fit flex flex-wrap items-center overflow-y-auto overflow-x-hidden mr-6 scroll-container'>
            {smallNotes.map((note, index) => (
              <div key={index} className='relative cursor-pointer'>
                <p className="absolute left-5 top-5">{index+1}</p>
                <SmallPopupIcon className="size-24" onClick={() => setSmallPopupOpen(true)} />
              </div>
            ))}
          </div>
            <AddIconSmall className="cursor-pointer" onClick={() => setSmallPopupOpen(true)} />
          </div>
        </div>
      )}
      {smallPopupOpen && (
        <SmallNotesPopup setUpdatedNotes={setUpdatedNotes} smallNotes={smallNotes} onSave={saveEntry} setSmallNotes={setSmallNotes} />
      )}
    </div>
  );
};

export default Popup;
