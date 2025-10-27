import React, { useState } from 'react';
import { StoreIcon } from './icons';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication: any email is fine, but password must be 'password'
    if (password === 'password' && email) {
      onLogin(email);
    } else {
      setError('Invalid credentials. Hint: use password "password".');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-plasma-bg p-4">
      <div className="w-full max-w-md bg-plasma-surface rounded-xl shadow-lg border border-plasma-border p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 text-plasma-accent mb-4">
            <StoreIcon />
          </div>
          <h1 className="text-3xl font-bold text-plasma-text">AI Storefront Generator</h1>
          <p className="text-plasma-text-subtle mt-1">Please log in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-plasma-text text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none"
              placeholder="user@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-plasma-text text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-plasma-bg border border-plasma-border rounded-md focus:ring-2 focus:ring-plasma-accent focus:outline-none"
              placeholder="••••••••"
            />
             <p className="text-xs text-plasma-text-subtle mt-2">Use any email and the password: <span className="font-mono bg-plasma-bg px-1 rounded">password</span></p>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-plasma-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-plasma-accent-hover transition-colors"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
       <footer className="text-center p-4 mt-4 text-plasma-text-subtle text-sm">
        <p>AI E-Commerce Solution for Small Shops | Powered by Gemini</p>
      </footer>
    </div>
  );
};
