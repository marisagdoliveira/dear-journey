"use client";

import { useDrag } from 'react-dnd';

const DraggableEntry = ({ entry, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ENTRY',
    item: { id: entry.id, date: entry.date },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex flex-col w-24 h-24 p-2 rounded-3xl bg-transparent border border-white/33"
    >
      <div>
        <span className="flex p-0.5 text-md text-white justify-end">
          {format(new Date(entry.date), 'd')}
        </span>
      </div>
      <div className="max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap">{entry.title}</div>
      <button
        className="text-white mt-auto"
        onClick={() => onRemove(entry.date)}
      >
        <IoIosAddCircle className="text-white text-2xl text-[#dcd6ff]" />
      </button>
    </div>
  );
};

export default DraggableEntry;
