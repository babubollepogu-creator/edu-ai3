
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import Modal from '../UI/Modal';
import type { Course } from '../../types';

const getSmartCourseUrl = (websiteName: string, courseName: string): string => {
    if (!websiteName || !courseName) return '#';
    const site = websiteName.toLowerCase().replace(/ /g, '');

    const sitePatterns: { [key: string]: (course: string) => string } = {
        'w3schools': (course) => `https://www.w3schools.com/${encodeURIComponent(course.toLowerCase().replace(/ /g, ''))}/`,
        'geeksforgeeks': (course) => `https://www.geeksforgeeks.org/${encodeURIComponent(course.toLowerCase().replace(/ /g, '-'))}/`,
        'youtube': (course) => `https://www.youtube.com/results?search_query=${encodeURIComponent(course)}`,
    };
    
    if (sitePatterns[site]) {
        return sitePatterns[site](courseName);
    }
    
    // Default to a Google search
    return `https://www.google.com/search?q=${encodeURIComponent(courseName)}+${encodeURIComponent(websiteName)}`;
};

const getWebsiteDisplayName = (website: string): string => {
    const websiteNames: { [key: string]: string } = {
        'w3schools': 'W3Schools',
        'geeksforgeeks': 'GeeksforGeeks',
        'youtube': 'YouTube',
    };
    return websiteNames[website] || website;
};


const CoursesPage: React.FC = () => {
    const { data, setData, showConfirm } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [courseWebsite, setCourseWebsite] = useState('');
    const [customWebsite, setCustomWebsite] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseName) return;
        const finalWebsite = courseWebsite === 'other' ? customWebsite : courseWebsite;

        const newCourse: Course = {
            id: `course_${Date.now()}`,
            name: courseName,
            code: courseCode,
            website: finalWebsite,
        };
        setData(prev => prev ? { ...prev, courses: [...prev.courses, newCourse] } : null);
        setIsModalOpen(false);
        setCourseName('');
        setCourseCode('');
        setCourseWebsite('');
        setCustomWebsite('');
    };
    
    const deleteCourse = (id: string) => {
        showConfirm("Are you sure? This will also delete all tasks and assessments for this course.", () => {
             setData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    courses: prev.courses.filter(c => c.id !== id),
                    tasks: prev.tasks.filter(t => t.courseId !== id),
                    assessments: prev.assessments.filter(a => a.courseId !== id),
                };
            });
        });
    };

    const sortedCourses = useMemo(() => {
        return [...data.courses].sort((a, b) => a.name.localeCompare(b.name));
    }, [data.courses]);

    return (
        <div>
            <PageHeader title="Course Management" subtitle="Organize your academic courses and resources" icon="fa-book" />
            <div className="text-right mb-6">
                <button onClick={() => setIsModalOpen(true)} className="bg-navy-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors shadow-md">
                    <i className="fas fa-plus mr-2"></i> New Course
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.length > 0 ? sortedCourses.map(course => (
                    <div key={course.id} className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-5 flex flex-col justify-between relative group transform hover:-translate-y-1 transition-transform duration-300 border-l-4 border-navy-blue">
                        <div>
                            <h4 className="font-bold text-xl text-gray-800 dark:text-white">{course.name}</h4>
                            {course.code && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{course.code}</p>}
                        </div>
                        {course.website && (
                            <a href={getSmartCourseUrl(course.website, course.name)} target="_blank" rel="noopener noreferrer" className="text-sm text-navy-blue dark:text-blue-400 font-semibold hover:underline mt-4">
                                <i className="fas fa-link mr-2"></i> Find on {getWebsiteDisplayName(course.website)}
                            </a>
                        )}
                        <button onClick={() => deleteCourse(course.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                )) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                        <i className="fas fa-book-open text-4xl mb-4"></i>
                        <p>No courses added yet. Add your first course!</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="courseName" className="block text-sm font-bold mb-2">Course Name</label>
                        <input id="courseName" type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input border-2 border-transparent focus:border-navy-blue focus:bg-white dark:focus:bg-dark-card focus:outline-none transition" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="courseCode" className="block text-sm font-bold mb-2">Course Code (Optional)</label>
                        <input id="courseCode" type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input border-2 border-transparent focus:border-navy-blue focus:bg-white dark:focus:bg-dark-card focus:outline-none transition" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="courseWebsite" className="block text-sm font-bold mb-2">Website (Optional)</label>
                         <select id="courseWebsite" value={courseWebsite} onChange={e => setCourseWebsite(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input border-2 border-transparent focus:border-navy-blue focus:bg-white dark:focus:bg-dark-card focus:outline-none transition appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                            <option value="">Select a website</option>
                            <option value="w3schools">W3Schools</option>
                            <option value="geeksforgeeks">GeeksforGeeks</option>
                            <option value="youtube">YouTube</option>
                            <option value="other">Other...</option>
                        </select>
                        {courseWebsite === 'other' && (
                            <div className="mt-4">
                                <label htmlFor="customWebsite" className="block text-sm font-bold mb-2">Custom Website Name</label>
                                <input 
                                id="customWebsite"
                                type="text" 
                                value={customWebsite} 
                                onChange={e => setCustomWebsite(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input border-2 border-transparent focus:border-navy-blue focus:bg-white dark:focus:bg-dark-card focus:outline-none transition" 
                                placeholder="Enter website name"
                                required 
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white hover:bg-blue-800 transition-colors">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CoursesPage;
