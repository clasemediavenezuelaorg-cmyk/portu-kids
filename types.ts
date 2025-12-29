
export interface Word {
  id: string;
  portuguese: string;
  spanish: string;
  image: string;
  category: string;
}

export interface Lesson {
  id: string;
  title: string;
  icon: string;
  color: string;
  words: Word[];
}

export type AppState = 'map' | 'lesson' | 'celebration';

export interface UserProgress {
  stars: number;
  completedLessons: string[];
}
