import { Buffer } from 'buffer';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

// Solana web3 and the DBC SDK expect Buffer in browser environments.
globalThis.Buffer = Buffer;
const { default: App } = await import('./App');
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
