/**
 * Entry point for StudySphere frontend.
 * Renders the main App component.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);