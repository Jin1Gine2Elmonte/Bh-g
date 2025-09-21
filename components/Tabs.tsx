import React from 'react';
import { Mode } from '../types';

interface TabsProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeMode, onModeChange }) => {
  const commonButtonClasses = "w-full py-3 px-4 text-lg font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
  const activeButtonClasses = "bg-indigo-600 text-white shadow-lg";
  const inactiveButtonClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="grid grid-cols-3 gap-4 bg-gray-900 p-2 rounded-xl">
      <button
        onClick={() => onModeChange(Mode.GENERATE)}
        className={`${commonButtonClasses} ${activeMode === Mode.GENERATE ? activeButtonClasses : inactiveButtonClasses}`}
        aria-pressed={activeMode === Mode.GENERATE}
      >
        إنشاء صورة
      </button>
      <button
        onClick={() => onModeChange(Mode.EDIT)}
        className={`${commonButtonClasses} ${activeMode === Mode.EDIT ? activeButtonClasses : inactiveButtonClasses}`}
        aria-pressed={activeMode === Mode.EDIT}
      >
        تعديل صورة
      </button>
      <button
        onClick={() => onModeChange(Mode.VIDEO)}
        className={`${commonButtonClasses} ${activeMode === Mode.VIDEO ? activeButtonClasses : inactiveButtonClasses}`}
        aria-pressed={activeMode === Mode.VIDEO}
      >
        إنشاء فيديو
      </button>
    </div>
  );
};

export default Tabs;