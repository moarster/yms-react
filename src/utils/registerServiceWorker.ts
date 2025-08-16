export function registerServiceWorker() {
    if ('serviceWorker' in navigator && import.meta.env?.PROD) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration)

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update()
                    }, 60000) // Check every minute

                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing
                        if (!newWorker) return

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content available, prompt user to refresh
                                if (confirm('New version available! Refresh to update?')) {
                                    window.location.reload()
                                }
                            }
                        })
                    })
                })
                .catch((error) => {
                    console.error('SW registration failed:', error)
                })
        })
    }
}

export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister()
            })
            .catch((error) => {
                console.error(error.message)
            })
    }
}