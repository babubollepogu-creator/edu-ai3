
import React, { useState } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import Modal from '../UI/Modal';
import type { Goal } from '../../types';

const GoalsPage: React.FC = () => {
    const { data, setData, showConfirm } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        showConfirm("Are you sure you want to delete this goal?", () => {
            setData(prev => prev ? { ...prev, goals: prev.goals.filter(g => g.id !== id) } : null);
        });
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const goalData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            targetDate: formData.get('targetDate') as string,
            progress: Number(formData.get('progress')),
        };

        if (editingGoal) {
            setData(prev => prev ? { ...prev, goals: prev.goals.map(g => g.id === editingGoal.id ? { ...g, ...goalData } : g) } : null);
        } else {
            const newGoal: Goal = { ...goalData, id: `goal_${Date.now()}` };
            setData(prev => prev ? { ...prev, goals: [...prev.goals, newGoal] } : null);
        }
        setIsModalOpen(false);
        setEditingGoal(null);
    };

    return (
        <div>
            <PageHeader title="Academic Goals" subtitle="Set and achieve your learning objectives" icon="fa-bullseye" />
            <div className="text-right mb-6">
                <button onClick={() => { setEditingGoal(null); setIsModalOpen(true); }} className="bg-navy-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                    <i className="fas fa-plus mr-2"></i> Set Goal
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.goals.length > 0 ? data.goals.map(goal => (
                    <div key={goal.id} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-5 flex flex-col justify-between group border-l-4 border-blue-700">
                        <div>
                            <h4 className="font-bold text-xl text-gray-800 dark:text-white">{goal.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 my-2 text-sm">{goal.description}</p>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-navy-blue h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <span>{goal.progress}% Complete</span>
                                <span>Target: {goal.targetDate || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(goal)} className="text-gray-400 hover:text-blue-500"><i className="fas fa-edit"></i></button>
                             <button onClick={() => handleDelete(goal.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                        </div>
                    </div>
                )) : (
                     <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        <i className="fas fa-bullseye text-4xl mb-4"></i>
                        <p>No goals set yet. Set a new goal to get started!</p>
                    </div>
                )}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingGoal(null); }} title={editingGoal ? 'Edit Goal' : 'Set New Goal'}>
                 <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="goalTitle" className="block text-sm font-bold mb-2">Goal Title</label>
                        <input id="goalTitle" name="title" type="text" defaultValue={editingGoal?.title} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="goalDescription" className="block text-sm font-bold mb-2">Description</label>
                        <textarea id="goalDescription" name="description" rows={3} defaultValue={editingGoal?.description} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input"></textarea>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="goalTargetDate" className="block text-sm font-bold mb-2">Target Date</label>
                        <input id="goalTargetDate" name="targetDate" type="date" defaultValue={editingGoal?.targetDate} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="goalProgress" className="block text-sm font-bold mb-2">Progress ({editingGoal ? editingGoal.progress : 0}%)</label>
                        <input id="goalProgress" name="progress" type="range" min="0" max="100" defaultValue={editingGoal?.progress || 0} onChange={(e) => setEditingGoal(g => g ? {...g, progress: Number(e.target.value)} : null)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); setEditingGoal(null); }} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white">Save Goal</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GoalsPage;
