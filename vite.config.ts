import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/manifest.json', dest: '.' },
        { src: 'public/icon-16.png', dest: '.' },
        { src: 'public/icon-48.png', dest: '.' },
        { src: 'public/icon-128.png', dest: '.' },
        { src: 'public/dobby 1.png', dest: '.' },
        { src: 'public/dobby 2.png', dest: '.' },
        { src: 'public/Logo_black.png', dest: '.' },
        { src: 'public/Sign 1.png', dest: '.' }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
