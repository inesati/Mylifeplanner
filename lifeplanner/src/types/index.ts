export interface Activity {
  id: string;
  type: 'Trabajo' | 'Estudio' | 'Gym' | 'Hobby' | 'Libre';
  color: string;
}

export interface TimeBlock {
  day: string;
  hour: string;
  activity: Activity['type'];
}

export interface DayNote {
  day: string;
  note: string;
}

export interface MoodEntry {
  date: string;
  mood: 'Feliz' | 'Triste' | 'Estresado' | 'Motivado' | 'Cansado';
  note?: string;
}

export interface Workout {
  id: string;
  day: string;
  exercises: Exercise[];
  notes: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface Diet {
  id: string;
  day: string;
  meals: Meal[];
  notes: string;
}

export interface Meal {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  description: string;
}

export interface Hobby {
  id: string;
  name: string;
  category: 'Pintar' | 'Leer' | 'Bicicleta' | 'Skin Care' | 'Health Care' | 'Otro';
  progress: number;
  notes: string;
  lastActivity: string;
}

export interface PersonalProject {
  id: string;
  name: string;
  description: string;
  status: 'Inicio' | 'En Progreso' | 'Avanzado' | 'Completado';
  progress: number;
  notes: string;
  createdAt: string;
}

export interface DailyNote {
  id: string;
  date: string;
  content: string;
  mood?: string;
}