import React, { useState } from 'react'
import { FaCheck } from "react-icons/fa6";
import SmallPopupIcon from "../../public/assets/SmallNoteIcon.svg"
import AddIconSmall from "../../public/assets/AddIconSmall.svg";
import { TbTrashX } from "react-icons/tb";

const SmallNotesPopup = ({ smallNotes, email, noteDate, fetchUser, setSmallNotes, setUpdatedNotes, saveEntry }) => {
    const [newNote, setNewNote] = React.useState('');
    
    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
      };
      
    
      
    const saveSmallNotes = async (updatedNotes) => {
      try {
          const response = await fetch('/api/smallnotes', {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email,
                  date: noteDate.toISOString(),
                  smallNotes: updatedNotes,
              }),
          });
  
          if (!response.ok) {
              throw new Error('Failed to save small notes.');
          }
  
          setSmallNotes(updatedNotes); // Update the local state
          setUpdatedNotes(updatedNotes);
          
          
           // Update parent state
          //setSmallPopupOpen(false); // Optionally close the popup after saving
      } catch (error) {
          console.error('Error saving small notes:', error);
      }
  };
  


    const handleSaveNote = (index) => {
        const updatedNotes = [...smallNotes];
        updatedNotes[index] = { content: smallNotes[index].content }; // Ensure it's updated correctly
        setSmallNotes(updatedNotes);
        setUpdatedNotes(updatedNotes);
        saveSmallNotes(updatedNotes);
         // Save only small notes
         fetchUser();
        console.log("Updated smallNotes (handleSaveNote):", updatedNotes);
        
    };

    const handleAddNewNote = () => {
        if (newNote.trim() !== '') {
            const updatedNotes = [...smallNotes, { content: newNote }];
            setSmallNotes(updatedNotes);
            setUpdatedNotes(updatedNotes);
            saveSmallNotes(updatedNotes); // Save only small notes
            console.log("Updated smallNotes (handleAddNewNote):", updatedNotes);
            setNewNote('');
            
            
        }
        
    };


    const handleDeleteSmallNote = async (noteIndex) => {
        try {
          const response = await fetch('/api/smallnotes', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,               // Assuming you have the user's email in your state
              date: noteDate.toISOString(),  // The date for the entry
              noteIndex,           // The index of the note to delete
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete the small note.');
          }
      
          const result = await response.json();
          console.log('Deleted small note:', result);
      
          // Update the state to remove the note from the local smallNotes array
          const updatedNotes = smallNotes.filter((_, index) => index !== noteIndex);
          setSmallNotes(updatedNotes);
          setUpdatedNotes(updatedNotes); // Optional, if needed
      
        } catch (error) {
          console.error('Error deleting small note:', error);
        }
      };

    return (
        <div>
        <div className='mt-10 w-[650px] max-h-[500px] h-fit flex flex-wrap gap-6 items-center overflow-auto scroll-container'>
            <div className='relative'>
                <SmallPopupIcon className="size-72"/>
                <AddIconSmall className="absolute left-5 top-5" />
                <div className='absolute left-5 top-16'>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(capitalizeFirstLetter(e.target.value))}
                        placeholder='Write your retrospective here...'
                        className='w-[120%] h-[20vh] mt-5 bg-transparent p-2 focus:outline-none rounded-lg scroll-container'
                    />
                </div>
                <FaCheck onClick={handleAddNewNote} className="absolute right-5 bottom-5 text-[#a2a2dc] hover:text-white drop-shadow-md shadow-white cursor-pointer transition-all" style={{ fontSize: "25px" }} />
            </div>
            {smallNotes.map((note, index) => (
                <div key={index}>
                    <div className='relative '>
                        <SmallPopupIcon className="size-72 shadow-transparent hover:shadow-white-lg"/>
                        <p className="absolute left-5 top-5">{index+1}</p>
                        <div className='absolute left-5 top-16'>
                            <textarea
                                value={note.content}
                                onChange={(e) => {
                                    const updatedNotes = [...smallNotes];
                                    updatedNotes[index].content = capitalizeFirstLetter(e.target.value);
                                    setSmallNotes(updatedNotes);
                                    setUpdatedNotes(updatedNotes);
                                }}
                                placeholder='Write your retrospective here...'
                                className='w-[120%] h-[20vh] mt-5 bg-transparent p-2 focus:outline-none rounded-lg scroll-container'
                            />
                        </div>
                        {/* Added the onClick handler for deleting a specific note */}
                        <TbTrashX
                            className="absolute left-5 bottom-5 text-[#4E4EA7] hover:text-white drop-shadow-md shadow-white cursor-pointer transition-all"
                            size={30}
                            onClick={() => handleDeleteSmallNote(index)} // Attach handler for deletion
                        />
                        <FaCheck onClick={() => handleSaveNote(index)} className="absolute right-5 bottom-5 text-[#a2a2dc] hover:text-white drop-shadow-md shadow-white cursor-pointer transition-all" style={{ fontSize: "25px" }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}

export default SmallNotesPopup;
