
import React from 'react';
import { useAppContext } from '../../App';

const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300 text-center">
        <div className="text-4xl font-bold text-navy-blue dark:text-blue-400">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
);

const DashboardPage: React.FC = () => {
    const { data } = useAppContext();
    const { profile, tasks, courses, goals } = data;

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(task => task.status === 'done').length || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div>
            <div className="bg-gradient-to-r from-navy-blue to-blue-700 dark:from-dark-card dark:to-slate-700 p-10 md:p-16 rounded-2xl text-white text-center shadow-2xl mb-8 animate-gradient">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {profile.name}!</h1>
                <p className="text-lg md:text-xl opacity-90">Your academic journey continues here ✨</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard value={courses?.length || 0} label="Active Courses" />
                <StatCard value={totalTasks - completedTasks} label="Pending Tasks" />
                <StatCard value={goals?.length || 0} label="Active Goals" />
                <StatCard value={`${completionRate}%`} label="Task Completion" />
            </div>
        </div>
    );
};

export default DashboardPage;
