import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Asset optimizations
    assetsInlineLimit: 4096, // 4kb
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,

    // CSS optimizations
    cssCodeSplit: true,

    cssMinify: true,

    cssTarget: 'chrome80',
    // Build optimizations
    minify: 'esbuild',
    outDir: 'dist',

    // Report compressed size
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/img/[name].[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
            return `assets/fonts/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },

        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : '';
          const name = chunkInfo.name || facadeModuleId || 'chunk';
          return `chunks/${name}.[hash].js`;
        },

        // Manual chunks for better code splitting
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }

            // Form and validation
            if (id.includes('@rjsf') || id.includes('ajv')) {
              return 'forms';
            }

            // Data grid
            if (id.includes('react-data-grid') || id.includes('@tanstack/react-table')) {
              return 'data-grid';
            }

            // State management
            if (id.includes('zustand') || id.includes('@tanstack/react-query')) {
              return 'state';
            }

            // Material UI
            if (id.includes('mantine')) {
              return 'mantine';
            }

            // Auth
            if (id.includes('keycloak')) {
              return 'auth';
            }

            return 'vendor';
          }

          // Application code chunking
          if (id.includes('src/')) {
            // Features modules
            if (id.includes('features/catalogs')) {
              return 'feature-catalogs';
            }
            if (id.includes('features/documents')) {
              return 'feature-documents';
            }

            // Core modules
            if (id.includes('core/')) {
              return 'core';
            }

            // Shared components
            if (id.includes('shared/')) {
              return 'shared';
            }
          }
        },
      },

      // Treeshaking optimizations
      treeshake: {
        moduleSideEffects: false,
        preset: 'recommended',
      },
    },

    sourcemap: false, // Disable in production for smaller builds

    target: 'es2020',
  },

  // Enable module preload
  experimental: {
    renderBuiltUrl(filename) {
      return '/' + filename;
    },
  },

  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
    // Force pre-bundling of these packages
    force: true,
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand'],
  },

  plugins: [
    tailwindcss(),
    react(),
    visualizer({
      brotliSize: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      open: false,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
  },
});
