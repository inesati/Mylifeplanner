import React from 'react';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import { MoodEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MOODS = [
  { type: 'Feliz', color: 'bg-yellow-100 text-yellow-800', emoji: '😊' },
  { type: 'Triste', color: 'bg-blue-100 text-blue-800', emoji: '😢' },
  { type: 'Estresado', color: 'bg-red-100 text-red-800', emoji: '😰' },
  { type: 'Motivado', color: 'bg-green-100 text-green-800', emoji: '💪' },
  { type: 'Cansado', color: 'bg-gray-100 text-gray-800', emoji: '😴' }
] as const;

export const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>('moods', []);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = React.useState('');

  const todayMood = moods.find(m => m.date === selectedDate);

  const addMood = (mood: typeof MOODS[number]['type']) => {
    setMoods(prev => {
      const existingIndex = prev.findIndex(m => m.date === selectedDate);
      const newEntry = { date: selectedDate, mood, note: note.trim() || undefined };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newEntry;
        return updated;
      } else {
        return [...prev, newEntry];
      }
    });
    setNote('');
  };

  const getRecentMoods = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const mood = moods.find(m => m.date === date);
      return {
        date,
        mood: mood?.mood,
        note: mood?.note,
        dayName: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })
      };
    });
  };

  const getMoodColor = (mood: typeof MOODS[number]['type']) => {
    return MOODS.find(m => m.type === mood)?.color || 'bg-gray-100 text-gray-800';
  };

  const getMoodEmoji = (mood: typeof MOODS[number]['type']) => {
    return MOODS.find(m => m.type === mood)?.emoji || '😐';
  };

  const recentMoods = getRecentMoods();

  return (
    <div className="p-6 max-w-4xl mx-auto animate-slideUp">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg animate-bounce">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          Tracking de Mood
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-slate-200">Registrar Mood</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              ¿Cómo te sientes?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOODS.map(mood => (
                <button
                  key={mood.type}
                  onClick={() => addMood(mood.type)}
                  className={`p-3 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    todayMood?.mood === mood.type ? mood.color : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="text-sm font-medium">{mood.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nota (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe cómo te sientes hoy..."
              className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-slate-200 placeholder-slate-400"
              rows={3}
            />
          </div>

          {todayMood && (
            <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
              <p className="text-sm text-cyan-300">
                <span className="font-semibold">Mood actual:</span> {getMoodEmoji(todayMood.mood)} {todayMood.mood}
              </p>
              {todayMood.note && (
                <p className="text-sm text-slate-300 mt-1">"{todayMood.note}"</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-slate-200">Últimos 7 días</h2>
          </div>

          <div className="space-y-3">
            {recentMoods.map((entry, index) => (
              <div key={entry.date} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-200 transform hover:scale-102">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-300 min-w-[3rem]">
                    {entry.dayName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(entry.date).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.mood ? (
                    <>
                      <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                        {entry.mood}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-500 text-sm">Sin registro</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 backdrop-blur-sm">
            <h3 className="font-semibold text-green-300 mb-2">Resumen</h3>
            <p className="text-sm text-slate-300">
              {moods.length > 0 
                ? `Has registrado tu mood ${moods.length} ${moods.length === 1 ? 'vez' : 'veces'}`
                : 'Comienza a registrar tu mood diario para ver tu progreso'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};