import { useEffect, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../../auth/hooks/useAuth';
import { Plus, Folder, Users, Calendar, Trash2, Edit2, ExternalLink, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import ProjectModal from '../components/ProjectModal';

const ProjectListPage = () => {
    const { projects, loading, fetchProjects, removeProject, addProject, editProject } = useProjects();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const isAdmin = user?.role === 'ADMIN';

    const handleSubmit = async (data) => {
        try {
            if (editingProject) {
                await editProject(editingProject._id, data);
            } else {
                await addProject(data);
            }
            setIsModalOpen(false);
            setEditingProject(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 mt-1">Manage and track your team's lifecycle</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => {
                            setEditingProject(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                    >
                        <Plus size={20} />
                        New Project
                    </button>
                )}
            </div>

            {loading && projects.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {project.status === 'Completed' ? <CheckCircle2 size={24} /> : <Folder size={24} />}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isAdmin && (
                                        <>
                                            <button 
                                                onClick={() => handleEdit(project)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => removeProject(project._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                    <Link to={`/projects/${project._id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {project.name}
                                </h3>
                            </div>
                            
                            <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
                                {project.description || 'No description provided for this project.'}
                            </p>

                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Users size={14} />
                                        <span className="font-medium">{project.members?.length} members</span>
                                    </div>
                                    {project.deadline && (
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Clock size={14} />
                                            <span className="font-medium">{new Date(project.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex -space-x-2 overflow-hidden">
                                    {project.members?.slice(0, 5).map((member, i) => (
                                        <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {member.name?.[0]}
                                        </div>
                                    ))}
                                    {project.members?.length > 5 && (
                                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                            +{project.members.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProjectModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingProject}
                loading={loading}
            />
        </div>
    );
};

export default ProjectListPage;
