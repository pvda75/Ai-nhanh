import React, { useState } from 'react';
import { StudentInfo } from '../types';
import { Play, BookOpen, GraduationCap, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onStart: (info: StudentInfo) => void;
  onTeacherLogin: () => void;
  error?: string;
  isSubmitting?: boolean;
}

export default function StartScreen({ onStart, onTeacherLogin, error, isSubmitting }: Props) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('10C4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && className.trim()) {
      onStart({ name, className });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-12"
    >
      <button 
        onClick={onTeacherLogin}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-violet-600 transition-colors rounded-full hover:bg-violet-50"
        title="Khu vực giáo viên"
      >
        <Settings size={20} />
      </button>

      <div className="text-center mb-6 md:mb-8 mt-4 md:mt-0">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl md:rounded-3xl mb-5 text-white shadow-lg shadow-violet-200/50 rotate-3 hover:rotate-0 transition-transform">
          <GraduationCap size={32} className="md:w-10 md:h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-fuchsia-600 mb-3">Ai Nhanh Hơn?</h1>
        <p className="text-sm md:text-base font-medium text-violet-600 flex items-center justify-center gap-2">
          <BookOpen size={16} className="md:w-[18px] md:h-[18px] text-violet-500" />
          Tiếng Anh Lớp 10 - Unit 8
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 text-center font-medium">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-indigo-900 mb-1.5">
            Họ và tên học sinh
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-violet-100 focus:ring-0 focus:border-violet-500 outline-none transition-all bg-white/80 focus:bg-white font-medium text-indigo-950 placeholder-violet-300"
            placeholder="Nhập họ tên của bạn..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="className" className="block text-sm font-bold text-indigo-900 mb-1.5">
            Lớp
          </label>
          <input
            type="text"
            id="className"
            required
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-violet-100 focus:ring-0 focus:border-violet-500 outline-none transition-all bg-white/80 focus:bg-white font-medium text-indigo-950 placeholder-violet-300"
            placeholder="VD: 10C4"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !className.trim() || isSubmitting}
          className="w-full py-4 mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-xl shadow-violet-200/50"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Play size={24} fill="currentColor" />
              Bắt Đầu Chơi
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
