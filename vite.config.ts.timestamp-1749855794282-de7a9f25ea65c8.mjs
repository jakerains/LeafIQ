// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "lucide-react", "@radix-ui/react-slot"],
          "vendor-data": ["@supabase/supabase-js", "@tanstack/react-query"],
          // Large components
          "admin-heavy": [
            "./src/views/admin/TerpeneDatabase.tsx",
            "./src/views/admin/components/ImportExportOptions.tsx",
            "./src/views/admin/AdminAIModel.tsx"
          ],
          "auth-heavy": [
            "./src/components/auth/RegisterForm.tsx"
          ],
          "data-heavy": [
            "./src/data/demoData.ts"
          ],
          "ui-heavy": [
            "./src/components/ui/v0-ai-chat.tsx"
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
    // Increase limit temporarily
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIFZlbmRvciBjaHVua3NcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd2ZW5kb3ItdWknOiBbJ2ZyYW1lci1tb3Rpb24nLCAnbHVjaWRlLXJlYWN0JywgJ0ByYWRpeC11aS9yZWFjdC1zbG90J10sXG4gICAgICAgICAgJ3ZlbmRvci1kYXRhJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnLCAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J10sXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gTGFyZ2UgY29tcG9uZW50c1xuICAgICAgICAgICdhZG1pbi1oZWF2eSc6IFtcbiAgICAgICAgICAgICcuL3NyYy92aWV3cy9hZG1pbi9UZXJwZW5lRGF0YWJhc2UudHN4JyxcbiAgICAgICAgICAgICcuL3NyYy92aWV3cy9hZG1pbi9jb21wb25lbnRzL0ltcG9ydEV4cG9ydE9wdGlvbnMudHN4JyxcbiAgICAgICAgICAgICcuL3NyYy92aWV3cy9hZG1pbi9BZG1pbkFJTW9kZWwudHN4J1xuICAgICAgICAgIF0sXG4gICAgICAgICAgJ2F1dGgtaGVhdnknOiBbXG4gICAgICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9hdXRoL1JlZ2lzdGVyRm9ybS50c3gnXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnZGF0YS1oZWF2eSc6IFtcbiAgICAgICAgICAgICcuL3NyYy9kYXRhL2RlbW9EYXRhLnRzJ1xuICAgICAgICAgIF0sXG4gICAgICAgICAgJ3VpLWhlYXZ5JzogW1xuICAgICAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvdWkvdjAtYWktY2hhdC50c3gnXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAgLy8gSW5jcmVhc2UgbGltaXQgdGVtcG9yYXJpbHlcbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDekQsYUFBYSxDQUFDLGlCQUFpQixnQkFBZ0Isc0JBQXNCO0FBQUEsVUFDckUsZUFBZSxDQUFDLHlCQUF5Qix1QkFBdUI7QUFBQTtBQUFBLFVBR2hFLGVBQWU7QUFBQSxZQUNiO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxjQUFjO0FBQUEsWUFDWjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLGNBQWM7QUFBQSxZQUNaO0FBQUEsVUFDRjtBQUFBLFVBQ0EsWUFBWTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLEVBQ3pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
