import React, { useState, useEffect, useRef } from 'react';
import { generateVideo } from '../services/geminiService';
import Spinner from './Spinner';
import GeneratedVideo from './GeneratedVideo';

const loadingMessages = [
    "تهيئة المصفوفة الإبداعية...",
    "تقديم وحدات البكسل الكونية...",
    "التشاور مع الأشباح الرقمية...",
    "تجميع الفوتونات في تسلسل...",
    "لحظة من فضلك، الذكاء الاصطناعي يتأمل...",
    "كاد أن ينتهي، الذكاء الاصطناعي يضيف اللمسات الأخيرة...",
];

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');
    const messageIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading) {
            setProgressMessage(loadingMessages[0]);
            let messageIndex = 1;
            messageIntervalRef.current = window.setInterval(() => {
                setProgressMessage(loadingMessages[messageIndex % loadingMessages.length]);
                messageIndex++;
            }, 5000);
        } else if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
            messageIntervalRef.current = null;
        }
        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [isLoading]);

    useEffect(() => {
        // Cleanup object URL to prevent memory leaks
        return () => {
            if (generatedVideo && generatedVideo.startsWith('blob:')) {
                URL.revokeObjectURL(generatedVideo);
            }
        };
    }, [generatedVideo]);

    const handleProgressUpdate = (message: string) => {
        setProgressMessage(message);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('الرجاء إدخال وصف للفيديو.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedVideo(null); // This triggers cleanup for the old video blob URL

        try {
            const videoApiUrl = await generateVideo(prompt, handleProgressUpdate);
            
            handleProgressUpdate("جاري تحميل الفيديو للعرض...");
            const response = await fetch(videoApiUrl);
            if (!response.ok) {
                throw new Error(`فشل تحميل بيانات الفيديو (الحالة: ${response.status})`);
            }
            const videoBlob = await response.blob();
            const videoObjectUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideo(videoObjectUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <Spinner size={60} />
                <p className="text-xl font-semibold text-indigo-300">جاري إنشاء الفيديو...</p>
                <p className="text-gray-400 animate-pulse">{progressMessage}</p>
                <p className="text-sm text-gray-500 mt-2">قد تستغرق هذه العملية عدة دقائق. شكرًا لصبرك.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-indigo-400">إنشاء فيديو جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                        أدخل وصفًا للفيديو الذي تريد إنشاءه
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="مثال: مجسم نيون لقط يقود سيارة بأقصى سرعة"
                        rows={4}
                        className="w-full bg-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ملاحظة: سيتم إنشاء الفيديو بدون صوت.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                >
                    إنشاء الفيديو
                </button>
            </form>

            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {generatedVideo && <GeneratedVideo src={generatedVideo} alt={prompt} />}
        </div>
    );
};

export default VideoGenerator;