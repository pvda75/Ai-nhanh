import React, { useState, useEffect } from 'react';
import { StudentResult } from '../types';
import { LogOut, RefreshCw, Download, Trophy, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onLogout: () => void;
}

export default function TeacherDashboard({ onLogout }: Props) {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string, name: string}>({ isOpen: false, id: '', name: '' });

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'results'));
      const querySnapshot = await getDocs(q);
      const data: StudentResult[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as StudentResult);
      });
      
      // Sort client-side: Score descending, then Time Taken ascending
      data.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeTaken - b.timeTaken;
      });
      
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}p ${s}s`;
  };

  const exportToCSV = () => {
    const headers = ['Hạng', 'Họ Tên', 'Lớp', 'Điểm', 'Thời Gian (s)', 'Ngày thi'];
    const csvContent = [
      headers.join(','),
      ...results.map((r, i) => [
        i + 1,
        `"${r.name}"`,
        `"${r.className}"`,
        r.score,
        r.timeTaken,
        r.createdAt ? new Date(r.createdAt.toDate()).toLocaleString('vi-VN') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ket_qua_10C4_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteDoc(doc(db, 'results', deleteModal.id));
      setResults(results.filter(r => r.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: '', name: '' });
    } catch (err) {
      console.error(err);
      setError('Không thể xoá kết quả. Vui lòng thử lại.');
      setDeleteModal({ isOpen: false, id: '', name: '' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full max-h-[80vh] relative"
    >
      <div className="bg-slate-900 text-white p-4 md:p-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold">Bảng Xếp Hạng</h2>
          <p className="text-slate-400 text-sm">Lớp 10C4 - Unit 8</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchResults}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Làm mới"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={exportToCSV}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2"
            title="Xuất CSV"
          >
            <Download size={18} />
            <span className="hidden sm:inline text-sm font-medium">Xuất File</span>
          </button>
          <button 
            onClick={onLogout}
            className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors ml-2"
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <RefreshCw size={32} className="animate-spin mb-4" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            <Trophy size={48} className="mb-4 text-slate-300" />
            <p>Chưa có học sinh nào hoàn thành bài thi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={result.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-slate-200 text-slate-700' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-slate-50 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{result.name}</div>
                  <div className="text-xs text-slate-500">Lớp {result.className}</div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Clock size={12} /> Thời gian
                    </div>
                    <div className="font-mono text-sm text-slate-700">{formatTime(result.timeTaken)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Điểm</div>
                    <div className="font-bold text-indigo-600 text-lg">{result.score}</div>
                  </div>
                  <button 
                    onClick={() => setDeleteModal({ isOpen: true, id: result.id!, name: result.name })}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                    title="Xoá kết quả"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-4 mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Xác nhận xoá</h3>
              <p className="text-slate-500 text-center mb-6 text-sm">
                Bạn có chắc chắn muốn xoá kết quả của học sinh <strong className="text-slate-800">{deleteModal.name}</strong>? 
                Học sinh này sẽ có thể làm lại bài. Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Xoá
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
