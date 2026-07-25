import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve API routes
  app.use('/api', express.static(path.resolve(__dirname, 'api')));

  // SSR for user pages
  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    // Admin routes - serve as CSR (client-side rendering)
    if (url.startsWith('/admin')) {
      const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      const transformed = await vite.transformIndexHtml(url, indexHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      return;
    }

    // User pages - serve as SSR (server-side rendering)
    try {
      const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      const transformed = await vite.transformIndexHtml(url, indexHtml);

      // Load the server entry
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      const appHtml = render(url);

      const html = transformed.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();
