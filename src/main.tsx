import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import StartupGuard from './components/StartupGuard';
import './index.css';

const App = lazy(() => import('./App.tsx'));

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-neutral-500 text-xs tracking-widest uppercase">Loading Experience</p>
      </div>
    </div>
  );
}

function boot() {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fff;font-family:sans-serif;padding:20px;">
        <div style="text-align:center;">
          <h1 style="font-size:20px;margin-bottom:8px;font-weight:400;">Application mount point missing</h1>
          <p style="color:#888;font-size:14px;">The #root element was not found in the HTML document.</p>
        </div>
      </div>
    `;
    return;
  }

  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Rejection]', event.reason);
  });

  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <StartupGuard>
          <Suspense fallback={<Fallback />}>
            <App />
          </Suspense>
        </StartupGuard>
      </ErrorBoundary>
    </StrictMode>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
