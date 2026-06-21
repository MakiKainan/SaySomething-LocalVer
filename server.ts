import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/inference', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Local Flask server (dev) when ML_SERVER_URL is set
    // Production (Vercel) uses api/inference.ts → HF API directly
    const resp = await fetch(`${process.env.ML_SERVER_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json(await resp.json());
  } catch (err: any) {
    console.error('Inference error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static assets or run Vite dev server
const isProd = process.env.NODE_ENV === 'production' || __dirname.includes('dist');

if (isProd) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const vite = await import('vite');
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(viteServer.middlewares);
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
