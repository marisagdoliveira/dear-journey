"use client";


import { useDrop } from 'react-dnd';
import { IoCloseCircleOutline } from 'react-icons/io5';

const TrashCan = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ENTRY',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-16 h-16 bg-red-600 flex items-center justify-center ${isOver ? 'opacity-75' : ''}`}
      style={{ borderRadius: '50%' }}
    >
      <IoCloseCircleOutline className="text-white text-3xl" />
    </div>
  );
};

export default TrashCan;
