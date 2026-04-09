/*
 * Shared render utility. Every render hook in connect() calls this function to
 * mount its entrypoint component into the single #root element. A single
 * createRoot is reused across all hooks because only one iframe — and therefore
 * one hook — is active at a time.
 */

import type React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!);

export function render(component: React.ReactNode): void {
  root.render(<StrictMode>{component}</StrictMode>);
}
