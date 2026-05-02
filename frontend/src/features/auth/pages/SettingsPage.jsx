import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { Shield, Loader2, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
    const { user, fetchMe } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { register: profileRegister, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email
        }
    });

    const { register: passwordRegister, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();

    const onProfileUpdate = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await userService.updateProfile(data);
            await fetchMe();
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const onPasswordChange = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await userService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            resetPassword();
            setSuccess('Password changed successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 bg-black min-h-full pb-20">
            <div>
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="text-neutral-500 text-sm mt-1">Manage your account preferences</p>
            </div>

            {success && (
                <div className="bg-green-900/10 border border-green-900/30 text-green-500 px-4 py-3 rounded flex items-center gap-3">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-medium">{success}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-900/10 border border-red-900/30 text-red-500 px-4 py-3 rounded flex items-center gap-3">
                    <Shield size={16} />
                    <span className="text-xs font-medium">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[10px] text-neutral-400">Profile Info</h3>
                    <p className="text-xs text-neutral-600">Update your public profile and email.</p>
                </div>
                <div className="md:col-span-2">
                    <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="bg-neutral-950 p-6 rounded-lg border border-neutral-900 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Full Name</label>
                                <input 
                                    {...profileRegister('name')}
                                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Email</label>
                                <input 
                                    {...profileRegister('email')}
                                    type="email"
                                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                disabled={loading}
                                className="bg-white text-black btn-white px-6 py-2 rounded font-semibold text-xs transition-none flex items-center gap-2"
                            >

                                {loading && <Loader2 size={14} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="border-t border-neutral-900 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-[10px] text-neutral-400">Security</h3>
                    <p className="text-xs text-neutral-600">Update your password to stay secure.</p>
                </div>
                <div className="md:col-span-2">
                    <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="bg-neutral-950 p-6 rounded-lg border border-neutral-900 space-y-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Current Password</label>
                                <input 
                                    {...passwordRegister('currentPassword')}
                                    type="password"
                                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">New Password</label>
                                    <input 
                                        {...passwordRegister('newPassword')}
                                        type="password"
                                        className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                                    <input 
                                        {...passwordRegister('confirmPassword')}
                                        type="password"
                                        className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm focus:border-white outline-none transition-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                disabled={loading}
                                className="bg-white text-black btn-white px-6 py-2 rounded font-semibold text-xs transition-none flex items-center gap-2"
                            >

                                {loading && <Loader2 size={14} className="animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </div>
    );
};

export default SettingsPage;
