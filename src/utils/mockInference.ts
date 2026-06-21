export async function runInference(text: string, model: string) {
  // Retry once if HF model is cold-starting (503 + estimated_time)
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch('/api/inference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model }),
    });

    if (response.status === 503 && attempt === 0) {
      const { estimated_time } = await response.json().catch(() => ({ estimated_time: 20 }));
      await new Promise(r => setTimeout(r, (estimated_time ?? 20) * 1000));
      continue;
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Inference failed (${response.status})`);
    }

    return response.json();
  }
}
