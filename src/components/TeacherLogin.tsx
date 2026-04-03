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
        className="absolute top-4 left-4 p-2 text-violet-400 hover:text-violet-700 transition-colors rounded-full hover:bg-violet-50"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-8 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl mb-4 text-violet-600 shadow-inner">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-indigo-950">Khu Vực Giáo Viên</h2>
        <p className="text-violet-600 mt-1 font-medium">Vui lòng nhập mã PIN để tiếp tục</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100 text-center font-medium">
            {error}
          </div>
        )}
        
        <div>
          <input
            type="password"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] rounded-xl border-2 border-violet-100 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-mono bg-white/80 hover:border-violet-200 text-indigo-950"
            placeholder="••••••"
            maxLength={6}
          />
          <p className="text-xs text-center text-violet-400 mt-2 font-medium">Mã PIN mặc định: 123456</p>
        </div>

        <button
          type="submit"
          disabled={pin.length < 4}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-violet-300 disabled:to-fuchsia-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-violet-200/50"
        >
          Đăng Nhập
        </button>
      </form>
    </motion.div>
  );
}
