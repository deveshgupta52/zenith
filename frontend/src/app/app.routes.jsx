import { createBrowserRouter, Navigate } from 'react-router';
import Layout from '../components/Layout';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProjectListPage from '../features/projects/pages/ProjectListPage';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, fetchMe, loading } = useAuth();
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            await fetchMe();
            setInitialCheckDone(true);
        };
        checkAuth();
    }, []);

    if (!initialCheckDone || loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <div className="text-2xl font-bold p-8">Dashboard Overview</div>,
            },
            {
                path: 'projects',
                element: <ProjectListPage />,
            },
            {
                path: 'tasks',
                element: <div className="text-2xl font-bold p-8">My Tasks List</div>,
            },
        ],
    },
]);
