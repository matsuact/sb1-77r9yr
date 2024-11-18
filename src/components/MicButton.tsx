import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ isListening, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-4 rounded-full ${
        isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isListening ? (
        <MicOff className="w-6 h-6 text-white" />
      ) : (
        <Mic className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default MicButton;