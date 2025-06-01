import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', '@radix-ui/react-slot'],
          'vendor-data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Large components
          'admin-heavy': [
            './src/views/admin/TerpeneDatabase.tsx',
            './src/views/admin/components/ImportExportOptions.tsx',
            './src/views/admin/AdminAIModel.tsx'
          ],
          'auth-heavy': [
            './src/components/auth/RegisterForm.tsx'
          ],
          'data-heavy': [
            './src/data/demoData.ts'
          ],
          'ui-heavy': [
            './src/components/ui/v0-ai-chat.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase limit temporarily
  }
});
