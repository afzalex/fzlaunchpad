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
      configureServer(server) {
        const root = server.config.root ?? process.cwd();
        const publicDir = server.config.publicDir;
    
        const exists = (p: string) => {
          try { return fs.existsSync(p); } catch { return false; }
        };
    
        return () => {
          server.middlewares.use((req, res, next) => {
            const url = (req.originalUrl ?? "/").split("?")[0];
    
            // allow vite internals
            if (
              url.startsWith("/@") ||
              url.startsWith("/__vite") ||
              url === "/favicon.ico"
            ) return next();
    
            // allow normal HTML entry
            if (url === "/" || url === "/index.html") return next();
    
            // If it looks like a file request, let Vite handle (or 404 if missing)
            if (path.posix.extname(url)) return next();
    
            // If a matching file exists in root, allow
            const fsPath = path.join(root, url);
            if (exists(fsPath) || exists(fsPath + ".html")) return next();
    
            // If exists in public/, allow
            if (publicDir) {
              const pubPath = path.join(publicDir, url);
              if (exists(pubPath)) return next();
            }
    
            // Otherwise: 404 (no SPA fallback)
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end("404 Not Found");
          })
        }
      },
    }
  ],
})
