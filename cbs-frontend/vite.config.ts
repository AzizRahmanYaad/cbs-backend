import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: true
    }
  },
  preview: {
    host: true,
    port: 5000
  }
});
