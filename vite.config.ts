import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Asset optimizations
    assetsInlineLimit: 4096, // 4kb
    chunkSizeWarningLimit: 1000,

    // CSS optimizations
    cssCodeSplit: true,
    cssMinify: true,
    cssTarget: 'chrome80',

    // Build optimizations
    minify: 'esbuild',
    outDir: 'dist',
    reportCompressedSize: true,

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names;
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/img/[name].[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
            return `assets/fonts/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },

        chunkFileNames: 'chunks/[name].[hash].js',
        entryFileNames: '[name].[hash].js',

       /* manualChunks: {
          table: ['@mantine/core', '@mantine/hooks', '@mantine/form', '@mantine/notifications',
            '@mantine/dates', '@mantine/dropzone', '@mantine/modals', '@tabler/icons-react', 'mantine-react-table'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }*/
      },
/*
      // Treeshaking optimizations
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },*/
    },

    sourcemap: false,
    target: 'es2020',
  },

/*
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/form',
      '@mantine/notifications',
      '@mantine/dates',
    ],
  },*/

  plugins: [
    tailwindcss(),
    react(),
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
