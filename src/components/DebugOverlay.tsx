import React from 'react';
import { X } from 'lucide-react';
import { getLogs } from '../utils/logger';

interface DebugOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 w-full h-full bg-black bg-opacity-80 text-white p-4 overflow-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">デバッグログ</h2>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <pre className="whitespace-pre-wrap">
        {getLogs().join('\n')}
      </pre>
    </div>
  );
};

export default DebugOverlay;