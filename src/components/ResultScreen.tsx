import React from 'react';
import { StudentInfo } from '../types';
import { Trophy, Clock, Target, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  score: number;
  timeTaken: number;
  studentInfo: StudentInfo;
  onBackToHome: () => void;
}

export default function ResultScreen({ score, timeTaken, studentInfo, onBackToHome }: Props) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}p ${s}s`;
  };

  const isExcellent = score >= 8;
  const isGood = score >= 5 && score < 8;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 md:p-12 text-center"
    >
      <div className="mb-6 md:mb-8 relative inline-block">
        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
          isExcellent ? 'bg-yellow-400 text-yellow-900' : 
          isGood ? 'bg-blue-400 text-blue-900' : 'bg-slate-200 text-slate-600'
        }`}>
          <Trophy size={48} className="md:w-16 md:h-16" />
        </div>
        <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 md:px-4 py-1 rounded-full shadow-md font-bold text-sm md:text-base text-slate-800 whitespace-nowrap">
          {studentInfo.name}
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">
        {isExcellent ? 'Xuất Sắc!' : isGood ? 'Làm Tốt Lắm!' : 'Cố Gắng Hơn Nhé!'}
      </h2>
      <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8">Bạn đã hoàn thành bài kiểm tra Unit 8</p>

      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-sm mx-auto mb-8 md:mb-10">
        <div className="bg-indigo-50 p-3 md:p-4 rounded-2xl">
          <div className="flex items-center justify-center text-indigo-600 mb-1 md:mb-2">
            <Target size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-indigo-900 mb-1">{score}/10</div>
          <div className="text-[10px] md:text-xs font-medium text-indigo-600 uppercase tracking-wider">Điểm Số</div>
        </div>
        <div className="bg-emerald-50 p-3 md:p-4 rounded-2xl">
          <div className="flex items-center justify-center text-emerald-600 mb-1 md:mb-2">
            <Clock size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-900 mb-1">{formatTime(timeTaken)}</div>
          <div className="text-[10px] md:text-xs font-medium text-emerald-600 uppercase tracking-wider">Thời Gian</div>
        </div>
      </div>

      <button
        onClick={onBackToHome}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 md:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors active:scale-[0.98]"
      >
        <Home size={20} />
        Về Trang Chủ
      </button>
    </motion.div>
  );
}
