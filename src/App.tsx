import React, { useState, useEffect } from 'react';
import { ViewState, StudentInfo } from './types';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { playFinishSound } from './lib/audio';
import confetti from 'canvas-confetti';

export default function App() {
  const [view, setView] = useState<ViewState>('start');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async (info: StudentInfo) => {
    setError('');
    setIsSubmitting(true);
    try {
      const studentId = `${info.name.trim()}_${info.className.trim()}`.replace(/\s+/g, '_').toLowerCase();
      const docRef = doc(db, 'results', studentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setError('Học sinh này đã làm bài! Mỗi học sinh chỉ được chơi 1 lần.');
        setIsSubmitting(false);
        return;
      }

      setStudentInfo(info);
      setView('quiz');
    } catch (err: any) {
      console.error(err);
      setError('Có lỗi xảy ra khi kiểm tra thông tin. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizFinish = async (finalScore: number, time: number) => {
    setScore(finalScore);
    setTimeTaken(time);
    setIsSubmitting(true);
    
    if (studentInfo) {
      try {
        const studentId = `${studentInfo.name.trim()}_${studentInfo.className.trim()}`.replace(/\s+/g, '_').toLowerCase();
        const docRef = doc(db, 'results', studentId);
        await setDoc(docRef, {
          name: studentInfo.name.trim(),
          className: studentInfo.className.trim(),
          score: finalScore,
          timeTaken: time,
          createdAt: serverTimestamp()
        });
        
        playFinishSound();
        if (finalScore >= 8) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        setView('result');
      } catch (err: any) {
        console.error(err);
        setError('Có lỗi xảy ra khi lưu kết quả. Vui lòng báo cho giáo viên.');
        // Still show result even if save fails, but maybe alert them
        setView('result');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-0 md:p-4 font-sans text-slate-800">
      <div className="w-full h-[100dvh] md:h-auto md:max-w-2xl bg-white md:rounded-2xl shadow-none md:shadow-xl overflow-hidden relative flex flex-col">
        {view === 'start' && (
          <StartScreen 
            onStart={handleStart} 
            onTeacherLogin={() => setView('teacher_login')} 
            error={error}
            isSubmitting={isSubmitting}
          />
        )}
        {view === 'quiz' && studentInfo && (
          <QuizScreen 
            studentInfo={studentInfo} 
            onFinish={handleQuizFinish} 
          />
        )}
        {view === 'result' && studentInfo && (
          <ResultScreen 
            score={score} 
            timeTaken={timeTaken} 
            studentInfo={studentInfo}
            onBackToHome={() => {
              setStudentInfo(null);
              setScore(0);
              setTimeTaken(0);
              setView('start');
            }}
          />
        )}
        {view === 'teacher_login' && (
          <TeacherLogin 
            onLogin={() => setView('teacher_dashboard')} 
            onBack={() => setView('start')} 
          />
        )}
        {view === 'teacher_dashboard' && (
          <TeacherDashboard 
            onLogout={() => setView('start')} 
          />
        )}
      </div>
    </div>
  );
}
