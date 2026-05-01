import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { User, Lock, Bell, Shield, Loader2, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
    const { user, fetchMe } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { register: profileRegister, handleSubmit: handleProfileSubmit } = useForm({
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account preferences and security</p>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                    <Shield size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900">Profile Information</h3>
                    <p className="text-sm text-slate-500">Update your account's profile information and email address.</p>
                </div>
                <div className="md:col-span-2">
                    <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input 
                                    {...profileRegister('name')}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input 
                                    {...profileRegister('email')}
                                    type="email"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900">Change Password</h3>
                    <p className="text-sm text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                <div className="md:col-span-2">
                    <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                <input 
                                    {...passwordRegister('currentPassword')}
                                    type="password"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input 
                                        {...passwordRegister('newPassword')}
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input 
                                        {...passwordRegister('confirmPassword')}
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                disabled={loading}
                                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-all flex items-center gap-2"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <p className="text-sm text-slate-500">Configure how you receive alerts and updates.</p>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                                    <p className="text-xs text-slate-500">Receive task assignments via email.</p>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                                    <p className="text-xs text-slate-500">Receive real-time alerts in the browser.</p>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
