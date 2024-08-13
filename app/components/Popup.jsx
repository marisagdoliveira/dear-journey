import React, { useState, useEffect } from 'react';

const Popup = ({ email, noteDate, onSave, getDateEntry, setTitle1 }) => {

  // State for title, main content, and saving status
  const [title, setTitle] = useState(getDateEntry(new Date(noteDate)).title || "");
  setTitle1(getDateEntry(new Date(noteDate)).title || "");
  const [mainContent, setMainContent] = useState(getDateEntry(new Date(noteDate)).mainContent || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  console.log(getDateEntry(noteDate))
  const formattedDate = new Date(noteDate).toLocaleDateString('pt-PT');

  
  


  const saveEntry = async () => {
    const date = noteDate.toISOString();
    try {
      setIsSaving(true);
      console.log('Saving entry:', { title, email, date, mainContent, smallNotes: [] });  
      const response = await fetch('/api/register', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title, email, date, mainContent, smallNotes: [] }),
      }); 
      if (!response.ok) {
        throw new Error('Failed to save entry.');
      } 
      const result = await response.json();
      console.log('Saved entry:', result);  
      // Display success message
      onSave(noteDate, title, mainContent, []);
      setSaveMessage('Entry saved successfully.');
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setSaveMessage('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };



  


  return (
    <div className='popup-content bg-[#2c2251b2] w-[100vh] h-[90vh] p-10'>
      <div className='flex justify-between mb-4'>
        <div className='pl-2 text-xl'>{formattedDate}</div>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='bg-transparent focus:outline-none text-xl'
        />
      </div>
      <div className='textarea'>
        <textarea
          value={mainContent}
          onChange={(e) => setMainContent(e.target.value)}
          placeholder='Write your journal entry here...'
          className='w-full h-[40vh] mt-5 bg-transparent p-2 focus:outline-none rounded-lg'
        />
      </div>
      <button
        onClick={saveEntry}
        className='flex mt-4 text-3xl bg-[#8585f26f] w-[80px] h-[41px] border border-white/55 p-2 rounded-2xl hover:box-shadow-white justify-center items-center darker-grotesque-main'
        style={{ fontWeight: 500 }}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      {saveMessage && <div className='mt-4 text-white'>{saveMessage}</div>}
    </div>
  );
};

export default Popup;


