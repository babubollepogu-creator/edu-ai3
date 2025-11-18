
import React, { useState } from 'react';
import PageHeader from '../UI/PageHeader';

const categories = [
    { name: "Success Mindset", icon: "fa-trophy", tips: ["Believe you can and you're halfway there.", "Success is not final, failure is not fatal: It is the courage to continue that counts."]},
    { name: "Overcoming Challenges", icon: "fa-mountain", tips: ["The harder the conflict, the greater the triumph.", "Obstacles don't have to stop you."]},
    { name: "Daily Habits", icon: "fa-calendar-check", tips: ["Small daily improvements are the key to staggering long-term results.", "We are what we repeatedly do. Excellence, then, is not an act, but a habit."]},
    { name: "Positive Thinking", icon: "fa-smile", tips: ["Keep your face always toward the sunshine—and shadows will fall behind you.", "Once you replace negative thoughts with positive ones, you'll start having positive results."]},
    { name: "Productivity", icon: "fa-tasks", tips: ["Focus on being productive instead of busy.", "The key is not to prioritize what's on your schedule, but to schedule your priorities."]},
    { name: "Creativity", icon: "fa-lightbulb", tips: ["Creativity is intelligence having fun.", "You can't use up creativity. The more you use, the more you have."]},
];

const MotivationPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const openCategory = (index: number) => {
        setSelectedCategory(index);
        setCurrentTipIndex(0);
    };

    const nextTip = () => {
        if (selectedCategory !== null) {
            const tips = categories[selectedCategory].tips;
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        }
    };
    
    const prevTip = () => {
        if (selectedCategory !== null) {
            const tips = categories[selectedCategory].tips;
            setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
        }
    };

    const currentCategory = selectedCategory !== null ? categories[selectedCategory] : null;

    return (
        <div>
            <PageHeader title="Motivational Tips" subtitle="Your daily dose of inspiration" icon="fa-brain" />
            
            {selectedCategory === null ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <button key={index} onClick={() => openCategory(index)} className="bg-white dark:bg-dark-card p-8 rounded-xl text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <i className={`fas ${category.icon} text-3xl text-navy-blue dark:text-blue-400 mb-4`}></i>
                            <h3 className="font-bold text-lg">{category.name}</h3>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center animate-fade-in">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                         <h2 className="text-2xl font-bold">{currentCategory?.name}</h2>
                         <div className="bg-navy-blue text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Tip {currentTipIndex + 1} of {currentCategory?.tips.length}
                         </div>
                    </div>
                   <div className="bg-white dark:bg-dark-card p-10 rounded-2xl shadow-xl max-w-2xl mx-auto border-l-4 border-navy-blue">
                        <p className="text-2xl italic text-gray-700 dark:text-gray-300">"{currentCategory?.tips[currentTipIndex]}"</p>
                   </div>
                   <div className="mt-8 flex justify-center gap-4">
                        <button onClick={() => setSelectedCategory(null)} className="py-2 px-6 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"><i className="fas fa-arrow-left mr-2"></i> Back</button>
                        <button onClick={prevTip} className="py-2 px-6 rounded-lg bg-navy-blue text-white hover:bg-blue-800 transition-colors"><i className="fas fa-chevron-left mr-2"></i> Previous</button>
                        <button onClick={nextTip} className="py-2 px-6 rounded-lg bg-navy-blue text-white hover:bg-blue-800 transition-colors">Next <i className="fas fa-chevron-right ml-2"></i></button>
                   </div>
                   <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                </div>
            )}
        </div>
    );
};

export default MotivationPage;
