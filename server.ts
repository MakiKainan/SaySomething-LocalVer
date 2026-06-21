import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/inference', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const resp = await fetch(`${process.env.ML_SERVER_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json(await resp.json());
  } catch (err: any) {
    console.error('Inference error:', err);
    res.status(500).json({ error: 'ML server unreachable. Is ml_server.py running?' });
  }
});

const vite = await import('vite');
const viteServer = await vite.createServer({
  server: { middlewareMode: true },
  appType: 'spa',
});
app.use(viteServer.middlewares);

app.listen(port, () => {
  console.log(`App: http://localhost:${port}`);
  console.log(`ML:  ${process.env.ML_SERVER_URL}`);
});
