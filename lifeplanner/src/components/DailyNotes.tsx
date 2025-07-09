import React from 'react';
import { FileText, Calendar, Search, Plus, Edit3, Trash2 } from 'lucide-react';
import { DailyNote } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const DailyNotes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<DailyNote[]>('dailyNotes', []);
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState('');

  const getCurrentNote = () => {
    return notes.find(note => note.date === selectedDate);
  };

  const saveNote = () => {
    if (editingNote.trim()) {
      const existingNote = getCurrentNote();
      
      if (existingNote) {
        setNotes(prev => prev.map(note => 
          note.id === existingNote.id 
            ? { ...note, content: editingNote }
            : note
        ));
      } else {
        const newNote: DailyNote = {
          id: crypto.randomUUID(),
          date: selectedDate,
          content: editingNote,
          mood: undefined
        };
        setNotes(prev => [...prev, newNote]);
      }
    }
    setIsEditing(false);
    setEditingNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEditing = () => {
    const currentNote = getCurrentNote();
    setEditingNote(currentNote?.content || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingNote('');
  };

  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.date.includes(searchTerm)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentNote = getCurrentNote();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Notas Diarias</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent"
                />
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveNote}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    {currentNote ? 'Editar' : 'Escribir'}
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-96">
              {isEditing ? (
                <textarea
                  value={editingNote}
                  onChange={(e) => setEditingNote(e.target.value)}
                  placeholder="Escribe tus pensamientos del día..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  autoFocus
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg min-h-96">
                  {currentNote ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {currentNote.content}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-4">
                        No hay notas para {new Date(selectedDate).toLocaleDateString('es-ES')}
                      </p>
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Escribir primera nota
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Buscar notas</h2>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en las notas..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotes.map(note => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-800">
                      {new Date(note.date).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedDate(note.date)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {note.content.slice(0, 100)}
                    {note.content.length > 100 && '...'}
                  </p>
                </div>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  {searchTerm ? 'No se encontraron notas' : 'No hay notas guardadas'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de notas</span>
                <span className="font-semibold text-gray-800">{notes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Este mes</span>
                <span className="font-semibold text-gray-800">
                  {notes.filter(note => {
                    const noteDate = new Date(note.date);
                    const now = new Date();
                    return noteDate.getMonth() === now.getMonth() && 
                           noteDate.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Esta semana</span>
                <span className="font-semibold text-gray-800">
                  {notes.filter(note => {
                    const noteDate = new Date(note.date);
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return noteDate >= weekAgo;
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};