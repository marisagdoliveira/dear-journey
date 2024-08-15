import React, { useState } from 'react'
import { FaCheck } from "react-icons/fa6";
import SmallPopupIcon from "../../public/assets/SmallNoteIcon.svg"
import AddIconSmall from "../../public/assets/AddIconSmall.svg";

const SmallNotesPopup = ({ smallNotes, onSave, setSmallNotes }) => {



  const [newNote, setNewNote] = useState('');

  const handleSaveNote = (index) => {
    // Update the existing note
    const updatedNotes = [...smallNotes];
    if (index < smallNotes.length) {
      onSave(); // Save the updated notes
    }
  };

  const handleAddNewNote = () => {
    if (newNote.trim() !== '') {
      const updatedNotes = [...smallNotes, newNote];
      setSmallNotes(updatedNotes);
      setNewNote('');
      onSave(); // Save the updated notes including the new note
    }
  };


  return (
    <div>
        <div className='mt-10 max-w-{80%} w-full max-h-{800px} h-fit flex items-center overflow-y-auto overflow-x-hidden'>
        
        {smallNotes.map((note, index) => (
          <div key={index}>
            
            <div className='relative'>
            <SmallPopupIcon className="size-72"/>
            <p className="absolute left-5 top-5">{index+1}</p>
            <div className='absolute left-5 top-16'>
                <textarea
              value={note}
              onChange={(e) => {
                const updatedNotes = [...smallNotes];
                updatedNotes[index] = e.target.value;
                setSmallNotes(updatedNotes);
              }}
              placeholder='Write your retrospective here...'
              className='w-[120%] h-[20vh] mt-5 bg-transparent p-2 focus:outline-none rounded-lg scroll-container'
            />
            </div>
            <FaCheck onClick={() => handleSaveNote(index)} className="absolute right-5 bottom-5 text-[#a2a2dc] hover:text-white drop-shadow-md shadow-white cursor-pointer transition-all" style={{ fontSize: "25px" }} />
        </div>

          </div>
        ))}
        <div className='relative'>
            <SmallPopupIcon className="size-72"/>
            <AddIconSmall className="absolute left-5 top-5" />
            <div className='absolute left-5 top-16'>
                <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder='Write your retrospective here...'
                className='w-[120%] h-[20vh] mt-5 bg-transparent p-2 focus:outline-none rounded-lg scroll-container'
            /></div>
            <FaCheck onClick={handleAddNewNote} className="absolute right-5 bottom-5 text-[#a2a2dc] hover:text-white drop-shadow-md shadow-white cursor-pointer transition-all" style={{ fontSize: "25px" }} />
        </div>
        
            
        </div>
    </div>
  )
}

export default SmallNotesPopup
