import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { 
    LayoutDashboard, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    BarChart3, 
    PieChart as PieChartIcon,
    Loader2,
    TrendingUp,
    ListTodo
} from 'lucide-react';
import {
    Chart as ChartJS,
    registerables
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(...registerables);


const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    const statusData = {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [
            {
                label: 'Tasks by Status',
                data: [
                    stats?.tasksByStatus?.todo || 0, 
                    stats?.tasksByStatus?.inProgress || 0, 
                    stats?.tasksByStatus?.done || 0
                ],
                backgroundColor: ['#f1f5f9', '#dbeafe', '#dcfce7'],
                borderColor: ['#cbd5e1', '#3b82f6', '#22c55e'],
                borderWidth: 1,
            },
        ],
    };

    const priorityData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                data: [
                    stats?.tasksByPriority?.low || 0, 
                    stats?.tasksByPriority?.medium || 0, 
                    stats?.tasksByPriority?.high || 0
                ],
                backgroundColor: ['#f1f5f9', '#fef3c7', '#fee2e2'],
                borderColor: ['#94a3b8', '#f59e0b', '#ef4444'],
                hoverOffset: 4,
            },
        ],
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 mt-1">Real-time overview of your projects and productivity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Tasks" 
                    value={stats?.totalTasks} 
                    icon={<ListTodo className="text-blue-600" />}
                    bgColor="bg-blue-50"
                />
                <StatCard 
                    title="Completed" 
                    value={stats?.completedTasks} 
                    icon={<CheckCircle2 className="text-green-600" />}
                    bgColor="bg-green-50"
                />
                <StatCard 
                    title="Pending" 
                    value={stats?.pendingTasks} 
                    icon={<Clock className="text-amber-600" />}
                    bgColor="bg-amber-50"
                />
                <StatCard 
                    title="Overdue" 
                    value={stats?.overdueTasks} 
                    icon={<AlertCircle className="text-red-600" />}
                    bgColor="bg-red-50"
                    isAlert={stats?.overdueTasks > 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 size={20} className="text-blue-600" />
                            Task Status Distribution
                        </h3>
                    </div>
                    <div className="h-64">
                        <Bar 
                            data={statusData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            }} 
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <PieChartIcon size={20} className="text-indigo-600" />
                            Priority Breakdown
                        </h3>
                    </div>
                    <div className="h-64 flex justify-center">
                        <Pie 
                            data={priorityData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false 
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, bgColor, isAlert }) => (
    <div className={`bg-white p-6 rounded-2xl border ${isAlert ? 'border-red-200 shadow-red-50' : 'border-slate-200'} shadow-sm transition-all hover:shadow-md group`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            {isAlert && <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping"></span>}
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h4 className="text-3xl font-bold text-slate-900 mt-1">{value || 0}</h4>
    </div>
);

export default DashboardPage;
