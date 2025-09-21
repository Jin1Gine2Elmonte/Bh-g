
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio } from '../types';
import Spinner from './Spinner';
import GeneratedImage from './GeneratedImage';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aspectRatios: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: 'مربع (1:1)' },
    { value: '16:9', label: 'أفقي (16:9)' },
    { value: '9:16', label: 'عمودي (9:16)' },
    { value: '4:3', label: 'أفقي (4:3)' },
    { value: '3:4', label: 'عمودي (3:4)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('الرجاء إدخال وصف للصورة.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-400">إنشاء صورة جديدة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            أدخل وصفًا للصورة التي تريد إنشاءها
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثال: قطة رائد فضاء تطفو في مجرة حلزونية"
            rows={4}
            className="w-full bg-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
            نسبة العرض إلى الارتفاع
          </label>
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            className="w-full bg-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            disabled={isLoading}
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          {isLoading ? <><Spinner size={20} /> جاري الإنشاء...</> : 'إنشاء الصورة'}
        </button>
      </form>

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {generatedImage && <GeneratedImage src={generatedImage} alt={prompt} />}
    </div>
  );
};

export default ImageGenerator;
