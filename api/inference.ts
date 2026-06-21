export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const resp = await fetch(
      `https://api-inference.huggingface.co/models/${process.env.HF_MODEL_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await resp.json() as any;

    if (Array.isArray(data)) {
      return res.status(200).json(Object.fromEntries(data.map((d: any) => [d.label, d.score])));
    }

    if (data.error && data.estimated_time) {
      return res.status(503).json({ error: `Model loading, retry in ${Math.ceil(data.estimated_time)}s` });
    }

    res.status(500).json({ error: data.error ?? 'Unexpected HF response' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
