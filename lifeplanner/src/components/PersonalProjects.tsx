import React from 'react';
import { FolderOpen, Plus, Edit3, Trash2, Clock, CheckCircle } from 'lucide-react';
import { PersonalProject } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PROJECT_STATUSES = [
  { value: 'Inicio', color: 'bg-blue-100 text-blue-800', icon: Clock },
  { value: 'En Progreso', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'Avanzado', color: 'bg-orange-100 text-orange-800', icon: Clock },
  { value: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
] as const;

export const PersonalProjects: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<PersonalProject[]>('personalProjects', []);
  const [isAddingProject, setIsAddingProject] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<string | null>(null);
  const [newProject, setNewProject] = React.useState<Partial<PersonalProject>>({
    name: '',
    description: '',
    status: 'Inicio',
    progress: 0,
    notes: ''
  });

  const addProject = () => {
    if (newProject.name?.trim()) {
      const project: PersonalProject = {
        id: crypto.randomUUID(),
        name: newProject.name,
        description: newProject.description || '',
        status: newProject.status || 'Inicio',
        progress: 0,
        notes: '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setProjects(prev => [...prev, project]);
      setNewProject({ name: '', description: '', status: 'Inicio', progress: 0, notes: '' });
      setIsAddingProject(false);
    }
  };

  const updateProject = (id: string, updates: Partial<PersonalProject>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const updateProgress = (id: string, delta: number) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { 
        ...project, 
        progress: Math.max(0, Math.min(100, project.progress + delta))
      } : project
    ));
  };

  const getStatusConfig = (status: PersonalProject['status']) => {
    return PROJECT_STATUSES.find(s => s.value === status) || PROJECT_STATUSES[0];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProjectsByStatus = (status: PersonalProject['status']) => {
    return projects.filter(project => project.status === status);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Proyectos Personales</h1>
        </div>
        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {isAddingProject && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Añadir Nuevo Proyecto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del proyecto"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as PersonalProject['status'] }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PROJECT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.value}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe tu proyecto..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Añadir
            </button>
            <button
              onClick={() => setIsAddingProject(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROJECT_STATUSES.map(statusConfig => {
          const StatusIcon = statusConfig.icon;
          const projectsInStatus = getProjectsByStatus(statusConfig.value);
          
          return (
            <div key={statusConfig.value} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-800">{statusConfig.value}</h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {projectsInStatus.length}
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {projectsInStatus.map(project => {
                  const isEditing = editingProject === project.id;
                  
                  return (
                    <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, { name: e.target.value })}
                            className="font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && setEditingProject(null)}
                          />
                        ) : (
                          <h3 className="font-semibold text-gray-800">{project.name}</h3>
                        )}
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingProject(isEditing ? null : project.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mb-3">
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, { description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      )}

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Progreso</span>
                          <span className="text-sm font-bold text-gray-800">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => updateProgress(project.id, -10)}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-colors"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => updateProgress(project.id, 10)}
                            className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                          >
                            +10%
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                        <select
                          value={project.status}
                          onChange={(e) => updateProject(project.id, { status: e.target.value as PersonalProject['status'] })}
                          className="w-full p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {PROJECT_STATUSES.map(status => (
                            <option key={status.value} value={status.value}>{status.value}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <textarea
                          value={project.notes}
                          onChange={(e) => updateProject(project.id, { notes: e.target.value })}
                          placeholder="Notas del proyecto..."
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="text-xs text-gray-500">
                        Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && !isAddingProject && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay proyectos registrados</h3>
          <p className="text-gray-500 mb-4">Comienza añadiendo tu primer proyecto personal</p>
          <button
            onClick={() => setIsAddingProject(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Añadir Primer Proyecto
          </button>
        </div>
      )}
    </div>
  );
};