import { useForm } from 'react-hook-form';
import { X, Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, loading, members, projectId }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: initialData ? {
            ...initialData,
            dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
        } : {
            status: 'To Do',
            priority: 'Medium',
            project: projectId
        }
    });

    useEffect(() => {
        if (initialData) {
            setSelectedMembers(initialData.assignedTo?.map(m => m._id || m) || []);
            reset({
                ...initialData,
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
            });
        } else {
            setSelectedMembers([]);
            reset({
                status: 'To Do',
                priority: 'Medium',
                project: projectId
            });
        }
    }, [initialData, reset, projectId]);

    const toggleMember = (memberId) => {
        setSelectedMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId) 
                : [...prev, memberId]
        );
    };

    const handleFormSubmit = (data) => {
        onSubmit({
            ...data,
            assignedTo: selectedMembers
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        {initialData ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <input type="hidden" {...register('project')} value={projectId} />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="What needs to be done?"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Add more details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assign To Members</label>
                            <div className="grid grid-cols-2 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                                {members?.map(member => (
                                    <button
                                        key={member._id}
                                        type="button"
                                        onClick={() => toggleMember(member._id)}
                                        className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all border ${
                                            selectedMembers.includes(member._id) 
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                                            selectedMembers.includes(member._id) ? 'bg-white/20 border-white/40' : 'bg-slate-100 border-slate-200'
                                        }`}>
                                            {selectedMembers.includes(member._id) && <Check size={12} />}
                                        </div>
                                        <span className="text-xs font-semibold truncate">{member.name}</span>
                                    </button>
                                ))}
                                {members?.length === 0 && <p className="text-xs text-slate-400 col-span-2 py-2 text-center">No members available</p>}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input
                                {...register('dueDate')}
                                type="date"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {initialData ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
