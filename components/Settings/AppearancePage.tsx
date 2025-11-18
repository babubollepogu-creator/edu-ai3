
import React from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';

const AppearancePage: React.FC = () => {
    const { theme, setTheme } = useAppContext();

    return (
        <div>
            <PageHeader title="Appearance Settings" subtitle="Customize your EduAI experience" icon="fa-cog" />
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4">Theme</h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-dark-input">
                    <span className="font-semibold">Dark Mode</span>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-300 dark:bg-navy-blue">
                        <span className="sr-only">Enable notifications</span>
                        <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                    </button>
                </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Toggle between dark and light themes for your preferred viewing experience.</p>
            </div>
        </div>
    );
};

export default AppearancePage;
