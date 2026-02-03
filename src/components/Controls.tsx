import { ChevronLeft, ChevronRight, ChevronDown, RotateCw, ChevronsDown } from 'lucide-react';

interface ControlsProps {
  onMove: (direction: 'left' | 'right' | 'down') => void;
  onRotate: () => void;
  onDrop: () => void;
  disabled: boolean;
}

export default function Controls({ onMove, onRotate, onDrop, disabled }: ControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      <button
        onClick={() => onMove('left')}
        disabled={disabled}
        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-4 rounded-lg transition"
      >
        <ChevronLeft className="w-6 h-6 mx-auto" />
      </button>
      
      <button
        onClick={onRotate}
        disabled={disabled}
        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-4 rounded-lg transition"
      >
        <RotateCw className="w-6 h-6 mx-auto" />
      </button>
      
      <button
        onClick={() => onMove('right')}
        disabled={disabled}
        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-4 rounded-lg transition"
      >
        <ChevronRight className="w-6 h-6 mx-auto" />
      </button>
      
      <button
        onClick={() => onMove('down')}
        disabled={disabled}
        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-4 rounded-lg transition"
      >
        <ChevronDown className="w-6 h-6 mx-auto" />
      </button>
      
      <button
        onClick={onDrop}
        disabled={disabled}
        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-4 rounded-lg transition"
      >
        <ChevronsDown className="w-6 h-6 mx-auto" />
      </button>
      
      <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-sm">Drop</span>
      </div>
    </div>
  );
}