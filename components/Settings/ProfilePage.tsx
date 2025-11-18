
import React, { useState } from 'react';
import { useAppContext } from '../../App';
import PageHeader from '../UI/PageHeader';
import type { Profile } from '../../types';

const ProfilePage: React.FC = () => {
    const { data, setData, currentUser, setCurrentUser } = useAppContext();
    const [profile, setProfile] = useState<Profile>(data.profile);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = { ...profile, avatar: profile.name.charAt(0).toUpperCase() };
        
        if (profile.name !== currentUser) {
            const newKey = `eduai_data_${profile.name}`;
            const oldKey = `eduai_data_${currentUser}`;
            const currentData = JSON.parse(localStorage.getItem(oldKey) || '{}');
            localStorage.setItem(newKey, JSON.stringify({ ...currentData, profile: updatedProfile }));
            localStorage.removeItem(oldKey);
            sessionStorage.setItem('eduAI_user', profile.name);
            setCurrentUser(profile.name);
        } else {
             setData(prev => prev ? { ...prev, profile: updatedProfile } : null);
        }
    };
    
    return (
        <div>
            <PageHeader title="Profile Settings" subtitle="Manage your account information" icon="fa-user-cog" />
             <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="profileName" className="block text-sm font-bold mb-2">Username</label>
                        <input id="profileName" name="name" type="text" value={profile.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" required />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="profileAge" className="block text-sm font-bold mb-2">Age</label>
                        <input id="profileAge" name="age" type="number" value={profile.age || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="profileGender" className="block text-sm font-bold mb-2">Gender</label>
                        <input id="profileGender" name="gender" type="text" value={profile.gender || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" />
                    </div>
                     <div className="mb-6">
                        <label htmlFor="profileAvatarUrl" className="block text-sm font-bold mb-2">Avatar URL</label>
                        <input id="profileAvatarUrl" name="avatarUrl" type="url" value={profile.avatarUrl || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-dark-input" placeholder="https://example.com/image.png"/>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="py-2 px-6 rounded-lg bg-navy-blue text-white font-bold hover:bg-blue-800 transition-colors">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
