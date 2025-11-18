
import React, { useState } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import Modal from '../UI/Modal';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  courseName?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, courseName }) => {
    return (
        <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md mb-3 border-l-4 border-navy-blue cursor-grab active:cursor-grabbing" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}>
            <div className="flex justify-between items-start">
                <strong className="text-gray-800 dark:text-white">{task.title}</strong>
                <div className="flex gap-2">
                     <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-500"><i className="fas fa-edit"></i></button>
                     <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm my-2">{task.description}</p>
            <div className="text-xs text-gray-500 dark:text-gray-500">{courseName || 'General'}</div>
        </div>
    );
};

interface TaskColumnProps {
    title: string;
    status: 'todo' | 'inprogress' | 'done';
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    // FIX: Update onDrop prop signature to accept taskId.
    onDrop: (taskId: string, status: 'todo' | 'inprogress' | 'done') => void;
    courses: {id: string; name: string; code?: string}[];
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onEdit, onDelete, onDrop, courses }) => {
    const [isOver, setIsOver] = useState(false);
    return (
        <div 
            className={`bg-gray-100 dark:bg-dark-bg p-4 rounded-xl transition-all duration-300 ${isOver ? 'border-2 border-dashed border-navy-blue' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            // FIX: Handle drop event correctly, extract taskId and pass it to the onDrop handler.
            onDrop={(e) => { e.preventDefault(); const taskId = e.dataTransfer.getData('text/plain'); onDrop(taskId, status); setIsOver(false); }}
        >
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white text-center pb-2 border-b-2 border-gray-200 dark:border-gray-700">{title}</h3>
            <div className="min-h-[200px]">
                {tasks.length > 0 ? tasks.map(task => (
                    <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} courseName={courses.find(c => c.id === task.courseId)?.name} />
                )) : <div className="text-center py-10 text-gray-500">Drop tasks here</div>}
            </div>
        </div>
    );
};


const TasksPage: React.FC = () => {
    const { data, setData, showConfirm } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        showConfirm("Are you sure you want to delete this task?", () => {
             setData(prev => prev ? { ...prev, tasks: prev.tasks.filter(t => t.id !== id) } : null);
        });
    };

    const handleDrop = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
        setData(prev => {
            if (!prev) return null;
            const taskIndex = prev.tasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                const newTasks = [...prev.tasks];
                newTasks[taskIndex] = { ...newTasks[taskIndex], status: newStatus };
                return { ...prev, tasks: newTasks };
            }
            return prev;
        });
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const taskData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            courseId: formData.get('courseId') as string,
        };

        if (editingTask) {
            setData(prev => prev ? { ...prev, tasks: prev.tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t) } : null);
        } else {
            const newTask: Task = { ...taskData, id: `task_${Date.now()}`, status: 'todo' };
            setData(prev => prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    };
    
    return (
        <div>
            <PageHeader title="Task Management" subtitle="Stay on top of your assignments and deadlines" icon="fa-tasks" />
            <div className="text-right mb-6">
                <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-navy-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                    <i className="fas fa-plus mr-2"></i> Add New Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* FIX: Pass handleDrop directly to onDrop prop to avoid using implicit global 'event'. */}
                <TaskColumn title="To Do" status="todo" tasks={data.tasks.filter(t => t.status === 'todo')} onEdit={handleEdit} onDelete={handleDelete} courses={data.courses} onDrop={handleDrop} />
                <TaskColumn title="In Progress" status="inprogress" tasks={data.tasks.filter(t => t.status === 'inprogress')} onEdit={handleEdit} onDelete={handleDelete} courses={data.courses} onDrop={handleDrop} />
                <TaskColumn title="Done" status="done" tasks={data.tasks.filter(t => t.status === 'done')} onEdit={handleEdit} onDelete={handleDelete} courses={data.courses} onDrop={handleDrop} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'Add New Task'}>
                 <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="taskTitle" className="block text-sm font-bold mb-2">Task Title</label>
                        <input id="taskTitle" name="title" type="text" defaultValue={editingTask?.title} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input focus:outline-none" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taskDescription" className="block text-sm font-bold mb-2">Description</label>
                        <textarea id="taskDescription" name="description" rows={3} defaultValue={editingTask?.description} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input focus:outline-none"></textarea>
                    </div>
                     <div className="mb-6">
                        <label htmlFor="taskCourse" className="block text-sm font-bold mb-2">Course (optional)</label>
                        <select id="taskCourse" name="courseId" defaultValue={editingTask?.courseId} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input focus:outline-none">
                            <option value="">General</option>
                            {data.courses.map(c => <option key={c.id} value={c.id}>{c.name} {c.code ? `(${c.code})` : ''}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); setEditingTask(null); }} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white">Save Task</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TasksPage;
