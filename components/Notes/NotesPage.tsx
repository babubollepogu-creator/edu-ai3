
import React, { useState } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import Modal from '../UI/Modal';
import type { Note } from '../../types';

const NotesPage: React.FC = () => {
    const { data, setData, showConfirm } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const handleEdit = (note: Note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        showConfirm("Are you sure you want to delete this note?", () => {
             setData(prev => prev ? { ...prev, notes: prev.notes.filter(n => n.id !== id) } : null);
        });
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const noteData = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
        };

        if (editingNote) {
            setData(prev => prev ? { ...prev, notes: prev.notes.map(n => n.id === editingNote.id ? { ...n, ...noteData } : n) } : null);
        } else {
            const newNote: Note = { ...noteData, id: `note_${Date.now()}` };
            setData(prev => prev ? { ...prev, notes: [...prev.notes, newNote] } : null);
        }
        setIsModalOpen(false);
        setEditingNote(null);
    };

    return (
        <div>
            <PageHeader title="Study Notes" subtitle="Capture and organize your learning materials" icon="fa-sticky-note" />
            <div className="text-right mb-6">
                <button onClick={() => { setEditingNote(null); setIsModalOpen(true); }} className="bg-navy-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                    <i className="fas fa-plus mr-2"></i> New Note
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.notes.length > 0 ? data.notes.map(note => (
                    <div key={note.id} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-5 flex flex-col justify-between group transform hover:-translate-y-1 transition-transform duration-300 border-l-4 border-yellow-500">
                        <div>
                            <h4 className="font-bold text-xl text-gray-800 dark:text-white mb-2">{note.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">{note.content}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(note)} className="text-gray-400 hover:text-blue-500"><i className="fas fa-edit"></i></button>
                             <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        <i className="fas fa-sticky-note text-4xl mb-4"></i>
                        <p>No notes saved yet. Create your first note!</p>
                    </div>
                )}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingNote(null); }} title={editingNote ? 'Edit Note' : 'Add New Note'}>
                 <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="noteTitle" className="block text-sm font-bold mb-2">Title</label>
                        <input id="noteTitle" name="title" type="text" defaultValue={editingNote?.title} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input focus:outline-none" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="noteContent" className="block text-sm font-bold mb-2">Content</label>
                        <textarea id="noteContent" name="content" rows={8} defaultValue={editingNote?.content} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input focus:outline-none"></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); setEditingNote(null); }} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white">Save Note</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default NotesPage;
