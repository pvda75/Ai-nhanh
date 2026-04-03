import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

export default function TeacherLogin({ onLogin, onBack }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side PIN check
    if (pin === '123456') {
      onLogin();
    } else {
      setError('Mã PIN không chính xác!');
      setPin('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 md:p-12"
    >
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-8 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4 text-slate-600">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Khu Vực Giáo Viên</h2>
        <p className="text-slate-500 mt-1">Vui lòng nhập mã PIN để tiếp tục</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}
        
        <div>
          <input
            type="password"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono"
            placeholder="••••••"
            maxLength={6}
          />
          <p className="text-xs text-center text-slate-400 mt-2">Mã PIN mặc định: 123456</p>
        </div>

        <button
          type="submit"
          disabled={pin.length < 4}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
        >
          Đăng Nhập
        </button>
      </form>
    </motion.div>
  );
}
