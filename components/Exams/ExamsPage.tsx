
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import Modal from '../UI/Modal';
import type { Assessment } from '../../types';

const StatCard: React.FC<{ value: number; label: string; icon: string; color: string }> = ({ value, label, icon, color }) => (
    <div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
        <div className={`text-2xl text-white w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            <i className={`fas ${icon}`}></i>
        </div>
    </div>
);

const ExamsPage: React.FC = () => {
    const { data, setData, showConfirm } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    
    const stats = useMemo(() => {
        const assessments = data.assessments || [];
        return {
            courses: data.courses?.length || 0,
            exams: assessments.filter(a => a.type === 'exam').length,
            quizzes: assessments.filter(a => a.type === 'quiz').length,
            conflicts: assessments.filter(a => a.conflict).length,
        };
    }, [data.assessments, data.courses]);

    const filteredAssessments = useMemo(() => {
        let assessments = [...(data.assessments || [])].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (activeTab === 'exams') return assessments.filter(a => a.type === 'exam');
        if (activeTab === 'quizzes') return assessments.filter(a => a.type === 'quiz');
        if (activeTab === 'conflicts') return assessments.filter(a => a.conflict);
        return assessments;
    }, [data.assessments, activeTab]);
    
    const calculateEndTime = (startTime: string, duration: number) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleEdit = (assessment: Assessment) => {
        setEditingAssessment(assessment);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        showConfirm("Are you sure you want to delete this assessment?", () => {
            setData(prev => prev ? { ...prev, assessments: prev.assessments.filter(a => a.id !== id) } : null);
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const courseNameInput = formData.get('course') as string;
        
        let course = data.courses.find(c => c.name === courseNameInput || (c.code && `${c.name} (${c.code})` === courseNameInput));
        let courseId = course?.id;

        if (!course) {
            const newCourse = { id: `course_${Date.now()}`, name: courseNameInput, code: '', website: '' };
            setData(prev => prev ? { ...prev, courses: [...prev.courses, newCourse] } : prev);
            courseId = newCourse.id;
        }

        const assessmentData = {
            courseId: courseId!,
            type: formData.get('type') as 'exam' | 'quiz',
            date: formData.get('date') as string,
            startTime: formData.get('startTime') as string,
            duration: Number(formData.get('duration')),
            notes: formData.get('notes') as string,
        };
        
        // Simple conflict check (on the same day)
        const conflict = data.assessments.some(a => a.date === assessmentData.date && a.id !== editingAssessment?.id);

        if (editingAssessment) {
             setData(prev => prev ? { ...prev, assessments: prev.assessments.map(a => a.id === editingAssessment.id ? { ...a, ...assessmentData, conflict } : a) } : null);
        } else {
            const newAssessment: Assessment = { ...assessmentData, id: `assessment_${Date.now()}`, conflict };
            setData(prev => prev ? { ...prev, assessments: [...prev.assessments, newAssessment] } : null);
        }
        setIsModalOpen(false);
        setEditingAssessment(null);
    };

    return (
        <div>
            <PageHeader title="Exam & Quiz Scheduler" subtitle="Efficiently manage your academic assessments" icon="fa-calendar-alt" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard value={stats.courses} label="Total Courses" icon="fa-book" color="bg-blue-500" />
                <StatCard value={stats.exams} label="Upcoming Exams" icon="fa-file-alt" color="bg-purple-500" />
                <StatCard value={stats.quizzes} label="Scheduled Quizzes" icon="fa-tasks" color="bg-green-500" />
                <StatCard value={stats.conflicts} label="Conflicts Detected" icon="fa-exclamation-triangle" color="bg-red-500" />
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Assessment Schedule</h2>
                     <button onClick={() => { setEditingAssessment(null); setIsModalOpen(true); }} className="bg-navy-blue text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-800 transition-colors">
                        <i className="fas fa-plus mr-2"></i> Add
                    </button>
                </div>
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    {['all', 'exams', 'quizzes', 'conflicts'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize px-4 py-2 font-semibold text-sm transition-colors ${activeTab === tab ? 'border-b-2 border-navy-blue text-navy-blue dark:text-blue-400' : 'text-gray-500 hover:text-navy-blue'}`}>{tab}</button>
                    ))}
                </div>
                 <div>
                    {filteredAssessments.length > 0 ? filteredAssessments.map(assessment => {
                        const course = data.courses.find(c => c.id === assessment.courseId);
                        const endTime = calculateEndTime(assessment.startTime, assessment.duration);
                        return (
                        <div key={assessment.id} className={`grid grid-cols-3 md:grid-cols-5 gap-4 items-center p-3 rounded-lg mb-2 ${assessment.conflict ? 'bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                            <div className="font-semibold">{formatDate(assessment.date)}</div>
                            <div>{course?.name || 'Unknown'}</div>
                            <div className="hidden md:block"><span className={`text-xs font-bold px-2 py-1 rounded-full ${assessment.type === 'exam' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'}`}>{assessment.type}</span></div>
                            <div className="hidden md:block">{assessment.startTime} - {endTime}</div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(assessment)} className="text-gray-400 hover:text-blue-500"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(assessment.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                        );
                    }) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                             <i className="fas fa-calendar-times text-4xl mb-4"></i>
                             <p>No assessments found for this filter.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingAssessment(null); }} title={editingAssessment ? 'Edit Assessment' : 'Schedule New Assessment'}>
                 <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="assessmentCourse" className="block text-sm font-bold mb-2">Course</label>
                        <input id="assessmentCourse" name="course" type="text" list="course-list" defaultValue={editingAssessment ? (data.courses.find(c=> c.id === editingAssessment.courseId)?.name) : ''} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" placeholder="Type or select a course" required />
                        <datalist id="course-list">
                            {data.courses.map(course => (
                                <option key={course.id} value={course.name + (course.code ? ` (${course.code})` : '')} />
                            ))}
                        </datalist>
                    </div>
                    <div className="mb-4">
                         <label htmlFor="assessmentType" className="block text-sm font-bold mb-2">Assessment Type</label>
                        <select id="assessmentType" name="type" defaultValue={editingAssessment?.type || 'exam'} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" required>
                            <option value="exam">Exam</option>
                            <option value="quiz">Quiz</option>
                        </select>
                    </div>
                    <div className="mb-4">
                         <label htmlFor="assessmentDate" className="block text-sm font-bold mb-2">Date</label>
                        <input id="assessmentDate" name="date" type="date" defaultValue={editingAssessment?.date} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="assessmentStartTime" className="block text-sm font-bold mb-2">Start Time</label>
                            <input id="assessmentStartTime" name="startTime" type="time" defaultValue={editingAssessment?.startTime} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" required/>
                        </div>
                        <div>
                            <label htmlFor="assessmentDuration" className="block text-sm font-bold mb-2">Duration (min)</label>
                            <input id="assessmentDuration" name="duration" type="number" defaultValue={editingAssessment?.duration || 60} min="15" className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" required/>
                        </div>
                    </div>
                     <div className="mb-6">
                        <label htmlFor="assessmentNotes" className="block text-sm font-bold mb-2">Notes</label>
                        <textarea id="assessmentNotes" name="notes" rows={2} defaultValue={editingAssessment?.notes} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input"></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); setEditingAssessment(null); }} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white">Save Assessment</button>
                    </div>
                 </form>
            </Modal>
        </div>
    );
};

export default ExamsPage;
