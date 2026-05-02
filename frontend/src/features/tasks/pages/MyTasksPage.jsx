import { useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { 
    CheckCircle2, 
    Circle, 
    Clock, 
    Search,
    Filter,
    Loader2
} from 'lucide-react';

const MyTasksPage = () => {
    const { tasks, loading, fetchMyTasks, editTask } = useTasks();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);

    const handleStatusChange = async (taskId, currentStatus) => {
        const nextStatus = currentStatus === 'Done' ? 'To Do' : 'Done';
        await editTask(taskId, { status: nextStatus });
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.project?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading && tasks.length === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 bg-black min-h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white">My Tasks</h1>
                    <p className="text-neutral-500 text-sm mt-1">Tasks assigned to you across all projects</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input 
                        type="text"
                        placeholder="Search tasks or projects..."
                        className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-sm text-white focus:border-white outline-none transition-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <select 
                        className="pl-10 pr-8 py-2 bg-neutral-900 border border-neutral-800 rounded text-sm text-white focus:border-white outline-none appearance-none transition-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div 
                            key={task._id} 
                            className="group bg-neutral-950 border border-neutral-900 p-4 rounded-lg flex items-center gap-4 hover:border-neutral-700 transition-none"
                        >
                            <button 
                                onClick={() => handleStatusChange(task._id, task.status)}
                                className={`shrink-0 transition-none ${task.status === 'Done' ? 'text-white' : 'text-neutral-700 hover:text-neutral-500'}`}
                            >
                                {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`text-sm font-medium truncate ${task.status === 'Done' ? 'text-neutral-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </h3>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-tighter ${
                                        task.priority === 'High' ? 'border-neutral-700 text-white' : 
                                        task.priority === 'Medium' ? 'border-neutral-800 text-neutral-400' : 
                                        'border-neutral-900 text-neutral-600'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                                    <span className="flex items-center gap-1 uppercase tracking-wider">
                                        <Layers size={10} /> {task.project?.name || 'No Project'}
                                    </span>
                                    {task.deadline && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} /> {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[10px] font-semibold px-2 py-1 rounded ${
                                    task.status === 'Done' ? 'bg-neutral-900 text-neutral-500' : 
                                    task.status === 'In Progress' ? 'bg-white text-black' : 
                                    'bg-neutral-800 text-neutral-400'
                                }`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed border-neutral-900 rounded-lg">
                        <p className="text-neutral-600 text-sm">No tasks found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Layers = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

export default MyTasksPage;
