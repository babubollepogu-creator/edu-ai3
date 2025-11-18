
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6 || password.length > 8) {
        setError('Password must be 6-8 characters long.');
        return;
    }
    setError('');
    onLogin(username);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="aurora-bg">
        <div className="aurora-shape aurora-shape-1"></div>
        <div className="aurora-shape aurora-shape-2"></div>
        <div className="aurora-shape aurora-shape-3"></div>
      </div>
      <div className="relative z-10 w-full max-w-md bg-white/70 dark:bg-dark-card/70 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 transform hover:scale-[1.02] transition-transform duration-300">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-navy-blue rounded-full mb-4 shadow-lg">
            <i className="fas fa-graduation-cap text-white text-4xl"></i>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">EduAI</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Smart Student Organization System</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100/80 dark:bg-dark-input/80 border-2 border-transparent focus:border-navy-blue focus:bg-white dark:focus:bg-dark-card focus:outline-none transition"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100/80 dark:bg-dark-input/80 border-2 border-transparent focus:border-navy-blue focus:bg-white dark:focus:bg-dark-card focus:outline-none transition"
              placeholder="Enter your password"
              required
            />
             {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-navy-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:shadow-outline transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> Sign In
          </button>
        </form>
        <div className="text-center mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                <i className="fas fa-info-circle mr-1"></i> Demo: Use any username & a password of 6-8 chars.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
