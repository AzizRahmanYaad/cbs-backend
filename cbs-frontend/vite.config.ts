import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: ['.replit.dev', '.repl.co'],
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  }
});
