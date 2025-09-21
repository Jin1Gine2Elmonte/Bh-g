
import React from 'react';

interface GeneratedImageProps {
  src: string;
  alt: string;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ src, alt }) => {
  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg animate-fade-in">
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-300">النتيجة</h3>
      <div className="relative group">
        <img
          src={src}
          alt={alt}
          className="rounded-lg shadow-lg mx-auto max-w-full"
        />
        <a
          href={src}
          download="generated-image.png"
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="text-white text-xl font-bold bg-indigo-600 px-6 py-3 rounded-full">
            تحميل
          </span>
        </a>
      </div>
    </div>
  );
};

export default GeneratedImage;
