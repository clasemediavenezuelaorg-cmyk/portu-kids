
import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'animals',
    title: 'Animais',
    icon: '🐾',
    color: 'bg-orange-400',
    words: [
      { id: 'a1', portuguese: 'Gato', spanish: 'Gato', image: '🐱', category: 'animals' },
      { id: 'a2', portuguese: 'Cachorro', spanish: 'Perro', image: '🐶', category: 'animals' },
      { id: 'a3', portuguese: 'Pássaro', spanish: 'Pájaro', image: '🐦', category: 'animals' },
      { id: 'a4', portuguese: 'Elefante', spanish: 'Elefante', image: '🐘', category: 'animals' },
    ]
  },
  {
    id: 'colors',
    title: 'Cores',
    icon: '🎨',
    color: 'bg-purple-400',
    words: [
      { id: 'c1', portuguese: 'Vermelho', spanish: 'Rojo', image: '🔴', category: 'colors' },
      { id: 'c2', portuguese: 'Azul', spanish: 'Azul', image: '🔵', category: 'colors' },
      { id: 'c3', portuguese: 'Amarelo', spanish: 'Amarillo', image: '🟡', category: 'colors' },
      { id: 'c4', portuguese: 'Verde', spanish: 'Verde', image: '🟢', category: 'colors' },
    ]
  },
  {
    id: 'fruits',
    title: 'Frutas',
    icon: '🍎',
    color: 'bg-red-400',
    words: [
      { id: 'f1', portuguese: 'Maçã', spanish: 'Manzana', image: '🍎', category: 'fruits' },
      { id: 'f2', portuguese: 'Banana', spanish: 'Plátano', image: '🍌', category: 'fruits' },
      { id: 'f3', portuguese: 'Laranja', spanish: 'Naranja', image: '🍊', category: 'fruits' },
      { id: 'f4', portuguese: 'Morango', spanish: 'Fresa', image: '🍓', category: 'fruits' },
    ]
  }
];
