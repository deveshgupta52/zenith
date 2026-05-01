import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    BarChart3, 
    PieChart as PieChartIcon,
    Loader2,
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
            <div className="h-full flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#a3a3a3', font: { family: 'system-ui' } }
            }
        },
        scales: {
            x: { grid: { color: '#1a1a1a' }, ticks: { color: '#a3a3a3' } },
            y: { grid: { color: '#1a1a1a' }, ticks: { color: '#a3a3a3' } }
        }
    };

    const statusData = {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
            label: 'Tasks',
            data: [stats?.tasksByStatus?.todo || 0, stats?.tasksByStatus?.inProgress || 0, stats?.tasksByStatus?.done || 0],
            backgroundColor: ['#262626', '#525252', '#a3a3a3'],
            borderWidth: 0,
        }],
    };

    const priorityData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
            data: [stats?.tasksByPriority?.low || 0, stats?.tasksByPriority?.medium || 0, stats?.tasksByPriority?.high || 0],
            backgroundColor: ['#262626', '#525252', '#a3a3a3'],
            borderWidth: 0,
        }],
    };

    return (
        <div className="space-y-10 bg-black min-h-full">
            <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-neutral-500 text-sm mt-1">Overview of your activity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Tasks" value={stats?.totalTasks} icon={<ListTodo size={18} />} />
                <StatCard title="Completed" value={stats?.completedTasks} icon={<CheckCircle2 size={18} />} />
                <StatCard title="Pending" value={stats?.pendingTasks} icon={<Clock size={18} />} />
                <StatCard title="Overdue" value={stats?.overdueTasks} icon={<AlertCircle size={18} />} isAlert={stats?.overdueTasks > 0} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-950 p-6 border border-neutral-900 rounded-lg">
                    <h3 className="text-sm font-medium text-neutral-400 mb-6 flex items-center gap-2">
                        <BarChart3 size={16} /> Status Distribution
                    </h3>
                    <div className="h-64">
                        <Bar data={statusData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-neutral-950 p-6 border border-neutral-900 rounded-lg">
                    <h3 className="text-sm font-medium text-neutral-400 mb-6 flex items-center gap-2">
                        <PieChartIcon size={16} /> Priority Breakdown
                    </h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={priorityData} options={{ ...chartOptions, scales: {} }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, isAlert }) => (
    <div className={`bg-neutral-950 p-6 border ${isAlert ? 'border-red-900' : 'border-neutral-900'} rounded-lg`}>
        <div className="flex items-center justify-between mb-4">
            <div className="text-neutral-400">{icon}</div>
            {isAlert && <div className="w-2 h-2 rounded-full bg-red-600" />}
        </div>
        <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-semibold text-white mt-1">{value || 0}</h4>
    </div>
);

export default DashboardPage;
