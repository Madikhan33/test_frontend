import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      proxy: {
        '/api/praise': {
          target: 'https://recycling-register-contacted-mirror.trycloudflare.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/praise/, '/praise'),
          headers: {
            'X-API-Key': env.API_KEY || '',
          },
        },
      },
    },
  }
})
