import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, User as UserIcon, Settings } from 'lucide-react';


const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <FolderKanban className="text-blue-600" />
                        Ethara Pro
                    </h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                        <LayoutDashboard size={20} className="text-slate-500" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                        <FolderKanban size={20} className="text-slate-500" />
                        <span className="font-medium">Projects</span>
                    </Link>
                    <Link to="/tasks" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                        <ListTodo size={20} className="text-slate-500" />
                        <span className="font-medium">My Tasks</span>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                        <Settings size={20} className="text-slate-500" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>


                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 p-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {user?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium border border-transparent hover:border-red-100"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
