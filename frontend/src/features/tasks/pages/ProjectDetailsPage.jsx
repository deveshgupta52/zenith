import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
    Plus, 
    ArrowLeft, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Circle, 
    Trash2, 
    Edit2, 
    User as UserIcon,
    Calendar,
    Users,
    Loader2,
    Search
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

    const projectMembers = [project?.owner, ...(project?.members || [])]
        .filter(m => m && m._id);
    const uniqueMembers = Array.from(new Map(projectMembers.map(m => [m._id, m])).values());

    const isAdmin = user?.role === 'ADMIN';
    const isProjectMember = uniqueMembers.some(m => (m._id || m) === (user?._id || user?.id));
    const canManageTasks = isAdmin; // Only Admin can Add, Edit, Delete any task

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

    const handleToggleStatus = async (task) => {
        const isAssigned = task.assignedTo?.some(m => (m._id || m) === (user?._id || user?.id));
        if (!isAdmin && !isAssigned) return;

        const nextStatus = task.status === 'Done' ? 'To Do' : 'Done';
        try {
            await editTask(task._id, { status: nextStatus });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 bg-black min-h-full">
            <div className="flex items-center gap-4">
                <Link to="/projects" className="p-2 hover:bg-neutral-900 rounded border border-transparent transition-none">
                    <ArrowLeft size={18} className="text-neutral-500" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-white">{project?.name}</h1>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${project?.status === 'Completed' ? 'bg-green-900/20 text-green-500 border border-green-900/50' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}`}>
                            {project?.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-6">
                        <h2 className="text-lg font-semibold text-white">Tasks</h2>
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none md:w-48">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-1.5 bg-neutral-950 border border-neutral-900 rounded text-xs focus:border-white outline-none transition-none text-white"
                                />
                            </div>
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-1.5 bg-neutral-950 border border-neutral-900 rounded text-xs outline-none transition-none text-neutral-400"
                            >
                                <option value="All">All Status</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            {canManageTasks && (
                                <button 
                                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                                    className="flex items-center gap-2 bg-white text-black btn-white px-4 py-1.5 rounded font-semibold text-xs transition-none"
                                >

                                    <Plus size={14} /> Add Task
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        {filteredTasks.length === 0 ? (
                            <div className="border border-neutral-900 border-dashed rounded-lg p-10 text-center">
                                <p className="text-neutral-500 text-sm">No tasks found.</p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <div key={task._id} className="bg-neutral-950 border border-neutral-900 p-4 flex items-center gap-4 transition-none group rounded-lg">
                                    <button 
                                        disabled={!isAdmin && !task.assignedTo?.some(m => (m._id || m) === (user?._id || user?.id))}
                                        onClick={() => handleToggleStatus(task)}
                                        className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border transition-all ${
                                            task.status === 'Done' ? 'bg-green-900/10 border-green-900/30 text-green-500' : 
                                            task.status === 'In Progress' ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-neutral-900 border-neutral-800 text-neutral-600'
                                        } ${(!isAdmin && !task.assignedTo?.some(m => (m._id || m) === (user?._id || user?.id))) ? 'cursor-not-allowed opacity-50' : 'hover:border-neutral-500'}`}
                                    >
                                        {task.status === 'Done' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                    </button>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-sm font-medium truncate ${task.status === 'Done' ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}>
                                                {task.title}
                                            </h4>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                                                task.priority === 'High' ? 'bg-red-900/10 text-red-500 border-red-900/30' : 
                                                task.priority === 'Medium' ? 'bg-amber-900/10 text-amber-500 border-amber-900/30' : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            {task.status !== 'Done' && task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) && (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-red-600 text-white animate-pulse">
                                                    Overdue
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-neutral-500">
                                            <div className="flex items-center -space-x-1">
                                                {task.assignedTo?.map((m, i) => (
                                                    <div key={m._id || i} className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center text-[8px]" title={m.name}>
                                                        {m.name?.[0]}
                                                    </div>
                                                ))}
                                            </div>
                                            {task.dueDate && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {isAdmin && (
                                            <button 
                                                onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                                className="p-1.5 text-neutral-600 hover:text-white transition-none"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}
                                        {canManageTasks && (
                                            <button 
                                                onClick={() => removeTask(task._id)}
                                                className="p-1.5 text-neutral-600 hover:text-red-500 transition-none"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6">
                        <h3 className="text-sm font-medium text-neutral-400 mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            Team
                        </h3>
                        <div className="space-y-4">
                            <MemberItem name={project?.owner?.name} role="Owner" isOwner />
                            {project?.members?.map((member) => (
                                <MemberItem key={member._id} name={member.name} role="Member" />
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

const MemberItem = ({ name, role, isOwner }) => (
    <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${isOwner ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-900 text-neutral-500'}`}>
            {name?.[0]}
        </div>
        <div className="min-w-0">
            <p className="text-xs font-medium text-neutral-200 truncate">{name}</p>
            <p className="text-[10px] text-neutral-600">{role}</p>
        </div>
    </div>
);

export default ProjectDetailsPage;
