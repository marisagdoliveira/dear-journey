import React, { useState } from 'react'
import { FaCheck } from "react-icons/fa6";
import SmallPopupIcon from "../../public/assets/SmallNoteIcon.svg"
import AddIconSmall from "../../public/assets/AddIconSmall.svg";

const SmallNotesPopup = ({ smallNotes, onSave, setSmallNotes, setUpdatedNotes }) => {



    const [newNote, setNewNote] = React.useState('');

    const handleSaveNote = (index) => {
        const updatedNotes = [...smallNotes];
        updatedNotes[index] = { content: smallNotes[index].content }; // Ensure it's updated correctly
        setSmallNotes(updatedNotes);
        setUpdatedNotes(updatedNotes);
        console.log("Updated smallNotes (handleSaveNote):", updatedNotes);
        setTimeout(() => onSave(), 1000); // Delay to ensure state update
      };
    
      const handleAddNewNote = () => {
        if (newNote.trim() !== '') {
          const updatedNotes = [...smallNotes, { content: newNote }];
          setSmallNotes(updatedNotes);
          setUpdatedNotes(updatedNotes);
          console.log("Updated smallNotes (handleAddNewNote):", updatedNotes);
          setNewNote('');
          setTimeout(() => onSave(), 1000); // Delay to ensure state update
        }
      };
  


  return (
    <div>
       <div className='mt-10 w-[650px] max-h-[500px] h-fit flex flex-wrap gap-6 items-center overflow-auto scroll-container'>

        
        {smallNotes.map((note, index) => (
          <div key={index}>
            
            <div className='relative'>
            <SmallPopupIcon className="size-72"/>
            <p className="absolute left-5 top-5">{index+1}</p>
            <div className='absolute left-5 top-16'>
                <textarea
              value={note.content}
              onChange={(e) => {
                const updatedNotes = [...smallNotes];
                updatedNotes[index] = e.target.value;
                setSmallNotes(updatedNotes)
                setUpdatedNotes(updatedNotes);
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
