import React, { useState } from 'react';

const DateTimePicker = ({ isOpen, onClose, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!isOpen) return null;

  // Helper function to pad numbers with leading zeros
  const padNumber = (num) => String(num).padStart(2, '0');

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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-transparent backdrop-blur-[2px]" onClick={onClose}></div>

      <div className="relative bg-gradient-to-br from-[#9a82f2a6] to-[#5d41c0ca] border border-white/60 p-6 rounded-3xl shadow-lg z-50 w-[320px] max-w-[90%]">
        <p className='flex w-[300px] darker-grotesque-main pb-5' style={{  }}>Notify your future self:</p>
        <div className="flex justify-start gap-2 mb-4 pl-10">
            
          <select
            name="day"
            value={selectedDate.getDate()}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option  key={i + 1} value={i + 1}>
                {padNumber(i + 1)}
              </option>
            ))}
          </select>
          <select
            name="month"
            value={selectedDate.getMonth() + 1}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option className="" key={i + 1} value={i + 1}>
                {padNumber(i + 1)}
              </option>
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
        <div className="flex justify-start gap-2 mb-4 pl-10">
          <select
            name="hour"
            value={selectedDate.getHours()}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {padNumber(i)}
              </option>
            ))}
          </select>
          <select
            name="minute"
            value={selectedDate.getMinutes()}
            onChange={handleDateChange}
            className="bg-transparent text-white darker-grotesque-main"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option className='' key={i} value={i}>
                {padNumber(i)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onSave(selectedDate);
              onClose();
            }}
            className="darker-grotesque-main px-4 py-2 bg-[#766cd5] hover:bg-[#6259b1] border border-white/60 text-white rounded-2xl transition-all" 
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="darker-grotesque-main px-4 py-2 bg-[#5b527194] hover:bg-[#48415a94] border border-white/60 text-white rounded-2xl ml-2 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;

