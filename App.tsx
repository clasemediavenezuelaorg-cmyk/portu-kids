
import React, { useState, useEffect } from 'react';
import { LESSONS } from './lib/lessons';
import { AppState, Lesson, UserProgress } from './types';
import Header from './components/Header';
import SpeechExercise from './components/SpeechExercise';
// Added Star to the list of icons imported from lucide-react to resolve the missing reference error.
import { CheckCircle2, Trophy, ArrowRight, Loader2, Star } from 'lucide-react';
import { supabase, loadProgress, saveProgress } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('map');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress>({
    stars: 0,
    completedLessons: []
  });

  useEffect(() => {
    const initProgress = async () => {
      // Try to load from Supabase if available
      const saved = await loadProgress();
      if (saved) {
        setProgress({
          stars: saved.stars || 0,
          completedLessons: saved.completed_lessons || []
        });
      } else {
        // Fallback to local storage
        const local = localStorage.getItem('amiguinho_progress');
        if (local) {
          try {
            setProgress(JSON.parse(local));
          } catch (e) {
            console.error("Error parsing local progress", e);
          }
        }
      }
      setLoading(false);
    };
    initProgress();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('amiguinho_progress', JSON.stringify(progress));
      saveProgress(progress.stars, progress.completedLessons);
    }
  }, [progress, loading]);

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setWordIndex(0);
    setView('lesson');
  };

  const handleWordSuccess = () => {
    setProgress(prev => ({ ...prev, stars: prev.stars + 1 }));
    
    if (activeLesson && wordIndex < activeLesson.words.length - 1) {
      setTimeout(() => {
        setWordIndex(prev => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        handleFinishLesson();
      }, 1000);
    }
  };

  const handleFinishLesson = () => {
    if (activeLesson) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...new Set([...prev.completedLessons, activeLesson.id])]
      }));
    }
    setView('celebration');
  };

  const goHome = () => {
    setView('map');
    setActiveLesson(null);
    setWordIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-blue-600 font-bold text-xl animate-pulse">¡Cargando tu aventura! 🦜</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header stars={progress.stars} onHome={goHome} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {view === 'map' && (
          <div className="flex flex-col items-center gap-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-blue-700 mb-4 drop-shadow-sm">
                ¿Qué quieres aprender hoy?
              </h2>
              <p className="text-blue-400 font-medium text-lg italic">Elige una categoría para empezar a hablar portugués</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
              {LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleStartLesson(lesson)}
                  className={`group relative flex flex-col items-center p-8 rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-lg border-b-8 border-r-4 ${lesson.color} text-white`}
                >
                  <span className="text-7xl mb-4 group-hover:animate-bounce transition-transform">{lesson.icon}</span>
                  <span className="text-2xl font-bold uppercase tracking-wide">{lesson.title}</span>
                  {progress.completedLessons.includes(lesson.id) && (
                    <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg border-2 border-green-500 animate-in zoom-in">
                      <CheckCircle2 className="text-green-500" size={32} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-20 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-dashed border-blue-200 w-full text-center">
              <p className="text-blue-400 text-xl font-medium">✨ ¡Más lecciones pronto! ✨</p>
            </div>
          </div>
        )}

        {view === 'lesson' && activeLesson && (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between text-blue-600 font-bold mb-2 px-2">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{activeLesson.icon}</span>
                  {activeLesson.title}
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  {wordIndex + 1} / {activeLesson.words.length}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <div 
                  className="h-full bg-green-500 transition-all duration-700 ease-out"
                  style={{ width: `${((wordIndex + 1) / activeLesson.words.length) * 100}%` }}
                />
              </div>
            </div>
            
            <SpeechExercise 
              word={activeLesson.words[wordIndex]} 
              onSuccess={handleWordSuccess}
            />
          </div>
        )}

        {view === 'celebration' && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-700">
            <div className="relative mb-8">
              <Trophy className="text-yellow-500 w-48 h-48 drop-shadow-2xl" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center animate-ping">
                <Trophy className="text-yellow-300 w-48 h-48 opacity-20" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-xl animate-bounce">
                <Star className="text-yellow-400 fill-yellow-400" size={40} />
              </div>
            </div>
            
            <h2 className="text-5xl font-black text-blue-700 mb-2 text-center">¡MUITO BEM!</h2>
            <p className="text-2xl text-blue-500 mb-12 text-center font-medium">Has dominado la lección de {activeLesson?.title}.</p>
            
            <button
              onClick={goHome}
              className="bg-green-500 hover:bg-green-600 text-white text-3xl font-bold px-12 py-6 rounded-3xl shadow-xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 border-b-8 border-green-700 group"
            >
              ¡SIGUIENTE AVENTURA! <ArrowRight size={40} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </main>

      <footer className="p-8 text-center">
        <p className="text-blue-300 text-sm font-medium opacity-70">
          Amiguinho Português • {new Date().getFullYear()} • ¡Aprendiendo con alegría!
        </p>
      </footer>
    </div>
  );
};

export default App;
