import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { registerServiceWorker } from '@/utils/registerServiceWorker.ts';

import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
    },
    queries: {
      // Keep cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Don't refetch on reconnect automatically
      refetchOnReconnect: 'always',
      // Refetch on window focus only if stale
      refetchOnWindowFocus: 'always',
      // Retry failed requests 2 times
      retry: 2,
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,

    },
  },
});

registerServiceWorker();

const removeLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MantineProvider>
        <App />
        <Notifications zIndex={1000} position="top-right" />
      </MantineProvider>
    </BrowserRouter>
    {import.meta.env?.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>,
  //</React.StrictMode>
);

removeLoader();
