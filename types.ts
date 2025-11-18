
import type React from 'react';

export type Page = 'dashboard' | 'courses' | 'tasks' | 'notes' | 'habits' | 'goals' | 'exams' | 'motivation' | 'appearance' | 'profile';

export interface Profile {
  name: string;
  age?: string;
  gender?: string;
  avatar: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  website?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  courseId: string;
  status: 'todo' | 'inprogress' | 'done';
}

export interface Note {
  id: string;
  title: string;
  content: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  type: 'exam' | 'quiz';
  date: string;
  startTime: string;
  duration: number; // in minutes
  notes?: string;
  conflict?: boolean;
}

export interface UserData {
  profile: Profile;
  courses: Course[];
  tasks: Task[];
  notes: Note[];
  habits: Habit[];
  goals: Goal[];
  assessments: Assessment[];
}

export interface AppContextType {
    data: UserData;
    setData: React.Dispatch<React.SetStateAction<UserData | null>>;
    currentUser: string;
    setCurrentUser: React.Dispatch<React.SetStateAction<string | null>>;
    theme: 'light' | 'dark';
    setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
    showConfirm: (message: string, onConfirm: () => void) => void;
}
