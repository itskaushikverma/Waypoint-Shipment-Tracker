import { useEffect, useState } from 'react';
import Logo from './Logo';
import LoaderAnimation from './LoaderAnimation';

const HEALTH_URL = `${String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, '')}/health`;
const RETRY_MS = 3000;

export default function ServerWarmup({ children }) {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Waking up the server...');

  useEffect(() => {
    let cancelled = false;
    let retryId;

    const ping = async () => {
      try {
        const response = await fetch(HEALTH_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Server is not ready');
        if (!cancelled) setReady(true);
      } catch {
        if (cancelled) return;
        setMessage('Waking up the server...');
        retryId = window.setTimeout(ping, RETRY_MS);
      }
    };

    ping();

    return () => {
      cancelled = true;
      window.clearTimeout(retryId);
    };
  }, []);

  if (ready) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="flex flex-col items-center text-center">
        <Logo withWordmark size={44} className="mb-6 justify-center" />
        <LoaderAnimation />
        <h2 className="text-foreground mt-2 text-lg font-medium">{message}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          This can take a moment on the first request.
        </p>
      </div>
    </div>
  );
}
