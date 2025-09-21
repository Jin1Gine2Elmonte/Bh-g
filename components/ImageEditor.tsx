import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils';
import Spinner from './Spinner';
import GeneratedImage from './GeneratedImage';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          setError("حجم الملف كبير جدًا. الرجاء تحديد ملف أصغر من 4 ميجابايت.");
          return;
      }
      setSelectedFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImage(null); // Clear previous edit result
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('الرجاء رفع صورة أولاً.');
      return;
    }
    if (!prompt.trim()) {
      setError('الرجاء إدخال وصف للتعديل المطلوب.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Data = await fileToBase64(selectedFile);
      const imageUrl = await editImage(base64Data, selectedFile.type, prompt);
      setEditedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const FileUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
  
  const resetSelection = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setEditedImage(null);
    setError(null);
    setPrompt('');
  }


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-indigo-400">تعديل صورة موجودة</h2>
      
      {!originalImageUrl && (
          <div className="flex justify-center">
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 transition">
                <FileUploadIcon/>
                <p className="mt-2 text-sm text-gray-400">
                  <span className="font-semibold text-indigo-400">انقر للرفع</span> أو اسحب وأفلت
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP (بحد أقصى 4 ميجابايت)</p>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
            </label>
        </div>
      )}

      {originalImageUrl && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">الصورة الأصلية</h3>
            <img src={originalImageUrl} alt="Original preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
            <button onClick={resetSelection} className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                تغيير الصورة
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                صف التعديل الذي تريده
              </label>
              <textarea
                id="edit-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: اجعل الخلفية غابة مسحورة"
                rows={3}
                className="w-full bg-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim() || !selectedFile}
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              {isLoading ? <><Spinner size={20} /> جاري التعديل...</> : 'تعديل الصورة'}
            </button>
          </form>
        </div>
      )}

      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {editedImage && <GeneratedImage src={editedImage} alt={prompt || "Edited image"} />}
    </div>
  );
};

export default ImageEditor;