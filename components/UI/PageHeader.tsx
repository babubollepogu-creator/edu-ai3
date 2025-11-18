
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="relative bg-gradient-to-r from-navy-blue to-blue-700 dark:from-dark-card dark:to-slate-700 p-8 md:p-12 mb-8 rounded-2xl text-white shadow-2xl overflow-hidden animate-gradient">
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-shadow-lg">
           <i className={`fas ${icon} mr-4`}></i>{title}
        </h1>
        <p className="text-lg md:text-xl opacity-90">{subtitle}</p>
      </div>
    </div>
  );
};

export default PageHeader;
