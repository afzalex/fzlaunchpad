import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "node:path";
import fs from "node:fs";

// https://vite.dev/config/
// Note: For CORS issues, you can add proxy rules here for development.
// In production, services should enable CORS headers or use a backend proxy.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'disable-spa-fallback',
      enforce: 'pre',
      configureServer(server) {
        const publicDir = server.config.publicDir;
    
        const exists = (p: string) => {
          try { return fs.existsSync(p); } catch { return false; }
        };
    
        return () => {
          server.middlewares.use((req, res, next) => {
            const url = (req.originalUrl ?? "/").split("?")[0];

            if (path.posix.extname(url) && publicDir && !exists(path.join(publicDir, url))) {
              res.statusCode = 404;
              res.setHeader("Content-Type", "text/plain; charset=utf-8");
              res.end("404 Not Found");
              return;
            }
            next();
          })
        }
      },
    }
  ],
})
