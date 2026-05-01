import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProjects } from '../../projects/hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
    Plus, 
    ArrowLeft, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Circle, 
    MoreVertical, 
    Trash2, 
    Edit2, 
    User as UserIcon,
    Calendar,
    Users,
    Loader2,
    Search,
    Filter
} from 'lucide-react';
import TaskModal from '../components/TaskModal';
import api from '../../../utils/axios';

const ProjectDetailsPage = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const { tasks, loading: tasksLoading, fetchTasks, addTask, editTask, removeTask } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await api.get(`/projects/${projectId}`);
                setProject(response.data.project);
                await fetchTasks(projectId);
            } catch (err) {
                console.error(err);
                navigate('/projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjectDetails();
    }, [projectId, fetchTasks, navigate]);





    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });


    const handleTaskSubmit = async (data) => {
        try {
            if (editingTask) {
                await editTask(editingTask._id, data);
            } else {
                await addTask({ ...data, project: projectId });
            }
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (err) {
            console.error(err);
        }
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'Done') return false;
        return new Date(dueDate) < new Date();
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    const projectMembers = [project?.owner, ...(project?.members || [])]
        .filter(m => m && m._id);
    const uniqueMembers = Array.from(new Map(projectMembers.map(m => [m._id, m])).values());

    const isProjectMember = uniqueMembers.some(m => m._id === (user?._id || user?.id));
    const canManageTasks = user?.role === 'ADMIN' || isProjectMember;




    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link to="/projects" className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-slate-900">{project?.name}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${project?.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {project?.status}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">{project?.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-900 whitespace-nowrap">Tasks</h2>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none md:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search tasks..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="All">All Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            <select 
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="All">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            {canManageTasks && (
                                <button 
                                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm whitespace-nowrap"
                                >
                                    <Plus size={16} /> Add Task
                                </button>
                            )}
                        </div>
                    </div>



                    <div className="space-y-3">
                        {filteredTasks.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                                <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 font-medium">No tasks found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => (

                                <div key={task._id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-4 group">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                        task.status === 'Done' ? 'bg-green-50 text-green-600' : 
                                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                                    }`}>
                                        {task.status === 'Done' ? <CheckCircle2 size={20} /> : 
                                         task.status === 'In Progress' ? <Circle size={20} className="fill-blue-600/20" /> : <Circle size={20} />}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className={`font-bold truncate ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                {task.title}
                                            </h4>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                                                task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            {isOverdue(task.dueDate, task.status) && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 animate-pulse">
                                                    <AlertCircle size={10} /> OVERDUE
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <div className="flex items-center -space-x-2">
                                                {task.assignedTo && task.assignedTo.length > 0 ? (
                                                    task.assignedTo.map((member, idx) => (
                                                        <div 
                                                            key={member._id || idx} 
                                                            className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600"
                                                            title={member.name}
                                                        >
                                                            {member.name?.[0]}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 italic">Unassigned</span>
                                                )}
                                            </div>
                                            {task.dueDate && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {canManageTasks && (
                                            <button 
                                                onClick={() => removeTask(task._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Users size={18} className="text-blue-600" />
                            Team Members
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    {project?.owner?.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{project?.owner?.name}</p>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Owner</p>
                                </div>
                            </div>
                            {project?.members?.map((member) => (
                                <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                        {member.name?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Member</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                onSubmit={handleTaskSubmit}
                initialData={editingTask}
                loading={tasksLoading}
                members={uniqueMembers}


                projectId={projectId}
            />
        </div>
    );
};

export default ProjectDetailsPage;
