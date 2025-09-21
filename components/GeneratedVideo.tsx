import React from 'react';

interface GeneratedVideoProps {
  src: string;
  alt: string;
}

const GeneratedVideo: React.FC<GeneratedVideoProps> = ({ src, alt }) => {
  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg animate-fade-in">
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-300">النتيجة</h3>
      <div className="relative group">
        <video
          src={src}
          controls
          className="rounded-lg shadow-lg mx-auto max-w-full"
          aria-label={alt}
        >
          متصفحك لا يدعم علامة الفيديو.
        </video>
        <a
          href={src}
          download="generated-video.mp4"
          className="mt-4 inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          تحميل الفيديو
        </a>
      </div>
    </div>
  );
};

export default GeneratedVideo;