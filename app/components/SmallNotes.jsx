
import React, { useState, useEffect } from 'react';
import { IoAddCircle, IoCreateOutline, IoSaveOutline } from 'react-icons/io5';

const SmallNotes = ({ email, noteDate }) => {
  // State management
  const [smallNotes, setSmallNotes] = useState([]); // State to store the list of small notes
  const [showSmallNotesPopup, setShowSmallNotesPopup] = useState(false); // State to control the visibility of the small note popup
  const [currentSmallNote, setCurrentSmallNote] = useState(""); // State to store the content of the current small note being edited or added
  const [editingNoteIndex, setEditingNoteIndex] = useState(null); // State to track which small note is being edited
  const [smallNoteSaving, setSmallNoteSaving] = useState(false); // State to track if a small note is being saved
  const [smallNoteMessage, setSmallNoteMessage] = useState(''); // State to store messages related to small note save operations

  // Load small notes when the component mounts or when noteDate changes
  useEffect(() => {
    const fetchSmallNotes = async () => {
      try {
        const response = await fetch('/api/smallNotes?date=' + noteDate.toISOString()); // Fetch the small notes data for the selected date
        const data = await response.json(); // Parse the response JSON
        setSmallNotes(data.smallNotes || []); // Set the small notes state
      } catch (error) {
        console.error('Error fetching small notes:', error); // Log any errors
      }
    };

    fetchSmallNotes();
  }, [noteDate]);

  // Function to save a small note
  const saveSmallNote = async (index) => {
    const date = noteDate.toISOString(); // Convert the noteDate to ISO string format
    const updatedNotes = [...smallNotes]; // Create a copy of the small notes array
    if (index !== null) {
      updatedNotes[index] = currentSmallNote; // Update the specific note if editing
    } else {
      updatedNotes.push(currentSmallNote); // Add a new note if not editing
    }
    setSmallNotes(updatedNotes); // Update the state with the new list of small notes

    try {
      setSmallNoteSaving(true); // Indicate that small note saving is in progress
      const response = await fetch('/api/smallNotes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, date, smallNotes: updatedNotes }), // Send email, date, and updated list of small notes
      });
      if (!response.ok) {
        throw new Error('Failed to save small note.'); // Handle errors if response is not OK
      }
      const result = await response.json(); // Parse the response JSON
      setSmallNoteMessage('Small note saved successfully.'); // Set success message
    } catch (error) {
      console.error('Error saving small note:', error); // Log any errors
      setSmallNoteMessage('Failed to save small note. Please try again.'); // Set error message
    } finally {
      setSmallNoteSaving(false); // Reset small note saving state
      setCurrentSmallNote(""); // Clear the current small note input
      setShowSmallNotesPopup(false); // Hide the small notes popup
      setEditingNoteIndex(null); // Reset the editing note index
    }
  };

  // Function to handle adding a new note
  const handleAddNoteClick = () => {
    setCurrentSmallNote(""); // Clear the current small note input
    setEditingNoteIndex(null); // Ensure no note is being edited
    setShowSmallNotesPopup(true); // Show the small notes popup
  };

  // Function to handle editing an existing note
  const handleEditNoteClick = (index) => {
    setCurrentSmallNote(smallNotes[index]); // Set the current small note input to the selected note's content
    setEditingNoteIndex(index); // Set the index of the note being edited
    setShowSmallNotesPopup(true); // Show the small notes popup
  };

  return (
    <div className='small-notes-container mt-4'>
      <div className='small-notes-display grid grid-cols-5 gap-2'>
        {smallNotes.map((note, index) => (
          <div key={index} className='small-note-item flex items-center bg-gray-700 text-white p-2 rounded-lg'>
            <div className='flex-grow text-center overflow-hidden'>{note}</div> {/* Display the note text */}
            <IoCreateOutline
              className='text-white text-2xl cursor-pointer ml-2'
              onClick={() => handleEditNoteClick(index)} // Call handleEditNoteClick when the edit icon is clicked
            />
          </div>
        ))}
        {smallNotes.length < 5 && (
          <div className='add-small-note-icon flex justify-center items-center cursor-pointer bg-gray-700 text-white p-2 rounded-lg'>
            <IoAddCircle
              className='text-white text-3xl'
              onClick={handleAddNoteClick} // Call handleAddNoteClick when the add icon is clicked
            />
          </div>
        )}
      </div>

      {showSmallNotesPopup && (
        <div className='small-notes-popup fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-gray-800 p-4 rounded-lg w-[90%] max-w-lg'>
            <textarea
              value={currentSmallNote}
              onChange={(e) => setCurrentSmallNote(e.target.value)} // Update the current small note state on input change
              placeholder='Write your small note here...'
              className='w-full h-[20vh] mt-2 bg-transparent p-2 focus:outline-none rounded-lg'
            />
            <div className='flex justify-between mt-4'>
              <button
                onClick={() => saveSmallNote(editingNoteIndex)} // Save the current small note and update it if editing an existing note
                className='bg-blue-500 text-white p-2 rounded-lg flex items-center'
                disabled={smallNoteSaving} // Disable the button while saving
              >
                <IoSaveOutline className='text-white text-xl' /> {/* Save icon */}
                <span className='ml-2'>{smallNoteSaving ? 'Saving...' : 'Save'}</span> {/* Display saving status */}
              </button>
              <button
                onClick={() => { setShowSmallNotesPopup(false); setCurrentSmallNote(""); setEditingNoteIndex(null); }} // Close the popup and reset state
                className='bg-red-500 text-white p-2 rounded-lg flex items-center'
              >
                <IoCreateOutline className='text-white text-xl' /> {/* Cancel icon */}
                <span className='ml-2'>Cancel</span> {/* Cancel button text */}
              </button>
            </div>
            {smallNoteMessage && <div className='mt-2 text-white'>{smallNoteMessage}</div>} {/* Display the small note save message if present */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmallNotes;
