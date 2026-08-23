import { useEffect, useState, ReactNode } from 'react';
import { validateEnv } from '../lib/env';

interface Props {
  children: ReactNode;
}

export default function StartupGuard({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const envError = validateEnv();
      if (envError) {
        setError(envError);
        return;
      }
      setReady(true);
    } catch (err: any) {
      setError(err.message || 'Startup failed');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
            <span className="text-2xl text-amber-400">⚙️</span>
          </div>
          <h1 className="text-2xl font-light text-white mb-2">Configuration Error</h1>
          <p className="text-neutral-400 text-sm mb-6">{error}</p>
          <p className="text-neutral-600 text-xs">
            Check your environment variables and deployment configuration.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-neutral-500 text-xs tracking-widest uppercase">Loading Devsiy</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
