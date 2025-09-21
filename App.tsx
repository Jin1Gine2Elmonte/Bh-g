
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import { Mode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.GENERATE);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Tabs activeMode={mode} onModeChange={handleModeChange} />
          <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
            {mode === Mode.GENERATE ? <ImageGenerator /> : <ImageEditor />}
          </div>
        </div>
        <footer className="text-center text-gray-500 mt-12 pb-6">
          <p>مدعوم بواسطة Gemini AI</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
