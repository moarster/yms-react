import './index.css'

import {DevSupport} from "@react-buddy/ide-toolbox";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import {Toaster} from 'react-hot-toast'
import {BrowserRouter} from 'react-router-dom'

import {ComponentPreviews, useInitial} from "@/dev";

import App from './App'

const queryClient = new QueryClient({

    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,  // 5 minutes
            retry: (failureCount, error: Error & { response?: { status: number } }) => {
                if (error?.response?.status === 401) return false
                return failureCount < 3
            },
        },
        mutations: {
            retry: false,
        },
    },
})



ReactDOM.createRoot(document.getElementById('root')!).render(
   // <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            style: {
                                background: '#22c55e',
                            },
                        },
                        error: {
                            style: {
                                background: '#ef4444',
                            },
                        },
                    }}
                />
            </BrowserRouter>
        </QueryClientProvider>
  //  </React.StrictMode>,
)