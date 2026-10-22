import { useEffect } from 'react';
import Logo from './Logo';
import LoaderAnimation from './LoaderAnimation';
import { useHealthQuery } from '../redux/api';

const RETRY_MS = 3000;
const message = 'Waking up the server...';

export default function ServerWarmup({ children }) {
  const { isSuccess: ready, isError, isFetching, refetch } = useHealthQuery();

  useEffect(() => {
    if (!isError || isFetching || ready) return undefined;

    const retryId = window.setTimeout(() => {
      refetch();
    }, RETRY_MS);

    return () => window.clearTimeout(retryId);
  }, [isError, isFetching, ready, refetch]);

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
