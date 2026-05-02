import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Settings, Sparkles } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-black text-white selection:bg-neutral-800">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col shrink-0">
                <div className="p-6 border-b border-neutral-900">
                    <h1 className="text-xl font-bold flex items-center gap-2.5 tracking-tighter">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Sparkles className="text-black fill-black" size={18} />
                        </div>
                        <span className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
                            Zenith
                        </span>
                    </h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/'} />
                    <NavItem to="/projects" icon={<FolderKanban size={18} />} label="Projects" active={location.pathname.startsWith('/projects')} />
                    {user?.role === 'MEMBER' && (
                        <NavItem to="/tasks" icon={<ListTodo size={18} />} label="My Tasks" active={location.pathname === '/tasks'} />
                    )}
                    <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" active={location.pathname === '/settings'} />


                </nav>

                <div className="p-4 border-t border-neutral-900">
                    <div className="flex items-center gap-3 mb-4 p-2 bg-neutral-900/50 rounded-lg">
                        <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-white font-medium text-xs">
                            {user?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{user?.name}</p>
                            <p className="text-[10px] text-neutral-500 truncate capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded text-red-500 transition-none font-medium border border-neutral-900 text-xs hover:bg-red-950/20"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-black">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 p-2.5 rounded transition-none ${
            active ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
        }`}
    >
        {icon}
        <span className="text-sm">{label}</span>
    </Link>
);

export default Layout;
