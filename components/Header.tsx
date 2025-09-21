
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-gray-900/50 border-b border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          مولد ومحرر الصور بالذكاء الاصطناعي
        </h1>
        <p className="mt-2 text-gray-400">
          أنشئ صورًا مذهلة وعدّلها بوصف نصي بسيط
        </p>
      </div>
    </header>
  );
};

export default Header;
