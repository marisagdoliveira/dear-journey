import React, { useState, useEffect } from 'react';
import SmallPopupIconSmall from "../../public/assets/SmallPopupIconSmall.svg";
import AddIconSmall from "../../public/assets/AddIconSmall.svg";
import BackIcon from "../../public/assets/BackIcon.svg";
import CancelX from "../../public/assets/CancelX.svg";
import SmallNotesPopup from './SmallNotesPopup';
import { FaCheck } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { Darker_Grotesque } from 'next/font/google';
import { TbBell } from "react-icons/tb";
import { FaRegCircleCheck } from "react-icons/fa6";
import ThoughtIcon from "../../public/assets/ThoughtIcon.svg";




import DateTimePicker from '../components/DateTimePicker'; // Import the new component


const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};





const Popup = ({ noteDate, onSave, setTitle1, fetchUser, showPopup, showSmallNotesCalendar, setShowSmallNotesCalendar, fetchTheReminder, setShowPopupReminder, showPopupReminder, showPopupReminderDate }) => {
  const [title, setTitle] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [smallNotes, setSmallNotes] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [smallPopupOpen, setSmallPopupOpen] = useState(false);
  const [updatedNotes, setUpdatedNotes] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState('');

  const [animationState, setAnimationState] = useState('paused');



  const closeSmallNotes = () => {
    setSmallPopupOpen(false)
    setShowSmallNotesCalendar(false)
  }

  useEffect(() => {
    if (showSmallNotesCalendar) {
      setSmallPopupOpen(true);
    }
  }, [showSmallNotesCalendar]);
  


  
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
          console.log()
          // Automatically update the small notes for the current date
          const entry = data.user.library.find(entry => {
            
            return new Date(entry.date).toISOString() === noteDate.toISOString();
          });
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



  useEffect(() => {
    let timeoutId;
    let intervalId;

    const startAnimationCycle = () => {
      // Set animation to running
      setAnimationState('running');

      // Pause animation after 3 seconds
      timeoutId = setTimeout(() => {
        setAnimationState('paused');
      }, 3000); // 3 seconds animation duration

      // Continue the cycle every 18 seconds (15s pause + 3s animation)
      intervalId = setInterval(() => {
        setAnimationState('running');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setAnimationState('paused');
        }, 3000); // 3 seconds animation duration
      }, 18000); // 18 seconds interval (15s pause + 3s animation)
    };

    if (showPopup) {
      startAnimationCycle();

      // Cleanup on unmount or when showPopup changes
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }

    // Cleanup when showPopup changes to false
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [showPopup]);
  

  const saveEntry = async () => {
    


    console.log('Before saving:', { title, email, mainContent, smallNotes });

    const date = noteDate.toISOString();
    try {
        setIsSaving(true);
        setIsClicked(true);

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

        setSaveMessage('Entry updated successfully');
        } catch (error) {
            console.error('Error saving journal entry:', error);
            setSaveMessage('Failed to save entry. Please try again.');
        } finally {
            setIsSaving(false);
            // Reset the button state after a short delay
            setTimeout(() => {
              setIsClicked(false);
          }, 100);
            // Clear the save message after 2 seconds
            setTimeout(() => {
              setSaveMessage('');
          }, 1000);
        }
    };





    const deleteEntry = async () => {
      try {
          // Log the payload being sent
          console.log("Deleting entry for:", { email, noteDate: noteDate.toISOString() });
  
          const response = await fetch('/api/register', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email,
                  date: noteDate,
                  deleteNotifications: true,
              }),
          });
  
          if (!response.ok) {
              throw new Error('Failed to delete entry.');
          }
  
          const result = await response.json();
          console.log('Deleted entry:', result);
  
          // Handle notification removal logic
          if (result.deletedNotifications) {
              console.log('Deleted associated notifications:', result.deletedNotifications);
          }
  
          // Notify parent component about the deletion
          if (onSave) {
              onSave(noteDate, '', '', []);
          }
  
          // Clear the current state
          setTitle('');
          setMainContent('');
          setSmallNotes([]);
          setTitle1("");
  
          // Update the state for entries to reflect the deletion
          setEntries(prevEntries => 
              prevEntries.filter(entry => entry.date.getTime() !== noteDate.getTime())
          );
  
      } catch (error) {
          console.error('Error deleting journal entry:', error);
      }
  };
  

  const handleDeleteConfirmation = async (confirm) => {
    if (confirm) {
      await deleteEntry(); // Proceed with deletion
    }
    setShowConfirmDelete(false); // Hide confirmation dialog
  };
  

    const handleOpenPopup = () => {
    setSmallPopupOpen(true);
  };

  // Date and Time Picker:

  const handleOpenDateTimePicker = () => {
    setIsDateTimePickerOpen(true);
  };

  const handleSaveReminder = (date) => {
    console.log('Reminder date:', date); // Log here

    setReminderDate(date);
    // You may want to handle saving this date to your backend or state here:

    
  };



  return (
    <div className='popup-content bg-[#2c2251b2] bg-gradient-to-tl from-[rgba(59,54,105,0.4)] to-[rgba(49,43,91,0.42)] transition-all duration-300 ease-in-out w-[100vh] h-[90vh] p-10 relative z-100001' >
      {smallPopupOpen && (
        <div className='absolute cursor-pointer top-5' style={{ left: "-7.5%", top: "15px", zIndex: 100000 }}>
          <BackIcon onClick={() => closeSmallNotes()} className="size-10 cursor-pointer"/>
        </div>
      )}
      <div className='flex items-center justify-between mb-4'>
        <div className='roboto-mono-popup pl-2 text-xl' style={{ fontWeight:400 }}>
          {new Date(noteDate).toLocaleDateString('pt-PT')}
        </div>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(capitalizeFirstLetter(e.target.value))}
          className='roboto-mono-popup bg-transparent focus:outline-none text-xl ' style={{ fontWeight: 1000000, width: "480px", paddingLeft: "215px" }} // atualizar esta linha no original!!!!
        />
        <div className='flex items-center justify-center'>
          <div className='w-10 h-10 bg-[#675E99]/90 rounded-xl flex items-center justify-center'>
            <TbBell className={`notification-bell ${animationState === 'running' ? 'animation-active' : ''} text-white`} style={{ animationPlayState: animationState }} size={26} onClick={handleOpenDateTimePicker} />
          </div>
        </div>
      </div>
      {!smallPopupOpen && (
        <div>
          <textarea
            value={mainContent}
            onChange={(e) => setMainContent(capitalizeFirstLetter(e.target.value))}
            placeholder='Write your journal entry here...'
            className='biorhyme-popup tracking-wide text-justify w-full h-[40vh] mt-5 pr-5 bg-transparent p-2 focus:outline-none rounded-lg scroll-container text-[#ccc6f5]' style={{ fontWeight:350, fontSize: 13 }}
          />
        <div className='flex flex-col items-start'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={saveEntry}
              className={`flex text-3xl bg-[#8585f26f] w-[95px] h-[41px] border border-white/55 p-2 pt-1 shadow-hidden rounded-2xl hover:bg-[#7676d66f] shadow-md justify-center items-center darker-grotesque-main transition-all duration-150 ${isClicked ? 'scale-95' : 'scale-100'}`}
              style={{ fontSize: 25 }}
              disabled={isSaving}
            >
              {isSaving ? 'Save' : 'Save'}
            </button>
            <GoTrash className="h-14 size-9 text-white/30 hover:text-white/85 transition-colors duration-300"
              onClick={() => setShowConfirmDelete(true)} />
          </div>
          {smallNotes.length > 0 && (
            <div className='flex items-center pt-4 pl-1'>
              <ThoughtIcon className='mr-2' /> {/* Adjust the margin as needed */}
              <p className='darker-grotesque-main' style={{ fontSize: 20 }}>
                My latest insights:
              </p>
            </div>
          )}
        </div>
        <div className='relative'>
        {saveMessage && (
        <div className='fixed inset-0 flex justify-center items-center z-50'>
          {/* Save message container */}
          <div className='flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#a49ef6bf] to-[#4e44a7e3] border border-white/60 backdrop-blur-[2px] h-[150px] w-[220px] text-white text-lg p-4 rounded-3xl shadow-lg' style={{ fontFamily: 'Darker Grotesque', fontWeight: 500, fontSize: 18 }}>
            {/* Message */}
            <div className='mb-4'>
              {saveMessage}
            </div>
            {/* Check icon */}
            <FaRegCircleCheck className='text-[rgb(173,172,255)]' size={34} />
          </div>
        </div>
      )}
        </div>
        <div className='flex items-center z-100000'>
          <div className='mt-5 max-w-[50%] max-h-[120px] pb-5 gap-4 min-h-32 h-fit flex flex-wrap items-center overflow-y-auto overflow-x-hidden mr-6 scroll-container'>
            {smallNotes.map((note, index) => (
              <div key={index} className='relative cursor-pointer'>
                <p className="absolute left-9 top-8">{index + 1}</p>
                <SmallPopupIconSmall className="size-24" onClick={handleOpenPopup} />
              </div>
            ))}
          </div>
          {/* Make sure the size matches and is properly aligned */}
          <AddIconSmall className="size-24 pt-5 cursor-pointer" onClick={handleOpenPopup} />
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
        fetchUser={fetchUser}
      />
    )}
    {showConfirmDelete && (
      <div className='fixed inset-0 flex items-center justify-center z-50'>
        {/* Overlay */}
        <div className='absolute inset-0 bg-transparent backdrop-blur-[2px]'></div>
    
        {/* Confirmation Dialog */}
          <div className='relative bg-[#7e74ff]/60 backdrop-blur-[2px] p-6 border rounded-3xl shadow-lg  border-white/60 bg-gradient-to-br from-[rgba(100,100,211,0.4)] to-[rgba(204,196,255,0.3)] z-50'>
            <div className='flex justify-end gap-3'>
              <p className='mb-0 text-lg' style={{ fontFamily: "Darker Grotesque", fontWeight: 600, fontSize: 20 }}>
              Are you sure you want to delete the whole entry? </p>
              <div className='w-10 h-10 bg-[#675E99]/60 rounded-xl flex items-center justify-center'>
                <GoTrash className='text-white' size={26} />
              </div>
            </div>
              <p className='' style={{ fontFamily: 'Darker Grotesque', fontSize: 20 }}>This action <b className='text-[#433c68]'>can't</b> be reversed.</p>
            <div className='flex justify-end space-x-4'>
              <CancelX
                onClick={() => handleDeleteConfirmation(false)} // Cancel deletion
                className='bg-[#675E99] /10 text-white p-2 border border-white/70 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-200'
                width={35} // Adjust the size as needed
                height={35} // Adjust the size as needed
              />
              <FaCheck
                className='text-white p-2 bg-[#6c68b8d8] /30 border border-white/70 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-200'
                size={35}  // Adjust the size as needed
                onClick={() => handleDeleteConfirmation(true)}  // Confirm deletion 
              />
            </div>
          </div>
        </div>
      )}
      {isDateTimePickerOpen && (
        <DateTimePicker
          fetchTheReminder={fetchTheReminder}
          isOpen={isDateTimePickerOpen}
          onClose={() => setIsDateTimePickerOpen(false)}
          onSave={handleSaveReminder}
          entryDate={noteDate.toISOString()} // Assuming noteDate is the entryDate you want to pass
          email={email} // Pass the email for the notification
          saveEntry={saveEntry}
        />
      )}   
    </div>
  );

};

export default Popup;


