
import React, { useState, useEffect } from 'react';
import { LESSONS } from './lib/lessons';
import { AppState, Lesson, UserProgress } from './types';
import Header from './components/Header';
import SpeechExercise from './components/SpeechExercise';
import { CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('map');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress>({
    stars: 0,
    completedLessons: []
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header stars={progress.stars} onHome={goHome} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {view === 'map' && (
          <div className="flex flex-col items-center gap-12 py-10">
            <h2 className="text-4xl font-black text-blue-700 text-center mb-4">
              ¿Qué quieres aprender hoy?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleStartLesson(lesson)}
                  className={`group relative flex flex-col items-center p-8 rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-lg border-b-8 border-r-4 ${lesson.color} text-white`}
                >
                  <span className="text-7xl mb-4 group-hover:animate-bounce">{lesson.icon}</span>
                  <span className="text-2xl font-bold uppercase tracking-wide">{lesson.title}</span>
                  {progress.completedLessons.includes(lesson.id) && (
                    <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg">
                      <CheckCircle2 className="text-green-500" size={32} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-20 p-8 bg-blue-100 rounded-3xl border-4 border-dashed border-blue-300 w-full text-center">
              <p className="text-blue-500 text-xl font-medium">¡Pronto más lecciones divertidas!</p>
            </div>
          </div>
        )}

        {view === 'lesson' && activeLesson && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between text-blue-600 font-bold mb-2 px-2">
                <span>Lección: {activeLesson.title}</span>
                <span>{wordIndex + 1} / {activeLesson.words.length}</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 ease-out"
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
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <Trophy className="text-yellow-500 w-48 h-48 mb-8" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center animate-ping">
                <Trophy className="text-yellow-300 w-48 h-48 opacity-20" />
              </div>
            </div>
            
            <h2 className="text-5xl font-black text-blue-700 mb-4 text-center">¡SÚPER BIEN!</h2>
            <p className="text-2xl text-blue-500 mb-12 text-center">Has completado la lección de {activeLesson?.title}.</p>
            
            <button
              onClick={goHome}
              className="bg-green-500 hover:bg-green-600 text-white text-3xl font-bold px-12 py-6 rounded-3xl shadow-xl flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 border-b-8 border-green-700"
            >
              ¡SIGAMOS JUGANDO! <ArrowRight size={40} />
            </button>
          </div>
        )}
      </main>

      <footer className="p-6 text-center text-blue-300 text-sm">
        Construido con ❤️ para pequeños exploradores del idioma
      </footer>
    </div>
  );
};

export default App;
