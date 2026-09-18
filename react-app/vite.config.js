import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Serve api/lead.js during `npm run dev`.
 *
 * On Vercel the api/ directory is deployed as serverless functions and /api/lead
 * just works. The Vite dev server knows nothing about that, so without this the
 * enquiry form is untestable locally — which is exactly the sort of thing that
 * only gets discovered in production. This shims the two Express-shaped helpers
 * (res.status().json()) the handler uses.
 */
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/lead', async (req, res, next) => {
        if (!['POST', 'GET'].includes(req.method)) return next();

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString('utf8');

        try {
          req.body = raw ? JSON.parse(raw) : {};
        } catch {
          req.body = {};
        }

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
          return res;
        };

        try {
          /* Imported per request so edits to the handler are picked up without
             restarting the dev server. */
          const { default: handler } = await server.ssrLoadModule('/api/lead.js');
          await handler(req, res);
        } catch (error) {
          server.config.logger.error(`[dev-api] ${error.stack ?? error.message}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, message: 'Dev API error — see terminal.' }));
        }
      });
    },
  };
}

/**
 * The PHP build served one stylesheet and three scripts with an ?v=<mtime>
 * cache-buster. Vite hashes filenames instead, which is the same idea with a
 * stronger guarantee, so vercel.json can cache /assets/* immutably.
 */
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), devApi()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              /* GSAP is 115 KB of the bundle and nothing above the fold needs
                 it. Splitting it out keeps the first paint — and the call
                 button — independent of the animation code. */
              gsap: ['gsap', 'gsap/ScrollTrigger'],
            },
          },
    },
  },
}));
