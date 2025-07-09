import React from 'react';
import { Dumbbell, Apple, Plus, Check, X } from 'lucide-react';
import { Workout, Diet, Exercise, Meal } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const GymDiet: React.FC = () => {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('workouts', []);
  const [diets, setDiets] = useLocalStorage<Diet[]>('diets', []);
  const [activeTab, setActiveTab] = React.useState<'gym' | 'diet'>('gym');
  const [selectedDay, setSelectedDay] = React.useState('Lunes');

  const getWorkoutForDay = (day: string) => {
    return workouts.find(w => w.day === day) || {
      id: crypto.randomUUID(),
      day,
      exercises: [],
      notes: ''
    };
  };

  const getDietForDay = (day: string) => {
    return diets.find(d => d.day === day) || {
      id: crypto.randomUUID(),
      day,
      meals: [],
      notes: ''
    };
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(prev => {
      const existingIndex = prev.findIndex(w => w.day === workout.day);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = workout;
        return updated;
      } else {
        return [...prev, workout];
      }
    });
  };

  const updateDiet = (diet: Diet) => {
    setDiets(prev => {
      const existingIndex = prev.findIndex(d => d.day === diet.day);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = diet;
        return updated;
      } else {
        return [...prev, diet];
      }
    });
  };

  const addExercise = (workout: Workout) => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      completed: false
    };
    
    updateWorkout({
      ...workout,
      exercises: [...workout.exercises, newExercise]
    });
  };

  const updateExercise = (workout: Workout, exerciseId: string, updates: Partial<Exercise>) => {
    const updatedExercises = workout.exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    );
    
    updateWorkout({
      ...workout,
      exercises: updatedExercises
    });
  };

  const removeExercise = (workout: Workout, exerciseId: string) => {
    updateWorkout({
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const addMeal = (diet: Diet, mealType: Meal['type']) => {
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      type: mealType,
      description: ''
    };
    
    updateDiet({
      ...diet,
      meals: [...diet.meals, newMeal]
    });
  };

  const updateMeal = (diet: Diet, mealId: string, description: string) => {
    const updatedMeals = diet.meals.map(meal => 
      meal.id === mealId ? { ...meal, description } : meal
    );
    
    updateDiet({
      ...diet,
      meals: updatedMeals
    });
  };

  const removeMeal = (diet: Diet, mealId: string) => {
    updateDiet({
      ...diet,
      meals: diet.meals.filter(meal => meal.id !== mealId)
    });
  };

  const currentWorkout = getWorkoutForDay(selectedDay);
  const currentDiet = getDietForDay(selectedDay);

  return (
    <div className="p-6 max-w-6xl mx-auto animate-slideUp">
      <div className="flex items-center gap-3 mb-6">
        {activeTab === 'gym' ? (
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg animate-pulse">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
        ) : (
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg animate-pulse">
            <Apple className="w-8 h-8 text-white" />
          </div>
        )}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          {activeTab === 'gym' ? 'Gym' : 'Dieta'}
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('gym')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'gym'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:shadow-lg'
          }`}
        >
          <Dumbbell className="w-4 h-4 inline mr-2" />
          Entrenamientos
        </button>
        <button
          onClick={() => setActiveTab('diet')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
            activeTab === 'diet'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:shadow-lg'
          }`}
        >
          <Apple className="w-4 h-4 inline mr-2" />
          Dieta
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:shadow-lg'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'gym' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-200">Ejercicios - {selectedDay}</h2>
              <button
                onClick={() => addExercise(currentWorkout)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Añadir
              </button>
            </div>

            <div className="space-y-3">
              {currentWorkout.exercises.map(exercise => (
                <div key={exercise.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(currentWorkout, exercise.id, { name: e.target.value })}
                      placeholder="Nombre del ejercicio"
                      className="flex-1 p-2 bg-slate-600/50 border border-slate-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-200 placeholder-slate-400"
                    />
                    <button
                      onClick={() => removeExercise(currentWorkout, exercise.id)}
                      className="ml-2 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Series</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(currentWorkout, exercise.id, { sets: parseInt(e.target.value) })}
                        className="w-full p-1 bg-slate-600/50 border border-slate-500/50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Reps</label>
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(currentWorkout, exercise.id, { reps: parseInt(e.target.value) })}
                        className="w-full p-1 bg-slate-600/50 border border-slate-500/50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(currentWorkout, exercise.id, { weight: parseFloat(e.target.value) || 0 })}
                        className="w-full p-1 bg-slate-600/50 border border-slate-500/50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => updateExercise(currentWorkout, exercise.id, { completed: !exercise.completed })}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      exercise.completed
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                        : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {exercise.completed ? 'Completado' : 'Marcar como completado'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-slate-700/50 hover:shadow-3xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Notas del entrenamiento</h3>
            <textarea
              value={currentWorkout.notes}
              onChange={(e) => updateWorkout({ ...currentWorkout, notes: e.target.value })}
              placeholder="Añade notas sobre tu entrenamiento..."
              className="w-full h-40 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>
      )}

      {activeTab === 'diet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Comidas - {selectedDay}</h2>

            {['Desayuno', 'Almuerzo', 'Cena', 'Snack'].map(mealType => (
              <div key={mealType} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-700">{mealType}</h3>
                  <button
                    onClick={() => addMeal(currentDiet, mealType as Meal['type'])}
                    className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    Añadir
                  </button>
                </div>

                <div className="space-y-2">
                  {currentDiet.meals.filter(meal => meal.type === mealType).map(meal => (
                    <div key={meal.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={meal.description}
                        onChange={(e) => updateMeal(currentDiet, meal.id, e.target.value)}
                        placeholder={`Describe tu ${mealType.toLowerCase()}...`}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => removeMeal(currentDiet, meal.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notas de la dieta</h3>
            <textarea
              value={currentDiet.notes}
              onChange={(e) => updateDiet({ ...currentDiet, notes: e.target.value })}
              placeholder="Añade notas sobre tu dieta..."
              className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};