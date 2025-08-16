import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        visualizer({
            open: false, // Don't auto-open, use only when needed
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
        })
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    server: {
        port: 3000,
    },

    build: {
        outDir: 'dist',
        sourcemap: false, // Disable in production for smaller builds

        // Optimize chunk size
        chunkSizeWarningLimit: 1000,

        rollupOptions: {
            output: {
                // Manual chunks for better code splitting
                manualChunks: (id) => {
                    // Node modules chunking
                    if (id.includes('node_modules')) {
                        // React ecosystem
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'react-vendor'
                        }

                        // UI libraries
                        if (id.includes('@headlessui') || id.includes('@heroicons')) {
                            return 'ui-icons'
                        }

                        // Form and validation
                        if (id.includes('@rjsf') || id.includes('ajv') || id.includes('react-hook-form')) {
                            return 'forms'
                        }

                        // Data grid
                        if (id.includes('react-data-grid') || id.includes('@tanstack/react-table')) {
                            return 'data-grid'
                        }

                        // State management
                        if (id.includes('zustand') || id.includes('@tanstack/react-query')) {
                            return 'state'
                        }

                        // Material UI
                        if (id.includes('@mui')) {
                            return 'mui'
                        }

                        // Auth
                        if (id.includes('keycloak')) {
                            return 'auth'
                        }

                        // Utilities
                        if (id.includes('date-fns') || id.includes('uuid') || id.includes('clsx')) {
                            return 'utils'
                        }

                        // Remaining vendor
                        return 'vendor'
                    }

                    // Application code chunking
                    if (id.includes('src/')) {
                        // Features modules
                        if (id.includes('features/catalogs')) {
                            return 'feature-catalogs'
                        }
                        if (id.includes('features/documents')) {
                            return 'feature-documents'
                        }

                        // Core modules
                        if (id.includes('core/')) {
                            return 'core'
                        }

                        // Shared components
                        if (id.includes('shared/')) {
                            return 'shared'
                        }
                    }
                },

                // Optimize chunk names
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : ''
                    const name = chunkInfo.name || facadeModuleId || 'chunk'
                    return `chunks/${name}.[hash].js`
                },

                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name?.split('.')
                    const ext = info?.[info.length - 1]
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
                        return `assets/img/[name].[hash][extname]`
                    }
                    if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
                        return `assets/fonts/[name].[hash][extname]`
                    }
                    return `assets/[name].[hash][extname]`
                },
            },

            // Treeshaking optimizations
            treeshake: {
                preset: 'recommended',
                moduleSideEffects: false,
            },
        },

        // Build optimizations
        minify: 'esbuild',
        target: 'es2020',
        cssTarget: 'chrome80',

        // CSS optimizations
        cssCodeSplit: true,
        cssMinify: true,

        // Asset optimizations
        assetsInlineLimit: 4096, // 4kb

        // Report compressed size
        reportCompressedSize: true,
    },

    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'zustand',
        ],
        exclude: ['@vite/client', '@vite/env'],
        // Force pre-bundling of these packages
        force: true,
    },

    // Enable module preload
    experimental: {
        renderBuiltUrl(filename) {
            return '/' + filename
        },
    },
})