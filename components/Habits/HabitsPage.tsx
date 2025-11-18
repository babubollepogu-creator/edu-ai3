
import React, { useState } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import Modal from '../UI/Modal';
import type { Habit } from '../../types';

const HabitsPage: React.FC = () => {
    const { data, setData, showConfirm } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        showConfirm("Are you sure you want to delete this habit?", () => {
            setData(prev => prev ? { ...prev, habits: prev.habits.filter(h => h.id !== id) } : null);
        });
    };
    
    const handleComplete = (id: string) => {
        setData(prev => {
            if (!prev) return null;
            const now = new Date();
            const todayStr = now.toISOString().slice(0, 10);
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().slice(0, 10);

            return {
                ...prev,
                habits: prev.habits.map(h => {
                    if (h.id === id) {
                        let newStreak = h.streak;
                        if (h.lastCompleted && h.lastCompleted.slice(0, 10) === yesterdayStr) {
                             newStreak = (h.streak || 0) + 1;
                        } else if (!h.lastCompleted || h.lastCompleted.slice(0, 10) !== todayStr) {
                            newStreak = 1;
                        }
                        return { ...h, lastCompleted: now.toISOString(), streak: newStreak };
                    }
                    return h;
                })
            };
        });
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const habitName = formData.get('name') as string;

        if (editingHabit) {
            setData(prev => prev ? { ...prev, habits: prev.habits.map(h => h.id === editingHabit.id ? { ...h, name: habitName } : h) } : null);
        } else {
            const newHabit: Habit = { id: `habit_${Date.now()}`, name: habitName, streak: 0, lastCompleted: null };
            setData(prev => prev ? { ...prev, habits: [...prev.habits, newHabit] } : null);
        }
        setIsModalOpen(false);
        setEditingHabit(null);
    };

    return (
        <div>
            <PageHeader title="Study Habits" subtitle="Build consistent learning routines" icon="fa-calendar-check" />
             <div className="text-right mb-6">
                <button onClick={() => { setEditingHabit(null); setIsModalOpen(true); }} className="bg-navy-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                    <i className="fas fa-plus mr-2"></i> Add Habit
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.habits.length > 0 ? data.habits.map(habit => {
                    const now = new Date().getTime();
                    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).getTime() : 0;
                    const canComplete = (now - lastCompleted) > 24 * 60 * 60 * 1000;
                    
                    return (
                        <div key={habit.id} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-5 flex flex-col justify-between group border-l-4 border-green-500">
                            <h4 className="font-bold text-xl text-gray-800 dark:text-white mb-4">{habit.name}</h4>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-yellow-500"><i className="fas fa-fire"></i> {habit.streak} Day Streak</span>
                                <div className="flex gap-2">
                                    <button onClick={() => canComplete && handleComplete(habit.id)} disabled={!canComplete} className={`text-xl ${canComplete ? 'text-gray-400 hover:text-green-500' : 'text-green-500 cursor-not-allowed'}`} title={canComplete ? 'Mark as complete' : 'Completed today'}>
                                        <i className="fas fa-check-circle"></i>
                                    </button>
                                    <button onClick={() => handleEdit(habit)} className="text-gray-400 hover:text-blue-500"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(habit.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        <i className="fas fa-calendar-check text-4xl mb-4"></i>
                        <p>No habits added yet. Create a new habit to start tracking!</p>
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingHabit(null); }} title={editingHabit ? 'Edit Habit' : 'Add New Habit'}>
                 <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="habitName" className="block text-sm font-bold mb-2">Habit Name</label>
                        <input id="habitName" name="name" type="text" defaultValue={editingHabit?.name} placeholder="e.g., Review flashcards for 15 mins" className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input focus:outline-none" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); setEditingHabit(null); }} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white">Save Habit</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default HabitsPage;
