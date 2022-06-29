import React from 'react';
import ReactDOM from 'react-dom/client';
import { Logo } from '@/components/Logo';
import '@/style/default.css';

const App: React.FC = () => (
  <div className="grid justify-items-center border-2 rounded-lg border-blue-700 container">
    <Logo />
    <p className="text-xl font-bold">webpack-boilerplate</p>
    <p className="text-base text-gray-500">This is the Index page.</p>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
