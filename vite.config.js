import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/quiz-app-react/',
  plugins: [react()],
})