import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import { useUsers } from '../../auth/hooks/useUsers';
import { useEffect } from 'react';

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: initialData ? {
            ...initialData,
            deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : ''
        } : {
            status: 'Active',
            members: []
        }
    });
    const { users } = useUsers();

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
                members: initialData.members?.map(m => m._id || m) || []
            });
        } else {
            reset({
                status: 'Active',
                members: []
            });
        }
    }, [initialData, reset, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-neutral-950 border border-neutral-900 rounded-lg w-full max-w-lg shadow-none overflow-hidden transition-none">
                <div className="flex justify-between items-center p-6 border-b border-neutral-900">
                    <h2 className="text-lg font-semibold text-white">
                        {initialData ? 'Edit Project' : 'Create Project'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-none">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Project Name</label>
                        <input
                            {...register('name', { required: 'Project name is required' })}
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                            placeholder="Enter project name"
                        />
                        {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none resize-none"
                            placeholder="Project goals..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Deadline</label>
                            <input
                                {...register('deadline')}
                                type="date"
                                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Add Team Members</label>
                        <div className="max-h-32 overflow-y-auto bg-neutral-900/50 border border-neutral-900 rounded p-2 space-y-1">
                            {users.map(user => (
                                <label key={user._id} className="flex items-center gap-2 p-2 rounded cursor-pointer transition-none border border-transparent hover:border-neutral-800">
                                    <input
                                        type="checkbox"
                                        value={user._id}
                                        {...register('members')}
                                        className="w-4 h-4 rounded-sm border-neutral-800 bg-neutral-900 text-white focus:ring-0 accent-white"
                                    />
                                    <span className="text-xs text-neutral-300">{user.name}</span>
                                    <span className="text-[10px] text-neutral-600 capitalize">({user.role.toLowerCase()})</span>
                                </label>
                            ))}
                        </div>
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
                            className="flex-1 px-4 py-2 bg-white text-black btn-white rounded font-semibold text-sm transition-none flex items-center justify-center gap-2"
                        >

                            {loading && <Loader2 size={16} className="animate-spin text-black" />}
                            {initialData ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
