import React from 'react';
import { Phone, X } from 'lucide-react';

interface CallButtonProps {
  isCalling: boolean;
  onClick: () => void;
}

const CallButton: React.FC<CallButtonProps> = ({ isCalling, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-4 rounded-full ${
        isCalling ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      {isCalling ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <Phone className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default CallButton;