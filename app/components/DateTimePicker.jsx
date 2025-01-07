import React, { useState, useEffect } from 'react';
import CancelX from "../../public/assets/CancelX.svg";
import { FaCheck } from "react-icons/fa6";
import { BsCalendarDate } from "react-icons/bs";
import { TbClockFilled, TbMailHeart } from "react-icons/tb";
import { useReminder } from "@/context/ReminderContext";
import MailHeart from "../../public/assets/MailHeart.svg"






const DateTimePicker = ({ isOpen, onClose, onSave, entryDate, email, saveEntry }) => {

  const fetchTheReminder = useReminder();

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (entryDate) {
      setSelectedDate(new Date(entryDate));
    }
  }, [entryDate]);

  if (!isOpen) return null;

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      if (name === 'day') newDate.setDate(value);
      if (name === 'month') newDate.setMonth(value - 1);
      if (name === 'year') newDate.setFullYear(value);
      if (name === 'hour') newDate.setHours(value);
      if (name === 'minute') newDate.setMinutes(value);
      return newDate;
    });
  };

  const handleSaveClick = async () => {
    //const noticeDate = selectedDate.toISOString();
    const noticeDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString(); // Convert to UTC

    console.log('Saving date:', noticeDate); // Log here

    const notificationData = {
      email,
      noteDate: entryDate,
      noticeDate
    }
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create notification: ${errorText}`);
      }

      await response.json();
      onSave(noticeDate); // Call the onSave callback with the new date
    } catch (error) {
      console.error('Error saving notification:', error);
    }

    saveEntry();
    fetchTheReminder();
    onClose();
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-transparent backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative bg-gradient-to-br from-[#a49ef6bf] to-[#4e44a7e3] border border-white/60 p-6 rounded-3xl shadow-lg z-50 w-[320px] h-[280px] max-w-[90%]">
        <div className='flex w-200px h-[50px] justify-center rounded-xl border-[1px] border-white/60 bg-[#6c73f171]'><p className='flex w-[300px] justify-start pl-[17px] darker-grotesque-main relative top-1' style={{ fontSize: 24 }}>Notify your future self<MailHeart className='absolute size-5 flex top-3 w-30 right-5 text-[#bbb0ff]'/></p></div>
        <div className="relative flex justify-center gap-2 mb-4 pl-10 pt-6">
        <BsCalendarDate className='absolute left-5 size-9 text-[rgb(173,172,255)]' />
          <select
            name="day"
            value={selectedDate.getDate()}
            onChange={handleDateChange}
            className=" option bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
          <select
            name="month"
            value={selectedDate.getMonth() + 1}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
          <select
            name="year"
            value={selectedDate.getFullYear()}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() + i}>
                {new Date().getFullYear() + i}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex justify-start gap-2 mb-4 pl-16 ">
        <TbClockFilled className=' absolute  left-5 size-9  text-[rgb(173,172,255)] ' />
          <select
            name="hour"
            value={selectedDate.getHours()}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main pl-2"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
            ))}
          </select>
          <select
            name="minute"
            value={selectedDate.getMinutes()}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-center gap-3 pt-4"> 
          <button
            onClick={onClose}
            className="darker-grotesque-main px-4 py-1 bg-[#5b527194] hover:bg-[#48415a94] border border-white/60 text-white rounded-2xl ml-2 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="flex darker-grotesque-main px-4 py-1 bg-[#736cd5] hover:bg-[#6259b1] border border-white/60 text-white rounded-2xl transition-all"
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
