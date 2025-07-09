import React from 'react';
import { Calendar, Edit3 } from 'lucide-react';
import { TimeBlock, DayNote, Activity } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HOURS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const ACTIVITIES: Activity[] = [
  { id: 'trabajo', type: 'Trabajo', color: 'bg-blue-100 text-blue-800' },
  { id: 'estudio', type: 'Estudio', color: 'bg-green-100 text-green-800' },
  { id: 'gym', type: 'Gym', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'hobby', type: 'Hobby', color: 'bg-pink-100 text-pink-800' },
  { id: 'libre', type: 'Libre', color: 'bg-gray-50 text-gray-600' }
];

export const WeeklyPlanner: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlock[]>('timeBlocks', []);
  const [dayNotes, setDayNotes] = useLocalStorage<DayNote[]>('dayNotes', []);
  const [editingNote, setEditingNote] = React.useState<string | null>(null);

  const getBlockActivity = (day: string, hour: string): Activity['type'] => {
    const block = timeBlocks.find(b => b.day === day && b.hour === hour);
    return block?.activity || 'Libre';
  };

  const getActivityColor = (activity: Activity['type']): string => {
    return ACTIVITIES.find(a => a.type === activity)?.color || 'bg-gray-50 text-gray-600';
  };

  const cycleActivity = (day: string, hour: string) => {
    const currentActivity = getBlockActivity(day, hour);
    const currentIndex = ACTIVITIES.findIndex(a => a.type === currentActivity);
    const nextIndex = (currentIndex + 1) % ACTIVITIES.length;
    const nextActivity = ACTIVITIES[nextIndex].type;

    setTimeBlocks(prev => {
      const existingIndex = prev.findIndex(b => b.day === day && b.hour === hour);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { day, hour, activity: nextActivity };
        return updated;
      } else {
        return [...prev, { day, hour, activity: nextActivity }];
      }
    });
  };

  const getDayNote = (day: string): string => {
    return dayNotes.find(n => n.day === day)?.note || '';
  };

  const updateDayNote = (day: string, note: string) => {
    setDayNotes(prev => {
      const existingIndex = prev.findIndex(n => n.day === day);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { day, note };
        return updated;
      } else {
        return [...prev, { day, note }];
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-slideUp">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg animate-pulse">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Planner Semanal
        </h1>
      </div>

      <div className="mb-6 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl">
        <h3 className="font-semibold text-cyan-300 mb-2">Cómo usar:</h3>
        <p className="text-slate-300 text-sm">
          Haz clic en cualquier bloque horario para cambiar la actividad cíclicamente: 
          <span className="font-medium text-purple-300"> Trabajo → Estudio → Gym → Hobby → Libre</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50">
          <thead>
            <tr>
              <th className="p-3 text-left font-semibold text-slate-200 border-b border-slate-600/50 bg-slate-700/50">
                Hora
              </th>
              {DAYS.map(day => (
                <th key={day} className="p-3 text-center font-semibold text-slate-200 border-b border-slate-600/50 bg-slate-700/50 min-w-32">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(hour => (
              <tr key={hour} className="hover:bg-slate-700/30 transition-all duration-200">
                <td className="p-3 font-medium text-slate-300 border-b border-slate-700/30">
                  {hour}
                </td>
                {DAYS.map(day => {
                  const activity = getBlockActivity(day, hour);
                  const colorClass = getActivityColor(activity);
                  return (
                    <td key={`${day}-${hour}`} className="p-1 border-b border-slate-700/30">
                      <button
                        onClick={() => cycleActivity(day, hour)}
                        className={`w-full h-12 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform ${colorClass}`}
                      >
                        {activity}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map(day => (
          <div key={day} className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-200">{day}</h3>
              <button
                onClick={() => setEditingNote(editingNote === day ? null : day)}
                className="text-slate-400 hover:text-cyan-400 transition-all duration-200 hover:scale-110"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            {editingNote === day ? (
              <textarea
                value={getDayNote(day)}
                onChange={(e) => updateDayNote(day, e.target.value)}
                placeholder="Añadir nota para este día..."
                className="w-full h-20 p-2 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-slate-200 placeholder-slate-400"
                autoFocus
              />
            ) : (
              <p className="text-sm text-slate-300 min-h-[3rem]">
                {getDayNote(day) || (
                  <span className="text-slate-500">Haz clic en el icono para añadir una nota</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};