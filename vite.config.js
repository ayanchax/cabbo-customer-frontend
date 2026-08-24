
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const normalizeBaseUrl = (value) => (value || 'https://app.cabbo.co.in').replace(/\/+$/, '')

const createRobotsTxt = ({ appBaseUrl, isProduction }) => {
  if (!isProduction) {
    return `User-agent: *
Disallow: /

Sitemap: ${appBaseUrl}/sitemap.xml
`
  }

  return `User-agent: *
Allow: /
Disallow: /booking
Disallow: /trips
Disallow: /profile
Disallow: /verify
Disallow: /onboard

Sitemap: ${appBaseUrl}/sitemap.xml
`
}

const createSitemapXml = ({ appBaseUrl }) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appBaseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${appBaseUrl}/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const appBaseUrl = normalizeBaseUrl(env.VITE_APP_BASE_URL)
  const isProduction = mode === 'prod' || env.VITE_DEV_MODE === 'false'

  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'prepare-production-artifacts',
      apply: 'build',
      async closeBundle() {
        const outDir = path.resolve(__dirname, 'dist')
        await Promise.all([
          fs.rm(path.join(outDir, 'docs'), { recursive: true, force: true }),
          fs.rm(path.join(outDir, 'payloads'), { recursive: true, force: true }),
          fs.rm(path.join(outDir, 'favicon.svg'), { force: true }),
          fs.writeFile(
            path.join(outDir, 'robots.txt'),
            createRobotsTxt({ appBaseUrl, isProduction }),
            'utf8',
          ),
          fs.writeFile(
            path.join(outDir, 'sitemap.xml'),
            createSitemapXml({ appBaseUrl }),
            'utf8',
          ),
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
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react-router') || id.includes('@remix-run/router')) {
            return 'vendor-router'
          }

          if (id.includes('@tanstack/')) {
            return 'vendor-query'
          }

          if (id.includes('react-hot-toast') || id.includes('goober')) {
            return 'vendor-toast'
          }

          if (id.includes('react-day-picker') || id.includes('date-fns')) {
            return 'vendor-datetime'
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }

          if (id.includes('axios')) {
            return 'vendor-http'
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('scheduler')
          ) {
            return 'vendor-react'
          }
        },
      },
      checks: {
        pluginTimings: false,
      },
    },
  },
  }
})
