import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: false
  },
  resolve: {
    alias: [{
      find: "@",
      replacement: path.resolve("./src"), //将'@'映射到'/src'目录}]
    }]
  }
})
