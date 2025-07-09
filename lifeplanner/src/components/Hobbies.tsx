import React from 'react';
import { Palette, BookOpen, Bike, Sparkles, Shield, Plus, Edit3, Trash2 } from 'lucide-react';
import { Hobby } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const HOBBY_CATEGORIES = [
  { type: 'Pintar', icon: Palette, color: 'bg-purple-100 text-purple-800' },
  { type: 'Leer', icon: BookOpen, color: 'bg-blue-100 text-blue-800' },
  { type: 'Bicicleta', icon: Bike, color: 'bg-green-100 text-green-800' },
  { type: 'Skin Care', icon: Sparkles, color: 'bg-pink-100 text-pink-800' },
  { type: 'Health Care', icon: Shield, color: 'bg-orange-100 text-orange-800' },
  { type: 'Otro', icon: Plus, color: 'bg-gray-100 text-gray-800' }
] as const;

export const Hobbies: React.FC = () => {
  const [hobbies, setHobbies] = useLocalStorage<Hobby[]>('hobbies', []);
  const [isAddingHobby, setIsAddingHobby] = React.useState(false);
  const [editingHobby, setEditingHobby] = React.useState<string | null>(null);
  const [newHobby, setNewHobby] = React.useState<Partial<Hobby>>({
    name: '',
    category: 'Otro',
    progress: 0,
    notes: ''
  });

  const addHobby = () => {
    if (newHobby.name?.trim()) {
      const hobby: Hobby = {
        id: crypto.randomUUID(),
        name: newHobby.name,
        category: newHobby.category || 'Otro',
        progress: 0,
        notes: '',
        lastActivity: new Date().toISOString().split('T')[0]
      };
      
      setHobbies(prev => [...prev, hobby]);
      setNewHobby({ name: '', category: 'Otro', progress: 0, notes: '' });
      setIsAddingHobby(false);
    }
  };

  const updateHobby = (id: string, updates: Partial<Hobby>) => {
    setHobbies(prev => prev.map(hobby => 
      hobby.id === id ? { ...hobby, ...updates } : hobby
    ));
  };

  const deleteHobby = (id: string) => {
    setHobbies(prev => prev.filter(hobby => hobby.id !== id));
  };

  const updateProgress = (id: string, delta: number) => {
    setHobbies(prev => prev.map(hobby => 
      hobby.id === id ? { 
        ...hobby, 
        progress: Math.max(0, Math.min(100, hobby.progress + delta)),
        lastActivity: new Date().toISOString().split('T')[0]
      } : hobby
    ));
  };

  const getCategoryIcon = (category: Hobby['category']) => {
    const cat = HOBBY_CATEGORIES.find(c => c.type === category);
    return cat ? cat.icon : Plus;
  };

  const getCategoryColor = (category: Hobby['category']) => {
    const cat = HOBBY_CATEGORIES.find(c => c.type === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg animate-pulse">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hobbies
          </h1>
        </div>
        <button
          onClick={() => setIsAddingHobby(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Nuevo Hobby
        </button>
      </div>

      {isAddingHobby && (
        <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Añadir Nuevo Hobby</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
              <input
                type="text"
                value={newHobby.name}
                onChange={(e) => setNewHobby(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del hobby"
                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-200 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Categoría</label>
              <select
                value={newHobby.category}
                onChange={(e) => setNewHobby(prev => ({ ...prev, category: e.target.value as Hobby['category'] }))}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-200"
              >
                {HOBBY_CATEGORIES.map(cat => (
                  <option key={cat.type} value={cat.type}>{cat.type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addHobby}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Añadir
            </button>
            <button
              onClick={() => setIsAddingHobby(false)}
              className="px-4 py-2 bg-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-500/50 transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hobbies.map(hobby => {
          const Icon = getCategoryIcon(hobby.category);
          const isEditing = editingHobby === hobby.id;
          
          return (
            <div key={hobby.id} className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(hobby.category)} shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={hobby.name}
                        onChange={(e) => updateHobby(hobby.id, { name: e.target.value })}
                        className="text-lg font-semibold text-slate-200 border-b border-slate-600/50 focus:outline-none focus:border-purple-500 bg-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && setEditingHobby(null)}
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-slate-200">{hobby.name}</h3>
                    )}
                    <p className="text-sm text-slate-400">{hobby.category}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingHobby(isEditing ? null : hobby.id)}
                    className="text-slate-400 hover:text-cyan-400 transition-all duration-200 hover:scale-110"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHobby(hobby.id)}
                    className="text-slate-400 hover:text-red-400 transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Progreso</span>
                  <span className="text-sm font-bold text-slate-200">{hobby.progress}%</span>
                </div>
                <div className="w-full bg-slate-600/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(hobby.progress)}`}
                    style={{ width: `${hobby.progress}%` }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateProgress(hobby.id, -10)}
                    className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-all duration-200 hover:scale-105"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => updateProgress(hobby.id, 10)}
                    className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-all duration-200 hover:scale-105"
                  >
                    +10%
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Notas</label>
                <textarea
                  value={hobby.notes}
                  onChange={(e) => updateHobby(hobby.id, { notes: e.target.value })}
                  placeholder="Añade notas sobre tu progreso..."
                  className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-slate-200 placeholder-slate-400"
                  rows={3}
                />
              </div>

              <div className="text-sm text-slate-400">
                <span className="font-medium">Última actividad:</span> {' '}
                {new Date(hobby.lastActivity).toLocaleDateString('es-ES')}
              </div>
            </div>
          );
        })}
      </div>

      {hobbies.length === 0 && !isAddingHobby && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay hobbies registrados</h3>
          <p className="text-slate-400 mb-4">Comienza añadiendo tu primer hobby</p>
          <button
            onClick={() => setIsAddingHobby(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Añadir Primer Hobby
          </button>
        </div>
      )}
    </div>
  );
};