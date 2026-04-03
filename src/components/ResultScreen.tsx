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
          isExcellent ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-amber-200/50' : 
          isGood ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-blue-200/50' : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600'
        }`}>
          <Trophy size={48} className="md:w-16 md:h-16" />
        </div>
        <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 md:px-6 py-1.5 rounded-full shadow-lg font-bold text-sm md:text-base text-violet-700 whitespace-nowrap border border-violet-50">
          {studentInfo.name}
        </div>
      </div>

      <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-fuchsia-600 mb-1 md:mb-2 mt-4">
        {isExcellent ? 'Xuất Sắc!' : isGood ? 'Làm Tốt Lắm!' : 'Cố Gắng Hơn Nhé!'}
      </h2>
      <p className="text-sm md:text-base font-medium text-slate-500 mb-6 md:mb-8">Bạn đã hoàn thành bài kiểm tra Unit 8</p>

      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-sm mx-auto mb-8 md:mb-10">
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 md:p-5 rounded-2xl border border-violet-100 shadow-sm">
          <div className="flex items-center justify-center text-violet-600 mb-2">
            <Target size={24} className="md:w-7 md:h-7" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-violet-900 mb-1">{score}/10</div>
          <div className="text-[10px] md:text-xs font-bold text-violet-600 uppercase tracking-wider">Điểm Số</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-emerald-50 p-4 md:p-5 rounded-2xl border border-cyan-100 shadow-sm">
          <div className="flex items-center justify-center text-emerald-600 mb-2">
            <Clock size={24} className="md:w-7 md:h-7" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-emerald-900 mb-1">{formatTime(timeTaken)}</div>
          <div className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-wider">Thời Gian</div>
        </div>
      </div>

      <button
        onClick={onBackToHome}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 md:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-xl shadow-violet-200/50"
      >
        <Home size={20} />
        Về Trang Chủ
      </button>
    </motion.div>
  );
}
