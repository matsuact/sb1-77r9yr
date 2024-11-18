import React from 'react';

interface CallerInfoProps {
  name: string;
  icon: React.ReactNode;
}

const CallerInfo: React.FC<CallerInfoProps> = ({ name, icon }) => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="bg-gray-200 p-4 rounded-full">{icon}</div>
      <h2 className="text-xl font-semibold mt-2">{name}</h2>
    </div>
  );
};

export default CallerInfo;