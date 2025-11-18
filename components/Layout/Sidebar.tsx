
import React from 'react';
import type { Page } from '../../types';
import { useAppContext } from '../../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  page: Page;
  icon: string;
  label: string;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}> = ({ page, icon, label, currentPage, setCurrentPage }) => (
  <a
    onClick={() => setCurrentPage(page)}
    className={`flex items-center gap-4 px-6 py-5 mb-2 rounded-xl text-white font-medium cursor-pointer transition-all duration-300 relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-white before:transition-transform before:duration-300 ${
      currentPage === page
        ? 'bg-white/20 shadow-lg before:scale-y-100'
        : 'hover:bg-white/10 hover:translate-x-2 before:scale-y-0'
    }`}
  >
    <i className={`fas ${icon} w-6 text-center`}></i>
    <span>{label}</span>
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
  const { data, theme, setTheme } = useAppContext();
  const { profile } = data;
  const avatarContent = profile.avatarUrl ? (
    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
  ) : (
    profile.avatar
  );

  return (
    <nav className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-navy-blue to-blue-900 dark:from-dark-sidebar dark:to-slate-900 p-4 flex flex-col z-50 transition-transform duration-300 -translate-x-full md:translate-x-0 animate-gradient">
      <div className="px-4 pb-6 mb-6 flex items-center gap-4 border-b border-white/10">
        <div className="w-12 h-12 bg-navy-blue rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h1 className="text-3xl font-bold text-white">EduAI</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <NavItem page="dashboard" icon="fa-home" label="Dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="courses" icon="fa-book" label="Courses" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="tasks" icon="fa-tasks" label="Tasks" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="notes" icon="fa-sticky-note" label="Notes" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="habits" icon="fa-calendar-check" label="Habits" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="goals" icon="fa-bullseye" label="Goals" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="exams" icon="fa-calendar-alt" label="Exams" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="motivation" icon="fa-brain" label="Motivation" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="appearance" icon="fa-cog" label="Appearance" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <NavItem page="profile" icon="fa-user-cog" label="Profile" currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      <div className="p-4 border-t border-white/10">
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-4 px-4 py-3 mb-4 rounded-xl text-white font-medium cursor-pointer transition-all duration-300 hover:bg-white/10"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} w-6 text-center`}></i>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
            {avatarContent}
          </div>
          <div>
            <h4 className="font-semibold text-white">{profile.name}</h4>
            <a onClick={onLogout} className="text-sm text-white/70 hover:text-white cursor-pointer">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
