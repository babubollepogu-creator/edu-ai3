
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import LoginPage from './components/Auth/LoginPage';
import Sidebar from './components/Layout/Sidebar';
import DashboardPage from './components/Dashboard/DashboardPage';
import CoursesPage from './components/Courses/CoursesPage';
import TasksPage from './components/Tasks/TasksPage';
import NotesPage from './components/Notes/NotesPage';
import HabitsPage from './components/Habits/HabitsPage';
import GoalsPage from './components/Goals/GoalsPage';
import ExamsPage from './components/Exams/ExamsPage';
import MotivationPage from './components/Motivation/MotivationPage';
import AppearancePage from './components/Settings/AppearancePage';
import ProfilePage from './components/Settings/ProfilePage';
import AIAssistant from './components/AI/AIAssistant';
import useLocalStorage from './hooks/useLocalStorage';
import type { UserData, Page, AppContextType } from './types';
import ConfirmModal from './components/UI/ConfirmModal';

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<string | null>(() => sessionStorage.getItem('eduAI_user'));
    const [data, setData] = useLocalStorage<UserData | null>(currentUser ? `eduai_data_${currentUser}` : null, null);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('eduai_theme') as 'light' | 'dark') || 'dark');
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; message: string; onConfirm: () => void; }>({ isOpen: false, message: '', onConfirm: () => {} });

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('eduai_theme', theme);
    }, [theme]);

    const handleLogin = (username: string) => {
        const userData = localStorage.getItem(`eduai_data_${username}`);
        if (!userData) {
            const newUserData: UserData = {
                profile: { name: username, avatar: username.charAt(0).toUpperCase() },
                courses: [],
                tasks: [],
                notes: [],
                habits: [],
                goals: [],
                assessments: [],
            };
            setData(newUserData);
        }
        sessionStorage.setItem('eduAI_user', username);
        setCurrentUser(username);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('eduAI_user');
        setCurrentUser(null);
        setData(null);
    };
    
    const showConfirm = (message: string, onConfirm: () => void) => {
        setConfirmModal({ isOpen: true, message, onConfirm });
    };

    const hideConfirm = () => {
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
    };

    const renderPage = useCallback(() => {
        switch (currentPage) {
            case 'dashboard': return <DashboardPage />;
            case 'courses': return <CoursesPage />;
            case 'tasks': return <TasksPage />;
            case 'notes': return <NotesPage />;
            case 'habits': return <HabitsPage />;
            case 'goals': return <GoalsPage />;
            case 'exams': return <ExamsPage />;
            case 'motivation': return <MotivationPage />;
            case 'appearance': return <AppearancePage />;
            case 'profile': return <ProfilePage />;
            default: return <DashboardPage />;
        }
    }, [currentPage]);
    
    if (!currentUser || !data) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const contextValue: AppContextType = {
        data,
        setData,
        currentUser,
        setCurrentUser,
        theme,
        setTheme,
        showConfirm
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className={`bg-light-gray dark:bg-dark-bg text-gray-800 dark:text-gray-200 min-h-screen flex font-sans transition-colors duration-300`}>
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
                <main className="flex-1 ml-0 md:ml-72 p-4 md:p-8 transition-all duration-300">
                    {renderPage()}
                </main>
                <AIAssistant />
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={hideConfirm}
                    onConfirm={() => {
                        confirmModal.onConfirm();
                        hideConfirm();
                    }}
                    message={confirmModal.message}
                />
            </div>
        </AppContext.Provider>
    );
};

export default App;
