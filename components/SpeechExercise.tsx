
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, MicOff, Sparkles } from 'lucide-react';
import { Word } from '../types';
import { getGeminiFeedback } from '../services/geminiService';

interface SpeechExerciseProps {
  word: Word;
  onSuccess: () => void;
}

const SpeechExercise: React.FC<SpeechExerciseProps> = ({ word, onSuccess }) => {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string>('¡Oye y repite!');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [geminiAdvice, setGeminiAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';

      recognition.onresult = async (event: any) => {
        const spoken = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Spoken:', spoken, 'Target:', word.portuguese);
        
        if (spoken.includes(word.portuguese.toLowerCase())) {
          handleSuccess();
        } else {
          handleFailure();
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setFeedback('¡Oh no! No pude oírte bien. 🎙️');
      };

      recognitionRef.current = recognition;
    }
  }, [word]);

  const handleSuccess = async () => {
    setIsCorrect(true);
    setFeedback('¡PERFECTO! 🎉');
    setIsLoadingAdvice(true);
    const advice = await getGeminiFeedback(word.portuguese, true);
    setGeminiAdvice(advice);
    setIsLoadingAdvice(false);
    
    setTimeout(() => {
      onSuccess();
      resetState();
    }, 4500);
  };

  const handleFailure = async () => {
    setIsCorrect(false);
    setFeedback('¡Casi! Inténtalo de nuevo 🤔');
    setIsLoadingAdvice(true);
    const advice = await getGeminiFeedback(word.portuguese, false);
    setGeminiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  const resetState = () => {
    setIsCorrect(null);
    setGeminiAdvice('');
    setFeedback('¡Oye y repite!');
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.portuguese);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz. ¡Prueba en Chrome!');
      return;
    }
    setGeminiAdvice('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-xl w-full max-w-md mx-auto border-4 border-yellow-300">
      {/* Contenedor del Emoji en lugar de Imagen */}
      <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl border-4 border-blue-100 shadow-inner bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <span className="text-[120px] select-none transition-transform duration-500 hover:scale-125 drop-shadow-lg">
          {word.image}
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-4 text-center">
          <p className="text-white text-3xl font-bold uppercase tracking-wider">{word.portuguese}</p>
          <p className="text-blue-100 text-lg">({word.spanish})</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={playAudio}
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-full shadow-lg transition-transform active:scale-90"
          title="Escuchar palabra"
        >
          <Volume2 size={40} />
        </button>
        
        <button 
          onClick={startListening}
          disabled={isListening}
          className={`${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white p-6 rounded-full shadow-lg transition-transform active:scale-90`}
          title="Hablar ahora"
        >
          {isListening ? <Mic size={40} /> : <MicOff size={40} />}
        </button>
      </div>

      <div className={`text-2xl font-bold mb-4 text-center ${isCorrect === true ? 'text-green-500' : isCorrect === false ? 'text-red-500' : 'text-blue-600'}`}>
        {feedback}
      </div>

      {isLoadingAdvice ? (
        <div className="flex items-center gap-2 text-gray-400 animate-pulse">
          <Sparkles className="animate-spin" />
          <span>Bico está pensando...</span>
        </div>
      ) : geminiAdvice && (
        <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200 relative mt-4">
          <div className="absolute -top-10 -left-2 text-4xl animate-bounce-slow">🦜</div>
          <p className="text-yellow-800 text-lg text-center italic leading-tight">"{geminiAdvice}"</p>
        </div>
      )}
    </div>
  );
};

export default SpeechExercise;
