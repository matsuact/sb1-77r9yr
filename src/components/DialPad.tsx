import React from 'react';
import { X, Delete } from 'lucide-react';
import useDialTone from '../hooks/useDialTone';

interface DialPadProps {
  onDial: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const DialPad: React.FC<DialPadProps> = ({ onDial, onDelete, onClear }) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const playDialTone = useDialTone();

  const handleDigitClick = (digit: string) => {
    playDialTone(digit);
    onDial(digit);
  };

  return (
    <div className="mt-4 flex-grow flex flex-col">
      <div className="grid grid-cols-3 gap-4 flex-grow">
        {digits.map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded transition-colors duration-200"
          >
            {digit}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onClear}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          全削除
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-200"
        >
          <Delete className="w-4 h-4 mr-2" />
          削除
        </button>
      </div>
    </div>
  );
};

export default DialPad;