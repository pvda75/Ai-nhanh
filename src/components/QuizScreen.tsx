import React, { useState, useEffect } from 'react';
import { StudentInfo } from '../types';
import { questions } from '../data/questions';
import { Timer, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playCorrectSound, playIncorrectSound } from '../lib/audio';

interface Props {
  studentInfo: StudentInfo;
  onFinish: (score: number, timeTaken: number) => void;
}

export default function QuizScreen({ studentInfo, onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const question = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.correctAnswer) {
      setScore(prev => prev + 2); // 2 points per question
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onFinish(score, timeElapsed);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full min-h-[100dvh] md:min-h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-3 md:p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm md:text-base shadow-inner">
            {studentInfo.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm md:text-base max-w-[100px] md:max-w-[200px] truncate">{studentInfo.name}</div>
            <div className="text-[10px] md:text-xs text-violet-200 font-medium">Lớp {studentInfo.className}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-1.5 bg-white/20 px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-mono text-sm backdrop-blur-sm">
            <Timer size={14} className="md:w-4 md:h-4" />
            {formatTime(timeElapsed)}
          </div>
          <div className="font-bold bg-white text-violet-700 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-sm md:text-base shadow-sm">
            {score}/10 đ
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-100 h-1 md:h-1.5">
        <div 
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="flex-1 p-4 md:p-8 flex flex-col overflow-y-auto">
        <div className="mb-6 md:mb-8">
          <div className="text-xs md:text-sm font-bold text-violet-600 mb-1.5 md:mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-md">Câu hỏi {currentIndex + 1} / {questions.length}</span>
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-indigo-950 leading-relaxed">
            {question.text}
          </h2>
        </div>

        <div className="space-y-2.5 md:space-y-3 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5 md:space-y-3 pb-20 md:pb-0"
            >
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === question.correctAnswer;
                
                let btnClass = "w-full text-left p-3.5 md:p-4 rounded-2xl border-2 transition-all flex items-center justify-between shadow-sm ";
                
                if (!isAnswered) {
                  btnClass += "border-violet-100 bg-white hover:border-violet-400 hover:shadow-md hover:bg-violet-50/50 text-indigo-900 active:scale-[0.98]";
                } else {
                  if (isCorrect) {
                    btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-emerald-100";
                  } else if (isSelected && !isCorrect) {
                    btnClass += "border-rose-500 bg-rose-50 text-rose-800 shadow-rose-100";
                  } else {
                    btnClass += "border-violet-50 bg-violet-50/30 text-violet-300 opacity-60";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    <span className="font-medium text-base md:text-lg">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0 ml-2" size={20} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500 shrink-0 ml-2" size={20} />}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="fixed md:static bottom-0 left-0 right-0 p-4 md:p-0 md:mt-8 md:pt-6 md:border-t md:border-violet-100 bg-white md:bg-transparent shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none flex justify-end z-20">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`w-full md:w-auto px-8 py-3.5 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isAnswered 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-200/50' 
                : 'bg-violet-100 text-violet-400 cursor-not-allowed'
            }`}
          >
            {currentIndex === questions.length - 1 ? 'Hoàn Thành' : 'Câu Tiếp Theo'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
