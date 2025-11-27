import React, { useState, useRef } from 'react';
import { Task, TaskType } from '../types';
import { Camera, Mic, Check, Clock, Upload, BookOpen } from 'lucide-react';
import { generateDailyEnglishSentence } from '../services/geminiService';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Form States
  const [bookName, setBookName] = useState(task.bookName || '');
  const [readingDuration, setReadingDuration] = useState(task.duration || 15);
  const [videoPreview, setVideoPreview] = useState<string | null>(task.videoPreviewUrl || null);
  const [audioUrl, setAudioUrl] = useState<string | null>(task.audioUrl || null);
  const [sentence, setSentence] = useState<{en: string, zh: string} | null>(
    task.englishSentence ? { en: task.englishSentence, zh: task.englishTranslation || '' } : null
  );

  // Simulation Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    if (task.status === 'todo' || task.status === 'rejected') setIsExpanding(!isExpanding);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload with a fake object URL for preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const generateSentence = async () => {
    setLoadingAI(true);
    const result = await generateDailyEnglishSentence();
    setSentence({ en: result.sentence, zh: result.translation });
    setLoadingAI(false);
  };

  const simulateRecording = () => {
    // Simulate recording delay
    setTimeout(() => {
        setAudioUrl('dummy-audio-url');
        alert("Recording simulated! (Microphone API requires HTTPS/localhost)");
    }, 1000);
  };

  const handleSubmit = () => {
    const updated: Task = {
      ...task,
      status: 'pending',
      submissionTime: new Date().toISOString(),
      bookName: task.type === TaskType.READING ? bookName : undefined,
      duration: task.type === TaskType.READING ? readingDuration : undefined,
      videoPreviewUrl: videoPreview || undefined,
      englishSentence: sentence?.en,
      englishTranslation: sentence?.zh,
      audioUrl: audioUrl || undefined
    };
    onUpdate(updated);
    setIsExpanding(false);
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-white border-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'approved': return <Check size={18} />;
      case 'pending': return <Clock size={18} />;
      default: return <span className="font-bold text-lg text-indigo-500">¥{task.reward.toFixed(2)}</span>;
    }
  };

  return (
    <div className={`mb-4 rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden ${getStatusColor()}`}>
      
      {/* Header / Summary */}
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={handleExpand}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${task.type === TaskType.READING ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                {task.type === TaskType.READING ? <BookOpen size={20} /> : <Mic size={20} />}
            </div>
            <div>
                <h3 className="font-bold text-gray-800">{task.title}</h3>
                <p className="text-xs text-gray-500">{task.description}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {task.status !== 'todo' && (
                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    {task.status}
                </span>
            )}
            <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shadow-sm">
                {getStatusIcon()}
            </div>
        </div>
      </div>

      {/* Expanded Content (Inputs) */}
      {(isExpanding || task.status === 'rejected') && (
        <div className="px-4 pb-4 border-t border-gray-100/50 pt-4 bg-white/50 animate-fadeIn">
          
          {/* Reading Task Inputs */}
          {task.type === TaskType.READING && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Book Name (Optional)</label>
                <input 
                  type="text" 
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="e.g. Harry Potter"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              
              <div className="flex gap-2">
                {[15, 30, 45].map(min => (
                    <button 
                        key={min}
                        onClick={() => setReadingDuration(min)}
                        className={`flex-1 py-2 text-xs rounded-lg border ${readingDuration === min ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        {min} Mins
                    </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Upload Proof (Video/Photo)</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
                >
                    {videoPreview ? (
                        <img src={videoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <Camera size={24} className="mb-2" />
                            <span className="text-xs">Tap to record/upload</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        accept="image/*,video/*" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleVideoUpload}
                    />
                </div>
              </div>
            </div>
          )}

          {/* English Task Inputs */}
          {task.type === TaskType.ENGLISH && (
            <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-xl relative">
                    {loadingAI ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : sentence ? (
                        <div className="text-center">
                            <p className="text-lg font-bold text-indigo-900 mb-1">"{sentence.en}"</p>
                            <p className="text-sm text-indigo-600">{sentence.zh}</p>
                            <button onClick={generateSentence} className="text-[10px] text-indigo-400 mt-2 underline">Regenerate</button>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                             <button 
                                onClick={generateSentence}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg shadow-md active:scale-95 transition-transform"
                            >
                                Generate AI Challenge
                            </button>
                        </div>
                    )}
                </div>

                {sentence && (
                    <button 
                        onClick={simulateRecording}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${audioUrl ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 active:bg-red-100 active:text-red-500'}`}
                    >
                        {audioUrl ? <><Check size={20}/> Recorded</> : <><Mic size={20}/> Hold to Record</>}
                    </button>
                )}
            </div>
          )}

          {/* Submit Action */}
          <div className="mt-6">
            <button 
                onClick={handleSubmit}
                disabled={task.type === TaskType.READING && !videoPreview || task.type === TaskType.ENGLISH && !audioUrl}
                className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
                Submit for Review
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
