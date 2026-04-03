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
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100"
        title="Khu vực giáo viên"
      >
        <Settings size={20} />
      </button>

      <div className="text-center mb-6 md:mb-8 mt-4 md:mt-0">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-indigo-100 rounded-full mb-4 text-indigo-600">
          <GraduationCap size={32} className="md:w-10 md:h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Ai Nhanh Hơn?</h1>
        <p className="text-sm md:text-base text-slate-500 flex items-center justify-center gap-2">
          <BookOpen size={16} className="md:w-[18px] md:h-[18px]" />
          Tiếng Anh Lớp 10 - Unit 8
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Họ và tên học sinh
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Nhập họ tên của bạn..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="className" className="block text-sm font-medium text-slate-700 mb-1">
            Lớp
          </label>
          <input
            type="text"
            id="className"
            required
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50"
            placeholder="VD: 10C4"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !className.trim() || isSubmitting}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
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
