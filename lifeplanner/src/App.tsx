import React from 'react';
import { Calendar, Heart, Dumbbell, Palette, FolderOpen, FileText } from 'lucide-react';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { MoodTracker } from './components/MoodTracker';
import { GymDiet } from './components/GymDiet';
import { Hobbies } from './components/Hobbies';
import { PersonalProjects } from './components/PersonalProjects';
import { DailyNotes } from './components/DailyNotes';

type Tab = 'planner' | 'mood' | 'gym' | 'hobbies' | 'projects' | 'notes';

const tabs = [
  { id: 'planner', label: 'Planner', icon: Calendar, component: WeeklyPlanner },
  { id: 'mood', label: 'Mood', icon: Heart, component: MoodTracker },
  { id: 'gym', label: 'Gym & Dieta', icon: Dumbbell, component: GymDiet },
  { id: 'hobbies', label: 'Hobbies', icon: Palette, component: Hobbies },
  { id: 'projects', label: 'Proyectos', icon: FolderOpen, component: PersonalProjects },
  { id: 'notes', label: 'Notas', icon: FileText, component: DailyNotes }
] as const;

function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('planner');
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || WeeklyPlanner;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-slate-800/90 backdrop-blur-xl shadow-2xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                LifePlanner
              </h1>
            </div>
            
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 shadow-lg backdrop-blur-sm border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-lg'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen animate-fadeIn">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;