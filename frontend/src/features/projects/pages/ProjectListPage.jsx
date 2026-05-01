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
        <div className="space-y-10 animate-in fade-in duration-500 bg-black min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Projects</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage your team's lifecycle</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => {
                            setEditingProject(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-white text-black btn-white px-4 py-2 rounded-md font-medium text-sm transition-none"

                    >
                        <Plus size={16} />
                        New Project
                    </button>
                )}
            </div>

            {loading && projects.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-white" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-neutral-950 rounded-lg border border-neutral-900 p-6 relative overflow-hidden transition-none">
                            <div className={`absolute top-0 left-0 w-1 h-full ${project.status === 'Completed' ? 'bg-green-600' : 'bg-neutral-600'}`} />
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-10 h-10 rounded bg-neutral-900 flex items-center justify-center ${project.status === 'Completed' ? 'text-green-500' : 'text-neutral-400'}`}>
                                    {project.status === 'Completed' ? <CheckCircle2 size={20} /> : <Folder size={20} />}
                                </div>
                                <div className="flex gap-2">
                                    {isAdmin && (
                                        <>
                                            <button 
                                                onClick={() => handleEdit(project)}
                                                className="p-1.5 text-neutral-500 hover:text-white transition-none"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => removeProject(project._id)}
                                                className="p-1.5 text-neutral-500 hover:text-red-500 transition-none"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                    <Link to={`/projects/${project._id}`} className="p-1.5 text-neutral-500 hover:text-white transition-none">
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    {project.name}
                                </h3>
                                <p className="text-neutral-500 text-sm mt-2 line-clamp-2 h-10">
                                    {project.description || 'No description provided.'}
                                </p>
                            </div>
                            
                            <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                                        <Users size={12} />
                                        <span>{project.members?.length}</span>
                                    </div>
                                    {project.deadline && (
                                        <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                                            <Clock size={12} />
                                            <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex -space-x-1.5 overflow-hidden">
                                    {project.members?.slice(0, 3).map((member, i) => (
                                        <div key={i} className="inline-block h-6 w-6 rounded-full border-2 border-neutral-950 bg-neutral-800 flex items-center justify-center text-[10px] font-medium text-neutral-300">
                                            {member.name?.[0]}
                                        </div>
                                    ))}
                                    {project.members?.length > 3 && (
                                        <div className="inline-block h-6 w-6 rounded-full border-2 border-neutral-950 bg-neutral-900 flex items-center justify-center text-[8px] font-medium text-neutral-500">
                                            +{project.members.length - 3}
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
