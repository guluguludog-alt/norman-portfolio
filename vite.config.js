import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // 🌟 防止 esbuild 将 rgba() 压缩为 8 位 hex 导致透明背景在部分浏览器失效
    cssTarget: 'chrome61' 
  }
})