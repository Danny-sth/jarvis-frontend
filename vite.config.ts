import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Data fetching and state management
          if (id.includes('node_modules/@tanstack/react-query') || id.includes('node_modules/zustand')) {
            return 'vendor-query';
          }
          // Monaco Editor (large dependency)
          if (id.includes('node_modules/@monaco-editor/react') || id.includes('node_modules/monaco-editor')) {
            return 'vendor-monaco';
          }
          // Charts and visualization
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Markdown rendering
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-gfm')) {
            return 'vendor-markdown';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase from default 500 to 600 KB
  },
})
