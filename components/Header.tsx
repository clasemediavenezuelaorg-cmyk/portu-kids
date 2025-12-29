
import React from 'react';
import { Star, Home } from 'lucide-react';

interface HeaderProps {
  stars: number;
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ stars, onHome }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b-4 border-yellow-400">
      <button 
        onClick={onHome}
        className="bg-blue-100 hover:bg-blue-200 p-2 rounded-2xl transition-colors"
      >
        <Home className="text-blue-600" size={32} />
      </button>
      
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-black text-blue-600 tracking-tight">AMIGUINHO</h1>
        <div className="text-xs text-blue-400 font-bold uppercase tracking-widest -mt-1">Português</div>
      </div>

      <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-sm">
        <Star className="text-yellow-500 fill-yellow-500" size={24} />
        <span className="text-xl font-bold text-yellow-700">{stars}</span>
      </div>
    </header>
  );
};

export default Header;
