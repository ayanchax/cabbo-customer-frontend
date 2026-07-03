
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'remove-non-production-folders',
      apply: 'build',
      async closeBundle() {
        const outDir = path.resolve(__dirname, 'dist')
        await Promise.all([
          fs.rm(path.join(outDir, 'docs'), { recursive: true, force: true }),
          fs.rm(path.join(outDir, 'payloads'), { recursive: true, force: true }),
        ])
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/docs/**', '**/payloads/**'],
    },
  },
})