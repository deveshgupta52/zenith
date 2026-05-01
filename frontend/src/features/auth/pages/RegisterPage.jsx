import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: signup, loading, error } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await signup(data);
            navigate('/');
        } catch (err) {
            // Error handled by hook
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
            <div className="max-w-md w-full space-y-10 bg-neutral-950 p-10 border border-neutral-900 rounded-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white tracking-tight">Create Account</h2>
                    <p className="mt-2 text-sm text-neutral-500">Join Nexus Pro platform</p>
                </div>


                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="bg-red-900/10 text-red-500 p-3 rounded text-xs border border-red-900/30">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Full Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-blue-500 outline-none transition-none"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Email</label>
                            <input
                                {...register('email', { required: 'Email is required' })}
                                type="email"
                                className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-blue-500 outline-none transition-none"
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Password</label>
                            <input
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                type="password"
                                className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-blue-500 outline-none transition-none"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-[10px] text-red-500">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Role</label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className="block w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-blue-500 outline-none transition-none appearance-none"
                            >
                                <option value="MEMBER">Member</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 bg-white text-black btn-white text-sm font-semibold rounded transition-none disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin text-black" size={18} /> : 'Create Account'}
                    </button>


                    <div className="text-center">
                        <p className="text-xs text-neutral-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-white hover:underline transition-none">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
