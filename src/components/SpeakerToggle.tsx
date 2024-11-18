import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeakerToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const SpeakerToggle: React.FC<SpeakerToggleProps> = ({ isOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center p-4 rounded-full ${
        isOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
      }`}
    >
      {isOn ? (
        <Volume2 className="w-6 h-6 text-white" />
      ) : (
        <VolumeX className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
};

export default SpeakerToggle;