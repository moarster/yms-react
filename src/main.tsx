import './index.css'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import ReactDOM from 'react-dom/client'
import {Toaster} from 'react-hot-toast'
import {BrowserRouter} from 'react-router-dom'

import {registerServiceWorker} from "@/utils/registerServiceWorker.ts";

import App from './App'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 2 times
            retry: 2,
            // Refetch on window focus only if stale
            refetchOnWindowFocus: 'always',
            // Don't refetch on reconnect automatically
            refetchOnReconnect: 'always'
        },
        mutations: {
            retry: 1,
        },
    },
})

registerServiceWorker()

const removeLoader = () => {
    const loader = document.getElementById('initial-loader')
    if (loader) {
        loader.style.opacity = '0'
        setTimeout(() => loader.remove(), 300)
    }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
     // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
                <App/>
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </BrowserRouter>
        {import.meta.env?.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
      //</React.StrictMode>
)

removeLoader()