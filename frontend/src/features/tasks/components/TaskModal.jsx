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
    }, [initialData, reset, projectId, isOpen]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-neutral-950 border border-neutral-900 rounded-lg w-full max-w-lg shadow-none overflow-hidden transition-none">
                <div className="flex justify-between items-center p-6 border-b border-neutral-900">
                    <h2 className="text-lg font-semibold text-white">
                        {initialData ? 'Edit Task' : 'Create Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-none">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    <input type="hidden" {...register('project')} value={projectId} />
                    
                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                            placeholder="Task title..."
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none resize-none"
                            placeholder="Details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Assignees</label>
                        <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-900/50 border border-neutral-900 rounded">
                            {members?.map(member => (
                                <button
                                    key={member._id}
                                    type="button"
                                    onClick={() => toggleMember(member._id)}
                                    className={`flex items-center gap-2 p-2 rounded text-left transition-none border ${
                                        selectedMembers.includes(member._id) 
                                            ? 'bg-neutral-800 text-white border-neutral-700' 
                                            : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                                        selectedMembers.includes(member._id) ? 'bg-white border-white text-black' : 'bg-neutral-800 border-neutral-700'
                                    }`}>
                                        {selectedMembers.includes(member._id) && <Check size={10} />}
                                    </div>
                                    <span className="text-xs truncate">{member.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Due Date</label>
                        <input
                            {...register('dueDate')}
                            type="date"
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-neutral-900 text-neutral-500 rounded font-medium text-sm transition-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-white text-black btn-white rounded font-medium text-sm transition-none flex items-center justify-center gap-2"
                        >

                            {loading && <Loader2 size={16} className="animate-spin text-black" />}
                            {initialData ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
